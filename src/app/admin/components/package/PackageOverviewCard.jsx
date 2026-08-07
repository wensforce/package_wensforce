"use client";

import Link from "next/link";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Package,
  Shield,
  Clock,
  Route,
  Info,
  ExternalLink,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { formatPackageValidity } from "@/app/utils/formatPackageValidity";

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

function formatPrice(value) {
  if (value == null) return "—";
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function discountPct(regular, discounted) {
  if (!regular || !discounted || discounted >= regular) return null;
  return Math.round(((regular - discounted) / regular) * 100);
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PackageOverviewCard({ packageData }) {
  if (!packageData) return null;

  const pct = discountPct(
    packageData.regularPrice,
    packageData.discountedPrice,
  );

  const packageServices = Array.isArray(packageData.packageServices)
    ? packageData.packageServices
    : [];

  return (
    <div className="bg-white rounded-2xl border border-[#CBD5E0] p-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] flex items-center justify-center overflow-hidden shadow-sm">
            {packageData.thumbnailUrl ? (
              <img
                src={packageData.thumbnailUrl}
                alt={packageData.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package size={28} className="text-[#CBD5E0]" />
            )}
          </div>
          <div>
            <p className="text-xs text-[#4A5568] mb-1">Package</p>
            <h2 className="text-2xl font-bold text-[#0B1E3F]">
              {packageData.name || "Unnamed Package"}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pct && (
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0B1E3F] text-white uppercase">
              {pct}% OFF
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              packageData.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            } uppercase`}
          >
            <CheckCircle size={12} />
            {packageData.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Pricing and Basic Info */}
      <SectionCard
        icon={<DollarSign size={16} />}
        title="Pricing & Basic Information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-[#CBD5E0]/60">
          <Row
            label="Regular Price"
            value={formatPrice(packageData.regularPrice)}
          />
          <Row
            label="Discounted Price"
            value={formatPrice(packageData.discountedPrice)}
          />
          <Row label="Vehicle Type" value={packageData.vehicleType || "—"} />
          <Row
            label="Vehicle Model"
            value={
              Array.isArray(packageData.vehicleModel)
                ? packageData.vehicleModel.join(", ")
                : packageData.vehicleModel || "—"
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Row
            label="Category"
            value={
              packageData.category
                ? packageData.category.replace(/_/g, " ").toUpperCase()
                : "—"
            }
          />
          <Row label="Tags" value={packageData.tags || "—"} />
        </div>
        {packageData.description && (
          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4A5568] mb-1">
              Description
            </p>
            <p className="text-sm text-[#1A202C] font-medium leading-relaxed">
              {packageData.description}
            </p>
          </div>
        )}
      </SectionCard>

      {/* Specifications */}
      <SectionCard icon={<Shield size={16} />} title="Package Specifications">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Row
            label="Bodyguard Type"
            value={packageData.bodyguardType || "—"}
          />
          <Row label="Trips" value={packageData.trips || "—"} />
          <Row
            label="Validity"
            value={
              packageData.validity
                ? `${packageData.validity} month${packageData.validity > 1 ? "s" : ""}`
                : "—"
            }
          />
        </div>
      </SectionCard>

      {/* Included Services */}
      <SectionCard
        icon={<Route size={16} />}
        title="Included Services"
        actions={
          <span className="text-xs font-semibold text-[#4A5568]">
            {packageServices.length} service
            {packageServices.length !== 1 ? "s" : ""}
          </span>
        }
      >
        {packageServices.length === 0 ? (
          <p className="text-sm text-[#4A5568]">
            No services included in this package.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#CBD5E0] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF6EC] border-b border-[#CBD5E0]">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Service Title
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Description
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Quantity
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E0]">
                {packageServices.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#FAF6EC]/70 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs font-semibold text-[#0B1E3F] whitespace-nowrap">
                      {item.service?.title || "Unknown Service"}
                    </td>
                    <td
                      className="px-4 py-3 text-xs text-[#4A5568] max-w-xs truncate"
                      title={item.service?.description}
                    >
                      {item.service?.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-[#0B1E3F]">
                      {item.count || 1}
                    </td>
                    <td className="px-4 py-3">
                      {item.service?.id ? (
                        <Link
                          href={`/admin/services/${item.service.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-[#CBD5E0] bg-white text-[#4A5568] hover:text-[#0B1E3F] hover:bg-[#FAF6EC] transition-colors"
                        >
                          <ExternalLink size={12} /> View
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Metadata */}
      <SectionCard icon={<Calendar size={16} />} title="Metadata">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Row label="Created At" value={formatDate(packageData.createdAt)} />
          <Row label="Last Updated" value={formatDate(packageData.updatedAt)} />
        </div>
      </SectionCard>

      {/* Terms & Conditions */}
      {packageData.termsAndConditions && (
        <SectionCard
          icon={<FileText size={16} />}
          title="Terms &amp; Conditions"
        >
          <div
            className="tiptap-prose text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: (() => {
                try {
                  return generateHTML(packageData.termsAndConditions, [
                    StarterKit,
                    Underline,
                  ]);
                } catch {
                  return "<p>Unable to render terms content.</p>";
                }
              })(),
            }}
          />
        </SectionCard>
      )}
    </div>
  );
}
