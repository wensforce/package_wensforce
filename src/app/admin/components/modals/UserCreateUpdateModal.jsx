"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../Modal";
import { userApi } from "../../users/apis/user.api";

const ROLES = ["user", "admin", "ops"];
const INITIAL_FORM = {
  name: "",
  email: "",
  mobileNumber: "",
  role: "user",
  city: "",
};

export default function UserCreateUpdateModal({ open, onClose, onCreated, onUpdated, user }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = Boolean(user?.id);

  useEffect(() => {
    if (!open) return;

    if (isEditMode) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        mobileNumber: user?.mobileNumber || "",
        role: user?.role || "user",
        city: user?.city || "",
      });
    } else {
      setForm(INITIAL_FORM);
    }

    setError(null);
  }, [open, isEditMode, user]);

  const hasAnyUpdateField = useMemo(() => {
    if (!isEditMode) return true;

    const updates = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobileNumber: form.mobileNumber.trim(),
      role: form.role,
      city: form.city.trim(),
    };

    const original = {
      name: user?.name || "",
      email: user?.email || "",
      mobileNumber: user?.mobileNumber || "",
      role: user?.role || "user",
      city: user?.city || "",
    };

    return Object.keys(updates).some((key) => updates[key] !== original[key]);
  }, [form, isEditMode, user]);

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!isEditMode) {
      if (!form.name.trim()) return "Name is required.";
      if (!form.email.trim()) return "Email is required.";
      if (!form.mobileNumber.trim()) return "Mobile number is required.";
      if (!form.city.trim()) return "City is required.";
      if (!form.role.trim()) return "Role is required.";
    } else if (!hasAnyUpdateField) {
      return "No changes to update.";
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Enter a valid email address.";
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cleaned = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
        role: form.role,
        city: form.city.trim(),
      };

      if (isEditMode) {
        const payload = Object.fromEntries(
          Object.entries(cleaned).filter(([, value]) => value !== "")
        );

        const updated = await userApi.updateUser(user.id, payload);
        onUpdated?.(updated);
      } else {
        const created = await userApi.createUser(cleaned);
        onCreated?.(created);
      }

      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || (isEditMode ? "Failed to update user." : "Failed to create user."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !loading && onClose()}
      title={isEditMode ? "Edit User" : "New User"}
      description={isEditMode ? "Update user details." : "Create a new user account."}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-sm font-semibold text-[#0B1E3F]">Name{!isEditMode ? <span className="text-red-500"> *</span> : null}</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFieldChange}
              placeholder="e.g. Rahul"
              disabled={loading}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">Email{!isEditMode ? <span className="text-red-500"> *</span> : null}</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFieldChange}
              placeholder="e.g. rahul@example.com"
              disabled={loading}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">Mobile Number{!isEditMode ? <span className="text-red-500"> *</span> : null}</label>
            <input
              type="text"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleFieldChange}
              placeholder="e.g. 9999999999"
              disabled={loading}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">Role{!isEditMode ? <span className="text-red-500"> *</span> : null}</label>
            <select
              name="role"
              value={form.role}
              onChange={handleFieldChange}
              disabled={loading}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">City{!isEditMode ? <span className="text-red-500"> *</span> : null}</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleFieldChange}
              placeholder="e.g. Delhi"
              disabled={loading}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#0B1E3F] rounded-lg px-5 py-2 hover:bg-[#152d5a] transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}