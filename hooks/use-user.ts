"use client"

import { useState, useEffect } from "react"

interface User {
  name: string
  firstVisit: string
  lastVisit: string
  visitCount: number
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("quai-analytics-user")

    if (userData) {
      const parsedUser = JSON.parse(userData)
      // Update last visit and increment visit count
      const updatedUser = {
        ...parsedUser,
        lastVisit: new Date().toISOString(),
        visitCount: (parsedUser.visitCount || 1) + 1,
      }
      setUser(updatedUser)
      localStorage.setItem("quai-analytics-user", JSON.stringify(updatedUser))
      setIsNewUser(false)
    } else {
      setIsNewUser(true)
    }

    setLoading(false)
  }, [])

  const completeOnboarding = (name: string) => {
    const newUser: User = {
      name,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      visitCount: 1,
    }

    setUser(newUser)
    localStorage.setItem("quai-analytics-user", JSON.stringify(newUser))
    setIsNewUser(false)
  }

  const clearUser = () => {
    localStorage.removeItem("quai-analytics-user")
    setUser(null)
    setIsNewUser(true)
  }

  return {
    user,
    isNewUser,
    loading,
    completeOnboarding,
    clearUser,
  }
}
