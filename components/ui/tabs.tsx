'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Tab {
  label: string
  value: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function Tabs({
  tabs,
  defaultValue,
  onValueChange,
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(
    defaultValue || tabs[0]?.value || ''
  )

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onValueChange?.(value)
  }

  const activeTabContent = tabs.find((tab) => tab.value === activeTab)?.content

  return (
    <div className={className}>
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.value
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{activeTabContent}</div>
    </div>
  )
}
