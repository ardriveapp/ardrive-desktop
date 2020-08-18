/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { selectCount } from './counterSlice';
import styles from './WelcomeChoice.css';

export default function WelcomeChoice() {
  // const dispatch = useDispatch();
  // const value = useSelector(selectCount);
  return (
    <div className={styles.choice}>
      <h2>Welcome</h2>
      <span>Have a wallet? Drag it anywhere</span>
      <span className={styles.setupText}>
        Otherwise,
        <a href="#">click here</a>
        to get set up!
      </span>
    </div>
  );
}
