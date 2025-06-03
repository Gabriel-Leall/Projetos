// src/components/GamificationHeader.tsx
import React from 'react';
import { useData } from '../context/dataContext';

const GamificationHeader: React.FC = () => {
  const { state } = useData();
  const { totalPoints, level } = state.gamification;

  return (
    // Container principal do "badge" de gamificação/perfil
    <div className="bg-sky-700 text-white p-3 rounded-lg shadow-md flex items-center space-x-4">
      {/* Placeholder para o Perfil do Usuário */}
      <div className="flex-shrink-0 w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
        <span className="text-xl font-bold">U</span> 
      </div>

      {/* Container para Nível e Pontos (empilhados verticalmente) */}
      <div className="flex flex-col">
        <div className="level-display">
          <span className="text-xs font-medium opacity-80">NÍVEL</span>
          <p className="text-2xl font-bold leading-tight">{level}</p>
        </div>
        <div className="points-display mt-1">
          <span className="text-xs font-medium opacity-80">PONTOS</span>
          <p className="text-lg font-semibold leading-tight">{totalPoints}</p>
        </div>
      </div>
    </div>
  );
};

export default GamificationHeader;