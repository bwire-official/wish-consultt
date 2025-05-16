"use client"

import Image from "next/image";
import Header from './Components/Header'
import Link from "next/link";
import image from './Assets/m9-removebg-preview.png'
import About from './Components/About'
import Success from './Components/Success'
import Faqs from './Components/Faqs'
import Footer from './Components/Footer'

export default function Home() {
  return (
    <div>
      <div className="home-top">
        <Header/>

        <div className="hero" id="home">
          <div>
            <h2>Unlock premium, AI-powered learning with <span>Wish Consult.</span></h2>
            <p>Where your progress is personalized, your knowledge is guided.</p>
            <Link href='/login'><button className="gradient-button">Get Started</button></Link>
          </div>

          <Image
                aria-hidden
                src={image}
                alt="Globe icon"
                className="float-flip-image"
            />
        </div>

      </div>

      <div className="extra-info">
          <div className="ext">
            <div>
              <h3>10K</h3>
              <p>Healthcare Professionals</p>
            </div>

            <div>
              <h3>100</h3>
              <p>Enrolled Medical</p>
            </div>

            <div>
              <h3>40</h3>
              <p>Certified Healthcare Facilities</p>
            </div>

          </div>
        </div>

      <About/>
      <Success/>
      {/* <Faqs/> */}
      <Footer/>


    </div>
  );
}
