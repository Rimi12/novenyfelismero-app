import { useState } from 'react';
import Quiz from './components/Quiz';
import WrittenQuiz from './components/WrittenQuiz';
import TeacherPanel from './components/TeacherPanel';

type AppMode = 'selection' | 'quiz' | 'written' | 'teacher';

function App() {
  const [mode, setMode] = useState<AppMode>('selection');
  const [quizSource, setQuizSource] = useState<'wiki' | 'local'>('wiki');

  const startQuiz = (source: 'wiki' | 'local') => {
    setQuizSource(source);
    setMode('quiz');
  };

  const startWritten = () => {
    setMode('written');
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
          {mode !== 'selection' && (
            <button 
              onClick={() => setMode('selection')}
              className="text-sm font-bold text-green-700 hover:text-green-900 transition-colors"
            >
              Vissza a főmenübe
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {mode === 'selection' && (
          <div className="mt-8 md:mt-12 text-center animate-slide-up">
            <div className="mb-6 inline-block p-4 bg-green-100 rounded-full text-green-700 text-5xl">
              🌱
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6 leading-tight">
              Miben segíthetek ma?
            </h2>
            <p className="text-lg text-green-700/80 mb-12 max-w-lg mx-auto">
              Válaszd ki a számodra legmegfelelőbb tanulási vagy vizsgázási formát!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Gyakorló Mód */}
              <button
                onClick={() => startQuiz('wiki')}
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

              {/* Vizsga Mód (Feleletválasztós) */}
              <button
                onClick={() => startQuiz('local')}
                className="group p-8 bg-green-600 rounded-3xl shadow-xl border-2 border-transparent hover:border-green-400 transition-all hover:scale-105 text-left text-white"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📸</div>
                <h3 className="text-2xl font-bold mb-2">Vizsga Mód</h3>
                <p className="text-white/70 text-sm">
                  Valós fotók használata. Feleletválasztós teszt az 50 kötelező növényből.
                </p>
                <div className="mt-6 flex items-center text-white font-bold text-sm">
                  INDÍTÁS <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                </div>
              </button>

              {/* Írásbeli Vizsga */}
              <button
                onClick={startWritten}
                className="group p-8 bg-white rounded-3xl shadow-xl border-2 border-transparent hover:border-blue-500 transition-all hover:scale-105 text-left md:col-span-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">✍️</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Írásbeli Vizsga</h3>
                    <p className="text-slate-500 text-sm">
                      Névvel ellátott, gépelős vizsga. A válaszaidat a tanár fogja javítani az adatbázisban.
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Új funkció
                  </div>
                </div>
                <div className="mt-6 flex items-center text-blue-600 font-bold text-sm">
                  VIZSGA MEGKEZDÉSE <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                </div>
              </button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-4 opacity-40">
               <button 
                onClick={() => setMode('teacher')}
                className="p-4 bg-white rounded-2xl shadow-sm border border-green-50 hover:opacity-100 transition-opacity"
               >
                  <div className="text-2xl mb-2">👨‍🏫</div>
                  <div className="text-sm font-bold">Tanári Belépés</div>
               </button>
            </div>
          </div>
        )}

        {mode === 'quiz' && <Quiz source={quizSource} />}
        {mode === 'written' && <WrittenQuiz />}
        {mode === 'teacher' && <TeacherPanel />}
      </main>

      <footer className="mt-20 text-center text-green-900/30 text-sm italic">
        © 2026 Növényfelismerő Gyakorló v2.0 | Supabase Edition
      </footer>
    </div>
  );
}

export default App;
