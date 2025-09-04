import React from 'react'
import { CircleIcon } from 'lucide-react'

interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  children:
    | React.ReactElement<RadioGroupItemProps>
    | React.ReactElement<RadioGroupItemProps>[]
}

function RadioGroup({
  className = '',
  name,
  children,
  ...props
}: RadioGroupProps) {
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement<RadioGroupItemProps>(child)) return child
    return React.cloneElement(child, { name })
  })

  return (
    <div className={`grid gap-3 ${className}`} role='radiogroup' {...props}>
      {items}
    </div>
  )
}

function RadioGroupItem({
  className = '',
  label,
  ...props
}: RadioGroupItemProps) {
  return (
    <label className='flex items-center gap-2 cursor-pointer'>
      <div className='relative flex items-center justify-center'>
        <input
          type='radio'
          className={`appearance-none border border-gray-400 rounded-full size-4 
            checked:border-blue-500 checked:ring-2 checked:ring-blue-500 
            focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {props.checked && (
          <CircleIcon className='absolute text-blue-500 size-2' />
        )}
      </div>
      <span className='text-sm'>{label}</span>
    </label>
  )
}

export { RadioGroup, RadioGroupItem }