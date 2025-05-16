"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUser,
  FaBook,
  FaSignOutAlt,
} from "react-icons/fa";

import styles from "../user-dashboard/Dashboard.module.css";

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/user-dashboard", label: "Home", icon: <FaTachometerAlt /> },
    { href: "/user-dashboard/course", label: "Course", icon: <FaBook /> },
    // { href: "/user-dashboard/feedback", label: "Feedback", icon: <LuNotebookPen /> },
    { href: "/user-dashboard/profile", label: "Profile", icon: <FaUser /> },
    { href: "/", label: "Logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <h2>User Dashboard</h2>
      <ul>
        {links.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`${pathname === href ? styles.active : ""} ${styles.link}`}
            >
              <span className={styles.icon}>{icon}</span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
