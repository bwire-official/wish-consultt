"use client";
import Sidebar from "../Components/Sidebar";
import styles from "./Dashboard.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.dashboardContent}>
        {children}
      </main>
    </div>
  );
}
