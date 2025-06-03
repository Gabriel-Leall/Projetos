import { useData } from './context/DataContext';
import FolderList from './components/FolderList'; 
import GamificationHeader from './components/GamificationHeader';
import TaskList from './components/TaskList'; 
import AddFolderForm from './components/AddFolderForm'; 
import AddTaskForm from './components/AddTaskForm';

function App() {
  const { state } = useData();

  // Usaremos o ID da pasta "Livros" como exemplo
  // No futuro, este ID virá da pasta que o utilizador selecionou
  const activeFolderId = state.folders.length > 1 ? state.folders[1].id : null;
  const activeFolderName = state.folders.length > 1 ? state.folders[1].name : 'Pasta';

  const tasksDaPastaAtiva = activeFolderId
    ? state.tasks.filter(task => task.categoryId === activeFolderId)
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
            <FolderList folders={state.folders} />
            <AddFolderForm />
          </section>
        </aside>

        <div className="flex-1"> {/* Área principal para tarefas */}
          <TaskList tasks={tasksDaPastaAtiva} title={`Tarefas de "${activeFolderName}"`} />
          {/* Só mostra o formulário de adicionar tarefa se houver uma pasta ativa (para passar o ID) */}
          {activeFolderId && <AddTaskForm categoryId={activeFolderId} />} 
        </div>
      </main>
    </div>
  );
}

export default App;