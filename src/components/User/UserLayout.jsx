import { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { getProfileApi, getProfileImageApi } from "../../api/auth";
import "./UserLayout.css";

function UserLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileImage, setProfileImage] = useState(
    user?.avatar && String(user.avatar).trim() ? String(user.avatar).trim() : ""
  );
  const [profileName, setProfileName] = useState(
    user?.fullName || localStorage.getItem("userFullName") || ""
  );

  useEffect(() => {
    let active = true;

    const nextAvatar = typeof user?.avatar === "string" ? user.avatar.trim() : "";
    if (nextAvatar) {
      setProfileImage(nextAvatar);
      localStorage.setItem("userProfileImage", nextAvatar);
      return () => {
        active = false;
      };
    }

    getProfileImageApi().then((result) => {
      if (!active) return;

      const avatarUrl = typeof result?.data === "string" ? result.data.trim() : "";

      if (result.success && avatarUrl) {
        setProfileImage(avatarUrl);
        localStorage.setItem("userProfileImage", avatarUrl);
        return;
      }

      setProfileImage("");
      localStorage.removeItem("userProfileImage");
    });

    return () => {
      active = false;
    };
  }, [user?.avatar]);

  useEffect(() => {
    const suppliedName = String(user?.fullName || user?.name || "");
    const userId = String(user?.userId || "");
    const hasRealSuppliedName = suppliedName && suppliedName.toUpperCase() !== userId.toUpperCase();
    if (hasRealSuppliedName) {
      setProfileName(suppliedName);
      localStorage.setItem("userFullName", suppliedName);
      return undefined;
    }
    const cachedName = localStorage.getItem("userFullName");
    if (cachedName) setProfileName(cachedName);
    if (!userId) return undefined;

    let active = true;
    getProfileApi().then((result) => {
      if (!active || !result.success) return;
      const data = result.data?.data || result.data || {};
      const firstName = data.first_name || data.firstName || "";
      const lastName = data.last_name || data.lastName || "";
      const fullName = data.full_name || data.fullName || `${firstName} ${lastName}`.trim();
      if (fullName) {
        setProfileName(fullName);
        localStorage.setItem("userFullName", fullName);
      }
    });

    return () => {
      active = false;
    };
  }, [user?.fullName, user?.name, user?.userId]);

  const layoutUser = { ...user, fullName: profileName || user?.fullName, avatar: profileImage };

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
        user={layoutUser}
      />

      <div className="user-layout-main">
        <UserHeader
          onMenuToggle={handleToggle}
          user={layoutUser}
        />
        <main className="user-layout-content">{children}</main>
      </div>
    </div>
  );
}

export default UserLayout;
