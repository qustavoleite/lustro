import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login:', { email, password })
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
            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <Input
                id='email'
                type='email'
                placeholder='seu@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='password' className='text-sm font-medium'>
                Senha
              </label>
              <Input
                id='password'
                type='password'
                placeholder='Digite sua senha'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <Button variant='auth' type='submit'>
              Entrar
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