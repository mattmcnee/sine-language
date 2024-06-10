import React, { useState, useEffect, useRef } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './quizBox.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

const QuizBox = ({ expression, validAns, nextQuiz, motivs }) => {
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
          {ansState === "correct" &&
            <>
            <div className="correct-answer">{motivs[Math.floor(Math.random() * motivs.length)]}</div>
            <button onClick={() => nextQuiz(true)} className="correct">Continue</button>
            </>
          }
          {ansState === "incorrect" &&
            <>
            <div className="correct-answer">{validAns[0]}</div>
            <button onClick={() => nextQuiz(false)} className="incorrect">Continue</button>
            </>
          }
        </div>
      </form>
    </div>
  );
};

export default QuizBox;

