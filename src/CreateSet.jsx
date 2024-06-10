import React, { useState } from 'react';
import QuizBox from '/src/QuizBox';
import { ref, set, get } from 'firebase/database';
import './create.scss';
import { BlockMath } from 'react-katex';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const CreateSet = ({ database, openai }) => {
  const [equations, setEquations] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
  };

  const addEquation = () => {
    setHasUnsavedChanges(true);
    const newEquation = {
      id: new Date().getTime(),
      key: "",
      latex: ""
    };
    setEquations([...equations, newEquation]);
  }


  return (
    <div className="container">
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Droppable droppableId="droppable" >
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
                      <div className="drag-handle" {...provided.dragHandleProps}>
                        <i className="fas fa-bars"></i>
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
          <button onClick={addEquation}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </DragDropContext>
    </div>
  );
};

export default CreateSet;
