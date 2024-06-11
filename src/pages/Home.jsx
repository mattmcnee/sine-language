import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '/src/Nav';

const Home = () => {

    const navigate = useNavigate();

    const newSetRedirect = () => {
      navigate('/create-set');
    };

    const quizRedirect = () => {
      navigate('/quiz/-O-36M-Za0LxFHabqj0h');
    };

  return (
    <>
      <Nav/>
      <div className="home-page">
        <h1>Home Page</h1>
        <button onClick={newSetRedirect}>Create Set</button>
        <button onClick={quizRedirect}>Play Quiz</button>
      </div>
    </>
  );
};

export default Home;