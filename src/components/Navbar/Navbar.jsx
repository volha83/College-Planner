import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import React from 'react';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>College Planner 🎓</h2>
      <div className={styles.links}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : '')}
        >
          Admission Tasks
        </NavLink>
        <NavLink
          to="/shopping"
          className={({ isActive }) => (isActive ? styles.active : '')}
        >
          College Shopping
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
