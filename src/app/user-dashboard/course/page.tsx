import React from 'react';
import styles from '../Dashboard.module.css';
import Image from 'next/image';
import Link from "next/link";
import dp from '../../Assets/dp.webp'
import "../StudentDashboard.css";
import { FaBook } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";


const CourseScreen = () => {
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
          1 of 4 courses completed
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
          <div className={styles.name}>
            <FaBook className={styles.ficon}/>
            <h2>COURSES</h2>
          </div>

          <div className={styles.searchdiv}>
            <IoSearchOutline className={styles.sicon}/>
            <input type="search" placeholder='search...'/>
          </div>
        </div>
        

        <div className={styles.coursesgroup}>

          <div className={styles.eachcourse}>
            <div className={styles.etop}>
              <div className={styles.ecc}>
                <h1>1</h1>
                <h3>Introduction</h3>
              </div>
            </div>
            <div className={styles.ep}>
              <p>Learn the basics of using PPE and maintaining hygiene to ensure a safe, clean, and compliant work environment.</p>
            </div>

            <div className={styles.eaction}>
              <Link href='/user-dashboard/lesson' className={styles.eac}>
                <button>Start course</button>
              </Link>
              <p>4 lessons</p>
            </div>
          </div>

          <div className={styles.eachcourse}>
            <div className={styles.etop}>
              <div className={styles.ecc}>
                <h1>2</h1>
                <h3>Beginer&apos;s Guide</h3>
              </div>
            </div>
            <div className={styles.ep}>
              <p>Learn the basics of using PPE and maintaining hygiene to ensure a safe, clean, and compliant work environment.</p>
            </div>

            <div className={styles.eaction}>
              <Link href='' className={styles.eac}>
                <button className={styles.locked}>Locked</button>
              </Link>
              <p>4 lessons</p>
            </div>
          </div>

          <div className={styles.eachcourse}>
            <div className={styles.etop}>
              <div className={styles.ecc}>
                <h1>3</h1>
                <h3>Introduction</h3>
              </div>
            </div>
            <div className={styles.ep}>
              <p>Learn the basics of using PPE and maintaining hygiene to ensure a safe, clean, and compliant work environment.</p>
            </div>

            <div className={styles.eaction}>
              <Link href='' className={styles.eac}>
                <button className={styles.locked}>Locked</button>
              </Link>
              <p>4 lessons</p>
            </div>
          </div>


          <div className={styles.eachcourse}>
            <div className={styles.etop}>
              <div className={styles.ecc}>
                <h1>4</h1>
                <h3>Introduction</h3>
              </div>
            </div>
            <div className={styles.ep}>
              <p>Learn the basics of using PPE and maintaining hygiene to ensure a safe, clean, and compliant work environment.</p>
            </div>

            <div className={styles.eaction}>
              <Link href='' className={styles.eac}>
                <button className={styles.locked}>Locked</button>
              </Link>
              <p>4 lessons</p>
            </div>
          </div>


        </div>

      </div>


      
    </div>
  </div>
  );
};

export default CourseScreen;
