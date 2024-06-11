import React, { useState } from 'react';
import QuizBox from '/src/QuizBox';
import { ref, set, get } from 'firebase/database';
import './create.scss';
import { BlockMath } from 'react-katex';

const Create = ({ database, openai }) => {
  const [latexExpression, setLatexExpression] = useState("");
  const [answers, setAnswers] = useState(["", "", "", "", ""]);

  const handleLatexChange = (e) => {
    setLatexExpression(e.target.value);
  };

  const handleAnswerChange = (index, e) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
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

  const handleSubmit = () => {
    const newSheetRef = ref(database, `equations/${encodeURIComponent(latexExpression)}`);

    // Check if the data already exists
    get(newSheetRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Data already exists:", snapshot.val());
        } else {
          set(newSheetRef, {
            ans: answers.filter(answer => answer.trim() !== ""),
            latex: latexExpression
          }).then(() => {
            const id = newSheetRef.key;
            console.log(`New sheet created with ID: ${id}`);
          }).catch(error => {
            console.error("Error writing new sheet data to Firebase:", error);
          });
        }
      })
      .catch((error) => {
        console.error("Error checking data existence in Firebase:", error);
      });
  };


  const openaiTest = async () => {
    const dummyAnswers = await generateDummy(latexExpression);
    setAnswers(dummyAnswers);
  }

  const generateDummy = async (input) => {
    const instructions = `Given a LaTeX expression, return an array of written English ways of expressing the LaTeX`;
    const questionPrompt = `Return a JSON array of at least five ways of expressing:`;
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
    <div className="container">
      <div>
        <label>
          LaTeX Expression:
          <input type="text" value={latexExpression} onChange={handleLatexChange} />
        </label>
      </div>
      <div className="maths-box">
        <BlockMath>{latexExpression}</BlockMath>
      </div>
      <div>
        {answers.map((answer, index) => (
          <div key={index}>
            <label className="answer-label">
              Answer {index + 1}:
              <input type="text" value={answer} onChange={(e) => handleAnswerChange(index, e)} />
            </label>
          </div>
        ))}
      </div>
      <div className="bottom">
        <button onClick={openaiTest}>Generate Translations</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Create;
