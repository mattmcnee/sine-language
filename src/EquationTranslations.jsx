import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const EquationTranslations = ({ equation, updateAnswers, generateDummy }) => {
  const [answers, setAnswers] = useState([...equation.ans]);

  useEffect(() => {
    setAnswers([...equation.ans]);
  }, [equation.ans]);

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
    updateAnswers(equation.id, newAnswers);
  };

  const handleAddAnswer = () => {
    const newAnswers = [...answers, ''];
    setAnswers(newAnswers);
    updateAnswers(equation.id, newAnswers);
  };

  const handleGenerateDummy = async () => {
    const newDummyAnswers = await generateDummy(equation.latex);
    const newAnswers = [...answers, ...newDummyAnswers];
    setAnswers(newAnswers);
    updateAnswers(equation.id, newAnswers);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newAnswers = Array.from(answers);
    const [removed] = newAnswers.splice(result.source.index, 1);
    newAnswers.splice(result.destination.index, 0, removed);

    setAnswers(newAnswers);
    updateAnswers(equation.id, newAnswers);
  };

  const handleDeleteAnswer = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
    updateAnswers(equation.id, newAnswers);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="answers">
        {(provided) => (
          <div
            className="equation-translations"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {answers.map((ans, index) => (
              <Draggable key={index} draggableId={index.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="equation-answer"
                  >
                    <div className="drag-handle" {...provided.dragHandleProps}>
                      <i className="fas fa-bars"></i>
                    </div>
                    <input
                      type="text"
                      value={ans}
                      className="equation-answer-box"
                      onChange={(event) => handleAnswerChange(index, event)}
                    />
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteAnswer(index)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div className="equation-add-box">
              <button onClick={handleAddAnswer} className="equation-add-button">
                <i className="fas fa-plus"></i>
              </button>
              <button onClick={handleGenerateDummy} className="equation-generate-button">
                <i className="fas fa-magic"></i>
              </button>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default EquationTranslations;
