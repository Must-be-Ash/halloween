"use client"

import { LiquidButton } from "./liquid-button"
import type { Filter, FilterType } from "./camera-app"

interface FilterSelectorProps {
  filters: Filter[]
  selectedFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function FilterSelector({ filters, selectedFilter, onFilterChange }: FilterSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {filters.map((filter) => (
        <LiquidButton
          key={filter.id}
          variant={selectedFilter === filter.id ? "primary" : "secondary"}
          onClick={() => onFilterChange(filter.id)}
          className="h-auto p-3 flex flex-col items-center gap-2 text-left"
        >
          <div className="flex items-center gap-2 w-full">
            <span className="font-medium text-sm">{filter.name}</span>
          </div>
        </LiquidButton>
      ))}
    </div>
  )
}
