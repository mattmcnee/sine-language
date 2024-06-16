import React, { useState, useEffect, useRef } from 'react';
import './popup.scss';

const PopupBar = ({ info }) => {
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
  }, []);

  return (
    <div className={`popup ${info.show ? 'show' : ''}`}>
      {info.text}
    </div>
  );
};

export default PopupBar;
