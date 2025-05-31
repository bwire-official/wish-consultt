"use client"

import { useEffect, useState } from 'react';
import styles from '../Dashboard.module.css';


type Course = {
  id: string;
  title: string;
  claudeEnabled: boolean;
};

// Dummy course list
const dummyCourses: Course[] = [
  { id: 'course1', title: 'Claude AI Basics', claudeEnabled: true },
  { id: 'course2', title: 'Advanced Prompting', claudeEnabled: false },
  { id: 'course3', title: 'AI Ethics', claudeEnabled: true },
];

const ClaudeSettings = () => {
  const [courses, setCourses] = useState<Course[]>(dummyCourses);

  const toggleClaude = (id: string) => {
    const updated = courses.map((course) =>
      course.id === id ? { ...course, claudeEnabled: !course.claudeEnabled } : course
    );
    setCourses(updated);
  };

  return (
    <div className={styles.claudeContainer}>
      <h1 className={styles.title}>Claude AI Settings</h1>
      <p className={styles.description}>
        Configure Claude AI availability per course.
      </p>

      <div className={styles.courseList}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseItem}>
            <span className={styles.courseTitle}>{course.title}</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={course.claudeEnabled}
                onChange={() => toggleClaude(course.id)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaudeSettings;
