import React, { useState, useEffect } from 'react';
import QuizBox from '/src/QuizBox';
import { set, ref, get } from 'firebase/database';
import { useParams } from 'react-router-dom';
import Nav from '/src/Nav';
import ProgressBar from '/src/ProgressBar';
import GlowEffect from '/src/GlowEffect';

const Quiz = ({ database, setMainTitle, mainTitle }) => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [length, setLength] = useState(0);
  const { id } = useParams();

  // glow effect
  const [isGlowing, setIsGlowing] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const handleGlow = () => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 1000);
  };

  const motivs = [
    "well done!",
    "nice work!",
    "correct!",
    "good work!",
    "perfect!",
    "nice job!"
  ];

  useEffect(() => {
    const fetchWorksheetData = async () => {
      var setsRef = ref(database, `/sets/-O-36M-Za0LxFHabqj0h/`);
      if (id != null){
        setsRef = ref(database, `/sets/${id}`);
      }

      const setsSnapshot = await get(setsRef);
      if (setsSnapshot.exists()) {
        const setsData = setsSnapshot.val();
        console.log("eq", setsData)
        if (setsData.equations){
          const filteredKeys = Object.keys(setsData.equations);
          const filteredEquations = filteredKeys.map((key, index) => ({
            id: new Date().getTime() + index,
            ans: setsData.equations[key].ans || [],
            latex: decodeURIComponent(key),
            level: setsData.equations[key].level || '1'
          }));
          console.log(filteredEquations)
          setQuizData(filteredEquations)
          setMainTitle(setsData.title)
        }
      }
    };

    fetchWorksheetData();
  }, [database]);

  const handleNextQuiz = () => {
    setCurrentQuizIndex((prevIndex) => prevIndex + 1);
  };

  const increaseScore = (doInrease) => {
    if (doInrease){
      setScore((preScore => preScore + 1));
      setIsCorrect(true);     
    } else{
      setIsCorrect(false); 
    }
    handleGlow(true);
  }

  return (
    <div className="page quiz-page">
      <GlowEffect isGlowing={isGlowing} isCorrect={isCorrect}/>
      <Nav mainTitle={mainTitle}/>
      <div className="quiz-content">
        <ProgressBar currentVid={2} timePlayed={230} score={score} />
        {quizData.length > 0 && currentQuizIndex < quizData.length && (
          <QuizBox 
            key={currentQuizIndex} 
            expression={quizData[currentQuizIndex].latex} 
            validAns={quizData[currentQuizIndex].ans}
            nextQuiz={handleNextQuiz} 
            motivs={motivs}
            increaseScore={increaseScore}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
