import React, { useState, useEffect } from 'react';
import QuizBox from '/src/QuizBox';
import { set, ref, get } from 'firebase/database';

const Quiz = ({ database }) => {
  const [quizData, setQuizData] = useState([]);

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

  return (
    <div>
      <h1>Maths Quiz</h1>
      {quizData.map((item, index) => (
        <QuizBox key={index} expression={item.expression} validAns={item.validAns} />
      ))}
    </div>
  );
};

export default Quiz;

