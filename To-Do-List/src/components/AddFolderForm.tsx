// src/components/AddFolderForm.tsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext'; 

const AddFolderForm: React.FC = () => {
  // 'useState' é como uma pequena memória SÓ para este formulário, para guardar o que o utilizador digita
  const [folderName, setFolderName] = useState(''); 
  const { dispatch } = useData(); // Pega a função 'dispatch' do nosso Guardião do Caderno

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Impede o "vento de levar tudo" (recarregar a página)

    if (!folderName.trim()) { // Não faz nada se o nome estiver vazio
      alert("Por favor, insira um nome para a pasta.");
      return;
    }

    // Cria o "Formulário de Pedido" (Ação) e entrega ao Guardião (dispatch)
    dispatch({ type: 'ADD_FOLDER', payload: { name: folderName } });

    setFolderName(''); // Limpa o campo de texto depois de adicionar
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 bg-slate-50 rounded-lg shadow-inner">
      <label htmlFor="folderNameInput" className="block text-sm font-medium text-slate-700 mb-1">
        Adicionar Nova Pasta:
      </label>
      <div className="flex rounded-md shadow-sm">
        <input
          type="text"
          name="folderNameInput"
          id="folderNameInput"
          className="focus:ring-sky-500 focus:border-sky-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-slate-300 p-2"
          value={folderName} // O valor do campo é o que está na nossa 'memória' folderName
          onChange={(e) => setFolderName(e.target.value)} // Quando o utilizador digita, atualizamos a 'memória'
          placeholder="Nome da nova pasta"
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
};

export default AddFolderForm;