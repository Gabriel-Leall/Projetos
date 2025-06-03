// src/components/FolderList.tsx
import React from 'react';
import type { Folder } from '../types';   
import FolderItem from './FolderItem'; 

// 1. Definir as Props: O que o FolderList espera receber?
interface FolderListProps {
  folders: Folder[]; // Um array de objetos do tipo Folder
}

// 2. Definir o Componente Funcional
const FolderList: React.FC<FolderListProps> = ({ folders }) => {


  // 3. Lógica de Renderização Condicional (opcional, mas bom)
  if (!folders || folders.length === 0) {
    return <p className="text-slate-500">Nenhuma pasta para mostrar.</p>;
  }

  // 4. O "Coração" do Componente: Mapear o array e usar FolderItem
  return (
    <ul className="list-none p-0"> {/* Uma lista para conter os itens */}
      {folders.map(cadaPasta => (

        <FolderItem 
          key={cadaPasta.id}  
          folder={cadaPasta}  
        />
      ))}
    </ul>
  );
};

export default FolderList; 