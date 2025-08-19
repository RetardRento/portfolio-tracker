import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.type === "transfer") {
      const { data, error } = await supabaseAdmin.from("transfers").insert({
        transaction_hash: body.transactionHash,
        block_number: body.blockNumber,
        from_address: body.from,
        to_address: body.to,
        token_address: body.tokenAddress,
        amount: body.amount,
        amount_formatted: Number.parseFloat(body.amountFormatted),
        is_whale: body.amountFormatted > 50000,
      })

      if (error) {
        console.error("Error inserting transfer:", error)
        return NextResponse.json({ error: "Failed to process transfer" }, { status: 500 })
      }
    }

    if (body.type === "swap") {
      const { data, error } = await supabaseAdmin.from("swaps").insert({
        transaction_hash: body.transactionHash,
        block_number: body.blockNumber,
        dex_name: body.dexName,
        trader_address: body.trader,
        token_in: body.tokenIn,
        token_out: body.tokenOut,
        amount_in: body.amountIn,
        amount_out: body.amountOut,
        amount_in_formatted: Number.parseFloat(body.amountInFormatted),
        amount_out_formatted: Number.parseFloat(body.amountOutFormatted),
        price_impact: body.priceImpact,
      })

      if (error) {
        console.error("Error inserting swap:", error)
        return NextResponse.json({ error: "Failed to process swap" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
