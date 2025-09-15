import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { Input } from '../components/Input'
import { Badge } from '../components/Badge'
import {
  Calendar,
  Clock,
  Car,
  Phone,
  X,
  Search,
  ArrowLeft,
  Check,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export function AdminSchedules() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgendamento, setSelectedAgendamento] = useState<{
    id: number
    cliente: string
    email: string
    telefone: string
    data: string
    horario: string
    tipoLavagem: string
    modeloCarro: string
    placa: string
    valor: number
    status: string
  } | null>(null)
  const [concluidos, setConcluidos] = useState<number[]>([])

  const agendamentos = [
    {
      id: 1,
      cliente: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-1111',
      data: '17/01/2025',
      horario: '09:00',
      tipoLavagem: 'Completa',
      modeloCarro: 'Sedan',
      placa: 'ABC-1234',
      valor: 80,
      status: 'Confirmado',
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '(11) 99999-2222',
      data: '17/01/2025',
      horario: '10:30',
      tipoLavagem: 'Externa',
      modeloCarro: 'Hatch',
      placa: 'DEF-5678',
      valor: 40,
      status: 'Confirmado',
    },
    {
      id: 3,
      cliente: 'Pedro Costa',
      email: 'pedro@email.com',
      telefone: '(11) 99999-3333',
      data: '18/01/2025',
      horario: '14:00',
      tipoLavagem: 'Interna',
      modeloCarro: 'SUV',
      placa: 'GHI-9012',
      valor: 50,
      status: 'Confirmado',
    },
    {
      id: 4,
      cliente: 'Ana Oliveira',
      email: 'ana@email.com',
      telefone: '(11) 99999-4444',
      data: '19/01/2025',
      horario: '16:00',
      tipoLavagem: 'Completa',
      modeloCarro: 'Pickup',
      placa: 'JKL-3456',
      valor: 80,
      status: 'Confirmado',
    },
  ]

  const filteredAgendamentos = agendamentos.filter(
    (agendamento) =>
      agendamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.placa.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCancelAgendamento = (id: number) => {
    console.log('Cancelando agendamento:', id)
    setSelectedAgendamento(null)
  }

  const handleMarcarConcluido = (id: number) => {
    setConcluidos((prev) => [...prev, id])
    console.log('Marcando agendamento como concluído:', id)
  }

  const isConcluido = (id: number) => concluidos.includes(id)

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b border-gray-300 sticky top-0 z-50'>
        <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
          <div className='font-heading font-bold text-2xl text-primary'>
            Lustro Admin
          </div>

          <div className='flex items-center gap-3'>
            <Link to='/admin'>
              <Button variant='outline' size='sm'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className='container mx-auto max-w-6xl px-4 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='font-heading font-bold text-3xl text-primary'>
            Agendamentos
          </h1>

          <div className='flex items-center gap-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2  w-4 h-4' />
              <Input
                placeholder='Buscar por placa'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 w-64'
              />
            </div>
          </div>
        </div>

        <div className='grid gap-6'>
          {filteredAgendamentos.map((agendamento) => (
            <Card
              key={agendamento.id}
              className='hover:shadow-lg transition-shadow'
            >
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1 grid md:grid-cols-4 gap-4'>
                    <div>
                      <p className='font-medium text-primary text-lg'>
                        {agendamento.cliente}
                      </p>
                      <p className='text-sm  flex items-center gap-1 mt-1'>
                        <Phone className='w-3 h-3 text-blue-700' />
                        {agendamento.telefone}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm  flex items-center gap-1'>
                        <Calendar className='w-3 h-3 text-blue-700' />
                        {agendamento.data}
                      </p>
                      <p className='text-sm  flex items-center gap-1 mt-1'>
                        <Clock className='w-3 h-3 text-blue-700' />
                        {agendamento.horario}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm font-medium text-primary'>
                        Lavagem {agendamento.tipoLavagem}
                      </p>
                      <p className='text-sm  flex items-center gap-1 mt-1'>
                        <Car className='w-3 h-3 text-blue-700' />
                        {agendamento.modeloCarro} - {agendamento.placa}
                      </p>
                    </div>

                    <div className='text-left'>
                      <p className='text-lg font-bold text-primary'>
                        R$ {agendamento.valor}
                      </p>
                      <Badge
                        variant='secondary'
                        className={
                          isConcluido(agendamento.id)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }
                      >
                        {isConcluido(agendamento.id)
                          ? 'Concluído'
                          : agendamento.status}
                      </Badge>
                    </div>
                  </div>

                  <div className='flex items-center gap-2 ml-4'>
                    {!isConcluido(agendamento.id) ? (
                      <Button
                        variant='default'
                        size='sm'
                        onClick={() => handleMarcarConcluido(agendamento.id)}
                        className='bg-green-600 hover:bg-green-700 text-white'
                      >
                        <Check className='w-4 h-4 mr-2' />
                        Marcar como Concluída
                      </Button>
                    ) : (
                      <Button
                        variant='outline'
                        size='sm'
                        disabled
                        className='bg-gray-100 text-gray-500'
                      >
                        <Check className='w-4 h-4 mr-2' />
                        Concluída
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAgendamentos.length === 0 && (
          <Card>
            <CardContent className='p-12 text-center'>
              <p className=''>Nenhum agendamento encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedAgendamento && (
        <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='font-heading text-xl text-primary'>
                Detalhes do Agendamento
              </CardTitle>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSelectedAgendamento(null)}
              >
                <X className='w-4 h-4' />
              </Button>
            </CardHeader>
            <CardContent>
              <div>
                <p className='text-sm'>Cliente</p>
                <p className='font-medium text-primary'>
                  {selectedAgendamento.cliente}
                </p>
              </div>

              <div>
                <p className='text-sm'>Contato</p>
                <p className='text-sm'>{selectedAgendamento.email}</p>
                <p className='text-sm'>{selectedAgendamento.telefone}</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm '>Data</p>
                  <p className='font-medium'>{selectedAgendamento.data}</p>
                </div>
                <div>
                  <p className='text-sm '>Horário</p>
                  <p className='font-medium'>{selectedAgendamento.horario}</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm '>Veículo</p>
                  <p className='font-medium'>
                    {selectedAgendamento.modeloCarro}
                  </p>
                </div>
                <div>
                  <p className='text-sm '>Placa</p>
                  <p className='font-medium'>{selectedAgendamento.placa}</p>
                </div>
              </div>

              <div>
                <p className='text-sm '>Valor</p>
                <p className='text-lg font-bold text-primary'>
                  R$ {selectedAgendamento.valor}
                </p>
              </div>

              <div className='flex gap-2 pt-4'>
                <Button
                  variant='outline'
                  className='flex-1 bg-transparent'
                  onClick={() => setSelectedAgendamento(null)}
                >
                  Fechar
                </Button>

                <Button
                  variant='destructive'
                  className='flex-1'
                  onClick={() =>
                    handleCancelAgendamento(selectedAgendamento.id)
                  }
                >
                  Cancelar agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
