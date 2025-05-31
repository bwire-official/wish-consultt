"use client";

import React, { useState } from 'react';
import { HiDotsVertical } from "react-icons/hi";

import styles from '../Dashboard.module.css';

interface Segment {
  title: string;
  video: string;
  pdf: string;
}

interface Course {
  title: string;
  category: string;
  description: string;
  segments: Segment[];
}

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      title: 'First Aid Essentials',
      category: 'Health & Safety',
      description: 'Learn basic life-saving procedures.',
      segments: [
        { title: 'Scene Safety', video: 'scene-safety.mp4', pdf: 'scene-safety.pdf' },
        { title: 'CPR Basics', video: 'cpr-basics.mp4', pdf: 'cpr-guide.pdf' }
      ]
    }
  ]);

  const [newCourse, setNewCourse] = useState({
    title: '',
    category: '',
    description: ''
  });

  const [segments, setSegments] = useState<Segment[]>([
    { title: '', video: '', pdf: '' }
  ]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleSegmentChange = (index: number, field: keyof Segment, value: string) => {
    const updated = [...segments];
    updated[index][field] = value;
    setSegments(updated);
  };

  const addSegment = () => {
    setSegments([...segments, { title: '', video: '', pdf: '' }]);
  };

  const handleUpload = () => {
    if (!newCourse.title || !newCourse.category || !newCourse.description) return;
    const course: Course = {
      title: newCourse.title,
      category: newCourse.category,
      description: newCourse.description,
      segments
    };
    setCourses([course, ...courses]);
    setNewCourse({ title: '', category: '', description: '' });
    setSegments([{ title: '', video: '', pdf: '' }]);
  };

  return (
    
    <div className={styles.dashboardContainer}>
      <h1 className={styles.header}>Course Management</h1>

      <div className={styles.courseForm}>
        <h2>Upload New Course</h2>
        <input
          type="text"
          placeholder="Course Title"
          name="title"
          value={newCourse.title}
          onChange={handleCourseChange}
        />
        <input
          type="text"
          placeholder="Category"
          name="category"
          value={newCourse.category}
          onChange={handleCourseChange}
        />
        <textarea
          placeholder="Description"
          name="description"
          value={newCourse.description}
          onChange={handleCourseChange}
        />

        <div className={styles.segmentsSection}>
          <h3>Segments</h3>
          {segments.map((segment, index) => (
            <div className={styles.segment} key={index}>
              <input
                type="text"
                placeholder="Segment Title"
                value={segment.title}
                onChange={(e) => handleSegmentChange(index, 'title', e.target.value)}
              />
              <input
                type="text"
                placeholder="Video URL (Cloudinary)"
                value={segment.video}
                onChange={(e) => handleSegmentChange(index, 'video', e.target.value)}
              />
              <input
                type="text"
                placeholder="PDF URL"
                value={segment.pdf}
                onChange={(e) => handleSegmentChange(index, 'pdf', e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="both-btns">
            <button className={styles.uploadBtn} onClick={handleUpload}>Upload Course</button>

            <button className={styles.addSegmentBtn} onClick={addSegment}>Add Segment</button>
        </div>
        
      </div>

      <div className={styles.courseList}>
        <h2>Uploaded Courses</h2>
        {courses.map((course, index) => (
          <div className={styles.courseCard} key={index}>
            <div className={styles.courseCardC}>
                <div className={styles.courseCategory}>
                    <span>{course.category}</span>
                    <HiDotsVertical className={styles.cicon}/>

                </div>
                
                <h3>{course.title}</h3>
                
                <p>{course.description}</p>
                <ul>
                    {course.segments.map((segment, idx) => (
                        <li key={idx}>
                        {segment.title} — <a href={segment.video} target="_blank">Video</a> | <a href={segment.pdf} target="_blank">PDF</a>
                        </li>
                    ))}
                </ul>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
