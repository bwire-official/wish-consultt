"use client"

import React from 'react';
import styles from '../Dashboard.module.css';

const AffiliatePerformance = () => {
  const stats = {
    clicks: 2480,
    conversionRate: 4.2,
    referrals: 104,
    earnings: 1250.75,
  };

  const exportReport = () => {
    const report = `
Affiliate Performance Report

Total Clicks: ${stats.clicks}
Conversion Rate: ${stats.conversionRate}%
Number of Referrals: ${stats.referrals}
Earnings to Date: $${stats.earnings.toFixed(2)}
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'performance-report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.affiliateContainer}>
      <h1 className={styles.title}>Affiliate Performance</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <p className={styles.label}>Total Clicks</p>
          <p className={styles.value}>{stats.clicks}</p>
        </div>

        <div className={styles.card}>
          <p className={styles.label}>Conversion Rate</p>
          <p className={styles.value}>{stats.conversionRate}%</p>
        </div>

        <div className={styles.card}>
          <p className={styles.label}>Referrals</p>
          <p className={styles.value}>{stats.referrals}</p>
        </div>

        <div className={styles.card}>
          <p className={styles.label}>Earnings to Date</p>
          <p className={styles.value}>${stats.earnings.toFixed(2)}</p>
        </div>
      </div>

      <button onClick={exportReport} className={styles.exportButton}>
        Export Report
      </button>
    </div>
  );
};

export default AffiliatePerformance;
