import React, { useEffect, useState } from 'react';
import './progressBar.scss';

const ProgressBar = ({ score, level, quizData }) => {
  const [progressData, setProgressData] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const total = quizData.reduce((sum, levelData) => sum + levelData.length, 0);
    const updatedProgressData = quizData.map((levelData, index) => ({
      level: index + 1,
      totalQuestions: levelData.length,
      percentage: (index === level) ? (score / levelData.length) * 100 : (index < level) ? 100 : 0,
      width: (levelData.length / total) * 100
    }));
    setProgressData(updatedProgressData);
    setTotalQuestions(total);
  }, [level, score, quizData]);

  return (
    <div className="main-bar-container">
      <span className="bar-span">Level {level + 1}</span>
      <div className="bar-content">
        <div className="progress-container" id="main-bar">
          {progressData.map((levelData, index) => (
            <div key={index} className="segment" style={{ width: `${levelData.width}%` }}>
              <div className="grey">
                <div className="progress" style={{ width: `${levelData.percentage}%` }}></div>
              </div>
              <div className="video">Level {levelData.level}</div>
            </div>
          ))}
        </div>
      </div>
      <span className="bar-span">Mastery {score}/{progressData[level]?.totalQuestions || 0}</span>
    </div>
  );
};

export default ProgressBar;
