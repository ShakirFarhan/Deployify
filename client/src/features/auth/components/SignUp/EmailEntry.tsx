import styles from './index.module.css';
import { SignUpComponentsProps } from '../../types/index';
import GoogleLogin from '../SocialAuth/GoogleAuth';
import GithubLogin from '../SocialAuth/GithubAuth';
import { useUserByEmailQuery } from '../../hooks';
import { FormEvent, useEffect, useState } from 'react';

const EmailEntry = ({
  onNext,
  onChange,
  userDetails,
}: SignUpComponentsProps) => {
  // Inefficient, too much of get request made whenever the user starts typing email
  const { data, isSuccess, isLoading } = useUserByEmailQuery(userDetails.email);

  const [emailValid, setEmailValid] = useState(true);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoading && emailValid) {
      setTimeout(() => {
        onNext();
      }, 500);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        if (data.message) {
          setEmailValid(false);
        } else {
          setEmailValid(true);
        }
      }
    }
  }, [data, isLoading, isSuccess]);
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.form__row1}>
        <input
          onChange={onChange}
          type="text"
          placeholder="First Name"
          name="firstName"
          title="Provide First Name"
          aria-label="First Name"
          value={userDetails.firstName}
          required
        />
        <input
          onChange={onChange}
          type="text"
          placeholder="Last Name"
          name="lastName"
          title="Provide Last Name"
          aria-label="Last Name"
          value={userDetails.lastName}
          required
        />
      </div>
      <div className={styles.form__row2}>
        <input
          onChange={onChange}
          type="email"
          placeholder="Email"
          name="email"
          title="Provide Email Address"
          aria-label="Email Address"
          required
          value={userDetails.email}
        />
        {!emailValid && (
          <span className={styles.warning}>Email already exists</span>
        )}
      </div>
      <button
        type="submit"
        className={styles.continue__button}
        // disabled={(!usernameValid && !emailValid) || isLoading}
      >
        {isLoading ? 'Verifying...' : 'Continue'}
      </button>
      <div className={styles.separator}>
        <div></div>
        <p>Or</p>
        <div></div>
      </div>
      <GoogleLogin />
      <GithubLogin />
    </form>
  );
};

export default EmailEntry;
