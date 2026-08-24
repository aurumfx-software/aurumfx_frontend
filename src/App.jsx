import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/login/Login";
import AdminLogin from "./pages/login/AdminLogin";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInvestments from "./pages/admin/financial/AdminInvestments";
import PlanInvestments from "./pages/admin/financial/PlanInvestments";
import TypeInvestments from "./pages/admin/financial/TypeInvestments";
import AdminLotSettings from "./pages/admin/financial/AdminLotSettings";
import AdminPayout from "./pages/admin/financial/AdminPayout";
import AdminWallet from "./pages/admin/wallet/AdminWallet";
import AdminNetworkMembers from "./pages/admin/members/AdminNetworkMembers";
import AdminBankApprove from "./pages/admin/members/AdminBankApprove";
import AdminKYCDetails from "./pages/admin/members/AdminKYCDetails";
import GenealogyPage from "./pages/admin/members/GenealogyPage";
import GenealogyListPage from "./pages/admin/members/GenealogyListPage";
import AdminEnrollersPage from "./pages/admin/members/AdminEnrollersPage";
import AdminModulePage from "./pages/admin/AdminModulePage";
import AdminHelpCenter from "./pages/admin/help/AdminHelpCenter";
import AdminFeeSettings from "./pages/admin/settings/AdminFeeSettings";
import ReferralCommissionSettings from "./pages/admin/settings/ReferralCommissionSettings";
import ReturnDateSettings from "./pages/admin/settings/ReturnDateSettings";
import LevelSettings from "./pages/admin/level/LevelSettings";
import RankList from "./pages/admin/ranks/RankList";
import RankHolders from "./pages/admin/ranks/RankHolders";
import InvestmentReport from "./pages/admin/reports/InvestmentReport";
import LevelIncomeReport from "./pages/admin/reports/LevelIncomeReport";
import ReferralIncomeReport from "./pages/admin/reports/ReferralIncomeReport";
import RankIncomeReport from "./pages/admin/reports/RankIncomeReport";
import PayoutReport from "./pages/admin/reports/PayoutReport";




import UserDashboard from "./pages/user/UserDashboard";
import RanksPage from "./pages/user/RanksPage";
import RankAchieversPage from "./pages/user/RankAchieversPage";
import CriteriaAchieversPage from "./pages/user/CriteriaAchieversPage";
import EWallet from "./pages/user/financial/EWallet";
import Investments from "./pages/user/financial/Investments";
import WithdrawalPage from "./pages/user/financial/WithdrawalPage";
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
    <>
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
              <WithdrawalPage />
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
          path="/user/ranks"
          element={
            <ProtectedRoute requiredRole="user">
              <RanksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/rank"
          element={<Navigate to="/user/ranks" replace />}
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
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin-login"
          element={<Navigate to="/admin/login" replace />}
        />
        <Route
          path="/admin-dashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/network"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/admin/dashboard/business"
          element={<Navigate to="/admin/dashboard" replace />}
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
          path="/admin/genealogy/list"
          element={
            <ProtectedRoute requiredRole="admin">
              <GenealogyListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/enrollers"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminEnrollersPage />
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
          path="/admin/settings/level-settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <LevelSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/admin-fee"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminFeeSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/referral-commission"
          element={
            <ProtectedRoute requiredRole="admin">
              <ReferralCommissionSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/return-date"
          element={
            <ProtectedRoute requiredRole="admin">
              <ReturnDateSettings />
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
          path="/admin/rank-list"
          element={
            <ProtectedRoute requiredRole="admin">
              <RankHolders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/help-center"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminHelpCenter />
            </ProtectedRoute>
          }
        />

        {/* Reports Routes */}
        <Route
          path="/admin/report/investment"
          element={
            <ProtectedRoute requiredRole="admin">
              <InvestmentReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial/payout"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/level-income"
          element={
            <ProtectedRoute requiredRole="admin">
              <LevelIncomeReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/referral-income"
          element={
            <ProtectedRoute requiredRole="admin">
              <ReferralIncomeReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report/rank-income"
          element={
            <ProtectedRoute requiredRole="admin">
              <RankIncomeReport />
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
    </>
  );
}

export default App;
