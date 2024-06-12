import React, { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import EquationTranslations from './EquationTranslations';
import SaveDate from './SaveDate';

const EquationForm = ({ equationsData, titleData, saveTimeData, saveChanges, generateDummy }) => {
  const [equations, setEquations] = useState(equationsData);
  const [title, setTitle] = useState(titleData);
  const [saveTime, setSaveTime] = useState(saveTimeData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setEquations(equationsData);
    setTitle(titleData);
  }, [equationsData, titleData]);

  useEffect(() => {
    setSaveTime(saveTimeData);
  }, [saveTimeData]);

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

  const updateAnswers = (equationId, newAnswers) => {
    setEquations((prevEquations) =>
      prevEquations.map((equation) =>
        equation.id === equationId ? { ...equation, ans: newAnswers } : equation
      )
    );
  };

  const addEquationAtIndex = (index) => {
    const newEquation = {
      id: new Date().getTime(),
      latex: "",
      ans: [],
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
        value={"Full Equation Set"}
        onChange={handleTitleChange}
        placeholder="Enter set title"
        disabled={true}
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
                  {equation.ans && (
                  <span className="answer-num">({equation.ans.length})</span>
                  )}
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
                <EquationTranslations equation={equation} updateAnswers={updateAnswers} generateDummy={generateDummy} />
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
