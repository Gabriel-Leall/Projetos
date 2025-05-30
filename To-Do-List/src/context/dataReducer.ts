import type { AppState } from '../types';

// Por agora, não teremos ações, só definimos o tipo base
export type Action = { type: 'DO_NOTHING' }; // Tipo de exemplo

/**
 * O Reducer: Lida com as mudanças de estado. (Por agora, não faz nada).
 * @param state - O estado atual.
 * @param action - A ação a ser executada.
 * @returns O novo estado.
 */
export const dataReducer = (state: AppState, action: Action): AppState => {
  console.log("Reducer Ação:", action.type);

  switch (action.type) {
    // --- Adicionaremos os casos para ADD_FOLDER, ADD_TASK, etc. aqui ---

    default:
      return state; // Retorna o estado sem alterações
  }
};