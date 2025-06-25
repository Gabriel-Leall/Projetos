// src/context/dataReducer.ts
import type { AppState, Folder, Task, SubTask } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Define todos os tipos de Ações que o nosso reducer pode receber
export type Action =
  | { type: 'DO_NOTHING' } // Ação de exemplo, pode ser removida se não for usada
  | { type: 'ADD_FOLDER'; payload: { name: string } }
  | { type: 'ADD_TASK'; payload: { title: string; categoryId: string, dueDate: string | null } }
  | { type: 'ADD_SUBTASK'; payload: { text: string; taskId: string } }
  | { type: 'SET_ACTIVE_FOLDER'; payload: { folderId: string | null } }
  | { type: 'TOGGLE_SUBTASK'; payload: { taskId: string; subTaskId: string } }
  | { type: 'REMOVE_SUBTASK'; payload: { taskId: string; subTaskId: string } }
  | { type: 'REMOVE_TASK'; payload: { taskId: string } }
  | { type: 'REMOVE_FOLDER'; payload: { folderId: string } };

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
        dueDate: action.payload.dueDate, 
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
      return state;
    }

    let taskPointsChanged = 0;

    const updatedTasks = state.tasks.map(task => {
      if (task.id === action.payload.taskId) {
        const wasTaskCompletedBefore = task.completed;

        const updatedSubTasks = task.subTasks.map(subTask => {
          if (subTask.id === action.payload.subTaskId) {
            return { ...subTask, completed: !subTask.completed };
          }
          return subTask;
        });

        const areAllSubTasksNowCompleted = updatedSubTasks.length > 0 && updatedSubTasks.every(st => st.completed);
        
        if (!wasTaskCompletedBefore && areAllSubTasksNowCompleted) {
          taskPointsChanged = task.points;
          console.log(`Tarefa "${task.title}" concluída! +${task.points} pontos!`);
        }
        
        // (Opcional) Lógica para remover pontos se a tarefa for "descompletada"
        else if (wasTaskCompletedBefore && !areAllSubTasksNowCompleted) {
            // Vamos assumir que, uma vez ganhos, os pontos não são perdidos para simplificar.
            // Mas se quiséssemos, a lógica seria: taskPointsChanged = -task.points;
        }

        return { ...task, subTasks: updatedSubTasks, completed: areAllSubTasksNowCompleted };
      }
      return task;
    });

    // Calcula o novo total de pontos
    const newTotalPoints = state.gamification.totalPoints + taskPointsChanged;

    // Regra: A cada 100 pontos, sobe 1 nível. O nível base é 1.
    const newLevel = 1 + Math.floor(newTotalPoints / 100);

    // Se o nível mudou, podemos dar um feedback!
    if (newLevel > state.gamification.level) {
      console.log(`🎉 LEVEL UP! Bem-vindo ao Nível ${newLevel}! 🎉`);
    }

    // Atualiza o estado de gamificação com os novos pontos E o novo nível
    const updatedGamificationState = {
      ...state.gamification,
      totalPoints: newTotalPoints,
      level: newLevel, // <<< Atualiza o nível
    };

    return {
      ...state,
      tasks: updatedTasks,
      gamification: updatedGamificationState, // Usa o estado de gamificação atualizado
    };
  }
    
    case 'REMOVE_SUBTASK': {
      const { taskId, subTaskId } = action.payload;
      if (!taskId || !subTaskId) {
        console.warn('REMOVE_SUBTASK: taskId ou subTaskId em falta.');
        return state;
      }

      const updatedTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          // Esta é a tarefa pai da sub-tarefa que queremos remover
          // Cria um novo array de sub-tarefas, filtrando para excluir a sub-tarefa com o ID fornecido
          const updatedSubTasks = task.subTasks.filter(
            subTask => subTask.id !== subTaskId
          );
          // Retorna a tarefa pai com a lista de sub-tarefas atualizada
          return { ...task, subTasks: updatedSubTasks };
        }
        return task; // Mantém as outras tarefas como estão
      });

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
    case 'REMOVE_FOLDER': {
      const { folderId } = action.payload;
      if (!folderId) {
        console.warn('REMOVE_FOLDER: folderId em falta.');
        return state;
      }
      
      // 1. Cria um novo array de pastas, excluindo a que foi removida
      const updatedFolders = state.folders.filter(
        folder => folder.id !== folderId
      );

      // 2. Cria um novo array de tarefas, excluindo as que pertenciam à pasta removida
      const updatedTasks = state.tasks.filter(
        task => task.categoryId !== folderId
      );

      // 3. Lógica para lidar com a pasta ativa se ela for a removida
      let newActiveFolderId = state.activeFolderId;
      if (state.activeFolderId === folderId) {
        // Se a pasta removida era a ativa, define a primeira da NOVA lista como ativa (ou null se não sobrarem pastas)
        newActiveFolderId = updatedFolders.length > 0 ? updatedFolders[0].id : null;
      }

      // 4. Retorna o novo estado completamente atualizado
      return {
        ...state,
        folders: updatedFolders,
        tasks: updatedTasks,
        activeFolderId: newActiveFolderId,
      };
    }

    case 'DO_NOTHING':
        return state;

    default:
      return state;
  }
};