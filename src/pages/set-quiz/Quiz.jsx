import React, { useState, useEffect } from 'react';
import QuizBox from './QuizBox';
import { set, ref, get } from 'firebase/database';
import { useParams } from 'react-router-dom';
import Nav from '/src/components/nav/Nav';
import ProgressBar from '/src/components/progress-bar/ProgressBar';
import GlowEffect from '/src/components/glow-effect/GlowEffect';
import QuizCompletion from './QuizCompletion';

const Quiz = ({ database, setMainTitle, mainTitle }) => {
  const [quizData, setQuizData] = useState([]);
  const [leveledQuizData, setLeveledQuizData] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [length, setLength] = useState(0);
  const { id } = useParams();

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
            ans: setsData.equations[key].ans || [],
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

  const isQuizCompleted = currentLevelIndex >= leveledQuizData.length;

  return (
    <div className="page quiz-page">
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
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
