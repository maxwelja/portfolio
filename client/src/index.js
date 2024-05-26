import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Resumé" element={<Home />} />
        <Route path="/CoverLetter" element={<Home />} />
        <Route path="/Solo" element={<Home />} />
        <Route path="/Group" element={<Home />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();