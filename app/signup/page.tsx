"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: "📊",
    title: "Real-time Analytics",
    description: "Track whale movements and DEX activity across Quai Network",
  },
  {
    icon: "🔔",
    title: "Smart Alerts",
    description: "Get notified of significant market movements and opportunities",
  },
  {
    icon: "🐋",
    title: "Whale Tracking",
    description: "Monitor large transfers and identify market-moving transactions",
  },
  {
    icon: "📈",
    title: "Portfolio Insights",
    description: "Comprehensive analysis of your Web3 financial activities",
  },
]

export default function SignupPage() {
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Features */}
          <div className={cn("space-y-8", mounted && "animate-slide-up")}>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="relative">
                  <span className="text-4xl">⚡</span>
                  <div className="absolute -inset-2 bg-primary/20 rounded-full blur animate-pulse" />
                </div>
                <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Quai Analytics
                </h1>
              </div>
              <h2 className="text-4xl font-heading font-bold">Empowering Your Financial Decisions in the Web3 Space</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of traders and investors using advanced analytics to navigate the Quai Network ecosystem.
              </p>
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-4 rounded-xl glass-card hover-lift group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl transition-transform duration-300 group-hover:scale-110">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Signup */}
          <div className={cn("space-y-8", mounted && "animate-fade-in")}>
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-heading font-bold">Get Started Today</h3>
              <p className="text-muted-foreground">Connect your wallet to begin your Web3 analytics journey</p>
            </div>

            <Card className="glass-card hover-lift">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <span className="text-xl">🚀</span>
                  Create Your Account
                </CardTitle>
                <CardDescription>Choose your preferred wallet to get started with Quai Analytics</CardDescription>
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
                    <span className="text-sm text-muted-foreground">Setting up your account...</span>
                  </div>
                )}

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    By connecting your wallet, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:text-accent transition-colors duration-200">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:text-accent transition-colors duration-200">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-accent transition-colors duration-200">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
