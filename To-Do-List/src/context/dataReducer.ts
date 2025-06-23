// src/context/dataReducer.ts
import type { AppState, Folder, Task, SubTask } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Define todos os tipos de Ações que o nosso reducer pode receber
export type Action =
  | { type: 'DO_NOTHING' } // Ação de exemplo, pode ser removida se não for usada
  | { type: 'ADD_FOLDER'; payload: { name: string } }
  | { type: 'ADD_TASK'; payload: { title: string; categoryId: string } }
  | { type: 'ADD_SUBTASK'; payload: { text: string; taskId: string } }
  | { type: 'SET_ACTIVE_FOLDER'; payload: { folderId: string | null } }
  | { type: 'TOGGLE_SUBTASK'; payload: { taskId: string; subTaskId: string } };

// O Reducer principal
export const dataReducer = (state: AppState, action: Action): AppState => {
  // Log para ajudar a depurar e ver quais ações estão a ser despachadas
  console.log(
    "Reducer Ação:", 
    action.type, 
    "Payload:", 
    'payload' in action ? action.payload : 'N/A'
  );

  switch (action.type) {
    case 'ADD_FOLDER': {
      // Validação: não adicionar se o nome estiver vazio ou só com espaços
      if (!action.payload.name || !action.payload.name.trim()) {
        console.warn('ADD_FOLDER: Tentativa de adicionar pasta com nome vazio ou inválido.');
        return state; // Retorna o estado atual sem modificação
      }
      // Cria o novo objeto Folder
      const newFolder: Folder = {
        id: uuidv4(), // ID único
        name: action.payload.name.trim(), // Nome da pasta, sem espaços extra
      };
      console.log('Pasta a ser adicionada:', newFolder);
      // Retorna um NOVO objeto de estado
      return {
        ...state, // Copia todas as outras partes do estado (tasks, gamification)
        folders: [...state.folders, newFolder], // Cria um NOVO array de pastas, com as antigas + a nova
      };
    }

    case 'ADD_TASK': {
      // Validação dos dados recebidos
      if (!action.payload.title || !action.payload.title.trim() || !action.payload.categoryId) {
        console.warn('ADD_TASK: Dados inválidos para adicionar tarefa (título ou categoryId em falta).');
        return state;
      }
      // Cria o novo objeto Task
      const newTask: Task = {
        id: uuidv4(),
        title: action.payload.title.trim(),
        categoryId: action.payload.categoryId,
        subTasks: [], // Começa com uma lista de sub-tarefas vazia
        points: 0,    // Começa com 0 pontos
        completed: false, // Novas tarefas começam como não completas
        // dueDate: undefined, // Opcional, podemos adicionar depois
      };
      console.log('Tarefa a ser adicionada:', newTask);
      // Retorna um NOVO objeto de estado
      return {
        ...state, // Copia o estado existente
        tasks: [...state.tasks, newTask], // Adiciona a nova tarefa ao array de tarefas
      };
    }

    case 'ADD_SUBTASK': {
      // Validação dos dados recebidos
      if (!action.payload.text || !action.payload.text.trim() || !action.payload.taskId) {
        console.warn('ADD_SUBTASK: Dados inválidos (texto da sub-tarefa ou taskId em falta).');
        return state;
      }

      // Cria o novo objeto SubTask
      const newSubTask: SubTask = {
        id: uuidv4(),
        text: action.payload.text.trim(),
        completed: false, // Novas sub-tarefas começam como não completas
      };

      // Atualiza o array de tarefas de forma imutável
      const updatedTasks = state.tasks.map(task => {
        // Se esta for a tarefa à qual queremos adicionar a sub-tarefa...
        if (task.id === action.payload.taskId) {
          // ...retorna uma nova versão da tarefa com a sub-tarefa adicionada
          return {
            ...task, // Copia todas as propriedades da tarefa existente
            subTasks: [...task.subTasks, newSubTask], // Cria um novo array de sub-tarefas com a nova adicionada
          };
        }
        // Para todas as outras tarefas, retorna-as como estão
        return task;
      });

      console.log('Sub-tarefa adicionada. Tarefas atualizadas:', updatedTasks);
      // Retorna um NOVO objeto de estado com o array de tarefas atualizado
      return {
        ...state,
        tasks: updatedTasks,
      };
    }
    
    case 'SET_ACTIVE_FOLDER': { 
      return {
        ...state, // Copia todo o estado existente (imutabilidade!)
        activeFolderId: action.payload.folderId, 
      };
    }
    case 'TOGGLE_SUBTASK': { // Início do bloco do case
      // Validação
      if (!action.payload.taskId || !action.payload.subTaskId) {
        console.warn('TOGGLE_SUBTASK: taskId ou subTaskId em falta.');
        return state; // Retorno antecipado se houver erro
      }

      // Lógica para encontrar e atualizar a tarefa e sub-tarefa
      const updatedTasks = state.tasks.map(task => {
        if (task.id === action.payload.taskId) {
          const updatedSubTasks = task.subTasks.map(subTask => {
            if (subTask.id === action.payload.subTaskId) {
              return { ...subTask, completed: !subTask.completed };
            }
            return subTask;
          });
          return { ...task, subTasks: updatedSubTasks };
        }
        return task;
      });

    // Este é o retorno principal para este case, que impede o fallthrough
      return { 
        ...state,
        tasks: updatedTasks,
      };
    }
    case 'REMOVE_TASK': {
      if (!action.payload.taskId) {
        console.warn('REMOVE_TASK: taskId em falta.');
        return state;
      }
      
      // Cria um novo array de tarefas, filtrando para excluir a tarefa com o ID fornecido
      const filteredTasks = state.tasks.filter(
        task => task.id !== action.payload.taskId
      );

      return {
        ...state,
        tasks: filteredTasks,
      };
    }

    case 'DO_NOTHING':
        return state;

    default:
      return state;
  }
};