import { useState } from 'react';
import styles from './PasswordEntry.module.css';
import { PasswordEntryProps } from '../../../types';
import PasswordChecklist from 'react-password-checklist';

const PasswordEntry = ({
  handleFormInputs,
  password,
  setPasswordValid,
}: PasswordEntryProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className={styles.password__entry}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          name="password"
          title="Password"
          aria-label="Password"
          onChange={handleFormInputs}
          value={password}
        />
        <button onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {password.length > 0 && (
        <PasswordChecklist
          rules={['minLength', 'specialChar', 'number', 'capital']}
          minLength={8}
          iconSize={15}
          style={{ fontSize: '13.5px', width: '100%' }}
          className={styles.password__checklist}
          value={password}
          valueAgain={password}
          onChange={(isValid) => {
            setPasswordValid(isValid);
          }}
        />
      )}
    </>
  );
};

export default PasswordEntry;
