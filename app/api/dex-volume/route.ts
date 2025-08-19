import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "24h"

    let timeRange = "24 hours"
    if (period === "7d") timeRange = "7 days"
    if (period === "30d") timeRange = "30 days"

    const { data: swaps, error } = await supabaseAdmin
      .from("swaps")
      .select(`
        *,
        token_in_data:tokens!swaps_token_in_fkey(name, symbol),
        token_out_data:tokens!swaps_token_out_fkey(name, symbol)
      `)
      .gte("timestamp", `now() - interval '${timeRange}'`)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("Error fetching DEX volume:", error)
      return NextResponse.json({ error: "Failed to fetch DEX volume" }, { status: 500 })
    }

    const totalVolume =
      swaps?.reduce((sum, swap) => sum + Number.parseFloat(swap.amount_in_formatted.toString()), 0) || 0
    const uniqueTraders = new Set(swaps?.map((swap) => swap.trader_address)).size
    const totalSwaps = swaps?.length || 0

    const formattedSwaps =
      swaps?.map((swap) => ({
        id: swap.id,
        transactionHash: swap.transaction_hash,
        blockNumber: swap.block_number,
        dexName: swap.dex_name,
        trader: swap.trader_address,
        tokenIn: {
          address: swap.token_in,
          name: swap.token_in_data?.name || "Unknown",
          symbol: swap.token_in_data?.symbol || "UNK",
        },
        tokenOut: {
          address: swap.token_out,
          name: swap.token_out_data?.name || "Unknown",
          symbol: swap.token_out_data?.symbol || "UNK",
        },
        amountIn: swap.amount_in_formatted,
        amountOut: swap.amount_out_formatted,
        priceImpact: swap.price_impact,
        timestamp: swap.timestamp,
      })) || []

    return NextResponse.json({
      volume: totalVolume,
      traders: uniqueTraders,
      swaps: totalSwaps,
      transactions: formattedSwaps,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
