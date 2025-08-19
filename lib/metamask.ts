import type { MetaMaskProvider, WalletAccount } from "@/lib/wallet"

export class MetaMaskWallet {
  private provider: MetaMaskProvider | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.provider = window.ethereum || null
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.provider && this.provider.isMetaMask)
  }

  async isQuaiSnapInstalled(): Promise<boolean> {
    if (!this.provider) return false

    try {
      const snaps = await this.provider.request({
        method: "wallet_getSnaps",
      })

      return "npm:quai-snap" in snaps
    } catch {
      return false
    }
  }

  async installQuaiSnap(): Promise<void> {
    if (!this.provider) {
      throw new Error("MetaMask not found")
    }

    try {
      await this.provider.request({
        method: "wallet_requestSnaps",
        params: {
          "npm:quai-snap": {},
        },
      })
    } catch (error: any) {
      throw new Error(`Failed to install Quai Snap: ${error.message}`)
    }
  }

  async connect(): Promise<WalletAccount> {
    if (!this.provider) {
      throw new Error("MetaMask not found. Please install MetaMask.")
    }

    try {
      const requestedAccounts = await this.provider.request({
        method: "eth_requestAccounts",
      })

      if (!requestedAccounts || requestedAccounts.length === 0) {
        throw new Error("No accounts authorized")
      }

      // Use the first account from the request as our primary address
      let address = requestedAccounts[0]
      let chainId = "0x1" // Default to Ethereum

      try {
        const snapInstalled = await this.isQuaiSnapInstalled()

        if (!snapInstalled) {
          console.log("Quai Snap not installed, attempting installation...")
          await this.installQuaiSnap()
        }

        // Try to get Quai accounts if snap is available
        const snapInstalledAfterAttempt = await this.isQuaiSnapInstalled()
        if (snapInstalledAfterAttempt) {
          const quaiAccounts = await this.provider.request({
            method: "wallet_invokeSnap",
            params: {
              snapId: "npm:quai-snap",
              request: {
                method: "getAccounts",
              },
            },
          })

          if (quaiAccounts && quaiAccounts.length > 0) {
            address = quaiAccounts[0]
            chainId = "0x2328" // Quai Network
            console.log("Successfully connected with Quai Snap")
          }
        }
      } catch (snapError) {
        console.warn("Quai Snap functionality not available, using standard MetaMask:", snapError)
        // Continue with standard MetaMask account
      }

      const balance = await this.getBalance(address)

      return {
        address,
        balance,
        chainId,
      }
    } catch (error: any) {
      throw new Error(`Failed to connect to MetaMask: ${error.message}`)
    }
  }

  async disconnect(): Promise<void> {
    // MetaMask doesn't have a disconnect method, so we just clear local state
    return Promise.resolve()
  }

  async getAccounts(): Promise<string[]> {
    if (!this.provider) return []

    try {
      // Use eth_accounts which doesn't require additional permissions
      const accounts = await this.provider.request({
        method: "eth_accounts",
      })

      return accounts || []
    } catch (error) {
      console.warn("Could not get accounts:", error)
      return []
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) return "0"

    try {
      const snapInstalled = await this.isQuaiSnapInstalled()
      if (snapInstalled) {
        const balance = await this.provider.request({
          method: "wallet_invokeSnap",
          params: {
            snapId: "npm:quai-snap",
            request: {
              method: "getBalance",
              params: { address },
            },
          },
        })
        return balance || "0"
      } else {
        const balance = await this.provider.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        })
        return balance || "0"
      }
    } catch {
      return "0"
    }
  }
}
