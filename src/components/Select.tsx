import React, { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, CheckIcon } from 'lucide-react'

type SelectProps = {
  value?: string
  onChange?: (value: string) => void
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
}

type SelectItemProps = {
  value: string
  children: React.ReactNode
}

export function Select({
  value,
  onChange,
  onValueChange,
  placeholder,
  children,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => setIsOpen((prev) => !prev)
  const handleClose = () => setIsOpen(false)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose()
      }
    }
    // Use 'click' so item onClick fires before this handler
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const display = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement<SelectItemProps>(child)) return false
    return child.props.value === value
  }) as React.ReactElement<SelectItemProps> | undefined

  const handleSelect = (val: string) => {
    onChange?.(val)
    onValueChange?.(val)
    handleClose()
  }

  return (
    <div ref={containerRef} className='relative w-full'>
      <button
        type='button'
        onClick={handleToggle}
        className='flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm'
      >
        <span className='line-clamp-1'>
          {display ? display.props.children : placeholder || 'Selecionar...'}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className='absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border bg-white shadow-md'>
          <div className='p-1'>
            {React.Children.map(children, (child) => {
              if (!React.isValidElement<SelectItemProps>(child)) return child
              const isSelected = child.props.value === value
              return (
                <div
                  key={child.props.value}
                  onClick={() => handleSelect(child.props.value)}
                  className={`flex items-center justify-between gap-2 px-2 py-1.5 cursor-pointer text-sm ${
                    isSelected
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{child.props.children}</span>
                  {isSelected && <CheckIcon className='w-4 h-4' />}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function SelectItem({ value, children }: SelectItemProps) {
  return <div data-value={value}>{children}</div>
}
