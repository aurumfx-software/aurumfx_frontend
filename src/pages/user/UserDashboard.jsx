import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiUsers,
  FiArrowUpRight,
  FiPlusCircle,
  FiLayers,
  FiTrendingUp,
  FiGift,
  FiBarChart2,
  FiImage,
  FiBookmark,
  FiRepeat,
  FiBriefcase,
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";
import UserLayout from "../../components/User/UserLayout";
import UserRankCard from "../../components/User/UserRankCard";
import { getUserDashboardData } from "../../api/dashboard";
import { getMyKycApi, getProfileBankDetailsApi } from "../../api/auth";
import { getMyInvestmentsApi } from "../../api/investments";
import { hasBankSubmission, normalizeStatus } from "./profileTabs/shared";
import "./UserDashboard.css";

function getInitials(name) {
  const clean = String(name || "U").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Builds an SVG line+area path from a series of numbers, mapped into a viewBox.
function buildLinePath(values, width, height, padding = 10) {
  if (!values.length) return { line: "", area: "", points: [] };
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / Math.max(1, values.length - 1);

  const points = values.map((v, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return [x, y];
  });

  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const area =
    `M${points[0][0].toFixed(1)},${(height - padding).toFixed(1)} ` +
    points.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(" ") +
    ` L${points[points.length - 1][0].toFixed(1)},${(height - padding).toFixed(1)} Z`;

  return { line, area, points };
}

// Small decorative sparkline for the team cards. Purely illustrative shape —
// not wired to any API — so it never lies about real trend data.
function TeamSparkline() {
  const { line, points } = buildLinePath([2, 3, 2.5, 4, 3, 4.5, 4], 90, 40, 4);
  const last = points[points.length - 1];
  return (
    <div className="team-sparkline">
      <svg width="90" height="40" viewBox="0 0 90 40">
        <path
          d={line}
          fill="none"
          stroke="var(--udb-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {last && <circle cx={last[0]} cy={last[1]} r="3" fill="var(--udb-accent)" />}
      </svg>
    </div>
  );
}

// Neutral, flat-ish sample shape used only to preview the chart interface
// before the user has any real income — never treated as real data.
const INCOME_CHART_PLACEHOLDER_VALUES = [2, 2.6, 2.2, 3, 2.5, 3.4];

function UserDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationPrompt, setVerificationPrompt] = useState(null);
  const [investmentHistory, setInvestmentHistory] = useState([]);
  const [investmentHistoryLoading, setInvestmentHistoryLoading] = useState(false);
  const [investmentHistoryOpen, setInvestmentHistoryOpen] = useState(false);
  const isHoverCapableDevice =
    typeof window !== "undefined"
      ? window.matchMedia("(hover: hover) and (pointer: fine)").matches
      : true;

  const loadInvestmentHistory = async () => {
    if (investmentHistoryLoading || investmentHistory.length) return;

    setInvestmentHistoryLoading(true);
    const res = await getMyInvestmentsApi();
    if (res.success) {
      setInvestmentHistory(Array.isArray(res.data) ? res.data : []);
    }
    setInvestmentHistoryLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    getUserDashboardData()
      .then((res) => {
        if (!isMounted) return;
        if (res && res.data) setDashboardData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getMyKycApi(), getProfileBankDetailsApi()]).then(([kycRes, bankRes]) => {
      if (!isMounted) return;

      const kycPayload = kycRes.success ? (kycRes.data?.data || kycRes.data || {}) : {};
      const kycDocuments = Array.isArray(kycPayload)
        ? kycPayload
        : kycPayload.documents || kycPayload.kyc_documents || (kycPayload.document_type ? [kycPayload] : []);
      const bankPayload = bankRes.success ? (bankRes.data?.data || bankRes.data || {}) : {};
      const bankDetails = bankPayload.bank_details || {};
      const nomineeDetails = bankPayload.nominee_details || {};
      const bankSubmitted = hasBankSubmission(bankDetails, nomineeDetails);
      const prompts = [];
      const kycRejected = kycDocuments.some((document) => normalizeStatus(document.status) === "rejected");
      const bankRejected = normalizeStatus(
        bankDetails.bank_status || bankDetails.status || bankPayload.bank_status || bankPayload.status
      ) === "rejected";

      if (!kycDocuments.length) prompts.push({ type: "kyc", status: "missing" });
      else if (kycRejected) prompts.push({ type: "kyc", status: "rejected" });
      if (!bankSubmitted) prompts.push({ type: "bank", status: "missing" });
      else if (bankRejected) prompts.push({ type: "bank", status: "rejected" });
      setVerificationPrompt(prompts.length ? prompts : null);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const u = dashboardData?.user || {};
  const s = dashboardData?.summary || {};
  const r = dashboardData?.rank || {};
  const incomeChart = dashboardData?.incomeChart || [];
  const topReferrals = dashboardData?.topReferrals || [];
  const topLevelUsers = dashboardData?.topLevelUsers || [];

  const user = {
    name: u.userName || localStorage.getItem("userName") || "User",
    fullName:
      u.fullName ||
      u.full_name ||
      [u.firstName || u.first_name, u.lastName || u.last_name].filter(Boolean).join(" ") ||
      u.userName ||
      localStorage.getItem("userName") ||
      "User",
    userId: u.userId || localStorage.getItem("userId") || "FX000",
    rank: r.currentRank || "Unranked",
    nextRank: r.nextRank || "-",
    totalLots: s.totalActiveLots ?? 0,
    avatar: u.profileImage || null,
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const CHART_W = 640;
  const CHART_H = 200;
  const incomeValues = incomeChart.map((m) => m.totalIncome);
  const hasIncomeData = incomeValues.some((v) => v > 0);

  // Always render a chart shape — real income in gold, or a muted placeholder
  // shape that just previews the chart UI until real income comes in.
  const chartSourceValues = hasIncomeData ? incomeValues : INCOME_CHART_PLACEHOLDER_VALUES;
  const { line, area, points } = buildLinePath(chartSourceValues, CHART_W, CHART_H);
  const chartMonthLabels = hasIncomeData
    ? incomeChart.map((m) => m.monthName)
    : chartSourceValues.map(() => "");

  const firstIncome = incomeValues[0] ?? 0;
  const lastIncome = incomeValues[incomeValues.length - 1] ?? 0;
  const growthPct =
    firstIncome > 0
      ? Math.round(((lastIncome - firstIncome) / firstIncome) * 100)
      : lastIncome > 0
      ? 100
      : 0;

  return (
    <UserLayout user={user}>
      <div className="user-dashboard-container">
        {/* Header */}
        <div className="udb-header">
          <div>
            <div className="udb-header-title">
              <span>
                Welcome back, <span className="udb-user-name">{user.name}</span>
              </span>
              <span className="udb-wave-icon" role="img" aria-label="waving hand">
                👋
              </span>
            </div>
            <div className="udb-header-sub">
              Here's how your portfolio is performing today.
            </div>
          </div>

          <div className="udb-admin-pill">
            <FiShield className="udb-admin-icon" />
            <span>
              Signed in as <strong>{user.userId}</strong>
            </span>
          </div>

        </div>

        <div className="user-dashboard-grid">
          <div className="grid-main-column">
            {/* Hero row */}
            <div className="hero-row">
              <div
                className="hero-card investment-hover-card"
                onClick={() => {
                  setInvestmentHistoryOpen(true);
                  loadInvestmentHistory();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setInvestmentHistoryOpen(true);
                    loadInvestmentHistory();
                  }
                }}
                tabIndex={0}
                aria-label="Total active investment history"
              >
                <div className="hero-photo-badge">
                  <FiImage />
                </div>
                <div className="hero-top">
                  <span className="hero-eyebrow">
                    <span className="dot" />
                    Portfolio
                  </span>
                </div>
                <div>
                  <div className="hero-value">
                    {loading ? "…" : fmt(s.totalActiveInvestment)}
                  </div>
                  <div className="hero-label">Total Active Investment</div>
                </div>
                <button
                  type="button"
                  className="hero-invest-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate("/user/financial/investments");
                  }}
                  title="Add a new investment"
                >
                  <FiPlusCircle size={15} />
                  <span>Add Investment</span>
                </button>

                {investmentHistoryOpen && createPortal(
                  <div className="investment-history-backdrop" onClick={() => setInvestmentHistoryOpen(false)}>
                    <div className="investment-history-flyout" role="dialog" aria-modal="true" aria-label="Investment history" onClick={(event) => event.stopPropagation()}>
                      <div className="investment-history-header">
                        <strong>Investment History</strong>
                        <button
                          type="button"
                          className="investment-history-close"
                          onClick={() => setInvestmentHistoryOpen(false)}
                          aria-label="Close investment history"
                        >
                          ×
                        </button>
                      </div>

                      {investmentHistoryLoading ? (
                        <div className="investment-history-empty">Loading investments...</div>
                      ) : investmentHistory.length ? (
                        <div className="investment-history-table-wrap">
                          <table className="investment-history-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {investmentHistory.slice(0, 6).map((inv) => (
                                <tr key={inv.id ?? `${inv.investment_date}-${inv.amount}`}>
                                  <td>{formatDate(inv.investment_date)}</td>
                                  <td>
                                    <span className="investment-plan-pill">
                                      {inv.plan_name || inv.plan || "-"}
                                    </span>
                                  </td>
                                  <td className="investment-history-amount">
                                    {fmt(inv.amount)}
                                  </td>
                                  <td>
                                    <span className={`status-pill ${String(inv.investment_status || inv.approval_status || "Pending").toLowerCase()}`}>
                                      {inv.investment_status || inv.approval_status || "Pending"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="investment-history-empty">
                          No investment records yet.
                        </div>
                      )}
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              <div className="metric-card metric--mint">
                <div className="metric-card-icon">
                  <FiArrowUpRight />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Wallet Balance</span>
                  <h3 className="metric-value">
                    {loading ? "…" : fmt(s.walletBalance)}
                  </h3>
                </div>
                <button type="button" className="metric-corner-btn" title="Wallet">
                  <FiBookmark />
                </button>
              </div>

              <div className="metric-card metric--violet">
                <div className="metric-card-icon">
                  <FiTrendingUp />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Payout Amount</span>
                  <h3 className="metric-value">
                    {loading ? "…" : fmt(s.payoutAmount)}
                  </h3>
                </div>
                <button type="button" className="metric-corner-btn" title="Payouts">
                  <FiRepeat />
                </button>
              </div>

              <div className="metric-card metric--peach">
                <div className="metric-card-icon">
                  <FiLayers />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Active Lots</span>
                  <h3 className="metric-value">
                    {loading ? "…" : Number(s.totalActiveLots).toLocaleString()}
                  </h3>
                </div>
                <button type="button" className="metric-corner-btn" title="Lots">
                  <FiBriefcase />
                </button>
              </div>
            </div>

            {/* Team row */}
            <div className="team-row">
              <div className="team-card metric--green">
                <div className="metric-card-icon">
                  <FiUsers />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Total Referrals</span>
                  <h3 className="metric-value">
                    {loading ? "…" : Number(s.totalReferrals).toLocaleString()}
                  </h3>
                </div>
                <TeamSparkline />
              </div>
              <div className="team-card metric--pink">
                <div className="metric-card-icon">
                  <FiGift />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Total Level Users</span>
                  <h3 className="metric-value">
                    {loading ? "…" : Number(s.totalLevelUsers).toLocaleString()}
                  </h3>
                </div>
                <TeamSparkline />
              </div>
            </div>

            {/* Income trend */}
            <div className="panel-card income-trend-panel">
              <div className="panel-head">
                <div className="income-trend-title">
                  <div className="income-trend-icon">
                    <FiTrendingUp />
                  </div>
                  <div>
                    <h4 className="card-title">Income Trend</h4>
                    <p className="card-subtitle">
                      Monthly total income, last 6 months
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {hasIncomeData && (
                    <span
                      className={`growth-badge ${growthPct >= 0 ? "up" : "down"}`}
                    >
                      {growthPct >= 0 ? "▲" : "▼"} {Math.abs(growthPct)}%
                      <em>vs first month</em>
                    </span>
                  )}
                  <div className="panel-filter-pill">
                    <FiCalendar />
                    Last 6 Months
                    <FiChevronDown />
                  </div>
                </div>
              </div>

              {/* Chart is always shown: a muted, dashed placeholder shape before
                  the user has real income, and the real gold trend line once
                  income starts coming in. */}
              <div
                className={`income-chart-svg-wrap ${hasIncomeData ? "" : "is-placeholder"}`}
              >
                <svg
                  viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                  className="income-chart-svg"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--udb-accent)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--udb-accent)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="incomeFillMuted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--udb-chart-muted)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--udb-chart-muted)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={area}
                    fill={hasIncomeData ? "url(#incomeFill)" : "url(#incomeFillMuted)"}
                    stroke="none"
                  />
                  <path
                    d={line}
                    fill="none"
                    stroke={hasIncomeData ? "var(--udb-accent)" : "var(--udb-chart-muted)"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={hasIncomeData ? undefined : "6 6"}
                  />
                  {points.map(([x, y], i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="var(--udb-surface)"
                      stroke={hasIncomeData ? "var(--udb-accent)" : "var(--udb-chart-muted)"}
                      strokeWidth="2"
                    >
                      {hasIncomeData && incomeChart[i] && (
                        <title>
                          {incomeChart[i].monthName}: {fmt(incomeChart[i].totalIncome)}
                        </title>
                      )}
                    </circle>
                  ))}
                </svg>
                <div className="income-chart-labels">
                  {chartMonthLabels.map((label, i) => (
                    <span key={i}>{label || "\u00A0"}</span>
                  ))}
                </div>

                {!hasIncomeData && (
                  <div className="income-chart-empty-overlay">
                    <div className="empty-state-icon">
                      <FiBarChart2 />
                    </div>
                    <p className="empty-state-title">No income recorded yet</p>
                    <p className="empty-state-sub">
                      This is a preview of your income chart. Once your investments
                      start generating income, it lights up in gold with your
                      real monthly numbers.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tables row */}
            <div className="tables-row">
              <div className="table-card">
                <h4 className="card-title">Top Referrals</h4>
                <div className="table-container">
                  <table className="user-dash-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Lvl</th>
                        <th>Investment</th>
                        <th className="text-right">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topReferrals.length > 0 ? (
                        topReferrals.map((p) => (
                          <tr key={p.userId}>
                            <td>
                              <div className="user-table-cell">
                                <div className="user-table-avatar">
                                  {getInitials(p.userName)}
                                </div>
                                <div className="user-table-meta">
                                  <span className="meta-name">{p.userName}</span>
                                  <span className="meta-id">{p.userId}</span>
                                </div>
                              </div>
                            </td>
                            <td>{p.level}</td>
                            <td className="earnings-val">
                              {fmt(p.totalInvestment)}
                            </td>
                            <td className="text-right date-cell">
                              {formatDate(p.dateOfJoin)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center muted-row">
                            No referrals yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="table-card">
                <h4 className="card-title">Top Level Users</h4>
                <div className="table-container">
                  <table className="user-dash-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Lvl</th>
                        <th>Investment</th>
                        <th className="text-right">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topLevelUsers.length > 0 ? (
                        topLevelUsers.map((p) => (
                          <tr key={p.userId}>
                            <td>
                              <div className="user-table-cell">
                                <div className="user-table-avatar">
                                  {getInitials(p.userName)}
                                </div>
                                <div className="user-table-meta">
                                  <span className="meta-name">{p.userName}</span>
                                  <span className="meta-id">{p.userId}</span>
                                </div>
                              </div>
                            </td>
                            <td>{p.level}</td>
                            <td className="earnings-val">
                              {fmt(p.totalInvestment)}
                            </td>
                            <td className="text-right date-cell">
                              {formatDate(p.dateOfJoin)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center muted-row">
                            No level users yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-side-column">
            <UserRankCard user={user} />
          </div>
        </div>

        {verificationPrompt && (
          <div className="udb-verification-backdrop">
            <section className="udb-verification-modal" role="dialog" aria-modal="true" aria-labelledby="verification-modal-title">
              <div className="udb-verification-header">
                <div>
                  <span className="udb-verification-icon-badge">
                    <FiShield />
                  </span>
                  <span className="udb-verification-kicker">Account setup</span>
                  <h2 id="verification-modal-title">Complete your account</h2>
                  <p>Please submit the following details to use all account features.</p>
                </div>
                <button
                  type="button"
                  className="udb-verification-close"
                  onClick={() => setVerificationPrompt(null)}
                  aria-label="Close account setup reminder"
                >
                  ×
                </button>
              </div>
              <div className="udb-verification-actions">
                {verificationPrompt.some((item) => item.type === "kyc") && (
                  <button type="button" className="udb-verification-action" onClick={() => navigate("/user/account/kyc")}>
                    <span className="udb-verification-action-icon">
                      <FiShield />
                    </span>
                    <span className="udb-verification-action-text">
                      <strong>{verificationPrompt.find((item) => item.type === "kyc")?.status === "rejected" ? "KYC rejected - upload again" : "Upload KYC documents"}</strong>
                      <small>Aadhaar and PAN verification</small>
                    </span>
                    <span className="udb-verification-action-arrow" aria-hidden="true">→</span>
                  </button>
                )}
                {verificationPrompt.some((item) => item.type === "bank") && (
                  <button type="button" className="udb-verification-action" onClick={() => navigate("/user/account/bank-details")}>
                    <span className="udb-verification-action-icon">
                      <FiBookmark />
                    </span>
                    <span className="udb-verification-action-text">
                      <strong>{verificationPrompt.find((item) => item.type === "bank")?.status === "rejected" ? "Bank details rejected - submit again" : "Submit bank details"}</strong>
                      <small>Bank and nominee information</small>
                    </span>
                    <span className="udb-verification-action-arrow" aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </section>
          </div>
        )}
      </div>

    </UserLayout>
  );
}

export default UserDashboard;