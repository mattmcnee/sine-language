import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import OpenAI from 'openai';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Create from './Create';
import CreateSet from './CreateSet';
import EditEquations from './EditEquations';
import EditSet from './EditSet';
import './app.scss';

function App ({ newMainTitle }) {
  const [title, setTitle] = useState("Sine Language");

  // Config
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
  };
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth(app);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const setMainTitle = (data) => {
    setTitle(data);
  }

  useEffect(() => {
    newMainTitle(title);
    console.log(title)
  }, [title]);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home setMainTitle={setMainTitle}/>}/>
          <Route exact path="/quiz/:id?" element={<Quiz database={database} setMainTitle={setMainTitle} mainTitle={title}/>}/>
          <Route exact path="/create" element={<Create database={database} openai={openai}/>}/>
          <Route path="/create-set/:id?" element={<CreateSet database={database} openai={openai}/>}/>
          <Route path="/edit-equations" element={<EditEquations database={database} openai={openai}/>}/>
          <Route path="/edit-set/:id?" element={<EditSet database={database} openai={openai}/>}/>
          <Route path="*" element={<Home/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
