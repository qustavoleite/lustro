import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Eye, EyeOff } from 'lucide-react'

export function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem!')
      return
    }

    if (formData.senha.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        senha: formData.senha,
        confirmar_senha: formData.confirmarSenha,
      }

      console.log('Enviando dados:', payload)

      const response = await fetch(
        'https://lustro-black.vercel.app/api/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      console.log('Status da resposta:', response.status)

      const data = await response.json()
      console.log('Resposta da API:', data)

      if (!response.ok) {
        const errorMessage =
          data.error || data.message || data.msg || 'Erro ao criar conta'
        throw new Error(errorMessage)
      }

      console.log('Cadastro realizado com sucesso:', data)
      alert('Cadastro realizado com sucesso!')
      navigate('/login')
    } catch (err) {
      console.error('Erro no cadastro:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao criar conta. Tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex'>
      <div className='hidden lg:flex lg:w-1/2 bg-gray-100 flex-col justify-center px-12'>
        <div className='max-w-sm ml-auto mr-8'>
          <h1 className='font-heading font-bold text-4xl mb-4'>Lustro</h1>
          <p className='text-2xl font-semibold mb-2 text-sky-950'>Bem-vindo,</p>
          <p className='text-xl mb-8'>Crie sua conta na Lustro!</p>

          <div className='flex gap-2'>
            <div className='w-3 h-3 rounded-full bg-blue-700'></div>
            <div className='w-3 h-3 rounded-full bg-[#7F9DDE]'></div>
            <div className='w-3 h-3 rounded-full bg-[#B3C5EB]'></div>
          </div>
        </div>
      </div>

      <div className='w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-white'>
        <div className='w-full max-w-md'>
          <div className='lg:hidden text-center mb-8'>
            <h1 className='font-heading font-bold text-3xl mb-2'>Lustro</h1>
            <p>Crie sua conta na Lustro!</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <label htmlFor='nome' className='text-sm font-medium'>
                Nome
              </label>
              <Input
                id='nome'
                name='nome'
                type='text'
                placeholder='Seu nome completo'
                value={formData.nome}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='seu@email.com'
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='senha' className='text-sm font-medium'>
                Senha
              </label>
              <div className='relative'>
                <Input
                  id='senha'
                  name='senha'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Digite sua senha'
                  value={formData.senha}
                  onChange={handleChange}
                  minLength={8}
                  disabled={isLoading}
                  required
                  className='pr-10'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <label htmlFor='confirmarSenha' className='text-sm font-medium'>
                Confirmar Senha
              </label>
              <div className='relative'>
                <Input
                  id='confirmarSenha'
                  name='confirmarSenha'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirme sua senha'
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  minLength={8}
                  disabled={isLoading}
                  required
                  className='pr-10'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                  aria-label={
                    showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'
                  }
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            <Button variant='auth' type='submit' disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-xs mb-4'>
              Ao se inscrever na Lustro, você concorda com nossa Política de
              Privacidade e Termos de Serviço
            </p>
            <p className='text-sm'>
              Já tem Conta?{' '}
              <Link to='/login' className='font-medium text-blue-800'>
                Fazer Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
