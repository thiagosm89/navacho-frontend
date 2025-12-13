import './IconGalpao.css'

const IconGalpao = () => {
  return (
    <svg 
      className="icon-galpao" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Estrutura do galpão */}
      <path 
        d="M3 20V8L12 3L21 8V20H3Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Porta */}
      <rect 
        x="9" 
        y="14" 
        width="6" 
        height="6" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
      />
      {/* Linha da porta */}
      <line 
        x1="12" 
        y1="14" 
        x2="12" 
        y2="20" 
        stroke="currentColor" 
        strokeWidth="1"
      />
      {/* Janelas laterais */}
      <rect 
        x="4" 
        y="10" 
        width="3" 
        height="3" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
      />
      <rect 
        x="17" 
        y="10" 
        width="3" 
        height="3" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
      />
      {/* Cruz no topo */}
      <line 
        x1="12" 
        y1="3" 
        x2="12" 
        y2="0" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <line 
        x1="10" 
        y1="1" 
        x2="14" 
        y2="1" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  )
}

export default IconGalpao

