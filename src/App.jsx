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
import AdminDepositWallet from "./pages/admin/financial/AdminDepositWallet";
import AdminFundCredits from "./pages/admin/financial/AdminFundCredits";
import AdminPayout from "./pages/admin/financial/AdminPayout";
import AdminInvestments from "./pages/admin/financial/AdminInvestments";
import AdminFAQs from "./pages/admin/communication/AdminFAQs";
import AdminEmails from "./pages/admin/communication/AdminEmails";
import AdminHelpCenter from "./pages/admin/communication/AdminHelpCenter";
import AdminArticles from "./pages/admin/communication/AdminArticles";
import AdminDocuments from "./pages/admin/tools/AdminDocuments";
import AdminVideos from "./pages/admin/tools/AdminVideos";
import AdminNetworkMembers from "./pages/admin/members/AdminNetworkMembers";
import AdminHoldingTank from "./pages/admin/members/AdminHoldingTank";
import AdminBankApprove from "./pages/admin/members/AdminBankApprove";
import AdminKYCDetails from "./pages/admin/members/AdminKYCDetails";
import AdminModulePage from "./pages/admin/AdminModulePage";
import AdminRankAchievers from "./pages/admin/achievers/RankAchievers";
import AdminCriteriaAchievers from "./pages/admin/achievers/CriteriaAchievers";
import BrandSettings from "./pages/admin/settings/BrandSettings";
import NetworkSettings from "./pages/admin/settings/NetworkSettings";
import WithdrawalSettings from "./pages/admin/settings/WithdrawalSettings";
import AdvancedSettings from "./pages/admin/settings/AdvancedSettings";
import FundTransferReport from "./pages/admin/reports/FundTransfer";
import JoiningReport from "./pages/admin/reports/JoiningReport";
import MemberIncome from "./pages/admin/reports/MemberIncome";
import PayoutReport from "./pages/admin/reports/PayoutReport";
import PointHistory from "./pages/admin/reports/PointHistory";
import TopEarners from "./pages/admin/reports/TopEarners";

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
        <Route path="/admin/financial/e-wallet" element={<ProtectedRoute requiredRole="admin"><AdminEWallet /></ProtectedRoute>} />
        <Route path="/admin/financial/ewallet" element={<Navigate to="/admin/financial/e-wallet" replace />} />
        <Route path="/admin/financial/deposit-wallet" element={<ProtectedRoute requiredRole="admin"><AdminDepositWallet /></ProtectedRoute>} />
        <Route path="/admin/financial/deposit" element={<Navigate to="/admin/financial/deposit-wallet" replace />} />
        <Route path="/admin/financial/fund-credits" element={<ProtectedRoute requiredRole="admin"><AdminFundCredits /></ProtectedRoute>} />
        <Route path="/admin/financial/fund-credit" element={<Navigate to="/admin/financial/fund-credits" replace />} />
        <Route path="/admin/financial/credit" element={<Navigate to="/admin/financial/fund-credits" replace />} />
        <Route path="/admin/financial/transfer" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />
        <Route path="/admin/financial/payout/request" element={<ProtectedRoute requiredRole="admin"><AdminPayout /></ProtectedRoute>} />
        <Route path="/admin/financial/payout/history" element={<ProtectedRoute requiredRole="admin"><AdminPayout /></ProtectedRoute>} />
        <Route path="/admin/financial/payout" element={<Navigate to="/admin/financial/payout/request" replace />} />
        <Route path="/admin/financial/investments/request" element={<ProtectedRoute requiredRole="admin"><AdminInvestments /></ProtectedRoute>} />
        <Route path="/admin/financial/investments/history" element={<ProtectedRoute requiredRole="admin"><AdminInvestments /></ProtectedRoute>} />
        <Route path="/admin/financial/investments" element={<Navigate to="/admin/financial/investments/request" replace />} />

        {/* Communication Routes */}
        <Route path="/admin/communication/faqs" element={<ProtectedRoute requiredRole="admin"><AdminFAQs /></ProtectedRoute>} />
        <Route path="/admin/communication/faq" element={<Navigate to="/admin/communication/faqs" replace />} />
        <Route path="/admin/communication/mails/inbox" element={<ProtectedRoute requiredRole="admin"><AdminEmails /></ProtectedRoute>} />
        <Route path="/admin/communication/mails/sent" element={<ProtectedRoute requiredRole="admin"><AdminEmails /></ProtectedRoute>} />
        <Route path="/admin/communication/emails" element={<Navigate to="/admin/communication/mails/inbox" replace />} />
        <Route path="/admin/communication/mails" element={<Navigate to="/admin/communication/mails/inbox" replace />} />
        <Route path="/admin/communication/help-center/tickets/:category" element={<ProtectedRoute requiredRole="admin"><AdminHelpCenter /></ProtectedRoute>} />
        <Route path="/admin/communication/help-center" element={<Navigate to="/admin/communication/help-center/tickets/inprogress" replace />} />
        <Route path="/admin/communication/articles" element={<ProtectedRoute requiredRole="admin"><AdminArticles /></ProtectedRoute>} />
        <Route path="/admin/communication/article" element={<Navigate to="/admin/communication/articles" replace />} />
        
        {/* Deprecated redirects */}
        <Route path="/admin/communication/tickets" element={<Navigate to="/admin/communication/help-center" replace />} />
        <Route path="/admin/communication/announcements" element={<Navigate to="/admin/communication/articles" replace />} />

        {/* Tools Routes */}
        <Route path="/admin/tools/documents" element={<ProtectedRoute requiredRole="admin"><AdminDocuments /></ProtectedRoute>} />
        <Route path="/admin/tools/videos" element={<ProtectedRoute requiredRole="admin"><AdminVideos /></ProtectedRoute>} />
        <Route path="/admin/tools/faqs" element={<ProtectedRoute requiredRole="admin"><AdminModulePage /></ProtectedRoute>} />

        {/* Members Management Routes */}
        <Route path="/admin/members/network" element={<ProtectedRoute requiredRole="admin"><AdminNetworkMembers /></ProtectedRoute>} />
        <Route path="/admin/members/holding-tank" element={<ProtectedRoute requiredRole="admin"><AdminHoldingTank /></ProtectedRoute>} />
        <Route path="/admin/members/bank-approve" element={<ProtectedRoute requiredRole="admin"><AdminBankApprove /></ProtectedRoute>} />
        <Route path="/admin/members/bank-account" element={<Navigate to="/admin/members/bank-approve" replace />} />
        <Route path="/admin/members/kyc-details" element={<ProtectedRoute requiredRole="admin"><AdminKYCDetails /></ProtectedRoute>} />
        <Route path="/admin/members/kyc" element={<Navigate to="/admin/members/kyc-details" replace />} />
        <Route path="/admin/members/list" element={<Navigate to="/admin/members/network" replace />} />
        <Route path="/admin/members/add" element={<Navigate to="/admin/members/network" replace />} />

        {/* Achievers List Routes */}
        <Route path="/admin/achievers/rank" element={<ProtectedRoute requiredRole="admin"><AdminRankAchievers /></ProtectedRoute>} />
        <Route
          path="/admin/achievers_list/rank_achievers"
          element={<Navigate to="/admin/achievers/rank" replace />}
        />
        <Route path="/admin/achievers/criteria" element={<ProtectedRoute requiredRole="admin"><AdminCriteriaAchievers /></ProtectedRoute>} />
        <Route
          path="/admin/achievers_list/criteria_achievers"
          element={<Navigate to="/admin/achievers/criteria" replace />}
        />

        {/* Settings Routes */}
        <Route path="/admin/settings/brand" element={<ProtectedRoute requiredRole="admin"><BrandSettings /></ProtectedRoute>} />
        <Route path="/admin/settings/network" element={<ProtectedRoute requiredRole="admin"><NetworkSettings /></ProtectedRoute>} />
        <Route path="/admin/settings/network/binaryMatching" element={<ProtectedRoute requiredRole="admin"><NetworkSettings /></ProtectedRoute>} />
        <Route path="/admin/settings/network/*" element={<ProtectedRoute requiredRole="admin"><NetworkSettings /></ProtectedRoute>} />
        <Route path="/admin/settings/withdrawal" element={<ProtectedRoute requiredRole="admin"><WithdrawalSettings /></ProtectedRoute>} />
        <Route path="/admin/settings/advanced" element={<ProtectedRoute requiredRole="admin"><AdvancedSettings /></ProtectedRoute>} />
        <Route path="/admin/settings/general" element={<Navigate to="/admin/settings/brand" replace />} />
        <Route path="/admin/settings/payment" element={<Navigate to="/admin/settings/withdrawal" replace />} />
        <Route path="/admin/settings/commissions" element={<Navigate to="/admin/settings/network" replace />} />

        {/* Reports Routes */}
        <Route path="/admin/report/fund-transfer" element={<ProtectedRoute requiredRole="admin"><FundTransferReport /></ProtectedRoute>} />
        <Route path="/admin/report/joining"       element={<ProtectedRoute requiredRole="admin"><JoiningReport /></ProtectedRoute>} />
        <Route path="/admin/report/member-income" element={<ProtectedRoute requiredRole="admin"><MemberIncome /></ProtectedRoute>} />
        <Route path="/admin/report/payout"        element={<ProtectedRoute requiredRole="admin"><PayoutReport /></ProtectedRoute>} />
        <Route path="/admin/report/point-history" element={<ProtectedRoute requiredRole="admin"><PointHistory /></ProtectedRoute>} />
        <Route path="/admin/report/earners"       element={<ProtectedRoute requiredRole="admin"><TopEarners /></ProtectedRoute>} />
        {/* Legacy report route aliases */}
        <Route path="/admin/reports/sales"  element={<Navigate to="/admin/report/joining" replace />} />
        <Route path="/admin/reports/payout" element={<Navigate to="/admin/report/payout"  replace />} />
        <Route path="/admin/reports/tax"    element={<Navigate to="/admin/report/earners" replace />} />

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
