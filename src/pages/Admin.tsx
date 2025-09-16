import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { Calendar, Clock, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Agendamento {
  id: number
  cliente: string
  data: string
  horario: string
  servico: string
  valor: number
  status: string
  placa: string
  telefone: string
  modelo: string
}

export function Admin() {
  const [selectedAgendamento, setSelectedAgendamento] =
    useState<Agendamento | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [agendamentosRecentes, setAgendamentosRecentes] = useState<
    Agendamento[]
  >([
    {
      id: 1,
      cliente: 'João Silva',
      data: 'Hoje',
      horario: '09:00',
      servico: 'Completa',
      valor: 80,
      status: 'Confirmado',
      placa: 'ABC-1234',
      telefone: '(11) 99999-9999',
      modelo: 'Sedan',
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      data: 'Hoje',
      horario: '10:30',
      servico: 'Externa',
      valor: 40,
      status: 'Confirmado',
      placa: 'XYZ-5678',
      telefone: '(11) 88888-8888',
      modelo: 'Hatch',
    },
    {
      id: 3,
      cliente: 'Pedro Costa',
      data: 'Hoje',
      horario: '14:00',
      servico: 'Interna',
      valor: 50,
      status: 'Confirmado',
      placa: 'DEF-9012',
      telefone: '(11) 77777-7777',
      modelo: 'SUV',
    },
  ])

  const handleVerDetalhes = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento)
    setShowModal(true)
  }

  const handleCancelAgendamento = (id: number) => {
    setAgendamentosRecentes((prev) =>
      prev.filter((agendamento) => agendamento.id !== id)
    )

    setShowModal(false)
    setSelectedAgendamento(null)
    console.log('Agendamento cancelado:', id)
  }

  return (
    <div className='min-h-screen'>
      <header className='border-b border-gray-300'>
        <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
          <div className='font-heading font-bold text-2xl text-primary'>
            Lustro Admin
          </div>

          <div className='flex items-center gap-3'>
            <Link to='/'>
              <Button variant='outline' size='sm'>
                <LogOut className='w-4 h-4 mr-2' />
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className='container mx-auto max-w-6xl px-4 py-8'>
        <div className='grid md:grid-cols-2 gap-6 mb-8'>
          <Link to='/admin/schedules'>
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardContent className='p-6 text-center '>
                <Calendar className='w-12 h-12 mx-auto mb-4 text-blue-700' />
                <h3 className='font-heading font-semibold text-lg text-primary mb-2'>
                  Ver Agendamentos
                </h3>
                <p>Gerencie todos os agendamentos dos clientes</p>
              </CardContent>
            </Card>
          </Link>

          <Link to='/admin/timetable'>
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardContent className='p-6 text-center'>
                <Clock className='w-12 h-12 mx-auto mb-4 text-blue-700' />
                <h3 className='font-heading font-semibold text-lg text-primary mb-2'>
                  Horários de Trabalho
                </h3>
                <p>Configure dias e horários de funcionamento</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='font-heading text-xl text-primary'>
              Agendamentos de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {agendamentosRecentes.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className='flex items-center justify-between p-4 border border-gray-300 rounded-lg'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-4'>
                      <div>
                        <p className='font-medium text-primary'>
                          {agendamento.cliente}
                        </p>
                        <p className='text-sm '>
                          {agendamento.data} às {agendamento.horario}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                      {agendamento.status}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleVerDetalhes(agendamento)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {showModal && selectedAgendamento && (
        <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-300 shadow-lg'>
            <h3 className='text-lg font-semibold mb-4 text-primary'>
              Detalhes do Agendamento
            </h3>
            <div className='space-y-3'>
              <div>
                <span className='font-medium text-primary'>Cliente:</span>{' '}
                <span className='text-foreground'>
                  {selectedAgendamento.cliente}
                </span>
              </div>
              <div>
                <span className='font-medium text-primary'>Data:</span>{' '}
                <span className='text-foreground'>
                  {selectedAgendamento.data} às {selectedAgendamento.horario}
                </span>
              </div>
              <div>
                <span className='font-medium text-primary'>Serviço:</span>{' '}
                <span className='text-foreground'>
                  Lavagem {selectedAgendamento.servico}
                </span>
              </div>
              <div>
                <span className='font-medium text-primary'>Valor:</span>{' '}
                <span className='text-foreground'>
                  R$ {selectedAgendamento.valor}
                </span>
              </div>
              <div>
                <span className='font-medium text-primary'>Placa:</span>{' '}
                <span className='text-foreground'>
                  {selectedAgendamento.placa}
                </span>
              </div>
              <div>
                <span className='font-medium text-primary'>Telefone:</span>{' '}
                <span className='text-foreground'>
                  {selectedAgendamento.telefone}
                </span>
              </div>
              <div>
                <span className='font-medium text-primary'>Modelo:</span>{' '}
                <span className='text-foreground'>
                  {selectedAgendamento.modelo}
                </span>
              </div>
              <div>
                <span className='font-medium text-primary'>Status:</span>{' '}
                <span className='text-foreground'>
                  {selectedAgendamento.status}
                </span>
              </div>
            </div>
            <div className='flex gap-2 mt-6'>
              <Button
                variant='outline'
                onClick={() => setShowModal(false)}
                className='flex-1'
              >
                Fechar
              </Button>
              <Button
                variant='destructive'
                className='flex-1'
                onClick={() => handleCancelAgendamento(selectedAgendamento.id)}
              >
                Cancelar agendamento
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
