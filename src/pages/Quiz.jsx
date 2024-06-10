import React, { useState, useEffect } from 'react';
import QuizBox from '/src/QuizBox';
import { set, ref, get } from 'firebase/database';

const Quiz = ({ database }) => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);

  const motivs = [
    "well done!",
    "nice work!",
    "correct!",
    "good work!",
    "perfect!",
    "nice job!"
    ]

  useEffect(() => {
    const getEqData = async (value) => {
      const dataRef = ref(database, `/equations/${value}`);
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        const eqData = snapshot.val();
        return eqData.ans;
      } else {
        return [];
      }
    };

    const fetchWorksheetData = async () => {
      const worksheetRef = ref(database, `/sets/test/`);
      try {
        const snapshot = await get(worksheetRef);
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          const decodedData = await Promise.all(
            Object.entries(firebaseData).map(async ([key, value]) => ({
              expression: decodeURIComponent(value),
              validAns: await getEqData(value),
            }))
          );
          console.log(decodedData);
          setQuizData(decodedData);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error getting data:', error);
      }
    };

    fetchWorksheetData();
  }, [database]);


  const handleNextQuiz = (isCorrect) => {
    setCurrentQuizIndex((prevIndex) => prevIndex + 1);
    if (isCorrect){
      setScore((preScore => preScore + 1));
    }
  };

  return (
    <div>
      <h1>Score: {score}</h1>
      {quizData.length > 0 && currentQuizIndex < quizData.length && (
        <QuizBox 
          key={currentQuizIndex} 
          expression={quizData[currentQuizIndex].expression} 
          validAns={quizData[currentQuizIndex].validAns}
          nextQuiz={handleNextQuiz} 
          motivs={motivs}
        />
      )}
    </div>
  );
};

export default Quiz;


