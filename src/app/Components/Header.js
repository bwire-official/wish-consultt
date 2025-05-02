"use client";

import React, { useState } from 'react';
import logo from '../Assets/logo.png';
import Image from 'next/image';
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav>
        <Image
          aria-hidden
          src={logo}
          alt="Logo"
          width={120}
          height={60}
        />
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? 'rotate' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'rotate' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'rotate' : ''}`}></span>
        </div>
        <ul className={isMenuOpen ? "open" : ""}>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#faq">FAQs</a></li>
          <li><Link href='/register'>Sign Up</Link></li>
          <li className='sign'><Link href='/login'>Signin</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
