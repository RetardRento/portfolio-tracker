import type { PelagusProvider, WalletAccount } from "@/lib/wallet"

export class PelagusWallet {
  private provider: PelagusProvider | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.provider = window.pelagus || null
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.provider && this.provider.isQuai)
  }

  async connect(): Promise<WalletAccount> {
    if (!this.provider) {
      throw new Error("Pelagus Wallet not found. Please install Pelagus Wallet.")
    }

    try {
      // Request account access
      const accounts = await this.provider.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const address = accounts[0]
      const balance = await this.getBalance(address)
      const chainId = await this.provider.request({ method: "eth_chainId" })

      return {
        address,
        balance,
        chainId,
      }
    } catch (error: any) {
      throw new Error(`Failed to connect to Pelagus: ${error.message}`)
    }
  }

  async disconnect(): Promise<void> {
    // Pelagus doesn't have a disconnect method, so we just clear local state
    return Promise.resolve()
  }

  async getAccounts(): Promise<string[]> {
    if (!this.provider) return []

    try {
      return await this.provider.request({ method: "eth_accounts" })
    } catch {
      return []
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) return "0"

    try {
      const balance = await this.provider.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })

      // Convert from wei to QUAI (18 decimals)
      const balanceInQuai = Number.parseInt(balance, 16) / Math.pow(10, 18)
      return balanceInQuai.toFixed(4)
    } catch {
      return "0"
    }
  }

  async switchToQuaiNetwork(): Promise<void> {
    if (!this.provider) {
      throw new Error("Pelagus Wallet not found")
    }

    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x2328" }], // Quai Network mainnet chain ID
      })
    } catch (error: any) {
      // If the chain hasn't been added to Pelagus, add it
      if (error.code === 4902) {
        await this.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2328",
              chainName: "Quai Network",
              nativeCurrency: {
                name: "Quai",
                symbol: "QUAI",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.quai.network"],
              blockExplorerUrls: ["https://quaiscan.io"],
            },
          ],
        })
      } else {
        throw error
      }
    }
  }
}
