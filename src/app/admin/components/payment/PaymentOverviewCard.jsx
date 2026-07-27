"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, Package, UserRound, Wallet } from "lucide-react";
import { getStatusUI, formatDate, formatMoney } from "./paymentUtils";

function Row({ label, value, mono = false, valueClassName = "" }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#4A5568] mb-1">
        {label}
      </p>
      <p
        className={`text-sm text-[#1A202C] break-all ${mono ? "font-mono" : "font-medium"} ${valueClassName}`}
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

export default function PaymentOverviewCard({ payment }) {
  const router = useRouter();
  const status = getStatusUI(payment.status);

  return (
    <div className="bg-white rounded-2xl border border-[#CBD5E0] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#4A5568] mb-1">Payment</p>
          <h2 className="text-2xl font-bold text-[#0B1E3F]">#{payment.id}</h2>
          <p className="text-xs text-[#4A5568] mt-1">
            User ID: {payment.userId ?? "-"}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}
        >
          {status.icon} {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Payment Details */}
        <SectionCard icon={<Wallet size={16} />} title="Payment Details">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Row label="Amount" value={formatMoney(payment.amount)} />
            <Row label="Discount" value={formatMoney(payment.discountAmount)} />
            <Row
              label="Referral Discount"
              value={formatMoney(payment.referralDiscountAmount)}
            />
            <Row
              label="Final Amount"
              value={formatMoney(payment.finalAmount)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Row label="Coupon" value={payment.couponCode || "None"} mono />
            <Row
              label="Referral Reward"
              value={
                payment.appliedReferralRewardId
                  ? `#${payment.appliedReferralRewardId}${
                      payment.referralRewardDetails
                        ? ` (${
                            payment.referralRewardDetails.rewardCalcType === "percentage"
                              ? `${payment.referralRewardDetails.rewardValue}%`
                              : `₹${payment.referralRewardDetails.rewardValue}`
                          })`
                        : ""
                    }`
                  : "None"
              }
              mono
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Row label="Payment ID" value={payment.paymentId || "-"} mono />
            <Row
              label="Cashfree Order ID"
              value={payment.cashfreeOrderId || "-"}
              mono
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Row label="Created" value={formatDate(payment.createdAt)} />
            <Row label="Updated" value={formatDate(payment.updatedAt)} />
          </div>
        </SectionCard>

        {/* User Details */}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Row label="Name" value={payment.user?.name || "-"} />
            <Row label="Email" value={payment.user?.email || "-"} />
            <Row
              label="Mobile Number"
              value={payment.user?.mobileNumber || "-"}
              mono
            />
          </div>
        </SectionCard>

        {/* Package Details */}
        <SectionCard
          icon={<Package size={16} />}
          title="Package Details"
          actions={
            payment.packageId ? (
              <button
                onClick={() =>
                  router.push(`/admin/packages/${payment.packageId}`)
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
              value={payment.package?.name || `#${payment.packageId ?? "-"}`}
            />
            <Row
              label="Regular Price"
              value={formatMoney(payment.package?.regularPrice)}
            />
            <Row
              label="Discounted Price"
              value={formatMoney(payment.package?.discountedPrice)}
            />
            <Row label="Package ID" value={payment.packageId ?? "-"} mono />
          </div>
          <Row
            label="Description"
            value={payment.package?.description || "-"}
            valueClassName="whitespace-pre-wrap"
          />
        </SectionCard>
      </div>
    </div>
  );
}
