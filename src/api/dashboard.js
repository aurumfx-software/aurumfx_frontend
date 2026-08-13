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

// Default fallback data for User Dashboard matching app screenshot design
const MOCK_USER_DASHBOARD = {
  user: {
    name: "PRAVEEN",
    fullName: "PRAVEEN DINESH",
    userId: "FX001",
    rank: "FX Hero",
    nextRank: "FX Legend",
    totalLots: 1,
    referralLink: "https://app.aurumfx.net/auth/register?ref=FX001",
  },
  financials: {
    income: 241550,
    withdrawals: 233900,
    balance: 7650,
  },
  networkStats: {
    downlineClubUserCount: 258,
    totalEnrolments: 9,
  },
  networkChartData: [
    { month: "Jan 2026", val: 0.1 },
    { month: "Feb 2026", val: 0.8 },
    { month: "Mar 2026", val: 2.0 },
    { month: "Apr 2026", val: 0.2 },
    { month: "May 2026", val: 0.1 },
    { month: "Jul 2026", val: 0.1 },
  ],
  enrolments: [
    { id: 1, user: "SUSHI", userId: "FX150", date: "17 Mar 2026", avatarBg: "#3498db" },
    { id: 2, user: "MANUJA", userId: "FX144", date: "09 Mar 2026", avatarBg: "#2c3e50" },
    { id: 3, user: "BINDU", userId: "FX125", date: "11 Feb 2026", avatarBg: "#7f8c8d" },
    { id: 4, user: "SURESHKUMAR", userId: "FX056", date: "29 Dec 2025", avatarBg: "#e67e22" },
    { id: 5, user: "VIMAL", userId: "FX055", date: "29 Dec 2025", avatarBg: "#8e44ad" },
  ],
  teamPerformance: [
    { id: 1, user: "AJAYAKUMAR", userId: "FX021", enrolments: 20, earnings: 72500 },
    { id: 2, user: "SAVITHAMOL", userId: "FX011", enrolments: 8, earnings: 127000 },
    { id: 3, user: "BINDU", userId: "FX125", enrolments: 2, earnings: 15000 },
    { id: 4, user: "SOBHANA", userId: "FX018", enrolments: 0, earnings: 0 },
    { id: 5, user: "AKSHAYA", userId: "FX023", enrolments: 0, earnings: 0 },
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

      const data = payload?.data || payload;
      const resData = { success: true, data };
      userCache.data = resData;
      userCache.timestamp = Date.now();
      return resData;
    } catch (error) {
      console.error("User Dashboard API error:", error.message);
      const errRes = { success: false, error: error.response?.data?.message || error.message };
      userCache.data = errRes;
      userCache.timestamp = Date.now();
      return errRes;
    } finally {
      userInFlight = null;
    }
  })();

  return userInFlight;
};
