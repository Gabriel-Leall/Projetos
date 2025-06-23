// src/components/SubTaskItem.tsx
import React from 'react';
import type { SubTask } from '../types';
import { useData } from '../context/DataContext';

interface SubTaskItemProps {
  subTask: SubTask;
  taskId: string; 
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({ subTask, taskId }) => {
  const { dispatch } = useData();

  const handleToggle = () => {
    dispatch({
      type: 'TOGGLE_SUBTASK',
      payload: { taskId: taskId, subTaskId: subTask.id },
    });
  };

  // Nova função para remover a sub-tarefa
  const handleRemoveSubTask = () => {
    // Não vamos pedir confirmação para remover sub-tarefas para ser mais rápido,
    // mas poderíamos adicionar um window.confirm aqui se quiséssemos.
    dispatch({ type: 'REMOVE_SUBTASK', payload: { taskId: taskId, subTaskId: subTask.id } });
  };

  return (
    // Transforma o <li> num container flex para alinhar o conteúdo e o botão
    <li 
      className={`flex justify-between items-center group py-1 transition-colors duration-150 ease-in-out 
                  ${subTask.completed 
                    ? 'text-slate-400 line-through' 
                    : 'text-slate-700 hover:text-slate-900'}`}
    >
      {/* Div para o checkbox e o texto */}
      <div className="flex items-center">
        <input 
          type="checkbox" 
          checked={subTask.completed}
          onChange={handleToggle}
          className="mr-3 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-offset-0 focus:ring-2 focus:ring-sky-400 cursor-pointer"
        />
        <span>{subTask.text}</span>
      </div>

      {/* Botão de Remover Sub-Tarefa */}
      <button
        onClick={handleRemoveSubTask}
        className="p-1 rounded-full opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 hover:bg-red-100 transition-opacity"
        aria-label={`Remover sub-tarefa ${subTask.text}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  );
};

export default SubTaskItem;