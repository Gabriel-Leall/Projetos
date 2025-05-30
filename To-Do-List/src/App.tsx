// src/App.tsx
import { useData } from "./context/dataContext";

function App() {
  const { state } = useData();
  return (
    /* INFO: container principal da página */
    <div className="p-6 bg-slate-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font bold text-sky-700"> To-Do List</h1>
      </header>

    // Info: conteudo principal
      <main>
        <section className="mb-6 p-4 bg-white rounded-lg shadow"> 
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">Pastas</h2>
          {state.folders.length === 0 ? (
            <p className="text-slate-500">
               Nenhuma pasta criada ainda.
            </p> ) : (
              <ul className="list-none p-0"> {/* Info: lista de pastas */}
                {state.folders.map((folder) => ( // Info: mapeia as pastas do estado e exibe cada uma
                  <li key={folder.id} className="p-3 mb-2 bg-sky-50 hover:bg-sky-100 rounded shadow-sm border border-sky-200 cursor-pointer"> {folder.name} </li> ))} // Info: exibe o nome da pasta
              </ul>
            )}
        </section>

        <section className="p-4 bg-white rounded-lg shadow"> // Info: seção de tarefas
          <h2 className="text-2xl font-semibold text-slate-800 mb-3"> Tarefas (da pasta selecionada)</h2> {/*TODO: Por agora, uma mensagem. Depois lista de tarefas */}
          <p className="text-slate-500"> Selecione uma pasta para ver as tarefas.</p>
        </section>
      </main>
    </div>
  );
}

export default App;  // Info: container principal da página