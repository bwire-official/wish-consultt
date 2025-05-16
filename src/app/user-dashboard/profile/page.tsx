import React from 'react';
import styles from '../Dashboard.module.css';
import Image from 'next/image';
import dp from '../../Assets/dp.jpeg'

const ProfileScreen = () => {
  return (
    <div className={styles.pcontainer}>
      <h1 className={styles.title}>My Profile</h1>

      <div className={styles.profilePictureSection}>
        <Image
          src={dp}
          alt="Profile"
          className={styles.profileImage}
        />
      </div>

      <div className={styles.profileInfo}>
        <div className={styles.infoGroup}>
          <strong>Full Name:</strong>
          <p>Jane Doe</p>
        </div>

        <div className={styles.infoGroup}>
          <strong>Username:</strong>
          <p>janedoe123</p>
        </div>

        <div className={styles.infoGroup}>
          <strong>Email:</strong>
          <p>jane.doe@example.com</p>
        </div>

        <div className={styles.infoGroup}>
          <strong>Bio:</strong>
          <p>Healthcare enthusiast passionate about infection control and patient safety.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
