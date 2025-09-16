import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'auth'
type ButtonSize = 'default' | 'outline' | 'sm' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  children: React.ReactNode
}

export const Button = ({
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const Comp = asChild ? 'span' : 'button'

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer'

  const variantClasses: Record<ButtonVariant, string> = {
    default: 'bg-blue-700 text-white shadow hover:scale-102',
    secondary:
      'border border-gray-300 text-black hover:bg-blue-700 hover:text-white',
    outline:
      'border  border-gray-300 text-black hover:bg-blue-700 hover:text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-black',
    auth: 'w-full text-white font-medium py-5 bg-blue-700 border border-transparent hover:scale-102',

    destructive: 'text-xs bg-red-600 text-white shadow hover:bg-red-700',
    link: 'text-blue-700 underline scale-102 hover:no-underline',
  }

  const sizeClasses: Record<ButtonSize, string> = {
    default: 'h-10 px-5 py-3',
    outline: 'h-10 px-5 py-3',
    sm: 'h-8 px-3 py-2 text-sm',
    lg: 'h-10 px-6 py-2 text-base',
    icon: 'w-9 h-9 p-2',
  }

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <Comp data-slot='button' className={combinedClasses} {...props}>
      {children}
    </Comp>
  )
}