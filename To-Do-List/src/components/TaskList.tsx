// src/components/TaskList.tsx
import React from 'react';
import type { Task } from '../types';    // Importa o tipo Task
import TaskItem from './TaskItem';     

// 1. Definir as Props
interface TaskListProps {
  tasks: Task[]; 
  title?: string; 
}


const TaskList: React.FC<TaskListProps> = ({ tasks, title = "Tarefas" }) => {
  // 3. Lidar com lista vazia
  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">{title}</h2>
        <p className="text-slate-500">Nenhuma tarefa para mostrar aqui!</p>
      </div>
    );
  }

  // 4. Mapear as tarefas para componentes TaskItem
  return (
    <section className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">{title}</h2>
      <div>
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
};

export default TaskList;