import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const { data: tokenActivity, error } = await supabaseAdmin.rpc("get_top_tokens", {
      limit_count: limit,
    })

    if (error) {
      console.error("Error fetching top tokens:", error)
      const { data: tokens, error: tokenError } = await supabaseAdmin.from("tokens").select("*").limit(limit)

      if (tokenError) {
        return NextResponse.json({ error: "Failed to fetch tokens" }, { status: 500 })
      }

      const mockTokens =
        tokens?.map((token, index) => ({
          address: token.address,
          name: token.name,
          symbol: token.symbol,
          volume24h: Math.random() * 1000000,
          transactions24h: Math.floor(Math.random() * 1000),
          holders: Math.floor(Math.random() * 10000),
          priceChange24h: (Math.random() - 0.5) * 20,
        })) || []

      return NextResponse.json({ tokens: mockTokens })
    }

    return NextResponse.json({ tokens: tokenActivity })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
