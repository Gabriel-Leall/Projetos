// src/components/AddTaskForm.tsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface AddTaskFormProps {
  categoryId: string;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ categoryId }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState<string>(''); // <<< NOVO: Estado para guardar o prazo
  const { dispatch } = useData();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!taskTitle.trim()) {
      alert("Por favor, insira um título para a tarefa.");
      return;
    }

    // <<< ALTERADO: Agora enviamos o 'dueDate' no payload. Se estiver vazio, enviamos null.
    dispatch({ 
      type: 'ADD_TASK', 
      payload: { 
        title: taskTitle, 
        categoryId: categoryId,
        dueDate: dueDate || null 
      } 
    });

    setTaskTitle(''); // Limpa o título
    setDueDate('');   // <<< NOVO: Limpa a data
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-slate-50 rounded-lg shadow-inner">
      <div className='flex flex-col sm:flex-row sm:space-x-2'>
        {/* Input para o Título da Tarefa */}
        <div className='flex-grow mb-2 sm:mb-0'>
          <label htmlFor={`taskTitleInput-${categoryId}`} className="sr-only">
            Nova Tarefa:
          </label>
          <input
            type="text"
            id={`taskTitleInput-${categoryId}`}
            className="focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md p-2"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="O que precisa ser feito?"
          />
        </div>

        {/* <<< NOVO: Input para a Data >>> */}
        <div className='mb-2 sm:mb-0'>
          <label htmlFor={`dueDateInput-${categoryId}`} className="sr-only">
            Prazo:
          </label>
          <input 
            type="date" 
            id={`dueDateInput-${categoryId}`}
            className="focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md p-2 text-slate-600"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Botão de Adicionar */}
        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            + Add Tarefa
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;