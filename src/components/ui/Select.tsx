import React from 'react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s/g, '-')
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block font-body text-sm text-text-muted mb-2"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full bg-surface border border-border rounded px-4 py-3 font-body text-text',
          'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 font-body text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
