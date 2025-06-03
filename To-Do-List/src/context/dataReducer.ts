import type { AppState, Folder, Task } from '../types'; 
import { v4 as uuidv4 } from 'uuid';               

// Adiciona o novo tipo de ação à nossa união de tipos 'Action'
export type Action =
  | { type: 'DO_NOTHING' }
  | { type: 'ADD_FOLDER'; payload: { name: string } } // payload = os dados que a ação carrega
  | { type: 'ADD_TASK'; payload: { title: string; categoryId: string } };

export const dataReducer = (state: AppState, action: Action): AppState => {
  console.log("Reducer Ação:", action.type, "Payload:", 'payload' in action ? action.payload : 'N/A');

  switch (action.type) {
    case 'ADD_FOLDER': { // <<< ADICIONA UMA CHAVE AQUI
      if (!action.payload.name || !action.payload.name.trim()) {
        // Adicionei um console.warn para feedback se o nome for inválido
        console.warn('ADD_FOLDER: Tentativa de adicionar pasta com nome vazio ou inválido.');
        return state; 
      }
      const newFolder: Folder = {
        id: uuidv4(),
        name: action.payload.name.trim(),
      };
      // Adicionei um console.log para ver a pasta criada
      console.log('Pasta a ser adicionada:', newFolder);
      return {
        ...state, 
        folders: [...state.folders, newFolder], 
      };
    }
    case 'ADD_TASK': { 
      if (!action.payload.title || !action.payload.title.trim() || !action.payload.categoryId) {
        console.warn('ADD_TASK: Dados inválidos para adicionar tarefa (título ou categoryId em falta).');
        return state;
      }
      const newTask: Task = {
        id: uuidv4(),
        title: action.payload.title.trim(),
        categoryId: action.payload.categoryId,
        subTasks: [], // Começa com uma lista de sub-tarefas vazia
        points: 0,    // Começa com 0 pontos
        // dueDate: undefined, // Opcional, podemos adicionar depois
      };
      console.log('Tarefa a ser adicionada:', newTask);
      return {
        ...state, 
        tasks: [...state.tasks, newTask], // Adiciona a nova tarefa ao array de tarefas
      };
    }
    default:
      return state;
  }
};