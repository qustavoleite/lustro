import { useState } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { Label } from '../components/Label'
import { Select, SelectItem } from '../components/Select'
import { RadioGroup, RadioGroupItem } from '../components/RadioGroup'
import { Link } from 'react-router-dom'
import { Calendar, User, LogOut } from 'lucide-react'

export function Schedule() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [washType, setWashType] = useState('')
  const [carModel, setCarModel] = useState('')
  const [plate, setPlate] = useState('')
  const [phone, setPhone] = useState('')
  const [carOwner, setCarOwner] = useState('')
  const [showSummary, setShowSummary] = useState(false)

  const prices = {
    externa: 40,
    interna: 50,
    completa: 80,
  }

  const getUnavailableTimes = (date: string) => {
    // logica mockada
    const unavailable: { [key: string]: string[] } = {
      '2024-01-15': ['09:00', '14:00'],
      '2024-01-16': ['10:00', '15:00', '16:00'],
      '2024-01-17': ['08:00', '11:00'],
    }
    return unavailable[date] || []
  }

  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ]

  const calculatePrice = () => {
    if (washType) {
      return prices[washType as keyof typeof prices]
    }
    return 0
  }

  const handleConfirmBooking = () => {
    if (
      selectedDate &&
      selectedTime &&
      washType &&
      carModel &&
      carOwner &&
      plate &&
      phone
    ) {
      setShowSummary(true)
    }
  }

  const handleFinalizeBooking = () => {
    let existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    const hasLegacyIds = existingBookings.some(
      (b: { id: number }) => Number(b?.id) >= 1000000
    )
    if (hasLegacyIds) {
      const renumbered = [...existingBookings]
        .sort((a: any, b: any) => {
          const dateCmp = String(a.date).localeCompare(String(b.date))
          if (dateCmp !== 0) return dateCmp
          return String(a.time).localeCompare(String(b.time))
        })
        .map((b: any, idx: number) => ({ ...b, id: idx + 1 }))
      localStorage.setItem('bookings', JSON.stringify(renumbered))
      localStorage.setItem('bookingCounter', String(renumbered.length))
      existingBookings = renumbered
    }
    const COUNTER_KEY = 'bookingCounter'
    let counter = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10)
    if (!Number.isFinite(counter) || counter < 0)
      counter = existingBookings.length
    const nextId = counter + 1
    localStorage.setItem(COUNTER_KEY, String(nextId))

    const normalizedDate = selectedDate.includes('-')
      ? selectedDate
      : new Date(selectedDate).toISOString().split('T')[0]

    const newBooking = {
      id: nextId,
      date: normalizedDate,
      time: selectedTime,
      washType: washType,
      carModel: carModel,
      carOwner: carOwner,
      plate: plate,
      phone: phone,
      price: calculatePrice(),
      status: 'agendado',
    }

    const updatedBookings = [...existingBookings, newBooking]

    localStorage.setItem('bookings', JSON.stringify(updatedBookings))

    alert('Agendamento realizado com sucesso!')

    setSelectedDate('')
    setSelectedTime('')
    setWashType('')
    setCarModel('')
    setCarOwner('')
    setPlate('')
    setPhone('')
    setShowSummary(false)

    window.location.href = '/scheduling'
  }

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getTodayString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
      7,
      11
    )}`
  }

  const isFormComplete =
    !!selectedDate &&
    !!selectedTime &&
    !!washType &&
    !!carModel &&
    !!carOwner &&
    !!plate &&
    !!phone

  if (showSummary) {
    return (
      <div className='min-h-screen bg-background'>
        <header className='border-b border-gray-300'>
          <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
            <div className='font-heading font-bold text-2xl text-primary'>
              Lustro
            </div>
            <div className='flex items-center gap-4'>
              <Link to='/scheduling'>
                <Button variant='secondary' size='sm'>
                  <User className='w-4 h-4 mr-2' />
                  Meus Agendamentos
                </Button>
              </Link>
              <Link to='/'>
                <Button variant='secondary' size='sm'>
                  <LogOut className='w-4 h-4 mr-2' />
                  Sair
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className='container mx-auto max-w-2xl px-4 py-12'>
          <Card>
            <CardHeader className='text-center'>
              <CardTitle className='font-heading text-xl mb-7'>
                Resumo do Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-2 gap-5'>
                <div>
                  <Label className='font-bold'>Data</Label>
                  <p className='text-lg'>
                    {formatDateForDisplay(selectedDate)}
                  </p>
                </div>
                <div>
                  <Label className='font-bold text-lg'>Horário</Label>
                  <p className='font-medium'>{selectedTime}</p>
                </div>
                <div>
                  <Label className='font-bold text-lg'>Tipo de Lavagem</Label>
                  <p className='font-medium capitalize'>{washType}</p>
                </div>
                <div>
                  <Label className='font-bold text-lg'>Modelo do Carro</Label>
                  <p className='font-medium capitalize'>{carModel}</p>
                </div>
                <div>
                  <Label className='font-bold text-lg'>Proprietário</Label>
                  <p className='font-medium'>{carOwner}</p>
                </div>
                <div>
                  <Label className='font-bold text-lg'>Placa</Label>
                  <p className='font-medium'>{plate}</p>
                </div>
                <div>
                  <Label className='font-bold text-lg'>Telefone</Label>
                  <p className='font-medium'>{phone}</p>
                </div>
              </div>

              <div className='border-t border-gray-300 pt-4'>
                <div className='flex justify-between items-center'>
                  <Label className='text-xl font-medium'>Valor Total</Label>
                  <p className='text-2xl font-bold text-blue-700'>
                    R$ {calculatePrice()},00
                  </p>
                </div>
              </div>

              <div className='flex gap-4 pt-4'>
                <Button
                  variant='secondary'
                  className='flex-1 bg-transparent'
                  onClick={() => setShowSummary(false)}
                >
                  Voltar
                </Button>
                <Button
                  className='flex-1 bg-blue-700 hover:bg-accent/90'
                  onClick={handleFinalizeBooking}
                >
                  Confirmar Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b border-gray-300'>
        <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
          <div className='font-heading font-bold text-2xl text-primary'>
            Lustro
          </div>
          <div className='flex items-center gap-4'>
            <Link to='/scheduling'>
              <Button variant='secondary' size='sm'>
                <User className='w-4 h-4 mr-2' />
                Minha agenda
              </Button>
            </Link>
            <Link to='/'>
              <Button variant='secondary' size='sm'>
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
            Agendar Lavagem
          </h1>
          <p className='text-lg'>
            Escolha o melhor horário e serviço para seu veículo
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Calendar className='w-5 h-5 text-blue-700' />
                  Data e Horário
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='date' className='mb-2'>
                    Selecione a Data
                  </Label>
                  <Input
                    id='date'
                    type='date'
                    value={selectedDate}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      console.log('Data selecionada:', inputValue)
                      setSelectedDate(inputValue)
                      setSelectedTime('')
                    }}
                    min={getTodayString()}
                    className='w-full'
                  />
                </div>

                {selectedDate && (
                  <div>
                    <div className='mb-2 p-2 bg-blue-50 rounded text-sm'>
                      <strong>Data selecionada:</strong>{' '}
                      {formatDateForDisplay(selectedDate)}
                    </div>
                    <Label>Horários Disponíveis</Label>
                    <div className='grid grid-cols-4 gap-2 mt-2'>
                      {timeSlots.map((time) => {
                        const isUnavailable =
                          getUnavailableTimes(selectedDate).includes(time)
                        return (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? 'default' : 'secondary'
                            }
                            size='sm'
                            disabled={isUnavailable}
                            onClick={() => setSelectedTime(time)}
                            className={`
                              ${
                                selectedTime === time
                                  ? 'bg-blue-700 hover:bg-accent/90'
                                  : ''
                              }
                              ${
                                isUnavailable
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                              }
                            `}
                          >
                            {time}
                          </Button>
                        )
                      })}
                    </div>
                    {getUnavailableTimes(selectedDate).length > 0 && (
                      <p className='text-xs mt-2'>
                        Horários em cinza não estão disponíveis
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipo de Lavagem</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup name='washType'>
                  <div className='flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-muted/50'>
                    <RadioGroupItem
                      value='interna'
                      id='interna'
                      label=''
                      checked={washType === 'interna'}
                      onChange={() => setWashType('interna')}
                    />
                    <Label
                      htmlFor='interna'
                      className='flex items-center gap-2 cursor-pointer flex-1'
                    >
                      {/* <Sparkles className='w-4 h-4 text-blue-700' /> */}
                      <div className='flex-1'>
                        <div className='flex justify-between items-center'>
                          <p className='font-medium'>Lavagem Interna</p>
                          <span className='text-base font-bold text-blue-700'>
                            R$ 50
                          </span>
                        </div>
                        <p className=''>Interior limpo e higienizado</p>
                      </div>
                    </Label>
                  </div>

                  <div className='flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-muted/50'>
                    <RadioGroupItem
                      value='externa'
                      id='externa'
                      label=''
                      checked={washType === 'externa'}
                      onChange={() => setWashType('externa')}
                    />
                    <Label
                      htmlFor='externa'
                      className='flex items-center gap-2 cursor-pointer flex-1'
                    >
                      {/* <Car className='w-4 h-4 text-blue-700' /> */}
                      <div className='flex-1'>
                        <div className='flex justify-between items-center'>
                          <p className='font-medium'>Lavagem Externa</p>
                          <span className='text-base font-bold text-blue-700'>
                            R$ 40
                          </span>
                        </div>
                        <p className=''>Remova a sujeira e recupere o brilho</p>
                      </div>
                    </Label>
                  </div>

                  <div className='flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-muted/50'>
                    <RadioGroupItem
                      value='completa'
                      id='completa'
                      label=''
                      checked={washType === 'completa'}
                      onChange={() => setWashType('completa')}
                    />
                    <Label
                      htmlFor='completa'
                      className='flex items-center gap-2 cursor-pointer flex-1'
                    >
                      {/* <Shield className='w-4 h-4 text-blue-700' /> */}
                      <div className='flex-1'>
                        <div className='flex justify-between items-center'>
                          <p className='font-medium'>Lavagem Completa</p>
                          <span className='text-base font-bold text-blue-700'>
                            R$ 80
                          </span>
                        </div>
                        <p className=''>Cuidado total por dentro e por fora</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Dados do Veículo</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='carOwner' className='mb-2'>
                    Proprietário do Carro
                  </Label>
                  <Input
                    id='carOwner'
                    placeholder='Nome do proprietário'
                    value={carOwner}
                    onChange={(e) => setCarOwner(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor='plate' className='mb-2'>
                    Placa do Carro
                  </Label>
                  <Input
                    id='plate'
                    placeholder='ABC-1234'
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor='phone' className='mb-2'>
                    Número de Telefone
                  </Label>
                  <Input
                    id='phone'
                    placeholder='(11) 99999-9999'
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modelo do Carro</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor='carModel' className='mb-2'>
                    Selecione o modelo do seu carro
                  </Label>
                  <Select
                    value={carModel}
                    onChange={setCarModel}
                    placeholder='Escolha o modelo'
                  >
                    <SelectItem value='sedan'>Sedan</SelectItem>
                    <SelectItem value='hatch'>Hatch</SelectItem>
                    <SelectItem value='suv'>SUV</SelectItem>
                    <SelectItem value='pickup'>Pickup</SelectItem>
                    <SelectItem value='van'>Van</SelectItem>
                    <SelectItem value='coupe'>Coupé</SelectItem>
                    <SelectItem value='conversivel'>Conversível</SelectItem>
                    <SelectItem value='wagon'>Station Wagon</SelectItem>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='flex justify-center mt-8'>
          <Button
            className='bg-blue-700 hover:bg-accent/90 text-lg py-6 px-12'
            onClick={handleConfirmBooking}
            disabled={!isFormComplete}
          >
            Revisar Agendamento
          </Button>
        </div>
      </div>
    </div>
  )
}
