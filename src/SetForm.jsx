import React, { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import EquationTranslations from './EquationTranslations';
import SaveDate from './SaveDate';

const EquationForm = ({ equationsData, titleData, saveTimeData, saveChanges, generateDummy, unfilteredEquations }) => {
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
        const newLocal = { ...equation, latex: event.target.value };
        console.log(newLocal)
        return mergeWithUnfiltered(newLocal);
      }
      return equation;
    });
    setEquations(updatedEquations);
    setHasUnsavedChanges(true);

    // const mergedEquation = mergeWithUnfiltered(editedEquation);
    // setEquations((updatedEquations) =>
    //   prevEquations.map((eq) =>
    //     eq.latex === editedEquation.latex ? mergedEquation : eq
    //   )
    // );
  };

  const mergeWithUnfiltered = (equation) => {
    const encodedKey = encodeURIComponent(equation.latex);
    if (unfilteredEquations[encodedKey]) {
      return { ...unfilteredEquations[encodedKey], ...equation, ans: unfilteredEquations[encodedKey].ans };
    }
    return equation;
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
    console.log(equations);
  };

  const handleDeleteEquation = (index) => {
    const newEquations = equations.filter((_, i) => i !== index);
    setEquations(newEquations);
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
        {equations.map((equation, index) => (
          <div key={equation.id} className="equation-container">
            <div className="equation-content">
              <div className="equation-inline">
                <button onClick={() => editThisEquation(equation.id)} className="edit-equation">
                  <i className="fas fa-edit"></i>
                  {equation.ans ? (
                    <span className="answer-num">({equation.ans.length})</span>
                  ):(
                    <span className="answer-num">(0)</span>
                  )}
                </button>
                <input
                  type="text"
                  value={equation.latex}
                  onChange={(event) => handleInputChange(equation.id, event)}
                  className="main-input"
                />
                <div className="maths-box">
                  <BlockMath>{equation.latex}</BlockMath>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteEquation(index)}
                >
                  <i className="fas fa-trash"></i>
                </button>
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
