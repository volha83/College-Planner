import './App.css';
import React from 'react';
// import Navbar from "./components/Navbar/Navbar";

function App() {
  console.log('cod', import.meta.env.VITE_AIRTABLE_BASE_ID);
  console.log('name table', import.meta.env.VITE_TABLE_NAME);
  console.log('all:', import.meta.env);
  return (
    <div>
      <h1> College Planner</h1>
      <p> text </p>
    </div>
  );
}

export default App;
