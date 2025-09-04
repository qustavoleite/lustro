import * as React from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
}

function Label({ className = '', ...props }: LabelProps) {
  return (
    <label
      className={`flex items-center gap-2 text-sm leading-none font-medium select-none
        disabled:pointer-events-none disabled:opacity-50 
        peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export { Label }
