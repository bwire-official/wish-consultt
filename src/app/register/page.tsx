"use client"; 
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import React from "react";
import image from "../Assets/istockphoto-2147587863-612x612.jpg";
import Link from "next/link";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-image">
        <Image
            aria-hidden
            src={image}
            alt="Globe icon"
            layout="intrinsic" // Ensures the image stays responsive
        />
      </div>
      <div className="login-form">
        <h4><Link href="/"><FaArrowLeft className="b-i" /></Link></h4>
        <h2>Welcome Back</h2>
        <form>
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="/register">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;
