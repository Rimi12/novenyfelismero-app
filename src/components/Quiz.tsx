import React, { useState, useEffect, useCallback } from 'react';
import plantsData from '../data/plants.json';
import PlantImage from './PlantImage';

interface Plant {
  id: number;
  hungarianName: string;
  latinName: string;
  category: string;
}

interface Question {
  correctPlant: Plant;
  options: string[];
}

interface QuizProps {
  source: 'wiki' | 'local';
}

const Quiz: React.FC<QuizProps> = ({ source }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const startQuiz = useCallback(() => {
    // Kategóriák szerinti csoportosítás
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

    // Vizsga összeállítása a kért arányok szerint
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

    // Összes kiválasztott növény megkeverése a kvízhez
    const shuffledSelected = selectedPlants.sort(() => Math.random() - 0.5);
    
    const newQuestions: Question[] = shuffledSelected.map((plant) => {
      // Helytelen válaszok sorsolása a TELJES adatbázisból (hogy ne csak a kiválasztott 50-ből legyenek)
      const distractors = plantsData
        .filter((p: any) => p.id !== plant.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((p: any) => p.hungarianName);

      const options = [plant.hungarianName, ...distractors].sort(() => Math.random() - 0.5);

      return {
        correctPlant: plant,
        options
      };
    });

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentIndex].correctPlant.hungarianName;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (questions.length === 0) return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
      <p className="text-green-800 font-bold">Kvíz összeállítása...</p>
    </div>
  );

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 glass-panel text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Kvíz vége!</h2>
        <div className="text-6xl font-black text-green-600 mb-6">{score} / {questions.length}</div>
        <p className="text-lg text-gray-600 mb-8 font-medium">
          {score === questions.length ? '🥇 Gratulálunk! Hibátlan vizsgasor!' : 
           score > questions.length * 0.8 ? '🥈 Nagyszerű! Nagyon közel a siker!' : 
           score > questions.length * 0.6 ? '🥉 Jó úton jársz, de van még mit csiszolni!' : 
           '❌ Gyakorolj még többet a sikeres vizsgához!'}
        </p>
        <button 
          onClick={startQuiz}
          className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all hover:scale-105"
        >
          Új kvíz indítása
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 mt-8 pb-10">
      {/* Haladásjelző */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-green-800 font-bold bg-white/50 px-3 py-1 rounded-full text-sm border border-green-100">
          Tétel: {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-green-600 font-bold bg-white/50 px-3 py-1 rounded-full text-sm border border-green-100">
          Találat: {score}
        </span>
      </div>
      
      <div className="w-full bg-green-100 h-3 rounded-full mb-8 overflow-hidden shadow-inner">
        <div 
          className="bg-green-500 h-full transition-all duration-500 shadow-md" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Kérdés kártya */}
      <div className="glass-panel p-6 animate-slide-up">
        <PlantImage 
          latinName={currentQuestion.correctPlant.latinName} 
          hungarianName={currentQuestion.correctPlant.hungarianName} 
          source={source}
        />
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
              className={`
                p-4 rounded-xl text-lg font-semibold transition-all duration-300 border-2 text-left relative overflow-hidden
                ${!selectedAnswer ? 'bg-white border-green-100 hover:border-green-500 hover:shadow-md' : ''}
                ${selectedAnswer === option && isCorrect ? 'bg-green-500 border-green-500 text-white shadow-lg scale-105 z-10' : ''}
                ${selectedAnswer === option && !isCorrect ? 'bg-red-500 border-red-500 text-white shadow-lg' : ''}
                ${selectedAnswer && option === currentQuestion.correctPlant.hungarianName ? 'bg-green-500 border-green-500 text-white' : ''}
                ${selectedAnswer && option !== currentQuestion.correctPlant.hungarianName && selectedAnswer !== option ? 'bg-gray-50 border-gray-100 text-gray-300' : ''}
              `}
            >
              <div className="flex items-center">
                <span className="mr-3 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 text-xs shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="truncate">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={() => { if(confirm('Valóban újra akarod indítani a kvízt?')) startQuiz(); }}
          className="text-xs text-green-700/50 hover:text-green-700 font-bold uppercase tracking-widest transition-colors"
        >
          Vizsgasor újragenerálása
        </button>
      </div>
    </div>
  );
};

export default Quiz;
