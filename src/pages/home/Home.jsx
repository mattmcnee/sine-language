import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '/src/components/nav/Nav';
import { ref, get } from 'firebase/database';
import './home.scss';

const Home = ({ setMainTitle, database }) => {
  const [sets, setSets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setMainTitle("Sine Language");
  }, [setMainTitle]);

  useEffect(() => {
    const worksheetRef = ref(database, `/sets`);
    get(worksheetRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          setSets(Object.entries(firebaseData));
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [database]);

  const newSetRedirect = () => {
    navigate('/create-set');
  };

  const quizRedirect = (key) => {
    navigate(`/quiz/${key}`);
  };

  const editRedirect = (key) => {
    navigate(`/edit-set/${key}`);
  };

  return (
    <>
      <div className="home-page">
        <h2>Home Page</h2>
        <div className="sets-container">
          {sets.map(([key, set]) => (
            <div
              className="set-card"
              key={key}
              onClick={() => quizRedirect(key)}
            >
              <h3 className="title">{set.title}</h3>
              <button
                className="edit-button"
                onClick={(e) => {
                  e.stopPropagation();
                  editRedirect(key);
                }}
              >
                <i className="fas fa-edit"></i>
              </button>
            </div>
          ))}
          <button onClick={newSetRedirect} className="create-set"><i className="fas fa-plus"></i></button>
        </div>
      </div>
    </>
  );
};

export default Home;
