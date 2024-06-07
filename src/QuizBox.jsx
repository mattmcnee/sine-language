import React, { useState, useEffect, useRef } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './quizBox.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const QuizBox = ({ expression, validAns, nextQuiz }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [ansState, setAnsState] = useState("check");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validAns.includes(userAnswer)) {
      setAnsState("correct")
    } else {
      setAnsState("incorrect")
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
          ref={inputRef}
        />
        <div className="bottom-box">
          {ansState=="check" &&
            <button type="submit">Check</button>
          }
          {ansState=="correct" &&
            <button onClick={nextQuiz} className="correct">Continue</button>
          }
          {ansState=="incorrect" &&
            <button onClick={nextQuiz} className="incorrect">Continue</button>
          }
        </div>
      </form>
    </div>
  );
};

export default QuizBox;

