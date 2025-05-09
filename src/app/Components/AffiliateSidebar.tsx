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
import { VscReferences } from "react-icons/vsc";
import { CiMoneyBill } from "react-icons/ci";
import styles from "../user-dashboard/Dashboard.module.css";

const AffiliateSidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/admin-dashboard", label: "Home", icon: <FaTachometerAlt /> },
    { href: "/admin-dashboard/referral-link", label: "Referral Link", icon: <VscReferences /> },
    { href: "/admin-dashboard/referral-track", label: "Referral Tracking", icon: <GiProgression /> },
    { href: "/admin-dashboard/earnings", label: "Earnings", icon: <CiMoneyBill  /> },
    { href: "/admin-dashboard/payout", label: "Payout Request", icon: <MdOutlineRateReview /> },
    { href: "/admin-dashboard/setting", label: "Settings", icon: <FaCog /> },
    { href: "/", label: "Logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <h2>Affiliate</h2>
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

export default AffiliateSidebar;
