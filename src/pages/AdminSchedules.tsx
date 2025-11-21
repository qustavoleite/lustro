import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { DeleteBookingModal } from '../components/DeleteBookingModal'
import {
  Calendar,
  Clock,
  Car,
  Phone,
  CreditCard,
  LogOut,
  ArrowLeft,
  Loader,
  RefreshCw,
  CarFront,
  LayoutTemplate,
  X,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { API_BASE_URL } from '../config/api'
import { logout } from '../utils/auth'

interface Agendamento {
  id: number
  data_agendamento: string
  horario_agendamento: string
  servico_id: number
  veiculo_placa: string
  modelo_veiculo_nome: string
  nome_proprietario: string
  telefone: string
  observacoes: string
  status: string
  servico_nome?: string
  valor_total?: number
  phone?: string
  telefone_contato?: string
  placa_veiculo?: string
  modelo?: string
  marca?: string
  cor?: string
  tipo_veiculo?: string
}

export function AdminSchedules() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [cancelingId, setCancelingId] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAgendamentoId, setSelectedAgendamentoId] = useState<
    number | null
  >(null)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }

      if (!isAdmin) {
        navigate('/schedule')
        return
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate])

  const fetchAgendamentos = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('authToken')

      if (!token) {
        setError('Token de autenticação não encontrado')
        setLoading(false)
        return
      }

      const userData = localStorage.getItem('user')
      let isUserAdmin = false
      if (userData) {
        try {
          const user = JSON.parse(userData)
          isUserAdmin =
            user &&
            (user.email === 'admin@gmail.com' ||
              user.email === 'admin@lustro.com' ||
              user.role === 'admin')
        } catch {
          void 0
        }
      }

      const endpoints = isUserAdmin
        ? [
            `${API_BASE_URL}/admin/dashboard/agendamentos`,
            `${API_BASE_URL}/agendamentos`,
          ]
        : [`${API_BASE_URL}/agendamentos`]

      let agendamentosArray: unknown[] = []
      let lastError = ''

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            if (response.status === 401) {
              lastError =
                'API não autorizou o acesso. Verifique se o backend está configurado corretamente.'
              continue
            } else if (response.status === 403) {
              lastError = 'Acesso negado. Permissões insuficientes.'
              continue
            } else if (response.status === 404) {
              lastError = `Endpoint não encontrado: ${endpoint}`
              continue
            } else {
              lastError = `Erro ${response.status}: ${response.statusText}`
              continue
            }
          }

          const data = await response.json()

          if (Array.isArray(data)) {
            agendamentosArray = data
          } else if (data.agendamentos && Array.isArray(data.agendamentos)) {
            agendamentosArray = data.agendamentos
          } else if (data.data && Array.isArray(data.data)) {
            agendamentosArray = data.data
          } else if (data.results && Array.isArray(data.results)) {
            agendamentosArray = data.results
          } else {
            const arrays = Object.values(data).filter((value) =>
              Array.isArray(value)
            )
            if (arrays.length > 0) {
              agendamentosArray = arrays[0] as unknown[]
            } else {
              lastError = `Formato de resposta não reconhecido do endpoint ${endpoint}`
              continue
            }
          }

          if (agendamentosArray.length > 0) {
            break
          } else if (endpoint === endpoints[0]) {
            if (!isUserAdmin) {
              break
            }
          }
        } catch (err) {
          lastError = err instanceof Error ? err.message : 'Erro desconhecido'
          continue
        }
      }

      if (
        agendamentosArray.length === 0 &&
        lastError &&
        !lastError.includes('404')
      ) {
        setError(lastError)
      }

      const normalizedAgendamentos: Agendamento[] = (
        agendamentosArray as Record<string, unknown>[]
      ).map((ag) => ({
        id: Number(ag.id) || 0,
        data_agendamento: String(ag.data_agendamento || ag.data || ''),
        horario_agendamento: String(ag.horario_agendamento || ag.horario || ''),
        servico_id: Number(ag.servico_id) || 0,
        veiculo_placa: String(
          ag.veiculo_placa || ag.placa_veiculo || ag.placa || ''
        ),
        modelo_veiculo_nome: String(
          ag.modelo_veiculo_nome || ag.modelo_veiculo || ag.modelo || ''
        ),
        nome_proprietario: String(
          ag.nome_proprietario || ag.cliente_nome || ''
        ),
        telefone: String(
          ag.telefone ||
            ag.telefone_cliente ||
            ag.phone ||
            ag.telefone_contato ||
            ''
        ),
        observacoes: String(ag.observacoes || ''),
        status: String(ag.status || 'agendado'),
        servico_nome: ag.servico_nome ? String(ag.servico_nome) : undefined,
        valor_total:
          ag.valor_total != null ? Number(ag.valor_total) : undefined,
        placa_veiculo: String(
          ag.placa_veiculo || ag.veiculo_placa || ag.placa || ''
        ),
        modelo: String(
          ag.modelo || ag.modelo_veiculo_nome || ag.modelo_veiculo || ''
        ),
        marca: ag.marca ? String(ag.marca) : undefined,
        cor: ag.cor ? String(ag.cor) : undefined,
        tipo_veiculo: ag.tipo_veiculo ? String(ag.tipo_veiculo) : undefined,
      }))

      setAgendamentos(normalizedAgendamentos)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar agendamentos'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && isAdmin && !authLoading) {
      fetchAgendamentos()
    }
  }, [isAuthenticated, isAdmin, authLoading, retryCount])

  const getServicoNome = (ag: Agendamento): string => {
    if (ag.servico_nome) return ag.servico_nome
    const servicos: { [key: number]: string } = {
      1: 'Lavagem Externa',
      2: 'Lavagem Interna',
      3: 'Lavagem Completa',
    }
    return servicos[ag.servico_id] || 'Servico'
  }

  const getValor = (ag: Agendamento): number => {
    if (ag.valor_total) return ag.valor_total
    const valores: { [key: number]: number } = { 1: 40, 2: 50, 3: 80 }
    return valores[ag.servico_id] || 0
  }

  const formatPlaca = (placa: string): string => {
    if (!placa) return 'Nao informada'
    const clean = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    if (clean.length <= 3) return clean
    if (clean.length <= 7) return `${clean.slice(0, 3)}-${clean.slice(3)}`
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}`
  }

  const formatTelefone = (telefone: string): string => {
    if (!telefone || telefone.trim() === '') return 'Nao informado'
    try {
      const digits = telefone.replace(/\D/g, '').slice(0, 11)
      if (digits.length <= 2) return `(${digits}`
      if (digits.length <= 6)
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
      if (digits.length <= 10)
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(
          6
        )}`
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    } catch {
      return telefone || 'Nao informado'
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Data não informada'

    try {
      const [year, month, day] = dateStr.split('-').map(Number)
      const date = new Date(year, month - 1, day)

      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const formatHorario = (horario: string): string => {
    if (!horario) return '--:--'
    const parts = horario.split(':')
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
    }
    return horario
  }

  const handleOpenDeleteModal = (id: number) => {
    setSelectedAgendamentoId(id)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    if (cancelingId === null) {
      setShowDeleteModal(false)
      setSelectedAgendamentoId(null)
    }
  }

  const handleCancelBooking = async () => {
    if (!selectedAgendamentoId) return

    setCancelingId(selectedAgendamentoId)

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Sessao expirada')
        setCancelingId(null)
        return
      }

      const userData = localStorage.getItem('user')
      let isUserAdmin = false
      if (userData) {
        try {
          const user = JSON.parse(userData)
          isUserAdmin =
            user &&
            (user.email === 'admin@gmail.com' ||
              user.email === 'admin@lustro.com' ||
              user.role === 'admin')
        } catch {
          void 0
        }
      }

      const endpoints = isUserAdmin
        ? [
            `${API_BASE_URL}/agendamentos/${selectedAgendamentoId}`,
            `${API_BASE_URL}/admin/dashboard/agendamentos/${selectedAgendamentoId}`,
          ]
        : [`${API_BASE_URL}/agendamentos/${selectedAgendamentoId}`]

      let response: Response | null = null
      let lastError = ''

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            break
          } else {
            lastError = `Erro ${response.status}: ${response.statusText}`

            if (response.status === 400) {
              const errorData = await response.json().catch(() => ({}))
              if (
                errorData.error &&
                (errorData.error.includes('cancelado') ||
                  errorData.error.includes('concluído'))
              ) {
                setAgendamentos((prev) =>
                  prev.filter((ag) => ag.id !== selectedAgendamentoId)
                )
                alert('Este agendamento já foi cancelado ou concluído.')
                setCancelingId(null)
                setShowDeleteModal(false)
                setSelectedAgendamentoId(null)
                return
              }
            }

            if (endpoint === endpoints[0] && endpoints.length > 1) {
              continue
            } else {
              break
            }
          }
        } catch (err) {
          lastError = err instanceof Error ? err.message : 'Erro desconhecido'
          if (endpoint === endpoints[0] && endpoints.length > 1) {
            continue
          }
        }
      }

      if (!response) {
        const errorMsg = lastError || 'Nenhuma resposta recebida'
        throw new Error(errorMsg)
      }

      if (response.ok) {
        setAgendamentos((prev) =>
          prev.filter((ag) => ag.id !== selectedAgendamentoId)
        )
        setShowDeleteModal(false)
        setSelectedAgendamentoId(null)
      } else {
        const errorText = await response.text().catch(() => 'Erro desconhecido')
        alert(`Erro ao cancelar agendamento: ${response.status}. ${errorText}`)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido'
      alert(`Erro ao cancelar agendamento: ${errorMessage}`)
    } finally {
      setCancelingId(null)
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  const activeAgendamentos = agendamentos.filter(
    (ag) =>
      !['cancelado', 'concluido', 'concluído'].includes(ag.status.toLowerCase())
  )

  if (authLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Loader className='w-12 h-12 animate-spin mx-auto mb-4 text-blue-700' />
          <p className='text-lg'>Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Loader className='w-12 h-12 animate-spin mx-auto mb-4 text-blue-700' />
          <p className='text-lg'>Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='border-b border-gray-300 bg-white'>
        <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link to='/admin'>
              <Button variant='outline' size='sm'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Voltar
              </Button>
            </Link>
            <div className='font-heading font-bold text-2xl '>Lustro Admin</div>
          </div>

          <div className='flex items-center gap-3'>
            <Button variant='outline' size='sm' onClick={logout}>
              <LogOut className='w-4 h-4 mr-2' />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className='container mx-auto max-w-4xl px-4 py-12'>
        <div className='text-center mb-12'>
          <h1 className='font-heading font-bold text-3xl md:text-4xl  mb-4'>
            Agendamentos dos Clientes
          </h1>
          <p className='text-lg'>Visualize e gerencie todos os agendamentos</p>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6'>
            <div className='flex justify-between items-center'>
              <span>{error}</span>
              <Button variant='outline' size='sm' onClick={handleRetry}>
                <RefreshCw className='w-4 h-4 mr-2' />
                Recarregar
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className='text-center py-12'>
            <Loader className='w-12 h-12 animate-spin mx-auto mb-4 text-blue-700' />
            <p>Carregando agendamentos...</p>
          </div>
        ) : activeAgendamentos.length === 0 ? (
          <Card>
            <CardContent className='text-center py-12'>
              <Calendar className='w-16 h-16 mx-auto mb-4 text-gray-400' />
              <h3 className='text-xl font-semibold  mb-2'>
                Nenhum agendamento encontrado
              </h3>
              <p className='mb-6 text-gray-600'>
                Ainda nao ha agendamentos realizados pelos clientes.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-6'>
            {activeAgendamentos.map((ag) => (
              <Card key={ag.id} className='hover:shadow-lg transition-shadow'>
                <CardHeader className='flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 pb-4'>
                  <CardTitle className='text-lg'>Agendamento</CardTitle>
                  <div className='flex flex-row items-center gap-3'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleOpenDeleteModal(ag.id)}
                      disabled={cancelingId === ag.id || showDeleteModal}
                    >
                      <X className='w-4 h-4 mr-1' />
                      Cancelar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Data:</span>
                        <span>{formatDate(ag.data_agendamento)}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Clock className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Horario:</span>
                        <span>{formatHorario(ag.horario_agendamento)}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Car className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Servico:</span>
                        <span>{getServicoNome(ag)}</span>
                      </div>
                    </div>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <CarFront className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Veiculo:</span>
                        <span>
                          {ag.modelo_veiculo_nome ||
                            ag.modelo ||
                            'Nao informado'}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <LayoutTemplate className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Placa:</span>
                        <span>
                          {formatPlaca(
                            ag.veiculo_placa || ag.placa_veiculo || ''
                          )}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Phone className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Telefone:</span>
                        <span>
                          {ag.telefone && ag.telefone.trim() !== ''
                            ? formatTelefone(ag.telefone)
                            : 'Nao informado'}
                        </span>
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
                        R$ {getValor(ag)},00
                      </span>
                    </div>
                    {ag.nome_proprietario && (
                      <div className='flex items-center gap-2 mt-2'>
                        <span className='font-medium'>Cliente:</span>
                        <span>{ag.nome_proprietario}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DeleteBookingModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleCancelBooking}
        isLoading={cancelingId !== null}
        title='Cancelar Agendamento'
        message='Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.'
      />
    </div>
  )
}
