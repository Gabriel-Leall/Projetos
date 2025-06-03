// src/components/AddTaskForm.tsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface AddTaskFormProps {
  categoryId: string; // O ID da pasta à qual esta tarefa será adicionada
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ categoryId }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const { dispatch } = useData();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!taskTitle.trim()) {
      alert("Por favor, insira um título para a tarefa.");
      return;
    }

    dispatch({ 
      type: 'ADD_TASK', 
      payload: { title: taskTitle, categoryId: categoryId } 
    });

    setTaskTitle(''); // Limpa o campo
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-slate-50 rounded-lg shadow-inner">
      <label htmlFor={`taskTitleInput-${categoryId}`} className="block text-sm font-medium text-slate-700 mb-1">
        Nova Tarefa:
      </label>
      <div className="flex rounded-md shadow-sm">
        <input
          type="text"
          name={`taskTitleInput-${categoryId}`}
          id={`taskTitleInput-${categoryId}`} // ID único para o label
          className="focus:ring-sky-500 focus:border-sky-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-slate-300 p-2"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="O que precisa ser feito?"
        />
        <button
          type="submit"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          + Add Tarefa
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;