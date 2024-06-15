import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizCompletion = ({ score, totalQuestions }) => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div className="quiz-completion">
      <h1>Congratulations!</h1>
      <p>You have completed the quiz.</p>
      <p>Your score: {score} out of {totalQuestions}</p>
      <div onClick={handleRedirect}>
        <span>Return Home</span>
      </div>
    </div>
  );
};

export default QuizCompletion;
