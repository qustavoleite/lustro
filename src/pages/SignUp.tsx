import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function SignUp() {
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
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!')
      return
    }

    console.log('Cadastro attempt:', formData)
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
            <p className='text-muted-foreground'>Crie sua conta na Lustro!</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
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
                required
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='senha' className='text-sm font-medium'>
                Senha
              </label>
              <Input
                id='senha'
                name='senha'
                type='password'
                placeholder='Digite sua senha'
                value={formData.senha}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='confirmarSenha' className='text-sm font-medium'>
                Confirmar Senha
              </label>
              <Input
                id='confirmarSenha'
                name='confirmarSenha'
                type='password'
                placeholder='Confirme sua senha'
                value={formData.confirmarSenha}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <Button variant='auth' type='submit'>
              Cadastrar
            </Button>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-xs text-muted-foreground mb-4'>
              Ao se inscrever na Lustro, você concorda com nossa Política de
              Privacidade e Termos de Serviço
            </p>
            <p className='text-sm text-muted-foreground'>
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