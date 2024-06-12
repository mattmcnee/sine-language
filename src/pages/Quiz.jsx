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
      var worksheetRef = ref(database, `/sets/-O-36M-Za0LxFHabqj0h/`);
      if (id != null){
        worksheetRef = ref(database, `/sets/${id}`);
      }
      try {
        const snapshot = await get(worksheetRef);
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          const eqDataRef = ref(database, `equation-data/equations/`);
          const eqSnapshot = await get(eqDataRef);

          if (eqSnapshot.exists()) {
            const eqData = eqSnapshot.val();
            const decodedData = Object.entries(firebaseData.equations).map(([key, value]) => ({
              expression: decodeURIComponent(value),
              validAns: eqData[value]?.ans || [],
            }));
            console.log(decodedData);
            setQuizData(decodedData);
            setMainTitle(firebaseData.title)
          } else {
            console.log('No equation data available');
          }
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error getting data:', error);
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
            expression={quizData[currentQuizIndex].expression} 
            validAns={quizData[currentQuizIndex].validAns}
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
