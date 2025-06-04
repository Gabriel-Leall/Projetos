// src/components/SubTaskItem.tsx
import React from 'react';
import type { SubTask } from '../types';
import { useData } from '../context/DataContext'; // <<< Importa useData

interface SubTaskItemProps {
  subTask: SubTask;
  taskId: string; // <<< Adiciona taskId como prop
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({ subTask, taskId }) => { // <<< Recebe taskId
  const { dispatch } = useData(); // Pega o dispatch

  const handleToggle = () => {
    dispatch({
      type: 'TOGGLE_SUBTASK',
      payload: { taskId: taskId, subTaskId: subTask.id },
    });
  };

  return (
    <li 
      className={`flex items-center py-1 transition-colors duration-150 ease-in-out 
                  ${subTask.completed 
                    ? 'text-slate-400 line-through' 
                    : 'text-slate-700 hover:text-slate-900'}`}
    >
      <input 
        type="checkbox" 
        checked={subTask.completed}
        onChange={handleToggle} // <<< Usa onChange para chamar handleToggle
        className="mr-3 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-offset-0 focus:ring-2 focus:ring-sky-400 cursor-pointer" // Ajuste no focus
      />
      <span>{subTask.text}</span>
    </li>
  );
};

export default SubTaskItem;