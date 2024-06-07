import React, { useState } from 'react';
import QuizBox from '/src/QuizBox';
import { ref, set, push } from 'firebase/database';

const Create = ({ database }) => {
  const [latexExpression, setLatexExpression] = useState("\\frac{a}{b}");
  const [answers, setAnswers] = useState(["", "", "", "", ""]);

  const handleLatexChange = (e) => {
    setLatexExpression(e.target.value);
  };

  const handleAnswerChange = (index, e) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const newSheetRef = ref(database, `sheets/${encodeURIComponent(latexExpression)}`);
    set(newSheetRef, {
      ans: answers.filter(answer => answer.trim() !== ""),
      latex: latexExpression
    }).then(() => {
      const id = newSheetRef.key;
      console.log(`New sheet created with ID: ${id}`);
    }).catch(error => {
      console.error("Error writing new sheet data to Firebase:", error);
    });
  };

  return (
    <div>
      <h1>Maths Quiz</h1>
      <div>
        <label>
          LaTeX Expression:
          <input type="text" value={latexExpression} onChange={handleLatexChange} />
        </label>
      </div>
      <div>
        {answers.map((answer, index) => (
          <div key={index}>
            <label>
              Answer {index + 1}:
              <input type="text" value={answer} onChange={(e) => handleAnswerChange(index, e)} />
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Create;


