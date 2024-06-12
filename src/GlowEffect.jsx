import React, { useState } from 'react';
import './glowEffect.scss';

const GlowEffect = ({isGlowing, isCorrect}) => {
  return (
    <div className={`overlay ${isGlowing ? 'glow' : ''} ${isCorrect ? 'correct' : 'wrong'}`}></div>
  );
};

export default GlowEffect;
