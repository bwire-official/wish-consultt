'use client';
import React, { useState } from 'react';
import styles from '../Dashboard.module.css';

const dummyUsers = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com', registered: '2025-05-01', status: 'Active' },
  { id: 2, name: 'John Smith', email: 'john@example.com', registered: '2025-04-27', status: 'Inactive' },
  { id: 3, name: 'Alice Brown', email: 'alice@example.com', registered: '2025-03-15', status: 'Active' },
];

const UserManagement = () => {
  const [search, setSearch] = useState('');

  const filteredUsers = dummyUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Management</h1>

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
              <th>Registered</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.registered}</td>
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

export default UserManagement;
