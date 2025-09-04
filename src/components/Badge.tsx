import React from 'react'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300',
  destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-gray-400 text-gray-800 hover:bg-gray-100',
}

function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 
        text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 
        transition-colors overflow-hidden ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}

export { Badge }