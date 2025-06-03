// src/components/TaskItem.tsx
import React from 'react';
import type { Task } from '../types'; 


interface TaskItemProps {
  task: Task; 
}


const TaskItem: React.FC<TaskItemProps> = ({ task }) => {

  return (
    <div className="p-4 mb-3 bg-white border border-slate-200 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-700">{task.title}</h3>
      {/* Placeholder para sub-tarefas */}
      {task.subTasks && task.subTasks.length > 0 && (
        <div className="mt-2 pl-4">
          <p className="text-sm text-slate-500">Sub-tarefas:</p>
          <ul className="list-disc list-inside text-sm text-slate-600">
            {task.subTasks.map(subTask => (
              <li key={subTask.id} className={subTask.completed ? 'line-through text-slate-400' : ''}>
                {subTask.text}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Placeholder para a barra de progresso */}
      <div className="mt-3 h-2 bg-slate-200 rounded-full">
        <div 
            className="h-full bg-green-500 rounded-full" 
            style={{ width: `${(task.subTasks.filter(st => st.completed).length / (task.subTasks.length || 1)) * 100}%` }} // Cálculo simples da barra
        ></div>
      </div>
       <p className="text-xs text-slate-400 mt-1">Pontos: {task.points}</p>
    </div>
  );
};

export default TaskItem;