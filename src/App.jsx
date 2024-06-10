import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import OpenAI from 'openai';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Create from './Create';
import CreateSet from './CreateSet';

function App() {
  const [count, setCount] = useState(0)


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

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/quiz" element={<Quiz database={database}/>}/>
          <Route exact path="/create" element={<Create database={database} openai={openai}/>}/>
          <Route path="/create-set/:id?" element={<CreateSet database={database} openai={openai}/>}/>
          <Route path="*" element={<Home/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
