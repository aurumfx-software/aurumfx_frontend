import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ClubBusiness from "./pages/user/genealogy/ClubBusiness";
import EnrollerBusiness from "./pages/user/genealogy/EnrollerBusiness";
import StructureBusiness from "./pages/user/genealogy/StructureBusiness";
import ListBusiness from "./pages/user/genealogy/ListBusiness";
import RankAchievers from "./pages/user/achievers/RankAchievers";
import CriteriaAchievers from "./pages/user/achievers/CriteriaAchievers";
import EWallet from "./pages/user/financial/EWallet";
import FundTransfer from "./pages/user/financial/FundTransfer";
import Withdrawals from "./pages/user/financial/Withdrawals";
import Investments from "./pages/user/financial/Investments";
import Profile from "./pages/user/Profile";
import HelpCenterPage from "./pages/user/help/HelpCenterPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes (/user prefix) */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/genealogy/binary"
          element={
            <ProtectedRoute requiredRole="user">
              <ClubBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/genealogy/sponsor"
          element={
            <ProtectedRoute requiredRole="user">
              <EnrollerBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/genealogy/tree"
          element={
            <ProtectedRoute requiredRole="user">
              <StructureBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/genealogy/list"
          element={
            <ProtectedRoute requiredRole="user">
              <ListBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/achievers/rank"
          element={
            <ProtectedRoute requiredRole="user">
              <RankAchievers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/achievers_list/rank_achievers"
          element={<Navigate to="/user/achievers/rank" replace />}
        />
        <Route
          path="/user/achievers/criteria"
          element={
            <ProtectedRoute requiredRole="user">
              <CriteriaAchievers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/achievers_list/criteria_achievers"
          element={<Navigate to="/user/achievers/criteria" replace />}
        />
        <Route
          path="/user/financial/ewallet"
          element={
            <ProtectedRoute requiredRole="user">
              <EWallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/financial/e-wallet"
          element={<Navigate to="/user/financial/ewallet" replace />}
        />
        <Route
          path="/user/financial/transfer"
          element={
            <ProtectedRoute requiredRole="user">
              <FundTransfer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/financial/funds-transfer"
          element={<Navigate to="/user/financial/transfer" replace />}
        />
        <Route
          path="/user/financial/withdrawals"
          element={
            <ProtectedRoute requiredRole="user">
              <Withdrawals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/financial/payout"
          element={<Navigate to="/user/financial/withdrawals" replace />}
        />
        <Route
          path="/user/financial/investments"
          element={
            <ProtectedRoute requiredRole="user">
              <Investments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute requiredRole="user">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile/activity"
          element={<Navigate to="/user/profile" replace />}
        />
        <Route
          path="/user/help/faqs"
          element={
            <ProtectedRoute requiredRole="user">
              <HelpCenterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/help/knowledge-base"
          element={
            <ProtectedRoute requiredRole="user">
              <HelpCenterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/help/emails"
          element={
            <ProtectedRoute requiredRole="user">
              <HelpCenterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/help/tickets"
          element={
            <ProtectedRoute requiredRole="user">
              <HelpCenterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/help/documents"
          element={
            <ProtectedRoute requiredRole="user">
              <HelpCenterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/help/videos"
          element={
            <ProtectedRoute requiredRole="user">
              <HelpCenterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/help"
          element={<Navigate to="/user/help/faqs" replace />}
        />
        <Route
          path="/user/help-center/mails/inbox"
          element={<Navigate to="/user/help/emails" replace />}
        />
        <Route
          path="/user/help/mails"
          element={<Navigate to="/user/help/emails" replace />}
        />

        {/* User Route Aliases */}
        <Route path="/login" element={<Navigate to="/user/login" replace />} />
        <Route path="/register" element={<Navigate to="/user/register" replace />} />
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />

        {/* Admin Routes (/admin prefix) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Route Aliases */}
        <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />

        {/* Home Landing Page */}
        <Route path="/" element={<Home />} />

        {/* 404 Unknown Route Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
