"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { cn } from "@/lib/utils"

interface WalletConnectButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function WalletConnectButton({ className, variant = "default", size = "default" }: WalletConnectButtonProps) {
  const {
    isConnected,
    isConnecting,
    account,
    walletType,
    error,
    connectPelagus,
    connectMetaMask,
    disconnect,
    clearError,
  } = useWallet()
  const [showWalletOptions, setShowWalletOptions] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance: string) => {
    return `${Number.parseFloat(balance).toFixed(4)} QUAI`
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2">
        <Card className="glass-card">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                <Badge variant="secondary" className="text-xs">
                  {walletType === "pelagus" ? "Pelagus" : "MetaMask"}
                </Badge>
              </div>
              <div className="text-sm">
                <div className="font-mono font-medium">{formatAddress(account.address)}</div>
                {account.balance && (
                  <div className="text-xs text-muted-foreground">{formatBalance(account.balance)}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Button variant="outline" size="sm" onClick={disconnect} className="hover-lift bg-transparent">
          Disconnect
        </Button>
      </div>
    )
  }

  if (showWalletOptions) {
    return (
      <Card className="glass-card w-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🔗</span>
            Connect Wallet
          </CardTitle>
          <CardDescription>Choose your preferred wallet to connect to Quai Network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="ghost" size="sm" onClick={clearError} className="mt-2 h-auto p-0 text-xs">
                Dismiss
              </Button>
            </div>
          )}

          <Button
            onClick={connectPelagus}
            disabled={isConnecting}
            className="w-full justify-start gap-3 h-auto p-4 hover-lift bg-transparent"
            variant="outline"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div className="text-left">
                <div className="font-semibold">Pelagus Wallet</div>
                <div className="text-xs text-muted-foreground">Official Quai Network wallet</div>
              </div>
            </div>
            <Badge variant="secondary" className="ml-auto">
              Recommended
            </Badge>
          </Button>

          <Button
            onClick={connectMetaMask}
            disabled={isConnecting}
            className="w-full justify-start gap-3 h-auto p-4 hover-lift bg-transparent"
            variant="outline"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦊</span>
              <div className="text-left">
                <div className="font-semibold">MetaMask</div>
                <div className="text-xs text-muted-foreground">With Quai Snap integration</div>
              </div>
            </div>
          </Button>

          <Button variant="ghost" size="sm" onClick={() => setShowWalletOptions(false)} className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Button
      onClick={() => setShowWalletOptions(true)}
      disabled={isConnecting}
      className={cn("hover-lift", className)}
      variant={variant}
      size={size}
    >
      {isConnecting ? (
        <>
          <span className="animate-spin mr-2">⚡</span>
          Connecting...
        </>
      ) : (
        <>
          <span className="mr-2">🔗</span>
          Connect Wallet
        </>
      )}
    </Button>
  )
}
