import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import QuizBox from '/src/QuizBox';
import { ref, set, get, push } from 'firebase/database';
import './create-set.scss';
import { BlockMath } from 'react-katex';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SaveDate from './SaveDate';
import Nav from './Nav';
import EquationTranslations from './EquationTranslations';

const EditEquations = ({ database, openai }) => {
  const [equations, setEquations] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveTime, setSaveTime] = useState("unsaved");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      const worksheetRef = ref(database, `/equations`);
      get(worksheetRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const firebaseData = snapshot.val();
            console.log(firebaseData);
            const firebaseArray = Object.values(firebaseData);
            const transformedEquations = firebaseArray.map((equation, index) => ({
              id: new Date().getTime() + index,
              ans: equation.ans,
              latex: decodeURIComponent(equation.latex),
              expanded: false
            }));
            setEquations(transformedEquations);
            console.log(transformedEquations);
          } else {
            console.error('Error getting data:', error);
            // navigate('/404');
          }
        })
        .catch((error) => {
          console.error('Error getting data:', error);
          // navigate('/404');

        });
  }, []);

  const handleInputChange = async (id, event) => {
    const updatedEquations = equations.map(equation => {
      if (equation.id === id) {
        return { ...equation, latex: event.target.value };
      }
      return equation;
    });
    setEquations(updatedEquations);
    setHasUnsavedChanges(true);
  };

  const saveChanges = () => {
    const now = new Date();
    const latexEquations = equations.map(eq => encodeURIComponent(eq.latex));
    const sheetData = {title: title, equations: latexEquations}

    if (id == "new" || id == null) { // for creating a new sheet
      const newSheetRef = push(ref(database, 'sets/'));
      set(newSheetRef, sheetData).then(() => {
        id = newSheetRef.key;
        navigate(`/create-set/${id}`);
      }).catch(error => {
        console.error("Error writing new sheet data to Firebase:", error);
      });
    } else { // for updating a sheet, a reference to the existing sheet
      const existingSheetRef = ref(database, `sets/${id}`);
      set(existingSheetRef, sheetData).then(() => {
        setSaveTime(now);
        setHasUnsavedChanges(false);
      }).catch(error => {
        console.error(`Error updating sheet ${id} in Firebase:`, error);
      });
    } 
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const editThisEquation = (id) => {
    const updatedEquations = equations.map(equation => {
      if (equation.id === id) {
        return { ...equation, expanded: !equation.expanded };
      }
      return equation;
    });
    setEquations(updatedEquations);
  }

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
    console.log(newEquations)
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
  }


  return (
    <>
      <Nav />
      <div className="create-set-list">
        <div className="top-nav">
          <input
            className="set-title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter set title"
          />
          {/*<span>{saveTime}</span>*/}
          <SaveDate date={saveTime} />
          <button onClick={() => saveChanges()} className="save-changes">
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
    </>
  );
};

export default EditEquations;
