import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { Calendar, Clock, LogOut, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'
import { logout } from '../utils/auth'

interface Agendamento {
  id: number
  data_agendamento: string
  horario_agendamento?: string
  servico_id: number
  placa_veiculo: string
  tipo_veiculo: string
  marca: string
  modelo: string
  cor?: string
  telefone: string
  observacoes: string
  status: string
  cliente_nome?: string
  nome_proprietario?: string
}

export function Admin() {
  const [selectedAgendamento, setSelectedAgendamento] =
    useState<Agendamento | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [agendamentosRecentes, setAgendamentosRecentes] = useState<
    Agendamento[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAgendamentosDeHoje = async () => {
      try {
        setLoading(true)
        setError('')

        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('user')

        if (!token) {
          setError('Token de autenticação não encontrado')
          setLoading(false)
          return
        }

        let isUserAdmin = false
        if (userData) {
          try {
            const user = JSON.parse(userData)
            isUserAdmin = user && user.email === 'admin@lustro.com'
          } catch {
            // Ignorar erro de parse
          }
        }

        if (!isUserAdmin) {
          setError(
            'Acesso negado. Apenas administradores podem acessar esta página.'
          )
          setLoading(false)
          return
        }

        const endpoint = `${API_BASE_URL}/admin/dashboard/agendamentos-hoje`

        let agendamentosDeHoje: Agendamento[] = []
        let hasError = false

        try {
          const fetchOptions: RequestInit = {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            mode: 'cors',
            credentials: 'omit',
          }

          const response = await fetch(endpoint, fetchOptions)

          if (response.ok) {
            const data = await response.json()

            let agendamentos: Agendamento[] = []

            if (Array.isArray(data)) {
              agendamentos = data
            } else if (
              data.agendamentos &&
              Array.isArray(data.agendamentos)
            ) {
              agendamentos = data.agendamentos
            } else if (data.data && Array.isArray(data.data)) {
              agendamentos = data.data
            } else if (data.results && Array.isArray(data.results)) {
              agendamentos = data.results
            } else {
              const arrays = Object.values(data).filter((value) =>
                Array.isArray(value)
              )
              if (arrays.length > 0) {
                agendamentos = arrays[0]
              }
            }

            const normalizedAgendamentos: Agendamento[] = (
              agendamentos as Record<string, unknown>[]
            )
              .filter((ag) => {
                const status = String(ag.status || '').toLowerCase().trim()
                return !['cancelado', 'expirado'].includes(status)
              })
              .map((ag) => ({
                id: Number(ag.id) || 0,
                data_agendamento: String(ag.data_agendamento || ag.data || ''),
                horario_agendamento: ag.horario_agendamento
                  ? String(ag.horario_agendamento)
                  : undefined,
                servico_id: Number(ag.servico_id) || 0,
                placa_veiculo: String(
                  ag.veiculo_placa ||
                    ag.placa_veiculo ||
                    ag.placa ||
                    ''
                ),
                tipo_veiculo: String(ag.tipo_veiculo || ''),
                marca: String(ag.marca || ''),
                modelo: String(
                  ag.modelo_veiculo_nome ||
                    ag.modelo ||
                    ag.modelo_veiculo ||
                    ''
                ),
                telefone: String(
                  ag.telefone_veiculo ||
                    ag.telefone ||
                    ag.cliente_telefone ||
                    ag.telefone_cliente ||
                    ag.phone ||
                    ag.telefone_contato ||
                    ''
                ),
                observacoes: String(ag.observacoes || ''),
                status: String(ag.status || 'agendado'),
                cliente_nome: ag.cliente_nome ? String(ag.cliente_nome) : undefined,
                nome_proprietario: ag.nome_proprietario
                  ? String(ag.nome_proprietario)
                  : undefined,
              }))

            agendamentosDeHoje = normalizedAgendamentos

            agendamentosDeHoje.sort((a, b) => {
              try {
                const horaA = a.horario_agendamento || '00:00'
                const horaB = b.horario_agendamento || '00:00'
                return horaA.localeCompare(horaB)
              } catch {
                return 0
              }
            })
          } else {
            if (response.status === 401) {
              setError('Token inválido ou expirado. Faça login novamente.')
              hasError = true
              localStorage.removeItem('authToken')
            } else if (response.status === 403) {
              setError('Acesso não autorizado')
              hasError = true
            } else if (response.status === 404) {
              setError('Endpoint não encontrado')
              hasError = true
            } else if (response.status === 500) {
              setError(
                'Erro interno do servidor. Tente novamente mais tarde.'
              )
              hasError = true
            } else {
              setError(`Erro ${response.status}: ${response.statusText}`)
              hasError = true
            }
          }
        } catch (err) {
          if (err instanceof Error) {
            if (err.name === 'AbortError') {
              if (agendamentosDeHoje.length > 0) {
                setError('')
              } else {
                setError('Tempo de requisição esgotado. Alguns agendamentos podem não ter sido carregados.')
              }
              hasError = true
            } else if (
              err.name === 'TypeError' &&
              err.message.includes('Failed to fetch')
            ) {
              if (agendamentosDeHoje.length > 0) {
                setError('')
              } else {
                setError('Erro de conexão com o servidor')
              }
              hasError = true
            } else {
              if (agendamentosDeHoje.length > 0) {
                setError('')
              } else {
                setError(`Erro: ${err.message}`)
              }
              hasError = true
            }
          } else {
            if (agendamentosDeHoje.length > 0) {
              setError('')
            } else {
              setError('Erro desconhecido ao carregar agendamentos')
            }
            hasError = true
          }
        }

        if (agendamentosDeHoje.length === 0 && !hasError) {
          setError('Nenhum agendamento encontrado para hoje.')
        }

        setAgendamentosRecentes(agendamentosDeHoje)
      } catch {
        setError('Erro inesperado ao carregar agendamentos. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchAgendamentosDeHoje()
  }, [])

  const getServicoNome = (servicoId: number): string => {
    const servicos = {
      1: 'Externa',
      2: 'Interna',
      3: 'Completa',
    }
    return (
      servicos[servicoId as keyof typeof servicos] || `Serviço ${servicoId}`
    )
  }

  const getServicoValor = (servicoId: number): number => {
    const valores = {
      1: 40,
      2: 50,
      3: 80,
    }
    return valores[servicoId as keyof typeof valores] || 0
  }

  const formatarHorario = (horario: string | undefined): string => {
    if (!horario) return '--:--'
    
    try {
      const partes = String(horario).split(':')
      if (partes.length >= 2) {
        const hora = partes[0].padStart(2, '0')
        const minuto = partes[1].padStart(2, '0')
        return `${hora}:${minuto}`
      }
      return String(horario)
    } catch {
      return '--:--'
    }
  }

  const extrairNomeCliente = (
    agendamento: Agendamento
  ): string => {
    if (agendamento.cliente_nome && agendamento.cliente_nome.trim() !== '') {
      return agendamento.cliente_nome
    }
    
    if (
      agendamento.nome_proprietario &&
      agendamento.nome_proprietario.trim() !== ''
    ) {
      return agendamento.nome_proprietario
    }
    
    if (agendamento.observacoes) {
      const match = agendamento.observacoes.match(/Proprietário:\s*(.+)/i)
      if (match) {
        return match[1].trim()
      }
    }
    
    return 'Cliente não informado'
  }

  const handleVerDetalhes = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento)
    setShowModal(true)
  }

  return (
    <div className='min-h-screen animate-in fade-in duration-500'>
      <header className='border-b border-gray-300 animate-in slide-in-from-top duration-300'>
        <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
          <div className='font-heading font-bold text-2xl'>
            Lustro Admin
          </div>

          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={logout}
            >
              <LogOut className='w-4 h-4 mr-2' />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className='container mx-auto max-w-6xl px-4 py-8 animate-in fade-in slide-in-from-bottom duration-500 delay-100'>
        <div className='grid md:grid-cols-2 gap-6 mb-8'>
          <Link to='/admin/schedules'>
            <Card className='hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer animate-in fade-in slide-in-from-left duration-500 delay-200'>
              <CardContent className='p-6 text-center '>
                <Calendar className='w-12 h-12 mx-auto mb-4 text-blue-700' />
                <h3 className='font-heading font-semibold text-lg mb-2'>
                  Ver Agendamentos
                </h3>
                <p>Gerencie todos os agendamentos dos clientes</p>
              </CardContent>
            </Card>
          </Link>

          <Link to='/admin/timetable'>
            <Card className='hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer animate-in fade-in slide-in-from-right duration-500 delay-200'>
              <CardContent className='p-6 text-center'>
                <Clock className='w-12 h-12 mx-auto mb-4 text-blue-700' />
                <h3 className='font-heading font-semibold text-lg mb-2'>
                  Horários de Trabalho
                </h3>
                <p>Configure dias e horários de funcionamento</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className='animate-in fade-in slide-in-from-bottom duration-500 delay-300'>
          <CardHeader>
            <CardTitle className='font-heading text-xl'>
              Agendamentos de Hoje{' '}
              {agendamentosRecentes.length > 0 &&
                `(${agendamentosRecentes.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='text-center py-8'>
                <Loader className='w-8 h-8 animate-spin mx-auto mb-4 text-blue-700' />
                <p>Carregando agendamentos de hoje...</p>
              </div>
            ) : error ? (
              <div className='text-center py-8'>
                <Calendar className='w-12 h-12 mx-auto mb-4 text-gray-400' />
                <p className='text-yellow-600 mb-2'>{error}</p>
              </div>
            ) : agendamentosRecentes.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <Calendar className='w-12 h-12 mx-auto mb-4 text-gray-400' />
                <p className='text-lg font-medium mb-2'>
                  Nenhum agendamento para hoje
                </p>
                <p className='text-sm'>
                  Não há agendamentos registrados para o dia de hoje
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {agendamentosRecentes.map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className='flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:shadow-md transition-shadow'
                  >
                    <div className='flex-1'>
                      <div className='flex items-center gap-4'>
                        <div className='flex-1'>
                          <p className='font-medium'>
                            {extrairNomeCliente(agendamento)}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Hoje às{' '}
                            {formatarHorario(agendamento.horario_agendamento)}
                          </p>
                          <p className='text-sm text-gray-600'>
                            {agendamento.placa_veiculo} •{' '}
                            {getServicoNome(agendamento.servico_id)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          agendamento.status === 'confirmado' ||
                          agendamento.status === 'agendado'
                            ? 'bg-green-100 text-green-800'
                            : agendamento.status === 'pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : agendamento.status === 'concluido' ||
                              agendamento.status === 'concluído'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {agendamento.status === 'concluido' ||
                        agendamento.status === 'concluído'
                          ? 'Concluído'
                          : agendamento.status === 'confirmado' ||
                            agendamento.status === 'agendado'
                          ? 'Confirmado'
                          : agendamento.status || 'Agendado'}
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
            )}
          </CardContent>
        </Card>
      </div>

      {showModal && selectedAgendamento && (
        <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-auto border border-gray-300 shadow-lg max-h-[90vh] overflow-y-auto'>
            <h3 className='text-lg font-semibold mb-4'>
              Detalhes do Agendamento
            </h3>
            <div className='space-y-3'>
              <div>
                <span className='font-medium block text-sm'>
                  Cliente:
                </span>
                <span className='text-foreground'>
                  {extrairNomeCliente(selectedAgendamento)}
                </span>
              </div>
              <div>
                <span className='font-medium block text-sm'>
                  Horário:
                </span>
                <span className='text-foreground'>
                  {formatarHorario(selectedAgendamento.horario_agendamento)}
                </span>
              </div>
              <div>
                <span className='font-medium block text-sm'>
                  Serviço:
                </span>
                <span className='text-foreground'>
                  Lavagem {getServicoNome(selectedAgendamento.servico_id)}
                </span>
              </div>
              <div>
                <span className='font-medium block text-sm'>
                  Valor:
                </span>
                <span className='text-foreground'>
                  R$ {getServicoValor(selectedAgendamento.servico_id)},00
                </span>
              </div>
              <div>
                <span className='font-medium block text-sm'>
                  Placa:
                </span>
                <span className='text-foreground'>
                  {selectedAgendamento.placa_veiculo}
                </span>
              </div>
              <div>
                <span className='font-medium block text-sm'>
                  Telefone:
                </span>
                <span className='text-foreground'>
                  {selectedAgendamento.telefone}
                </span>
              </div>
              <div>
                <span className='font-medium block text-sm'>
                  Modelo:
                </span>
                <span className='text-foreground capitalize'>
                  {selectedAgendamento.modelo}
                </span>
              </div>
              <div>
                <span className='font-medium block text-sm'>
                  Marca:
                </span>
                <span className='text-foreground capitalize'>
                  {selectedAgendamento.marca}
                </span>
              </div>
              <div>
                <span className='font-medium block text-sm'>
                  Cor:
                </span>
                <span className='text-foreground capitalize'>
                  {selectedAgendamento.cor}
                </span>
              </div>
              <div>
                <span className='font-medium block text-sm'>
                  Status:
                </span>
                <span className='text-foreground capitalize'>
                  {selectedAgendamento.status || 'agendado'}
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
