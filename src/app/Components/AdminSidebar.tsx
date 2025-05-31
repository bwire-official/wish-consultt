"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import { GiProgression } from "react-icons/gi";
import { MdOutlineRateReview } from "react-icons/md";
import { LuMessageSquareQuote } from "react-icons/lu";
import styles from "../user-dashboard/Dashboard.module.css";

const AdminSidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/admin-dashboard", label: "Home", icon: <FaTachometerAlt /> },
    { href: "/admin-dashboard/users", label: "Users", icon: <FaUsers /> },
    { href: "/admin-dashboard/courses", label: "Courses", icon: <FaBook /> },
    { href: "/admin-dashboard/progress", label: "Progress", icon: <GiProgression /> },
    { href: "/admin-dashboard/feedbacks", label: "Feedback", icon: <MdOutlineRateReview /> },
    { href: "/admin-dashboard/affiliates", label: "Affiliates", icon: <FaUsers /> },
    { href: "/admin-dashboard/claude-settings", label: "Claude Settings", icon: <FaCog /> },
    { href: "/", label: "Logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* <h2>Admin</h2> */}
      <ul>
        {links.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`${pathname === href ? styles.active : ""} ${styles.link}`}
            >
              <span className={styles.icon}>{icon}</span>
              <p>{label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
