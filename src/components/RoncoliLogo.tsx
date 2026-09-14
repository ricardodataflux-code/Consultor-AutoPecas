import React from 'react';

interface RoncoliLogoProps {
  className?: string;
}

export const RoncoliLogo: React.FC<RoncoliLogoProps> = ({ className = "w-14 h-14" }) => {
  return (
    <div className={`bg-white rounded-lg p-1.5 flex items-center justify-center shadow-md border border-slate-700/60 shrink-0 select-none ${className}`}>
      <svg 
        viewBox="0 0 500 450" 
        className="w-full h-full object-contain"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Roncoli Auto Peças - Vendas Balcão"
      >
        <g transform="translate(15, 60)">
          {/* R O N C */}
          <text 
            x="10" 
            y="110" 
            fontFamily="Arial Black, Impact, 'Montserrat', sans-serif" 
            fontWeight="900" 
            fontStyle="italic" 
            fontSize="106" 
            fill="#0e4399" 
            letterSpacing="-2"
          >
            RONC
          </text>
          
          {/* Bearing "O" */}
          <g transform="translate(324, 68)">
            {/* Outer red circle */}
            <circle cx="34" cy="2" r="39" fill="none" stroke="#d61f26" strokeWidth="6.5"/>
            {/* Inner track */}
            <circle cx="34" cy="2" r="28" fill="none" stroke="#d61f26" strokeWidth="2.5"/>
            {/* Ball bearings */}
            <circle cx="34" cy="-18" r="6.5" fill="#d61f26"/>
            <circle cx="48" cy="-12" r="6.5" fill="#d61f26"/>
            <circle cx="54" cy="2" r="6.5" fill="#d61f26"/>
            <circle cx="48" cy="16" r="6.5" fill="#d61f26"/>
            <circle cx="34" cy="22" r="6.5" fill="#d61f26"/>
            <circle cx="20" cy="16" r="6.5" fill="#d61f26"/>
            <circle cx="14" cy="2" r="6.5" fill="#d61f26"/>
            <circle cx="20" cy="-12" r="6.5" fill="#d61f26"/>
            {/* Center hub */}
            <circle cx="34" cy="2" r="10" fill="none" stroke="#d61f26" strokeWidth="4.5"/>
            <circle cx="34" cy="2" r="4.5" fill="#d61f26"/>
          </g>

          {/* L I */}
          <text 
            x="396" 
            y="110" 
            fontFamily="Arial Black, Impact, 'Montserrat', sans-serif" 
            fontWeight="900" 
            fontStyle="italic" 
            fontSize="106" 
            fill="#0e4399" 
            letterSpacing="-1"
          >
            LI
          </text>
          
          {/* Red underline */}
          <rect x="75" y="122" width="380" height="9.5" fill="#d61f26" rx="3.5" />
          
          {/* AUTO PEÇAS */}
          <text 
            x="455" 
            y="152" 
            fontFamily="Arial, Helvetica, sans-serif" 
            fontWeight="900" 
            fontSize="26" 
            fill="#d61f26" 
            textAnchor="end" 
            letterSpacing="3"
          >
            AUTO PEÇAS
          </text>

          {/* Vendas - Balcão */}
          <text 
            x="240" 
            y="245" 
            fontFamily="Arial, Helvetica, sans-serif" 
            fontWeight="900" 
            fontSize="46" 
            fill="#0e4399" 
            textAnchor="middle" 
            letterSpacing="0.5"
          >
            Vendas - Balcão
          </text>
        </g>
      </svg>
    </div>
  );
};
