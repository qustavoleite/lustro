import { useState } from 'react'
import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { Badge } from '../components/Badge'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Car,
  Phone,
  CreditCard,
  LogOut,
  ArrowLeft,
  X,
  CarFront,
  LayoutTemplate,
} from 'lucide-react'

type Booking = {
  id: number
  date: string
  time: string
  washType: string
  carModel: string
  plate: string
  phone: string
  price: number
  status: string
}

export function Scheduling() {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const savedBookings = localStorage.getItem('bookings')
    if (savedBookings) {
      const parsed = JSON.parse(savedBookings)
      const hasLegacyIds = parsed.some(
        (b: { id: number }) => Number(b?.id) >= 1000000
      )
      if (hasLegacyIds) {
        const renumbered = [...parsed]
          .sort((a: Booking, b: Booking) => {
            const dateCmp = String(a.date).localeCompare(String(b.date))
            if (dateCmp !== 0) return dateCmp
            return String(a.time).localeCompare(String(b.time))
          })
          .map((b: Booking, idx: number) => ({ ...b, id: idx + 1 }))
        localStorage.setItem('bookings', JSON.stringify(renumbered))
        localStorage.setItem('bookingCounter', String(renumbered.length))
        return renumbered
      }
      return parsed
    }
    // dados mockados como fallback
    return [
      {
        id: 1,
        date: '2025-01-15',
        time: '09:00',
        washType: 'completa',
        carModel: 'sedan',
        plate: 'ABC-1234',
        phone: '(11) 99999-9999',
        price: 80,
        status: 'agendado',
      },
      {
        id: 3,
        date: '2025-01-17',
        time: '16:00',
        washType: 'interna',
        carModel: 'suv',
        plate: 'DEF-9012',
        phone: '(11) 77777-7777',
        price: 50,
        status: 'agendado',
      },
    ]
  })

  const handleCancelBooking = (id: number) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      const updatedBookings = bookings.filter(
        (booking: Booking) => booking.id !== id
      )
      setBookings(updatedBookings)
      // Salvar no localStorage
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'agendado':
        return (
          <Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100'>
            Agendado
          </Badge>
        )
      case 'concluido':
        return (
          <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
            Concluído
          </Badge>
        )
      case 'cancelado':
        return (
          <Badge className='bg-red-100 text-red-800 hover:bg-red-100'>
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant='secondary'>{status}</Badge>
    }
  }

  const getWashTypeLabel = (type: string) => {
    switch (type) {
      case 'externa':
        return 'Lavagem Externa'
      case 'interna':
        return 'Lavagem Interna'
      case 'completa':
        return 'Lavagem Completa'
      default:
        return type
    }
  }

  const getCarModelLabel = (model: string) => {
    switch (model) {
      case 'sedan':
        return 'Sedan'
      case 'hatch':
        return 'Hatch'
      case 'suv':
        return 'SUV'
      case 'pickup':
        return 'Pickup'
      case 'van':
        return 'Van'
      case 'coupe':
        return 'Coupé'
      case 'conversivel':
        return 'Conversível'
      default:
        return model
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const weekdays = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ]
    const weekday = weekdays[date.getDay()]
    const formattedDate = date.toLocaleDateString('pt-BR')
    return `${weekday}, ${formattedDate}`
  }

  const futureBookings = bookings.filter((booking: Booking) => {
    const bookingDate = new Date(booking.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookingDate >= today && booking.status === 'agendado'
  })

  return (
    <div className='min-h-screen'>
      <header className='border-b border-gray-300'>
        <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
          <div className='font-heading font-bold text-2xl text-primary'>
            Lustro
          </div>
          <div className='flex items-center gap-4'>
            <Link to='/schedule'>
              <Button variant='outline' size='sm'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Agendar
              </Button>
            </Link>
            <Link to='/'>
              <Button variant='outline' size='sm'>
                <LogOut className='w-4 h-4 mr-2' />
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className='container mx-auto max-w-4xl px-4 py-12'>
        <div className='text-center mb-12'>
          <h1 className='font-heading font-bold text-3xl md:text-4xl text-primary mb-4'>
            Meus Agendamentos
          </h1>
          <p className='text-lg text-muted-foreground'>
            Visualize e cancele seus agendamentos futuros
          </p>
        </div>

        {futureBookings.length === 0 ? (
          <Card>
            <CardContent className='text-center py-12'>
              <Car className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-primary mb-2'>
                Nenhum agendamento encontrado
              </h3>
              <p className='text-muted-foreground mb-6'>
                Você ainda não possui agendamentos.
              </p>
              <Link to='/schedule'>
                <Button>Fazer Primeiro Agendamento</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-6'>
            {futureBookings.map((booking: Booking) => (
              <Card
                key={booking.id}
                className='hover:shadow-lg transition-shadow'
              >
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                  <CardTitle className='text-lg'>
                    Agendamento #{booking.id}
                  </CardTitle>
                  <div className='flex flex-col md:flex-row gap-4'>
                    {getStatusBadge(booking.status)}
                    {booking.status === 'agendado' && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleCancelBooking(booking.id)}
                        className='text-red-600 hover:text-red-700 hover:bg-red-600'
                      >
                        <X className='w-4 h-4 mr-1' />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Data:</span>
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Clock className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Horário:</span>
                        <span>{booking.time}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Car className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Serviço:</span>
                        <span>{getWashTypeLabel(booking.washType)}</span>
                      </div>
                    </div>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <CarFront className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Modelo:</span>
                        <span>{getCarModelLabel(booking.carModel)}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <LayoutTemplate className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Placa:</span>
                        <span>{booking.plate}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Phone className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Telefone:</span>
                        <span>{booking.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className='border-t border-gray-300 pt-4 mt-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <CreditCard className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Valor Total:</span>
                      </div>
                      <span className='text-xl font-bold text-blue-700'>
                        R$ {booking.price},00
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
