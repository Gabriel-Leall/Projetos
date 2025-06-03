// src/App.tsx
import { useData } from './context/dataContext';
import FolderList from './components/FolderList'; 
import GamificationHeader from './components/GamificationHeader';
import TaskList from './components/TaskList'; 

function App() {
  const { state } = useData();

  const tasksDaPastaLivros = state.folders.length > 1 
    ? state.tasks.filter(task => task.categoryId === state.folders[1].id)
    : [];

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-sky-700 mb-4">
          To-Do List Gamificada
        </h1>
        <GamificationHeader />
      </header>

      <main className="flex space-x-6"> {/* Usar flex para layout lado a lado */}
        <aside className="w-1/4"> {/* Sidebar para pastas */}
          <section className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-slate-800 mb-3">
              Pastas
            </h2>
            <FolderList folders={state.folders} />
          </section>
        </aside>

        <div className="flex-1"> {/* Área principal para tarefas */}
          {/* Usamos o componente TaskList aqui */}
          <TaskList tasks={tasksDaPastaLivros} title={`Tarefas de "${state.folders.length > 1 ? state.folders[1].name : 'Livros'}"`} />
        </div>
      </main>
    </div>
  );
}

export default App;