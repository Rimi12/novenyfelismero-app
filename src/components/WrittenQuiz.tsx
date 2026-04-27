import React, { useState, useCallback } from 'react';
import plantsData from '../data/plants.json';
import PlantImage from './PlantImage';
import { supabase } from '../lib/supabase';

interface Plant {
  id: number;
  hungarianName: string;
  latinName: string;
  category: string;
}

interface Question {
  plant: Plant;
  answer: string;
}

const WrittenQuiz: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setupQuiz = useCallback(() => {
    const byCategory: Record<string, Plant[]> = {
      egynyari: [],
      evelo: [],
      lombhullato: [],
      orokzold: [],
      dezsas: [],
      gyom: []
    };

    plantsData.forEach((p: any) => {
      if (byCategory[p.category]) {
        byCategory[p.category].push(p as Plant);
      }
    });

    const sample = (arr: Plant[], count: number) => {
      return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
    };

    const selectedPlants = [
      ...sample(byCategory.egynyari, 10),
      ...sample(byCategory.evelo, 15),
      ...sample(byCategory.lombhullato, 15),
      ...sample(byCategory.orokzold, 5),
      ...sample(byCategory.dezsas, 2),
      ...sample(byCategory.gyom, 3)
    ];

    const shuffled = selectedPlants.sort(() => Math.random() - 0.5);
    setQuestions(shuffled.map(p => ({ plant: p, answer: '' })));
  }, []);

  const handleNext = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].answer = currentAnswer;
    setQuestions(updatedQuestions);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer(questions[currentIndex + 1].answer || '');
    } else {
      finishQuiz(updatedQuestions);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex].answer = currentAnswer;
      setQuestions(updatedQuestions);
      
      setCurrentIndex(currentIndex - 1);
      setCurrentAnswer(questions[currentIndex - 1].answer);
    }
  };

  const finishQuiz = async (finalQuestions: Question[]) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('submissions').insert([
        {
          student_name: studentName,
          answers: finalQuestions.map(q => ({
            plant_id: q.plant.id,
            plant_name: q.plant.hungarianName,
            student_answer: q.answer
          }))
        }
      ]);

      if (error) throw error;
      setIsFinished(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('Hiba történt a beküldés során. Kérlek szólj a tanárodnak!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 glass-panel animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✍️</div>
          <h2 className="text-2xl font-bold text-slate-800">Írásbeli Vizsga</h2>
          <p className="text-slate-500 mt-2">Kérlek add meg a nevedet a kezdéshez!</p>
        </div>
        
        <input
          type="text"
          placeholder="Teljes neved..."
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all mb-6 text-lg font-medium"
        />

        <button
          onClick={() => {
            if (studentName.trim().length < 3) {
              alert('Kérlek adj meg egy érvényes nevet!');
              return;
            }
            setupQuiz();
            setIsStarted(true);
          }}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          Vizsga Megkezdése
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto mt-12 p-10 glass-panel text-center animate-fade-in">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Sikeresen beküldve!</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Köszönjük, <strong>{studentName}</strong>!<br />
          A válaszaidat rögzítettük, a tanárod hamarosan javítani fogja.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all"
        >
          Bezárás
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 mt-8 pb-10">
      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-600 font-bold bg-white/80 px-4 py-2 rounded-full text-sm border border-slate-100 shadow-sm">
           Tanuló: {studentName}
        </span>
        <span className="text-blue-600 font-bold bg-white/80 px-4 py-2 rounded-full text-sm border border-blue-100 shadow-sm">
           {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden shadow-inner">
        <div 
          className="bg-blue-500 h-full transition-all duration-500" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="glass-panel p-6 animate-slide-up">
        <PlantImage 
          latinName={currentQuestion.plant.latinName} 
          hungarianName={currentQuestion.plant.hungarianName} 
          source="local" 
        />

        <div className="mt-8">
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Növény neve:
          </label>
          <input
            type="text"
            autoFocus
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            placeholder="Gépeld ide a választ..."
            className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-xl font-semibold text-slate-800"
          />
        </div>

        <div className="mt-10 flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`px-8 py-4 rounded-xl font-bold transition-all ${
              currentIndex === 0 ? 'bg-slate-100 text-slate-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ← Vissza
          </button>
          
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : currentIndex === questions.length - 1 ? (
              'Vizsga Befejezése'
            ) : (
              'Következő'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WrittenQuiz;
