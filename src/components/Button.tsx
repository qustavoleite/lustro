import type { ButtonHTMLAttributes } from 'react'
import '../index.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'auth'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  const baseClasses =
    'px-3 py-2 rounded font-medium cursor-pointer transition-colors duration-200 transform transition-transform'

  const variantClasses =
    variant === 'primary'
      ? 'bg-blue-700 text-white hover:bg-blue-700 hover:scale-102'
      : variant === 'secondary'
      ? 'bg-white text-black border border-gray-300 hover:bg-blue-700 hover:text-white'
      : 'w-full text-white font-medium py-3 bg-blue-700 border border-transparent hover:scale-102 '

  return (
    <button className={`${baseClasses} ${variantClasses}`} {...props}>
      {children}
    </button>
  )
}
