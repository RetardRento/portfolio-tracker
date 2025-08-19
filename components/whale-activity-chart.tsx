"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WhaleActivityChartProps {
  data: Array<{
    timestamp: string
    amount_usd: number
    symbol: string
    whale_label?: string
  }>
}

export function WhaleActivityChart({ data }: WhaleActivityChartProps) {
  // Group data by hour for trend line
  const hourlyData = data
    .reduce((acc: any[], transfer) => {
      const hour = new Date(transfer.timestamp).toISOString().slice(0, 13) + ":00:00.000Z"
      const existing = acc.find((item) => item.hour === hour)

      if (existing) {
        existing.total_volume += transfer.amount_usd
        existing.transfer_count += 1
        existing.max_transfer = Math.max(existing.max_transfer, transfer.amount_usd)
      } else {
        acc.push({
          hour,
          total_volume: transfer.amount_usd,
          transfer_count: 1,
          max_transfer: transfer.amount_usd,
        })
      }

      return acc
    }, [])
    .sort((a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime())

  // Prepare scatter data for individual transfers
  const scatterData = data.map((transfer) => ({
    time: new Date(transfer.timestamp).getTime(),
    amount: transfer.amount_usd,
    symbol: transfer.symbol,
    label: transfer.whale_label,
  }))

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toFixed(0)}`
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{formatTime(data.time)}</p>
          <p className="text-sm text-primary">
            Amount: {formatCurrency(data.amount)} {data.symbol}
          </p>
          {data.label && <p className="text-sm text-muted-foreground">{data.label}</p>}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Whale Activity Timeline</CardTitle>
        <CardDescription>Large transfers over time - each dot represents a whale movement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                dataKey="time"
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatTime}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                type="number"
                dataKey="amount"
                tickFormatter={formatCurrency}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={scatterData} fill="hsl(var(--primary))" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
