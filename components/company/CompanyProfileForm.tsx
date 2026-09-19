"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  Upload,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";
import {
  EMPLOYEE_COUNT_OPTIONS,
  type CompanyProfile,
  type EmployeeCount,
  type SocialLink,
} from "@/types/company";

export default function CompanyProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile fields
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [employeeCount, setEmployeeCount] = useState<EmployeeCount>("0-50");
  const [addressNation, setAddressNation] = useState("India");
  const [addressState, setAddressState] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newAppName, setNewAppName] = useState("LinkedIn");
  const [newAppUrl, setNewAppUrl] = useState("");
  const [addingLink, setAddingLink] = useState(false);

  // Logo upload state
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/company/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data: CompanyProfile = await res.json();

        setName(data.name || "");
        setWebsite(data.website || "");
        setContactEmail(data.contact_email || "");
        setContactNumber(data.contact_number || "");
        setEmployeeCount((data.employee_count as EmployeeCount) || "0-50");
        setAddressNation(data.address_nation || "India");
        setAddressState(data.address_state || "");
        setAddressCity(data.address_city || "");
        setDescription(data.description || "");
        setLogoUrl(data.logo_url || "");
        setSocialLinks(data.social_links || []);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load company profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/company/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          website,
          contactEmail,
          contactNumber,
          employeeCount,
          addressNation,
          addressState,
          addressCity,
          description,
          logoUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      setSuccessMsg("Company profile updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/company/profile/logo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logo upload failed");

      setLogoUrl(data.logoUrl);
      setSuccessMsg("Logo updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload logo.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleAddSocialLink(e: React.FormEvent) {
    e.preventDefault();
    if (!newAppName.trim() || !newAppUrl.trim()) return;

    setAddingLink(true);
    try {
      const res = await fetch("/api/company/profile/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialAppName: newAppName.trim(),
          socialAccLink: newAppUrl.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add social link");
      const created = await res.json();
      setSocialLinks((prev) => [...prev, created]);
      setNewAppUrl("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add social link");
    } finally {
      setAddingLink(false);
    }
  }

  async function handleDeleteSocialLink(id: string) {
    try {
      const res = await fetch(`/api/company/profile/social-links/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSocialLinks((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Delete link error:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
          <Loader2 className="size-6 animate-spin text-[#004aad]" />
          <span>Loading company profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Alert Messages */}
      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center gap-3 text-rose-800 text-sm font-semibold animate-fadeIn">
          <AlertCircle className="size-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Brand & Logo Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-montserrat text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="size-5 text-[#004aad]" />
            <span>Company Brand & Identity</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="size-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="size-full object-cover" />
              ) : (
                <Building2 className="size-10 text-slate-400" />
              )}
              {uploadingLogo && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="size-6 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-slate-700 block">
                Company Logo (PNG, JPG, WebP)
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors border border-slate-200">
                  <Upload className="size-3.5" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]);
                    }}
                  />
                </label>
                <span className="text-xs text-slate-400">or enter image URL below</span>
              </div>
              <input
                type="text"
                placeholder="https://yourcompany.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-[#004aad]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Company Website</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="https://acme.inc"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="careers@acme.inc"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Company Size</label>
              <select
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value as EmployeeCount)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad] cursor-pointer"
              >
                {EMPLOYEE_COUNT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">About Company</label>
            <textarea
              rows={4}
              placeholder="Tell candidates about your company mission, culture, and what makes working here exciting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
            />
          </div>
        </div>

        {/* Location Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-montserrat text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="size-5 text-[#004aad]" />
            <span>Headquarters & Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                placeholder="Bengaluru"
                value={addressCity}
                onChange={(e) => setAddressCity(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
              <input
                type="text"
                placeholder="Karnataka"
                value={addressState}
                onChange={(e) => setAddressState(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Country</label>
              <input
                type="text"
                value={addressNation}
                onChange={(e) => setAddressNation(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#004aad] text-white font-extrabold text-sm hover:bg-[#003882] shadow-lg shadow-blue-600/20 active:scale-98 transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Social Links Sub-Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="font-montserrat text-lg font-bold text-slate-900 flex items-center gap-2">
          <LinkIcon className="size-5 text-[#004aad]" />
          <span>Social & Online Presence</span>
        </h2>

        {socialLinks.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {socialLinks.map((link) => (
              <div key={link.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{link.social_app_name}</span>
                  <a
                    href={link.social_acc_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#004aad] hover:underline break-all"
                  >
                    {link.social_acc_link}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteSocialLink(link.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No social links added yet.</p>
        )}

        <form onSubmit={handleAddSocialLink} className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Platform (e.g. LinkedIn, Twitter, GitHub)"
            value={newAppName}
            onChange={(e) => setNewAppName(e.target.value)}
            className="sm:w-1/3 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
          />
          <input
            type="url"
            placeholder="Profile Link URL"
            value={newAppUrl}
            onChange={(e) => setNewAppUrl(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[#004aad]"
          />
          <button
            type="submit"
            disabled={addingLink}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {addingLink ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
            <span>Add Link</span>
          </button>
        </form>
      </div>
    </div>
  );
}
