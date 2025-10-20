import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import React from 'react';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <h2 className={styles.logo}>College Planner 🎓</h2>
        <div className={styles.links}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Admission Tasks
          </NavLink>
          <NavLink
            to="/shopping"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            College Shopping
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
