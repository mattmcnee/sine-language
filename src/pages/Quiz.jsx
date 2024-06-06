import React from 'react';
import QuizBox from '/src/QuizBox';

const Quiz = () => {


  var latexExpression = "\\sum"
  var latRef = encodeURIComponent(latexExpression)

  // decodeURIComponent(latRef)



  return (
    <div>
      <h1>{latRef}</h1>
      <QuizBox expression="\frac{a}{b}" validAns={['a divided by b', 'a over b']} />
    </div>
  );
};

export default Quiz;