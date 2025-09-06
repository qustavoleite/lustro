import * as React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-6 shadow-md ${className}`}
      {...props}
    />
  )
}

export function CardHeader({ className = '', ...props }: CardProps) {
  return <div className={`flex flex-col gap-1 ${className}`} {...props} />
}

export function CardTitle({ className = '', ...props }: CardProps) {
  return (
    <h3
      className={`text-lg font-semibold text-gray-900 ${className}`}
      {...props}
    />
  )
}

export function CardDescription({ className = '', ...props }: CardProps) {
  return <p className={`text-sm text-gray-500 ${className}`} {...props} />
}

export function CardContent({ className = '', ...props }: CardProps) {
  return <div className={`flex flex-col gap-3 ${className}`} {...props} />
}

export function CardFooter({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`flex items-center justify-end pt-4 ${className}`}
      {...props}
    />
  )
}