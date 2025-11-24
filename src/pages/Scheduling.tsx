import { useState, useEffect } from 'react'
import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { Badge } from '../components/Badge'
import { DeleteBookingModal } from '../components/DeleteBookingModal'
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
  Loader,
  RefreshCw,
} from 'lucide-react'
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
}

export function Scheduling() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState<number | null>(null)
  const [fetchError, setFetchError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAgendamentoId, setSelectedAgendamentoId] = useState<
    number | null
  >(null)

  const fetchAgendamentos = async () => {
    try {
      setLoading(true)
      setFetchError('')

      const token = localStorage.getItem('authToken')

      if (!token) {
        setFetchError('Token de autenticação não encontrado')
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/agendamentos`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        let agendamentosArray = data.agendamentos || []

        if (Array.isArray(data)) {
          agendamentosArray = data
        } else if (data.agendamentos && Array.isArray(data.agendamentos)) {
          agendamentosArray = data.agendamentos
        } else if (data.data && Array.isArray(data.data)) {
          agendamentosArray = data.data
        }

        const normalizedAgendamentos: Agendamento[] = (
          agendamentosArray as Record<string, unknown>[]
        ).map((ag) => ({
          id: Number(ag.id) || 0,
          data_agendamento: String(ag.data_agendamento || ag.data || ''),
          horario_agendamento: String(
            ag.horario_agendamento || ag.horario || ''
          ),
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
              ag.telefone_veiculo ||
              ag.telefone_cliente ||
              ag.cliente_telefone ||
              ag.phone ||
              ag.telefone_contato ||
              ''
          ),
          observacoes: String(ag.observacoes || ''),
          status: String(ag.status || 'agendado'),
          servico_nome: ag.servico_nome ? String(ag.servico_nome) : undefined,
          valor_total:
            ag.valor_total != null ? Number(ag.valor_total) : undefined,
        }))

        setAgendamentos(normalizedAgendamentos)
      } else {
        setFetchError(`Erro ${response.status}`)
      }
    } catch {
      setFetchError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgendamentos()
  }, [])

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
        alert('Sessão expirada')
        setCancelingId(null)
        setShowDeleteModal(false)
        setSelectedAgendamentoId(null)
        return
      }

      const response = await fetch(
        `${API_BASE_URL}/agendamentos/${selectedAgendamentoId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        setAgendamentos((prev) =>
          prev.filter((ag) => ag.id !== selectedAgendamentoId)
        )
        setShowDeleteModal(false)
        setSelectedAgendamentoId(null)
      } else {
        alert('Erro ao cancelar')
      }
    } catch {
      alert('Erro de conexão')
    } finally {
      setCancelingId(null)
    }
  }

  const getServicoNome = (ag: Agendamento): string => {
    if (ag.servico_nome) return ag.servico_nome
    const servicos: { [key: number]: string } = {
      1: 'Lavagem Externa',
      2: 'Lavagem Interna',
      3: 'Lavagem Completa',
    }
    return servicos[ag.servico_id] || 'Serviço'
  }

  const getValor = (ag: Agendamento): number => {
    if (ag.valor_total) return ag.valor_total
    const valores: { [key: number]: number } = { 1: 40, 2: 50, 3: 80 }
    return valores[ag.servico_id] || 0
  }

  const formatPlaca = (placa: string): string => {
    if (!placa) return 'Não informada'
    const clean = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    if (clean.length <= 3) return clean
    if (clean.length <= 7) return `${clean.slice(0, 3)}-${clean.slice(3)}`
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}`
  }

  const formatTelefone = (telefone: string): string => {
    if (!telefone || telefone.trim() === '') return 'Não informado'
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
      return telefone || 'Não informado'
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

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()

    if (statusLower === 'agendado' || statusLower === 'confirmado') {
      return (
        <Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100'>
          Agendado
        </Badge>
      )
    }

    if (statusLower === 'cancelado') {
      return (
        <Badge className='bg-red-100 text-red-800 hover:bg-red-100'>
          Cancelado
        </Badge>
      )
    }

    return <Badge variant='secondary'>{status}</Badge>
  }

  const activeAgendamentos = agendamentos.filter(
    (ag) =>
      !['cancelado', 'concluido', 'concluído'].includes(ag.status.toLowerCase())
  )

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Loader className='w-12 h-12 animate-spin mx-auto mb-4 text-blue-700' />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen animate-in fade-in duration-500'>
      <header className='border-b border-gray-300 animate-in slide-in-from-top duration-300'>
        <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
          <div className='font-heading font-bold text-2xl'>Lustro</div>
          <div className='flex items-center gap-4'>
            <Link to='/schedule'>
              <Button variant='outline' size='sm'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Agendar
              </Button>
            </Link>
            <Button variant='outline' size='sm' onClick={logout}>
              <LogOut className='w-4 h-4 mr-2' />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className='container mx-auto max-w-4xl px-4 py-12 animate-in fade-in slide-in-from-bottom duration-500 delay-100'>
        <div className='text-center mb-12 animate-in fade-in slide-in-from-bottom duration-500 delay-150'>
          <h1 className='font-heading font-bold text-3xl md:text-4xl mb-4'>
            Meus Agendamentos
          </h1>
          <p className='text-lg'>Visualize e gerencie seus agendamentos</p>
        </div>

        {fetchError && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6'>
            <div className='flex justify-between items-center'>
              <span>{fetchError}</span>
              <Button variant='outline' size='sm' onClick={fetchAgendamentos}>
                <RefreshCw className='w-4 h-4 mr-2' />
                Recarregar
              </Button>
            </div>
          </div>
        )}

        {activeAgendamentos.length === 0 ? (
          <Card className='animate-in fade-in slide-in-from-bottom duration-500 delay-200'>
            <CardContent className='text-center py-12'>
              <Car className='w-16 h-16 mx-auto mb-4 text-gray-400' />
              <h3 className='text-xl font-semibold mb-2'>
                Nenhum agendamento encontrado
              </h3>
              <p className='mb-6 text-gray-600'>
                Você ainda não possui agendamentos.
              </p>
              <Link to='/schedule'>
                <Button className='bg-blue-700 hover:bg-blue-800 transition-all duration-300 hover:scale-105'>
                  Fazer Agendamento
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-6'>
            {activeAgendamentos.map((ag, index) => (
              <Card
                key={ag.id}
                className='hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom'
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardHeader className='flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 pb-4'>
                  <CardTitle className='text-lg'>Agendamento</CardTitle>
                  <div className='flex flex-row items-center gap-3'>
                    {getStatusBadge(ag.status)}
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
                        <span className='font-medium'>Horário:</span>
                        <span>{formatHorario(ag.horario_agendamento)}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Car className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Serviço:</span>
                        <span>{getServicoNome(ag)}</span>
                      </div>
                    </div>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2'>
                        <CarFront className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Veículo:</span>
                        <span>{ag.modelo_veiculo_nome || 'Não informado'}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <LayoutTemplate className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Placa:</span>
                        <span>{formatPlaca(ag.veiculo_placa)}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Phone className='w-4 h-4 text-blue-700' />
                        <span className='font-medium'>Telefone:</span>
                        <span>
                          {ag.telefone && ag.telefone.trim() !== ''
                            ? formatTelefone(ag.telefone)
                            : 'Não informado'}
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
