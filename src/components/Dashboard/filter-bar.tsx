import React from 'react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterOption {
  label: string
  value: string
}

interface FilterBarProps {
  filters: {
    key: string
    label: string
    options: FilterOption[]
    value: string
    onChange: (value: string) => void
  }[]
  className?: string
}

export function FilterBar({ filters, className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap gap-4 p-4", className)}>
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col gap-2">
          <label className="text-sm font-medium">{filter.label}</label>
          <div className="flex flex-wrap gap-2">
            {filter.options.map((option) => (
              <Button
                key={option.value}
                variant={filter.value === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => filter.onChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
