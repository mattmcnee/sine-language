import React, { useEffect, useState } from 'react';
import './progressBar.scss';

const shortList = [
  {
    title: "Quantum mechanics as a framework. Defining linearity",
    duration: "00:17:49",
    percentage: 18.236096895257592,
    seconds: 1069
  },
  {
    title: "Linearity and nonlinear theories. Schrödinger's equation",
    duration: "00:10:03",
    percentage: 10.286591606960082,
    seconds: 603
  },
  {
    title: "Necessity of complex numbers",
    duration: "00:07:39",
    percentage: 7.830092118730808,
    seconds: 459
  },
  {
    title: "Photons and the loss of determinism",
    duration: "00:17:21",
    percentage: 17.75844421699079,
    seconds: 1041
  },
  {
    title: "The nature of superposition. Mach-Zehnder interferometer",
    duration: "00:14:31",
    percentage: 14.85841009894234,
    seconds: 871
  },
  {
    title: "More on superposition. General state of a photon and spin states",
    duration: "00:17:11",
    percentage: 17.587853974752644,
    seconds: 1031
  },
  {
    title: "Entanglement",
    duration: "00:13:08",
    percentage: 13.442511088365746,
    seconds: 788
  }
];

const ProgressBar = ({ currentVid, timePlayed, score }) => {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const totalDuration = shortList.reduce((total, video) => total + video.seconds, 0);
    const updatedProgressData = shortList.map(video => ({
      ...video,
      percentage: (video.seconds / totalDuration) * 100
    }));
    setProgressData(updatedProgressData);
  }, [shortList]);

  const calculateWidth = (index, vidDuration) => {
    if (index < currentVid) {
      return '100%';
    }
    if (index === currentVid) {
      const percentPlayed = Math.min((timePlayed / vidDuration) * 100, 100);
      return `${percentPlayed}%`;
    }
    return '0%';
  };

  const removeLastIfSpace = (inputString) => {
    const lastChar = inputString.charAt(inputString.length - 1);
    const trimmedString = inputString.trim();
    return (lastChar === ' ' || lastChar === '.') ? trimmedString.slice(0, -1) : trimmedString;
  };

  return (
    <div className="main-bar-container">
    <span className="bar-span">Level {currentVid+1}</span>
    <div className="bar-content">
      <div className="progress-container" id="main-bar">
        {progressData.map((video, index) => {
          const displayText = video.title.length > 35
            ? `${removeLastIfSpace(video.title.substring(0, 35))}...`
            : video.title;

          const vidDuration = video.seconds;
          const width = calculateWidth(index, vidDuration);

          return (
            <div key={index} className="segment" style={{ width: `${video.percentage}%` }}>
              <div className="grey">
                <div className="progress" style={{ width: width }}></div>
              </div>
              <div className="video">{displayText}</div>
            </div>
          );
        })}
      </div>
    </div>
    <span className="bar-span">Mastery {score}/14</span>
    </div>
  );
};

export default ProgressBar;
