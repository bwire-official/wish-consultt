"use client";
import React from "react";
import "./StudentDashboard.css";
import dp from '../Assets/dp.webp'
import Image from "next/image";
import scholar from '../Assets/scholar1-removebg-preview.png'

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
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

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Courses Enrolled</h3>
          <p>1 Active Courses</p>
        </div>
        <div className="dashboard-card">
          <h3>Progress</h3>
          <p>75% Completed</p>
        </div>
        <div className="dashboard-card">
          <h3>Reviews</h3>
          <p>12</p>
        </div>
        <div className="dashboard-card">
          <h3>Next Lesson</h3>
          <p>AI Basics - Module 3</p>
        </div>
      </section>

      <section className="announcements">
        <h2>Course</h2>
        <ul>
          <li>🆕 New course on Prompt Engineering added!</li>
          {/* <li>📅 Webinar on "AI in Education" this Friday.</li> */}
          {/* <li>🎉 You've earned a certificate! View it on your profile.</li> */}
        </ul>
      </section>
    </div>
  );
};

export default StudentDashboard;
