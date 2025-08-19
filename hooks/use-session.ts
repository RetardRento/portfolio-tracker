"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@/contexts/wallet-context"

interface SessionData {
  address: string
  walletType: "pelagus" | "metamask"
  connectedAt: number
  lastActivity: number
}

export function useSession() {
  const { isConnected, account, walletType, disconnect } = useWallet()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)

  // Update session data when wallet connects
  useEffect(() => {
    if (isConnected && account && walletType) {
      const now = Date.now()
      const newSessionData: SessionData = {
        address: account.address,
        walletType,
        connectedAt: now,
        lastActivity: now,
      }

      setSessionData(newSessionData)
      localStorage.setItem("quai_session", JSON.stringify(newSessionData))
    } else {
      setSessionData(null)
      localStorage.removeItem("quai_session")
    }
  }, [isConnected, account, walletType])

  // Update last activity
  const updateActivity = () => {
    if (sessionData) {
      const updatedSession = {
        ...sessionData,
        lastActivity: Date.now(),
      }
      setSessionData(updatedSession)
      localStorage.setItem("quai_session", JSON.stringify(updatedSession))
    }
  }

  // Auto logout after inactivity (24 hours)
  useEffect(() => {
    if (!sessionData) return

    const checkInactivity = () => {
      const now = Date.now()
      const inactivityLimit = 24 * 60 * 60 * 1000 // 24 hours

      if (now - sessionData.lastActivity > inactivityLimit) {
        disconnect()
      }
    }

    const interval = setInterval(checkInactivity, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [sessionData, disconnect])

  // Track user activity
  useEffect(() => {
    const handleActivity = () => updateActivity()

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [sessionData])

  const getSessionDuration = () => {
    if (!sessionData) return 0
    return Date.now() - sessionData.connectedAt
  }

  const getLastActivityTime = () => {
    if (!sessionData) return null
    return new Date(sessionData.lastActivity)
  }

  return {
    sessionData,
    isActive: !!sessionData,
    getSessionDuration,
    getLastActivityTime,
    updateActivity,
  }
}
