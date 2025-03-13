import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthWrapper } from './auth/AuthWrapper';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthWrapper />
      </BrowserRouter>
    </div>
  )
}

export default App;