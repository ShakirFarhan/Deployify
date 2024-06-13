import styles from './PageLoader.module.css';
import rocketAnimation from '../../assets/rocket.json';
// import Lottie from 'react-lottie';
export const PageLoader = () => {
  const defaultOptions = {
    loop: true,

    autoplay: true,
    animationData: rocketAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className={styles.loading__container}>
      <div className={styles.loading__animation}>
        {/* <Lottie options={defaultOptions} height={150} width={150} /> */}
        Loading
      </div>
    </div>
  );
};
