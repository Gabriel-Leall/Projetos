// src/components/SubTaskItem.tsx
import React from 'react';
import type { SubTask } from '../types'; 


interface SubTaskItemProps {
  subTask: SubTask;
  // onToggleStatus: (subTaskId: string) => void; 
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({ subTask }) => {
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
        readOnly 
        className="mr-3 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
        // onClick={() => onToggleStatus(subTask.id)} // Exemplo de como seria com interatividade
      />
      <span>{subTask.text}</span>
    </li>
  );
};

export default SubTaskItem;