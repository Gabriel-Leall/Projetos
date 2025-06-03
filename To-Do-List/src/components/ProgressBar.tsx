import React from 'react';

interface ProgressBarProps {
  percentage: number;        // Um valor de 0 a 100
  barColor?: string;          // Classe Tailwind para a cor da barra preenchida (ex: 'bg-green-500')
  trackColor?: string;        // Classe Tailwind para a cor do fundo/trilha da barra (ex: 'bg-slate-200')
  height?: string;            // Classe Tailwind para a altura da barra (ex: 'h-2', 'h-2.5')
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  barColor = 'bg-sky-500',      // Cor padrão se nenhuma for fornecida
  trackColor = 'bg-slate-200',  // Cor de fundo padrão
  height = 'h-2.5',             // Altura padrão
}) => {

  const validPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className={`w-full ${trackColor} rounded-full ${height} dark:bg-slate-700 overflow-hidden`}> {/* Adicionado overflow-hidden */}
      <div
        className={`${barColor} ${height} rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none transition-all duration-300 ease-in-out`} 
        style={{ width: `${validPercentage}%` }}
        role="progressbar"
        aria-valuenow={validPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso: ${validPercentage.toFixed(0)}%`} // Adicionado aria-label
      >
        {validPercentage > 10 ? `${validPercentage.toFixed(0)}%` : ''} 
      </div>
    </div>
  );
};

export default ProgressBar;