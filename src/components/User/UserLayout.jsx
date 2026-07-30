import { useState } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import "./UserLayout.css";

function UserLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="user-layout">
      <UserSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <div className="user-layout-main">
        <UserHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          user={user}
        />
        <main className="user-layout-content">{children}</main>
      </div>
    </div>
  );
}

export default UserLayout;
