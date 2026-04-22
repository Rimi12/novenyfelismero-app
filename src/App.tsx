import { useState } from 'react';
import Quiz from './components/Quiz';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="py-6 px-4 bg-white/50 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-2xl">
              🌿
            </div>
            <h1 className="text-xl md:text-2xl font-black text-green-900 tracking-tight">
              Növényfelismerő <span className="text-green-600">Gyakorló</span>
            </h1>
          </div>
          {started && (
            <button 
              onClick={() => window.location.reload()}
              className="text-sm font-bold text-green-700 hover:text-green-900 transition-colors"
            >
              Kilépés
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {!started ? (
          <div className="mt-12 md:mt-20 text-center animate-slide-up">
            <div className="mb-8 inline-block p-4 bg-green-100 rounded-full text-green-700 text-5xl">
              🌱
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6 leading-tight">
              Készen állsz a <br />parkgondozó vizsgára?
            </h2>
            <p className="text-lg text-green-700/80 mb-10 max-w-lg mx-auto">
              Ez a gyakorló program segít az 50 kötelező növény <br />
              felismerésében. 50 kérdés, 4 válasz, 1 cél: a siker!
            </p>
            
            <button
              onClick={() => setStarted(true)}
              className="group relative px-10 py-5 bg-green-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:bg-green-700 transition-all hover:scale-105 active:scale-95"
            >
              Kvíz Indítása
              <span className="ml-2 group-hover:ml-4 transition-all">→</span>
            </button>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-60">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-green-50">
                <div className="text-2xl mb-2">📸</div>
                <div className="text-sm font-bold">50 Valós Fotó</div>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-green-50">
                <div className="text-2xl mb-2">🇭🇺</div>
                <div className="text-sm font-bold">Magyar Nevek</div>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-green-50">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-bold">Azonnali Visszajelzés</div>
              </div>
            </div>
          </div>
        ) : (
          <Quiz />
        )}
      </main>

      <footer className="mt-20 text-center text-green-900/30 text-sm italic">
        © 2026 Növényfelismerő Gyakorló MVP v1.1
      </footer>
    </div>
  );
}

export default App;
