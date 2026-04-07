'use client'

import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  className?: string
}

export function Alert({
  variant = 'info',
  title,
  children,
  className,
}: AlertProps) {
  const variantStyles = {
    info: 'bg-blue-50 border border-blue-200 text-blue-900',
    success: 'bg-green-50 border border-green-200 text-green-900',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-900',
    error: 'bg-red-50 border border-red-200 text-red-900',
  }

  const iconStyles = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  }

  const Icon = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: AlertCircle,
  }[variant]

  return (
    <div className={cn('rounded-lg p-4', variantStyles[variant], className)}>
      <div className="flex gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[variant])} />
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
