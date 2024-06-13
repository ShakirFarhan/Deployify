import { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { StepperProps } from '../../utils/types/ui/components.types';
import { stepsConfig } from '../../utils/constants/auth';
const Stepper = ({ completed, currentStage }: StepperProps) => {
  const [isComplete] = useState(completed);
  const [margins, setMargins] = useState({
    marginLeft: 0,
    marginRight: 0,
  });
  const stepRef: any = useRef([]);

  useEffect(() => {
    setMargins({
      marginLeft: stepRef.current[0].offsetWidth / 2,
      marginRight: stepRef.current[stepsConfig.length - 1].offsetWidth / 2,
    });
  }, [stepRef]);
  const calculateProgressBarWidth = () => {
    const val = ((currentStage - 1) / (stepsConfig.length - 1)) * 100;
    return val;
  };
  return (
    <div className={styles.stepper}>
      {stepsConfig.map((step, index) => {
        return (
          <div
            ref={(el) => (stepRef.current[index] = el)}
            className={`${styles.step} ${
              currentStage > index + 1 || isComplete ? styles.complete : ''
            } ${index + 1 === currentStage ? styles.active : ''}`}
            key={step.name}
          >
            <div className={`${styles.step__icon} `}>
              {currentStage > index + 1 || isComplete ? (
                <span>&#10003;</span>
              ) : (
                <div></div>
              )}
            </div>
            <p>{step.name}</p>
          </div>
        );
      })}

      <div
        className={styles.progress__bar}
        style={{
          width: `calc(100%-${margins.marginLeft + margins.marginRight}px)`,
          marginLeft: margins.marginLeft,
          marginRight: margins.marginRight,
        }}
      >
        <div
          className={styles.progress}
          style={{ width: `${calculateProgressBarWidth()}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Stepper;
