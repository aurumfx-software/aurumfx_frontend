import api from "./axios";

const CACHE_TTL = 5000; // 5s cache, dedupe rapid calls

const adminCache = new Map();
const adminInFlight = new Map();

const userCache = { data: null, timestamp: 0 };
let userInFlight = null;

export const clearDashboardCache = () => {
  adminCache.clear();
  adminInFlight.clear();
  userCache.data = null;
  userCache.timestamp = 0;
  userInFlight = null;
};

/**
 * Admin Dashboard fetch, deduped + cached
 * @param {{start_date?: string, end_date?: string}} filters
 */
export const getAdminDashboardData = async (filters = {}) => {
  const cacheKey = JSON.stringify(filters);
  const now = Date.now();
  const cached = adminCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  if (adminInFlight.has(cacheKey)) {
    return adminInFlight.get(cacheKey);
  }

  const requestPromise = (async () => {
    try {
      const response = await api.get(`/admin/dashboard`, {
        params: Object.fromEntries(
          Object.entries(filters).filter(([, value]) => String(value || "").trim() !== "")
        ),
      });
      const resData = { success: true, data: response.data };
      adminCache.set(cacheKey, { data: resData, timestamp: Date.now() });
      return resData;
    } catch (error) {
      console.error("Admin Dashboard API error:", error.message);
      const errRes = {
        success: false,
        error: error.response?.data?.message || error.message,
      };
      adminCache.set(cacheKey, { data: errRes, timestamp: Date.now() });
      return errRes;
    } finally {
      adminInFlight.delete(cacheKey);
    }
  })();

  adminInFlight.set(cacheKey, requestPromise);
  return requestPromise;
};

/**
 * User Dashboard fetch, deduped + cached
 * Maps GET /user/dashboard response into a flat, component-friendly shape.
 */
export const getUserDashboardData = async () => {
  const now = Date.now();
  if (userCache.data && now - userCache.timestamp < CACHE_TTL) {
    return userCache.data;
  }

  if (userInFlight) {
    return userInFlight;
  }

  userInFlight = (async () => {
    try {
      const response = await api.get(`/user/dashboard`);
      const data = response.data || {};

      const u = data.user || {};
      const s = data.summary || {};
      const r = data.rank || {};

      const normalized = {
        user: {
          userId: u.user_id || localStorage.getItem("userId") || "",
          userName: u.user_name || localStorage.getItem("userName") || "User",
          profileImage: u.profile_image || null,
        },
        summary: {
          totalActiveInvestment: Number(s.total_active_investment ?? 0),
          totalActiveLots: Number(s.total_active_lots ?? 0),
          walletBalance: Number(s.wallet_balance ?? 0),
          payoutAmount: Number(s.payout_amount ?? 0),
          totalReferrals: Number(s.total_referrals ?? 0),
          totalLevelUsers: Number(s.total_level_users ?? 0),
        },
        rank: {
          currentRank: r.current_rank || null,
          nextRank: r.next_rank || null,
        },
        incomeChart: Array.isArray(data.income_chart)
          ? data.income_chart.map((m) => ({
              label: m.label,
              monthName: m.month_name,
              referralIncome: Number(m.referral_income ?? 0),
              levelIncome: Number(m.level_income ?? 0),
              rankIncome: Number(m.rank_income ?? 0),
              totalIncome: Number(m.total_income ?? 0),
              adminFee: Number(m.admin_fee ?? 0),
              netPayable: Number(m.net_payable ?? 0),
            }))
          : [],
        topReferrals: Array.isArray(data.top_referrals)
          ? data.top_referrals.map((p) => ({
              userId: p.user_id,
              userName: p.user_name,
              profileImage: p.profile_image,
              maxInvestment: Number(p.max_investment ?? 0),
              totalInvestment: Number(p.total_investment ?? 0),
              totalLots: Number(p.total_lots ?? 0),
              level: p.level,
              dateOfJoin: p.date_of_join,
            }))
          : [],
        topLevelUsers: Array.isArray(data.top_level_users)
          ? data.top_level_users.map((p) => ({
              userId: p.user_id,
              userName: p.user_name,
              profileImage: p.profile_image,
              maxInvestment: Number(p.max_investment ?? 0),
              totalInvestment: Number(p.total_investment ?? 0),
              totalLots: Number(p.total_lots ?? 0),
              level: p.level,
              dateOfJoin: p.date_of_join,
            }))
          : [],
      };

      const resData = { success: true, data: normalized };
      userCache.data = resData;
      userCache.timestamp = Date.now();
      return resData;
    } catch (error) {
      console.error("User Dashboard API error:", error.message);
      const errRes = {
        success: false,
        error: error.response?.data?.message || error.message,
        data: {
          user: {
            userId: localStorage.getItem("userId") || "",
            userName: localStorage.getItem("userName") || "User",
            profileImage: null,
          },
          summary: {
            totalActiveInvestment: 0,
            totalActiveLots: 0,
            walletBalance: 0,
            payoutAmount: 0,
            totalReferrals: 0,
            totalLevelUsers: 0,
          },
          rank: { currentRank: null, nextRank: null },
          incomeChart: [],
          topReferrals: [],
          topLevelUsers: [],
        },
      };
      userCache.data = errRes;
      userCache.timestamp = Date.now();
      return errRes;
    } finally {
      userInFlight = null;
    }
  })();

  return userInFlight;
};