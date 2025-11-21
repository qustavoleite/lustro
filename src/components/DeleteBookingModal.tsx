import { Button } from './Button'
import { AlertTriangle, X } from 'lucide-react'

interface DeleteBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
  title?: string
  message?: string
}

export function DeleteBookingModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Cancelar Agendamento',
  message = 'Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.',
}: DeleteBookingModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      onClick={handleBackdropClick}
    >
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />

      <div className='relative bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-300 transform transition-all duration-300 scale-100 opacity-100 animate-in fade-in zoom-in-95'>
        <div className='p-6'>
          <div className='flex items-start gap-4 mb-4'>
            <div className='flex-shrink-0'>
              <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center'>
                <AlertTriangle className='w-6 h-6 text-red-600' />
              </div>
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                {title}
              </h3>
              <p className='text-sm text-gray-600'>{message}</p>
            </div>
            {!isLoading && (
              <button
                onClick={onClose}
                className='flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors'
                aria-label='Fechar'
              >
                <X className='w-5 h-5' />
              </button>
            )}
          </div>

          <div className='flex gap-6 justify-start mt-6 pl-16'>
            <Button variant='outline' onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              variant='destructive'
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Cancelando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
