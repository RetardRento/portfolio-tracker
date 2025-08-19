"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProtectedRoute } from "@/components/protected-route"
import { useWallet } from "@/contexts/wallet-context"

interface WhaleTransfer {
  transaction_hash: string
  from_address: string
  to_address: string
  amount_usd: number
  timestamp: string
  symbol: string
  name: string
  whale_label?: string
}

const mockWhaleTransfers: WhaleTransfer[] = [
  {
    transaction_hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
    from_address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    to_address: "0x8ba1f109551bD432803012645Hac136c22C57592",
    amount_usd: 125000,
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    symbol: "QUAI",
    name: "Quai Network",
    whale_label: "Binance Hot Wallet",
  },
  {
    transaction_hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    from_address: "0x853d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    to_address: "0x9cb1f109551bD432803012645Hac136c22C57592",
    amount_usd: 89500,
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    symbol: "WETH",
    name: "Wrapped Ethereum",
    whale_label: "Coinbase Custody",
  },
  {
    transaction_hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
    from_address: "0x964d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    to_address: "0xacb1f109551bD432803012645Hac136c22C57592",
    amount_usd: 67800,
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    symbol: "USDC",
    name: "USD Coin",
  },
  {
    transaction_hash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    from_address: "0xa75d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    to_address: "0xbdb1f109551bD432803012645Hac136c22C57592",
    amount_usd: 45200,
    timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
    symbol: "QUAI",
    name: "Quai Network",
    whale_label: "Kraken Exchange",
  },
  {
    transaction_hash: "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
    from_address: "0xb86d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    to_address: "0xceb1f109551bD432803012645Hac136c22C57592",
    amount_usd: 38900,
    timestamp: new Date(Date.now() - 1500000).toISOString(), // 25 minutes ago
    symbol: "USDT",
    name: "Tether USD",
  },
]

function WhalesPageContent() {
  const [transfers, setTransfers] = useState<WhaleTransfer[]>([])
  const [loading, setLoading] = useState(true)
  const [tokenFilter, setTokenFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const { account } = useWallet()

  const loadMockData = () => {
    setLoading(true)
    setTimeout(() => {
      setTransfers(mockWhaleTransfers)
      setLastUpdated(new Date())
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    loadMockData()
  }, [tokenFilter])

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

  const isUserInvolved = (transfer: WhaleTransfer) => {
    if (!account) return false
    return (
      transfer.from_address.toLowerCase() === account.address.toLowerCase() ||
      transfer.to_address.toLowerCase() === account.address.toLowerCase()
    )
  }

  const filteredTransfers = transfers.filter((transfer) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      transfer.from_address.toLowerCase().includes(query) ||
      transfer.to_address.toLowerCase().includes(query) ||
      transfer.whale_label?.toLowerCase().includes(query) ||
      transfer.symbol.toLowerCase().includes(query)
    )
  })

  const uniqueTokens = Array.from(new Set(transfers.map((t) => t.symbol)))
  const userInvolvedCount = filteredTransfers.filter(isUserInvolved).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">🐋 Real-Time Whale Movements</h1>
            <p className="text-muted-foreground">
              Monitor large transfers over $10,000 across all tokens
              {account && userInvolvedCount > 0 && (
                <span className="ml-2 text-primary">• {userInvolvedCount} involving your wallet</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
            <Button variant="outline" size="sm" onClick={loadMockData}>
              🔄 Refresh
            </Button>
          </div>
        </div>

        {/* Summary Stats Card */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass-card hover-lift">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{filteredTransfers.length}</div>
              <div className="text-sm text-muted-foreground">Total Transfers</div>
            </CardContent>
          </Card>
          <Card className="glass-card hover-lift">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-accent">
                {formatCurrency(filteredTransfers.reduce((sum, t) => sum + t.amount_usd, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </CardContent>
          </Card>
          <Card className="glass-card hover-lift">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{uniqueTokens.length}</div>
              <div className="text-sm text-muted-foreground">Unique Tokens</div>
            </CardContent>
          </Card>
          <Card className="glass-card hover-lift">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{userInvolvedCount}</div>
              <div className="text-sm text-muted-foreground">Your Involvement</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Placeholder */}
        {transfers.length > 0 && (
          <Card className="glass-card hover-lift">
            <CardHeader>
              <CardTitle>Whale Activity Chart</CardTitle>
              <CardDescription>
                {account
                  ? `Tracking whale movements and highlighting your wallet activity`
                  : `Real-time whale movement visualization`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center border border-primary/10">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📊</span>
                  <p className="text-muted-foreground">Interactive whale activity chart will be displayed here</p>
                  {account && <p className="text-sm text-primary mt-1">Your wallet activity will be highlighted</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">🔍</span>
                  <Input
                    placeholder="Search by address, label, or token..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={tokenFilter} onValueChange={setTokenFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tokens</SelectItem>
                  {uniqueTokens.map((token) => (
                    <SelectItem key={token} value={token}>
                      {token}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transfers Table */}
        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle>Whale Transfers</CardTitle>
            <CardDescription>{filteredTransfers.length} large transfers found</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Token</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Transaction</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransfers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No whale transfers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransfers.map((transfer) => (
                        <TableRow
                          key={transfer.transaction_hash}
                          className={`hover:bg-muted/50 ${
                            isUserInvolved(transfer) ? "bg-primary/5 border-l-4 border-l-primary" : ""
                          }`}
                        >
                          <TableCell>
                            <div className="font-medium text-primary">{formatCurrency(transfer.amount_usd)}</div>
                            {isUserInvolved(transfer) && (
                              <Badge variant="secondary" className="text-xs mt-1 bg-primary/20 text-primary">
                                Your Wallet
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{transfer.symbol}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div
                                className={`font-mono text-sm ${
                                  account && transfer.from_address.toLowerCase() === account.address.toLowerCase()
                                    ? "text-primary font-semibold"
                                    : ""
                                }`}
                              >
                                {formatAddress(transfer.from_address)}
                              </div>
                              {transfer.whale_label && (
                                <Badge variant="outline" className="text-xs">
                                  {transfer.whale_label}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`font-mono text-sm ${
                                account && transfer.to_address.toLowerCase() === account.address.toLowerCase()
                                  ? "text-primary font-semibold"
                                  : ""
                              }`}
                            >
                              {formatAddress(transfer.to_address)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">{formatTime(transfer.timestamp)}</div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={`https://explorer.quai.network/tx/${transfer.transaction_hash}`}
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function WhalesPage() {
  return (
    <ProtectedRoute>
      <WhalesPageContent />
    </ProtectedRoute>
  )
}
