"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Sparkles,
  Crown,
  Trash2,
  Edit3,
  X,
  Upload,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  Download,
  Filter,
  Heart,
  Baby,
  RefreshCw,
  Eye,
  LayoutGrid,
  Table,
  FileText,
  PhoneCall,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import { compressImageToWebP } from "@/lib/imageCompression";
import { INDIAN_STATES_AND_CITIES, INDIAN_STATES } from "@/lib/indianLocations";

interface CustomerLocation {
  label: string;
  address: string;
  mapUrl?: string;
  state?: string;
  city: string;
  isPrimary: boolean;
}

interface CustomerChild {
  name: string;
  relation?: string;
  gender?: "Male" | "Female" | "Other";
  age?: number;
  dateOfBirth?: string;
  maritalStatus?: "Unmarried" | "Married" | "Other";
  notes?: string;
}

const STANDARD_RELATIONS = [
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Nephew",
  "Niece",
  "Daughter-in-law",
  "Son-in-law",
  "Grandson",
  "Granddaughter",
];

export interface CustomerData {
  _id?: string;
  name: string;
  phone: string;
  whatsappNumber?: string;
  email?: string;
  photo?: { url: string; public_id: string };
  professions: string[];
  locations: CustomerLocation[];
  dateOfBirth?: string;
  age?: number;
  anniversaryDate?: string;
  maritalStatus?: "Married" | "Unmarried" | "Single" | "Other";
  spouseName?: string;
  children: CustomerChild[];
  customerTier: "High-Value" | "Mid-Level" | "Budget";
  tags: string[];
  notes?: string;
  totalBookingsCount?: number;
  totalSpent?: number;
  createdAt?: string;
}

interface CustomerCRMProps {
  customers: CustomerData[];
  onRefresh: () => void;
  onOpenWhatsApp: (recipients: { phone: string; name: string; customerId: string }[]) => void;
  handleFileUpload: (file: File) => Promise<{ url: string; public_id: string } | undefined>;
  uploadingImage: boolean;
}

const COMMON_PROFESSIONS = [
  "Government Employee",
  "Farmer",
  "Businessman",
  "Doctor",
  "Contractor",
  "Politician",
  "Teacher / Professor",
  "Engineer / IT",
  "Lawyer / Advocate",
  "Real Estate / Builder",
  "Chartered Accountant",
  "Defence / Police Officer",
];

const MONTHS = [
  { value: "all", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function CustomerCRM({
  customers,
  onRefresh,
  onOpenWhatsApp,
  handleFileUpload,
  uploadingImage,
}: CustomerCRMProps) {
  // Filters
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [birthMonthFilter, setBirthMonthFilter] = useState("all");

  // Selection for bulk actions
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<CustomerData | null>(null);
  const [customerDetailsTab, setCustomerDetailsTab] = useState<"profile" | "family" | "locations" | "notes">("profile");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table"); // Table is default as requested!
  const [saveLoading, setSaveLoading] = useState(false);
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const [professionInput, setProfessionInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Photo upload, replace & delete states
  const photoFileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoDeleting, setPhotoDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Helper to safely delete an image from Cloudinary via API
  const deletePhotoFromCloudinary = async (urlOrPublicId: string) => {
    if (!urlOrPublicId) return;
    try {
      await fetch(`/api/upload?public_id=${encodeURIComponent(urlOrPublicId)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Could not delete photo from Cloudinary:", err);
    }
  };

  // Upload or Replace Photo with real-time percentage progress
  const handleUploadPhotoWithProgress = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    // Capture the existing photo if replacing, so we can delete it from Cloudinary
    const oldPhotoToDelete = editingCustomer?.photo?.url || editingCustomer?.photo?.public_id
      ? { ...editingCustomer.photo }
      : null;

    setPhotoUploading(true);
    setUploadProgress(15);

    try {
      const webpFile = await compressImageToWebP(file);
      setUploadProgress(30);

      const formData = new FormData();
      formData.append("file", webpFile);
      formData.append("folder", "riwaj_customers");

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = 30 + Math.round((e.loaded / e.total) * 60);
          setUploadProgress(pct);
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.success && data.data?.url) {
              setUploadProgress(100);

              // If replacing an existing photo, safely delete the old one from Cloudinary immediately
              if (oldPhotoToDelete && (oldPhotoToDelete.public_id || oldPhotoToDelete.url)) {
                await deletePhotoFromCloudinary(oldPhotoToDelete.public_id || oldPhotoToDelete.url);
              }

              // CRUCIAL: Use functional state updater so inputs (name, phone, etc.) are never wiped out
              setEditingCustomer((prev) =>
                prev
                  ? {
                      ...prev,
                      photo: { url: data.data.url, public_id: data.data.public_id || "" },
                    }
                  : prev
              );
              setTimeout(() => {
                setPhotoUploading(false);
                setUploadProgress(0);
              }, 400);
            } else {
              alert(data.message || "Failed to upload photo");
              setPhotoUploading(false);
              setUploadProgress(0);
            }
          } catch {
            alert("Error parsing upload response");
            setPhotoUploading(false);
            setUploadProgress(0);
          }
        } else {
          alert(`Upload failed with status ${xhr.status}`);
          setPhotoUploading(false);
          setUploadProgress(0);
        }
      };

      xhr.onerror = () => {
        alert("Network error while uploading photo");
        setPhotoUploading(false);
        setUploadProgress(0);
      };

      xhr.send(formData);
    } catch (err: any) {
      alert("Error processing photo: " + (err.message || "Unknown error"));
      setPhotoUploading(false);
      setUploadProgress(0);
    }
  };

  // Remove Photo and delete it immediately from Cloudinary
  const handleRemovePhoto = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const currentPhoto = editingCustomer?.photo;
    if (!currentPhoto?.url && !currentPhoto?.public_id) {
      setEditingCustomer((prev) => (prev ? { ...prev, photo: { url: "", public_id: "" } } : prev));
      return;
    }

    setPhotoDeleting(true);
    try {
      // 1. Delete image from Cloudinary
      await deletePhotoFromCloudinary(currentPhoto.public_id || currentPhoto.url);

      // 2. If customer is already saved in DB, clear photo in DB immediately
      if (editingCustomer?._id) {
        await fetch("/api/admin/customers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCustomer._id,
            photo: { url: "", public_id: "" },
          }),
        });
        onRefresh();
      }

      // 3. Clear photo in local state
      setEditingCustomer((prev) =>
        prev
          ? {
              ...prev,
              photo: { url: "", public_id: "" },
            }
          : prev
      );
    } catch (err: any) {
      console.error("Error removing photo:", err);
      alert("Failed to delete photo: " + (err.message || "Unknown error"));
    } finally {
      setPhotoDeleting(false);
    }
  };

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesPhone = c.phone?.toLowerCase().includes(q);
        const matchesEmail = c.email?.toLowerCase().includes(q);
        const matchesProf = c.professions?.some((p) => p.toLowerCase().includes(q));
        const matchesTag = c.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesCity = c.locations?.some(
          (l) =>
            l.city?.toLowerCase().includes(q) ||
            l.state?.toLowerCase().includes(q) ||
            l.address?.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesProf && !matchesTag && !matchesCity) {
          return false;
        }
      }

      // Tier
      if (tierFilter !== "all" && c.customerTier !== tierFilter) return false;

      // Profession
      if (professionFilter !== "all" && !c.professions?.includes(professionFilter)) return false;

      // Birth Month
      if (birthMonthFilter !== "all") {
        if (!c.dateOfBirth) return false;
        const m = new Date(c.dateOfBirth).getMonth() + 1;
        if (m.toString() !== birthMonthFilter) return false;
      }

      return true;
    });
  }, [customers, search, tierFilter, professionFilter, birthMonthFilter]);

  // Bulk selection toggles
  const handleSelectAll = () => {
    if (selectedCustomerIds.length === filteredCustomers.length) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(filteredCustomers.map((c) => c._id!).filter(Boolean));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedCustomerIds.includes(id)) {
      setSelectedCustomerIds(selectedCustomerIds.filter((item) => item !== id));
    } else {
      setSelectedCustomerIds([...selectedCustomerIds, id]);
    }
  };

  // Open modal for new customer
  const handleAddNew = () => {
    setEditingCustomer({
      name: "",
      phone: "",
      whatsappNumber: "",
      email: "",
      photo: { url: "", public_id: "" },
      professions: [],
      locations: [
        {
          label: "Home",
          address: "",
          mapUrl: "",
          state: "Madhya Pradesh",
          city: "Rewa",
          isPrimary: true,
        },
      ],
      dateOfBirth: "",
      age: undefined,
      anniversaryDate: "",
      maritalStatus: "Married",
      spouseName: "",
      children: [],
      customerTier: "Mid-Level",
      tags: [],
      notes: "",
    });
    setProfessionInput("");
    setTagInput("");
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (cust: CustomerData) => {
    setEditingCustomer({
      ...cust,
      dateOfBirth: cust.dateOfBirth ? cust.dateOfBirth.split("T")[0] : "",
      anniversaryDate: cust.anniversaryDate ? cust.anniversaryDate.split("T")[0] : "",
      locations:
        cust.locations && cust.locations.length > 0
          ? cust.locations.map((loc) => ({
              ...loc,
              state: loc.state || "Madhya Pradesh",
              city: loc.city || "Rewa",
            }))
          : [{ label: "Home", address: "", mapUrl: "", state: "Madhya Pradesh", city: "Rewa", isPrimary: true }],
      children: cust.children || [],
      professions: cust.professions || [],
      tags: cust.tags || [],
    });
    setProfessionInput("");
    setTagInput("");
    setShowModal(true);
  };

  // Delete customer
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete customer "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/customers?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.message || "Failed to delete customer");
      }
    } catch {
      alert("Error deleting customer");
    }
  };

  // Save customer (Create or Update)
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (!editingCustomer.name.trim() || !editingCustomer.phone.trim()) {
      alert("Name and Phone number are required.");
      return;
    }

    setSaveLoading(true);
    try {
      const isEdit = Boolean(editingCustomer._id);
      const res = await fetch("/api/admin/customers", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit ? { id: editingCustomer._id, ...editingCustomer } : editingCustomer
        ),
      });
      const data = await res.json();
      setSaveLoading(false);

      if (data.success) {
        setShowModal(false);
        setEditingCustomer(null);
        onRefresh();
      } else {
        alert(data.message || "Failed to save customer");
      }
    } catch (err: any) {
      setSaveLoading(false);
      alert(err.message || "Network error");
    }
  };

  // Export filtered customers to CSV
  const handleExportCSV = () => {
    const dataToExport = selectedCustomerIds.length > 0
      ? filteredCustomers.filter((c) => selectedCustomerIds.includes(c._id!))
      : filteredCustomers;

    if (dataToExport.length === 0) {
      alert("No customer data to export.");
      return;
    }

    const headers = ["Name", "Phone", "WhatsApp", "Email", "Tier", "Professions", "City", "Age", "Bookings", "Total Spent"];
    const rows = dataToExport.map((c) => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.whatsappNumber || c.phone}"`,
      `"${c.email || ""}"`,
      `"${c.customerTier}"`,
      `"${(c.professions || []).join(", ")}"`,
      `"${c.locations?.[0]?.city || ""}"`,
      `"${c.age || ""}"`,
      `"${c.totalBookingsCount || 0}"`,
      `"₹${(c.totalSpent || 0).toLocaleString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `riwaj_customers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk WhatsApp trigger
  const handleTriggerBulkWhatsApp = () => {
    const selected = customers.filter((c) => selectedCustomerIds.includes(c._id!));
    if (selected.length === 0) {
      alert("Please select at least one customer.");
      return;
    }
    const recipients = selected.map((c) => ({
      phone: c.whatsappNumber || c.phone,
      name: c.name,
      customerId: c._id!,
    }));
    onOpenWhatsApp(recipients);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-gray-900 font-serif">Customer Directory & CRM</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total {customers.length} registered clients • Profiles, professions, locations & WhatsApp broadcast
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Table / Grid View Switcher */}
          <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "table"
                  ? "bg-white text-rose-600 shadow-2xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              title="Table View (Rows & Columns)"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "grid"
                  ? "bg-white text-rose-600 shadow-2xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleAddNew}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-md shadow-rose-200 hover:opacity-95 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Customer</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, city, tag..."
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-rose-400"
            />
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none text-xs"
            >
              <option value="all">👑 All Customer Tiers</option>
              <option value="High-Value">💎 High-Value (Luxury / HNI)</option>
              <option value="Mid-Level">⭐ Mid-Level Client</option>
              <option value="Budget">🏷️ Budget Client</option>
            </select>
          </div>

          {/* Profession Filter */}
          <div>
            <select
              value={professionFilter}
              onChange={(e) => setProfessionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none text-xs"
            >
              <option value="all">💼 All Professions</option>
              {COMMON_PROFESSIONS.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>

          {/* Birth Month Filter */}
          <div>
            <select
              value={birthMonthFilter}
              onChange={(e) => setBirthMonthFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none text-xs"
            >
              <option value="all">🎂 Birthday Campaign Month</option>
              {MONTHS.filter((m) => m.value !== "all").map((m) => (
                <option key={m.value} value={m.value}>
                  Born in {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Action Bar when items selected */}
        {selectedCustomerIds.length > 0 && (
          <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-rose-50/50 p-2.5 rounded-xl">
            <span className="font-bold text-rose-800">
              {selectedCustomerIds.length} customer(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerBulkWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send WhatsApp Broadcast ({selectedCustomerIds.length})</span>
              </button>
              <button
                onClick={() => setSelectedCustomerIds([])}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Directory View: Table (Rows & Columns) or Cards Grid */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredCustomers.length > 0 &&
                        selectedCustomerIds.length === filteredCustomers.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3.5">Customer Profile</th>
                  <th className="py-3 px-3.5">Contact Details</th>
                  <th className="py-3 px-3.5">Professions</th>
                  <th className="py-3 px-3.5">Location / City</th>
                  <th className="py-3 px-3.5">Family & Children</th>
                  <th className="py-3 px-3.5 text-center">Bookings / Spent</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((cust) => {
                  const isSelected = selectedCustomerIds.includes(cust._id!);
                  const primaryLoc =
                    cust.locations?.find((l) => l.isPrimary) || cust.locations?.[0];

                  return (
                    <tr
                      key={cust._id}
                      onClick={() => setViewingCustomer(cust)}
                      className={`hover:bg-rose-50/40 transition-colors cursor-pointer group ${
                        isSelected ? "bg-rose-50/30" : ""
                      }`}
                      title="Click row to view full customer profile details"
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3 px-3.5 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(cust._id!)}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>

                      {/* Customer Profile (Photo, Name, Age, Tier badge) */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-amber-100 border border-gray-200 shrink-0 flex items-center justify-center">
                            {cust.photo?.url ? (
                              <Image
                                src={cust.photo.url}
                                alt={cust.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <span className="font-bold text-rose-700 text-sm">
                                {cust.name?.charAt(0).toUpperCase() || "C"}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                                {cust.name}
                              </span>
                              {cust.customerTier === "High-Value" && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                                  💎 VIP
                                </span>
                              )}
                              {cust.customerTier === "Mid-Level" && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  ⭐ Mid
                                </span>
                              )}
                              {cust.customerTier === "Budget" && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-gray-100 text-gray-600">
                                  🏷️ Budget
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {cust.age !== undefined ? `${cust.age} yrs` : "Age -"} •{" "}
                              {cust.maritalStatus || "Married"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-3 px-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-gray-800 font-mono font-medium">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <a
                              href={`tel:${cust.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-rose-600 hover:underline"
                            >
                              {cust.phone}
                            </a>
                          </div>
                          {cust.email ? (
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <Mail className="w-2.5 h-2.5 text-gray-400" />
                              <span className="truncate max-w-[140px]">{cust.email}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-300 italic">No email</span>
                          )}
                        </div>
                      </td>

                      {/* Professions */}
                      <td className="py-3 px-3.5">
                        {cust.professions && cust.professions.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {cust.professions.slice(0, 2).map((prof, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-semibold flex items-center gap-1"
                              >
                                <Briefcase className="w-2.5 h-2.5 text-gray-500" />
                                <span>{prof}</span>
                              </span>
                            ))}
                            {cust.professions.length > 2 && (
                              <span className="text-[10px] text-gray-400 font-medium">
                                +{cust.professions.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Location / City */}
                      <td className="py-3 px-3.5">
                        {primaryLoc ? (
                          <div className="space-y-0.5 max-w-[170px]">
                            <div className="flex items-center gap-1 text-[11px] text-gray-700">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              <span className="font-semibold text-gray-800 truncate">
                                {primaryLoc.city || "Rewa"}{primaryLoc.state ? `, ${primaryLoc.state}` : ""}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                ({primaryLoc.label})
                              </span>
                              {primaryLoc.mapUrl && (
                                <a
                                  href={primaryLoc.mapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-blue-500 hover:underline shrink-0"
                                  title="Open Google Maps"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 truncate">
                              {primaryLoc.address}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Family & Children */}
                      <td className="py-3 px-3.5">
                        {cust.children && cust.children.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {cust.children.slice(0, 2).map((ch, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-medium"
                              >
                                {ch.name || "Member"}{" "}
                                <span className="text-amber-700 font-semibold">
                                  ({ch.relation || "Son"}
                                  {ch.age !== undefined ? `, ${ch.age}y` : ""})
                                </span>
                              </span>
                            ))}
                            {cust.children.length > 2 && (
                              <span className="text-[10px] text-gray-400 font-medium">
                                +{cust.children.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-[10px] italic">None added</span>
                        )}
                      </td>

                      {/* Bookings / Spent */}
                      <td className="py-3 px-3.5 text-center">
                        <div className="font-bold text-gray-800">
                          <span className="text-rose-600">
                            {cust.totalBookingsCount || 0}
                          </span>{" "}
                          bookings
                        </div>
                        <div className="text-[10px] text-gray-400">
                          ₹{(cust.totalSpent || 0).toLocaleString()} spent
                        </div>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenWhatsApp([
                                {
                                  phone: cust.whatsappNumber || cust.phone,
                                  name: cust.name,
                                  customerId: cust._id!,
                                },
                              ])
                            }
                            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1 transition-colors"
                            title="Send WhatsApp message"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span className="hidden xl:inline">WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setViewingCustomer(cust)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(cust)}
                            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit profile"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(cust._id!, cust.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-500">
                      <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-bold text-gray-700 text-xs">No customers found</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Try adjusting search query or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Alternative View: Customer Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => {
            const isSelected = selectedCustomerIds.includes(cust._id!);
            return (
              <div
                key={cust._id}
                onClick={() => setViewingCustomer(cust)}
                className={`bg-white rounded-2xl border transition-all p-4 flex flex-col justify-between shadow-2xs cursor-pointer group ${
                  isSelected
                    ? "border-rose-400 ring-2 ring-rose-200 bg-rose-50/20"
                    : "border-gray-200 hover:border-rose-300 hover:shadow-md"
                }`}
              >
                <div>
                  {/* Header row: Checkbox, Avatar, Name, Tier badge */}
                  <div className="flex items-start gap-3">
                    <div onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(cust._id!)}
                        className="mt-1.5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                    </div>

                    {/* Avatar */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      {cust.photo?.url ? (
                        <Image
                          src={cust.photo.url}
                          alt={cust.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-base bg-rose-50 text-rose-700">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-rose-600 transition-colors">
                          {cust.name}
                        </h3>
                        {cust.customerTier === "High-Value" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shrink-0 flex items-center gap-1">
                            <Crown className="w-2.5 h-2.5 text-amber-600" />
                            <span>VIP</span>
                          </span>
                        )}
                        {cust.customerTier === "Budget" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            Budget
                          </span>
                        )}
                        {cust.customerTier === "Mid-Level" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                            Standard
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                        <a
                          href={`tel:${cust.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-gray-800 hover:text-rose-600 transition-colors font-medium"
                        >
                          {cust.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Professions pills */}
                  {cust.professions && cust.professions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {cust.professions.map((prof, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-semibold flex items-center gap-1"
                        >
                          <Briefcase className="w-2.5 h-2.5 text-gray-500" />
                          <span>{prof}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Locations preview */}
                  {cust.locations && cust.locations.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                      {cust.locations.slice(0, 2).map((loc, i) => (
                        <div key={i} className="flex items-start gap-1 text-[11px] text-gray-600">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">
                            <strong className="text-gray-800">{loc.label}:</strong> {loc.address} ({loc.city || "Rewa"}{loc.state ? `, ${loc.state}` : ""})
                          </span>
                          {loc.mapUrl && (
                            <a
                              href={loc.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-500 hover:underline shrink-0"
                              title="Open Google Maps"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Demographics / Family details info */}
                  <div className="mt-2.5 pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
                    {cust.age !== undefined && (
                      <div>
                        <span className="text-gray-400">Age: </span>
                        <strong className="text-gray-800">{cust.age} yrs</strong>
                      </div>
                    )}
                    {cust.children && cust.children.length > 0 && (
                      <div className="flex items-center gap-1 text-gray-700">
                        <Baby className="w-3 h-3 text-amber-500" />
                        <span>{cust.children.length} Family / Child</span>
                      </div>
                    )}
                    {cust.totalBookingsCount !== undefined && (
                      <div>
                        <span className="text-gray-400">Bookings: </span>
                        <strong className="text-rose-600">{cust.totalBookingsCount}</strong>
                      </div>
                    )}
                    {cust.totalSpent !== undefined && cust.totalSpent > 0 && (
                      <div>
                        <span className="text-gray-400">Spent: </span>
                        <strong className="text-gray-800">₹{cust.totalSpent.toLocaleString()}</strong>
                      </div>
                    )}
                  </div>

                  {/* Family / Children pills preview */}
                  {cust.children && cust.children.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-gray-100 flex flex-wrap gap-1">
                      {cust.children.slice(0, 3).map((ch, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-medium"
                        >
                          {ch.name || "Member"}{" "}
                          <span className="text-amber-700 font-semibold">
                            ({ch.relation || "Son"}
                            {ch.age !== undefined ? `, ${ch.age}y` : ""})
                          </span>
                        </span>
                      ))}
                      {cust.children.length > 3 && (
                        <span className="text-[10px] text-gray-400 self-center">
                          +{cust.children.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div
                  className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between gap-2 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() =>
                      onOpenWhatsApp([
                        {
                          phone: cust.whatsappNumber || cust.phone,
                          name: cust.name,
                          customerId: cust._id!,
                        },
                      ])
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewingCustomer(cust)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View full details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(cust)}
                      className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                      title="Edit profile"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cust._id!, cust.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCustomers.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-200">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h4 className="font-bold text-gray-800 text-sm">No customers found</h4>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Separate Full Customer Details Modal (Enterprise Dossier UI) ── */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-slate-50/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full shadow-[0_25px_80px_-15px_rgba(0,0,0,0.4)] border border-slate-200/90 relative max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-xs">
            
            {/* ── Modal Top Header with Dark Luxury Gradient ── */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 pb-5 shrink-0 border-b border-slate-700/60">
              <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-rose-500/10 via-amber-500/10 to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all z-10 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
                {/* Avatar / Photo + Identity */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-500 to-amber-500 ring-2 ring-white/20 shadow-lg shrink-0 flex items-center justify-center">
                    {viewingCustomer.photo?.url ? (
                      <Image
                        src={viewingCustomer.photo.url}
                        alt={viewingCustomer.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <span className="font-serif font-bold text-white text-2xl sm:text-3xl">
                        {viewingCustomer.name?.charAt(0).toUpperCase() || "C"}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`px-3 py-0.5 rounded-full text-[11px] font-bold shadow-2xs ${
                          viewingCustomer.customerTier === "High-Value"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                            : viewingCustomer.customerTier === "Mid-Level"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                            : "bg-slate-700 text-slate-300 border border-slate-600"
                        }`}
                      >
                        {viewingCustomer.customerTier === "High-Value"
                          ? "💎 VIP / High-Value"
                          : viewingCustomer.customerTier === "Mid-Level"
                          ? "⭐ Mid-Level Client"
                          : "🏷️ Budget Client"}
                      </span>

                      {viewingCustomer.createdAt && (
                        <span className="text-[10px] text-slate-400">
                          Registered {new Date(viewingCustomer.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight">
                      {viewingCustomer.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-slate-300 text-xs mt-1">
                      <a
                        href={`tel:${viewingCustomer.phone}`}
                        className="hover:text-amber-300 flex items-center gap-1 font-mono transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{viewingCustomer.phone}</span>
                      </a>
                      {viewingCustomer.email && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{viewingCustomer.email}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions Header */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const c = viewingCustomer;
                      setViewingCustomer(null);
                      onOpenWhatsApp([
                        {
                          phone: c.whatsappNumber || c.phone,
                          name: c.name,
                          customerId: c._id!,
                        },
                      ]);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const c = viewingCustomer;
                      setViewingCustomer(null);
                      handleEdit(c);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* ── Segmented Control Bar (Apple / Stripe Tab Switcher) ── */}
              <div className="flex items-center gap-1.5 mt-5 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10 max-w-fit overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setCustomerDetailsTab("profile")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    customerDetailsTab === "profile"
                      ? "bg-white text-slate-900 shadow-md font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-rose-500" />
                  <span>Profile & Demographics</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomerDetailsTab("family")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    customerDetailsTab === "family"
                      ? "bg-white text-slate-900 shadow-md font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Baby className="w-3.5 h-3.5 text-amber-500" />
                  <span>Family & Children</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      customerDetailsTab === "family"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {(viewingCustomer.children || []).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomerDetailsTab("locations")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    customerDetailsTab === "locations"
                      ? "bg-white text-slate-900 shadow-md font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Addresses & Locations</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      customerDetailsTab === "locations"
                        ? "bg-rose-100 text-rose-900"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {(viewingCustomer.locations || []).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomerDetailsTab("notes")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    customerDetailsTab === "notes"
                      ? "bg-white text-slate-900 shadow-md font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>CRM Notes & Revenue</span>
                </button>
              </div>
            </div>

            {/* ── Modal Scrollable Body ── */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

              {/* ════════════════ TAB 1: PROFILE & DEMOGRAPHICS ════════════════ */}
              {customerDetailsTab === "profile" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Demographics Card */}
                  <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Personal & Demographic Details
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Current Age
                        </span>
                        <strong className="text-base sm:text-lg font-mono font-bold text-slate-900 block">
                          {viewingCustomer.age !== undefined ? `${viewingCustomer.age} Years` : "Not specified"}
                        </strong>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Date of Birth
                        </span>
                        <strong className="text-base font-semibold text-slate-900 block">
                          {viewingCustomer.dateOfBirth
                            ? new Date(viewingCustomer.dateOfBirth).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Not specified"}
                        </strong>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Marital Status
                        </span>
                        <strong className="text-base font-semibold text-slate-900 block">
                          {viewingCustomer.maritalStatus || "Married"}
                        </strong>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Anniversary Date
                        </span>
                        <strong className="text-base font-semibold text-slate-900 block">
                          {viewingCustomer.anniversaryDate
                            ? new Date(viewingCustomer.anniversaryDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Not specified"}
                        </strong>
                      </div>
                    </div>

                    {viewingCustomer.spouseName && (
                      <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center gap-2.5 text-xs text-rose-900">
                        <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="text-slate-600">Spouse Name:</span>
                        <strong className="font-bold text-slate-900">{viewingCustomer.spouseName}</strong>
                      </div>
                    )}
                  </div>

                  {/* Occupations & Professions Card */}
                  <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Occupations & Professions
                    </span>

                    {viewingCustomer.professions && viewingCustomer.professions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {viewingCustomer.professions.map((prof, i) => (
                          <span
                            key={i}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/80 text-xs font-semibold flex items-center gap-2 shadow-2xs"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                            <span>{prof}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-xs">No professions recorded for this customer.</p>
                    )}
                  </div>
                </div>
              )}

              {/* ════════════════ TAB 2: FAMILY & CHILDREN ════════════════ */}
              {customerDetailsTab === "family" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                          <Baby className="w-4 h-4 text-amber-600" />
                          <span>Family Tree, Children & Relatives ({(viewingCustomer.children || []).length})</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Track relatives with age, relationships, and upcoming marriage or celebration requirements.
                        </p>
                      </div>
                    </div>

                    {viewingCustomer.children && viewingCustomer.children.length > 0 ? (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                              <th className="py-3 px-4">Relation</th>
                              <th className="py-3 px-4">Full Name</th>
                              <th className="py-3 px-4 text-center">Age (yrs)</th>
                              <th className="py-3 px-4">Gender</th>
                              <th className="py-3 px-4">Marital Status</th>
                              <th className="py-3 px-4">Notes & Upcoming Wedding Plans</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {viewingCustomer.children.map((ch, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/60">
                                <td className="py-3 px-4">
                                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[11px]">
                                    {ch.relation || "Son"}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-bold text-slate-900 text-xs">
                                  {ch.name || "—"}
                                </td>
                                <td className="py-3 px-4 text-center font-mono font-extrabold text-sm text-rose-600">
                                  {ch.age !== undefined ? `${ch.age} yrs` : "—"}
                                </td>
                                <td className="py-3 px-4 text-slate-600">
                                  {ch.gender || "Other"}
                                </td>
                                <td className="py-3 px-4">
                                  {ch.maritalStatus === "Married" ? (
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
                                      <span>✓ Married</span>
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 ring-1 ring-amber-400/20 inline-flex items-center gap-1 shadow-2xs">
                                      <span>💍 Unmarried</span>
                                      <span className="text-[9px] text-amber-700 font-normal">(Prospect)</span>
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-slate-600 italic">
                                  {ch.notes || "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        No family members or children recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ════════════════ TAB 3: ADDRESSES & LOCATIONS ════════════════ */}
              {customerDetailsTab === "locations" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-600" />
                        <span>Registered Addresses & Properties ({(viewingCustomer.locations || []).length})</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Primary residences, farmhouses, offices, and venue locations.
                      </p>
                    </div>

                    {viewingCustomer.locations && viewingCustomer.locations.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {viewingCustomer.locations.map((loc, i) => (
                          <div
                            key={i}
                            className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-2.5 hover:border-rose-200 transition-colors"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                  <span>{loc.label} ({loc.city || "Rewa"}{loc.state ? `, ${loc.state}` : ""})</span>
                                </span>
                                {loc.isPrimary && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    Primary
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">{loc.address}</p>
                            </div>

                            {loc.mapUrl && (
                              <div className="pt-2 border-t border-slate-200/60">
                                <a
                                  href={loc.mapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Open in Google Maps</span>
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        No locations added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ════════════════ TAB 4: CRM INSIGHTS & NOTES ════════════════ */}
              {customerDetailsTab === "notes" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Revenue Card */}
                    <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Customer Lifetime Value
                      </span>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3.5 bg-slate-50 rounded-2xl">
                          <span className="text-slate-400 text-[10px] font-bold uppercase block">Total Bookings</span>
                          <strong className="text-2xl text-rose-600 font-extrabold font-mono block mt-1">
                            {viewingCustomer.totalBookingsCount || 0}
                          </strong>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-2xl">
                          <span className="text-slate-400 text-[10px] font-bold uppercase block">Total Spent</span>
                          <strong className="text-2xl text-slate-900 font-extrabold font-mono block mt-1">
                            ₹{(viewingCustomer.totalSpent || 0).toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Confidential CRM Notes</span>
                      </span>

                      {viewingCustomer.notes ? (
                        <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100">
                          {viewingCustomer.notes}
                        </p>
                      ) : (
                        <p className="text-slate-400 italic text-xs">No internal notes entered.</p>
                      )}

                      {viewingCustomer.tags && viewingCustomer.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {viewingCustomer.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* ── Modal Bottom Actions ── */}
            <div className="p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const c = viewingCustomer;
                  setViewingCustomer(null);
                  onOpenWhatsApp([
                    {
                      phone: c.whatsappNumber || c.phone,
                      name: c.name,
                      customerId: c._id!,
                    },
                  ]);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Client</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const c = viewingCustomer;
                    setViewingCustomer(null);
                    handleEdit(c);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingCustomer(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition-colors cursor-pointer shadow-md"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Add / Edit Customer Modal (Enterprise Luxury Studio) ── */}
      {showModal && editingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-50/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full shadow-[0_25px_80px_-15px_rgba(0,0,0,0.4)] border border-slate-200/90 relative max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
            
            {/* ── Top Luxury Header ── */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 pb-4 shrink-0 border-b border-slate-700/60">
              <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-rose-500/10 via-amber-500/10 to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all z-10 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15 text-[11px] font-bold text-amber-300 font-mono">
                      {editingCustomer._id ? "CUSTOMER DOSSIER" : "NEW REGISTRATION"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                      {editingCustomer.customerTier || "Mid-Level"} Client
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {(editingCustomer.maritalStatus || "Married") === "Married" ? "💍 Married" : "👤 Unmarried"}
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight">
                    {editingCustomer._id ? `Edit Customer: ${editingCustomer.name || "Profile"}` : "Register New Customer Profile"}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Manage demographic identity, family wedding prospects, occupations, locations and VIP classification.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Scrollable Form Body ── */}
            <form onSubmit={handleSaveCustomer} className="flex-1 flex flex-col min-h-0 overflow-hidden text-xs">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                
                {/* ════════════════ CARD 1: CORE CLIENT & CONTACT DETAILS ════════════════ */}
                <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Core Demographic & Contact Identity
                  </span>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-2 border-b border-slate-100">
                    {/* Drag & Drop Photo with Upload / Replace Progress */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (!photoUploading && !photoDeleting) setIsPhotoDragging(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setIsPhotoDragging(false);
                        }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          setIsPhotoDragging(false);
                          if (photoUploading || photoDeleting) return;
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            await handleUploadPhotoWithProgress(file);
                          }
                        }}
                        onClick={() => {
                          if (!photoUploading && !photoDeleting) {
                            photoFileInputRef.current?.click();
                          }
                        }}
                        className={`relative w-28 h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden shrink-0 transition-all ${
                          isPhotoDragging
                            ? "border-rose-500 bg-rose-50/80 scale-102 ring-2 ring-rose-300"
                            : "border-slate-200 hover:border-rose-400 bg-slate-50"
                        } ${photoUploading || photoDeleting ? "cursor-wait" : "cursor-pointer"}`}
                        title={
                          editingCustomer.photo?.url
                            ? "Click or drop to replace photo (old photo will be deleted from Cloudinary)"
                            : "Click or drop to upload photo"
                        }
                      >
                        <input
                          ref={photoFileInputRef}
                          type="file"
                          accept="image/*"
                          disabled={photoUploading || photoDeleting}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleUploadPhotoWithProgress(file);
                              e.target.value = "";
                            }
                          }}
                          className="hidden"
                        />

                        {/* Active Uploading Progress Overlay */}
                        {photoUploading && (
                          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 p-2 text-center">
                            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin mb-0.5" />
                            <span className="font-mono font-bold text-xs text-emerald-300">
                              {uploadProgress}%
                            </span>
                            <div className="w-16 h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-150"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                            <span className="text-[8px] text-gray-300 mt-0.5 tracking-tight font-medium">
                              {uploadProgress < 30 ? "Compressing..." : "Uploading..."}
                            </span>
                          </div>
                        )}

                        {/* Active Deleting Overlay */}
                        {photoDeleting && (
                          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 p-2 text-center">
                            <RefreshCw className="w-4 h-4 text-rose-400 animate-spin mb-1" />
                            <span className="text-[10px] text-rose-200 font-bold">Removing...</span>
                            <span className="text-[8px] text-gray-300">from Cloudinary</span>
                          </div>
                        )}

                        {/* Photo Display or Placeholder */}
                        {editingCustomer.photo?.url ? (
                          <>
                            <Image
                              src={editingCustomer.photo.url}
                              alt="Customer"
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                            {!photoUploading && !photoDeleting && (
                              <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 shadow-md z-10 transition-colors cursor-pointer"
                                title="Remove photo & delete from Cloudinary"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        ) : (
                          !photoUploading &&
                          !photoDeleting && (
                            <div className="text-center p-2">
                              <Upload className="w-5 h-5 mx-auto text-rose-500 mb-1" />
                              <span className="text-[10px] text-slate-700 font-bold block">
                                Drop Photo
                              </span>
                              <span className="text-[8px] text-slate-400 block">or click to browse</span>
                            </div>
                          )
                        )}
                      </div>

                      {/* Action Buttons for Replace / Remove */}
                      {editingCustomer.photo?.url && !photoUploading && !photoDeleting && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => photoFileInputRef.current?.click()}
                            className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold flex items-center gap-1 transition-colors border border-blue-200 cursor-pointer"
                            title="Replace photo (auto-deletes old from Cloudinary)"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="px-2 py-0.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-[10px] font-bold flex items-center gap-1 transition-colors border border-red-200 cursor-pointer"
                            title="Delete photo from Cloudinary"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Core Name, Phone & WhatsApp */}
                    <div className="flex-1 w-full space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={editingCustomer.name}
                            onChange={(e) =>
                              setEditingCustomer({ ...editingCustomer, name: e.target.value })
                            }
                            placeholder="e.g. Rajesh Kumar Singh"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={editingCustomer.phone}
                            onChange={(e) =>
                              setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                            }
                            placeholder="10 digit mobile"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-bold text-slate-700">WhatsApp Number</label>
                            {editingCustomer.phone && editingCustomer.whatsappNumber !== editingCustomer.phone && (
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingCustomer({ ...editingCustomer, whatsappNumber: editingCustomer.phone })
                                }
                                className="text-[10px] text-emerald-600 hover:underline font-bold"
                              >
                                Same as Phone
                              </button>
                            )}
                          </div>
                          <input
                            type="tel"
                            value={editingCustomer.whatsappNumber || ""}
                            onChange={(e) =>
                              setEditingCustomer({ ...editingCustomer, whatsappNumber: e.target.value })
                            }
                            placeholder="Leave blank if same as phone"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none font-mono focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                          <input
                            type="email"
                            value={editingCustomer.email || ""}
                            onChange={(e) =>
                              setEditingCustomer({ ...editingCustomer, email: e.target.value })
                            }
                            placeholder="client@gmail.com"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-rose-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Marital Status & Demographics Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Customer Marital Status Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>Marital Status</span>
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setEditingCustomer({ ...editingCustomer, maritalStatus: "Married" })}
                          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            (editingCustomer.maritalStatus || "Married") === "Married"
                              ? "bg-white text-slate-900 shadow-sm border border-slate-200/70 font-extrabold"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <span>💍 Married</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCustomer({ ...editingCustomer, maritalStatus: "Unmarried" })}
                          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            editingCustomer.maritalStatus === "Unmarried" || editingCustomer.maritalStatus === "Single"
                              ? "bg-white text-slate-900 shadow-sm border border-slate-200/70 font-extrabold"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <span>👤 Unmarried</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth</label>
                      <input
                        type="date"
                        value={editingCustomer.dateOfBirth || ""}
                        onChange={(e) =>
                          setEditingCustomer({ ...editingCustomer, dateOfBirth: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Age (Approx yrs)</label>
                      <input
                        type="number"
                        value={editingCustomer.age || ""}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            age: e.target.value ? parseInt(e.target.value, 10) : undefined,
                          })
                        }
                        onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                        }}
                        placeholder="e.g. 45"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  {/* If Married: Optional Anniversary & Spouse details */}
                  {(editingCustomer.maritalStatus || "Married") === "Married" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100">
                      <div>
                        <label className="block text-xs font-bold text-rose-950 mb-1">
                          Marriage Anniversary Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={editingCustomer.anniversaryDate || ""}
                          onChange={(e) =>
                            setEditingCustomer({ ...editingCustomer, anniversaryDate: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-rose-200 rounded-xl bg-white outline-none focus:border-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-rose-950 mb-1">
                          Spouse Full Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={editingCustomer.spouseName || ""}
                          onChange={(e) =>
                            setEditingCustomer({ ...editingCustomer, spouseName: e.target.value })
                          }
                          placeholder="e.g. Smt. Sunita Singh"
                          className="w-full px-3 py-2 border border-rose-200 rounded-xl bg-white outline-none focus:border-rose-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ════════════════ CARD 2: CUSTOMER VALUE TIER ════════════════ */}
                <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Customer Value Tier & Spending Classification
                    </span>
                    <span className="text-[10px] text-slate-400">Internal Priority Ranking</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "High-Value", label: "💎 High-Value (VIP / HNI)", desc: "Luxury grand weddings & high budgets" },
                      { id: "Mid-Level", label: "⭐ Mid-Level Client", desc: "Standard complete wedding packages" },
                      { id: "Budget", label: "🏷️ Budget Client", desc: "Minimal / micro functions & setups" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          setEditingCustomer({ ...editingCustomer, customerTier: t.id as any })
                        }
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                          editingCustomer.customerTier === t.id
                            ? t.id === "High-Value"
                              ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-300/40 shadow-xs"
                              : "bg-slate-900 text-white border-slate-900 shadow-md"
                            : "bg-slate-50 border-slate-200/80 hover:bg-slate-100/70 text-slate-700"
                        }`}
                      >
                        <div className={`font-bold text-xs ${editingCustomer.customerTier === t.id && t.id !== "High-Value" ? "text-white" : editingCustomer.customerTier === t.id ? "text-amber-950 font-extrabold" : "text-slate-900"}`}>
                          {t.label}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${editingCustomer.customerTier === t.id && t.id !== "High-Value" ? "text-slate-300" : "text-slate-500"}`}>
                          {t.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ════════════════ CARD 3: OCCUPATIONS & PROFESSIONS ════════════════ */}
                <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Occupations & Professions ({editingCustomer.professions.length} Added)
                    </span>
                    <span className="text-[10px] text-slate-400">Multiple professions allowed</span>
                  </div>

                  {/* Selected professions tags */}
                  <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 rounded-2xl border border-slate-200/70">
                    {editingCustomer.professions.length > 0 ? (
                      editingCustomer.professions.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                        >
                          <Briefcase className="w-3 h-3 text-rose-500" />
                          <span>{p}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingCustomer.professions.filter((_, i) => i !== idx);
                              setEditingCustomer({ ...editingCustomer, professions: updated });
                            }}
                            className="hover:text-red-700 cursor-pointer ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-xs py-0.5">No professions added yet. Click suggestions below or type custom.</span>
                    )}
                  </div>

                  {/* Quick add custom profession */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={professionInput}
                      onChange={(e) => setProfessionInput(e.target.value)}
                      placeholder="Type profession (e.g. Real Estate Developer, Doctor, Farmer)..."
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs outline-none focus:border-rose-400"
                    />
                    <button
                      type="button"
                      disabled={!professionInput.trim()}
                      onClick={() => {
                        if (!professionInput.trim()) return;
                        const val = professionInput.trim();
                        if (!editingCustomer.professions.includes(val)) {
                          setEditingCustomer({
                            ...editingCustomer,
                            professions: [...editingCustomer.professions, val],
                          });
                        }
                        setProfessionInput("");
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
                    >
                      + Add
                    </button>
                  </div>

                  {/* Quick suggestion pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {COMMON_PROFESSIONS.slice(0, 8).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          if (!editingCustomer.professions.includes(p)) {
                            setEditingCustomer({
                              ...editingCustomer,
                              professions: [...editingCustomer.professions, p],
                            });
                          }
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                          editingCustomer.professions.includes(p)
                            ? "bg-rose-100 text-rose-800 border-rose-300 font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        + {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ════════════════ CARD 4: ADDRESSES & LOCATIONS ════════════════ */}
                <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Customer Addresses & Geographic Locations
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Multiple residential, office, or native village addresses for event deliveries.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingCustomer({
                          ...editingCustomer,
                          locations: [
                            ...editingCustomer.locations,
                            {
                              label: "Other",
                              address: "",
                              mapUrl: "",
                              state: "Madhya Pradesh",
                              city: "Rewa",
                              isPrimary: false,
                            },
                          ],
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Location</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingCustomer.locations.map((loc, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-600" />
                            <span>Location #{idx + 1}</span>
                          </span>

                          {editingCustomer.locations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingCustomer.locations.filter((_, i) => i !== idx);
                                setEditingCustomer({ ...editingCustomer, locations: updated });
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete location"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Row 1: Location Label & Google Map Link */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Location Label</label>
                            <input
                              type="text"
                              value={loc.label}
                              onChange={(e) => {
                                const updated = [...editingCustomer.locations];
                                updated[idx].label = e.target.value;
                                setEditingCustomer({ ...editingCustomer, locations: updated });
                              }}
                              placeholder="Home / Office / Farmhouse / Village"
                              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-rose-400 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                              <span>Google Map Link (Optional)</span>
                              {loc.mapUrl && (
                                <a
                                  href={loc.mapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-0.5 text-[10px] font-bold"
                                >
                                  <span>Test Link</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </label>
                            <input
                              type="url"
                              value={loc.mapUrl || ""}
                              onChange={(e) => {
                                const updated = [...editingCustomer.locations];
                                updated[idx].mapUrl = e.target.value;
                                setEditingCustomer({ ...editingCustomer, locations: updated });
                              }}
                              placeholder="https://maps.app.goo.gl/..."
                              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-mono text-[11px] outline-none focus:border-rose-400"
                            />
                          </div>
                        </div>

                        {/* Row 2: State & City Selection (Vendor-style) */}
                        <div className="bg-gradient-to-br from-rose-50/40 via-amber-50/20 to-orange-50/20 p-3 rounded-2xl border border-rose-100/80 space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* 1. State / UT */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                1. Select State / UT <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={loc.state || "Madhya Pradesh"}
                                onChange={(e) => {
                                  const newState = e.target.value;
                                  const stateCities = INDIAN_STATES_AND_CITIES[newState] || [];
                                  const updated = [...editingCustomer.locations];
                                  updated[idx].state = newState;
                                  updated[idx].city = stateCities[0] || "";
                                  setEditingCustomer({ ...editingCustomer, locations: updated });
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-rose-400 font-medium text-slate-800"
                              >
                                {INDIAN_STATES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* 2. City / District */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[11px] font-bold text-slate-700">
                                  2. Select or Add City <span className="text-rose-500">*</span>
                                </label>
                                <span className="text-[10px] text-rose-600 font-medium">Type any city</span>
                              </div>
                              <input
                                type="text"
                                list={`customerCityList_${idx}`}
                                placeholder="Rewa, Satna, Bhopal or custom..."
                                value={loc.city || ""}
                                onChange={(e) => {
                                  const updated = [...editingCustomer.locations];
                                  updated[idx].city = e.target.value;
                                  setEditingCustomer({ ...editingCustomer, locations: updated });
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-rose-400 font-medium text-slate-900"
                              />
                              <datalist id={`customerCityList_${idx}`}>
                                {(INDIAN_STATES_AND_CITIES[loc.state || "Madhya Pradesh"] || []).map((c) => (
                                  <option key={c} value={c} />
                                ))}
                              </datalist>
                            </div>
                          </div>

                          {/* Quick City Suggestions for Selected State */}
                          {(() => {
                            const stateCities = INDIAN_STATES_AND_CITIES[loc.state || "Madhya Pradesh"] || [];
                            const quickPills = stateCities.slice(0, 6);
                            if (quickPills.length === 0) return null;
                            return (
                              <div>
                                <span className="text-[10px] text-slate-400 block mb-1">
                                  Popular cities in {loc.state || "Madhya Pradesh"}:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {quickPills.map((c) => {
                                    const isSelected = (loc.city || "").toLowerCase() === c.toLowerCase();
                                    return (
                                      <button
                                        key={c}
                                        type="button"
                                        onClick={() => {
                                          const updated = [...editingCustomer.locations];
                                          updated[idx].city = c;
                                          setEditingCustomer({ ...editingCustomer, locations: updated });
                                        }}
                                        className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                                          isSelected
                                            ? "bg-rose-500 text-white shadow-2xs"
                                            : "bg-white text-slate-600 border border-slate-200 hover:border-rose-300"
                                        }`}
                                      >
                                        {c}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Street Address</label>
                          <input
                            type="text"
                            required
                            value={loc.address}
                            onChange={(e) => {
                              const updated = [...editingCustomer.locations];
                              updated[idx].address = e.target.value;
                              setEditingCustomer({ ...editingCustomer, locations: updated });
                            }}
                            placeholder="Street, Landmark, Ward No, Area"
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-rose-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ════════════════ CARD 5: CHILDREN & FAMILY MEMBERS (WEDDING PROSPECTS STUDIO) ════════════════ */}
                <div className="p-5 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-amber-50/20 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                        <Baby className="w-4 h-4 text-amber-600" />
                        <span>Children & Family Members (Wedding Prospects Studio)</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {editingCustomer.children.length} Relatives
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Track children, exact ages, custom relations, and <strong>Marital Status (Unmarried / Married)</strong> to identify upcoming wedding opportunities.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingCustomer({
                          ...editingCustomer,
                          children: [
                            ...editingCustomer.children,
                            { name: "", relation: "Son", gender: "Male", age: undefined, maritalStatus: "Unmarried", notes: "" },
                          ],
                        });
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Family Member</span>
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {editingCustomer.children.map((child, cIdx) => {
                      const isPredefined = STANDARD_RELATIONS.includes(child.relation || "");
                      const selectedRelationValue = isPredefined ? child.relation || "Son" : "Custom";

                      return (
                        <div
                          key={cIdx}
                          className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:border-amber-300 transition-colors"
                        >
                          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[10px]">
                                #{cIdx + 1}
                              </span>
                              <strong className="text-slate-900 text-xs">
                                {child.name || "Family Member"}
                              </strong>
                              {child.relation && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-[10px]">
                                  {child.relation}
                                </span>
                              )}
                              {(child.maritalStatus || "Unmarried") === "Unmarried" ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-950 border border-amber-300">
                                  💍 Upcoming Wedding Prospect
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700">
                                  ✓ Married
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingCustomer.children.filter((_, i) => i !== cIdx);
                                setEditingCustomer({ ...editingCustomer, children: updated });
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remove member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                            {/* Relation Selector */}
                            <div className={selectedRelationValue === "Custom" ? "sm:col-span-3" : "sm:col-span-3"}>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Relation
                              </label>
                              <select
                                value={selectedRelationValue}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = [...editingCustomer.children];
                                  if (val === "Custom") {
                                    updated[cIdx].relation = "";
                                  } else {
                                    updated[cIdx].relation = val;
                                    if (["Son", "Brother", "Nephew", "Son-in-law", "Grandson"].includes(val)) {
                                      updated[cIdx].gender = "Male";
                                    } else if (
                                      ["Daughter", "Sister", "Niece", "Daughter-in-law", "Granddaughter"].includes(val)
                                    ) {
                                      updated[cIdx].gender = "Female";
                                    }
                                  }
                                  setEditingCustomer({ ...editingCustomer, children: updated });
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none cursor-pointer"
                              >
                                <option value="Son">Son (Beta)</option>
                                <option value="Daughter">Daughter (Beti)</option>
                                <option value="Brother">Brother (Bhai)</option>
                                <option value="Sister">Sister (Behan)</option>
                                <option value="Nephew">Nephew (Bhatija / Bhanja)</option>
                                <option value="Niece">Niece (Bhatiji / Bhanji)</option>
                                <option value="Daughter-in-law">Daughter-in-law (Bahu)</option>
                                <option value="Son-in-law">Son-in-law (Damad)</option>
                                <option value="Grandson">Grandson (Pota / Naati)</option>
                                <option value="Granddaughter">Granddaughter (Poti / Naatin)</option>
                                <option value="Custom">✏️ Custom Relation...</option>
                              </select>
                            </div>

                            {/* Custom Relation input if Custom is chosen */}
                            {selectedRelationValue === "Custom" && (
                              <div className="sm:col-span-3">
                                <label className="block text-[11px] font-bold text-rose-600 mb-1">
                                  Custom Relation *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Bhatija, Bahu, Damad"
                                  value={child.relation || ""}
                                  onChange={(e) => {
                                    const updated = [...editingCustomer.children];
                                    updated[cIdx].relation = e.target.value;
                                    setEditingCustomer({ ...editingCustomer, children: updated });
                                  }}
                                  className="w-full px-3 py-2 text-xs border border-rose-300 rounded-xl bg-rose-50/40 focus:bg-white outline-none"
                                />
                              </div>
                            )}

                            {/* Full Name */}
                            <div className={selectedRelationValue === "Custom" ? "sm:col-span-3" : "sm:col-span-4"}>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                placeholder="Full Name"
                                value={child.name}
                                onChange={(e) => {
                                  const updated = [...editingCustomer.children];
                                  updated[cIdx].name = e.target.value;
                                  setEditingCustomer({ ...editingCustomer, children: updated });
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-rose-400"
                              />
                            </div>

                            {/* Age in Years */}
                            <div className={selectedRelationValue === "Custom" ? "sm:col-span-1" : "sm:col-span-2"}>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Age (yrs)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="120"
                                placeholder="Age"
                                value={child.age !== undefined ? child.age : ""}
                                onChange={(e) => {
                                  const updated = [...editingCustomer.children];
                                  updated[cIdx].age = e.target.value ? parseInt(e.target.value, 10) : undefined;
                                  setEditingCustomer({ ...editingCustomer, children: updated });
                                }}
                                onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                                onKeyDown={(e) => {
                                  if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                                }}
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none text-center font-mono focus:border-rose-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </div>

                            {/* Gender */}
                            <div className={selectedRelationValue === "Custom" ? "sm:col-span-2" : "sm:col-span-3"}>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Gender
                              </label>
                              <select
                                value={child.gender || "Other"}
                                onChange={(e) => {
                                  const updated = [...editingCustomer.children];
                                  updated[cIdx].gender = e.target.value as any;
                                  setEditingCustomer({ ...editingCustomer, children: updated });
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none cursor-pointer"
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          {/* Member Marital Status & Event Notes Studio */}
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 items-center">
                            {/* Member Marital Status (Unmarried / Married) */}
                            <div className="sm:col-span-5">
                              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                <Heart className="w-3.5 h-3.5 text-rose-500" />
                                <span>Marital Status</span>
                              </label>
                              <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...editingCustomer.children];
                                    updated[cIdx].maritalStatus = "Unmarried";
                                    setEditingCustomer({ ...editingCustomer, children: updated });
                                  }}
                                  className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                    (child.maritalStatus || "Unmarried") === "Unmarried"
                                      ? "bg-amber-100 text-amber-950 font-extrabold shadow-2xs border border-amber-300"
                                      : "text-slate-500 hover:text-slate-800"
                                  }`}
                                >
                                  <span>💍 Unmarried</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...editingCustomer.children];
                                    updated[cIdx].maritalStatus = "Married";
                                    setEditingCustomer({ ...editingCustomer, children: updated });
                                  }}
                                  className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                    child.maritalStatus === "Married"
                                      ? "bg-slate-900 text-white font-extrabold shadow-2xs"
                                      : "text-slate-500 hover:text-slate-800"
                                  }`}
                                >
                                  <span>✓ Married</span>
                                </button>
                              </div>
                            </div>

                            {/* Upcoming Wedding / Function Notes */}
                            <div className="sm:col-span-7">
                              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>Upcoming Wedding / Event Notes</span>
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Marriage planned for Nov 2026, studying in Delhi..."
                                value={child.notes || ""}
                                onChange={(e) => {
                                  const updated = [...editingCustomer.children];
                                  updated[cIdx].notes = e.target.value;
                                  setEditingCustomer({ ...editingCustomer, children: updated });
                                }}
                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-rose-400"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {editingCustomer.children.length === 0 && (
                      <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Baby className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                        <p className="font-semibold text-slate-700 text-xs">No family members or children recorded</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Click &quot;+ Add Family Member&quot; above to track son/daughter ages and whether they are Married or Unmarried for wedding planning.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ════════════════ CARD 6: INTERNAL CRM NOTES ════════════════ */}
                <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Customer Internal CRM Notes & VIP Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={editingCustomer.notes || ""}
                    onChange={(e) =>
                      setEditingCustomer({ ...editingCustomer, notes: e.target.value })
                    }
                    placeholder="Specific floral preferences, family background, negotiation style, VIP connections, budget sensitivity..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl bg-white text-xs outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                  />
                </div>

              </div>

              {/* ── Sticky Modal Footer with Actions ── */}
              <div className="p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    {(editingCustomer.maritalStatus || "Married") === "Married" ? "💍 Married" : "👤 Unmarried"}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 font-bold border border-amber-200">
                    {editingCustomer.children.length} Family Members
                  </span>
                  {editingCustomer.children.filter((c) => (c.maritalStatus || "Unmarried") === "Unmarried").length > 0 && (
                    <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 font-bold border border-rose-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-rose-500" />
                      <span>
                        {editingCustomer.children.filter((c) => (c.maritalStatus || "Unmarried") === "Unmarried").length} Wedding Prospects
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading || uploadingImage || photoUploading || photoDeleting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                  >
                    {saveLoading
                      ? "Saving Profile..."
                      : photoDeleting
                      ? "Removing Photo..."
                      : "Save Customer Profile"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
