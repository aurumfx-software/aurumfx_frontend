import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/login/Login";
import AdminLogin from "./pages/login/AdminLogin";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInvestments from "./pages/admin/financial/AdminInvestments";
import PlanInvestments from "./pages/admin/financial/PlanInvestments";
import TypeInvestments from "./pages/admin/financial/TypeInvestments";
import AdminLotSettings from "./pages/admin/financial/AdminLotSettings";
import AdminWallet from "./pages/admin/wallet/AdminWallet";
import AdminNetworkMembers from "./pages/admin/members/AdminNetworkMembers";
import AdminHoldingTank from "./pages/admin/members/AdminHoldingTank";
import AdminBankApprove from "./pages/admin/members/AdminBankApprove";
import AdminKYCDetails from "./pages/admin/members/AdminKYCDetails";
import GenealogyPage from "./pages/admin/members/GenealogyPage";
import AdminModulePage from "./pages/admin/AdminModulePage";
import BrandSettings from "./pages/admin/settings/BrandSettings";
import NetworkSettings from "./pages/admin/settings/NetworkSettings";
import WithdrawalSettings from "./pages/admin/settings/WithdrawalSettings";
import AdvancedSettings from "./pages/admin/settings/AdvancedSettings";
import LevelSettings from "./pages/admin/level/LevelSettings";
import LevelCommissionReport from "./pages/admin/level/LevelCommissionReport";
import RankList from "./pages/admin/ranks/RankList";
import FundTransferReport from "./pages/admin/reports/FundTransfer";
import JoiningReport from "./pages/admin/reports/JoiningReport";
import MemberIncome from "./pages/admin/reports/MemberIncome";
import PayoutReport from "./pages/admin/reports/PayoutReport";
import PointHistory from "./pages/admin/reports/PointHistory";
import TopEarners from "./pages/admin/reports/TopEarners";




import UserDashboard from "./pages/user/UserDashboard";
import RankAchieversPage from "./pages/user/RankAchieversPage";
import CriteriaAchieversPage from "./pages/user/CriteriaAchieversPage";
import EWallet from "./pages/user/financial/EWallet";
import Investments from "./pages/user/financial/Investments";
import Profile from "./pages/user/Profile";
import UserGenealogyPage from "./pages/user/GenealogyPage";
import HelpCenterPage from "./pages/user/help/HelpCenterPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import GoldenCursor from "./components/GoldenCursor/GoldenCursor";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GoldenCursor />
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
          path="/user/financial/ewallet"
          element={
            <ProtectedRoute requiredRole="user">
              <EWallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/financial/e-wallet"
          element={<Navigate to="/user/financial/my-wallet" replace />}
        />
        <Route
          path="/user/financial/my-wallet"
          element={
            <ProtectedRoute requiredRole="user">
              <EWallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/financial/withdrawal"
          element={
            <ProtectedRoute requiredRole="user">
              <EWallet />
            </ProtectedRoute>
          }
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
          path="/user/financial/investment"
          element={
            <ProtectedRoute requiredRole="user">
              <Investments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={<Navigate to="/user/account/profile" replace />}
        />
        <Route
          path="/user/account"
          element={<Navigate to="/user/account/profile" replace />}
        />
        <Route
          path="/user/account/profile"
          element={
            <ProtectedRoute requiredRole="user">
              <Profile defaultTab="profile" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/account/bank-details"
          element={
            <ProtectedRoute requiredRole="user">
              <Profile defaultTab="bank" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/account/kyc"
          element={
            <ProtectedRoute requiredRole="user">
              <Profile defaultTab="kyc" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/account/edit-info"
          element={
            <ProtectedRoute requiredRole="user">
              <Profile defaultTab="edit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/account/settings"
          element={
            <ProtectedRoute requiredRole="user">
              <Profile defaultTab="settings" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/business/family"
          element={
            <ProtectedRoute requiredRole="user">
              <UserGenealogyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/business/list"
          element={
            <ProtectedRoute requiredRole="user">
              <UserGenealogyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/business/enroller"
          element={
            <ProtectedRoute requiredRole="user">
              <UserGenealogyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/achievers/rank"
          element={
            <ProtectedRoute requiredRole="user">
              <RankAchieversPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/rank"
          element={<Navigate to="/user/achievers/rank" replace />}
        />
        <Route
          path="/user/achievers/criteria"
          element={
            <ProtectedRoute requiredRole="user">
              <CriteriaAchieversPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/genealogy"
          element={<Navigate to="/user/business/family" replace />}
        />
        <Route
          path="/user/profile/activity"
          element={<Navigate to="/user/profile" replace />}
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
          element={<Navigate to="/user/help/tickets" replace />}
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
        <Route
          path="/register"
          element={<Navigate to="/user/register" replace />}
        />
        <Route
          path="/dashboard"
          element={<Navigate to="/user/dashboard" replace />}
        />

        {/* Admin Routes (/admin prefix) */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard/business" replace />}
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin-login"
          element={<Navigate to="/admin/login" replace />}
        />
        <Route
          path="/admin-dashboard"
          element={<Navigate to="/admin/dashboard/business" replace />}
        />
        <Route
          path="/admin/dashboard"
          element={<Navigate to="/admin/dashboard/business" replace />}
        />
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
        {/* Financial Routes */}
        <Route
          path="/admin/financial/investments/request"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminInvestments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/investments/history"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminInvestments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/investments/active"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminInvestments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/investments/today"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminInvestments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/investment-plan"
          element={
            <ProtectedRoute requiredRole="admin">
              <PlanInvestments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/investment-type"
          element={
            <ProtectedRoute requiredRole="admin">
              <TypeInvestments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/lot-settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLotSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/investments"
          element={
            <Navigate to="/admin/financial/investments/request" replace />
          }
        />
        <Route
          path="/admin/wallet"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminWallet />
            </ProtectedRoute>
          }
        />

        {/* Tools Routes */}
        <Route
          path="/admin/tools/faqs"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminModulePage />
            </ProtectedRoute>
          }
        />

        {/* Members Management Routes */}
        <Route
          path="/admin/members/network"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminNetworkMembers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members/holding-tank"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminHoldingTank />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members/bank-approve"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminBankApprove />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members/bank-account"
          element={<Navigate to="/admin/members/bank-approve" replace />}
        />
        <Route
          path="/admin/members/kyc-details"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminKYCDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/genealogy"
          element={
            <ProtectedRoute requiredRole="admin">
              <GenealogyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members/kyc"
          element={<Navigate to="/admin/members/kyc-details" replace />}
        />
        <Route
          path="/admin/members/list"
          element={<Navigate to="/admin/members/network" replace />}
        />
        <Route
          path="/admin/members/add"
          element={<Navigate to="/admin/members/network" replace />}
        />

        {/* Settings Routes */}
        <Route
          path="/admin/settings/brand"
          element={
            <ProtectedRoute requiredRole="admin">
              <BrandSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/network"
          element={
            <ProtectedRoute requiredRole="admin">
              <NetworkSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/network/binaryMatching"
          element={
            <ProtectedRoute requiredRole="admin">
              <NetworkSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/network/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <NetworkSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/withdrawal"
          element={
            <ProtectedRoute requiredRole="admin">
              <WithdrawalSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/level-settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <LevelSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/ranks"
          element={
            <ProtectedRoute requiredRole="admin">
              <RankList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/level-report"
          element={
            <ProtectedRoute requiredRole="admin">
              <LevelCommissionReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/advanced"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdvancedSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/general"
          element={<Navigate to="/admin/settings/brand" replace />}
        />
        <Route
          path="/admin/settings/payment"
          element={<Navigate to="/admin/settings/withdrawal" replace />}
        />
        <Route
          path="/admin/settings/commissions"
          element={<Navigate to="/admin/settings/network" replace />}
        />

        {/* Reports Routes */}
        <Route
          path="/admin/report/fund-transfer"
          element={
            <ProtectedRoute requiredRole="admin">
              <FundTransferReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/joining"
          element={
            <ProtectedRoute requiredRole="admin">
              <JoiningReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/member-income"
          element={
            <ProtectedRoute requiredRole="admin">
              <MemberIncome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/income"
          element={
            <ProtectedRoute requiredRole="admin">
              <MemberIncome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/payout"
          element={
            <ProtectedRoute requiredRole="admin">
              <PayoutReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/point-history"
          element={
            <ProtectedRoute requiredRole="admin">
              <PointHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/point/history"
          element={
            <ProtectedRoute requiredRole="admin">
              <PointHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/earners"
          element={
            <ProtectedRoute requiredRole="admin">
              <TopEarners />
            </ProtectedRoute>
          }
        />
        {/* Legacy report route aliases */}
        <Route
          path="/admin/reports/sales"
          element={<Navigate to="/admin/report/joining" replace />}
        />
        <Route
          path="/admin/reports/payout"
          element={<Navigate to="/admin/report/payout" replace />}
        />
        <Route
          path="/admin/reports/tax"
          element={<Navigate to="/admin/report/earners" replace />}
        />

        {/* Admin Route Aliases */}
        <Route
          path="/admin-login"
          element={<Navigate to="/admin/login" replace />}
        />

        {/* Home Landing Page */}
        <Route path="/" element={<Home />} />

        {/* 404 Unknown Route Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
