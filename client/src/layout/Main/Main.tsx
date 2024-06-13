import styles from './Main.module.css';

// React Router Dom
import { Outlet } from 'react-router-dom';

// Components
import Sidebar from '../Sidebar/Sidebar';

const Main = () => {
  return (
    <main className={styles.app__main}>
      <Sidebar />
      <div className={styles.main__outlet}>
        <Outlet />
      </div>
    </main>
  );
};

export default Main;
