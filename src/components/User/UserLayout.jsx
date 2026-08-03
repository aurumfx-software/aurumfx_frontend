import { useState } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./UserLayout.css";

function UserLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    // If mobile, toggle open/close. If desktop, toggle collapse/expand.
    if (window.innerWidth <= 991) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className={`user-layout ${isCollapsed ? "user-layout--collapsed" : ""}`}>
      <UserSidebar
        isOpen={sidebarOpen}
        isCollapsed={isCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        user={user}
      />

      <div className="user-layout-main">
        <UserHeader
          onMenuToggle={handleToggle}
          user={user}
        />
        <main className="user-layout-content">{children}</main>
      </div>
    </div>
  );
}

export default UserLayout;
