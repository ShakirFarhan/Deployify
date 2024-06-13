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
                location.pathname === '/dashboard' ? styles.active__link : ''
              } `}
              to={'/dashboard'}
              title="Dashboard"
            >
              <MdOutlineDashboard fontSize={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === '/spark-pool' ? styles.active__link : ''
              } `}
              to={'/spark-pool'}
              title="Spark Pool"
            >
              <MdOutlineSwipeRight fontSize={20} />
              <span>Spark Pool</span>
            </Link>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === '/explore' ? styles.active__link : ''
              } `}
              to={'/explore'}
              title="Explore"
            >
              <FaRegCompass fontSize={20} />
              <span>Explore</span>
            </Link>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === '/me/boostlist' ? styles.active__link : ''
              } `}
              to={'/me/boostlist'}
              title="Boost List"
            >
              <MdOutlineRocketLaunch fontSize={20} />
              <span>Boost List</span>
            </Link>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === '/buy' ? styles.active__link : ''
              } `}
              to={'/buy'}
              title="Buy"
            >
              <BiPurchaseTag fontSize={20} />
              <span>buy</span>
            </Link>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === '/messages' ? styles.active__link : ''
              } `}
              to={'/messages'}
              title="Messages"
            >
              <AiOutlineMessage fontSize={20} />
              <span>Messages</span>

              <div className={styles.badge}>2</div>
            </Link>

            <Link
              className={`${styles.menu__item} ${styles.item__bottom} ${
                location.pathname === '/notifications'
                  ? styles.active__link
                  : ''
              } `}
              to={'/notifications'}
              title="Notifications"
            >
              <RiNotification4Line fontSize={20} />
              <span>Notifications</span>
              <div className={styles.badge}>2</div>
            </Link>
            <Link
              className={`${styles.menu__item} ${styles.item__bottom} ${
                location.pathname === '/settings' ? styles.active__link : ''
              } `}
              to={'/settings'}
              title="Settings"
            >
              <MdOutlineSettings fontSize={20} />
              <span>Settings</span>
            </Link>

            {userInfo && (
              <Link
                className={`${styles.item__userprofile} ${
                  location.pathname === '/profile' ? styles.active__link : ''
                }`}
                style={{ width: '100%' }}
                to="/profile"
              >
                <img
                  src={
                    userInfo.profilePhoto ? userInfo.profilePhoto : dummyUser
                  }
                  alt="Profile"
                />
              </Link>
            )}
          </div>

          <div className={styles.menu__items__bottom}>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === ''
                  ? styles.active__link
                  : '/notifications'
              } `}
              to={'/notifications'}
              title="Notifications"
            >
              <RiNotification4Line fontSize={20} />
              <span>Notifications</span>
              <div className={styles.badge}>2</div>
            </Link>
            <Link
              className={`${styles.menu__item} ${
                location.pathname === '' ? styles.active__link : '/settings'
              } `}
              to={'/settings'}
              title="Settings"
            >
              <MdOutlineSettings fontSize={20} />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        <div className={styles.separator}></div>

        {userInfo && (
          <div className={styles.user__profile}>
            <Link
              className={`${
                location.pathname === '/profile' ? styles.active__link : ''
              }`}
              style={{ width: '100%' }}
              to="/profile"
            >
              <img
                src={userInfo.profilePhoto ? userInfo.profilePhoto : dummyUser}
                alt="Profile"
              />
              <span>Profile</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
