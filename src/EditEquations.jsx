import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, set, get, push } from 'firebase/database';
import './create-set.scss';
import Nav from './Nav';
import EquationForm from '/src/EquationForm';

const EditEquations = ({ database, openai }) => {
  const [equations, setEquations] = useState([]);
  const [saveTime, setSaveTime] = useState("unsaved");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

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
        }
      })
      .catch((error) => {
        console.error('Error getting data:', error);
      });
  }, [database]);

  const saveChanges = (sheetData) => {
    const now = new Date();
    const latexEquations = equations.map(eq => encodeURIComponent(eq.latex));

    // if (id === "new" || id == null) {
    //   const newSheetRef = push(ref(database, 'sets/'));
    //   set(newSheetRef, sheetData).then(() => {
    //     navigate(`/create-set/${newSheetRef.key}`);
    //   }).catch(error => {
    //     console.error("Error writing new sheet data to Firebase:", error);
    //   });
    // } else {
    //   const existingSheetRef = ref(database, `sets/${id}`);
    //   set(existingSheetRef, sheetData).then(() => {
    //     setSaveTime(now);
    //   }).catch(error => {
    //     console.error(`Error updating sheet ${id} in Firebase:`, error);
    //   });
    // }

    console.log(sheetData);
    setSaveTime(now);
  };

  return (
    <>
      <Nav />
      <EquationForm
        equationsData={equations}
        titleData={title}
        saveTimeData={saveTime}
        saveChanges={saveChanges}
      />
    </>
  );
};

export default EditEquations;
