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
          const firebaseArray = Object.values(firebaseData);
          console.log(firebaseArray)
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
    
    // encode the latex attribute and remove expanded and id
    const encodedEquations = sheetData.equations.reduce((acc, eq) => {
      const { expanded, id, ...rest } = eq;
      const encodedKey = encodeURIComponent(rest.latex);
      acc[encodedKey] = rest;
      return acc;
    }, {});

    // save it
    const existingSheetRef = ref(database, `/equations`);
    set(existingSheetRef, encodedEquations).then(() => {
      setSaveTime(now);
    }).catch(error => {
      console.error(`Error updating sheet in Firebase:`, error);
    });

    console.log(sheetData);
    setSaveTime(now);
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
    <>
      <Nav />
      <EquationForm
        equationsData={equations}
        titleData={title}
        saveTimeData={saveTime}
        saveChanges={saveChanges}
        generateDummy={generateDummy}
      />
    </>
  );
};

export default EditEquations;
