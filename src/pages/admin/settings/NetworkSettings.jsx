import { useState } from "react";
import { FiShare2, FiBarChart2, FiDatabase, FiUsers } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminSettings.css";

function NetworkSettings() {
  const [activeTab, setActiveTab] = useState("binaryMatching");

  // State for Club Matching Bonus Settings
  const [matchingBonus, setMatchingBonus] = useState("4.00");
  const [bonusCapping, setBonusCapping] = useState("5000.00");

  // State for Rank Settings — one entry per rank
  const [rankSettings, setRankSettings] = useState([
    { id: 1, name: "Investor",        personalVolume: "100.00",  groupVolume: "0.00"     },
    { id: 2, name: "FX Starter",      personalVolume: "200.00",  groupVolume: "500.00"   },
    { id: 3, name: "FX Explorer",     personalVolume: "500.00",  groupVolume: "2000.00"  },
    { id: 4, name: "FX Creator",      personalVolume: "1000.00", groupVolume: "5000.00"  },
    { id: 5, name: "FX Innovator",    personalVolume: "2000.00", groupVolume: "10000.00" },
    { id: 6, name: "FX Hero",         personalVolume: "5000.00", groupVolume: "25000.00" },
    { id: 7, name: "FX Legend",       personalVolume: "7500.00", groupVolume: "50000.00" },
    { id: 8, name: "FX Elite Member", personalVolume: "10000.00","groupVolume": "100000.00"},
    { id: 9, name: "FX Champion",     personalVolume: "15000.00","groupVolume": "200000.00"},
    { id: 10, name: "FX Royal",       personalVolume: "25000.00","groupVolume": "500000.00"},
  ]);

  const handleRankChange = (id, field, value) => {
    setRankSettings(prev =>
      prev.map(r => r.id === id ? { ...r, [field]: value } : r)
    );
  };

  // State for Investment & Payout — Network member investment
  const [netMinInvest, setNetMinInvest] = useState("5000.00");
  const [netMultipleOf, setNetMultipleOf] = useState("5000.00");
  const [netMonthlyInterest, setNetMonthlyInterest] = useState("14.00");
  const [netDurationMonths, setNetDurationMonths] = useState("10");
  const [netPayoutSchedule, setNetPayoutSchedule] = useState([
    { fromDay: "1",  toDay: "10", payoutDay: "10" },
    { fromDay: "11", toDay: "20", payoutDay: "25" },
    { fromDay: "21", toDay: "25", payoutDay: "25" },
  ]);

  // State for Investment & Payout — Holding Tank member investment
  const [htMinInvest, setHtMinInvest] = useState("5000.00");
  const [htMultipleOf, setHtMultipleOf] = useState("5000.00");
  const [htMonthlyInterest, setHtMonthlyInterest] = useState("14.00");
  const [htDurationMonths, setHtDurationMonths] = useState("10");
  const [htWeeklyInterest, setHtWeeklyInterest] = useState("7.00");
  const [htWeeklyDuration, setHtWeeklyDuration] = useState("53");
  const [htPayoutSchedule, setHtPayoutSchedule] = useState([
    { fromDay: "1",  toDay: "10", payoutDay: "15" },
    { fromDay: "11", toDay: "20", payoutDay: "25" },
    { fromDay: "21", toDay: "31", payoutDay: "30" },
  ]);

  const handleNetPayoutChange = (idx, field, val) => setNetPayoutSchedule(prev => prev.map((r,i) => i===idx ? {...r,[field]:val} : r));
  const handleHtPayoutChange  = (idx, field, val) => setHtPayoutSchedule(prev  => prev.map((r,i) => i===idx ? {...r,[field]:val} : r));

  // State for Enrolment Commission Settings
  const [referralBonus, setReferralBonus] = useState("5.00");
  const [referralCapping, setReferralCapping] = useState("25000");

  const [updateMsg, setUpdateMsg] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    setUpdateMsg("✓ Network settings updated successfully!");
    setTimeout(() => setUpdateMsg(""), 3000);
  };

  return (
    <AdminLayout>
      <div className="admin-settings-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Network Settings</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Network Settings</span>
          </div>
        </div>

        {/* Outer White Card Container */}
        <div className="settings-main-card" style={{ gap: "0" }}>
          {/* Horizontal Sub-Tabs Header matching screenshot */}
          <div className="network-tabs-container">
            <button
              type="button"
              className={`network-tab-btn ${activeTab === "binaryMatching" ? "network-tab-btn--active" : ""}`}
              onClick={() => setActiveTab("binaryMatching")}
            >
              <FiShare2 className="network-tab-icon" />
              <span>Club Matching Bonus Settings</span>
            </button>

            <button
              type="button"
              className={`network-tab-btn ${activeTab === "rankSettings" ? "network-tab-btn--active" : ""}`}
              onClick={() => setActiveTab("rankSettings")}
            >
              <FiBarChart2 className="network-tab-icon" />
              <span>Rank Settings</span>
            </button>

            <button
              type="button"
              className={`network-tab-btn ${activeTab === "investmentPayout" ? "network-tab-btn--active" : ""}`}
              onClick={() => setActiveTab("investmentPayout")}
            >
              <FiDatabase className="network-tab-icon" />
              <span>Investment & Payout Settings</span>
            </button>

            <button
              type="button"
              className={`network-tab-btn ${activeTab === "enrolmentCommission" ? "network-tab-btn--active" : ""}`}
              onClick={() => setActiveTab("enrolmentCommission")}
            >
              <FiUsers className="network-tab-icon" />
              <span>Enrolment Commission Settings</span>
            </button>
          </div>

          {/* Sub-Tab Content: 1. Club Matching Bonus Settings (Matches Screenshot) */}
          {activeTab === "binaryMatching" && (
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="blue-bordered-card">
                <div className="card-grey-header">
                  <span className="header-col-title">Club Matching Bonus(%)</span>
                  <span className="header-col-title">Club Bonus Capping</span>
                </div>
                <div className="card-input-row">
                  <div>
                    <input
                      type="text"
                      value={matchingBonus}
                      onChange={(e) => setMatchingBonus(e.target.value)}
                      className="network-bordered-input"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={bonusCapping}
                      onChange={(e) => setBonusCapping(e.target.value)}
                      className="network-bordered-input"
                    />
                  </div>
                </div>
                <div className="card-actions-row">
                  <button type="submit" className="yellow-update-btn">
                    Update
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Sub-Tab Content: 2. Rank Settings — one row per rank */}
          {activeTab === "rankSettings" && (
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="blue-bordered-card">
                {/* Header row */}
                <div className="card-grey-header" style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}>
                  <span className="header-col-title">Rank Name</span>
                  <span className="header-col-title">Required Personal Volume</span>
                  <span className="header-col-title">Required Group Volume</span>
                </div>

                {/* One row per rank */}
                {rankSettings.map((rank) => (
                  <div
                    key={rank.id}
                    className="card-input-row"
                    style={{
                      gridTemplateColumns: "1.2fr 1fr 1fr",
                      borderBottom: "1px solid #f1f5f9",
                      paddingTop: "16px",
                      paddingBottom: "16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", fontWeight: "600", color: "#1e293b", fontSize: "13.5px" }}>
                      {rank.name}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={rank.personalVolume}
                        onChange={(e) => handleRankChange(rank.id, "personalVolume", e.target.value)}
                        className="network-bordered-input"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={rank.groupVolume}
                        onChange={(e) => handleRankChange(rank.id, "groupVolume", e.target.value)}
                        className="network-bordered-input"
                      />
                    </div>
                  </div>
                ))}

                <div className="card-actions-row">
                  <button type="submit" className="yellow-update-btn">
                    Update
                  </button>
                </div>
              </div>
            </form>
          )}


          {/* Sub-Tab Content: 3. Investment & Payout Settings */}
          {activeTab === "investmentPayout" && (
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

              {/* ── Network member investment ── */}
              <div>
                <h4 style={{ fontWeight: "700", fontSize: "15px", color: "#1e293b", marginBottom: "16px" }}>
                  Network member investment
                </h4>

                {/* 4-input row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div className="invest-field-box">
                    <label className="invest-field-label">Minimum Investment</label>
                    <input type="text" className="settings-input-control" value={netMinInvest}
                      onChange={e => setNetMinInvest(e.target.value)} />
                  </div>
                  <div className="invest-field-box">
                    <label className="invest-field-label">Multiple Of</label>
                    <input type="text" className="settings-input-control" value={netMultipleOf}
                      onChange={e => setNetMultipleOf(e.target.value)} />
                  </div>
                  <div className="invest-field-box">
                    <label className="invest-field-label">Monthly Interest Percent (%)</label>
                    <input type="text" className="settings-input-control" value={netMonthlyInterest}
                      onChange={e => setNetMonthlyInterest(e.target.value)} />
                  </div>
                  <div className="invest-field-box">
                    <label className="invest-field-label">Duration Months</label>
                    <input type="text" className="settings-input-control" value={netDurationMonths}
                      onChange={e => setNetDurationMonths(e.target.value)} />
                  </div>
                </div>

                {/* Payout Schedule */}
                <h4 style={{ fontWeight: "700", fontSize: "14px", color: "#1e293b", marginBottom: "12px" }}>Payout Schedule</h4>
                <div className="payout-schedule-table">
                  <div className="payout-table-header">
                    <span>From-Day</span><span>To-Day</span><span>Payout-Day</span>
                  </div>
                  {netPayoutSchedule.map((row, idx) => (
                    <div key={idx} className="payout-table-row">
                      <input type="text" className="payout-table-input" value={row.fromDay}
                        onChange={e => handleNetPayoutChange(idx, "fromDay", e.target.value)} />
                      <input type="text" className="payout-table-input" value={row.toDay}
                        onChange={e => handleNetPayoutChange(idx, "toDay",  e.target.value)} />
                      <input type="text" className="payout-table-input" value={row.payoutDay}
                        onChange={e => handleNetPayoutChange(idx, "payoutDay", e.target.value)} />
                    </div>
                  ))}
                </div>

                {/* Update button aligned right */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  <button type="submit" className="yellow-update-btn">Update</button>
                </div>
              </div>

              {/* ── Holding Tank member investment ── */}
              <div>
                <h4 style={{ fontWeight: "700", fontSize: "15px", color: "#1e293b", marginBottom: "16px" }}>
                  Holding Tank member investment
                </h4>

                {/* 6-input grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div className="invest-field-box">
                    <label className="invest-field-label">Minimum Investment</label>
                    <input type="text" className="settings-input-control" value={htMinInvest}
                      onChange={e => setHtMinInvest(e.target.value)} />
                  </div>
                  <div className="invest-field-box">
                    <label className="invest-field-label">Multiple Of</label>
                    <input type="text" className="settings-input-control" value={htMultipleOf}
                      onChange={e => setHtMultipleOf(e.target.value)} />
                  </div>
                  <div className="invest-field-box">
                    <label className="invest-field-label">Monthly Interest Percent (%)</label>
                    <input type="text" className="settings-input-control" value={htMonthlyInterest}
                      onChange={e => setHtMonthlyInterest(e.target.value)} />
                  </div>
                  <div className="invest-field-box">
                    <label className="invest-field-label">Duration Months</label>
                    <input type="text" className="settings-input-control" value={htDurationMonths}
                      onChange={e => setHtDurationMonths(e.target.value)} />
                  </div>
                  <div className="invest-field-box">
                    <label className="invest-field-label">Weekly Interest Percent</label>
                    <input type="text" className="settings-input-control" value={htWeeklyInterest}
                      onChange={e => setHtWeeklyInterest(e.target.value)} />
                  </div>
                  <div className="invest-field-box">
                    <label className="invest-field-label">Weekly Duration</label>
                    <input type="text" className="settings-input-control" value={htWeeklyDuration}
                      onChange={e => setHtWeeklyDuration(e.target.value)} />
                  </div>
                </div>

                {/* Payout Schedule */}
                <h4 style={{ fontWeight: "700", fontSize: "14px", color: "#1e293b", marginBottom: "12px" }}>Payout Schedule</h4>
                <div className="payout-schedule-table">
                  <div className="payout-table-header">
                    <span>From-Day</span><span>To-Day</span><span>Payout-Day</span>
                  </div>
                  {htPayoutSchedule.map((row, idx) => (
                    <div key={idx} className="payout-table-row">
                      <input type="text" className="payout-table-input" value={row.fromDay}
                        onChange={e => handleHtPayoutChange(idx, "fromDay",   e.target.value)} />
                      <input type="text" className="payout-table-input" value={row.toDay}
                        onChange={e => handleHtPayoutChange(idx, "toDay",     e.target.value)} />
                      <input type="text" className="payout-table-input" value={row.payoutDay}
                        onChange={e => handleHtPayoutChange(idx, "payoutDay", e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* Sub-Tab Content: 4. Enrolment Commission Settings */}
          {activeTab === "enrolmentCommission" && (
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="blue-bordered-card">
                {/* Header row */}
                <div className="card-grey-header">
                  <span className="header-col-title">Referral Bonus (%)</span>
                  <span className="header-col-title">Referral Bonus Capping</span>
                </div>

                {/* Input row */}
                <div className="card-input-row">
                  <div>
                    <input
                      type="text"
                      value={referralBonus}
                      onChange={(e) => setReferralBonus(e.target.value)}
                      className="network-bordered-input"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={referralCapping}
                      onChange={(e) => setReferralCapping(e.target.value)}
                      className="network-bordered-input"
                    />
                  </div>
                </div>

                <div className="card-actions-row">
                  <button type="submit" className="yellow-update-btn">Update</button>
                </div>
              </div>
            </form>
          )}

          {updateMsg && (
            <div style={{ color: "#16a34a", fontSize: "14px", fontWeight: "600", marginTop: "16px" }}>
              {updateMsg}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default NetworkSettings;
