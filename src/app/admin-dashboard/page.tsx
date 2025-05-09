"use client";
import React from "react";
import "./AdminDashboard.css";
import Image from "next/image";
import scholar from '../Assets/scholar1-removebg-preview.png'


const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="s-div">
          <h1>Admin</h1>
        </div>
        
      </header>

      <div className="welcome-card">
        <div className="wc">
          <div>
            <p>April 4th, 2025</p>
            <h4>Welcome back, Admin!</h4>
            <p>Always stay updated in your dashboard</p>
          </div>

          <Image src={scholar} alt=""/>
        </div>
      </div>

      <section className="admin-grid">
        <div className="admin-card">
          <h3>Registered Users</h3>
          <p>1,245</p>
        </div>
        <div className="admin-card">
          <h3>Published Courses</h3>
          <p>35</p>
        </div>
        <div className="admin-card">
          <h3>Total Earnings</h3>
          <p>$12,580</p>
        </div>
        <div className="admin-card">
          <h3>Reviews</h3>
          <p>15</p>
        </div>
      </section>

      <section className="admin-announcements">
        <h2>Platform Activity</h2>
        <ul>
          <li>📈 Course enrollments increased by 12% this week.</li>
          <li>🛠 Maintenance scheduled for Saturday 10PM - 12AM.</li>
          <li>✅ New affiliate applications pending review.</li>
        </ul>
      </section>

      <section className="admin-users">
  <h2>Recent Users</h2>
  <div className="user-table-wrapper">
    <table className="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Date Joined</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Jane Doe</td>
          <td>jane@example.com</td>
          <td>Student</td>
          <td className="status active">Active</td>
          <td>2025-04-10</td>
        </tr>
        <tr>
          <td>Michael Smith</td>
          <td>michael@example.com</td>
          <td>Affiliate</td>
          <td className="status pending">Pending</td>
          <td>2025-04-12</td>
        </tr>
        <tr>
          <td>Emily Green</td>
          <td>emily@example.com</td>
          <td>Student</td>
          <td className="status suspended">Suspended</td>
          <td>2025-03-22</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

    </div>
  );
};

export default AdminDashboard;
