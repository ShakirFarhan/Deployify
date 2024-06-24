import styles from './Sidebar.module.css';
import { Link, useLocation } from 'react-router-dom';

// Assets
import boostmydev from '../../assets/logo.png';
import dummyUser from '../../assets/User.jpg';

// Store Redux

// React Icons
import { FaRegCompass } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';
import { RiNotification4Line } from 'react-icons/ri';
import { TfiWorld } from 'react-icons/tfi';
import { FaHome } from 'react-icons/fa';
import { GoProject } from 'react-icons/go';
import { RxRocket } from 'react-icons/rx';
import {
  MdOutlineDashboard,
  MdOutlineRocketLaunch,
  MdOutlineSettings,
  MdOutlineSwipeRight,
} from 'react-icons/md';
import { useCallback, useEffect, useState } from 'react';
import { BiPurchaseTag } from 'react-icons/bi';
import { useAppSelector } from '../../store';
const Sidebar = () => {
  const location = useLocation();
  const [dirty] = useState(false);

  const { userInfo } = useAppSelector((store) => store.auth);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__div}>
        <div className={styles.logo}>
          <img src={boostmydev} alt="BoostMyDev" />
        </div>

        <div className={styles.menu__items}>
          <div className={styles.menu__items__top}>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === '/overview' ? styles.active__link : ''
              } `}
              to={'/overview'}
              title="Overview"
            >
              <FaHome fontSize={20} />
              <span>Overview</span>
            </Link>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === '/projects' ? styles.active__link : ''
              } `}
              to={'/projects'}
              title="Projects"
            >
              <GoProject fontSize={20} />
              <span>Projects</span>
            </Link>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === '/deployments' ? styles.active__link : ''
              } `}
              to={'/deployments'}
              title="Deployments"
            >
              <RxRocket fontSize={20} />
              <span>Deployments</span>
            </Link>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === '/me/boostlist' ? styles.active__link : ''
              } `}
              to={'/domains'}
              title="Domains"
            >
              <TfiWorld fontSize={20} />
              <span>Domains</span>
            </Link>

            <Link
              className={`${styles.menu__item} ${
                location.pathname === '/settings' ? styles.active__link : ''
              } `}
              to={'/settings'}
              title="Settings"
            >
              <MdOutlineSettings fontSize={23} />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        <div className={styles.separator}></div>

        {/* {userInfo && ( */}
        <div className={styles.user__profile}>
          <Link
            className={`${
              location.pathname === '/profile' ? styles.active__link : ''
            }`}
            style={{ width: '100%' }}
            to="/profile"
          >
            <img src={dummyUser} alt="Profile" />
            <span>Profile</span>
          </Link>
        </div>
        {/* )} */}
      </div>
    </aside>
  );
};

export default Sidebar;
