import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login/Login";
import AdminLogin from "./pages/login/AdminLogin";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClubBusiness from "./pages/admin/genealogy/ClubBusiness";
import AdminEnrollerBusiness from "./pages/admin/genealogy/EnrollerBusiness";
import AdminStructureBusiness from "./pages/admin/genealogy/StructureBusiness";
import AdminListBusiness from "./pages/admin/genealogy/ListBusiness";
import AdminEWallet from "./pages/admin/financial/AdminEWallet";
import AdminModulePage from "./pages/admin/AdminModulePage";

import UserDashboard from "./pages/user/UserDashboard";
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
        <Route path="/admin" element={<Navigate to="/admin/dashboard/business" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard/business" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin/dashboard/business" replace />} />
        <Route
          path="/admin/dashboard/network"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/business"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/business/club"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminClubBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/business/enroller"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminEnrollerBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/business/structure"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminStructureBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/business/list"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminListBusiness />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/genealogy/binary" element={<Navigate to="/admin/business/club" replace />} />
        <Route path="/admin/genealogy/sponsor" element={<Navigate to="/admin/business/enroller" replace />} />
        <Route path="/admin/genealogy/tree" element={<Navigate to="/admin/business/structure" replace />} />
        <Route path="/admin/genealogy/list" element={<Navigate to="/admin/business/list" replace />} />

        {/* Financial Routes */}
        <Route path="/admin/financial/ewallet" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/financial/deposit" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/financial/credit" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/financial/payout" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/financial/investments" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />

        {/* Communication Routes */}
        <Route path="/admin/communication/mails" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/communication/tickets" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/communication/announcements" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />

        {/* Tools Routes */}
        <Route path="/admin/tools/documents" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/tools/videos" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/tools/faqs" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />

        {/* Members Management Routes */}
        <Route path="/admin/members/list" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/members/add" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/members/kyc" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />

        {/* Achievers List Routes */}
        <Route path="/admin/achievers/rank" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/achievers/criteria" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />

        {/* Settings Routes */}
        <Route path="/admin/settings/general" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/settings/payment" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/settings/commissions" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />

        {/* Reports Routes */}
        <Route path="/admin/reports/sales" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/reports/payout" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/reports/tax" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />

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
