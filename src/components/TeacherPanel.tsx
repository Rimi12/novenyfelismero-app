import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PlantImage from './PlantImage';
import plantsData from '../data/plants.json';

interface Answer {
  plant_id: number;
  plant_name: string;
  student_answer: string;
  points?: number;
}

interface Submission {
  id: string;
  student_name: string;
  group_name?: string;
  created_at: string;
  answers: Answer[];
  status: string;
  score: number | null;
}

interface Feedback {
  id: string;
  created_at: string;
  name: string;
  group_name?: string;
  rating: number;
  comments: string;
}

const TeacherPanel: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradingAnswers, setGradingAnswers] = useState<Answer[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState<'submissions' | 'feedbacks'>('submissions');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const getFormattedDay = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch (e) {
      return 'Ismeretlen dátum';
    }
  };

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

  const fetchFeedbacks = async () => {
    setFeedbackLoading(true);
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFeedbacks(data);
    } else {
      console.warn("Could not fetch feedbacks:", error);
    }
    setFeedbackLoading(false);
  };

  const fetchAllData = async () => {
    await Promise.all([fetchSubmissions(), fetchFeedbacks()]);
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchAllData();
    }
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'tanar2026') {
      setIsAuthorized(true);
    } else {
      alert('Hibás jelszó!');
    }
  };

  const handleOpenSubmission = (s: Submission) => {
    setSelectedSubmission(s);
    
    // Auto-grade initializing
    const initAnswers = s.answers.map(a => {
      if (a.points === undefined) {
        // Tömeges szóközök eltávolítása és kisbetűsítés az ellenőrzéshez
        const studentClean = a.student_answer ? a.student_answer.toLowerCase().trim() : '';
        const correctClean = a.plant_name.toLowerCase().trim();
        const isCorrect = studentClean === correctClean;
        return { ...a, points: isCorrect ? 1 : 0 };
      }
      return a;
    });
    setGradingAnswers(initAnswers);
  };

  const handlePointChange = (index: number, newPoints: number) => {
    const updated = [...gradingAnswers];
    updated[index].points = newPoints;
    setGradingAnswers(updated);
  };

  const totalPoints = gradingAnswers.reduce((sum, a) => sum + (a.points || 0), 0);

  const handleSaveScore = async () => {
    if (!selectedSubmission) return;

    const { error } = await supabase
      .from('submissions')
      .update({ 
        score: totalPoints, 
        status: 'graded',
        answers: gradingAnswers 
      })
      .eq('id', selectedSubmission.id);

    if (!error) {
      alert('Pontszám sikeresen elmentve!');
      fetchAllData();
      setSelectedSubmission(null);
    } else {
      alert('Hiba történt a mentés során!');
      console.error(error);
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

  const groups = Array.from(
    new Set(submissions.map(s => s.group_name || 'Nincs megadva').filter(Boolean))
  ).sort();

  const filteredSubmissions = submissions.filter(s => {
    if (selectedGroup === 'all') return true;
    const g = s.group_name || 'Nincs megadva';
    return g === selectedGroup;
  });

  const groupedSubmissions: Record<string, Submission[]> = {};
  filteredSubmissions.forEach(sub => {
    const day = getFormattedDay(sub.created_at);
    if (!groupedSubmissions[day]) {
      groupedSubmissions[day] = [];
    }
    groupedSubmissions[day].push(sub);
  });

  return (
    <div className="max-w-4xl mx-auto mt-8 pb-20">
      {/* Portál Fejléc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Tanári Felület</h2>
          <p className="text-sm text-slate-500 mt-1">
            {activeTab === 'submissions' 
              ? `Beérkezett vizsgák kezelése (${filteredSubmissions.length} db)` 
              : `Beérkezett visszajelzések értékelése (${feedbacks.length} db)`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'submissions' && (
            /* Csoport szűrő dropdown */
            <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 px-3 py-2 animate-fade-in">
              <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Csoport:</span>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 outline-none border-none pr-4 cursor-pointer focus:ring-0"
              >
                <option value="all">Minden csoport ({submissions.length})</option>
                {groups.map(g => (
                  <option key={g} value={g}>
                    {g} ({submissions.filter(s => (s.group_name || 'Nincs megadva') === g).length})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button 
            onClick={fetchAllData}
            className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 flex items-center justify-center text-lg active:scale-95 cursor-pointer"
            title="Frissítés"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Navigációs Tabok */}
      <div className="flex border-b border-slate-200/80 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-4 text-base font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'submissions'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>📝</span> Vizsgák ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab('feedbacks')}
          className={`pb-4 text-base font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'feedbacks'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>💬</span> Visszajelzések ({feedbacks.length})
        </button>
      </div>

      {activeTab === 'feedbacks' ? (
        feedbackLoading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center p-20 glass-panel opacity-50 animate-fade-in">
            <p className="text-xl font-bold text-slate-400">Még nem érkezett visszajelzés.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 animate-fade-in">
            {feedbacks.map((f) => (
              <div key={f.id} className="glass-panel p-6 flex flex-col justify-between hover:border-green-200 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{f.name || 'Névtelen'}</h4>
                      <span className="inline-block mt-1 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200/60">
                        {f.group_name || 'Nincs megadva'}
                      </span>
                    </div>
                    <div className="flex gap-0.5 text-lg">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx}>{idx < f.rating ? '⭐' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 font-medium italic mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                    "{f.comments}"
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 mt-4 font-bold text-right">
                  {new Date(f.created_at).toLocaleString('hu-HU', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Submissions View */
        loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center p-20 glass-panel opacity-50">
            <p className="text-xl font-bold text-slate-400">Nincs beküldött vizsga ebben a szűrésben.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.keys(groupedSubmissions).map((day) => (
              <div key={day} className="space-y-4">
                {/* Dátum Csoport Fejléc */}
                <div className="flex items-center gap-3 px-1 animate-fade-in">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                  <h3 className="text-lg font-black text-slate-700 uppercase tracking-wider">{day}</h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {groupedSubmissions[day].length} db
                  </span>
                  <div className="flex-1 h-px bg-slate-200/80"></div>
                </div>

                <div className="grid gap-4">
                  {groupedSubmissions[day].map((s) => (
                    <div 
                      key={s.id} 
                      onClick={() => handleOpenSubmission(s)}
                      className="glass-panel p-6 cursor-pointer hover:border-blue-300 transition-all flex justify-between items-center group animate-slide-up"
                    >
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {s.student_name}
                          </h4>
                          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200/60">
                            {s.group_name || 'Nincs megadva'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">
                          Óra: {new Date(s.created_at).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {s.status === 'graded' ? (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                            JAVÍTVA: {s.score} pont
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                            JAVÍTÁSRA VÁR
                          </span>
                        )}
                        <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Részletek Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-800">{selectedSubmission.student_name}</h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-black px-2.5 py-1 rounded-full">
                    {selectedSubmission.group_name || 'Nincs megadva'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Írásbeli vizsga javítása • {new Date(selectedSubmission.created_at).toLocaleString('hu-HU')}</p>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50">
              <div className="space-y-4">
                {gradingAnswers.map((a, i) => {
                  // Növény adatainak kikeresése a képi megjelenítéshez
                  const plant = plantsData.find(p => p.id === a.plant_id);
                  
                  return (
                    <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6">
                      {/* Növény Képe */}
                      {plant && (
                        <div className="w-full sm:w-32 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative">
                           {/* Használjuk a PlantImage-t a lokális kép betöltéséhez */}
                           <div className="absolute inset-0 pointer-events-none">
                              <PlantImage 
                                latinName={plant.latinName} 
                                hungarianName={plant.hungarianName} 
                                source="local" 
                              />
                           </div>
                           <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-bold z-10">
                              #{(i+1)}
                           </span>
                        </div>
                      )}

                      {/* Szöveges Válaszok */}
                      <div className="flex-1 flex flex-col justify-center gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Tanuló válasza:</p>
                            <p className={`text-lg font-bold ${a.student_answer?.toLowerCase().trim() === a.plant_name.toLowerCase().trim() ? 'text-green-600' : 'text-slate-800'}`}>
                              {a.student_answer || <span className="text-slate-300 italic">(üresen hagyta)</span>}
                            </p>
                          </div>
                          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                            <p className="text-xs font-bold text-blue-400/80 uppercase mb-1">Helyes válasz:</p>
                            <p className="text-lg font-bold text-blue-700">
                              {a.plant_name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pontozás */}
                      <div className="flex sm:flex-col items-center justify-center sm:border-l sm:pl-6 border-slate-100 min-w-[100px] gap-2 sm:gap-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 hidden sm:block">Pont:</label>
                        <input 
                          type="number" 
                          min="0"
                          step="0.5"
                          value={a.points === undefined ? '' : a.points}
                          onChange={(e) => handlePointChange(i, parseFloat(e.target.value) || 0)}
                          className={`w-20 p-3 text-center bg-slate-50 rounded-xl border-2 transition-all font-black text-xl outline-none
                            ${a.points && a.points > 0 ? 'border-green-400 text-green-700 focus:border-green-500 bg-green-50' : 'border-slate-200 focus:border-blue-400 text-slate-700'}
                          `}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t bg-white flex items-center justify-between gap-6 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10">
              <div className="flex-1">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Összpontszám:</span>
                <span className="text-3xl font-black text-green-600">
                  {totalPoints} <span className="text-lg text-slate-400 font-medium">/ 50 pont</span>
                </span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Mégse
                </button>
                <button 
                  onClick={handleSaveScore}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <span>✅</span> Mentés
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPanel;
