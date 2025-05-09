"use client";
import AdminSidebar from "../Components/AdminSidebar";
import styles from "./Dashboard.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.dashboard}>
      <AdminSidebar />
      <main className={styles.dashboardContent}>
        {children}
      </main>
    </div>
  );
}
