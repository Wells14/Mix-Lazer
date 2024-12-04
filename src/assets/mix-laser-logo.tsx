export const MixLaserLogo = () => (
  <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* M vermelho */}
    <path
      d="M20,100 L60,30 L100,100 L140,30 L180,100"
      fill="#FF0000"
      strokeWidth="2"
    />
    
    {/* X em cinza claro */}
    <path
      d="M190,30 L240,100"
      stroke="#CCCCCC"
      strokeWidth="40"
      strokeLinecap="round"
    />
    <path
      d="M240,30 L190,100"
      stroke="#CCCCCC"
      strokeWidth="40"
      strokeLinecap="round"
    />
    
    {/* Laser em vermelho */}
    <g transform="translate(170, 110)">
      <rect
        width="80"
        height="25"
        rx="12.5"
        fill="#FF0000"
      />
      <text
        x="40"
        y="17"
        fill="white"
        fontSize="14"
        fontFamily="Arial"
        textAnchor="middle"
        fontWeight="bold"
      >
        LASER
      </text>
    </g>
    
    {/* Soluções Visuais */}
    <text
      x="140"
      y="150"
      fill="#666666"
      fontSize="12"
      fontFamily="Arial"
      textAnchor="middle"
    >
      SOLUÇÕES VISUAIS
    </text>
  </svg>
);
