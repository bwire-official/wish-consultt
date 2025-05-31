"use client"

import React, { useState } from 'react';
import styles from '../Dashboard.module.css';

const Referral = () => {
  const referralLink = 'https://smartlearn.ai/register?ref=sharon123';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    referrals: 58,
    conversions: 31,
    earnings: 620,
  };

  return (
    <div className={styles.rContainer}>
      <h1 className={styles.title}>Your Referral Link</h1>

      <div className={styles.linkBox}>
        <input type="text" value={referralLink} readOnly className={styles.linkInput} />
        <button onClick={handleCopy} className={styles.copyBtn}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span>Total Referrals</span>
          <strong>{stats.referrals}</strong>
        </div>
        <div className={styles.statBox}>
          <span>Conversions</span>
          <strong>{stats.conversions}</strong>
        </div>
        <div className={styles.statBox}>
          <span>Earnings</span>
          <strong>${stats.earnings}</strong>
        </div>
      </div>
    </div>
  );
};

export default Referral;
