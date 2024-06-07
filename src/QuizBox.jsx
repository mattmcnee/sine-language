import React, { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './quizBox.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const QuizBox = ({ expression, validAns }) => {
  const [userAnswer, setUserAnswer] = useState('');

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (validAns.includes(userAnswer)) {
      alert('Correct!');
    } else {
      alert('Incorrect, try again.');
    }
  };

  return (
    <div className="quiz-box">
      <div className="maths-box">
        <BlockMath>{expression}</BlockMath>
      </div>
      <form className="user-input" onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={userAnswer} 
          onChange={handleInputChange} 
          placeholder="Enter your answer" 
        />
        <button type="submit"><i className="fas fa-paper-plane"></i></button>
      </form>
    </div>
  );
};

export default QuizBox;

