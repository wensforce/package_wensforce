"use client";

import { useRouter } from "next/navigation";
import { Car, ExternalLink, Package, Shield, UserRound } from "lucide-react";
import {
  formatDate,
  formatMoney,
  getDaysLeftMeta,
  getStatusUI,
} from "./subscriptionUtils";

function Row({ label, value, mono = false, valueClassName = "" }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#4A5568] mb-1">
        {label}
      </p>
      <p
        className={`text-sm text-[#1A202C] ${mono ? "font-mono" : "font-medium"} ${valueClassName}`}
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

export default function SubscriptionOverviewCard({ subscription }) {
  const router = useRouter();
  const status = getStatusUI(subscription.status);
  const daysMeta = getDaysLeftMeta(subscription.endDate);
  const services = Array.isArray(subscription.services)
    ? subscription.services
    : [];
  const totalServiceAvailability = services.reduce(
    (sum, service) => sum + Number(service?.count ?? 0),
    0,
  );

  return (
    <div className="bg-white rounded-2xl border border-[#CBD5E0] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#4A5568] mb-1">Subscription</p>
          <h2 className="text-2xl font-bold text-[#0B1E3F]">
            #{subscription.id}
          </h2>
          <p
            className={`text-xs mt-1 ${daysMeta.className}`}
            title={daysMeta.title}
          >
            Days left: {daysMeta.text}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}
        >
          {status.icon} {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <SectionCard icon={<Car size={16} />} title="Subscription Plan">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Row
              label="Start Date"
              value={formatDate(subscription.startDate)}
            />
            <Row label="End Date" value={formatDate(subscription.endDate)} />
            <Row
              label="Trips"
              value={`${subscription.tripsUsed ?? 0} / ${subscription.tripsTotal ?? 0}`}
            />
            <Row
              label="Payment ID"
              value={subscription.paymentId || "-"}
              mono
            />

            <Row label="Vehicle Type" value={subscription.vehicleType || "-"} />
            <Row
              label="Bodyguard Type"
              value={subscription.bodyguardType || "-"}
            />
            <Row label="Verified By" value={subscription.verifiedBy || "-"} />
            <Row
              label="Verified At"
              value={formatDate(subscription.verifiedAt)}
            />
          </div>
          <Row
            label="Admin Remarks"
            value={subscription.adminRemarks || "-"}
            valueClassName="whitespace-pre-wrap"
          />
        </SectionCard>

        <SectionCard
          icon={<Shield size={16} />}
          title="Included Services"
          actions={
            <span className="text-xs font-semibold text-[#4A5568]">
              {services.length} service{services.length !== 1 ? "s" : ""} |{" "}
              {totalServiceAvailability} available
            </span>
          }
        >
          {services.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#CBD5E0] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FAF6EC] border-b border-[#CBD5E0]">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                      #
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                      Title
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                      Available
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                      Description
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD5E0]">
                  {services.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-[#FAF6EC]/70 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs font-mono text-[#0B1E3F]">
                        #{service.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-[#1A202C]">
                        {service.title || "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#4A5568] whitespace-nowrap">
                        {Number(service.count ?? 0)} available
                      </td>
                      <td className="px-4 py-3 text-xs text-[#4A5568]">
                        {service.description || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {service.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-200 text-gray-700">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-[#4A5568]">
              No services are linked with this subscription.
            </p>
          )}
        </SectionCard>

        <SectionCard
          icon={<UserRound size={16} />}
          title="User Details"
          actions={
            <button
              onClick={() => router.push("/admin/users")}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-[#CBD5E0] bg-white text-[#4A5568] hover:text-[#0B1E3F] hover:bg-[#FAF6EC] transition-colors"
            >
              <ExternalLink size={12} /> View User
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Row
              label="User ID"
              value={subscription.user?.id ?? subscription.userId ?? "-"}
              mono
            />
            <Row label="Name" value={subscription.user?.name || "-"} />
            <Row label="Email" value={subscription.user?.email || "-"} />
            <Row
              label="Mobile Number"
              value={subscription.user?.mobileNumber || "-"}
              mono
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={<Package size={16} />}
          title="Package Details"
          actions={
            subscription.packageId ? (
              <button
                onClick={() =>
                  router.push(`/admin/packages/${subscription.packageId}`)
                }
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-[#CBD5E0] bg-white text-[#4A5568] hover:text-[#0B1E3F] hover:bg-[#FAF6EC] transition-colors"
              >
                <ExternalLink size={12} /> View Package
              </button>
            ) : null
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Row
              label="Package"
              value={
                subscription.package?.name ||
                `#${subscription.packageId ?? "-"}`
              }
            />
            <Row
              label="Regular Price"
              value={formatMoney(subscription.package?.regularPrice)}
            />
            <Row
              label="Discounted Price"
              value={formatMoney(subscription.package?.discountedPrice)}
            />
            <Row
              label="Package ID"
              value={subscription.packageId ?? "-"}
              mono
            />
          </div>
          <Row
            label="Description"
            value={subscription.package?.description || "-"}
            valueClassName="whitespace-pre-wrap"
          />
        </SectionCard>
      </div>
    </div>
  );
}
