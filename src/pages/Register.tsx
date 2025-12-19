import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { API_BASE_URL } from '../config/api'
import logomarcaImg from '../assets/logomarca_preto.png'
import './Register.css'

interface EnderecoViaCEP {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

const Register = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Dados pessoais
  const [nome, setNome] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [emailConfirmacao, setEmailConfirmacao] = useState('')
  
  // Endereço
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [carregandoCep, setCarregandoCep] = useState(false)
  
  // Senha
  const [senha, setSenha] = useState('')
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('')
  
  // Estados de validação
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleVoltar = () => {
    const from = (location.state as { from?: string })?.from
    
    if (from && from !== '/cadastro') {
      navigate(from)
    } else {
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate('/')
      }
    }
  }

  const formatarCEP = (valor: string) => {
    // Remove tudo que não é dígito
    const apenasDigitos = valor.replace(/\D/g, '')
    
    // Aplica a máscara: 00000-000
    if (apenasDigitos.length <= 5) {
      return apenasDigitos
    } else {
      return `${apenasDigitos.slice(0, 5)}-${apenasDigitos.slice(5, 8)}`
    }
  }

  const formatarCelular = (valor: string) => {
    // Remove tudo que não é dígito
    const apenasDigitos = valor.replace(/\D/g, '')
    
    // Aplica a máscara: (00) 00000-0000
    if (apenasDigitos.length <= 2) {
      return apenasDigitos
    } else if (apenasDigitos.length <= 7) {
      return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`
    } else {
      return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7, 11)}`
    }
  }

  const buscarCEP = async (cepValue: string) => {
    const cepLimpo = cepValue.replace(/\D/g, '')
    
    if (cepLimpo.length !== 8) {
      return
    }

    setCarregandoCep(true)
    setErro('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/cep/${cepLimpo}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        setErro(errorData.message || 'CEP não encontrado. Verifique e tente novamente.')
        setEndereco('')
        setCidade('')
        setEstado('')
        return
      }

      const data: EnderecoViaCEP = await response.json()

      if (data.cidade && data.estado) {
        setEndereco(data.logradouro || '')
        setBairro(data.bairro || '')
        setCidade(data.cidade || '')
        setEstado(data.estado || '')
        setErro('')
      } else {
        setErro('CEP não encontrado. Verifique e tente novamente.')
        setEndereco('')
        setBairro('')
        setCidade('')
        setEstado('')
      }
    } catch (error) {
      setErro('Erro ao buscar CEP. Tente novamente.')
      console.error('Erro ao buscar CEP:', error)
      setEndereco('')
      setBairro('')
      setCidade('')
      setEstado('')
    } finally {
      setCarregandoCep(false)
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarCEP(e.target.value)
    setCep(valorFormatado)
    
    // Busca automática quando o CEP estiver completo
    if (valorFormatado.replace(/\D/g, '').length === 8) {
      buscarCEP(valorFormatado)
    } else {
      // Limpa os campos se o CEP não estiver completo
      setEndereco('')
      setBairro('')
      setCidade('')
      setEstado('')
    }
  }

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarCelular(e.target.value)
    setCelular(valorFormatado)
  }

  const validarFormulario = (): boolean => {
    if (!nome.trim()) {
      setErro('Por favor, informe seu nome.')
      return false
    }

    if (!celular.trim() || celular.replace(/\D/g, '').length < 10) {
      setErro('Por favor, informe um celular válido.')
      return false
    }

    if (!email.trim() || !email.includes('@')) {
      setErro('Por favor, informe um e-mail válido.')
      return false
    }

    if (email !== emailConfirmacao) {
      setErro('Os e-mails não coincidem.')
      return false
    }

    if (!cep.trim() || cep.replace(/\D/g, '').length !== 8) {
      setErro('Por favor, informe um CEP válido.')
      return false
    }

    if (!endereco.trim()) {
      setErro('Por favor, informe o endereço.')
      return false
    }

    if (!numero.trim()) {
      setErro('Por favor, informe o número do endereço.')
      return false
    }

    if (!senha || senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return false
    }

    if (senha !== senhaConfirmacao) {
      setErro('As senhas não coincidem.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!validarFormulario()) {
      return
    }

    setCarregando(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          celular: celular.replace(/\D/g, ''),
          cep: cep.replace(/\D/g, ''),
          endereco,
          numero,
          complemento: complemento || undefined,
          bairro: bairro || undefined,
          cidade,
          estado,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.mensagem || 'Erro ao realizar cadastro')
      }

      // Redirecionar para login após cadastro bem-sucedido
      navigate('/login', { 
        state: { 
          from: (location.state as { from?: string })?.from || '/',
          mensagem: 'Cadastro realizado com sucesso! Faça login para continuar.'
        } 
      })
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao realizar cadastro')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="register-page">
      <Header />
      <div className="register-content">
        <div className="register-container">
          <div className="register-header">
            <div className="register-logo-wrapper">
              <img 
                src={typeof logomarcaImg === 'string' ? logomarcaImg : '/logomarca_preto.png'} 
                alt="NaRéguaÍ Logo" 
                className="register-logo-image"
              />
            </div>
            <h1 className="register-title">Criar Conta</h1>
            <p className="register-subtitle">Preencha os dados abaixo para se cadastrar</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            {erro && (
              <div className="register-error">
                {erro}
              </div>
            )}

            {/* Dados Pessoais */}
            <div className="form-section">
              <h3 className="section-title">Dados Pessoais</h3>
              
              <div className="form-group">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  disabled={carregando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="celular">Celular *</label>
                <input
                  type="tel"
                  id="celular"
                  value={celular}
                  onChange={handleCelularChange}
                  placeholder="(00) 00000-0000"
                  required
                  disabled={carregando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={carregando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailConfirmacao">Confirmar E-mail *</label>
                <input
                  type="email"
                  id="emailConfirmacao"
                  value={emailConfirmacao}
                  onChange={(e) => setEmailConfirmacao(e.target.value)}
                  placeholder="confirme seu e-mail"
                  required
                  disabled={carregando}
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="form-section">
              <h3 className="section-title">Endereço</h3>
              
              <div className="form-group">
                <label htmlFor="cep">CEP *</label>
                <input
                  type="text"
                  id="cep"
                  value={cep}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                  required
                  disabled={carregando || carregandoCep}
                  maxLength={9}
                />
                {carregandoCep && (
                  <span className="loading-cep">Buscando endereço...</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group form-group-large">
                  <label htmlFor="endereco">Endereço *</label>
                  <input
                    type="text"
                    id="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, Avenida, etc."
                    required
                    disabled={carregando || carregandoCep}
                  />
                </div>

                <div className="form-group form-group-small">
                  <label htmlFor="numero">Número *</label>
                  <input
                    type="text"
                    id="numero"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="123"
                    required
                    disabled={carregando}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="complemento">Complemento</label>
                <input
                  type="text"
                  id="complemento"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="Apto, Bloco, etc. (opcional)"
                  disabled={carregando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bairro">Bairro</label>
                <input
                  type="text"
                  id="bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Bairro (opcional)"
                  disabled={carregando || carregandoCep}
                />
              </div>

              <div className="form-row">
                <div className="form-group form-group-large">
                  <label htmlFor="cidade">Cidade *</label>
                  <input
                    type="text"
                    id="cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Cidade"
                    required
                    disabled={carregando || carregandoCep}
                  />
                </div>

                <div className="form-group form-group-small">
                  <label htmlFor="estado">Estado *</label>
                  <input
                    type="text"
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    placeholder="RS"
                    required
                    disabled={carregando || carregandoCep}
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            {/* Senha */}
            <div className="form-section">
              <h3 className="section-title">Senha</h3>
              
              <div className="form-group">
                <label htmlFor="senha">Senha *</label>
                <input
                  type="password"
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  disabled={carregando}
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="senhaConfirmacao">Confirmar Senha *</label>
                <input
                  type="password"
                  id="senhaConfirmacao"
                  value={senhaConfirmacao}
                  onChange={(e) => setSenhaConfirmacao(e.target.value)}
                  placeholder="Confirme sua senha"
                  required
                  disabled={carregando}
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-register"
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>

            <div className="register-footer">
              <button
                type="button"
                onClick={handleVoltar}
                className="register-link"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Voltar
              </button>
              <p className="register-login">
                Já tem uma conta?{' '}
                <a 
                  href="#"
                  className="register-link"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/login', { state: { from: location.pathname } })
                  }}
                >
                  Fazer login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Register


