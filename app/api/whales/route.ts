import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabaseAdmin
      .from("transfers")
      .select(`
        *,
        tokens!inner(name, symbol)
      `)
      .eq("is_whale", true)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (token && token !== "all") {
      query = query.eq("token_address", token)
    }

    const { data: transfers, error } = await query

    if (error) {
      console.error("Error fetching whale transfers:", error)
      return NextResponse.json({ error: "Failed to fetch whale transfers" }, { status: 500 })
    }

    const formattedTransfers =
      transfers?.map((transfer) => ({
        id: transfer.id,
        transactionHash: transfer.transaction_hash,
        blockNumber: transfer.block_number,
        from: transfer.from_address,
        to: transfer.to_address,
        tokenAddress: transfer.token_address,
        tokenName: transfer.tokens.name,
        tokenSymbol: transfer.tokens.symbol,
        amount: transfer.amount_formatted,
        timestamp: transfer.timestamp,
        isWhale: transfer.is_whale,
      })) || []

    return NextResponse.json({ transfers: formattedTransfers })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
