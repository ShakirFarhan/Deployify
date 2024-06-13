import styles from './index.module.css';
import mailIllustration from '../../../../assets/email.svg';
import check from '../../../../assets/check.svg';
import { useLocation, useNavigate } from 'react-router-dom';
const Verification = () => {
  const { pathname } = useLocation();
  console.log(pathname);
  const navigate = useNavigate();
  if (pathname === '/register/verified') {
    return (
      <>
        <div className={styles.verification__container}>
          <img src={check} alt="Success" />
          <p>
            Success! Verification complete you may now proceed to your
            dashboard.
          </p>
          <button onClick={() => navigate('/')}>Continue to Dashboard</button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={styles.verification__container}>
          <img src={mailIllustration} alt="Email Illustration" />
          <p>
            Almost there! We sent a verification link to your email. Please
            click the link to complete this registration process
          </p>
        </div>
      </>
    );
  }
};

export default Verification;
