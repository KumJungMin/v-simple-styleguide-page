import { createElement } from 'react'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  block?: boolean
  children?: ReactNode
  onClick?: () => void
}

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '118px',
  borderRadius: '16px',
  border: '1px solid #6d675d',
  background: '#2c2a25',
  color: '#f6f0e6',
  cursor: 'pointer',
  fontWeight: 700,
  letterSpacing: '0',
  transition: 'transform 160ms ease, border-color 160ms ease, background-color 160ms ease, color 160ms ease',
} as const

const sizeStyles: Record<ButtonSize, Record<string, string>> = {
  sm: {
    minHeight: '2.25rem',
    padding: '0.4rem 0.9rem',
    fontSize: '0.9rem',
  },
  md: {
    minHeight: '2.75rem',
    padding: '0.6rem 1.15rem',
    fontSize: '1rem',
  },
  lg: {
    minHeight: '3.25rem',
    padding: '0.78rem 1.3rem',
    fontSize: '1.05rem',
  },
}

const variantStyles: Record<ButtonVariant, Record<string, string>> = {
  primary: {
    background: '#f5efe3',
    borderColor: '#f5efe3',
    color: '#161513',
  },
  secondary: {
    background: '#393731',
    borderColor: '#6d675d',
    color: '#f6f0e6',
  },
  danger: {
    background: 'rgba(226, 75, 74, 0.14)',
    borderColor: 'rgba(226, 75, 74, 0.54)',
    color: '#ffb4ab',
  },
  ghost: {
    background: 'transparent',
    borderColor: '#6d675d',
    color: '#f6f0e6',
  },
}

function createChildContent(children: ReactNode): ReactNode {
  if (typeof children === 'string') {
    return createElement('span', {
      dangerouslySetInnerHTML: {
        __html: children,
      },
    })
  }

  return children
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  block = false,
  children = 'CTA',
  onClick,
}: ButtonProps) {
  const style = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...(block ? { width: '100%' } : null),
    ...(disabled
      ? {
          opacity: '0.38',
          cursor: 'not-allowed',
          transform: 'none',
        }
      : null),
  }

  return createElement(
    'button',
    {
      type: 'button',
      style,
      disabled,
      onClick: disabled ? undefined : onClick,
    },
    createChildContent(children)
  )
}
