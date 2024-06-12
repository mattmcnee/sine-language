import React, { useEffect } from 'react';
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

const ProgressBar = ({ currentVid, timePlayed }) => {
  useEffect(() => {
    const progressBar = document.getElementById('main-bar');

    function removeLastIfSpace(inputString) {
      const lastChar = inputString.charAt(inputString.length - 1);
      const trimmedString = inputString.trim();
      if (lastChar === ' ' || lastChar === '.') {
        return trimmedString.slice(0, -1);
      } else {
        return trimmedString;
      }
    }

    function createProgressBar(shortList) {
      progressBar.innerHTML = ''; // Clear the previous content
      for (let i = 0; i < shortList.length; i++) {
        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.width = `${shortList[i].percentage}%`;
        segment.id = `seg-${i}`;

        const grey = document.createElement('div');
        grey.className = 'grey';
        grey.id = `grey-${i}`;

        const progress = document.createElement('div');
        progress.className = 'progress';
        progress.id = `prog-${i}`;
        progress.style.width = '0';

        const vid = document.createElement('div');
        vid.className = 'video';
        vid.id = `vid-${i}`;
        let displayText = shortList[i].title;
        if (displayText.length > 35) {
          displayText = removeLastIfSpace(displayText.substring(0, 35)) + "...";
        }
        vid.textContent = displayText;
        progress.style.width = '200px';

        grey.appendChild(progress);
        segment.appendChild(grey);
        segment.appendChild(vid);
        progressBar.appendChild(segment);
      }
    }

    function updateProgressBar(currentVid, timePlayed, vidDuration) {
      for (let i = 0; i < currentVid; i++) {
        const progress = document.getElementById(`prog-${i}`);
        progress.style.width = '100%';
        progress.style.display = 'block';
      }

      const percentPlayed = Math.min(timePlayed / vidDuration * 100, 100);
      const progress = document.getElementById(`prog-${currentVid}`);
      progress.style.width = `max(${percentPlayed}%, 5px)`;
      progress.style.display = 'block';
    }

    function refreshProgressBar(shortList, currentVid) {
      let totalDuration = 0;
      for (const videoData of shortList) {
        totalDuration += videoData.seconds;
      }

      for (const videoData of shortList) {
        videoData.percentage = (videoData.seconds / totalDuration) * 100;
      }

      const vidDuration = shortList[currentVid].seconds;

      createProgressBar(shortList);
      updateProgressBar(currentVid, timePlayed, vidDuration);
    }

    refreshProgressBar(shortList, currentVid);
  }, [shortList, currentVid, timePlayed]);

  return (
    <div className="bar-content">
      <div className="progress-container" id="main-bar"></div>
    </div>
  );
};

export default ProgressBar;