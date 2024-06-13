import { BsGithub } from 'react-icons/bs';
import styles from './SocialAuth.module.css';

const GithubAuth = () => {
  function handleGithubAuth() {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`
    );
  }
  return (
    <button onClick={handleGithubAuth} className={styles.social__button}>
      <BsGithub className={styles.social__icon} />
      <p>Continue with Github</p>
    </button>
  );
};

export default GithubAuth;
