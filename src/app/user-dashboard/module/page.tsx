'use client'
import React, { useState } from 'react';
import styles from '../Dashboard.module.css';
import Image from 'next/image';
import img from '../../Assets/c-img.jpeg';
import Link from 'next/link';
import dp from '../../Assets/dp.webp';
import "../StudentDashboard.css";
import { FaBook } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { RiBookOpenLine } from "react-icons/ri";
import img1 from '../../Assets/padlock.avif'


const initialSegments = [
    { title: 'Intro to Infection Control', video: '/videos/intro.mp4', pdf: '/pdfs/intro.pdf', completed: true },
    { title: 'PPE & Hygiene Protocols', video: '/videos/ppe-hygiene.mp4', pdf: '/pdfs/ppe-hygiene.pdf', completed: true },
    { title: 'Waste Disposal & Safety', video: '/videos/waste.mp4', pdf: '/pdfs/waste.pdf', completed: false },
    { title: 'Emergency Response', video: '/videos/emergency.mp4', pdf: '/pdfs/emergency.pdf', completed: false },
    { title: 'Final Assessment', video: '/videos/final.mp4', pdf: '/pdfs/final.pdf', completed: false },
  ];
  
  const ModuleScreen = () => {
    const [segments, setSegments] = useState(initialSegments);
    const currentIndex = segments.findIndex(seg => !seg.completed);
    const [activeIndex, setActiveIndex] = useState(currentIndex === -1 ? 0 : currentIndex);
    const [feedback, setFeedback] = useState("");
  
    const handleModuleClick = (index: number) => {
      if (segments[index].completed || index === activeIndex) {
        setActiveIndex(index);
      }
    };
  
    const handleSubmit = () => {
      if (!feedback.trim()) return alert("Please enter feedback.");
  
      const updated = [...segments];
      updated[activeIndex].completed = true;
  
      // Unlock next segment if available
      if (activeIndex + 1 < updated.length) {
        setActiveIndex(activeIndex + 1);
      }
  
      setSegments(updated);
      setFeedback("");
    };
  
    const completedCount = segments.filter(s => s.completed).length;
    const progress = Math.round((completedCount / segments.length) * 100);
  
    return (
      <div className="student-dashboard">
        <div className={styles.container}>
  
          {/* Header */}
          <div className={styles.progressContainer}>
            <div className={styles.progressText}>
            1 of 4 lessons completed
            </div>
            <div className={styles.progressTrack}>
            <div
                className={styles.progressFilled}
                style={{ width: '25%' }}
            />
            </div>
        </div>
  
          <div className={styles.contentLayout}>
            {/* Sidebar Modules */}
            <aside className={styles.sidebar}>
              <h3>Modules</h3>
              <ul className={styles.moduleList}>
                {segments.map((segment, index: number) => (
                  <li
                    key={index}
                    className={`${styles.moduleItem} ${index === activeIndex ? styles.activeModule : ''}`}
                    onClick={() => handleModuleClick(index)}
                  >
                    <span>{segment.title}</span>
                    {!segment.completed && index > completedCount - 1 && (
                      <Image src={img1} alt="Locked" width={15} height={15} />
                    )}
                  </li>
                ))}
  
              </ul>
            </aside>
  
            {/* Video & PDF Content */}
            <section className={styles.videoSection}>
              <h2>{segments[activeIndex].title}</h2>
              <video className={styles.video} controls>
                <source src={segments[activeIndex].video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <a href={segments[activeIndex].pdf} className={styles.download} download>
                📄 Download PDF Notes
              </a>
  
              {!segments[activeIndex].completed && (
                <section className={styles.feedback}>
                  <h3>Feedback</h3>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Write your feedback..."
                    className={styles.textarea}
                  ></textarea>
                  <button onClick={handleSubmit} className={styles.submitBtn}>
                    Submit & Unlock Next Segment
                  </button>
                </section>
              )}
            </section>
  
            {/* Claude Assistant */}
            <aside className={styles.aiAssistant}>
              <h4>Ask Claude AI</h4>
              <textarea placeholder="Ask a question..." className={styles.textarea}></textarea>
              <button className={styles.askBtn}>Ask</button>
            </aside>
          </div>
        </div>
      </div>
  
  
  
  
 
  
    );
  };
  
  export default ModuleScreen;