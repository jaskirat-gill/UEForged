import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-body text-sm text-text-muted mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full bg-surface border border-border rounded px-4 py-3 font-body text-text',
          'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors',
          'placeholder:text-text-muted/60',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 font-body text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
