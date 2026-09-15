"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, Loader2, Plus } from "lucide-react";
import { exposApi } from "../../expos/apis/expos.api";
import { formatExpoPackagesCell } from "../../expos/utils/expoPackageUtils";

const STATUS_PILL = {
  upcoming: "bg-blue-100 text-blue-800",
  ongoing: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ExpoDashboardPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { rows: list, pagination } = await exposApi.fetchExpos({
          page: 1,
          search: "",
        });
        if (!cancelled) {
          setRows(Array.isArray(list) ? list.slice(0, 5) : []);
          setTotal(pagination?.total ?? list?.length ?? 0);
        }
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#F5E6BD] text-[#C9A24B] rounded-lg">
            <CalendarDays size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B1E3F]">Expos</h3>
            <p className="text-xs text-gray-500">
              {total} expo{total !== 1 ? "s" : ""} — view details or manage
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/expos"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-[#0B1E3F] hover:bg-[#FAF6EC] transition-colors"
          >
            View all
          </Link>
          <Link
            href="/admin/expos/create"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-medium hover:bg-[#152d5a] transition-colors"
          >
            <Plus size={15} />
            New expo
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center text-[#718096]">
          <Loader2 size={24} className="animate-spin text-[#C9A24B]" />
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-500 py-6 text-center">
          No expos yet.{" "}
          <Link href="/admin/expos/create" className="text-[#C9A24B] font-medium">
            Create one
          </Link>
        </p>
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-2 px-2 font-semibold">Name</th>
                <th className="py-2 px-2 font-semibold">City</th>
                <th className="py-2 px-2 font-semibold">Packages</th>
                <th className="py-2 px-2 font-semibold">Status</th>
                <th className="py-2 px-2 font-semibold text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((expo) => (
                <tr
                  key={expo.id}
                  className="border-b border-gray-50 hover:bg-[#FAF6EC]/60"
                >
                  <td className="py-2.5 px-2 font-medium text-[#0B1E3F] max-w-[160px] truncate">
                    {expo.name}
                  </td>
                  <td className="py-2.5 px-2 text-gray-600">{expo.city}</td>
                  <td
                    className="py-2.5 px-2 text-xs text-gray-600 max-w-[140px] truncate"
                    title={formatExpoPackagesCell(expo, { maxNames: 20 })}
                  >
                    {formatExpoPackagesCell(expo)}
                  </td>
                  <td className="py-2.5 px-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        STATUS_PILL[expo.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {expo.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <Link
                      href={`/admin/expos/${expo.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#C9A24B] hover:text-[#0B1E3F]"
                    >
                      <Eye size={14} />
                      View
                    </Link>
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
