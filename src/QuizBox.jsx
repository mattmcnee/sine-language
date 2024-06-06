import React, { useState } from 'react';
import Latex from 'react-latex';

const QuizBox = ({ expression, validAns }) => {
  const [userAnswer, setUserAnswer] = useState('');

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (validAns.includes(userAnswer)) {
      alert('Correct!');
    } else {
      alert('Incorrect, try again.');
    }
  };

  return (
    <div>
      <h1>Quiz</h1>
      <div>
        <Latex>{expression}</Latex>
      </div>
      <div>
        <input 
          type="text" 
          value={userAnswer} 
          onChange={handleInputChange} 
          placeholder="Enter your answer" 
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default QuizBox;
