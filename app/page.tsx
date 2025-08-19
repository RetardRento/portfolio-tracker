"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
// Added protected route and wallet context for auth integration
import { ProtectedRoute } from "@/components/protected-route"
import { useWallet } from "@/contexts/wallet-context"
import { useSession } from "@/hooks/use-session"

const mockOverviewData = {
  totalVolume: 2847392,
  biggestWhaleMove: {
    amount_usd: 125000,
    from_address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    to_address: "0x8ba1f109551bD432803012645Hac189451b934",
    symbol: "QUAI",
    label: "Exchange Wallet",
  },
  activeTraders: 1247,
  totalTransactions: 8934,
}

const mockTopTokens = [
  {
    symbol: "QUAI",
    name: "Quai Network",
    total_volume_usd: 1847392,
    price_usd: 0.045,
    transfer_count: 2847,
    swap_count: 1293,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    total_volume_usd: 892847,
    price_usd: 2847.32,
    transfer_count: 847,
    swap_count: 392,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    total_volume_usd: 647382,
    price_usd: 1.0,
    transfer_count: 1847,
    swap_count: 293,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    total_volume_usd: 384729,
    price_usd: 0.999,
    transfer_count: 647,
    swap_count: 184,
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    total_volume_usd: 247382,
    price_usd: 8.47,
    transfer_count: 384,
    swap_count: 129,
  },
]

function OverviewPageContent() {
  const [mounted, setMounted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  // Added wallet and session context for personalized experience
  const { account, walletType } = useWallet()
  const { sessionData, getSessionDuration } = useSession()
  const overviewData = mockOverviewData
  const topTokens = mockTopTokens
  const lastUpdated = new Date()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

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

  // Added function to format session duration
  const formatSessionDuration = (duration: number) => {
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className={cn("flex items-center justify-between", mounted && "animate-slide-up")}>
          <div>
            <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {/* Personalized greeting based on wallet connection */}
              {account ? `Welcome back, ${formatAddress(account.address)}` : "Your Crypto Insights"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {/* Dynamic subtitle based on session state */}
              {sessionData
                ? `Connected via ${walletType === "pelagus" ? "Pelagus" : "MetaMask"} • Session: ${formatSessionDuration(getSessionDuration())}`
                : "Empowering Your Financial Decisions in the Web3 Space"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="hover-lift transition-all duration-300 hover:border-primary/50 bg-transparent"
            >
              <span className={cn("mr-2", isRefreshing && "animate-spin")}>🔄</span>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Added personalized wallet info card for connected users */}
        {account && (
          <Card
            className={cn(
              "glass-card border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 hover-lift",
              mounted && "animate-fade-in",
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">👤</span>
                Your Wallet Overview
              </CardTitle>
              <CardDescription>Connected wallet information and session details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Wallet Address</div>
                  <div className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                    {formatAddress(account.address)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Wallet Type</div>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {walletType === "pelagus" ? "Pelagus Wallet" : "MetaMask"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Balance</div>
                  <div className="font-semibold">
                    {account.balance ? `${Number.parseFloat(account.balance).toFixed(4)} QUAI` : "Loading..."}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-4", mounted && "animate-fade-in")}>
          <Card className="metric-card glass-card hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{formatCurrency(overviewData.totalVolume)}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all tokens and DEXes</p>
            </CardContent>
          </Card>

          <Card className="metric-card glass-card hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overviewData.activeTraders.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Unique addresses trading</p>
            </CardContent>
          </Card>

          <Card className="metric-card glass-card hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">⚡</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overviewData.totalTransactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Transfers + swaps today</p>
            </CardContent>
          </Card>

          <Card className="metric-card glass-card hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🐋</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {formatCurrency(overviewData.biggestWhaleMove.amount_usd)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{overviewData.biggestWhaleMove.symbol}</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Trends Chart */}
        <Card className={cn("glass-card hover-lift", mounted && "animate-scale-in")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              Market Trends
            </CardTitle>
            <CardDescription>Real-time blockchain metrics and performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent loading-shimmer" />
              <div className="text-center z-10">
                <span className="text-6xl mb-4 block animate-pulse">📊</span>
                <p className="text-muted-foreground font-medium">Interactive charts will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">Volume, transactions, and whale activity trends</p>
                <Button variant="outline" className="mt-4 hover-lift bg-transparent">
                  Explore Your Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Whale Alert */}
        <Card
          className={cn(
            "glass-card border-accent/30 bg-gradient-to-r from-accent/10 to-primary/5 hover-lift",
            mounted && "animate-fade-in",
          )}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl animate-pulse">🐋</span>
              Recent Whale Activity
            </CardTitle>
            <CardDescription>Largest transfer in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {formatCurrency(overviewData.biggestWhaleMove.amount_usd)} {overviewData.biggestWhaleMove.symbol}
                  </Badge>
                  <Badge variant="outline" className="border-accent/30">
                    {overviewData.biggestWhaleMove.label}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  From {formatAddress(overviewData.biggestWhaleMove.from_address)} →{" "}
                  {formatAddress(overviewData.biggestWhaleMove.to_address)}
                </div>
              </div>
              <span className="text-2xl animate-bounce">↗️</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Tokens */}
        <Card className={cn("glass-card hover-lift", mounted && "animate-slide-up")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              Top Tokens by Volume
            </CardTitle>
            <CardDescription>Most active tokens in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTokens.map((token, index) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 glass-card hover-lift group transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold border border-primary/20">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">{formatCurrency(token.total_volume_usd)}</div>
                    <div className="text-sm text-muted-foreground">
                      {token.transfer_count + token.swap_count} transactions
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function OverviewPage() {
  return (
    <ProtectedRoute>
      <OverviewPageContent />
    </ProtectedRoute>
  )
}
