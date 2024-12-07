import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  children: React.ReactNode
  description?: string
  className?: string
  action?: React.ReactNode
}

export function ChartCard({
  title,
  children,
  description,
  className,
  action,
}: ChartCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">
            {title}
          </CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
