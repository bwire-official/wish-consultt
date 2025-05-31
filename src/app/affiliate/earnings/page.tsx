"use client"

import React from 'react';
import styles from '../Dashboard.module.css';

const Earnings = () => {
  const data = {
    currentEarnings: 1850.75,
    monthlyBreakdown: [
      { month: 'May 2025', amount: 520.5 },
      { month: 'April 2025', amount: 680.25 },
      { month: 'March 2025', amount: 650.0 },
    ],
    totalWithdrawn: 900,
  };

  const balanceRemaining = data.currentEarnings - data.totalWithdrawn;

  const exportEarnings = () => {
    const report = `
Earnings Report

Total Earnings: $${data.currentEarnings.toFixed(2)}
Total Withdrawn: $${data.totalWithdrawn.toFixed(2)}
Balance Remaining: $${balanceRemaining.toFixed(2)}

Monthly Breakdown:
${data.monthlyBreakdown.map((item) => `${item.month}: $${item.amount}`).join('\n')}
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'earnings-report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.eContainer}>
      <h1 className={styles.title}>Earnings Overview</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <p className={styles.label}>Current Earnings</p>
          <p className={styles.value}>${data.currentEarnings.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.label}>Total Withdrawn</p>
          <p className={styles.value}>${data.totalWithdrawn.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.label}>Balance Remaining</p>
          <p className={styles.value}>${balanceRemaining.toFixed(2)}</p>
        </div>
      </div>

      <h2 className={styles.subheading}>Monthly Breakdown</h2>
      <ul className={styles.breakdownList}>
        {data.monthlyBreakdown.map((item) => (
          <li key={item.month} className={styles.breakdownItem}>
            <span>{item.month}</span>
            <p>${item.amount}</p>
          </li>
        ))}
      </ul>

      <button onClick={exportEarnings} className={styles.exportButton}>
        Export Earnings Report
      </button>
    </div>
  );
};

export default Earnings;
