// src/components/TaskItem.tsx
import React, { useState } from 'react';
import type { Task } from '../types';
import SubTaskItem from './SubTaskItem';
import ProgressBar from './ProgressBar';
import { useData } from '../context/DataContext';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { dispatch } = useData();
  const [newSubTaskText, setNewSubTaskText] = useState('');

  // Lógica existente para a barra de progresso
  const completedSubtasks = task.subTasks.filter(st => st.completed).length;
  const totalSubtasks = task.subTasks.length;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Lógica existente para adicionar sub-tarefa
  const handleAddSubTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newSubTaskText.trim()) return;

    dispatch({
      type: 'ADD_SUBTASK',
      payload: { text: newSubTaskText, taskId: task.id },
    });
    setNewSubTaskText('');
  };

  // --- LÓGICA NOVA PARA REMOVER A TAREFA ---
  const handleRemoveTask = () => {
    // 1. Pede confirmação ao utilizador (boa prática de UX)
    if (window.confirm(`Tem a certeza que deseja remover a tarefa "${task.title}"?`)) {
      // 2. Se confirmar, despacha a ação para o reducer
      dispatch({ type: 'REMOVE_TASK', payload: { taskId: task.id } });
    }
  };

  return (
    // 3. Adiciona 'relative' ao container para posicionar o botão
    <div 
      className={`p-4 mb-3 border rounded-lg shadow transition-all duration-150 relative ${
        task.completed 
          ? 'bg-green-50 border-green-300 opacity-70' 
          : 'bg-white border-slate-200 hover:shadow-md'
      }`}
    >
      {/* 4. Botão de Remover Tarefa */}
      <button 
        onClick={handleRemoveTask}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
        aria-label={`Remover tarefa ${task.title}`}
      >
        {/* Ícone de lixeira (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Título da Tarefa - Adicionado 'pr-8' para não ficar sob o botão */}
      <h3 className={`text-lg font-semibold pr-8 ${
          task.completed ? 'text-green-700 line-through' : 'text-slate-700'
        }`}
      >
        {task.title}
      </h3>
      
      {/* Secção de Sub-tarefas (código existente) */}
      {task.subTasks && task.subTasks.length > 0 && (
        <div className="mt-3 pt-3 pl-4 border-t border-slate-200">
          <ul className="list-none p-0 space-y-1">
            {task.subTasks.map(subTask => (
              <SubTaskItem key={subTask.id} subTask={subTask} taskId={task.id} />
            ))}
          </ul>
        </div>
      )}

      {/* Formulário para adicionar nova sub-tarefa (código existente) */}
      <form onSubmit={handleAddSubTask} className="mt-3 pt-2 pl-4 border-t border-dashed border-slate-300">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-grow p-1.5 border border-slate-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
            value={newSubTaskText}
            onChange={(e) => setNewSubTaskText(e.target.value)}
            placeholder="Nova sub-tarefa..."
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          >
            +
          </button>
        </div>
      </form>

      {/* Barra de Progresso (código existente) */}
      {totalSubtasks > 0 && (
        <div className="mt-4">
          <ProgressBar 
            percentage={progressPercentage} 
            barColor="bg-green-500" 
            height="h-2"
          />
        </div>
      )}

      {/* Pontos da Tarefa (código existente) */}
      <p className="text-xs text-slate-400 mt-2 text-right">
        Vale: {task.points} pontos
      </p>
    </div>
  );
};

export default TaskItem;