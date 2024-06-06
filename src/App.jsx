import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/quiz" element={<Quiz/>}/>
          <Route path="*" element={<Home/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
