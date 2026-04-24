import { useState } from 'react';
import Quiz from './components/Quiz';

function App() {
  const [started, setStarted] = useState(false);
  const [quizSource, setQuizSource] = useState<'wiki' | 'local'>('wiki');

  const handleStart = (source: 'wiki' | 'local') => {
    setQuizSource(source);
    setStarted(true);
  };

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
          <div className="mt-12 md:mt-16 text-center animate-slide-up">
            <div className="mb-6 inline-block p-4 bg-green-100 rounded-full text-green-700 text-5xl">
              🌱
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6 leading-tight">
              Készen állsz a <br />parkgondozó vizsgára?
            </h2>
            <p className="text-lg text-green-700/80 mb-12 max-w-lg mx-auto">
              Válaszd ki a tanulási módot és kezdd el a felkészülést!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => handleStart('wiki')}
                className="group p-8 bg-white rounded-3xl shadow-xl border-2 border-transparent hover:border-green-500 transition-all hover:scale-105 text-left"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌐</div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Gyakorló Mód</h3>
                <p className="text-green-700/60 text-sm">
                  Wikipedia képek használata. Ideális a növények szélesebb körű megismeréséhez.
                </p>
                <div className="mt-6 flex items-center text-green-600 font-bold text-sm">
                  INDÍTÁS <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                </div>
              </button>

              <button
                onClick={() => handleStart('local')}
                className="group p-8 bg-green-600 rounded-3xl shadow-xl border-2 border-transparent hover:border-green-400 transition-all hover:scale-105 text-left text-white"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📸</div>
                <h3 className="text-2xl font-bold mb-2">Vizsga Mód</h3>
                <p className="text-white/70 text-sm">
                  Valós fotók használata. A vizsgán előforduló 50 kötelező növény felismeréséhez.
                </p>
                <div className="mt-6 flex items-center text-white font-bold text-sm">
                  INDÍTÁS <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                </div>
              </button>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-40">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-green-50">
                <div className="text-2xl mb-2">🇭🇺</div>
                <div className="text-sm font-bold">Magyar Nevek</div>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-green-50">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-bold">Azonnali Visszajelzés</div>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-green-50">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-sm font-bold">Arányos Sorsolás</div>
              </div>
            </div>
          </div>
        ) : (
          <Quiz source={quizSource} />
        )}
      </main>

      <footer className="mt-20 text-center text-green-900/30 text-sm italic">
        © 2026 Növényfelismerő Gyakorló MVP v1.1
      </footer>
    </div>
  );
}

export default App;
