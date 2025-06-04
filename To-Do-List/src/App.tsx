// src/App.tsx
import { useData } from './context/DataContext';
import FolderList from './components/FolderList';
import GamificationHeader from './components/GamificationHeader';
import TaskList from './components/TaskList';
import AddFolderForm from './components/AddFolderForm';
import AddTaskForm from './components/AddTaskForm';

function App() {
  const { state } = useData(); // state agora contém activeFolderId atualizado pelo FolderItem

  // Passo A: Identificar a Pasta Ativa e suas Tarefas
  // 1. Encontra o objeto da pasta ativa para podermos usar o seu nome
  const activeFolder = state.activeFolderId
    ? state.folders.find(f => f.id === state.activeFolderId)
    : null; // Se não houver activeFolderId, activeFolder será null
  
  // Define o nome a ser exibido. Se nenhuma pasta estiver ativa, mostra uma mensagem padrão.
  const activeFolderName = activeFolder ? activeFolder.name : "Nenhuma pasta selecionada";

  // 2. Filtra as tarefas que pertencem à pasta ativa
  // Se activeFolderId não for null, filtra. Senão, retorna um array vazio.
  const tasksOfActiveFolder = state.activeFolderId
    ? state.tasks.filter(task => task.categoryId === state.activeFolderId)
    : []; 

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-sky-700 mb-4">
          To-Do List Gamificada
        </h1>
        <GamificationHeader />
      </header>

      <main className="flex flex-col md:flex-row md:space-x-6">
        <aside className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
          <section className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-slate-800 mb-3">
              Pastas
            </h2>
            {/* FolderList já usa FolderItems que agora sabem qual está ativo e como se atualizar */}
            <FolderList folders={state.folders} /> 
            <AddFolderForm />
          </section>
        </aside>

        <div className="flex-1"> {/* Área principal para tarefas */}
          {/* Passo B: Passar as Tarefas Corretas e o Nome Correto para o TaskList */}
          <TaskList 
            tasks={tasksOfActiveFolder} 
            title={activeFolder ? `Tarefas de "${activeFolderName}"` : "Selecione uma Pasta"} 
          />
          {/* Passo C: Passar o ID Correto para AddTaskForm e só renderizar se uma pasta estiver ativa */}
          {state.activeFolderId && <AddTaskForm categoryId={state.activeFolderId} />}
        </div>
      </main>
    </div>
  );
}

export default App;