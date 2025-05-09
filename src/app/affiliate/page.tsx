"use client";
import React from "react";
import "./AffiliateDashboard.css";
import Image from "next/image";
import scholar from '../Assets/scholar1-removebg-preview.png'
import dp from '../Assets/dp.webp'

const AffiliateDashboard = () => {
  return (

    <section className="affiliate-dashboard">
      <header className="student-header">
        <div className="s-div">
          {/* <h1>Welcome Back, Student</h1>
          <p>Your personalized SmartLearn AI dashboard</p> */}
          <div className="prof">
            <Image src={dp} alt="" />
            <div>
              <h6>Sam O</h6>
              <p>sam@gmail.com</p>
            </div>
          </div>

        </div>
      </header>

      <div className="welcome-card">
        <div className="wc">
          <div>
            <p>April 4th, 2025</p>
            <h4>Welcome back, Sam!</h4>
            <p>Always stay updated in your dashboard</p>
          </div>

          <Image src={scholar} alt=""/>
        </div>
      </div>

      <div className="affiliate-cards">
        <div className="card">
          <h4>Total Referrals</h4>
          <p>128</p>
        </div>
        <div className="card">
          <h4>Conversion Rate</h4>
          <p>12.5%</p>
        </div>
        <div className="card">
          <h4>Earned Commission</h4>
          <p>$1,340.00</p>
        </div>
        <div className="card">
          <h4>Pending Payout</h4>
          <p>$230.00</p>
        </div>
      </div>

      <section className="recent-referrals">
        <h2>Recent Referrals</h2>
        <div className="referral-table-wrapper">
          <table className="referral-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ada Uche</td>
                <td>ada@example.com</td>
                <td>2025-04-01</td>
                <td className="status converted">Converted</td>
                <td>$15</td>
              </tr>
              <tr>
                <td>John Okoro</td>
                <td>john@example.com</td>
                <td>2025-04-10</td>
                <td className="status pending">Pending</td>
                <td>$0</td>
              </tr>
              <tr>
                <td>Susan Eze</td>
                <td>susan@example.com</td>
                <td>2025-04-15</td>
                <td className="status converted">Converted</td>
                <td>$15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default AffiliateDashboard;
