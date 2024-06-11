// EquationTranslations.js
import React from 'react';

const EquationTranslations = ({ equation, handleAnswerChange, addAnswerAt }) => {
  return (
    <div className="equation-translations">
      {equation.ans.map((ans, index) => (
        <div key={index} className="equation-answer">
          <input
            type="text"
            value={ans}
            className="equation-answer-box"
            onChange={(event) => handleAnswerChange(equation.id, index, event)}
          />
        </div>
      ))}
      <div className="equation-add-box">
        <button onClick={() => addAnswerAt(equation.id)} className="equation-add-button">
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default EquationTranslations;
