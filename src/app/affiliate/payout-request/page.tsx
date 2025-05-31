"use client"

import React, { useState } from 'react';
import styles from '../Dashboard.module.css';

const PayoutRequest = () => {
  const [form, setForm] = useState({
    amount: '',
    method: 'bank',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payout Request Submitted:', form);
    alert('Payout request submitted!');
    setForm({ amount: '', method: 'bank', notes: '' });
  };

  const payoutSummary = {
    totalEarnings: 2000,
    withdrawn: 1000,
    available: 1000,
  };

  return (
    <div className={styles.pContainer}>
      <h1 className={styles.title}>Payout Request</h1>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Total Earnings</span>
          <strong>${payoutSummary.totalEarnings}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Total Withdrawn</span>
          <strong>${payoutSummary.withdrawn}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Available Balance</span>
          <strong>${payoutSummary.available}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Amount to Withdraw
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            min="1"
            max={payoutSummary.available}
          />
        </label>

        <label>
          Payout Method
          <select name="method" value={form.method} onChange={handleChange}>
            <option value="bank">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="crypto">Crypto</option>
          </select>
        </label>

        <label>
          Notes (optional)
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any additional info"
          />
        </label>

        <button type="submit" className={styles.submitBtn}>
          Submit Payout Request
        </button>
      </form>
    </div>
  );
};

export default PayoutRequest;
