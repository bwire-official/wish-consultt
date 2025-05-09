"use client";
import AffiliateSidebar from "../Components/AffiliateSidebar";
import styles from "./Dashboard.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.dashboard}>
      <AffiliateSidebar />
      <main className={styles.dashboardContent}>
        {children}
      </main>
    </div>
  );
}
