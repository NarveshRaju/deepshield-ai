// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import Components and Pages
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage'; // <-- IMPORT THE NEW PAGE
import TechnologyPage from './pages/TechnologyPage'; // <-- IMPORT THE NEW PAGE

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base font-sans text-gray-200 antialiased relative">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} /> {/* <-- USE THE REAL COMPONENT */}
            <Route path="/technology" element={<TechnologyPage />} /> {/* <-- USE THE REAL COMPONENT */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;