// src/context/DataContext.tsx
import { createContext, useReducer, useContext } from "react";
import type { ReactNode, Dispatch } from "react";
import type { AppState } from "../types";
import { dataReducer } from "./dataReducer";
import type { Action } from "./dataReducer";
import { v4 as uuidv4 } from "uuid";

// Estado inicial da nossa aplicação (com alguns dados de exemplo)
const initialFolders = [
  { id: uuidv4(), name: "Geral" },
  { id: uuidv4(), name: "Livros" },
  { id: uuidv4(), name: "Trabalho" },
];

const initialTasks = [
  {
    id: uuidv4(),
    title: "Comprar Leite",
    subTasks: [],
    categoryId: initialFolders[0].id,
    points: 0,
  },
  {
    id: uuidv4(),
    title: 'Ler "O Senhor dos Anéis"',
    subTasks: [
      { id: uuidv4(), text: "Ler Capítulo 1", completed: true },
      { id: uuidv4(), text: "Ler Capítulo 2", completed: false },
    ],
    categoryId: initialFolders[1].id,
    points: 10,
  },
];

const initialState: AppState = {
  folders: initialFolders,
  tasks: initialTasks,
  gamification: {
    totalPoints: 10,
    level: 1,
  },
};

// Criamos o Contexto
const DataContext = createContext<
  | {
      state: AppState;
      dispatch: Dispatch<Action>;
    }
  | undefined
>(undefined);

// Props do Provedor
interface DataProviderProps {
  children: ReactNode;
}

// O Componente Provedor
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData deve ser usado dentro de um DataProvider");
  }
  return context;
};
