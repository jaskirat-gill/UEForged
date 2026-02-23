import React from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gold text-bg font-display tracking-widest hover:bg-gold-highlight border border-gold transition-colors',
  outline:
    'border border-gold text-gold bg-transparent font-display tracking-widest hover:bg-gold hover:text-bg transition-colors',
  ghost: 'text-gold hover:text-gold-highlight font-display tracking-wide transition-colors',
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center px-8 py-3 text-sm uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface ButtonLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string
  variant?: ButtonVariant
  children: React.ReactNode
  className?: string
}

export function ButtonLink({
  href,
  variant = 'outline',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center justify-center px-8 py-3 text-sm uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
