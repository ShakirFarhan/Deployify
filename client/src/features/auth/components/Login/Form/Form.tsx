import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import styles from './Form.module.css';
import logo from '../../../../../assets/logo.png';
// import { LoginCredentials } from '';
import PasswordEntry from '../PasswordEntry/PasswordEntry';
import GoogleLogin from '../../SocialAuth/GoogleAuth';
import GithubLogin from '../../SocialAuth/GithubAuth';
import { LoginFormProps } from '../../../types';
import Background from '../../../../../layout/BackgroundGradient/Background';
// import { Link } from 'react-router-dom';
import { LoginCredentials } from '../../../../../utils/types/ui/pages.types';

let defaultData = {
  email: '',
  password: '',
};
const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [loginDetails, setLoginDetails] =
    useState<LoginCredentials>(defaultData);
  console.log(loginDetails);
  const [passwordValid, setPasswordValid] = useState(false);
  const handleFormInputs = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginDetails((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleonSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(loginDetails);
      if (!loginDetails.email || loginDetails.password.length < 8) return;

      onSubmit(loginDetails);
    },
    [loginDetails]
  );

  return (
    <Background>
      <div className={styles.container}>
        <div className={styles.logo__container}>
          <img src={logo} alt="Logo" />
        </div>
        <div className={styles.welcome}>
          <h2>Welcome Back</h2>
          <p>
            Don’t Have An Account?{' '}
            <span>
              <a href="/register"> Sign up</a>
            </span>
          </p>
        </div>
        <form onSubmit={handleonSubmit} className={styles.form}>
          <input
            onChange={handleFormInputs}
            type="email"
            placeholder="Email"
            title="Provide Email Address"
            aria-label="Email Address"
            name="email"
            value={loginDetails.email}
          />
          <PasswordEntry
            password={loginDetails.password}
            setPasswordValid={setPasswordValid}
            handleFormInputs={handleFormInputs}
          />
          <button
            // disabled={!passwordValid || isLoading}
            type="submit"
            style={{
              cursor: !passwordValid || isLoading ? 'not-allowed' : 'pointer',
            }}
            tabIndex={!passwordValid || isLoading ? -1 : 0}
            className={styles.continue__button}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>
          <div className={styles.separator}>
            <div></div>
            <p>Or</p>
            <div></div>
          </div>
          <div className={styles.socials}>
            <GoogleLogin />
            <GithubLogin />
          </div>
        </form>
      </div>
    </Background>
  );
};

export default LoginForm;
