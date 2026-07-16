"use client";

import { useEffect, useState } from "react";
import { dashboardApi } from "./apis/dashboard.api";
import {
  TrendingUp,
  DollarSign,
  Users as UsersIcon,
  ShoppingBag,
  Calendar,
  Percent,
  RefreshCw,
  AlertCircle,
  Package as PackageIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";

// Colors matching design system:
// Navy: #0B1E3F
// Navy Light: #1E3A6F
// Gold: #C9A24B
// Gold Light: #F5E6BD
// Cream: #FAF6EC
// Success: #2F855A
// Danger: #9B2C2C
const COLORS = ["#0B1E3F", "#C9A24B", "#2F855A", "#9B2C2C", "#1E3A6F", "#F5E6BD"];

const STATUS_COLORS = {
  active: "#2F855A",
  pending: "#C9A24B",
  expired: "#4A5568",
  cancelled: "#9B2C2C",
  completed: "#2F855A",
  requested: "#1E3A6F",
  confirmed: "#C9A24B",
  initiated: "#A0AEC0",
  failed: "#9B2C2C",
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.fetchAdminDashboard();
      if (res) {
        setData(res);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching dashboard statistics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C9A24B] border-solid"></div>
        <p className="text-[#0B1E3F] font-medium text-sm animate-pulse">Loading dashboard analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <AlertCircle className="w-12 h-12 text-[#9B2C2C] mb-4" />
        <h3 className="text-lg font-semibold text-[#0B1E3F] mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 max-w-md mb-6">{error}</p>
        <button
          onClick={() => loadData()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C9A24B] text-[#0B1E3F] font-medium hover:bg-[#a88000] transition-colors shadow-md"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  const stats = data?.stats || {};
  const trends = data?.trends || [];
  const subscriptionStatusData = data?.subscriptionStatus || [];
  const tripStatusData = data?.tripStatus || [];
  const bookingStatusData = data?.bookingStatus || [];
  const packagePopularity = data?.packagePopularity || [];
  const couponUsage = data?.couponUsage || [];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#FAF6EC] min-h-screen text-[#1A202C]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif-display text-[#0B1E3F]">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time business performance metrics and platform analytics.
          </p>
        </div>
        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 self-start px-4 py-2 rounded-lg bg-white border border-gray-200 text-[#0B1E3F] text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-bold text-[#0B1E3F] mt-1">{formatCurrency(stats.totalRevenue)}</h3>
            </div>
            <div className="p-3 bg-[#F5E6BD] text-[#C9A24B] rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
            <TrendingUp size={14} className="mr-1" /> Verified PAID Orders
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A24B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Subscriptions</p>
              <h3 className="text-2xl font-bold text-[#0B1E3F] mt-1">{stats.activeSubscriptions}</h3>
            </div>
            <div className="p-3 bg-[#EAF2FF] text-[#1E3A6F] rounded-lg">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Total registered: {stats.activeSubscriptions + (subscriptionStatusData.reduce((acc, curr) => acc + (curr.status !== 'active' ? curr.count : 0), 0) || 0)}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E3A6F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-2xl font-bold text-[#0B1E3F] mt-1">{stats.totalBookings}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Pending / In-progress client bookings
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>

        {/* Users */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</p>
              <h3 className="text-2xl font-bold text-[#0B1E3F] mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <UsersIcon size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Active consumers of the platform
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>

      {/* Grid: Revenue Trend & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue and Orders Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0B1E3F]">Revenue & Orders (Last 6 Months)</h3>
            <p className="text-xs text-gray-500">Monthly revenue compared with order frequency.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A24B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C9A24B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? formatCurrency(value) : value,
                    name === "revenue" ? "Revenue" : "Orders"
                  ]}
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                />
                <Legend iconType="circle" />
                <Area name="revenue" type="monotone" dataKey="revenue" stroke="#C9A24B" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area name="orders" type="monotone" dataKey="orders" stroke="#0B1E3F" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0B1E3F]">User Growth (Last 6 Months)</h3>
            <p className="text-xs text-gray-500">New user sign-ups trends.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A6F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1E3A6F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                <Legend iconType="circle" />
                <Area name="users" type="monotone" dataKey="users" stroke="#1E3A6F" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Subscriptions Distribution & Booking/Trip Statuses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscriptions Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0B1E3F]">Subscription Statuses</h3>
            <p className="text-xs text-gray-500">Distribution of subscriptions by active status.</p>
          </div>
          {subscriptionStatusData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm py-12">
              No subscription data available.
            </div>
          ) : (
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-6">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subscriptionStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="status"
                    >
                      {subscriptionStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status.toLowerCase()] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {subscriptionStatusData.map((item, index) => (
                  <div key={item.status} className="flex items-center gap-2.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[item.status.toLowerCase()] || COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs font-semibold capitalize text-gray-700">{item.status}:</span>
                    <span className="text-xs text-gray-500 font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Trips Statuses Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0B1E3F]">Trips & Bookings Breakdown</h3>
            <p className="text-xs text-gray-500">Aggregated status of requested bookings and logistics.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#0B1E3F] block uppercase tracking-wider border-b pb-1">Trips ({tripStatusData.reduce((a, b) => a + b.count, 0)})</span>
              {tripStatusData.length === 0 ? (
                <p className="text-xs text-gray-400">No trips data</p>
              ) : (
                <div className="space-y-2">
                  {tripStatusData.map((item) => (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="capitalize text-gray-600">{item.status}</span>
                        <span className="text-gray-900 font-bold">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${(item.count / Math.max(1, tripStatusData.reduce((a, b) => a + b.count, 0))) * 100}%`,
                            backgroundColor: STATUS_COLORS[item.status.toLowerCase()] || "#C9A24B"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-[#0B1E3F] block uppercase tracking-wider border-b pb-1">Bookings ({bookingStatusData.reduce((a, b) => a + b.count, 0)})</span>
              {bookingStatusData.length === 0 ? (
                <p className="text-xs text-gray-400">No bookings data</p>
              ) : (
                <div className="space-y-2">
                  {bookingStatusData.map((item) => (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="capitalize text-gray-600">{item.status}</span>
                        <span className="text-gray-900 font-bold">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${(item.count / Math.max(1, bookingStatusData.reduce((a, b) => a + b.count, 0))) * 100}%`,
                            backgroundColor: STATUS_COLORS[item.status.toLowerCase()] || "#0B1E3F"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Package Popularity & Coupon Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Packages */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0B1E3F] flex items-center gap-2">
              <PackageIcon size={18} className="text-[#C9A24B]" />
              Popular Packages
            </h3>
            <p className="text-xs text-gray-500">Top packages sorted by active subscription counts.</p>
          </div>
          {packagePopularity.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-gray-400 text-sm py-8">
              No packages subscription data found.
            </div>
          ) : (
            <div className="flex-grow space-y-4">
              {packagePopularity.map((pkg, idx) => {
                const maxSubs = Math.max(1, packagePopularity[0].subscriptions);
                const percent = (pkg.subscriptions / maxSubs) * 100;
                return (
                  <div key={pkg.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="text-[#C9A24B] font-bold">#{idx + 1}</span>
                        <span className="text-[#0B1E3F]">{pkg.name}</span>
                      </div>
                      <span className="text-gray-500 font-bold">{pkg.subscriptions} subs</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#0B1E3F] to-[#C9A24B] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Coupons Usage */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0B1E3F] flex items-center gap-2">
              <Percent size={18} className="text-emerald-600" />
              Active Coupon Usage
            </h3>
            <p className="text-xs text-gray-500">Most active coupon codes and redemption count.</p>
          </div>
          {couponUsage.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-gray-400 text-sm py-8">
              No coupons found.
            </div>
          ) : (
            <div className="flex-grow divide-y divide-gray-100">
              {couponUsage.map((coupon) => (
                <div key={coupon.code} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <span className="font-mono text-xs font-bold bg-[#FAF6EC] text-[#0B1E3F] px-2.5 py-1 rounded border border-[#F5E6BD]">
                      {coupon.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-800">{coupon.usedCount} redemptions</span>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      coupon.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500"
                    }`}>
                      {coupon.isActive ? "Active" : "Expired"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Info Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#0B1E3F]">Data Accuracy & Sync</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            This dashboard aggregates verified entries. Non-activated subscriptions and unpaid orders are excluded from totals.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            <span className="block text-xs font-bold text-[#0B1E3F]">{stats.totalPackages}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Packages</span>
          </div>
          <div className="text-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            <span className="block text-xs font-bold text-[#0B1E3F]">{stats.totalServices}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Services</span>
          </div>
          <div className="text-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            <span className="block text-xs font-bold text-[#0B1E3F]">{stats.totalCoupons}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Coupons</span>
          </div>
        </div>
      </div>
    </div>
  );
}
