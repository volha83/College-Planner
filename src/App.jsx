import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AdmissionTasksPage from './pages/AdmissionTasks/AdmissionTasksPage';
import ShoppingPage from './pages/CollegeShopping/ShoppingPage';
import NotFound from './pages/NotFound';
import './App.css';
import React from 'react';

function App() {
  const thisYear = new Date().getFullYear();
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<AdmissionTasksPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer> &#169; Volha Padlipskaya {thisYear} </footer>
      </div>
    </Router>
  );
}
export default App;
