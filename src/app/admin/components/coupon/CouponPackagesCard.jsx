"use client";

import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

function formatAmount(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function CouponPackagesCard({ packages = [] }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-[#CBD5E0] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#4A5568]">
          Linked Packages
        </h3>
        <span className="text-xs text-[#4A5568]">
          {packages.length === 0 ? "All packages" : `${packages.length} linked`}
        </span>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-4 text-sm text-[#4A5568]">
          This coupon is currently applicable to all packages.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#CBD5E0]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF6EC] border-b border-[#CBD5E0]">
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">#</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">Description</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">Regular</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">Discounted</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#4A5568]">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E0]">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-[#FAF6EC]/70 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-[#0B1E3F]">#{pkg.id}</td>
                  <td className="px-4 py-3 font-medium text-[#1A202C]">{pkg.name || "-"}</td>
                  <td className="px-4 py-3 text-[#4A5568] max-w-65 truncate" title={pkg.description || ""}>
                    {pkg.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-[#1A202C]">{formatAmount(pkg.regularPrice)}</td>
                  <td className="px-4 py-3 text-[#1A202C]">{formatAmount(pkg.discountedPrice)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => router.push(`/admin/packages/${pkg.id}`)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#CBD5E0] bg-white text-[#4A5568] hover:text-[#0B1E3F] hover:bg-[#FAF6EC] transition-colors"
                      title="Open package"
                      aria-label={`Open package ${pkg.id}`}
                    >
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
