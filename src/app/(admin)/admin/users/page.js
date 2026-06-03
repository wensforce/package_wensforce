import { Users, Search, Filter, Download, UserPlus } from "lucide-react";

const COLUMNS = ["Name", "Phone", "Role", "Joined", "Status", "Actions"];

export default function UsersPage() {
  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(201,162,75,0.12)", border: "1px solid rgba(201,162,75,0.22)" }}
          >
            <Users size={16} style={{ color: "#C9A24B" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase" style={{ color: "#C9A24B" }}>
              Member Management
            </p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair, serif)" }}>
              All Users
            </h1>
          </div>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          style={{ background: "rgba(201,162,75,0.13)", border: "1px solid rgba(201,162,75,0.26)", color: "#C9A24B" }}
        >
          <UserPlus size={13} />
          Add User
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-1 min-w-52"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Search size={13} style={{ color: "rgba(255,255,255,0.2)" }} />
          <span className="text-sm text-white/20">Search by name or phone…</span>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}
        >
          <Filter size={13} />
          Filter
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}
        >
          <Download size={13} />
          Export
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="grid px-5 py-3.5 border-b"
          style={{ gridTemplateColumns: "1.5fr 1.2fr 0.8fr 1fr 0.8fr 80px", borderColor: "rgba(255,255,255,0.05)" }}
        >
          {COLUMNS.map((c) => (
            <p key={c} className="text-[10px] font-bold tracking-widest uppercase text-white/22">{c}</p>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "rgba(201,162,75,0.07)", border: "1px solid rgba(201,162,75,0.14)" }}
          >
            <Users size={26} style={{ color: "rgba(201,162,75,0.45)" }} />
          </div>
          <h3 className="text-white/55 font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-playfair, serif)" }}>
            No Users Yet
          </h3>
          <p className="text-white/22 text-sm max-w-xs leading-relaxed">
            Member accounts will appear here once the users API is integrated.
          </p>
        </div>
      </div>
    </div>
  );
}
