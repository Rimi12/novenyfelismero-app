import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Submission {
  id: string;
  student_name: string;
  created_at: string;
  answers: {
    plant_id: number;
    plant_name: string;
    student_answer: string;
  }[];
  status: string;
  score: number | null;
}

const TeacherPanel: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchSubmissions();
    }
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Egyszerű jelszóvédelem (átmeneti megoldás)
    if (password === 'tanar2026') {
      setIsAuthorized(true);
    } else {
      alert('Hibás jelszó!');
    }
  };

  const handleUpdateScore = async (id: string, score: number) => {
    const { error } = await supabase
      .from('submissions')
      .update({ score, status: 'graded' })
      .eq('id', id);

    if (!error) {
      alert('Pontszám mentve!');
      fetchSubmissions();
      setSelectedSubmission(null);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 glass-panel animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-slate-800">Tanári Belépés</h2>
        </div>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Jelszó..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-green-500 outline-none transition-all mb-6"
          />
          <button className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-900 transition-all">
            Belépés
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800">Beérkezett Vizsgák</h2>
        <button 
          onClick={fetchSubmissions}
          className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-slate-100"
          title="Frissítés"
        >
          🔄
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center p-20 glass-panel opacity-50">
          <p className="text-xl font-bold text-slate-400">Még nincs beküldött vizsga.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((s) => (
            <div 
              key={s.id} 
              onClick={() => setSelectedSubmission(s)}
              className="glass-panel p-6 cursor-pointer hover:border-blue-300 transition-all flex justify-between items-center group"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{s.student_name}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {new Date(s.created_at).toLocaleString('hu-HU')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {s.status === 'graded' ? (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    JAVÍTVA: {s.score} pont
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                    JAVÍTÁSRA VÁR
                  </span>
                )}
                <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Részletek Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{selectedSubmission.student_name}</h3>
                <p className="text-sm text-slate-500">Írásbeli vizsga javítása</p>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {selectedSubmission.answers.map((a, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">#{(i+1)} {a.plant_name}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Tanuló válasza:</p>
                        <p className={`text-lg font-bold ${a.student_answer.toLowerCase() === a.plant_name.toLowerCase() ? 'text-green-600' : 'text-slate-800'}`}>
                          {a.student_answer || '(üresen hagyta)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Helyes válasz:</p>
                        <p className="text-lg font-bold text-blue-600 italic">
                          {a.plant_name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t bg-white flex items-center justify-between gap-6">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Összpontszám (max 50):</label>
                <input 
                  type="number" 
                  defaultValue={selectedSubmission.score || 0}
                  onBlur={(e) => handleUpdateScore(selectedSubmission.id, parseInt(e.target.value))}
                  className="w-24 p-3 bg-slate-100 rounded-xl border-2 border-transparent focus:border-green-500 outline-none font-bold text-xl"
                />
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold"
              >
                Kész
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPanel;
