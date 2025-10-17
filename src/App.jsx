import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AdmissionTasksPage from './pages/AdmissionTasks/AdmissionTasksPage';
import ShoppingPage from './pages/CollegeShopping/ShoppingPage';
import './App.css';
import React from 'react';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<AdmissionTasksPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
