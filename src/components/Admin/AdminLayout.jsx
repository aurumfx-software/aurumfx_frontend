import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      document.body.style.overflow = isMobileOpen ? "hidden" : "";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleMenuToggle = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div
      className={`admin-layout ${isCollapsed ? "sidebar-collapsed" : ""} ${
        isMobileOpen ? "sidebar-open" : ""
      }`}
    >
      <button
        type="button"
        className="sidebar-overlay"
        aria-label="Close menu"
        onClick={() => setIsMobileOpen(false)}
      />
      <AdminSidebar
        isOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        onClose={() => setIsMobileOpen(false)}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      <div className="dashboard-main">
        <AdminHeader onMenuToggle={handleMenuToggle} />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
