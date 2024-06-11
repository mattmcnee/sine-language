import React, { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import EquationTranslations from './EquationTranslations';
import SaveDate from './SaveDate';

const EquationForm = ({ equationsData, titleData, saveTimeData, saveChanges }) => {
  const [equations, setEquations] = useState(equationsData);
  const [title, setTitle] = useState(titleData);
  const [saveTime, setSaveTime] = useState(saveTimeData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setEquations(equationsData);
    setTitle(titleData);
    setSaveTime(saveTimeData);
  }, [equationsData, titleData, saveTimeData]);

  const handleInputChange = (id, event) => {
    const updatedEquations = equations.map(equation => {
      if (equation.id === id) {
        return { ...equation, latex: event.target.value };
      }
      return equation;
    });
    setEquations(updatedEquations);
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setHasUnsavedChanges(true);
  };

  const editThisEquation = (id) => {
    const updatedEquations = equations.map(equation => {
      if (equation.id === id) {
        return { ...equation, expanded: !equation.expanded };
      }
      return equation;
    });
    setEquations(updatedEquations);
    setHasUnsavedChanges(true);
  };

  const handleAnswerChange = (id, index, event) => {
    const newEquations = equations.map((equation) =>
      equation.id === id
        ? {
            ...equation,
            ans: equation.ans.map((ans, i) => (i === index ? event.target.value : ans)),
          }
        : equation
    );
    setEquations(newEquations);
    setHasUnsavedChanges(true);
  };

  const addAnswerAt = (id) => {
    const newEquations = equations.map((equation) =>
      equation.id === id
        ? {
            ...equation,
            ans: [...equation.ans, ""],
          }
        : equation
    );
    setEquations(newEquations);
    setHasUnsavedChanges(true);
  };

  const addEquationAtIndex = (index) => {
    const newEquation = {
      id: new Date().getTime(),
      latex: "",
      ans: [""],
      expanded: false,
    };
    const newEquations = [...equations];
    newEquations.splice(index, 0, newEquation);
    setEquations(newEquations);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="create-set-list">
      <div className="top-nav">
        <input
          className="set-title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter set title"
        />
        <SaveDate date={saveTime} />
        <button onClick={() => saveChanges({ title: title, equations: equations })} className="save-changes">
          <i className="fas fa-save"></i>
        </button>
      </div>
      <div className="drop-scroll" id="set-scroll">
        {equations.map((equation) => (
          <div key={equation.id} className="equation-container">
            <div className="equation-content">
              <div className="equation-inline">
                <button onClick={() => editThisEquation(equation.id)} className="edit-equation">
                  <i className="fas fa-edit"></i>
                  <span className="answer-num">({equation.ans.length})</span>
                </button>
                <input
                  type="text"
                  value={equation.latex}
                  onChange={(event) => handleInputChange(equation.id, event)}
                  className="main-input"
                />
                <BlockMath>{equation.latex}</BlockMath>
              </div>
              {equation.expanded && (
                <EquationTranslations equation={equation} handleAnswerChange={handleAnswerChange} addAnswerAt={addAnswerAt} />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="add-equation">
        <button onClick={() => addEquationAtIndex(equations.length)}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default EquationForm;
