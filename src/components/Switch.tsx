import React, { useState } from 'react'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Switch({ className = '', label, ...props }: SwitchProps) {
  const [checked, setChecked] = useState(false)

  return (
    <label className='flex items-center gap-2 cursor-pointer select-none'>
      <div className='relative'>
        <input
          type='checkbox'
          className='sr-only'
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          {...props}
        />
        <div
          className={`w-10 h-5 rounded-full transition-colors ${
            checked ? 'bg-blue-600' : 'bg-gray-400'
          }`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </div>
      {label && <span className='text-sm'>{label}</span>}
    </label>
  )
}