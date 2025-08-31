import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import CarWash from '../assets/car-wash.png'
import CarWashing from '../assets/car-washing.png'
import { MessageCircle, Instagram, Car, Sparkles, Shield } from 'lucide-react'

export function LandingPage() {
  return (
    <div className='min-h-screen '>
      <header className='border-b border-[rgba(0,0,0,0.14)] backdrop-blur-md sticky top-0 z-50'>
        <div className='container mx-auto max-w-6xl px-3 py-4 flex items-center justify-between'>
          <div className='font-heading font-bold text-2xl text-primary'>
            Lustro
          </div>

          <nav className='hidden md:flex items-center space-x-8'>
            <a href='#home' className='tex  hover:text-blue-700'>
              Home
            </a>
            <a href='#sobre' className='tex  hover:text-blue-700'>
              Sobre
            </a>
            <a href='#servicos' className='tex  hover:text-blue-700'>
              Serviços
            </a>
            <a href='#contato' className='tex  hover:text-blue-700'>
              Contato
            </a>
          </nav>

          <div className='flex items-center gap-3'>
            <Link to='/login'>
              <Button variant='secondary'>Login</Button>
            </Link>
            <Link to='/singup'>
              <Button variant='primary'>Cadastrar-se</Button>
            </Link>
          </div>
        </div>
      </header>

      <section id='home' className='py-20 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              <h1 className='font-heading font-bold text-4xl md:text-5xl text-primary mb-6'>
                Seu carro brilhando sem complicação
              </h1>
              <p className='text-lg md:text-xl  mb-8 leading-relaxed'>
                Na Lustro, acreditamos que cada veículo merece cuidado especial.
                Unimos praticidade e qualidade para oferecer lavagens rápidas e
                eficientes, pensadas para o seu dia a dia.
              </p>
              <div className='flex flex-row gap-4'>
                <Link to='/login'>
                  <Button variant='primary'>Agendar Agora</Button>
                </Link>

                <Button
                  variant='secondary'
                  onClick={() => {
                    const section = document.getElementById('sobre')
                    section?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Saiba Mais
                </Button>
              </div>
            </div>

            <div className='relative'>
              <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                <img
                  src={CarWash}
                  alt='Carro limpo e brilhante após lavagem profissional'
                  className='w-full h-[400px] object-cover'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='sobre' className='py-20 px-4 bg-muted/30'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='relative'>
              <img
                src={CarWashing}
                alt='Equipe profissional da Lustro trabalhando'
                className='w-full h-[400px] object-cover rounded-2xl shadow-lg'
              />
            </div>
            <div>
              <h2 className='font-heading font-bold text-3xl md:text-4xl text-primary mb-6'>
                Sobre a Lustro
              </h2>
              <p className='text-lg  leading-relaxed mb-6'>
                Na Lustro, acreditamos que cada veículo merece cuidado especial.
                Unimos praticidade e qualidade para oferecer lavagens rápidas e
                eficientes, pensadas para o seu dia a dia.
              </p>
              <p className='text-lg  leading-relaxed'>
                Nossa missão é proporcionar a melhor experiência em cuidados
                automotivos, com profissionais qualificados e produtos de alta
                qualidade, garantindo que seu carro sempre esteja impecável.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id='servicos' className='py-20 px-4'>
        <div className='container mx-auto max-w-6x'>
          <div className='text-left md:text-center mb-16'>
            <h2 className='font-heading font-bold text-3xl md:text-4xl text-primary mb-4'>
              Nossos Serviços
            </h2>
            <p className='text-lg max-w-2xl md:mx-auto'>
              Oferecemos uma gama completa de serviços especializados para
              manter seu veículo, com produtos de alta qualidade e técnicas
              profissionais que garantem proteção, brilho e cuidado excepcional
              para cada detalhe do seu carro.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='border-border hover:shadow-lg transition-shadow bg-off-white border border-gray-300 rounded-lg'>
              <div className='p-12 text-center'>
                <div className='w-16 h-16 bg-[#E7EBF4] rounded-full flex items-center justify-center mx-auto mb-6'>
                  <Car className='w-8 h-8 text-blue-700' />
                </div>
                <h3 className='font-heading font-semibold text-xl text-primary mb-4'>
                  Lavagem Externa
                </h3>
                <p>Remova a sujeira e recupere o brilho da sua pintura.</p>
              </div>
            </div>

            <div className='border-border hover:shadow-lg transition-shadow  bg-off-white border border-gray-300 rounded-lg'>
              <div className='p-8 text-center'>
                <div className='w-16 h-16 bg-[#E7EBF4] rounded-full flex items-center justify-center mx-auto mb-6'>
                  <Sparkles className='w-8 h-8 text-blue-700' />
                </div>
                <h3 className='font-heading font-semibold text-xl text-primary mb-4'>
                  Lavagem Interna
                </h3>
                <p>Seu carro brilhando sem complicação.</p>
              </div>
            </div>

            <div className='border-border hover:shadow-lg transition-shadow bg-off-white border border-gray-300 rounded-lg'>
              <div className='p-8 text-center'>
                <div className='w-16 h-16 bg-[#E7EBF4] rounded-full flex items-center justify-center mx-auto mb-6'>
                  <Shield className='w-8 h-8 text-blue-700' />
                </div>
                <h3 className='font-heading font-semibold text-xl text-primary mb-4'>
                  Lavagem Completa
                </h3>
                <p>
                  O cuidado total que o seu carro merece, por dentro e por fora.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className='border-b border-t border-[rgba(0,0,0,0.14)] py-12 px-4 '>
        <div className='container mx-auto max-w-6xl '>
          <div className='grid md:grid-cols-4 gap-8 mb-8 text-left'>
            <div>
              <div className='font-heading font-bold text-2xl text-primary mb-4'>
                Lustro
              </div>
              <p>
                Seu carro brilhando sem complicação. Porque cuidar do seu
                veículo deve ser simples, rápido e com resultados que
                impressionam.
              </p>
            </div>

            <div>
              <h3 className='font-heading font-semibold text-lg text-primary mb-4'>
                Endereço
              </h3>
              <div className='space-y-1'>
                <p>Rua das Flores, 123</p>
                <p>Centro - São Paulo, SP</p>
                <p>CEP: 01234-567</p>
                <p>(11) 9999-8888</p>
              </div>
            </div>

            <div>
              <h3 className='font-heading font-semibold text-lg text-primary mb-4'>
                Menu
              </h3>
              <nav className='space-y-2'>
                <a href='#home' className='block'>
                  Home
                </a>
                <a href='#sobre' className='block'>
                  Sobre
                </a>
                <a href='#servicos' className='block'>
                  Serviços
                </a>
                <a href='#contato' className='block'>
                  Contato
                </a>
              </nav>
            </div>

            <div>
              <h3 className='font-heading font-semibold text-lg text-primary mb-4 '>
                Redes Sociais
              </h3>
              <div className='flex gap-4 justify-start md:justify-start'>
                <a
                  href='#'
                  className='w-10 h-10 bg-[#E7EBF4] rounded-full flex items-center justify-center'
                  aria-label='WhatsApp'
                >
                  <MessageCircle className='text-blue-700' size={22} />
                </a>
                <a
                  href='#'
                  className='w-10 h-10 bg-[#E7EBF4] rounded-full flex items-center justify-center'
                  aria-label='Instagram'
                >
                  <Instagram className='text-blue-700' size={23} />
                </a>
              </div>
            </div>
          </div>

          <div className='border-b border-[rgba(0,0,0,0.14)] pt-8 text-center'>
            <p className=' pb-2'>
              © 2025 Lustro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
