"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Loader2, ListOrdered } from "lucide-react";
import Modal from "../Modal";
import { packageApi } from "../../packages/apis/packages.api";

export default function SequenceModal({ open, onClose, onSaved }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [packages, setPackages] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Hoisted function declarations
  async function fetchCategories() {
    setLoadingCategories(true);
    setError(null);
    try {
      const data = await packageApi.fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  }

  async function fetchPackages(category) {
    setLoadingPackages(true);
    setError(null);
    try {
      const data = await packageApi.fetchPackagesByCategory(category);
      setPackages(data);
    } catch (err) {
      console.error("Failed to fetch packages for category:", err);
      setError("Failed to load packages.");
    } finally {
      setLoadingPackages(false);
    }
  }

  // Fetch unique categories when modal opens (deferred to microtask to prevent lint errors)
  useEffect(() => {
    if (open) {
      Promise.resolve().then(() => {
        fetchCategories();
      });
    }
  }, [open]);

  // Fetch packages when selected category changes (deferred to microtask to prevent lint errors)
  useEffect(() => {
    if (selectedCategory) {
      Promise.resolve().then(() => {
        fetchPackages(selectedCategory);
      });
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    if (!val) {
      setPackages([]);
    }
  };

  const handleClose = () => {
    setSelectedCategory("");
    setPackages([]);
    setError(null);
    onClose();
  };

  const movePackage = (index, direction) => {
    const updated = [...packages];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= updated.length) return;

    // Swap elements
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setPackages(updated);
  };

  const handleSave = async () => {
    if (packages.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      const packageIds = packages.map((p) => p.id);
      await packageApi.updatePackageSequence(packageIds);
      onSaved?.();
      handleClose();
    } catch (err) {
      console.error("Failed to save sequence:", err);
      setError(err?.response?.data?.message || "Failed to save sequence.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={saving ? undefined : handleClose}
      title="Arrange Packages Sequence"
      description="Sort the display order of packages for users within a chosen category."
      size="xl"
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-full overflow-hidden">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Category Dropdown Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#0B1E3F]">
            Select Category
          </label>
          {loadingCategories ? (
            <div className="flex items-center gap-2 text-sm text-[#4A5568]">
              <Loader2 className="w-4 h-4 animate-spin text-[#C9A24B]" />
              Loading categories...
            </div>
          ) : (
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full max-w-full text-sm bg-white border border-[#CBD5E0] rounded-lg px-3 py-2 pr-8 text-[#1A202C] font-medium outline-none focus:border-[#C9A24B] transition-colors"
            >
              <option value="">-- Choose a Category --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Reordering List */}
        {selectedCategory && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#0B1E3F] flex items-center gap-1.5 border-b border-[#CBD5E0] pb-2">
              <ListOrdered size={16} className="text-[#C9A24B]" />
              Reorder Packages in category:{" "}
              <span className="underline">{selectedCategory}</span>
            </h3>

            {loadingPackages ? (
              <div className="flex flex-col items-center justify-center py-12 text-sm text-[#4A5568]">
                <Loader2 className="w-8 h-8 animate-spin text-[#C9A24B] mb-2" />
                Fetching packages...
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-400">
                No packages found in this category.
              </div>
            ) : (
              <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                {packages.map((pkg, index) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-3 border border-[#CBD5E0] rounded-xl bg-white hover:bg-[#FAF6EC]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#FAF6EC] border border-[#CBD5E0] flex items-center justify-center text-xs font-semibold text-[#0B1E3F]">
                        {index + 1}
                      </span>
                      {pkg.thumbnailUrl ? (
                        <img
                          src={pkg.thumbnailUrl}
                          alt={pkg.name}
                          className="w-10 h-10 object-cover rounded-lg border border-[#CBD5E0] shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#FAF6EC] border border-[#CBD5E0] flex items-center justify-center shrink-0">
                          <span className="text-xs text-[#C9A24B] font-bold">
                            PKG
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm text-[#1A202C]">
                          {pkg.name}
                        </p>
                        <p className="text-xs text-[#A0AEC0]">
                          ID: #{pkg.id} | Price: ₹
                          {pkg.discountedPrice || pkg.regularPrice}
                        </p>
                      </div>
                    </div>

                    {/* Up / Down Action Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => movePackage(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg border border-[#CBD5E0] text-gray-500 hover:bg-[#FAF6EC] hover:text-[#0B1E3F] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePackage(index, "down")}
                        disabled={index === packages.length - 1}
                        className="p-1.5 rounded-lg border border-[#CBD5E0] text-gray-500 hover:bg-[#FAF6EC] hover:text-[#0B1E3F] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Buttons */}
        <div className="flex justify-end gap-2 border-t border-[#CBD5E0] pt-4 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !selectedCategory || packages.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0B1E3F] hover:bg-[#152d5a] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            Save Sequence
          </button>
        </div>
      </div>
    </Modal>
  );
}
