# Wish Consult

<p align="center">
  <strong>Expert Medical Guidance, On Your Schedule.</strong>
</p>

<p align="center">
  A premium e-learning and digital consultancy platform designed to provide structured mentorship paths for healthcare professionals and students.
</p>

---

## About The Project

Wish Consult is not just a collection of courses; it's a professional consultancy platform built to bridge the knowledge gap for medical professionals. The core mission is to provide trusted, reliable guidance from senior consultants through structured, sequential learning programs. This application is built with a modern, full-stack architecture using Next.js and Supabase.

The platform supports three primary user roles:
* **Students:** Learners who enroll in courses, track their progress, and interact with an AI assistant.
* **Admins:** Platform owners who manage all users, courses, announcements, and affiliate partnerships.
* **Affiliates:** Partners who promote the platform to earn commissions.

## Key Features

* **Role-Based Dashboards:** Tailored experiences for Students, Admins, and Affiliates.
* **Guided Learning Paths:** Courses are structured with sequential modules that unlock upon completion.
* **Interactive Onboarding:** Personalized setup wizards for both students and affiliates.
* **Real-time Analytics:** A live "Active Users" dashboard for admins.
* **Targeted Announcements:** A flexible system for admins to communicate with all users, specific roles, or individuals.
* **Affiliate & Referral System:** A complete portal for affiliates to track their links, referrals, and earnings.
* **Secure Authentication:** Robust login/signup system with email/username support and OTP verification.

## Tech Stack

This project is built with a modern, full-stack TypeScript architecture.

* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Backend & Database:** [Supabase](https://supabase.io/) (PostgreSQL)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Deployment:** [Vercel](https://vercel.com/)
* **Video Hosting:** [Cloudinary](https://cloudinary.com/)
* **Transactional Email:** [Resend](https://resend.com/)
* **Payment Gateway:** [Flutterwave](https://flutterwave.com/)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm or yarn
* A Supabase account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/bwire-official/wish-consultt.git](https://github.com/bwire-official/wish-consultt.git)
    cd wish-consultt
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    * Create a new file named `.env.local` in the root of your project.
    * Copy the contents of `.env.example` (or the template below) into your new file.
    * Go to your Supabase project dashboard -> Project Settings -> API to find your `URL` and `anon` key.
    * You will also need your `service_role` key for the admin client.

    **`.env.local` template:**
    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
    ```

4.  **Set up the database schema:**
    * Log in to your Supabase account.
    * Go to the SQL Editor and run the SQL scripts located in the `/supabase/schema` directory of this repository to create all the necessary tables, policies, and functions.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.
