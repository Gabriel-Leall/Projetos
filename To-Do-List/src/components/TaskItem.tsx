// src/components/TaskItem.tsx
import React, { useState } from 'react'; // <<< Adiciona useState
import type { Task } from '../types';
import SubTaskItem from './SubTaskItem';
import ProgressBar from './ProgressBar';
import { useData } from '../context/DataContext'; // <<< Adiciona useData

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { dispatch } = useData(); // Pega o dispatch do contexto
  const [newSubTaskText, setNewSubTaskText] = useState(''); // Estado para o input da nova sub-tarefa

  const completedSubtasks = task.subTasks.filter(st => st.completed).length;
  const totalSubtasks = task.subTasks.length;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleAddSubTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newSubTaskText.trim()) return;

    dispatch({
      type: 'ADD_SUBTASK',
      payload: { text: newSubTaskText, taskId: task.id },
    });
    setNewSubTaskText(''); // Limpa o input
  };

  return (
    <div className="p-4 mb-3 bg-white border border-slate-200 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{task.title}</h3>

      {task.subTasks && task.subTasks.length > 0 && (
        <div className="mt-3 pt-3 pl-4 border-t border-slate-200">
          <ul className="list-none p-0 space-y-1">
            {task.subTasks.map(subTask => (
              <SubTaskItem key={subTask.id} subTask={subTask}  taskId={task.id}/>
            ))}
          </ul>
        </div>
      )}

      {/* Formulário para adicionar nova sub-tarefa */}
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

      {totalSubtasks > 0 && (
        <div className="mt-4">
          <ProgressBar 
            percentage={progressPercentage} 
            barColor="bg-green-500"
            height="h-2"
          />
        </div>
      )}

      <p className="text-xs text-slate-400 mt-2 text-right">
        Vale: {task.points} pontos
      </p>
    </div>
  );
};

export default TaskItem;