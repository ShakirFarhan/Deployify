import { FormEvent, useEffect, useState } from 'react';
import styles from './index.module.css';
import { SignUpComponentsProps } from '../../types/index';
import PasswordEntry from '../Login/PasswordEntry/PasswordEntry';
import { useRegisterMutation } from '../../hooks';
const PasswordCreation = ({
  onNext,
  onChange,
  userDetails,
}: SignUpComponentsProps) => {
  const [passwordValid, setPasswordValid] = useState(false);
  const [RegisterUser, { isSuccess, data, isLoading }] = useRegisterMutation();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    RegisterUser({
      email: userDetails.email,
      fullName: userDetails.firstName + ' ' + userDetails.lastName,
      password: userDetails.password,
    });
  };
  useEffect(() => {
    if (isSuccess) {
      if (data) {
        if (data.message) {
          onNext();
        }
      }
    }
  }, [isSuccess, data, onNext]);
  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <PasswordEntry
          handleFormInputs={onChange}
          password={userDetails.password}
          setPasswordValid={setPasswordValid}
        />
        <button
          disabled={!passwordValid || isLoading}
          type="submit"
          style={{
            cursor: !passwordValid || isLoading ? 'not-allowed' : 'pointer',
          }}
          tabIndex={!passwordValid || isLoading ? -1 : 0}
          className={styles.continue__button}
        >
          {isLoading ? 'Submitting...' : 'Continue'}
        </button>
      </form>
    </>
  );
};

export default PasswordCreation;
