import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import QuizBox from '/src/QuizBox';
import { ref, set, get, push } from 'firebase/database';
import './create-set.scss';
import { BlockMath } from 'react-katex';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SaveDate from './SaveDate';
import Nav from './Nav';

const CreateSet = ({ database, openai }) => {
  const [equations, setEquations] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveTime, setSaveTime] = useState("unsaved");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    if (id != "new" && id != null) {
      const worksheetRef = ref(database, `/sets/${id}`);
      console.log(id)
      get(worksheetRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const firebaseData = snapshot.val();
            const transformedEquations = firebaseData.equations.map((equation, index) => ({
              id: new Date().getTime() + index,
              ans: false,
              latex: decodeURIComponent(equation)
            }));
            setEquations(transformedEquations);
            setTitle(firebaseData.title)
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
    }else{
      setEquations([{id: new Date().getTime(), ans: false, latex: ""}]);
    }
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const updatedEquations = Array.from(equations);
    const [movedItem] = updatedEquations.splice(result.source.index, 1);
    updatedEquations.splice(result.destination.index, 0, movedItem);
    setEquations(updatedEquations);
    setHasUnsavedChanges(true);
  };

  const addEquationAtIndex = (index) => {
    setHasUnsavedChanges(true);
    const newEquation = {
      id: new Date().getTime(),
      ans: false,
      latex: ""
    };
    const updatedEquations = [...equations];
    updatedEquations.splice(index, 0, newEquation);
    setEquations(updatedEquations);
  };

  const handleInputChange = async (id, event) => {
    // update stored latex value
    const updatedEquations = equations.map(equation => {
      if (equation.id === id) {
        return { ...equation, latex: event.target.value };
      }
      return equation;
    });
    setEquations(updatedEquations);
    setHasUnsavedChanges(true);

    // check if this latex already has a definition
    const isThere = await checkEquation(event.target.value);
    const newEquations = updatedEquations.map(equation => {
      if (equation.id === id) {
        return { ...equation, ans: isThere };
      }
      return equation;
    });
    setEquations(newEquations);

    console.log(newEquations);
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

  const checkEquation = async (exp) => {
    if (exp == ""){
      return false;
    }
    const newSheetRef = ref(database, `equations/${encodeURIComponent(exp)}`);
    try {
      const snapshot = await get(newSheetRef);
      return snapshot.exists();
    } catch (error) {
      console.error("Error checking data existence in Firebase:", error);
      return false;
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <>
    <Nav/>
    <div className="create-set-list">
      <div className="top-nav">
        <input
          className="set-title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter set title"
        />
        {/*<span>{saveTime}</span>*/}
        <SaveDate date={saveTime}/>
        <button onClick={() => saveChanges()} className="save-changes">
          <i className="fas fa-save"></i>
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div className="drop-scroll" id="set-scroll" {...provided.droppableProps} ref={provided.innerRef}>
              {equations.map((equation, index) => (
                <Draggable key={equation.id} draggableId={equation.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="equation-container"
                    >
                      <div className="add-equation-inline-box">
                        <button onClick={() => addEquationAtIndex(index)} className="add-equation-inline">
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div className="equation-content">
                      <div className="drag-handle" {...provided.dragHandleProps}>
                        <i className="fas fa-bars"></i>
                      </div>
                      <input
                        type="text"
                        value={equation.latex}
                        onChange={(event) => handleInputChange(equation.id, event)}
                      />
                      <BlockMath>{equation.latex}</BlockMath>
                      {equation.ans &&
                        <i className="fas fa-check"></i>
                      }
                      {!equation.ans && equation.latex != "" &&
                        <i className="fas fa-times"></i>
                      }
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="add-equation">
          <button onClick={() => addEquationAtIndex(equations.length)}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </DragDropContext>
    </div>
    </>
  );
};

export default CreateSet;
