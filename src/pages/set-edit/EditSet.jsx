import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, set, get, push, update } from 'firebase/database';
import '/src/components/equations-form/create-set.scss';
import Nav from '/src/components/nav/Nav';
import SetForm from './SetForm';

const EditSet = ({ database, openai }) => {
  const [equations, setEquations] = useState([]);
  const [unfilteredEquations, setUnfilteredEquations] = useState({});
  const [saveTime, setSaveTime] = useState("unsaved");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadEquationData = async () => {
      try {
        // First request to load all equations
        const worksheetRef = ref(database, `/equation-data`);
        const snapshot = await get(worksheetRef);
        let allEquations = {};

        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          allEquations = firebaseData.equations;
          setUnfilteredEquations(allEquations);

          // If the id is "new" or null, set the initial equations state and return early
          if (id === "new" || id === null) {
            setEquations([{ id: new Date().getTime(), ans: false, latex: "", level: 1 }]);
            return;
          }

          // Second request to load keys of the desired equations
          const setsRef = ref(database, `/sets/${id}`);
          const setsSnapshot = await get(setsRef);

          if (setsSnapshot.exists()) {
            const setsData = setsSnapshot.val();
            console.log("eq", setsData)
            if (setsData.equations){
              const filteredKeys = Object.keys(setsData.equations);

              // Filter the equations data by the keys from the second request
              const filteredEquations = filteredKeys.map((key, index) => ({
                id: new Date().getTime() + index,
                ans: allEquations[key]?.ans || false,
                latex: decodeURIComponent(key),
                expanded: false,
                level: setsData.equations[key].level ? setsData.equations[key].level : '1'
              }));

              setEquations(filteredEquations);
              setTitle(setsData.title);
              setSaveTime(setsData.saveTime)
            } else{
              setEquations([]);
            }
          } else {
            console.error('Error getting set data: No data found for the specified ID');
          }
        } else {
          console.error('Error getting equation data: No data found in /equation-data');
        }
      } catch (error) {
        console.error('Error getting data:', error);
      }
    };

    loadEquationData();
  }, [database, id]);

  const saveChanges = (sheetData) => {
    // update the database of equations keeping only latex and ans
    const encodedEquations = sheetData.equations.reduce((acc, eq) => {
      const { latex, ans } = eq;
      const encodedKey = encodeURIComponent(latex);
      acc[`equations/${encodedKey}`] = { latex, ans };
      return acc;
    }, {});

    const now = new Date();
    const existingSheetRef = ref(database, `/equation-data`);
    update(existingSheetRef, { ...encodedEquations, saveTime: now.toISOString() })
      .then(() => {
        setSaveTime(now);
      })
      .catch(error => {
        console.error('Error updating sheet in Firebase:', error);
      });

    // update the data of this quiz
    const theSetEquations = sheetData.equations.reduce((acc, eq) => {
      const { latex, ans, level } = eq;
      const encodedKey = encodeURIComponent(latex);
      acc[`${encodedKey}`] = { latex, ans, level };
      return acc;
    }, {});

    const theSetData = {equations: theSetEquations, title: sheetData.title, saveTime: now.toISOString()};

    console.log(theSetData)
    if (id === "new" || id === null) { // for creating a new sheet
      const newSheetRef = push(ref(database, 'sets/'));
      set(newSheetRef, theSetData).then(() => {
        const newId = newSheetRef.key;
        navigate(`/create-set/${newId}`);
      }).catch(error => {
        console.error("Error writing new sheet data to Firebase:", error);
      });
    } else { // for updating a sheet, a reference to the existing sheet
      const existingSheetRef = ref(database, `sets/${id}`);
      set(existingSheetRef, theSetData).then(() => {
        setSaveTime(now);
        // setHasUnsavedChanges(false);
      }).catch(error => {
        console.error(`Error updating sheet ${id} in Firebase:`, error);
      });
    } 

  };

  const removePrefix = (arr) => {
    return arr.map(str => {
      str = str.toLowerCase();
      if (str.startsWith("the ")) {
        str = str.slice(4);
      }
      return str;
    });
  }

  const generateDummy = async (input) => {
    const instructions = `Given a LaTeX expression, return an array of written English ways of expressing the LaTeX`;
    const questionPrompt = `Return a JSON array of three ways of expressing:`;
    const reminder = `It is imperative that you only return the JSON array.`;

    const prompt = [
      { role: "system", content: instructions },
      { role: 'user', content: `${questionPrompt}\n"${input}"\n${reminder}` },
    ];

    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: prompt,
        model: 'gpt-3.5-turbo',
      });

      if (chatCompletion.choices && chatCompletion.choices.length > 0) {
        const response = JSON.parse(chatCompletion.choices[0].message.content);
        console.log(response);
        return removePrefix(response);
      }
    } catch (error) {
      console.error("Failed to fetch data from OpenAI:", error);
      return [];
    }
  };


  return (
    <div>
      <SetForm
        equationsData={equations}
        titleData={title}
        saveTimeData={saveTime}
        saveChanges={saveChanges}
        generateDummy={generateDummy}
        unfilteredEquations={unfilteredEquations}
      />
    </div>
  );
};

export default EditSet;
