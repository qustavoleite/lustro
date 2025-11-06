import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Eye, EyeOff } from 'lucide-react'

export function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        senha: password,
      }

      const isAdmin = payload.email === 'admin@lustro.com'
      const endpoint = isAdmin
        ? 'https://lustro-black.vercel.app/api/auth/admin/login'
        : 'https://lustro-black.vercel.app/api/auth/login'

      let response
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } catch (fetchError) {
        if (fetchError instanceof TypeError) {
          if (fetchError.message.includes('Failed to fetch')) {
            throw new Error(
              'Erro de conexão com o servidor. O backend pode estar bloqueando requisições do frontend (CORS). Verifique se o backend está configurado corretamente.'
            )
          }
          throw new Error(
            'Erro de conexão. Verifique sua internet e tente novamente.'
          )
        }
        throw fetchError
      }

      const contentType = response.headers.get('content-type')
      const isJson = contentType && contentType.includes('application/json')

      let data
      if (isJson) {
        data = await response.json()
      } else {
        const text = await response.text()
        if (!response.ok) {
          throw new Error(
            text || `Erro ${response.status}: ${response.statusText}`
          )
        }
        throw new Error('Resposta do servidor não é JSON válido')
      }

      if (!response.ok) {
        const errorMessage =
          data?.error ||
          data?.message ||
          data?.msg ||
          `Erro ${response.status}: Credenciais inválidas`
        throw new Error(errorMessage)
      }

      if (!data.access_token) {
        throw new Error('Token de acesso não recebido do servidor')
      }

      localStorage.setItem('authToken', data.access_token)

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      if (endpoint === 'https://lustro-black.vercel.app/api/auth/admin/login') {
        navigate('/admin')
      } else {
        navigate('/schedule')
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao fazer login. Verifique suas credenciais.'
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
          <p className='text-xl mb-8'>Faça login com a Lustro!</p>

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
            <p>Faça login com a Lustro!</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <Input
                id='email'
                type='email'
                placeholder='seu@email.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                disabled={isLoading}
                required
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='password' className='text-sm font-medium'>
                Senha
              </label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Digite sua senha'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError('')
                  }}
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

            <Button variant='auth' type='submit' disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-sm mb-4'>
              Ao se inscrever na Lustro, você concorda com nossa Política de
              Privacidade e Termos de Serviço
            </p>
            <p className='text-sm'>
              Não tem conta?{' '}
              <Link to='/singup' className='font-medium text-blue-800'>
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
