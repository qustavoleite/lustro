import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { Switch } from '../components/Switch'
import { Badge } from '../components/Badge'
import { Clock, Calendar, Save, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export function AdminTimetable() {
  const [horariosFuncionamento, setHorariosFuncionamento] = useState({
    segunda: { ativo: true, inicio: '08:00', fim: '18:00' },
    terca: { ativo: true, inicio: '08:00', fim: '18:00' },
    quarta: { ativo: true, inicio: '08:00', fim: '18:00' },
    quinta: { ativo: true, inicio: '08:00', fim: '18:00' },
    sexta: { ativo: true, inicio: '08:00', fim: '18:00' },
    sabado: { ativo: true, inicio: '08:00', fim: '16:00' },
    domingo: { ativo: false, inicio: '08:00', fim: '16:00' },
  })

  const diasSemana = [
    { key: 'segunda', nome: 'Segunda-feira' },
    { key: 'terca', nome: 'Terça-feira' },
    { key: 'quarta', nome: 'Quarta-feira' },
    { key: 'quinta', nome: 'Quinta-feira' },
    { key: 'sexta', nome: 'Sexta-feira' },
    { key: 'sabado', nome: 'Sábado' },
    { key: 'domingo', nome: 'Domingo' },
  ]

  const horariosDisponiveis = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
  ]

  const toggleDia = (dia: string) => {
    setHorariosFuncionamento((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia as keyof typeof prev],
        ativo: !prev[dia as keyof typeof prev].ativo,
      },
    }))
  }

  const updateHorario = (
    dia: string,
    tipo: 'inicio' | 'fim',
    valor: string
  ) => {
    setHorariosFuncionamento((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia as keyof typeof prev],
        [tipo]: valor,
      },
    }))
  }

  const salvarHorarios = () => {
    console.log('Salvando horários:', horariosFuncionamento)
    alert('Horários salvos com sucesso!')
  }

  return (
    <div className='min-h-screen bg-background'>
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
          <div>
            <h1 className='font-heading font-bold text-3xl text-primary mb-2'>
              Horários de Funcionamento
            </h1>
            <p className=''>
              Configure os dias e horários em que o lava-jato funciona
            </p>
          </div>

          <Button
            onClick={salvarHorarios}
            className='bg-accent hover:bg-accent/90'
          >
            <Save className='w-4 h-4 mr-2' />
            Salvar Alterações
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='font-heading text-xl text-primary flex items-center gap-2'>
              <Calendar className='w-5 h-5' />
              Configuração Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {diasSemana.map((dia) => {
              const horario =
                horariosFuncionamento[
                  dia.key as keyof typeof horariosFuncionamento
                ]
              return (
                <div
                  key={dia.key}
                  className='flex items-center justify-between p-4 border border-gray-300 rounded-lg'
                >
                  <div className='flex items-center gap-4'>
                    <Switch
                      checked={horario.ativo}
                      onChange={() => toggleDia(dia.key)}
                    />
                    <div>
                      <p className='font-medium text-primary'>{dia.nome}</p>
                      {horario.ativo ? (
                        <Badge
                          variant='secondary'
                          className='bg-green-100 text-green-800'
                        >
                          Funcionando
                        </Badge>
                      ) : (
                        <Badge
                          variant='secondary'
                          className='bg-red-100 text-red-800'
                        >
                          Fechado
                        </Badge>
                      )}
                    </div>
                  </div>

                  {horario.ativo && (
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-2'>
                        <Clock className='w-4 h-4' />
                        <select
                          value={horario.inicio}
                          onChange={(e) =>
                            updateHorario(dia.key, 'inicio', e.target.value)
                          }
                          className='px-3 py-1 border border-gray-300 rounded-md bg-background text-foreground'
                        >
                          {horariosDisponiveis.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                        <span className=''>às</span>
                        <select
                          value={horario.fim}
                          onChange={(e) =>
                            updateHorario(dia.key, 'fim', e.target.value)
                          }
                          className='px-3 py-1 border border-gray-300 rounded-md bg-background text-foreground'
                        >
                          {horariosDisponiveis.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className='mt-8'>
          <CardHeader>
            <CardTitle className='font-heading text-xl text-primary'>
              Resumo dos Horários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {diasSemana.map((dia) => {
                const horario =
                  horariosFuncionamento[
                    dia.key as keyof typeof horariosFuncionamento
                  ]
                return (
                  <div
                    key={dia.key}
                    className='flex items-center justify-between p-3 rounded-lg'
                  >
                    <span className='font-medium text-primary'>{dia.nome}</span>
                    {horario.ativo ? (
                      <span className='text-sm '>
                        {horario.inicio} - {horario.fim}
                      </span>
                    ) : (
                      <span className='text-sm text-red-600'>Fechado</span>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
