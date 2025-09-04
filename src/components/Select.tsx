import React, { useState, useRef, useEffect } from 'react'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

interface SelectProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  size?: 'sm' | 'default'
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
}

interface SelectInternalItemProps extends SelectItemProps {
  onSelect?: (val: string) => void
  selected?: string
}

interface SelectTriggerProps {
  children: React.ReactNode
  isOpen: boolean
  onClick?: () => void
  size?: 'sm' | 'default'
}

export function Select({
  value,
  onChange,
  placeholder,
  children,
  size = 'default',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(value || '')
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => setIsOpen(!isOpen)

  const handleSelect = (val: string) => {
    setSelected(val)
    onChange?.(val)
    setIsOpen(false)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='relative inline-block w-fit'>
      {/* Trigger */}
      <SelectTrigger
        ref={triggerRef}
        isOpen={isOpen}
        onClick={handleToggle}
        size={size}
      >
        <SelectValue value={selected} placeholder={placeholder} />
      </SelectTrigger>

      {/* Content */}
      {isOpen && (
        <SelectContent>
          {React.Children.map(children, (child) => {
            if (React.isValidElement<Partial<SelectInternalItemProps>>(child)) {
              return React.cloneElement(child, {
                onSelect: handleSelect,
                selected,
              })
            }
            return child
          })}
        </SelectContent>
      )}
    </div>
  )
}

// Trigger separado
export const SelectTrigger = React.forwardRef<
  HTMLDivElement,
  SelectTriggerProps & React.HTMLAttributes<HTMLDivElement>
>(({ children, isOpen, size = 'default', ...props }, ref) => {
  const heightClass = size === 'sm' ? 'h-8' : 'h-9'
  return (
    <div
      ref={ref}
      className={`flex items-center justify-between gap-2 rounded-md  border-gray-300 px-3 py-2 text-sm cursor-pointer bg-white shadow-sm ${heightClass}`}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </div>
  )
})

export function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <div className='absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border bg-white shadow-md'>
      {/* Scroll Up */}
      <div className='flex items-center justify-center py-1'>
        <ChevronUpIcon className='w-4 h-4' />
      </div>

      <div className='p-1'>{children}</div>

      {/* Scroll Down */}
      <div className='flex items-center justify-center py-1'>
        <ChevronDownIcon className='w-4 h-4' />
      </div>
    </div>
  )
}

export function SelectValue({
  value,
  placeholder,
}: {
  value?: string
  placeholder?: string
}) {
  return (
    <span className='line-clamp-1 flex items-center gap-2'>
      {value || placeholder || 'Select...'}
    </span>
  )
}

export function SelectItem({
  value,
  children,
  disabled,
  onSelect,
  selected,
}: SelectInternalItemProps) {
  const handleClick = () => {
    if (!disabled) onSelect?.(value)
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between gap-2 px-2 py-1.5 cursor-pointer text-sm ${
        selected === value ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span>{children}</span>
      {selected === value && <CheckIcon className='w-4 h-4' />}
    </div>
  )
}

export function SelectLabel({ children }: { children: React.ReactNode }) {
  return <div className='px-2 py-1 text-xs text-gray-500'>{children}</div>
}

export function SelectSeparator() {
  return <div className='my-1 h-px bg-gray-200 mx-1' />
}
