"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (name: string) => void
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [name, setName] = useState("")
  const [step, setStep] = useState(1)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onComplete(name.trim())
    }
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <Card className="glass-card max-w-md w-full p-6 animate-scale-in">
        {step === 1 && (
          <div className="text-center space-y-4">
            <div className="text-4xl mb-4">👋</div>
            <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Quai Analytics
            </h2>
            <p className="text-muted-foreground">
              Your comprehensive dashboard for monitoring Quai Network activity, whale movements, and DEX trading.
            </p>
            <Button onClick={handleNext} className="w-full">
              Get Started
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-heading font-bold">What you'll get</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-primary">🐋</span>
                <span className="text-sm">Real-time whale movement tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">📈</span>
                <span className="text-sm">DEX trading volume analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">⚡</span>
                <span className="text-sm">Live network activity monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">🔔</span>
                <span className="text-sm">Custom alerts and notifications</span>
              </div>
            </div>
            <Button onClick={handleNext} className="w-full">
              Continue
            </Button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h2 className="text-xl font-heading font-bold mb-2">What should we call you?</h2>
              <p className="text-sm text-muted-foreground mb-4">We'll use this to personalize your experience</p>
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={!name.trim()}>
              Complete Setup
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}
