import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input', () => {
  it('deve renderizar o input', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('deve renderizar com placeholder', () => {
    render(<Input placeholder="Digite seu nome" />)
    const input = screen.getByPlaceholderText('Digite seu nome')
    expect(input).toBeInTheDocument()
  })

  it('deve permitir digitar texto', async () => {
    const user = userEvent.setup()
    render(<Input />)
    const input = screen.getByRole('textbox')

    await user.type(input, 'Texto de teste')
    expect(input).toHaveValue('Texto de teste')
  })

  it('deve estar desabilitado quando disabled é true', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('deve aplicar variante default', () => {
    render(<Input variant="default" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('bg-white')
  })

  it('deve aplicar variante outline', () => {
    render(<Input variant="outline" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('bg-transparent')
  })

  it('deve aplicar className customizada', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('deve chamar onChange quando o valor muda', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')

    await user.type(input, 'a')
    expect(handleChange).toHaveBeenCalled()
  })
})


