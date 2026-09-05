import { useEffect, useMemo, useState } from "react";
import UserLayout from "../../components/User/UserLayout";
import { getAllUserRankSettingsApi, getRankHoldersApi } from "../../api/user-rank";

function RankAchieversPage() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRankId, setSelectedRankId] = useState(null);
  const [holders, setHolders] = useState([]);
  const [holdersLoading, setHoldersLoading] = useState(false);

  const userId = useMemo(() => localStorage.getItem("userId") || "FX001", []);
  const userName = useMemo(() => localStorage.getItem("userName") || "User", []);

  useEffect(() => {
    const loadRanks = async () => {
      setLoading(true);
      setError("");

      const res = await getAllUserRankSettingsApi();

      if (res.success) {
        const rankList = Array.isArray(res.data) ? res.data : [];
        setRanks(rankList);
        if (rankList.length > 0) {
          setSelectedRankId(rankList[0].id ?? null);
        }
      } else {
        setError(res.error || "Unable to load rank settings.");
      }

      setLoading(false);
    };

    loadRanks();
  }, []);

  useEffect(() => {
    if (!selectedRankId) {
      setHolders([]);
      return;
    }

    const loadHolders = async () => {
      setHoldersLoading(true);
      const res = await getRankHoldersApi(selectedRankId);
      if (res.success) {
        setHolders(Array.isArray(res.data) ? res.data : []);
      } else {
        setHolders([]);
      }
      setHoldersLoading(false);
    };

    loadHolders();
  }, [selectedRankId]);

  const selectedRank = ranks.find((item) => item.id === selectedRankId) || ranks[0] || null;

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page" style={{ gap: "18px" }}>
        <div className="page-header">
          <h1 className="page-title">Rank Achievers</h1>
        </div>

        <div className="ewallet-table-card">
          <div className="empty-cell" style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)" }}>
            Update soon — we will wire this up later.
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default RankAchieversPage;
