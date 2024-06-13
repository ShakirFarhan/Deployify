import styles from './index.module.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
const Welcome = ({ show }: { show?: boolean }) => {
  return (
    <div className={styles.container}>
      <div className={styles.logo__container}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.welcome__section}>
        <h2>Welcome to BOOSTMYDEV</h2>
        <p>Let's start your Journey!</p>
      </div>
      {show && (
        <div className={styles.signin__section}>
          <p>Already have an Account?</p>
          <a href="/login">Sign in</a>
        </div>
      )}
    </div>
  );
};

export default Welcome;
