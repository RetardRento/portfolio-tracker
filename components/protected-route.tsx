"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isConnected, isConnecting } = useWallet()
  const [mounted, setMounted] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="animate-spin text-2xl">⚡</span>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    )
  }

  // Show connecting state
  if (isConnecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="animate-spin text-2xl">⚡</span>
          <span className="text-muted-foreground">Connecting to wallet...</span>
        </div>
      </div>
    )
  }

  if (!isConnected && !demoMode) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="glass-card hover-lift w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Connect your wallet or try the demo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Connect your Pelagus or MetaMask wallet, or explore the demo
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1 hover-lift">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 hover-lift bg-transparent">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
            <Button
              onClick={() => setDemoMode(true)}
              variant="ghost"
              className="w-full hover-lift text-cyan-400 hover:text-cyan-300"
            >
              🚀 Try Demo Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
