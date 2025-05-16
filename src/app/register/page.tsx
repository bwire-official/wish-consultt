"use client"; 
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import React from "react";
import image from "../Assets/m5.jpg";
import Link from "next/link";

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-image">
        <Image
            aria-hidden
            src={image}
            alt="Globe icon"
        />
      </div>
      <div className="register-form">
        <h4><Link href="/"><FaArrowLeft className="b-i" /></Link></h4>
        <h2>Create Account</h2>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Register;
