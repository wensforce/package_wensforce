import { Hammer } from "lucide-react";

export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-5 px-6">
      <div className="w-16 h-16 rounded-2xl bg-[#0B1E3F] flex items-center justify-center">
        <Hammer size={28} className="text-[#C9A24B]" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#0B1E3F]">{title}</h2>
        <p className="text-[#4A5568] mt-2 text-sm">This section is under construction. Check back soon.</p>
      </div>
      <span className="inline-flex items-center gap-2 text-xs font-semibold bg-[#C9A24B]/10 text-[#C9A24B] border border-[#C9A24B]/30 px-4 py-1.5 rounded-full">
        Coming Soon
      </span>
    </div>
  );
}
