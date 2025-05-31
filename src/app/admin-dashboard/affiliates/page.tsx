'use client';
import React, { useState } from 'react';
import styles from '../Dashboard.module.css';

const dummyUsers = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com', clicks: '20', referrals: '10', status:'Active', earnings:'20000' },
  { id: 2, name: 'John Smith', email: 'john@example.com', clicks: '25', referrals: '11', status:'Active', earnings:'25,500' },
  { id: 3, name: 'Alice Brown', email: 'alice@example.com', clicks: '15', referrals: '9',status:'Inactive', earnings:'13000' },
];

const AffiliatesManagement = () => {
  const [search, setSearch] = useState('');

  const filteredUsers = dummyUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Affiliate Management</h1>

      <input
        type="text"
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchBar}
      />

      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>No of Clicks</th>
              <th>Referrals</th>
              <th>Earning</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.clicks}</td>
                <td>{user.referrals}</td>
                <td>₦{user.earnings}</td>
                <td>
                  <span
                    className={`${styles.status} ${user.status === 'Active' ? styles.active : styles.inactive}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <button className={styles.deactivateBtn}>
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AffiliatesManagement;
