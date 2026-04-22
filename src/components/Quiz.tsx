import React, { useState, useEffect } from 'react';
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

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Kvíz inicializálása: 50 kérdés generálása
  useEffect(() => {
    const startQuiz = () => {
      // Összes növény megkeverése
      const shuffledPlants = [...plantsData].sort(() => Math.random() - 0.5);
      
      const newQuestions: Question[] = shuffledPlants.map((plant) => {
        // Helytelen válaszok sorsolása
        const distractors = plantsData
          .filter(p => p.id !== plant.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(p => p.hungarianName);

        // Válaszlehetőségek összerakása és megkeverése
        const options = [plant.hungarianName, ...distractors].sort(() => Math.random() - 0.5);

        return {
          correctPlant: plant as Plant,
          options
        };
      });

      setQuestions(newQuestions);
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
    };

    startQuiz();
  }, []);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Megakadályozzuk a többszöri kattintást

    setSelectedAnswer(answer);
    const correct = answer === questions[currentIndex].correctPlant.hungarianName;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    }

    // Késleltetés a következő kérdés előtt, hogy látszódjon a visszajelzés
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

  if (questions.length === 0) return <div>Betöltés...</div>;

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 glass-panel text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Kvíz vége!</h2>
        <div className="text-6xl font-black text-green-600 mb-6">{score} / {questions.length}</div>
        <p className="text-lg text-gray-600 mb-8">
          {score === questions.length ? 'Gratulálunk! Hibátlan teljesítmény!' : 
           score > questions.length / 2 ? 'Szép munka, de van még mit gyakorolni!' : 
           'Gyakorolj még többet a sikeres vizsgához!'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all hover:scale-105"
        >
          Újrakezdés
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 mt-8">
      {/* Haladásjelző */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-green-800 font-bold">Kérdés: {currentIndex + 1} / {questions.length}</span>
        <span className="text-green-600 font-bold underline font-mono">Pontszám: {score}</span>
      </div>
      
      <div className="w-full bg-green-100 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-green-500 h-full transition-all duration-500" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Kérdés kártya */}
      <div className="glass-panel p-6 animate-slide-up">
        <PlantImage 
          latinName={currentQuestion.correctPlant.latinName} 
          hungarianName={currentQuestion.correctPlant.hungarianName} 
        />
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
              className={`
                p-4 rounded-xl text-lg font-semibold transition-all duration-300 border-2 text-left
                ${!selectedAnswer ? 'bg-white border-green-100 hover:border-green-500 hover:shadow-md' : ''}
                ${selectedAnswer === option && isCorrect ? 'bg-green-500 border-green-500 text-white' : ''}
                ${selectedAnswer === option && !isCorrect ? 'bg-red-500 border-red-500 text-white' : ''}
                ${selectedAnswer && option === currentQuestion.correctPlant.hungarianName ? 'bg-green-500 border-green-500 text-white' : ''}
                ${selectedAnswer && option !== currentQuestion.correctPlant.hungarianName && selectedAnswer !== option ? 'bg-gray-50 border-gray-100 text-gray-300' : ''}
              `}
            >
              <span className="mr-3 opacity-50">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
