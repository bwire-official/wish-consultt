"use client"

import React, { useState } from 'react';
import styles from '../Dashboard.module.css';

const Settings = () => {
  const [form, setForm] = useState({
    name: 'Sharon Akintayo',
    email: 'sharon@example.com',
    notifications: true,
    darkMode: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings updated!');
    console.log(form);
  };

  return (
    <div className={styles.sContainer}>
      <h1 className={styles.title}>Account Settings</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <div className={styles.toggleGroup}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
            />
            Enable Notifications
          </label>

          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              name="darkMode"
              checked={form.darkMode}
              onChange={handleChange}
            />
            Enable Dark Mode
          </label>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
