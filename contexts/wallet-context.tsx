"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { PelagusWallet } from "@/lib/pelagus"
import { MetaMaskWallet } from "@/lib/metamask"
import type { WalletConnection, WalletAccount } from "@/lib/wallet"

interface WalletState extends WalletConnection {
  isConnecting: boolean
  isDemoMode: boolean
}

type WalletAction =
  | { type: "CONNECTING" }
  | { type: "CONNECTED"; payload: { account: WalletAccount; walletType: "pelagus" | "metamask" } }
  | { type: "DISCONNECTED" }
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "DEMO_MODE_ENABLED" }
  | { type: "DEMO_MODE_DISABLED" }

interface WalletContextType extends WalletState {
  connectPelagus: () => Promise<void>
  connectMetaMask: () => Promise<void>
  disconnect: () => Promise<void>
  clearError: () => void
  enableDemoMode: () => void
  disableDemoMode: () => void
}

const initialState: WalletState = {
  isConnected: false,
  isConnecting: false,
  account: null,
  walletType: null,
  error: null,
  isDemoMode: false,
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case "CONNECTING":
      return {
        ...state,
        isConnecting: true,
        error: null,
      }
    case "CONNECTED":
      return {
        ...state,
        isConnecting: false,
        isConnected: true,
        account: action.payload.account,
        walletType: action.payload.walletType,
        error: null,
        isDemoMode: false,
      }
    case "DISCONNECTED":
      return {
        ...initialState,
      }
    case "ERROR":
      return {
        ...state,
        isConnecting: false,
        error: action.payload,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "DEMO_MODE_ENABLED":
      return {
        ...state,
        isDemoMode: true,
        isConnected: true,
        account: {
          address: "0x1234...5678",
          balance: "1,234.56",
          network: "quai-mainnet",
        },
        walletType: null,
        error: null,
      }
    case "DEMO_MODE_DISABLED":
      return {
        ...initialState,
      }
    default:
      return state
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(walletReducer, initialState)

  const pelagusWallet = new PelagusWallet()
  const metaMaskWallet = new MetaMaskWallet()

  // Check for existing connections on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        const demoMode = localStorage.getItem("demo_mode")
        if (demoMode === "true") {
          dispatch({ type: "DEMO_MODE_ENABLED" })
          return
        }

        // Check Pelagus first
        if (await pelagusWallet.isAvailable()) {
          const accounts = await pelagusWallet.getAccounts()
          if (accounts.length > 0) {
            const account = await pelagusWallet.connect()
            dispatch({
              type: "CONNECTED",
              payload: { account, walletType: "pelagus" },
            })
            return
          }
        }

        // Check MetaMask
        if (await metaMaskWallet.isAvailable()) {
          const accounts = await metaMaskWallet.getAccounts()
          if (accounts.length > 0) {
            const account = await metaMaskWallet.connect()
            dispatch({
              type: "CONNECTED",
              payload: { account, walletType: "metamask" },
            })
            return
          }
        }
      } catch (error) {
        // Silently fail on initial connection check
        console.warn("Failed to check existing wallet connection:", error)
      }
    }

    checkExistingConnection()
  }, [])

  const connectPelagus = async () => {
    dispatch({ type: "CONNECTING" })

    try {
      if (!(await pelagusWallet.isAvailable())) {
        throw new Error("Pelagus Wallet not found. Please install Pelagus Wallet.")
      }

      const account = await pelagusWallet.connect()
      dispatch({
        type: "CONNECTED",
        payload: { account, walletType: "pelagus" },
      })

      // Store connection in localStorage
      localStorage.setItem(
        "wallet_connection",
        JSON.stringify({
          walletType: "pelagus",
          address: account.address,
        }),
      )
      localStorage.removeItem("demo_mode")
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message })
    }
  }

  const connectMetaMask = async () => {
    dispatch({ type: "CONNECTING" })

    try {
      if (!(await metaMaskWallet.isAvailable())) {
        throw new Error("MetaMask not found. Please install MetaMask.")
      }

      const account = await metaMaskWallet.connect()
      dispatch({
        type: "CONNECTED",
        payload: { account, walletType: "metamask" },
      })

      // Store connection in localStorage
      localStorage.setItem(
        "wallet_connection",
        JSON.stringify({
          walletType: "metamask",
          address: account.address,
        }),
      )
      localStorage.removeItem("demo_mode")
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message })
    }
  }

  const disconnect = async () => {
    try {
      if (state.walletType === "pelagus") {
        await pelagusWallet.disconnect()
      } else if (state.walletType === "metamask") {
        await metaMaskWallet.disconnect()
      }

      // Clear localStorage
      localStorage.removeItem("wallet_connection")
      localStorage.removeItem("demo_mode")

      dispatch({ type: "DISCONNECTED" })
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message })
    }
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const enableDemoMode = () => {
    localStorage.setItem("demo_mode", "true")
    dispatch({ type: "DEMO_MODE_ENABLED" })
  }

  const disableDemoMode = () => {
    localStorage.removeItem("demo_mode")
    dispatch({ type: "DEMO_MODE_DISABLED" })
  }

  const value: WalletContextType = {
    ...state,
    connectPelagus,
    connectMetaMask,
    disconnect,
    clearError,
    enableDemoMode,
    disableDemoMode,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
