"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, FileJson, Loader2 } from "lucide-react";
import Modal from "../Modal";

export default function ExportModal({ open, onClose, onExport }) {
  const [exportingFormat, setExportingFormat] = useState(null);

  const formats = [
    {
      key: "xlsx",
      title: "Excel Spreadsheet (.xlsx)",
      description:
        "Best for viewing in Microsoft Excel or Google Sheets. Supports formulas and filtering.",
      icon: <FileSpreadsheet className="w-8 h-8 text-emerald-600" />,
      colorClass:
        "hover:bg-emerald-50/50 hover:border-emerald-300 border-emerald-100",
      bgClass: "bg-emerald-50",
    },
    {
      key: "csv",
      title: "Comma Separated Values (.csv)",
      description:
        "Standard plain-text format. Highly compatible with databases, scripts, and other data tools.",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      colorClass: "hover:bg-blue-50/50 hover:border-blue-300 border-blue-100",
      bgClass: "bg-blue-50",
    },
    {
      key: "json",
      title: "JSON Document (.json)",
      description:
        "Structured raw data. Best for developers, API integrations, and developer-level transfers.",
      icon: <FileJson className="w-8 h-8 text-amber-600" />,
      colorClass:
        "hover:bg-amber-50/50 hover:border-amber-300 border-amber-100",
      bgClass: "bg-amber-50",
    },
  ];

  const handleSelectFormat = async (formatKey) => {
    if (exportingFormat) return;
    setExportingFormat(formatKey);
    try {
      await onExport(formatKey);
    } catch (err) {
      console.error("Export selection handler failed:", err);
    } finally {
      setExportingFormat(null);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={exportingFormat ? undefined : onClose}
      title="Export Data"
      description="Choose your preferred file format for download."
      size="md"
    >
      <div className="p-6 space-y-4">
        {formats.map((format) => {
          const isCurrentExporting = exportingFormat === format.key;
          const isDisabled = exportingFormat !== null && !isCurrentExporting;

          return (
            <button
              key={format.key}
              onClick={() => handleSelectFormat(format.key)}
              disabled={isDisabled}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B1E3F]
                ${format.colorClass} 
                ${isDisabled ? "opacity-40 cursor-not-allowed border-gray-200" : "cursor-pointer"}
                bg-white`}
            >
              <div className={`p-3 rounded-lg shrink-0 ${format.bgClass}`}>
                {isCurrentExporting ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                ) : (
                  format.icon
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-[#0B1E3F] flex items-center gap-2">
                  {format.title}
                  {isCurrentExporting && (
                    <span className="text-xs font-normal text-gray-500 animate-pulse">
                      Generating...
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  {format.description}
                </p>
              </div>
            </button>
          );
        })}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={exportingFormat !== null}
            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
