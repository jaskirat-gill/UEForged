import React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  className?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s/g, '-')
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block font-body text-sm text-text-muted mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full bg-surface border border-border rounded px-4 py-3 font-body text-text min-h-[120px]',
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
