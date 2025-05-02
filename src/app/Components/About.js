import React from 'react'
import Image from 'next/image';
import image from '../Assets/d.jpg'

const About = () => {
  return (
    <div>
        <div className="about-us" id='about'>
            <Image
                aria-hidden
                src={image}
                alt="Globe icon"
               
            />
            <div>
                <h3>Empowering Learners Through AI-Personalized Education and Growth</h3>
                <p>At <b>Wish Consult ltd,</b> we believe that learning should be intentional, interactive, and deeply personal. Our platform blends structured course content with cutting-edge AI support to help learners not only absorb knowledge but apply it meaningfully in the real world.</p>
                <button className="gradient-button">Start Now</button>

            </div>

            
        </div>
    </div>
  )
}

export default About