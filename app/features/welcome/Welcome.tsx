import React, { useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes.json';
import styles from './Welcome.css';
import WelcomeChoice from './WelcomeChoice';
import WalletDrop from './WalletDrop';
import logo from './icon.png';

export default function Welcome(): JSX.Element {
  const onDrop = useCallback((acceptedFiles) => {
    // this callback will be called after files get dropped, we will get the acceptedFiles.
    // If you want, you can even access the rejected files too
    console.log(acceptedFiles);
  }, []);

  return (
    <>
      <div className={styles.welcome} data-tid="container">
        <img src={logo} alt="ArDrive" className={styles.logo} />
        <WelcomeChoice />
      </div>
      <WalletDrop onDrop={onDrop} accept="image/*" />
    </>
  );
}
