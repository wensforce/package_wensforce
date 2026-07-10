"use client";

import { useRouter } from "next/navigation";
import { CreditCard, ExternalLink, Repeat, UserRound } from "lucide-react";
import { formatDate, formatMoney, getStatusUI } from "./userUtils";

function Row({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#4A5568] mb-1">
        {label}
      </p>
      <p
        className={`text-sm text-[#1A202C] ${mono ? "font-mono" : "font-medium"}`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionCard({ icon, title, children, actions }) {
  return (
    <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]/40 p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E0] text-[#0B1E3F] inline-flex items-center justify-center">
            {icon}
          </span>
          <h3 className="text-sm font-semibold text-[#0B1E3F] uppercase tracking-wide">
            {title}
          </h3>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export default function UserOverviewCard({ user }) {
  const router = useRouter();
  const orders = Array.isArray(user.orders) ? user.orders : [];
  const subscriptions = Array.isArray(user.subscriptions)
    ? user.subscriptions
    : [];

  return (
    <div className="bg-white rounded-2xl border border-[#CBD5E0] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#4A5568] mb-1">User</p>
          <h2 className="text-2xl font-bold text-[#0B1E3F]">
            {user.name || "Unnamed User"}
          </h2>
          <p className="text-xs text-[#4A5568] mt-1">ID: #{user.id}</p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E9F2FF] text-[#0B1E3F] uppercase">
          {user.role || "user"}
        </span>
      </div>

      <SectionCard icon={<UserRound size={16} />} title="Profile">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Row label="Name" value={user.name || "-"} />
          <Row label="Email" value={user.email || "-"} />
          <Row label="Mobile Number" value={user.mobileNumber || "-"} mono />
          <Row label="City" value={user.city || "-"} />
          <Row label="Role" value={user.role || "-"} />
          <Row label="Created" value={formatDate(user.createdAt)} />
          <Row label="Updated" value={formatDate(user.updatedAt)} />
        </div>
      </SectionCard>

      <SectionCard
        icon={<CreditCard size={16} />}
        title="Orders"
        actions={
          <span className="text-xs font-semibold text-[#4A5568]">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        }
      >
        {orders.length === 0 ? (
          <p className="text-sm text-[#4A5568]">
            No orders found for this user.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#CBD5E0] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF6EC] border-b border-[#CBD5E0]">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    #
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Amount
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Final
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Status
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Created
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Open
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E0]">
                {orders.map((order) => {
                  const status = getStatusUI(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#FAF6EC]/70 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs font-mono text-[#0B1E3F]">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#4A5568]">
                        {formatMoney(order.amount)}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#0B1E3F]">
                        {formatMoney(order.finalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}
                        >
                          {status.icon} {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#4A5568] whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            router.push(`/admin/payments/${order.id}`)
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-[#CBD5E0] bg-white text-[#4A5568] hover:text-[#0B1E3F] hover:bg-[#FAF6EC] transition-colors"
                        >
                          <ExternalLink size={12} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        icon={<Repeat size={16} />}
        title="Subscriptions"
        actions={
          <span className="text-xs font-semibold text-[#4A5568]">
            {subscriptions.length} subscription
            {subscriptions.length !== 1 ? "s" : ""}
          </span>
        }
      >
        {subscriptions.length === 0 ? (
          <p className="text-sm text-[#4A5568]">
            No subscriptions found for this user.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#CBD5E0] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF6EC] border-b border-[#CBD5E0]">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    #
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Package
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Trips
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Status
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Open
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E0]">
                {subscriptions.map((sub) => {
                  const status = getStatusUI(sub.status);
                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-[#FAF6EC]/70 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs font-mono text-[#0B1E3F]">
                        #{sub.id}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#4A5568]">
                        #{sub.packageId}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#4A5568]">
                        {sub.tripsUsed ?? 0} / {sub.tripsTotal ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}
                        >
                          {status.icon} {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            router.push(`/admin/subscriptions/${sub.id}`)
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-[#CBD5E0] bg-white text-[#4A5568] hover:text-[#0B1E3F] hover:bg-[#FAF6EC] transition-colors"
                        >
                          <ExternalLink size={12} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
