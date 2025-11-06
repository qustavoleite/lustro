import { useState, useEffect } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { Label } from '../components/Label'
import { Select, SelectItem } from '../components/Select'
import { RadioGroup, RadioGroupItem } from '../components/RadioGroup'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, User, LogOut, Loader } from 'lucide-react'

interface ModeloVeiculo {
  id: number
  nome: string
  tipo: string
}

export function Schedule() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [washType, setWashType] = useState('')
  const [carModel, setCarModel] = useState('')
  const [plate, setPlate] = useState('')
  const [phone, setPhone] = useState('')
  const [carOwner, setCarOwner] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [modelosVeiculo, setModelosVeiculo] = useState<ModeloVeiculo[]>([])
  const [loadingModelos, setLoadingModelos] = useState(true)
  const [errorModelos, setErrorModelos] = useState('')

  const serviceMap = {
    externa: 1,
    interna: 2,
    completa: 3,
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setAuthToken(token)
  }, [])

  useEffect(() => {
    const fetchModelosVeiculo = async () => {
      try {
        setLoadingModelos(true)
        setErrorModelos('')

        const response = await fetch(
          'https://lustro-black.vercel.app/api/modelos-veiculo',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        let modelos = null

        if (Array.isArray(data)) {
          modelos = data
        } else if (data.data && Array.isArray(data.data)) {
          modelos = data.data
        } else if (data.modelos && Array.isArray(data.modelos)) {
          modelos = data.modelos
        } else if (data.results && Array.isArray(data.results)) {
          modelos = data.results
        }

        if (!modelos || modelos.length === 0) {
          throw new Error(
            'Nenhum modelo de veículo encontrado na resposta da API'
          )
        }

        setModelosVeiculo(modelos)
      } catch (err) {
        setErrorModelos(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar modelos de veículo da API.'
        )
        setModelosVeiculo([])
      } finally {
        setLoadingModelos(false)
      }
    }

    fetchModelosVeiculo()
  }, [])

  const prices = {
    externa: 40,
    interna: 50,
    completa: 80,
  }

  const formatPlate = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`
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

  const getUnavailableTimes = (date: string): string[] => {
    void date
    return []
  }

  const isTimeAvailable = (date: string, time: string) => {
    const selectedDateTime = new Date(`${date}T${time}`)
    const dayOfWeek = selectedDateTime.getDay()
    const hour = parseInt(time.split(':')[0])

    if (dayOfWeek === 0) return false
    if (hour < 8 || hour >= 18) return false

    return true
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
    if (!authToken) {
      alert(
        'Você precisa estar logado para fazer um agendamento. Redirecionando para login...'
      )
      navigate('/login')
      return
    }

    const errors = []
    if (!selectedDate) errors.push('Data é obrigatória')
    if (!selectedTime) errors.push('Horário é obrigatório')
    if (!washType) errors.push('Tipo de lavagem é obrigatório')
    if (!carModel) errors.push('Modelo do carro é obrigatório')
    if (!carOwner.trim()) errors.push('Proprietário é obrigatório')
    if (!plate.trim()) errors.push('Placa é obrigatória')
    if (phone.replace(/\D/g, '').length < 10)
      errors.push('Telefone é obrigatório')

    if (selectedDate) {
      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`)
      const dayOfWeek = selectedDateTime.getDay()
      if (dayOfWeek === 0) {
        errors.push('Não funcionamos aos domingos')
      }
    }

    if (errors.length > 0) {
      alert(`Por favor, corrija os seguintes campos:\n${errors.join('\n')}`)
      return
    }

    setShowSummary(true)
  }

  const handleFinalizeBooking = async () => {
    setIsProcessing(true)

    try {
      if (!authToken) {
        alert('Sessão expirada. Faça login novamente.')
        navigate('/login')
        return
      }

      const modeloSelecionado = modelosVeiculo.find(
        (modelo) => modelo.id === parseInt(carModel)
      )
      const tipoVeiculo = modeloSelecionado?.tipo || carModel

      const dataAgendamento = selectedDate
      const servicoId = serviceMap[washType as keyof typeof serviceMap]

      const backendPayload = {
        data_agendamento: dataAgendamento,
        horario_agendamento: selectedTime,
        servico_id: servicoId,
        placa_veiculo: plate.replace('-', '').toUpperCase(),
        placa: plate.replace('-', '').toUpperCase(),
        tipo_veiculo: tipoVeiculo,
        modelo_veiculo: modeloSelecionado?.nome || carModel,
        modelo_veiculo_id: modeloSelecionado?.id || parseInt(carModel),
        nome_proprietario: carOwner,
        telefone: phone.replace(/\D/g, ''),
        observacoes: `Proprietário: ${carOwner}`,
      }

      const response = await fetch(
        'https://lustro-black.vercel.app/api/agendamentos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(backendPayload),
        }
      )

      if (response.ok) {
        await response.json()
        navigate('/scheduling')
      } else {
        const detail = await response.text().catch(() => '')
        throw new Error(
          `Falha ao agendar no servidor (HTTP ${response.status}). ${
            detail || ''
          }`
        )
      }
    } catch (error) {
      alert(
        `Erro ao realizar agendamento: ${
          error instanceof Error ? error.message : 'Tente novamente.'
        }`
      )
    } finally {
      setIsProcessing(false)
    }
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

  const isFormComplete =
    !!selectedDate &&
    !!selectedTime &&
    !!washType &&
    !!carModel &&
    !!carOwner.trim() &&
    !!plate.trim() &&
    phone.replace(/\D/g, '').length >= 10

  if (showSummary) {
    const modeloSelecionado = modelosVeiculo.find(
      (modelo) => modelo.id === parseInt(carModel)
    )
    const nomeModelo = modeloSelecionado?.nome || carModel

    return (
      <div className='min-h-screen bg-background'>
        <header className='border-b border-gray-300'>
          <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
            <div className='font-heading font-bold text-2xl'>
              Lustro
            </div>
            <div className='flex items-center gap-4'>
              <Link to='/scheduling'>
                <Button variant='secondary' size='sm'>
                  <User className='w-4 h-4 mr-2' />
                  Agendamentos
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
                  <p className='font-medium capitalize'>{nomeModelo}</p>
                </div>
                <div>
                  <Label className='font-bold text-lg'>Proprietário</Label>
                  <p className='font-medium'>{carOwner}</p>
                </div>
                <div>
                  <Label className='font-bold text-lg'>Placa</Label>
                  <p className='font-medium'>{plate.toUpperCase()}</p>
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
                  disabled={isProcessing}
                >
                  Voltar
                </Button>
                <Button
                  className='flex-1 bg-blue-700 hover:bg-accent/90'
                  onClick={handleFinalizeBooking}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processando...' : 'Confirmar'}
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
      <header className='border-b border-gray-300'>
        <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
          <div className='font-heading font-bold text-2xl'>
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
          <h1 className='font-heading font-bold text-3xl md:text-4xl mb-4'>
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
                      const selectedDateObj = new Date(inputValue + 'T00:00:00')
                      const isSunday = selectedDateObj.getDay() === 0

                      if (isSunday) {
                        alert(
                          'Não funcionamos aos domingos. Por favor, escolha outro dia.'
                        )
                        return
                      }

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
                          getUnavailableTimes(selectedDate).includes(time) ||
                          !isTimeAvailable(selectedDate, time)

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
                                  ? 'bg-blue-700 hover:bg-accent/90 text-white'
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
                      <p className='text-xs mt-2 text-gray-600'>
                        * Horários em cinza não estão disponíveis
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
                      <div className='flex-1'>
                        <div className='flex justify-between items-center'>
                          <p className='font-medium'>Lavagem Interna</p>
                          <span className='text-base font-bold text-blue-700'>
                            R$ 50
                          </span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          Interior limpo e higienizado
                        </p>
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
                      <div className='flex-1'>
                        <div className='flex justify-between items-center'>
                          <p className='font-medium'>Lavagem Externa</p>
                          <span className='text-base font-bold text-blue-700'>
                            R$ 40
                          </span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          Remova a sujeira e recupere o brilho
                        </p>
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
                      <div className='flex-1'>
                        <div className='flex justify-between items-center'>
                          <p className='font-medium'>Lavagem Completa</p>
                          <span className='text-base font-bold text-blue-700'>
                            R$ 80
                          </span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          Cuidado total por dentro e por fora
                        </p>
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
                    onChange={(e) => setPlate(formatPlate(e.target.value))}
                    maxLength={8}
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
                    maxLength={15}
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

                  {loadingModelos ? (
                    <div className='flex items-center justify-center py-4'>
                      <Loader className='w-5 h-5 animate-spin mr-2' />
                      <span>Carregando modelos da API...</span>
                    </div>
                  ) : errorModelos ? (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm'>
                      <p className='font-semibold mb-1'>
                        Erro ao carregar modelos
                      </p>
                      <p>{errorModelos}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className='mt-2 text-xs underline hover:no-underline'
                      >
                        Tentar novamente
                      </button>
                    </div>
                  ) : modelosVeiculo.length === 0 ? (
                    <div className='bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md text-sm'>
                      Nenhum modelo disponível no momento.
                    </div>
                  ) : (
                    <Select
                      value={carModel}
                      onChange={setCarModel}
                      placeholder='Escolha o modelo'
                    >
                      {modelosVeiculo.map((modelo) => (
                        <SelectItem
                          key={modelo.id}
                          value={modelo.id.toString()}
                        >
                          {modelo.nome}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='flex justify-center mt-8'>
          <Button
            className='bg-blue-700 hover:bg-accent/90 text-lg py-6 px-12'
            onClick={handleConfirmBooking}
            disabled={!isFormComplete || loadingModelos}
          >
            {loadingModelos ? 'Carregando...' : 'Revisar Agendamento'}
          </Button>
        </div>
      </div>
    </div>
  )
}
