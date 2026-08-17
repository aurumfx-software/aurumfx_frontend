import api from "./axios";

// Default fallback data for Admin Dashboard if backend server is offline/not ready
const MOCK_ADMIN_DASHBOARD = {
  kpis: {
    totalNetworkBonus: 3629460,
    totalPayout: 3436610,
  },
  chartData: [
    { day: 19, value: 5000 },
    { day: 20, value: 12000 },
    { day: 21, value: 28000 },
    { day: 22, value: 40000 },
    { day: 23, value: 8000 },
    { day: 24, value: 3000 },
    { day: 25, value: 2000 },
  ],
  usersSummary: {
    totalMembers: 2,
    holdingTank: 0,
    networkMembers: 2,
  },
  ticketsSummary: {
    totalTickets: 0,
    open: 0,
    closed: 0,
  },
  latestRegistrations: [
    {
      id: 1,
      userId: "FX251",
      email: "fx251@example.com",
      enroller: "FX039",
      dateJoined: "22 Jul 2026",
      country: "IND",
    },
    {
      id: 2,
      userId: "FX252",
      email: "fx252@example.com",
      enroller: "FX039",
      dateJoined: "22 Jul 2026",
      country: "IND",
    },
  ],
};

const CACHE_TTL = 5000; // 5 seconds cache to prevent duplicate rapid requests

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
 * Fetch Admin Dashboard data from API with request deduplication & short caching
 * @param {string} timeframe - 'week' | 'month' | 'year'
 */
export const getAdminDashboardData = async (timeframe = "week") => {
  const now = Date.now();
  const cached = adminCache.get(timeframe);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  if (adminInFlight.has(timeframe)) {
    return adminInFlight.get(timeframe);
  }

  const requestPromise = (async () => {
    try {
      const response = await api.get(`/admin/dashboard`, {
        params: { timeframe },
      });
      const resData = { success: true, data: response.data };
      adminCache.set(timeframe, { data: resData, timestamp: Date.now() });
      return resData;
    } catch (error) {
        console.error("Admin Dashboard API error:", error.message);
        const errRes = { success: false, error: error.response?.data?.message || error.message };
        adminCache.set(timeframe, { data: errRes, timestamp: Date.now() });
        return errRes;
    } finally {
      adminInFlight.delete(timeframe);
    }
  })();

  adminInFlight.set(timeframe, requestPromise);
  return requestPromise;
};

/**
 * Fetch User Dashboard data from API with request deduplication & short caching
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
      const response = await api.get(`/dashboard`);
      const payload = response.data;

      if (payload && (payload.success === false || payload.status === "error" || payload.status === false)) {
        throw new Error(payload.message || "Failed to fetch dashboard data");
      }

      const data = payload?.data || payload || {};
      const normalized = {
        user_id: data.user_id || localStorage.getItem("userId") || "",
        name: data.name || localStorage.getItem("userName") || "User",
        wallet_balance: Number(data.wallet_balance ?? 0),
        total_investment: Number(data.total_investment ?? 0),
        active_investments: Number(data.active_investments ?? 0),
        level_income: Number(data.level_income ?? 0),
        referral_income: Number(data.referral_income ?? 0),
        team_members: Number(data.team_members ?? 0),
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
          user_id: localStorage.getItem("userId") || "",
          name: localStorage.getItem("userName") || "User",
          wallet_balance: 0,
          total_investment: 0,
          active_investments: 0,
          level_income: 0,
          referral_income: 0,
          team_members: 0,
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
