"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { formatDate, formatDiscount, getStatusPill } from "./couponUtils";

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#4A5568] mb-1">{label}</p>
      <p className="text-sm font-medium text-[#1A202C]">{value}</p>
    </div>
  );
}

export default function CouponOverviewCard({ coupon }) {
  const usageLabel = `${coupon.usedCount ?? 0} / ${coupon.usageLimit ?? "Unlimited"}`;

  return (
    <div className="bg-white rounded-2xl border border-[#CBD5E0] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#4A5568] mb-1">Coupon Code</p>
          <h2 className="text-2xl font-bold text-[#0B1E3F] uppercase tracking-wide">{coupon.code}</h2>
          <p className="text-xs text-[#4A5568] mt-1">ID: #{coupon.id}</p>
        </div>

        <span className={getStatusPill(coupon.isActive)}>
          {coupon.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {coupon.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <InfoItem label="Discount" value={formatDiscount(coupon.discountType, coupon.discountValue)} />
        <InfoItem label="Discount Type" value={coupon.discountType === "percentage" ? "Percentage" : "Fixed"} />
        <InfoItem label="Usage" value={usageLabel} />
        <InfoItem label="Valid Until" value={coupon.validUntil ? formatDate(coupon.validUntil) : "No expiry"} />
        <InfoItem label="Created" value={formatDate(coupon.createdAt)} />
        <InfoItem label="Updated" value={formatDate(coupon.updatedAt)} />
      </div>
    </div>
  );
}
