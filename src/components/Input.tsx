import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outline'
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = `
    flex h-11 w-full rounded-lg px-4 py-2 text-base 
    placeholder-gray-400 transition-colors duration-200 
    focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-blue-700 focus-visible:ring-offset-1 
    disabled:cursor-not-allowed disabled:opacity-50
  `
    .replace(/\s+/g, ' ')
    .trim()

  const variantClasses =
    variant === 'default'
      ? 'bg-white border border-gray-300 text-gray-900 shadow-sm'
      : 'bg-transparent border border-gray-400 text-gray-900'

  return (
    <input
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    />
  )
}