// src/context/DataContext.tsx
import React, { createContext, useReducer, useContext, useEffect } from "react";
import type { ReactNode, Dispatch } from "react";
import type { AppState, Folder, Task } from "../types"; // Importa os tipos necessários
import { dataReducer } from "./DataReducer";
import type { Action } from "./DataReducer";

// --- Lógica para Carregar e Guardar Estado ---

// 1. Função para o estado de fábrica (o estado inicial se não houver nada salvo)
const getInitialState = (): AppState => {
  const initialFolders: Folder[] = [
    { id: "1", name: "Geral" }, // Usando IDs fixos para facilitar o exemplo inicial
    { id: "2", name: "Livros" },
    { id: "3", name: "Trabalho" },
  ];

  const initialTasks: Task[] = [
    { 
      id: 't1', 
      title: 'Comprar Leite', 
      subTasks: [], 
      categoryId: '1', 
      points: 5, 
      completed: false, 
      dueDate: null 
    },
    { 
      id: 't2', 
      title: 'Ler "O Senhor dos Anéis"', 
      subTasks: [ { id: 'st1', text: 'Ler Capítulo 1', completed: true } ], 
      categoryId: '2', 
      points: 25, 
      completed: false,
      dueDate: '2025-10-23' 
    },
  ];

  const initialGamification = {
    totalPoints: initialTasks.reduce(
      (acc, task) => (task.completed ? acc + task.points : acc),
      0
    ),
    level: 1,
  };

  return {
    folders: initialFolders,
    tasks: initialTasks,
    gamification: initialGamification,
    activeFolderId: initialFolders.length > 0 ? initialFolders[0].id : null,
  };
};

// 2. Função para carregar o estado do localStorage
const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem("todoListState");
    if (serializedState === null) {
      // Se não há nada no "cofre", usa o estado de fábrica
      return getInitialState();
    }
    // Se há algo, "traduz" de volta e retorna
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Não foi possível carregar o estado do localStorage", err);
    // Em caso de erro, retorna o estado de fábrica por segurança
    return getInitialState();
  }
};

// --- Definição do Contexto e Provedor ---

// Definimos o que o nosso contexto vai fornecer
const DataContext = createContext<
  | {
      state: AppState;
      dispatch: Dispatch<Action>;
    }
  | undefined
>(undefined);

// Definimos as props do nosso Provedor
interface DataProviderProps {
  children: ReactNode;
}

// O Componente Provedor que vai "abraçar" a nossa aplicação
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // 3. O reducer é inicializado com o estado carregado do localStorage ou com o estado inicial
  const [state, dispatch] = useReducer(dataReducer, undefined, loadState);

  // 4. Este useEffect "escuta" por mudanças no 'state' e salva no localStorage
  useEffect(() => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("todoListState", serializedState);
    } catch (err) {
      console.error("Não foi possível guardar o estado no localStorage", err);
    }
  }, [state]); // O array de dependências: este efeito só executa quando o 'state' mudar

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook personalizado para facilitar o uso do nosso contexto nos componentes
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData deve ser usado dentro de um DataProvider");
  }
  return context;
};
