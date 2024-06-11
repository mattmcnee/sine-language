import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const newMainTitle = (data) => {
  document.title = data;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App newMainTitle={newMainTitle}/>
  </React.StrictMode>,
)
