"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import api from "@/app/axios/axios";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

export default function EditProfileForm({ onBack }) {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    Promise.resolve().then(() => {
      setForm({
        name: user.name || "",
        email: user.email || "",
        city: user.city || "",
      });
      setError(null);
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valError = validate();
    if (valError) {
      setError(valError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobileNumber: user.mobileNumber,
        role: user.role,
        city: form.city.trim(),
      };

      const res = await api.put(`/user/${user.id}`, payload);
      const updatedUser = res.data?.data ?? res.data;

      if (!updatedUser || !updatedUser.id) {
        throw new Error("Failed to update profile data.");
      }

      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      onBack();
    } catch (err) {
      console.error("[EditProfile] Error:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to update profile."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in py-4">
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          disabled={submitting}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#0B1E3F] hover:text-[#C9A24B] transition-colors bg-transparent border-none p-0 outline-none"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      {/* Edit Form Card */}
      <div
        className="w-full rounded-2xl border border-[#CBD5E0] bg-white p-6 sm:p-8 space-y-6 shadow-md"
      >
        <div>
          <h2 className="text-xl font-bold text-[#0B1E3F]" style={{ fontFamily: "var(--font-playfair)" }}>
            Edit Profile
          </h2>
          <p className="text-sm text-[#4A5568] mt-0.5">
            Update your personal details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                disabled={submitting}
                className="w-full rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]/30 px-4 py-2.5 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 transition-all disabled:opacity-60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={submitting}
                className="w-full rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]/30 px-4 py-2.5 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 transition-all disabled:opacity-60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                disabled={submitting}
                className="w-full rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]/30 px-4 py-2.5 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#CBD5E0]">
            <button
              type="button"
              onClick={onBack}
              disabled={submitting}
              className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#0B1E3F] rounded-lg px-5 py-2 hover:bg-[#152d5a] transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
