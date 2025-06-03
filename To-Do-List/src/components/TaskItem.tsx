// src/components/TaskItem.tsx
import React from 'react';
import type { Task } from '../types';       
import SubTaskItem from './SubTaskItem';   
import ProgressBar from './ProgressBar';   

// Define as props que o TaskItem espera receber
interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  // Lógica para calcular a percentagem de progresso das sub-tarefas
  const completedSubtasks = task.subTasks.filter(st => st.completed).length;
  const totalSubtasks = task.subTasks.length;
  // Evita divisão por zero se não houver sub-tarefas
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div className="p-4 mb-3 bg-white border border-slate-200 rounded-lg shadow hover:shadow-md transition-shadow">
      {/* Título da Tarefa */}
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{task.title}</h3>

      {/* Secção de Sub-tarefas (só aparece se houver sub-tarefas) */}
      {task.subTasks && task.subTasks.length > 0 && (
        <div className="mt-3 pt-3 pl-4 border-t border-slate-200">
          <ul className="list-none p-0 space-y-1">
            {task.subTasks.map(subTask => (
              <SubTaskItem key={subTask.id} subTask={subTask} />
            ))}
          </ul>
        </div>
      )}

      {/* Barra de Progresso (só aparece se a tarefa tiver sub-tarefas) */}
      {totalSubtasks > 0 && (
        <div className="mt-4"> 
          <ProgressBar 
            percentage={progressPercentage} 
            barColor="bg-green-500"
            height="h-2"        
          />
        </div>
      )}

      {/* Pontos da Tarefa */}
      <p className="text-xs text-slate-400 mt-2 text-right"> {/* Estilo para os pontos */}
        Vale: {task.points} pontos
      </p>
    </div>
  );
};

export default TaskItem;