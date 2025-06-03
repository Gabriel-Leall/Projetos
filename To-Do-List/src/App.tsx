// src/App.tsx
import { useData } from './context/dataContext';
import FolderList from './components/FolderList'; // 1. IMPORTA o FolderList
import GamificationHeader from './components/GamificationHeader';

function App() {
  const { state } = useData();

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-sky-700 mb-4">
          To-Do List Gamificada
        </h1>
        <GamificationHeader />
      </header>

      <main>
        <section className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">
            Pastas
          </h2>
          {/* 2. USA o FolderList aqui, passando as pastas do estado como prop */}
          <FolderList folders={state.folders} />
        </section>

        <section className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">
            Tarefas (da pasta selecionada)
          </h2>
          {/* Ainda um placeholder */}
          <p className="text-slate-500">Selecione uma pasta para ver as tarefas.</p>
        </section>
      </main>
    </div>
  );
}

export default App;