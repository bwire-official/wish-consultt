'use client'
import React from 'react';
import styles from '../Dashboard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import dp from '../../Assets/dp.webp';
import "../StudentDashboard.css";
import { RiBookOpenLine } from "react-icons/ri";




const LessonScreen = () => {

 
  return (
  
  <div className="student-dashboard">

    <header className="student-header">
      <div className="s-div">
      
        <div className="prof">
          <Image src={dp} alt="" />
          <div>
            <h6 style={{color:'#fff'}}>Sam O</h6>
            <p>sam@gmail.com</p>
          </div>
        </div>

      </div>
    </header>

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

    
    <div className={styles.container}>  
    
      <div className={styles.courses}>
        <div className={styles.title}>
          <div>
            <h3>COURSE</h3>
            <h1>Introduction</h1>
          </div>

          
        </div>

        <div className={styles.desc}>
          <div className={styles.descc}>

            <h3>COURSE DESCRIPTION</h3>
            <p>Learn the basics of using PPE and maintaining hygiene to ensure a safe, clean, and compliant work environment.</p>
            
          </div>
        </div>
        
        

        <div className={styles.coursesgroup}>

          <Link href='/user-dashboard/module' className={styles.eachcourse}>
            <div className={styles.etop}>
              <div className={styles.ecc}>
                <h1><RiBookOpenLine /></h1>
                <h3>Introduction</h3>
              </div>
            </div>
            <div className={styles.ep}>
              <p>Learn the basics of using PPE and maintaining hygiene to ensure a safe, clean, and compliant work environment.</p>
            </div>

            
          </Link>

          <Link href='' className={styles.eachcourse}>
            <div className={styles.etop}>
              <div className={styles.ecc}>
                <h1><RiBookOpenLine /></h1>
                <h3>Beginner&apos;s Guide</h3>
              </div>
            </div>
            <div className={styles.ep}>
              <p>Learn the basics of using PPE and maintaining hygiene to ensure a safe, clean, and compliant work environment.</p>
            </div>

            
          </Link>

          <Link href='' className={styles.eachcourse}>
            <div className={styles.etop}>
              <div className={styles.ecc}>
                <h1><RiBookOpenLine /></h1>
                <h3>Introduction</h3>
              </div>
            </div>
            <div className={styles.ep}>
              <p>Learn the basics of using PPE and maintaining hygiene to ensure a safe, clean, and compliant work environment.</p>
            </div>

            
          </Link>


          <Link href='' className={styles.eachcourse}>
            <div className={styles.etop}>
              <div className={styles.ecc}>
                <h1><RiBookOpenLine /></h1>
                <h3>Introduction</h3>
              </div>
            </div>
            <div className={styles.ep}>
              <p>Learn the basics of using PPE and maintaining hygiene to ensure a safe, clean, and compliant work environment.</p>
            </div>


          </Link>


        </div>

      </div>

    </div>
  </div>


  );
};

export default LessonScreen;
