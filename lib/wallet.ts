export interface WalletAccount {
  address: string
  balance?: string
  chainId?: string
}

export interface WalletConnection {
  isConnected: boolean
  account: WalletAccount | null
  walletType: "pelagus" | "metamask" | null
  error: string | null
}

export interface WalletProvider {
  connect: () => Promise<WalletAccount>
  disconnect: () => Promise<void>
  getAccounts: () => Promise<string[]>
  getBalance: (address: string) => Promise<string>
  switchChain?: (chainId: string) => Promise<void>
}

export interface PelagusProvider extends WalletProvider {
  isQuai?: boolean
  request: (args: { method: string; params?: any[] }) => Promise<any>
}

export interface MetaMaskProvider extends WalletProvider {
  isMetaMask?: boolean
  request: (args: { method: string; params?: any[] }) => Promise<any>
}

declare global {
  interface Window {
    pelagus?: PelagusProvider
    ethereum?: MetaMaskProvider
  }
}
