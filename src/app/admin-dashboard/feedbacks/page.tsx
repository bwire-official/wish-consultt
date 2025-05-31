'use client';

import React, { useState } from 'react';
import styles from '../Dashboard.module.css';

type FeedbackType = 'Bug report' | 'Testimonial' | 'Suggestion';

interface Feedback {
  segment: string;
  feedback: string;
  type: FeedbackType;
  response: string;
}

const initialFeedbacks: Feedback[] = [
  {
    segment: 'Intro to HTML',
    feedback: 'Great start, but audio was low.',
    type: 'Bug report',
    response: '',
  },
  {
    segment: 'CSS Basics',
    feedback: 'This was super helpful!',
    type: 'Testimonial',
    response: '',
  },
  {
    segment: 'JavaScript 101',
    feedback: 'Can you add more examples?',
    type: 'Suggestion',
    response: '',
  },
];

export default function FeedbackReview() {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);

  const updateFeedbackType = (index: number, newType: FeedbackType) => {
    const updated = [...feedbacks];
    updated[index].type = newType;
    setFeedbacks(updated);
  };

  const updateResponse = (index: number, response: string) => {
    const updated = [...feedbacks];
    updated[index].response = response;
    setFeedbacks(updated);
  };

  const sendResponse = (index: number) => {
    const responseText = feedbacks[index].response;
    if (!responseText.trim()) return alert('Response cannot be empty');
    alert(`Response sent for segment "${feedbacks[index].segment}":\n${responseText}`);
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.dashboardContainer}>
        <h1 className={styles.header}>Feedback Review</h1>

        <div className={styles.courseList}>
          <h2>All Submitted Feedback</h2>

          {feedbacks.map((fb, index) => (
            <div key={index} className={styles.courseCard}>
              <div className={styles.courseCardTop}>
                <h3>Segment: {fb.segment}</h3>
                <div>
                  <label htmlFor={`type-${index}`}>Tag as:</label>
                  <select
                    id={`type-${index}`}
                    value={fb.type}
                    onChange={(e) => updateFeedbackType(index, e.target.value as FeedbackType)}
                    className={styles.feedbackTypeSelect}
                  >
                    <option value="Bug report">Bug report</option>
                    <option value="Testimonial">Testimonial</option>
                    <option value="Suggestion">Suggestion</option>
                  </select>
                </div>
              </div>
              <p>{fb.feedback}</p>

              

              <div className={styles.feedbackResponseGroup}>
                <textarea
                  className={styles.segmentInput}
                  placeholder="Write a response..."
                  rows={3}
                  value={fb.response}
                  onChange={(e) => updateResponse(index, e.target.value)}
                />
                <button onClick={() => sendResponse(index)}>Send Response</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
