import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 text-xs font-body uppercase tracking-wider text-gold border border-border rounded',
        className
      )}
    >
      {children}
    </span>
  )
}
