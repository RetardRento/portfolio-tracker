"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProtectedRoute } from "@/components/protected-route"
import { useWallet } from "@/contexts/wallet-context"
import { useSession } from "@/hooks/use-session"

interface WatchedWallet {
  id: number
  wallet_address: string
  label: string
  threshold_usd: number
  is_active: boolean
}

function SettingsPageContent() {
  const { account, walletType, disconnect } = useWallet()
  const { sessionData, getSessionDuration, getLastActivityTime } = useSession()

  const [watchedWallets, setWatchedWallets] = useState<WatchedWallet[]>([
    {
      id: 1,
      wallet_address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      label: "Vitalik Buterin",
      threshold_usd: 50000,
      is_active: true,
    },
    {
      id: 2,
      wallet_address: "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503",
      label: "Binance Hot Wallet",
      threshold_usd: 100000,
      is_active: true,
    },
  ])

  const [newWallet, setNewWallet] = useState({
    address: "",
    label: "",
    threshold: "10000",
  })

  const [alertSettings, setAlertSettings] = useState({
    discordWebhook: "",
    emailNotifications: true,
    whaleThreshold: "10000",
    dexThreshold: "5000",
  })

  const handleAddWallet = () => {
    if (!newWallet.address || !newWallet.label) {
      alert("Please fill in all required fields")
      return
    }

    if (!newWallet.address.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert("Please enter a valid Ethereum address")
      return
    }

    const wallet: WatchedWallet = {
      id: Date.now(),
      wallet_address: newWallet.address,
      label: newWallet.label,
      threshold_usd: Number.parseFloat(newWallet.threshold),
      is_active: true,
    }

    setWatchedWallets([...watchedWallets, wallet])
    setNewWallet({ address: "", label: "", threshold: "10000" })
    alert("Wallet added to watchlist")
  }

  const handleRemoveWallet = (id: number) => {
    setWatchedWallets(watchedWallets.filter((w) => w.id !== id))
    alert("Wallet removed from watchlist")
  }

  const handleToggleWallet = (id: number) => {
    setWatchedWallets(watchedWallets.map((w) => (w.id === id ? { ...w, is_active: !w.is_active } : w)))
  }

  const handleSaveSettings = () => {
    alert("Settings saved successfully")
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            Dashboard Settings
          </h1>
          <p className="text-muted-foreground">Configure whale watchlist and alert preferences</p>
        </div>

        {account && (
          <Card className="glass-card border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">👤</span>
                Wallet & Session Information
              </CardTitle>
              <CardDescription>Your connected wallet details and current session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Connected Wallet</Label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                      <div className="font-mono text-sm">{formatAddress(account.address)}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                          {walletType === "pelagus" ? "Pelagus Wallet" : "MetaMask"}
                        </Badge>
                        {account.balance && (
                          <Badge variant="outline">{Number.parseFloat(account.balance).toFixed(4)} QUAI</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={disconnect} className="w-full">
                    <span className="mr-2">🔓</span>
                    Disconnect Wallet
                  </Button>
                </div>

                {sessionData && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Session Details</Label>
                      <div className="mt-1 p-3 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Session Duration:</span>
                          <span className="font-medium">{formatDuration(getSessionDuration())}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Activity:</span>
                          <span className="font-medium">
                            {getLastActivityTime()?.toLocaleTimeString() || "Unknown"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Connected Since:</span>
                          <span className="font-medium">{new Date(sessionData.connectedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Wallet */}
        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">➕</span>
              Add Wallet to Watchlist
            </CardTitle>
            <CardDescription>Monitor specific wallets for large transfers and unusual activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="wallet-address">Wallet Address *</Label>
                <Input
                  id="wallet-address"
                  placeholder="0x..."
                  value={newWallet.address}
                  onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet-label">Label *</Label>
                <Input
                  id="wallet-label"
                  placeholder="e.g., Binance Hot Wallet"
                  value={newWallet.label}
                  onChange={(e) => setNewWallet({ ...newWallet, label: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Alert Threshold (USD)</Label>
              <Input
                id="threshold"
                type="number"
                placeholder="10000"
                value={newWallet.threshold}
                onChange={(e) => setNewWallet({ ...newWallet, threshold: e.target.value })}
              />
            </div>
            <Button onClick={handleAddWallet} className="w-full sm:w-auto hover-lift">
              <span className="mr-2">➕</span>
              Add to Watchlist
            </Button>
          </CardContent>
        </Card>

        {/* Watched Wallets */}
        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle>Whale Watchlist</CardTitle>
            <CardDescription>{watchedWallets.length} wallets being monitored</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchedWallets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No wallets in watchlist
                      </TableCell>
                    </TableRow>
                  ) : (
                    watchedWallets.map((wallet) => (
                      <TableRow key={wallet.id}>
                        <TableCell className="font-medium">{wallet.label}</TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                            {formatAddress(wallet.wallet_address)}
                          </code>
                        </TableCell>
                        <TableCell>${wallet.threshold_usd.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch checked={wallet.is_active} onCheckedChange={() => handleToggleWallet(wallet.id)} />
                            <Badge variant={wallet.is_active ? "default" : "secondary"}>
                              {wallet.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveWallet(wallet.id)}>
                            <span className="text-destructive">🗑️</span>
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

        {/* Alert Settings */}
        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🔔</span>
              Alert Configuration
            </CardTitle>
            <CardDescription>Configure how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="discord-webhook">Discord Webhook URL</Label>
              <Input
                id="discord-webhook"
                placeholder="https://discord.com/api/webhooks/..."
                value={alertSettings.discordWebhook}
                onChange={(e) => setAlertSettings({ ...alertSettings, discordWebhook: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">Get real-time alerts in your Discord server</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="whale-threshold">Global Whale Threshold (USD)</Label>
                <Input
                  id="whale-threshold"
                  type="number"
                  value={alertSettings.whaleThreshold}
                  onChange={(e) => setAlertSettings({ ...alertSettings, whaleThreshold: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dex-threshold">DEX Alert Threshold (USD)</Label>
                <Input
                  id="dex-threshold"
                  type="number"
                  value={alertSettings.dexThreshold}
                  onChange={(e) => setAlertSettings({ ...alertSettings, dexThreshold: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive daily summary emails</p>
              </div>
              <Switch
                checked={alertSettings.emailNotifications}
                onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, emailNotifications: checked })}
              />
            </div>

            <Button onClick={handleSaveSettings} className="w-full sm:w-auto hover-lift">
              <span className="mr-2">💾</span>
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  )
}
