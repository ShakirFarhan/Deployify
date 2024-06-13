import { useLocation } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import { RegistrationCredentials } from '../../../utils/types/ui/pages.types';
import {
  EmailEntry,
  PasswordCreation,
  Verification,
} from '../../../features/auth/components/SignUp';
import Background from '../../../layout/BackgroundGradient/Background';
import styles from './Signup.module.css';
import Welcome from '../../../components/Welcome/Welcome';
import Stepper from '../../../components/Stepper/Stepper';

function Signup() {
  const { pathname } = useLocation();

  const [currentStage, setCurrentStage] = useState(0);
  const [signupComplete, setSignupComplete] = useState(false);
  const [userDetails, setUserDetails] = useState<RegistrationCredentials>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    username: '',
  });
  const handleFormInputs = (e: ChangeEvent<HTMLInputElement>) => {
    setUserDetails((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleContinue = () => {
    if (currentStage < 3) {
      setCurrentStage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (pathname === '/register/verified') {
      setCurrentStage(2);
      setSignupComplete(true);
    }
  }, [pathname]);
  const renderStageComponent = () => {
    switch (currentStage) {
      case 0:
        return (
          <EmailEntry
            userDetails={userDetails}
            onChange={handleFormInputs}
            onNext={handleContinue}
          />
        );

      case 1:
        return (
          <PasswordCreation
            userDetails={userDetails}
            onChange={handleFormInputs}
            onNext={handleContinue}
          />
        );

      case 2:
        return <Verification />;

      default:
        return <p></p>;
    }
  };

  return (
    <Background>
      <div className={styles.container}>
        <div className={styles.form__container}>
          <Welcome show={currentStage < 1} />
          {renderStageComponent()}
        </div>
      </div>
      {currentStage > 0 && (
        <div className={styles.stepper__container}>
          <Stepper completed={signupComplete} currentStage={currentStage + 1} />
        </div>
      )}
    </Background>
  );
}

export default Signup;
