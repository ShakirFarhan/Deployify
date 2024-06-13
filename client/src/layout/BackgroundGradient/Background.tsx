import { memo } from 'react';
import type { FC } from 'react';

// import resets from '../_resets.module.css';
import { Ellipse1Icon } from './EllipseIcon1';
import { Ellipse2Icon } from './EllipseIcon2';
import styles from './index.module.css';

const Background: FC<{
  className?: string;
  children: any;
}> = memo(function SignUp({ children, className }) {
  return (
    <div className={styles.main__container}>
      <div className={`${styles.root}`}>
        <div className={styles.rectangle}></div>
        <div className={styles.rectangle1}></div>

        <div className={styles.ellipse1}>
          <Ellipse1Icon className={styles.icon} />
        </div>
        <div className={styles.ellipse2}>
          <Ellipse2Icon className={styles.icon2} />
        </div>
      </div>
      <div className={styles.children__container}>{children}</div>
    </div>
  );
});

export default Background;
