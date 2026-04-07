'use client'

import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?:
    | 'pending'
    | 'active'
    | 'completed'
    | 'rejected'
    | 'accepted'
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variantStyles = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    active: 'bg-blue-100 text-blue-800 border border-blue-200',
    completed: 'bg-green-100 text-green-800 border border-green-200',
    rejected: 'bg-red-100 text-red-800 border border-red-200',
    accepted: 'bg-brand-green text-white',
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    success: 'bg-brand-green text-white',
    warning: 'bg-brand-orange text-white',
    error: 'bg-red-600 text-white',
  }

  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-xs font-medium rounded-full',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
