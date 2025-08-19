"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { isConnected, isConnecting, account, walletType, error, connectPelagus, connectMetaMask, clearError } =
    useWallet()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isConnected && account) {
      router.push("/")
    }
  }, [isConnected, account, router])

  const handleWalletConnect = async (type: "pelagus" | "metamask") => {
    clearError()
    if (type === "pelagus") {
      await connectPelagus()
    } else {
      await connectMetaMask()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className={cn("text-center space-y-4", mounted && "animate-fade-in")}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="relative">
              <span className="text-4xl">⚡</span>
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur animate-pulse" />
            </div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quai Analytics
            </h1>
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">Connect your wallet to access your crypto insights</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className={cn("glass-card hover-lift", mounted && "animate-scale-in")}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <span className="text-xl">🔗</span>
              Connect Wallet
            </CardTitle>
            <CardDescription>Choose your preferred wallet to sign in to Quai Network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="ghost" size="sm" onClick={clearError} className="mt-2 h-auto p-0 text-xs">
                  Dismiss
                </Button>
              </div>
            )}

            {/* Pelagus Wallet Option */}
            <Button
              onClick={() => handleWalletConnect("pelagus")}
              disabled={isConnecting}
              className="w-full justify-start gap-4 h-auto p-4 hover-lift bg-transparent group"
              variant="outline"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <span className="text-3xl transition-transform duration-300 group-hover:scale-110">⚡</span>
                  <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-base">Pelagus Wallet</div>
                  <div className="text-sm text-muted-foreground">Official Quai Network wallet</div>
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  Recommended
                </Badge>
              </div>
            </Button>

            {/* MetaMask Option */}
            <Button
              onClick={() => handleWalletConnect("metamask")}
              disabled={isConnecting}
              className="w-full justify-start gap-4 h-auto p-4 hover-lift bg-transparent group"
              variant="outline"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">🦊</span>
                <div className="text-left flex-1">
                  <div className="font-semibold text-base">MetaMask</div>
                  <div className="text-sm text-muted-foreground">With Quai Snap integration</div>
                </div>
              </div>
            </Button>

            {isConnecting && (
              <div className="flex items-center justify-center gap-2 p-4 animate-fade-in">
                <span className="animate-spin text-xl">⚡</span>
                <span className="text-sm text-muted-foreground">Connecting to wallet...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className={cn("text-center space-y-4", mounted && "animate-fade-in")}>
          <p className="text-sm text-muted-foreground">
            New to Quai Network?{" "}
            <Link href="/signup" className="text-primary hover:text-accent transition-colors duration-200">
              Get started here
            </Link>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
