import React, { useState, useEffect } from 'react';
import QuizBox from '/src/QuizBox';
import { set, ref, get } from 'firebase/database';

const Quiz = ({ database }) => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

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

  const handleNextQuiz = () => {
    setCurrentQuizIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div>
      <h1>Maths Quiz</h1>
      {quizData.length > 0 && currentQuizIndex < quizData.length && (
        <QuizBox 
          key={currentQuizIndex} 
          expression={quizData[currentQuizIndex].expression} 
          validAns={quizData[currentQuizIndex].validAns} 
        />
      )}
      {currentQuizIndex < quizData.length - 1 && (
        <button onClick={handleNextQuiz}>Next</button>
      )}
    </div>
  );
};

export default Quiz;


