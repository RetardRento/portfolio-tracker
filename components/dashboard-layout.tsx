"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// Added wallet context and connect button imports for session management
import { useWallet } from "@/contexts/wallet-context"
import { OnboardingModal } from "@/components/onboarding-modal"
import { useUser } from "@/hooks/use-user"

const navigation = [
  { name: "Overview", href: "/", icon: "📊" },
  { name: "Whales", href: "/whales", icon: "🐋" },
  { name: "DEX Trading", href: "/dex", icon: "📈" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { user, isNewUser, loading, completeOnboarding } = useUser()
  // Added wallet context for session management
  const { isConnected, account, walletType, isDemoMode, disconnect } = useWallet()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Added function to format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getGreeting = () => {
    if (!user) return "Welcome"

    const hour = new Date().getHours()
    let timeGreeting = "Hello"

    if (hour < 12) timeGreeting = "Good morning"
    else if (hour < 18) timeGreeting = "Good afternoon"
    else timeGreeting = "Good evening"

    const isReturning = user.visitCount > 1
    return isReturning ? `Welcome back, ${user.name}` : `${timeGreeting}, ${user.name}`
  }

  // Don't render anything while loading user data
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <OnboardingModal isOpen={isNewUser} onComplete={completeOnboarding} />

      <div className="min-h-screen bg-background">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-border/50 transform transition-all duration-300 ease-out lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            mounted && "animate-slide-up",
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-border/50">
              <div className="flex items-center gap-2 animate-scale-in">
                <div className="relative">
                  <span className="text-2xl">⚡</span>
                  <div className="absolute -inset-1 bg-primary/20 rounded-full blur animate-pulse" />
                </div>
                <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Quai Analytics
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-accent/10 transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                ✕
              </Button>
            </div>

            {user && (
              <div className="px-4 py-3 border-b border-border/50">
                <div className="text-sm font-medium text-foreground">{getGreeting()}</div>
                <div className="text-xs text-muted-foreground">
                  {user.visitCount > 1 ? `Visit #${user.visitCount}` : "First time here"}
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "nav-item flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group",
                      isActive
                        ? "active bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:shadow-sm",
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                    <span className="transition-all duration-300">{item.name}</span>
                    {isActive && <div className="ml-auto h-2 w-2 bg-primary rounded-full animate-pulse" />}
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-border/50 space-y-3">
              {isConnected && account ? (
                <Card className="glass-card p-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-primary">
                        {isDemoMode ? "Demo Mode" : "Connected to Quai Network"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-mono">{formatAddress(account.address)}</div>
                      <div className="text-xs text-muted-foreground">
                        {isDemoMode ? "Sample Data" : walletType === "pelagus" ? "Pelagus Wallet" : "MetaMask"}
                      </div>
                      {account.balance && (
                        <div className="text-xs text-muted-foreground">
                          {Number.parseFloat(account.balance).toFixed(4)} QUAI
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={disconnect}
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                    >
                      {isDemoMode ? "Exit Demo" : "Disconnect"}
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="glass-card p-3 hover-lift">
                  <div className="flex items-center gap-2">
                    <div className="pulse-dot h-2 w-2 bg-muted rounded-full" />
                    <span className="text-xs text-muted-foreground">Not Connected</span>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 glass-card px-6">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-accent/10 transition-all duration-200 hover:scale-105"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </Button>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 px-3 py-1 rounded-full border border-primary/20">
                  <div className="pulse-dot h-2 w-2 bg-primary rounded-full" />
                  <span>Live Data</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 px-3 py-1 rounded-full border border-border/50">
                  <div className="h-2 w-2 bg-muted-foreground rounded-full" />
                  <span>Offline</span>
                </div>
              )}
            </div>
          </div>

          {/* Page content */}
          <main className={cn("p-6", mounted && "animate-fade-in")}>{children}</main>
        </div>
      </div>
    </>
  )
}
