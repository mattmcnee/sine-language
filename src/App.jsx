import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import OpenAI from 'openai';
import Home from '/src/pages/home/Home';
import Quiz from '/src/pages/set-quiz/Quiz';
import EditEquations from '/src/pages/equations-edit/EditEquations';
import EditSet from '/src/pages/set-edit/EditSet';
import Nav from '/src/components/nav/Nav';
import './app.scss';

function App ({ newMainTitle }) {
  const [title, setTitle] = useState("Sine Language");
  const [scroll, setScroll] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Firebase Config
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
    console.log(title);
  }, [title]);

  // light/dark mode change in browser preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      if (!localStorage.getItem('theme')){
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    };
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // light/dark mode change requested by user
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const backgroundColor = theme === 'dark' ? '#333' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <div className={`page ${scroll ? '' : 'fixed'}`}>
      <Router>
        <Nav mainTitle={title} toggleTheme={toggleTheme}/>
        <Routes>
          <Route exact path="/" element={<Home setMainTitle={setMainTitle} database={database}/>}/>
          <Route exact path="/quiz/:id?" element={<Quiz database={database} openai={openai} setMainTitle={setMainTitle} setScroll={setScroll}/>}/>
          <Route path="/edit-equations" element={<EditEquations database={database} openai={openai}/>}/>
          <Route path="/edit-set/:id?" element={<EditSet database={database} openai={openai}/>}/>
          <Route path="*" element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
