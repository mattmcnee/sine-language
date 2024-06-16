import React, { useState, useEffect } from 'react';
import QuizBox from './QuizBox';
import { set, ref, get, push } from 'firebase/database';
import { useParams } from 'react-router-dom';
import Nav from '/src/components/nav/Nav';
import ProgressBar from '/src/components/progress-bar/ProgressBar';
import GlowEffect from '/src/components/glow-effect/GlowEffect';
import QuizCompletion from './QuizCompletion';
import PopupBar from '/src/components/popup-bar/PopupBar';

const Quiz = ({ database, openai, setMainTitle, mainTitle }) => {
  const [quizData, setQuizData] = useState([]);
  const [leveledQuizData, setLeveledQuizData] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [length, setLength] = useState(0);
  const { id } = useParams();
  const [popupInfo, setPopupInfo] = useState({text: "", show: false})
  const [checkedAns, setCheckedAns] =  useState(false);

  // glow effect
  const [isGlowing, setIsGlowing] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const handleGlow = () => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 1000);
  };

  const motivs = [
    "well done!",
    "nice work!",
    "correct!",
    "good work!",
    "perfect!",
    "nice job!"
  ];

  function groupQuestionsByLevel(quizData) {
    let groupedQuestions = {};
    quizData.forEach(question => {
      let level = question.level || 1;
      if (!groupedQuestions[level]) {
        groupedQuestions[level] = [];
      }
      groupedQuestions[level].push(question);
    });
    return Object.keys(groupedQuestions).map(level => groupedQuestions[level]);
  }

  useEffect(() => {
    const fetchWorksheetData = async () => {
      var setsRef = ref(database, `/sets/-O-36M-Za0LxFHabqj0h/`);
      if (id != null) {
        setsRef = ref(database, `/sets/${id}`);
      }

      const setsSnapshot = await get(setsRef);
      if (setsSnapshot.exists()) {
        const setsData = setsSnapshot.val();
        console.log("eq", setsData)
        if (setsData.equations) {
          const filteredKeys = Object.keys(setsData.equations);
          const filteredEquations = filteredKeys.map((key, index) => ({
            id: new Date().getTime() + index,
            ans: Object.values(setsData.equations[key].ans) || [],
            latex: decodeURIComponent(key),
            level: setsData.equations[key].level || '1'
          }));
          setQuizData(filteredEquations)
          setLeveledQuizData(groupQuestionsByLevel(filteredEquations))
          setMainTitle(setsData.title)
        }
      }
    };

    fetchWorksheetData();
  }, [database]);

  const handleNextQuiz = () => {
    setCheckedAns(false)
    setCurrentQuizIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= leveledQuizData[currentLevelIndex].length) {
        setCurrentLevelIndex((prevLevelIndex) => prevLevelIndex + 1);
        console.log(0);
        return 0; // Reset quiz index for new level
      }
      console.log(newIndex);
      return newIndex;
    });
  };

  const increaseScore = (doInrease) => {
    if (doInrease) {
      setScore((preScore => preScore + 1));
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    handleGlow(true);
  }

  const showPopup = (message, duration) => {
    setPopupInfo({ text: message, show: true });
    setTimeout(() => setPopupInfo(prev => ({ ...prev, show: false })), duration);
    setTimeout(() => setPopupInfo({ text: "", show: false }), duration + 500);
  };

  function stringToBoolean(str) {
    const responseVal = str.trim().toLowerCase().replace(/\./g, '').replace(/\"/g, '');
    return responseVal === 'true' || responseVal === 'yes';
  }


  const checkAns = async (exp, valAns, userAns) => {
    // console.log(checkedAns)
    if (!checkedAns){
      // setCheckedAns(true)

      if (userAns.trim() === "") {
        showPopup("Our AI system believes your answer is incorrect. It has been added to our list of potential answers for manual review", 3000);
        console.log("empty");
        return;
      }
      
      const instructions = `You are an assistant that checks the validity of maths expressed in written langauge.`;
      const questionPrompt = `Does "${userAns}" correctly express "${exp}" without using symbols?
      Do not require the precise translation as long as the meaning is correctly expressed. For example, "${valAns[0]}" is valid.`;
      const reminder = `Return only "true" if it is valid and only "false" if it is not or if symbols are used. 
      Ignore upper or lowercase.`;
      const prompt = [
        { role: "system", content: instructions },
        { role: 'user', content: `${questionPrompt}\n${reminder}` },
      ];

      console.log(prompt);

      try {
        const chatCompletion = await openai.chat.completions.create({
          messages: prompt,
          model: 'gpt-3.5-turbo',
        });

        if (chatCompletion.choices && chatCompletion.choices.length > 0) {
          const response = stringToBoolean(chatCompletion.choices[0].message.content);
          if (response === "true") {
            // uploadNewAns(exp, userAns);
            showPopup("Our AI system believes your answer is correct. Nice work! We'll add it to our database now", 4000);
          } else {
            showPopup("Our AI system believes your answer is incorrect. It has been added to our list of potential answers for manual review", 3000);
          }
          console.log(chatCompletion.choices[0].message.content);
        }
      } catch (error) {
        console.error("Failed to fetch data from OpenAI:", error);
      }
    }
  };

  const uploadNewAns = (equation, newAns) => {
    const newAnsRef = ref(database, `/equation-data/equations/${encodeURIComponent(equation)}/ans`);
    push(newAnsRef, newAns).then(() => {
      console.log('New answer added successfully');
    }).catch(error => {
      console.error(`Error adding new answer to Firebase:`, error);
    });

    const newSetAnsRef = ref(database, `/sets/${id}/equations/${encodeURIComponent(equation)}/ans`);
    push(newSetAnsRef, newAns).then(() => {
      console.log('New answer added successfully');
    }).catch(error => {
      console.error(`Error adding new answer to Firebase:`, error);
    });
  };
  

  const isQuizCompleted = currentLevelIndex >= leveledQuizData.length;

  return (
    <div className="page quiz-page">
      <PopupBar info={popupInfo}/>
      <GlowEffect isGlowing={isGlowing} isCorrect={isCorrect} />
      <Nav mainTitle={mainTitle} />
      <div className="quiz-content">
        {isQuizCompleted ? (
          <QuizCompletion score={score} totalQuestions={quizData.length} />
        ) : (
          <>
            <ProgressBar level={currentLevelIndex} score={currentQuizIndex} quizData={leveledQuizData} />
            {leveledQuizData.length > 0 && currentLevelIndex < leveledQuizData.length && currentQuizIndex < leveledQuizData[currentLevelIndex].length && (
              <QuizBox
                key={`${currentLevelIndex}-${currentQuizIndex}`}
                expression={leveledQuizData[currentLevelIndex][currentQuizIndex].latex}
                validAns={leveledQuizData[currentLevelIndex][currentQuizIndex].ans}
                nextQuiz={handleNextQuiz}
                motivs={motivs}
                increaseScore={increaseScore}
                checkAns={checkAns}
                checkedAns={checkedAns}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
