import { useState } from "react";
import { FiCopy, FiShare2 } from "react-icons/fi";
import trophyImg from "../../assets/goldbar.png";
import "./UserRankCard.css";

function UserRankCard({ user }) {
  const [copied, setCopied] = useState(false);

  const fullName = user?.fullName || "PRAVEEN DINESH";
  const rank = user?.rank || "FX Hero";
  const nextRank = user?.nextRank || "FX Legend";
  const totalLots = user?.totalLots || 1;
  const referralLink =
    user?.referralLink || "https://app.aurumfx.net/auth/register?ref=FX001";

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(referralLink).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="user-rank-widget">
      {/* Golden VIP Card */}
      <div className="gold-vip-card">
        <div className="gold-vip-pattern" />

        <div className="vip-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={fullName} />
          ) : (
            <div className="vip-avatar-fallback">{String(fullName || "P").charAt(0)}</div>
          )}
        </div>

        <h3 className="vip-name">{fullName}</h3>
        <span className="vip-rank">{rank}</span>

        {/* Referral URL box */}
        <div className="referral-box">
          <input type="text" readOnly value={referralLink} />
          <button
            type="button"
            className="referral-action-btn"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy Link"}
          >
            <FiCopy />
          </button>
          <button
            type="button"
            className="referral-action-btn"
            title="Share Link"
          >
            <FiShare2 />
          </button>
        </div>
      </div>

      {/* Trophy & Achievement Section */}
      <div className="trophy-section">
        <div className="trophy-graphic">
          <img src={trophyImg} alt="Trophy" className="trophy-img" />
        </div>

        <p className="achievement-title">The next level is yours to achieve!</p>
        <p className="achievement-sub">
          Reach a new rank & unlock endless possibilities.
        </p>

        <div className="rank-badges">
          <div className="rank-badge-item">
            <span className="badge-lbl">Current Rank:</span>
            <span className="badge-val">
              <span className="rank-icon">🪵</span> {rank}
            </span>
          </div>

          <div className="rank-badge-item">
            <span className="badge-lbl">Next Rank:</span>
            <span className="badge-val">
              <span className="rank-icon">🛡️</span> {nextRank}
            </span>
          </div>
        </div>

        <div className="total-lots-badge">
          <span>Total Lots:</span>
          <strong>🌲 {totalLots}</strong>
        </div>
      </div>
    </div>
  );
}

export default UserRankCard;
