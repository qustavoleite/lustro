import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('deve renderizar o botão com o texto fornecido', () => {
    render(<Button>Clique aqui</Button>)
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toBeInTheDocument()
  })

  it('deve aplicar a variante padrão', () => {
    render(<Button>Botão</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-700')
  })

  it('deve aplicar a variante outline quando especificada', () => {
    render(<Button variant="outline">Botão</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
  })

  it('deve aplicar o tamanho sm quando especificado', () => {
    render(<Button size="sm">Botão</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-8')
  })

  it('deve estar desabilitado quando a prop disabled é true', () => {
    render(<Button disabled>Botão</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('deve chamar onClick quando clicado', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clique</Button>)
    const button = screen.getByRole('button')
    button.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})


