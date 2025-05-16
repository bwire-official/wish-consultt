import React from 'react';
import styles from '../Dashboard.module.css';

const segments = [
  { title: 'Intro to Infection Control', completed: true },
  { title: 'PPE & Hygiene Protocols', completed: true },
  { title: 'Waste Disposal & Safety', completed: false },
  { title: 'Emergency Response', completed: false },
  { title: 'Final Assessment', completed: false },
];

const CourseScreen = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Course: Infection Control in Healthcare Facilities</h1>
        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: '40%' }}
            ></div>
          </div>
          <span className={styles.progressText}>40% Completed</span>
        </div>
      </header>

      <section className={styles.segmentList}>
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`${styles.segment} ${segment.completed ? styles.completed : styles.locked}`}
          >
            <h3>{segment.title}</h3>
            {segment.completed ? <span className={styles.status}>✓ Completed</span> : <span className={styles.status}>🔒 Locked</span>}
          </div>
        ))}
      </section>

      <section className={styles.videoSection}>
        <h2>Current Segment: PPE & Hygiene Protocols</h2>
        <video className={styles.video} controls>
          <source src="/videos/ppe-hygiene.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <a href="/pdfs/ppe-hygiene.pdf" className={styles.download} download>
          📄 Download PDF Notes
        </a>
      </section>

      <section className={styles.feedback}>
        <h3>Feedback</h3>
        <textarea placeholder="Write your feedback..." className={styles.textarea}></textarea>
        <button className={styles.submitBtn}>Submit & Unlock Next Segment</button>
      </section>

      <aside className={styles.aiAssistant}>
        <h4>Ask Claude AI</h4>
        <textarea placeholder="Ask a question..." className={styles.textarea}></textarea>
        <button className={styles.askBtn}>Ask</button>
      </aside>
    </div>
  );
};

export default CourseScreen;
