// src/components/FolderItem.tsx
import React from 'react';
import type { Folder } from '../types';
import { useData } from '../context/DataContext';

interface FolderItemProps {
  folder: Folder;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder }) => {
  const { state, dispatch } = useData();
  const isActive = state.activeFolderId === folder.id;

  const handleFolderClick = () => {
    dispatch({ type: 'SET_ACTIVE_FOLDER', payload: { folderId: folder.id } });
  };
  
  // Nova função para remover a pasta
  const handleRemoveFolder = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique no botão também dispare o 'handleFolderClick'
    
    if (window.confirm(`Tem a certeza que deseja remover a pasta "${folder.name}"? Todas as tarefas dentro dela também serão removidas.`)) {
      dispatch({ type: 'REMOVE_FOLDER', payload: { folderId: folder.id } });
    }
  };

  return (
    // Adicionamos 'flex', 'justify-between' e 'items-center' para alinhar o nome e o botão
    <li
      onClick={handleFolderClick}
      className={`
        flex justify-between items-center p-3 mb-2 rounded-md shadow-sm border cursor-pointer 
        transition-all duration-150 ease-in-out transform 
        ${isActive 
          ? 'bg-sky-600 text-white border-sky-700 scale-105 shadow-lg' 
          : 'bg-white hover:bg-sky-50 border-slate-200 text-slate-700 hover:border-sky-300 hover:shadow-md'
        }
      `}
    >
      <span>{folder.name}</span>

      {/* Botão de Remover Pasta */}
      <button
        onClick={handleRemoveFolder}
        className={`p-1 rounded-full opacity-75 hover:opacity-100 transition-opacity ${
          isActive ? 'hover:bg-sky-500' : 'hover:bg-red-100'
        }`}
        aria-label={`Remover pasta ${folder.name}`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 hover:text-red-600'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  );
};

export default FolderItem;