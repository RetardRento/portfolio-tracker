"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProtectedRoute } from "@/components/protected-route"
import { useWallet } from "@/contexts/wallet-context"

interface DEXVolumeData {
  summary: Array<{
    dex_name: string
    swap_count: number
    total_volume_usd: number
    avg_swap_size: number
  }>
  hourly: Array<{
    hour: string
    volume_usd: number
    swap_count: number
  }>
}

interface DEXSwap {
  transaction_hash: string
  dex_name: string
  trader_address: string
  token_in_symbol: string
  token_out_symbol: string
  amount_usd: number
  timestamp: string
}

function DEXPageContent() {
  const [volumeData, setVolumeData] = useState<DEXVolumeData | null>(null)
  const [recentSwaps, setRecentSwaps] = useState<DEXSwap[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDEX, setSelectedDEX] = useState<string>("All DEXes")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const { account } = useWallet()

  const fetchData = async () => {
    try {
      const mockSummaryData = [
        {
          dex_name: "QuaiSwap",
          swap_count: 1247,
          total_volume_usd: 2847392,
          avg_swap_size: 2284.5,
        },
        {
          dex_name: "QuaiDEX",
          swap_count: 892,
          total_volume_usd: 1847293,
          avg_swap_size: 2070.8,
        },
        {
          dex_name: "UniQuai",
          swap_count: 634,
          total_volume_usd: 1247583,
          avg_swap_size: 1967.2,
        },
      ]

      const mockHourlyData = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString()
        return {
          hour,
          volume_usd: Math.random() * 100000 + 10000,
          swap_count: Math.floor(Math.random() * 50) + 5,
        }
      })

      const mockSwaps: DEXSwap[] = [
        {
          transaction_hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          dex_name: "QuaiSwap",
          trader_address: account?.address || "0xabcdef1234567890abcdef1234567890abcdef12",
          token_in_symbol: "QUAI",
          token_out_symbol: "WETH",
          amount_usd: 5420.5,
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        },
        {
          transaction_hash: "0x2345678901bcdef01234567890bcdef01234567890bcdef01234567890bcdef0",
          dex_name: "QuaiDEX",
          trader_address: "0xbcdef01234567890bcdef01234567890bcdef012",
          token_in_symbol: "USDC",
          token_out_symbol: "QUAI",
          amount_usd: 2150.75,
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        },
        {
          transaction_hash: "0x3456789012cdef013456789012cdef013456789012cdef013456789012cdef01",
          dex_name: "UniQuai",
          trader_address: "0xcdef012345678901cdef012345678901cdef0123",
          token_in_symbol: "WETH",
          token_out_symbol: "USDC",
          amount_usd: 8750.25,
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        },
      ]

      setVolumeData({ summary: mockSummaryData, hourly: mockHourlyData })
      setRecentSwaps(mockSwaps)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch DEX data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedDEX, account])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const isUserInvolved = (swap: DEXSwap) => {
    if (!account) return false
    return swap.trader_address.toLowerCase() === account.address.toLowerCase()
  }

  const totalVolume = volumeData?.summary.reduce((sum, dex) => sum + dex.total_volume_usd, 0) || 0
  const totalSwaps = volumeData?.summary.reduce((sum, dex) => sum + dex.swap_count, 0) || 0
  const avgSwapSize = totalSwaps > 0 ? totalVolume / totalSwaps : 0
  const userSwapsCount = recentSwaps.filter(isUserInvolved).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Visualize Trends: DEX Trading Data
            </h1>
            <p className="text-muted-foreground">
              24-hour trading volume and swap activity across decentralized exchanges
              {account && userSwapsCount > 0 && (
                <span className="ml-2 text-primary">• {userSwapsCount} of your swaps shown</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
            <Button variant="outline" size="sm" onClick={fetchData} className="hover-lift bg-transparent">
              <span className="mr-2">🔄</span>
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="glass-card hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalVolume)}</div>
              <p className="text-xs text-muted-foreground">Across all DEXes</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Swaps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSwaps.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Completed transactions</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Swap Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(avgSwapSize)}</div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{userSwapsCount}</div>
              <p className="text-xs text-muted-foreground">Your swaps today</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Placeholder */}
        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle>24h Volume Chart</CardTitle>
            <CardDescription>
              {account
                ? `Hourly trading volume with your activity highlighted`
                : `Real-time trading volume across all DEXes`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent loading-shimmer" />
              <div className="text-center z-10">
                <span className="text-6xl mb-4 block animate-pulse">📊</span>
                <p className="text-muted-foreground font-medium">Interactive volume charts will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">Hourly breakdown with DEX comparison</p>
                {account && <p className="text-sm text-primary mt-1">Your trading activity will be highlighted</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DEX Performance */}
        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle>DEX Performance</CardTitle>
            <CardDescription>Trading volume breakdown by decentralized exchange</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {volumeData?.summary.map((dex, index) => (
                  <div
                    key={dex.dex_name}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 glass-card hover-lift group transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold text-sm border border-primary/20">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{dex.dex_name}</div>
                        <div className="text-sm text-muted-foreground">{dex.swap_count} swaps</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(dex.total_volume_usd)}</div>
                      <div className="text-sm text-muted-foreground">Avg: {formatCurrency(dex.avg_swap_size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Swaps */}
        <Card className="glass-card hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Large Swaps</CardTitle>
                <CardDescription>Latest high-value trading activity</CardDescription>
              </div>
              <Select value={selectedDEX} onValueChange={setSelectedDEX}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by DEX" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All DEXes">All DEXes</SelectItem>
                  {volumeData?.summary.map((dex) => (
                    <SelectItem key={dex.dex_name} value={dex.dex_name}>
                      {dex.dex_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DEX</TableHead>
                    <TableHead>Swap</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Trader</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSwaps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No recent swaps found
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentSwaps.map((swap) => (
                      <TableRow
                        key={swap.transaction_hash}
                        className={`hover:bg-muted/50 ${
                          isUserInvolved(swap) ? "bg-primary/5 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <TableCell>
                          <Badge variant="secondary">{swap.dex_name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{swap.token_in_symbol}</Badge>
                            <span className="text-muted-foreground">→</span>
                            <Badge variant="outline">{swap.token_out_symbol}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-primary">{formatCurrency(swap.amount_usd)}</div>
                          {isUserInvolved(swap) && (
                            <Badge variant="secondary" className="text-xs mt-1 bg-primary/20 text-primary">
                              Your Swap
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`font-mono text-sm ${isUserInvolved(swap) ? "text-primary font-semibold" : ""}`}
                          >
                            {formatAddress(swap.trader_address)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{formatTime(swap.timestamp)}</div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={`https://explorer.quai.network/tx/${swap.transaction_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              🔗
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function DEXPage() {
  return (
    <ProtectedRoute>
      <DEXPageContent />
    </ProtectedRoute>
  )
}
