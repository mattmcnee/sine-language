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
    const worksheetRef = ref(database, `/sheets/`);
    get(worksheetRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          const decodedData = Object.keys(firebaseData).map(key => ({
            expression: decodeURIComponent(key),
            validAns: firebaseData[key].ans
          }));
          setQuizData(decodedData);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error('Error getting data:', error);
      });
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


