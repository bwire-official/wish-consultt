"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { MdOutlineRateReview } from "react-icons/md";
import { VscReferences } from "react-icons/vsc";
import { CiMoneyBill } from "react-icons/ci";
import styles from "../user-dashboard/Dashboard.module.css";

const AffiliateSidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/affiliate", label: "Home", icon: <FaTachometerAlt /> },
    { href: "/affiliate/referral", label: "Referral Link", icon: <VscReferences /> },
    { href: "/affiliate/affiliate-performance", label: "Performance", icon: <GiProgression /> },
    { href: "/affiliate/earnings", label: "Earnings", icon: <CiMoneyBill  /> },
    { href: "/affiliate/payout-request", label: "Payout Request", icon: <MdOutlineRateReview /> },
    { href: "/affiliate/settings", label: "Settings", icon: <FaCog /> },
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
