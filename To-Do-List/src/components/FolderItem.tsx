// src/components/FolderItem.tsx
import React from 'react';
import type { Folder } from '../types';
import { useData } from '../context/DataContext'; // 1. Importa o useData para aceder ao contexto

interface FolderItemProps {
  folder: Folder;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder }) => {
  // 2. Acede ao 'state' (para ler o activeFolderId) e à função 'dispatch'
  const { state, dispatch } = useData(); 

  // 3. Verifica se esta instância do FolderItem é a pasta ativa
  const isActive = state.activeFolderId === folder.id;

  // 4. Função a ser chamada quando o item da pasta é clicado
  const handleFolderClick = () => {
    dispatch({ type: 'SET_ACTIVE_FOLDER', payload: { folderId: folder.id } });
  };

  return (
    <li
      className={`
        p-3 mb-2 rounded-md shadow-sm border cursor-pointer 
        transition-all duration-150 ease-in-out transform 
        ${isActive 
          ? 'bg-sky-600 text-white border-sky-700 scale-105 shadow-lg' // Estilos para pasta ativa
          : 'bg-white hover:bg-sky-50 border-slate-200 text-slate-700 hover:border-sky-300 hover:shadow-md' // Estilos para pasta inativa/hover
        }
      `}
      onClick={handleFolderClick} // 5. Adiciona o evento de clique
    >
      {folder.name}
    </li>
  );
};

export default FolderItem;