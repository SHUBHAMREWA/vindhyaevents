"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Briefcase,
  BookOpen,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Search,
  RefreshCw,
  MessageSquare,
  Sparkles,
  Save,
  X,
  AlertCircle,
  ShieldCheck,
  UserPlus,
  Quote,
  Star,
  ImageOff,
  Heart,
  Menu,
  Eye,
  CalendarDays,
  Ban,
  UserCheck,
} from "lucide-react";

// Client-side image compression and WebP conversion helper
const compressImageToWebP = async (file: File, maxWidth = 1200, quality = 0.85): Promise<File> => {
  if (!file.type.startsWith("image/")) return file;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(webpFile);
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"inquiries" | "hero_banner" | "services" | "blogs" | "gallery" | "testimonials" | "team" | "settings" | "admins">("inquiries");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Data states
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);

  // Search & Filter
  const [searchInquiry, setSearchInquiry] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [viewInquiry, setViewInquiry] = useState<any | null>(null);
  const [inquiryNoteDraft, setInquiryNoteDraft] = useState("");

  useEffect(() => {
    if (viewInquiry) {
      setInquiryNoteDraft(viewInquiry.adminNotes || "");
    }
  }, [viewInquiry]);

  // Modal / Form states
  const [showModal, setShowModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Check auth and fetch initial data
  useEffect(() => {
    fetchAdminAndData();
  }, []);

  const fetchAdminAndData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData.success) {
        router.push("/login");
        return;
      }
      setAdminUser(meData.admin);

      await Promise.all([
        fetchInquiries(),
        fetchServices(),
        fetchBlogs(),
        fetchGallery(),
        fetchTestimonials(),
        fetchTeam(),
        fetchSettings(),
        fetchAdmins(),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) setAdmins(data.users || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const fetchInquiries = async () => {
    const res = await fetch("/api/admin/inquiries");
    const data = await res.json();
    if (data.success) setInquiries(data.inquiries || []);
  };

  const fetchServices = async () => {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    if (data.success) setServices(data.services || []);
  };

  const fetchBlogs = async () => {
    const res = await fetch("/api/admin/blogs");
    const data = await res.json();
    if (data.success) setBlogs(data.blogs || []);
  };

  const fetchGallery = async () => {
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    if (data.success) setGallery(data.items || []);
  };

  const fetchTestimonials = async () => {
    const res = await fetch("/api/admin/testimonials");
    const data = await res.json();
    if (data.success) setTestimonials(data.testimonials || []);
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.success) setTeam(data.team || []);
    } catch (err) {
      console.error("Error fetching team:", err);
    }
  };

  const fetchSettings = async () => {
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    if (data.success) setSettings(data.settings || {});
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  // Image upload helper with canvas compression & WebP conversion
  const handleFileUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const webpFile = await compressImageToWebP(file);
      const formData = new FormData();
      formData.append("file", webpFile);
      formData.append("folder", "riwaj_events");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        return data.data; // { url, public_id }
      } else {
        alert(data.message || "Failed to upload image to Cloudinary");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Testimonial actions
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const method = modalData._id ? "PUT" : "POST";
      const payload = modalData._id ? { id: modalData._id, ...modalData } : modalData;
      const res = await fetch("/api/admin/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (d.success) {
        setShowModal(null);
        fetchTestimonials();
      } else {
        alert(d.message || "Failed to save testimonial");
      }
    } catch (err) {
      alert("Error saving testimonial");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial? Any photo attached will also be permanently deleted from Cloudinary.")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        fetchTestimonials();
      } else {
        alert(d.message);
      }
    } catch (err) {
      alert("Error deleting testimonial");
    }
  };

  const handleDeleteTestimonialPhoto = async (id: string) => {
    if (!confirm("Are you sure you want to delete only this photo from Cloudinary? The testimonial review will remain.")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}&deletePhotoOnly=true`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        fetchTestimonials();
        if (modalData._id === id) {
          setModalData({ ...modalData, image: { url: "", public_id: "", alt: "" } });
        }
      } else {
        alert(d.message);
      }
    } catch (err) {
      alert("Error deleting photo");
    }
  };

  // Team Member actions
  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const method = modalData._id ? "PUT" : "POST";
      const payload = modalData._id ? { id: modalData._id, ...modalData } : modalData;
      const res = await fetch("/api/admin/team", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (d.success) {
        setShowModal(null);
        fetchTeam();
      } else {
        alert(d.message || "Failed to save team member");
      }
    } catch {
      alert("Error saving team member");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member? Any photo attached will also be permanently deleted from Cloudinary.")) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        fetchTeam();
      } else {
        alert(d.message);
      }
    } catch {
      alert("Error deleting team member");
    }
  };

  const handleDeleteTeamPhoto = async (id: string) => {
    if (!confirm("Are you sure you want to delete only this photo from Cloudinary? The team member profile will remain.")) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}&deletePhotoOnly=true`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        fetchTeam();
        if (modalData && modalData._id === id) {
          setModalData({ ...modalData, image: { url: "", public_id: "", alt: "" } });
        }
      } else {
        alert(d.message);
      }
    } catch {
      alert("Error deleting photo");
    }
  };

  // Inquiry actions
  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchInquiries();
      if (viewInquiry && viewInquiry._id === id) {
        setViewInquiry((prev: any) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleUpdateInquiryNote = async (id: string, notes: string) => {
    setSaveLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminNotes: notes }),
      });
      const d = await res.json();
      setSaveLoading(false);
      if (d.success) {
        setFeedbackMsg("Internal admin notes saved!");
        setTimeout(() => setFeedbackMsg(""), 3000);
        fetchInquiries();
        if (viewInquiry && viewInquiry._id === id) {
          setViewInquiry((prev: any) => (prev ? { ...prev, adminNotes: notes } : null));
        }
      } else {
        alert(d.message || "Failed to save notes");
      }
    } catch (err) {
      setSaveLoading(false);
      alert("Error saving notes");
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this consultation record?")) return;
    await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
    if (viewInquiry && viewInquiry._id === id) {
      setViewInquiry(null);
    }
    fetchInquiries();
  };

  // Inquiry Save (Create or Edit)
  const handleSaveInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData.name?.trim() || !modalData.phone?.trim()) {
      alert("Client name and phone number are required.");
      return;
    }
    setSaveLoading(true);
    try {
      const isEdit = !!modalData._id;
      const res = await fetch("/api/admin/inquiries", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { id: modalData._id, ...modalData } : modalData),
      });
      const d = await res.json();
      setSaveLoading(false);
      if (d.success) {
        setShowModal(null);
        setModalData({});
        setFeedbackMsg(isEdit ? "Lead updated successfully!" : "New consultation lead created!");
        setTimeout(() => setFeedbackMsg(""), 3500);
        fetchInquiries();
      } else {
        alert(d.message || "Failed to save lead");
      }
    } catch (err) {
      setSaveLoading(false);
      alert("Error saving lead");
    }
  };

  // CSV Export
  const exportInquiriesToCSV = () => {
    if (!inquiries.length) return alert("No inquiries to export");
    const headers = ["Name", "Phone", "Email", "Event Type", "Event Date", "Status", "Message", "Created At"];
    const rows = inquiries.map((i) => [
      `"${i.name || ""}"`,
      `"${i.phone || ""}"`,
      `"${i.email || ""}"`,
      `"${i.eventType || ""}"`,
      `"${i.date || ""}"`,
      `"${i.status || ""}"`,
      `"${(i.message || "").replace(/"/g, '""')}"`,
      `"${new Date(i.createdAt).toLocaleString()}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RIWAJ_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Service Save
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    const method = modalData._id ? "PUT" : "POST";
    const res = await fetch("/api/admin/services", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modalData._id ? { id: modalData._id, ...modalData } : modalData),
    });
    const d = await res.json();
    setSaveLoading(false);
    if (d.success) {
      setShowModal(null);
      fetchServices();
    } else alert(d.message);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    fetchServices();
  };

  // Blog Save
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    const method = modalData._id ? "PUT" : "POST";
    const res = await fetch("/api/admin/blogs", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modalData._id ? { id: modalData._id, ...modalData } : modalData),
    });
    const d = await res.json();
    setSaveLoading(false);
    if (d.success) {
      setShowModal(null);
      fetchBlogs();
    } else alert(d.message);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  // Gallery Save
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    const method = modalData._id ? "PUT" : "POST";
    const res = await fetch("/api/admin/gallery", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modalData._id ? { id: modalData._id, ...modalData } : modalData),
    });
    const d = await res.json();
    setSaveLoading(false);
    if (d.success) {
      setShowModal(null);
      fetchGallery();
    } else alert(d.message);
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this photo? It will be removed from the gallery and erased from Cloudinary media storage.")) return;
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) {
      setFeedbackMsg("Photo permanently erased from gallery and Cloudinary!");
      setTimeout(() => setFeedbackMsg(""), 3500);
      fetchGallery();
    } else {
      alert(d.message || "Failed to delete photo");
    }
  };

  // Admin User Save
  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modalData),
    });
    const d = await res.json();
    setSaveLoading(false);
    if (d.success) {
      setShowModal(null);
      setModalData({});
      setFeedbackMsg(d.message || "Admin access granted!");
      setTimeout(() => setFeedbackMsg(""), 3500);
      fetchAdmins();
    } else {
      alert(d.message || "Failed to add admin user");
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke admin access for ${email}? They will no longer be able to log in or manage website content.`)) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) {
      setFeedbackMsg(d.message || "Admin access revoked");
      setTimeout(() => setFeedbackMsg(""), 3500);
      fetchAdmins();
    } else {
      alert(d.message || "Failed to revoke admin access");
    }
  };

  // Settings Save
  const handleSaveSettings = async (e?: React.FormEvent, customPayload?: any) => {
    if (e) e.preventDefault();
    setSaveLoading(true);
    const dataToSend = customPayload || settings;
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const d = await res.json();
      setSaveLoading(false);
      if (d.success) {
        setFeedbackMsg("Banner & settings saved successfully!");
        setTimeout(() => setFeedbackMsg(""), 3500);
        fetchSettings();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("riwaj-settings-updated"));
        }
      } else {
        alert(d.message || "Failed to save settings");
      }
    } catch (err) {
      setSaveLoading(false);
      alert("Error saving settings");
    }
  };

  // Hero Slide Handlers
  const handleSaveHeroSlideModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData.title?.trim() || !modalData.imageUrl?.trim()) {
      alert("Slide Title and Image URL are required.");
      return;
    }

    const currentSlides = Array.isArray(settings?.heroSlides) ? [...settings.heroSlides] : [];
    const slideToSave = {
      title: modalData.title.trim(),
      subtitle: (modalData.subtitle || "").trim(),
      image: {
        url: modalData.imageUrl.trim(),
        public_id: modalData.public_id || "",
      },
      ctaText: (modalData.ctaText || "Book Consultation").trim(),
      ctaLink: (modalData.ctaLink || "/contact").trim(),
      order: modalData.order !== undefined ? Number(modalData.order) : currentSlides.length + 1,
    };

    let updatedSlides: any[];
    if (modalData.slideIndex !== undefined && modalData.slideIndex >= 0) {
      updatedSlides = [...currentSlides];
      updatedSlides[modalData.slideIndex] = slideToSave;
    } else {
      updatedSlides = [...currentSlides, slideToSave];
    }

    const updatedSettings = {
      ...settings,
      heroSlides: updatedSlides,
    };

    setSettings(updatedSettings);
    setShowModal(null);
    setModalData({});
    await handleSaveSettings(undefined, updatedSettings);
  };

  const handleDeleteHeroSlide = async (index: number) => {
    if (!confirm("Are you sure you want to remove this hero slide?")) return;
    const currentSlides = Array.isArray(settings?.heroSlides) ? [...settings.heroSlides] : [];
    const updatedSlides = currentSlides.filter((_, i) => i !== index);
    const updatedSettings = { ...settings, heroSlides: updatedSlides };
    setSettings(updatedSettings);
    await handleSaveSettings(undefined, updatedSettings);
  };

  const handleMoveHeroSlide = async (index: number, direction: "up" | "down") => {
    const currentSlides = Array.isArray(settings?.heroSlides) ? [...settings.heroSlides] : [];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSlides.length) return;

    const temp = currentSlides[index];
    currentSlides[index] = currentSlides[targetIndex];
    currentSlides[targetIndex] = temp;

    const updatedSettings = { ...settings, heroSlides: currentSlides };
    setSettings(updatedSettings);
    await handleSaveSettings(undefined, updatedSettings);
  };

  const handleLoadDefaultHeroSlides = async () => {
    const defaultSlides = [
      {
        title: "Wedding Planner in Rewa, Madhya Pradesh",
        subtitle: "500+ Love Stories Crafted Since 2013 — Your Dream Wedding Awaits",
        image: { url: "/girlsimg.webp" },
        ctaText: "Book Consultation",
        ctaLink: "/contact",
        order: 1,
      },
      {
        title: "Celebrating Every Tradition",
        subtitle: "आपके रीति-रिवाज़ को खूबसूरत सजावट के साथ मनाएं",
        image: { url: "/dercoration1.webp" },
        ctaText: "Book Consultation",
        ctaLink: "/contact",
        order: 2,
      },
      {
        title: "Full-Service Wedding Planning",
        subtitle: "From Mehndi to Baraat — Every Detail Perfectly Managed",
        image: { url: "https://images.unsplash.com/photo-1724847664960-5060a1ae8259?w=1200&q=75" },
        ctaText: "Book Consultation",
        ctaLink: "/contact",
        order: 3,
      },
      {
        title: "Luxury Décor & Floral Design",
        subtitle: "Transforming Venues into Breathtaking Celebrations",
        image: { url: "https://images.unsplash.com/photo-1732382643619-872165f61891?w=1200&q=75" },
        ctaText: "Book Consultation",
        ctaLink: "/contact",
        order: 4,
      },
    ];
    const updatedSettings = {
      ...settings,
      heroSlides: defaultSlides,
      bannerText: settings?.bannerText || "🎉 Welcome to Vindhya Events — Weddings & Events",
      showTopBanner: settings?.showTopBanner ?? true,
      taglineHindi: settings?.taglineHindi || "✨ आपके रीति रिवाज सजावट के साथ ✨",
    };
    setSettings(updatedSettings);
    await handleSaveSettings(undefined, updatedSettings);
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchStatus = statusFilter === "all" || inq.status === statusFilter;
    const matchSearch =
      inq.name?.toLowerCase().includes(searchInquiry.toLowerCase()) ||
      inq.phone?.includes(searchInquiry) ||
      inq.email?.toLowerCase().includes(searchInquiry.toLowerCase()) ||
      inq.eventType?.toLowerCase().includes(searchInquiry.toLowerCase());

    let matchDate = true;
    if (startDateFilter || endDateFilter) {
      const created = new Date(inq.createdAt).getTime();
      if (startDateFilter) {
        const start = new Date(startDateFilter);
        start.setHours(0, 0, 0, 0);
        if (created < start.getTime()) matchDate = false;
      }
      if (endDateFilter) {
        const end = new Date(endDateFilter);
        end.setHours(23, 59, 59, 999);
        if (created > end.getTime()) matchDate = false;
      }
    }

    return matchStatus && matchSearch && matchDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading RIWAJ Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            title="Open Admin Menu"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-serif font-black shadow-md shrink-0">
              R
            </div>
            <div>
              <h1 className="font-serif text-base sm:text-lg font-black text-gray-900 leading-tight tracking-wider">RIWAJ</h1>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">Luxury Wedding CMS</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
          >
            <span className="hidden sm:inline">View Live Site</span>
            <span className="sm:hidden">Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="hidden sm:block h-6 w-px bg-gray-200" />

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-gray-700">{adminUser?.name || "Admin"}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Drawer Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-serif font-black shadow-sm">
                    R
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-black text-gray-900 leading-tight">RIWAJ</h3>
                    <p className="text-[10px] text-gray-500">Admin Control Menu</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Menu items in Drawer */}
              <div className="p-3 space-y-1">
                {[
                  { id: "inquiries", label: "Consultation Leads", icon: Users, badge: inquiries.filter((i) => i.status === "pending").length },
                  { id: "hero_banner", label: "Banner & Hero", icon: Sparkles, count: settings?.heroSlides?.length || 0 },
                  { id: "services", label: "Manage Services", icon: Briefcase, count: services.length },
                  { id: "blogs", label: "Wedding Blogs", icon: BookOpen, count: blogs.length },
                  { id: "gallery", label: "Event Gallery", icon: ImageIcon, count: gallery.length },
                  { id: "testimonials", label: "Client Reviews", icon: Quote, count: testimonials.length },
                  { id: "team", label: "Meet Our Team", icon: UserCheck, count: team.length },
                  { id: "settings", label: "Site & Contacts", icon: Settings },
                  { id: "admins", label: "Team Access", icon: ShieldCheck, count: admins.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge ? (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${isActive ? "bg-white text-rose-600" : "bg-rose-100 text-rose-700"}`}>
                          {tab.badge}
                        </span>
                      ) : tab.count !== undefined ? (
                        <span className={`text-xs ${isActive ? "text-rose-100" : "text-gray-400"}`}>{tab.count}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Quick Metrics in Drawer */}
              <div className="m-3 p-3.5 rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-rose-900 mb-2 text-[11px]">Live Status</h4>
                <div className="space-y-1.5 text-gray-700">
                  <div className="flex justify-between">
                    <span>Pending Leads:</span>
                    <span className="font-bold text-rose-600">{inquiries.filter((i) => i.status === "pending").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Client Reviews:</span>
                    <span className="font-semibold">{testimonials.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Services:</span>
                    <span className="font-semibold">{services.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gallery Photos:</span>
                    <span className="font-semibold">{gallery.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom info & Logout in Drawer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-gray-800">{adminUser?.name || "Admin"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar Nav (Hidden on Mobile) */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4 shrink-0">
          <div className="space-y-1">
            {[
              { id: "inquiries", label: "Consultation Leads", icon: Users, badge: inquiries.filter((i) => i.status === "pending").length },
              { id: "hero_banner", label: "Banner & Hero", icon: Sparkles, count: settings?.heroSlides?.length || 0 },
              { id: "services", label: "Manage Services", icon: Briefcase, count: services.length },
              { id: "blogs", label: "Wedding Blogs", icon: BookOpen, count: blogs.length },
              { id: "gallery", label: "Event Gallery", icon: ImageIcon, count: gallery.length },
              { id: "testimonials", label: "Client Reviews", icon: Quote, count: testimonials.length },
              { id: "team", label: "Meet Our Team", icon: UserCheck, count: team.length },
              { id: "settings", label: "Site & Contacts", icon: Settings },
              { id: "admins", label: "Team Access", icon: ShieldCheck, count: admins.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge ? (
                    <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${isActive ? "bg-white text-rose-600" : "bg-rose-100 text-rose-700"}`}>
                      {tab.badge}
                    </span>
                  ) : tab.count !== undefined ? (
                    <span className={`text-xs ${isActive ? "text-rose-100" : "text-gray-400"}`}>{tab.count}</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Quick Metrics Card */}
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border border-rose-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2">Live Status</h4>
            <div className="text-xs space-y-1.5 text-gray-700">
              <div className="flex justify-between">
                <span>Pending Leads:</span>
                <span className="font-bold text-rose-600">{inquiries.filter((i) => i.status === "pending").length}</span>
              </div>
              <div className="flex justify-between">
                <span>Client Reviews:</span>
                <span className="font-semibold">{testimonials.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Services:</span>
                <span className="font-semibold">{services.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Gallery Photos:</span>
                <span className="font-semibold">{gallery.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full">
          {/* TAB 1: INQUIRIES & LEADS */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Consultation Inquiries</h2>
                  <p className="text-sm text-gray-500">Leads submitted by couples on your website consultation form or added manually</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setModalData({
                        name: "",
                        phone: "",
                        email: "",
                        eventType: "Wedding",
                        date: "",
                        guestCount: "",
                        budget: "",
                        message: "",
                        status: "pending",
                        adminNotes: "",
                        source: "Admin Manual Entry",
                      });
                      setShowModal("inquiry");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Lead</span>
                  </button>
                  <button
                    onClick={exportInquiriesToCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={fetchInquiries}
                    title="Refresh Inquiries"
                    className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
                  {/* Search Box */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, phone, or email..."
                      value={searchInquiry}
                      onChange={(e) => setSearchInquiry(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  {/* Two Date Calendar Range Filter */}
                  <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 font-semibold pl-1 text-[11px]">
                      <CalendarDays className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>Date Filter:</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400">From</span>
                      <input
                        type="date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-400"
                        title="Start Date"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400">To</span>
                      <input
                        type="date"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-400"
                        title="End Date"
                      />
                    </div>
                    {(startDateFilter || endDateFilter) && (
                      <button
                        onClick={() => {
                          setStartDateFilter("");
                          setEndDateFilter("");
                        }}
                        className="px-2 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Clear Date Filters"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {["all", "pending", "contacted", "in_discussion", "booked", "cancelled", "archived"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                        statusFilter === st
                          ? st === "cancelled"
                            ? "bg-red-600 text-white shadow-sm"
                            : "bg-rose-500 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {st === "in_discussion" ? "In Discussion" : st === "cancelled" ? "Cancelled ✕" : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiries Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Client Name</th>
                        <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                        <th className="py-3.5 px-4 font-semibold">Event Details</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold">Date Submitted</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-400">
                            No consultation inquiries found.
                          </td>
                        </tr>
                      ) : (
                        filteredInquiries.map((inq) => (
                          <tr
                            key={inq._id}
                            onClick={() => setViewInquiry(inq)}
                            className="hover:bg-rose-50/40 transition-colors cursor-pointer group"
                            title="Click to view full inquiry details"
                          >
                            <td className="py-4 px-4 font-medium text-gray-900">
                              <div className="font-bold text-sm text-gray-900 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                                <span>{inq.name}</span>
                              </div>
                              {inq.message && <p className="text-[11px] text-gray-500 italic mt-0.5 line-clamp-1">"{inq.message}"</p>}
                            </td>
                            <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="font-semibold text-gray-800">{inq.phone}</div>
                              {inq.email && <div className="text-gray-500">{inq.email}</div>}
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[11px]">
                                {inq.eventType || "Wedding"}
                              </span>
                              {inq.date && <div className="text-gray-500 text-[11px] mt-0.5">Date: {inq.date}</div>}
                            </td>
                            <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={inq.status}
                                onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border-none cursor-pointer focus:ring-2 focus:ring-rose-400 ${
                                  inq.status === "pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : inq.status === "contacted"
                                    ? "bg-blue-100 text-blue-800"
                                    : inq.status === "in_discussion"
                                    ? "bg-purple-100 text-purple-800"
                                    : inq.status === "booked"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : inq.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="contacted">Contacted</option>
                                <option value="in_discussion">In Discussion</option>
                                <option value="booked">Booked 💍</option>
                                <option value="cancelled">Cancelled ✕</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>
                            <td className="py-4 px-4 text-gray-500">
                              {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setViewInquiry(inq)}
                                  title="View Full Details"
                                  className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <a
                                  href={`tel:${inq.phone}`}
                                  title="Call Client"
                                  className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
                                    inq.name
                                  )}%2C%20thank%20you%20for%20contacting%20RIWAJ!`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="WhatsApp Client"
                                  className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => {
                                    setModalData({
                                      _id: inq._id,
                                      name: inq.name || "",
                                      phone: inq.phone || "",
                                      email: inq.email || "",
                                      eventType: inq.eventType || "Wedding",
                                      date: inq.date || "",
                                      guestCount: inq.guestCount || "",
                                      budget: inq.budget || "",
                                      message: inq.message || "",
                                      status: inq.status || "pending",
                                      adminNotes: inq.adminNotes || "",
                                      source: inq.source || "Website Consultation Form",
                                    });
                                    setShowModal("inquiry");
                                  }}
                                  title="Edit Lead"
                                  className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteInquiry(inq._id)}
                                  title="Delete Lead"
                                  className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Wedding Services</h2>
                  <p className="text-sm text-gray-500">Manage all services, packages, decor offerings, and descriptions</p>
                </div>
                <button
                  onClick={() => {
                    setModalData({ title: "", shortDescription: "", category: "Planning", iconName: "Sparkles", features: [] });
                    setShowModal("service");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl text-xs font-semibold shadow-md hover:opacity-90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((svc) => (
                  <div key={svc._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                    {svc.coverImage?.url && (
                      <div className="relative h-44 w-full bg-gray-100">
                        <Image src={svc.coverImage.url} alt={svc.title} fill className="object-cover" sizes="33vw" />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-rose-600">
                          {svc.category}
                        </span>
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-base text-gray-900 mb-1">{svc.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-3 mb-3">{svc.shortDescription}</p>
                        {svc.features?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {svc.features.slice(0, 3).map((f: string, idx: number) => (
                              <span key={idx} className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">
                                ✓ {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className={`text-[10px] font-bold ${svc.isActive ? "text-emerald-600" : "text-gray-400"}`}>
                          {svc.isActive ? "● Active" : "○ Inactive"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setModalData(svc);
                              setShowModal("service");
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(svc._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BLOGS */}
          {activeTab === "blogs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Wedding Blog CMS</h2>
                  <p className="text-sm text-gray-500">Publish wedding tips, trends, and real event stories</p>
                </div>
                <button
                  onClick={() => {
                    setModalData({ title: "", excerpt: "", content: "", category: "Planning", readTime: "5 min read", isPublished: true });
                    setShowModal("blog");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl text-xs font-semibold shadow-md hover:opacity-90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write New Article</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((b) => (
                  <div key={b._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                    {b.coverImage?.url && (
                      <div className="relative h-44 w-full bg-gray-100">
                        <Image src={b.coverImage.url} alt={b.title} fill className="object-cover" sizes="33vw" />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-rose-600">
                          {b.category}
                        </span>
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-base text-gray-900 mb-1 line-clamp-2">{b.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{b.excerpt}</p>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-[11px] text-gray-500">Slug: /{b.slug}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setModalData(b);
                              setShowModal("blog");
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(b._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Event Photo Gallery</h2>
                  <p className="text-sm text-gray-500">Upload portfolio images (automatically optimized & converted to WebP on Cloudinary)</p>
                </div>
                <button
                  onClick={() => {
                    setModalData({ title: "", category: "Ceremony", eventLocation: "Rewa, MP", order: gallery.length + 1 });
                    setShowModal("gallery");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl text-xs font-semibold shadow-md hover:opacity-90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <div key={item._id} className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-sm bg-gray-100 border border-gray-200">
                    <Image src={item.image?.url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                      <p className="text-white text-xs font-bold line-clamp-1">{item.title}</p>
                      <span className="text-[10px] text-rose-200">{item.category}</span>
                      <button
                        onClick={() => handleDeleteGallery(item._id)}
                        className="mt-2 w-7 h-7 rounded bg-red-600 text-white flex items-center justify-center self-end hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CLIENT TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Client Testimonials & Love Stories</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage couple reviews, star ratings, and wedding photos. Photos are automatically compressed, converted to WebP, and removed from Cloudinary upon deletion.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalData({
                      coupleName: "",
                      weddingType: "Royal Rewa Palace Wedding",
                      location: "Rewa, MP",
                      rating: 5,
                      reviewText: "",
                      order: testimonials.length + 1,
                      isActive: true,
                      image: { url: "", public_id: "", alt: "" },
                    });
                    setShowModal("testimonial");
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Testimonial</span>
                </button>
              </div>

              {testimonials.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
                  <Quote className="w-12 h-12 text-rose-300 mx-auto mb-3 opacity-60" />
                  <p className="font-semibold text-gray-700">No testimonials published yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click &ldquo;+ Add New Testimonial&rdquo; to add your first couple review.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((t) => (
                    <div
                      key={t._id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between relative group"
                    >
                      <div>
                        {/* Header: Photo & Rating */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-amber-100 border-2 border-white shadow shrink-0 flex items-center justify-center">
                              {t.image?.url ? (
                                <Image
                                  src={t.image.url}
                                  alt={t.coupleName}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                />
                              ) : (
                                <Heart className="w-6 h-6 text-rose-400 fill-rose-200" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-serif font-bold text-gray-900 text-sm leading-tight">
                                {t.coupleName}
                              </h4>
                              <p className="text-[11px] text-rose-600 font-medium line-clamp-1 mt-0.5">
                                {t.weddingType || "Royal Celebration"}
                              </p>
                              <span className="text-[10px] text-gray-400">
                                {t.location || "Rewa, MP"}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {[...Array(Math.min(5, Math.max(1, t.rating || 5)))].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                t.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {t.isActive ? "Active" : "Hidden"}
                            </span>
                          </div>
                        </div>

                        {/* Review text */}
                        <div className="relative bg-rose-50/40 rounded-xl p-3 mb-4 border border-rose-100/50">
                          <Quote className="w-4 h-4 text-rose-400/60 mb-1" />
                          <p className="text-xs text-gray-600 italic leading-relaxed line-clamp-4">
                            &ldquo;{t.reviewText}&rdquo;
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">Order: #{t.order || 0}</span>

                        <div className="flex items-center gap-1.5">
                          {/* Remove Photo Only button (Cloudinary deletion) */}
                          {t.image?.url && (
                            <button
                              onClick={() => handleDeleteTestimonialPhoto(t._id)}
                              title="Delete Photo from Cloudinary (keep review text)"
                              className="px-2 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <ImageOff className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Photo</span>
                            </button>
                          )}

                          {/* Edit Testimonial */}
                          <button
                            onClick={() => {
                              setModalData(t);
                              setShowModal("testimonial");
                            }}
                            title="Edit Testimonial"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Entire Testimonial */}
                          <button
                            onClick={() => handleDeleteTestimonial(t._id)}
                            title="Delete Testimonial & Cloudinary Image"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MEET OUR TEAM MANAGEMENT */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-6 h-6 text-rose-500" />
                    <span>Meet Our Team & Leadership</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage team members, roles, experience, and bios shown on the About page. Photos are automatically compressed, converted to WebP, and removed from Cloudinary on update or delete.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalData({
                      name: "",
                      role: "Lead Wedding & Theme Designer",
                      experience: "Since 2021",
                      bio: "",
                      order: team.length + 1,
                      isActive: true,
                      image: { url: "", public_id: "", alt: "" },
                    });
                    setShowModal("teamMember");
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Team Member</span>
                </button>
              </div>

              {team.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
                  <UserCheck className="w-12 h-12 text-rose-300 mx-auto mb-3 opacity-60" />
                  <p className="font-semibold text-gray-700">No team members listed yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click &ldquo;+ Add Team Member&rdquo; to add your first team profile.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {team.map((m) => (
                    <div
                      key={m._id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        {/* Photo container */}
                        <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                          {m.image?.url ? (
                            <Image
                              src={m.image.url}
                              alt={m.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-rose-50/50">
                              <UserCheck className="w-10 h-10 text-rose-300" />
                              <span className="text-[10px] mt-1 font-medium">No photo uploaded</span>
                            </div>
                          )}
                          <div className="absolute top-2.5 right-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${m.isActive ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"}`}>
                              {m.isActive ? "Active" : "Hidden"}
                            </span>
                          </div>
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                              #{m.order ?? 0}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 text-center">
                          <h4 className="font-serif font-bold text-gray-900 text-base">
                            {m.name}
                          </h4>
                          <p className="text-xs font-semibold text-rose-600 mt-0.5">
                            {m.role}
                          </p>
                          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                            {m.experience || "Since 2021"}
                          </span>
                          {m.bio && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                              {m.bio}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card actions */}
                      <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-medium">Order: {m.order ?? 0}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setModalData({ ...m });
                              setShowModal("teamMember");
                            }}
                            className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:text-rose-600 transition-colors shadow-xs"
                            title="Edit Profile"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeamMember(m._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:text-red-600 transition-colors shadow-xs"
                            title="Delete Member & Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: BANNER & HERO MANAGEMENT */}
          {activeTab === "hero_banner" && (
            <div className="space-y-8 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-rose-500" />
                    <span>Home Banner & Hero Carousel</span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage the top notification announcement banner and the full-screen interactive hero slides on your website.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      setModalData({
                        title: "",
                        subtitle: "",
                        imageUrl: "",
                        ctaText: "Book Consultation",
                        ctaLink: "/contact",
                        order: (settings?.heroSlides?.length || 0) + 1,
                      });
                      setShowModal("heroSlide");
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-90 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Slide</span>
                  </button>
                  <button
                    onClick={() => handleSaveSettings()}
                    disabled={saveLoading}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-90 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saveLoading ? "Saving..." : "Save All Changes"}</span>
                  </button>
                </div>
              </div>

              {feedbackMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              {/* 1. TOP HEADER BANNER CONTROLS */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
                      <span>1. Top Header Announcement Banner</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-rose-100 text-rose-700">
                        {settings?.showTopBanner !== false ? "Active" : "Hidden"}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Fixed red gradient strip shown at the top of the browser with celebration announcements.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={settings?.showTopBanner !== false}
                      onChange={(e) => setSettings({ ...settings, showTopBanner: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400"
                    />
                    <span>Show Banner</span>
                  </label>
                </div>

                {/* Banner Live Preview Bar */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Live Preview</div>
                  <div
                    className="h-10 rounded-xl px-4 flex items-center justify-between text-white text-xs shadow-inner overflow-hidden"
                    style={{
                      background: "linear-gradient(to right, #e11d48, #f43f5e)",
                    }}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="font-medium truncate">
                        {settings?.bannerText?.trim() || `🎉 Welcome to ${settings?.siteName || "Vindhya Events"} — Weddings & Events`}
                      </span>
                      {settings?.taglineHindi && (
                        <>
                          <span className="opacity-40">|</span>
                          <span className="text-[11px] opacity-90 truncate">{settings?.taglineHindi}</span>
                        </>
                      )}
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-[11px] shrink-0 opacity-90">
                      <span>📞 {settings?.primaryPhone || "7898522932"}</span>
                      <span>💬 WhatsApp</span>
                      <span>📍 Rewa, MP</span>
                    </div>
                  </div>
                </div>

                {/* Edit Form Inputs */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Main Banner Announcement Text
                    </label>
                    <input
                      type="text"
                      placeholder="🎉 Welcome to Vindhya Events — Weddings & Events"
                      value={settings?.bannerText || ""}
                      onChange={(e) => setSettings({ ...settings, bannerText: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Shown prominently on the left side of the top banner.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Hindi Tagline / Cultural Sub-Text
                    </label>
                    <input
                      type="text"
                      placeholder="✨ आपके रीति रिवाज सजावट के साथ ✨"
                      value={settings?.taglineHindi || ""}
                      onChange={(e) => setSettings({ ...settings, taglineHindi: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Displayed right next to the announcement with separator.</p>
                  </div>
                </div>
              </div>

              {/* 2. HERO CAROUSEL SLIDES LIST */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
                      <span>2. Home Page Hero Carousel Slides</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800">
                        {settings?.heroSlides?.length || 0} Slides Active
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Slide 1 holds your primary H1 title for SEO rankings. Subsequent slides cycle with fade animation.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(!settings?.heroSlides || settings.heroSlides.length === 0) && (
                      <button
                        onClick={handleLoadDefaultHeroSlides}
                        className="px-3 py-1.5 text-xs font-medium border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-700"
                      >
                        Load Default Slides
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setModalData({
                          title: "",
                          subtitle: "",
                          imageUrl: "",
                          ctaText: "Book Consultation",
                          ctaLink: "/contact",
                          order: (settings?.heroSlides?.length || 0) + 1,
                        });
                        setShowModal("heroSlide");
                      }}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Slide</span>
                    </button>
                  </div>
                </div>

                {/* Slides Cards */}
                {(!settings?.heroSlides || settings.heroSlides.length === 0) ? (
                  <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <h4 className="font-serif font-bold text-gray-700 text-base">No Hero Slides Configured</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                      The site currently uses default built-in slides. Click below to load editable templates or add your own custom photos.
                    </p>
                    <button
                      onClick={handleLoadDefaultHeroSlides}
                      className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl shadow hover:bg-rose-600 transition"
                    >
                      Load Editable Default Slides
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {settings.heroSlides.map((slide: any, idx: number) => {
                      const isH1 = idx === 0;
                      const slideImg = slide.image?.url || slide.image || "/girlsimg.webp";
                      return (
                        <div
                          key={idx}
                          className="bg-gray-50/70 border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow relative overflow-hidden"
                        >
                          <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                            {/* Slide Image Thumbnail */}
                            <div className="w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-gray-200 shrink-0 relative border border-gray-200 shadow-sm">
                              <img
                                src={slideImg}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                                #{idx + 1}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  isH1 ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-gray-200 text-gray-700"
                                }`}>
                                  {isH1 ? "Primary H1 Slide" : `Slide ${idx + 1}`}
                                </span>
                                {slide.ctaText && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-medium">
                                    CTA: {slide.ctaText}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-serif font-bold text-gray-900 text-sm sm:text-base truncate">
                                {slide.title}
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {slide.subtitle}
                              </p>
                              {slide.ctaLink && (
                                <p className="text-[11px] text-gray-400 font-mono truncate">
                                  Link: {slide.ctaLink}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                            {/* Reorder Buttons */}
                            <button
                              onClick={() => handleMoveHeroSlide(idx, "up")}
                              disabled={idx === 0}
                              title="Move Slide Up"
                              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => handleMoveHeroSlide(idx, "down")}
                              disabled={idx === settings.heroSlides.length - 1}
                              title="Move Slide Down"
                              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              ▼
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                setModalData({
                                  slideIndex: idx,
                                  title: slide.title,
                                  subtitle: slide.subtitle,
                                  imageUrl: slide.image?.url || slide.image || "",
                                  public_id: slide.image?.public_id || "",
                                  ctaText: slide.ctaText || "Book Consultation",
                                  ctaLink: slide.ctaLink || "/contact",
                                  order: slide.order || idx + 1,
                                });
                                setShowModal("heroSlide");
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold flex items-center gap-1 shadow-sm"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteHeroSlide(idx)}
                              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete Slide"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SITE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">Site Settings & Contact Info</h2>
                <p className="text-sm text-gray-500">Update phone numbers, WhatsApp, email, addresses, and branding dynamically</p>
              </div>

              {feedbackMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={settings?.siteName || ""}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings?.tagline || ""}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Primary Phone (Call)</label>
                    <input
                      type="text"
                      value={settings?.primaryPhone || ""}
                      onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={settings?.whatsAppNumber || ""}
                      onChange={(e) => setSettings({ ...settings, whatsAppNumber: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Primary Email</label>
                    <input
                      type="email"
                      value={settings?.primaryEmail || ""}
                      onChange={(e) => setSettings({ ...settings, primaryEmail: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Office Address (Rewa, MP)</label>
                    <input
                      type="text"
                      value={settings?.address || ""}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={settings?.socialLinks?.instagram || ""}
                      onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Facebook URL</label>
                    <input
                      type="text"
                      value={settings?.socialLinks?.facebook || ""}
                      onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveLoading ? "Saving Changes..." : "Save Site Settings"}</span>
                </button>
              </form>
            </div>
          )}

          {/* 6. ADMINS & TEAM TAB */}
          {activeTab === "admins" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900">Admin Team Access</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Grant multiple emails administrative access to manage bookings, services, gallery photos, and website content.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalData({ name: "", email: "", password: "", role: "superadmin" });
                    setShowModal("adminUser");
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add New Admin</span>
                </button>
              </div>

              {/* Admin Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {admins.map((u) => {
                  const isSelf = adminUser?.email === u.email || adminUser?.id === u._id;
                  return (
                    <div
                      key={u._id}
                      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white font-bold flex items-center justify-center text-sm uppercase shadow-sm">
                            {u.name?.charAt(0) || "A"}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{u.name}</h4>
                            <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-semibold rounded-full border border-rose-200">
                              {u.role === "superadmin" ? "Super Admin" : "Editor Admin"}
                            </span>
                          </div>
                        </div>

                        {!isSelf && (
                          <button
                            onClick={() => handleDeleteAdmin(u._id, u.email)}
                            title="Revoke Admin Access"
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-gray-600 space-y-1.5 pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-700 truncate">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 pt-0.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                          {isSelf && <span className="ml-auto font-bold text-rose-600">(Current Session)</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Footer Tab Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 py-2 px-3 flex justify-around items-center shadow-[0_-4px_15px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`flex flex-col items-center gap-1 relative ${activeTab === "inquiries" ? "text-rose-600 font-bold" : "text-gray-500"}`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            {inquiries.filter((i) => i.status === "pending").length > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {inquiries.filter((i) => i.status === "pending").length}
              </span>
            )}
          </div>
          <span className="text-[10px]">Leads</span>
        </button>

        <button
          onClick={() => setActiveTab("services")}
          className={`flex flex-col items-center gap-1 ${activeTab === "services" ? "text-rose-600 font-bold" : "text-gray-500"}`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px]">Services</span>
        </button>

        <button
          onClick={() => setActiveTab("blogs")}
          className={`flex flex-col items-center gap-1 ${activeTab === "blogs" ? "text-rose-600 font-bold" : "text-gray-500"}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px]">Blogs</span>
        </button>

        <button
          onClick={() => setActiveTab("gallery")}
          className={`flex flex-col items-center gap-1 ${activeTab === "gallery" ? "text-rose-600 font-bold" : "text-gray-500"}`}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-[10px]">Gallery</span>
        </button>

        <button
          onClick={() => setActiveTab("testimonials")}
          className={`flex flex-col items-center gap-1 ${activeTab === "testimonials" ? "text-rose-600 font-bold" : "text-gray-500"}`}
        >
          <Quote className="w-5 h-5" />
          <span className="text-[10px]">Reviews</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-rose-600 active:text-rose-700"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>

      {/* HERO SLIDE MODAL */}
      {showModal === "heroSlide" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(null)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5 pb-3 border-b border-gray-100 pr-8">
              <h3 className="font-serif font-bold text-xl text-gray-900">
                {modalData.slideIndex !== undefined ? "Edit Hero Slide" : "Add New Hero Slide"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize slide heading, Hindi/English subtitle, background photo, and CTA button
              </p>
            </div>

            <form onSubmit={handleSaveHeroSlideModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Slide Headline (H1 on 1st Slide) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celebrating Every Tradition"
                  value={modalData.title || ""}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Slide Subtitle / Hindi Catchphrase
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. आपके रीति-रिवाज़ को खूबसूरत सजावट के साथ मनाएं"
                  value={modalData.subtitle || ""}
                  onChange={(e) => setModalData({ ...modalData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {/* Background Image Upload / URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Slide Background Image *
                </label>
                
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3.5 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition flex items-center gap-1.5 shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? "Uploading WebP..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const res = await handleFileUpload(file);
                            if (res) {
                              setModalData((prev: any) => ({
                                ...prev,
                                imageUrl: res.url,
                                public_id: res.public_id,
                              }));
                            }
                          }
                        }}
                      />
                    </label>
                    <span className="text-[11px] text-gray-400">Direct Cloudinary upload</span>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Or paste image URL (e.g. /dercoration1.webp or https://...)"
                      value={modalData.imageUrl || ""}
                      onChange={(e) => setModalData({ ...modalData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                {/* Preview Thumbnail */}
                {modalData.imageUrl && (
                  <div className="relative h-28 rounded-xl overflow-hidden border border-gray-200 bg-black/10">
                    <img
                      src={modalData.imageUrl}
                      alt="Slide preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3 text-center">
                      <p className="text-white text-xs font-serif font-bold drop-shadow">
                        {modalData.title || "Headline preview"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button Customization */}
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    placeholder="Book Consultation"
                    value={modalData.ctaText || "Book Consultation"}
                    onChange={(e) => setModalData({ ...modalData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Button Link / Action
                  </label>
                  <input
                    type="text"
                    placeholder="/contact or #consultation"
                    value={modalData.ctaLink || "/contact"}
                    onChange={(e) => setModalData({ ...modalData, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage || saveLoading}
                  className="px-5 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveLoading ? "Saving..." : "Save Slide"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 0. Inquiry / Lead Modal */}
      {showModal === "inquiry" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(null)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mb-5 pb-3 border-b border-gray-100 pr-8">
              <h3 className="font-serif font-bold text-xl text-gray-900">
                {modalData._id ? "Edit Consultation Lead" : "Add Consultation Lead"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Record inquiries from calls, direct walk-ins, or WhatsApp
              </p>
            </div>

            <form onSubmit={handleSaveInquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Client Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={modalData.name || ""}
                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Phone / Mobile <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone number"
                    value={modalData.phone || ""}
                    onChange={(e) => setModalData({ ...modalData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com (optional)"
                    value={modalData.email || ""}
                    onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Event Type</label>
                  <select
                    value={modalData.eventType || "Wedding"}
                    onChange={(e) => setModalData({ ...modalData, eventType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50 font-medium"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Reception">Reception</option>
                    <option value="Sangeet & Mehendi">Sangeet & Mehendi</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Haldi Ceremony">Haldi Ceremony</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Other Celebration">Other Celebration</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={modalData.date || ""}
                    onChange={(e) => setModalData({ ...modalData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Guest Count</label>
                  <input
                    type="text"
                    placeholder="e.g. 300-500"
                    value={modalData.guestCount || ""}
                    onChange={(e) => setModalData({ ...modalData, guestCount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Budget / Package</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹3 Lakh"
                    value={modalData.budget || ""}
                    onChange={(e) => setModalData({ ...modalData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Lead Status</label>
                  <select
                    value={modalData.status || "pending"}
                    onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50 font-bold"
                  >
                    <option value="pending">Pending (New)</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_discussion">In Discussion</option>
                    <option value="booked">Booked 💍</option>
                    <option value="cancelled">Cancelled ✕</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Source</label>
                  <input
                    type="text"
                    placeholder="e.g. Phone Call, WhatsApp, Direct Walk-in"
                    value={modalData.source || "Admin Manual Entry"}
                    onChange={(e) => setModalData({ ...modalData, source: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Client Message / Decor Requests</label>
                <textarea
                  rows={2}
                  placeholder="Decor preferences, specific colors, mandap style..."
                  value={modalData.message || ""}
                  onChange={(e) => setModalData({ ...modalData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes for team: Follow up date, quoted price, discussions..."
                  value={modalData.adminNotes || ""}
                  onChange={(e) => setModalData({ ...modalData, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-amber-200 bg-amber-50/60 rounded-xl focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saveLoading ? "Saving..." : modalData._id ? "Update Lead" : "Save Lead"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 0. Inquiry / Lead Details View Modal (Mobile Bottom Sheet & Desktop Modal) */}
      {viewInquiry && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          onClick={() => setViewInquiry(null)}
        >
          <div
            className="bg-white w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

            {/* Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-3 bg-gradient-to-r from-rose-50/60 to-amber-50/60">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif font-black text-lg sm:text-xl text-gray-900 truncate">
                    {viewInquiry.name}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                      viewInquiry.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : viewInquiry.status === "contacted"
                        ? "bg-blue-100 text-blue-800"
                        : viewInquiry.status === "in_discussion"
                        ? "bg-purple-100 text-purple-800"
                        : viewInquiry.status === "booked"
                        ? "bg-emerald-100 text-emerald-800"
                        : viewInquiry.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {viewInquiry.status === "in_discussion"
                      ? "In Discussion"
                      : viewInquiry.status === "cancelled"
                      ? "Cancelled ✕"
                      : viewInquiry.status}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>
                    Received on{" "}
                    {new Date(viewInquiry.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setViewInquiry(null)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center shrink-0 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Header Bar (Call, WhatsApp, Fast Status update) */}
            <div className="px-5 sm:px-6 py-3 bg-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${viewInquiry.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${viewInquiry.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
                    viewInquiry.name
                  )}%2C%20thank%20you%20for%20contacting%20RIWAJ!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-gray-500">Status:</span>
                <select
                  value={viewInquiry.status}
                  onChange={(e) => handleUpdateInquiryStatus(viewInquiry._id, e.target.value)}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-rose-400 cursor-pointer"
                >
                  <option value="pending">Pending (New)</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_discussion">In Discussion</option>
                  <option value="booked">Booked 💍</option>
                  <option value="cancelled">Cancelled ✕</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Scrollable Body Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Event Details Grid */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Event Type
                  </span>
                  <span className="font-bold text-gray-900 text-sm">{viewInquiry.eventType || "Wedding"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Event Date
                  </span>
                  <span className="font-bold text-gray-900 text-sm">{viewInquiry.date || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Guest Count
                  </span>
                  <span className="font-bold text-gray-900 text-sm">{viewInquiry.guestCount || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Estimated Budget
                  </span>
                  <span className="font-bold text-rose-600 text-sm">{viewInquiry.budget || "Flexible / Not set"}</span>
                </div>
              </div>

              {/* Contact Information & Source */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Contact & Channel
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-gray-800">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-semibold">{viewInquiry.phone}</span>
                  </div>
                  {viewInquiry.email ? (
                    <div className="flex items-center gap-2 text-gray-800">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`mailto:${viewInquiry.email}`} className="hover:text-rose-600 underline">
                        {viewInquiry.email}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 italic">
                      <Mail className="w-3.5 h-3.5 text-gray-300" />
                      <span>No email provided</span>
                    </div>
                  )}
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Source Channel:</span>
                  <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                    {viewInquiry.source || "Website Consultation Form"}
                  </span>
                </div>
              </div>

              {/* Client Requirements / Decor Vision Message */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                  Decor Vision / Special Message
                </span>
                {viewInquiry.message ? (
                  <p className="text-gray-700 text-xs leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100 whitespace-pre-wrap">
                    "{viewInquiry.message}"
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No additional note or decor vision was provided with this lead.</p>
                )}
              </div>

              {/* Internal Admin Notes */}
              <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Internal Admin Follow-up Notes
                  </span>
                  <span className="text-[10px] text-amber-600 font-medium">Visible only to admins</span>
                </div>
                <textarea
                  rows={3}
                  value={inquiryNoteDraft}
                  onChange={(e) => setInquiryNoteDraft(e.target.value)}
                  placeholder="Record follow-up calls, discussion outcomes, quoted pricing, vendor bookings..."
                  className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    disabled={saveLoading || inquiryNoteDraft === (viewInquiry.adminNotes || "")}
                    onClick={() => handleUpdateInquiryNote(viewInquiry._id, inquiryNoteDraft)}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saveLoading ? "Saving..." : "Save Note"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 sm:px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleDeleteInquiry(viewInquiry._id)}
                className="inline-flex items-center gap-1 px-3 py-2 text-rose-600 hover:bg-rose-100/60 rounded-xl font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const current = viewInquiry;
                    setViewInquiry(null);
                    setModalData({
                      _id: current._id,
                      name: current.name || "",
                      phone: current.phone || "",
                      email: current.email || "",
                      eventType: current.eventType || "Wedding",
                      date: current.date || "",
                      guestCount: current.guestCount || "",
                      budget: current.budget || "",
                      message: current.message || "",
                      status: current.status || "pending",
                      adminNotes: current.adminNotes || "",
                      source: current.source || "Website Consultation Form",
                    });
                    setShowModal("inquiry");
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Full Lead</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewInquiry(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Service Modal */}
      {showModal === "service" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(null)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-xl text-gray-900 mb-4">{modalData._id ? "Edit Service" : "Add Service"}</h3>
            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={modalData.title || ""}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  placeholder="e.g. Mandap & Floral Decor"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={modalData.category || ""}
                  onChange={(e) => setModalData({ ...modalData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Description</label>
                <textarea
                  required
                  rows={3}
                  value={modalData.shortDescription || ""}
                  onChange={(e) => setModalData({ ...modalData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Cover Image (Cloudinary WebP)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const res = await handleFileUpload(f);
                      if (res) setModalData({ ...modalData, coverImage: { url: res.url, public_id: res.public_id } });
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
                {uploadingImage && <p className="text-amber-600 mt-1 font-semibold">Uploading and converting to WebP...</p>}
                {modalData.coverImage?.url && (
                  <p className="text-emerald-600 mt-1 font-semibold text-[11px]">✓ Image attached: {modalData.coverImage.url.slice(0, 45)}...</p>
                )}
              </div>
              <button
                type="submit"
                disabled={saveLoading || uploadingImage}
                className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl shadow-md hover:bg-rose-700 transition-colors"
              >
                {saveLoading ? "Saving..." : "Save Service"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Blog Modal */}
      {showModal === "blog" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(null)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-xl text-gray-900 mb-4">{modalData._id ? "Edit Blog Post" : "Write Blog Post"}</h3>
            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Blog Title</label>
                <input
                  type="text"
                  required
                  value={modalData.title || ""}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={modalData.category || "Planning"}
                    onChange={(e) => setModalData({ ...modalData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={modalData.readTime || "5 min read"}
                    onChange={(e) => setModalData({ ...modalData, readTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Excerpt (Summary)</label>
                <textarea
                  required
                  rows={2}
                  value={modalData.excerpt || ""}
                  onChange={(e) => setModalData({ ...modalData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Article Content (Markdown / Story)</label>
                <textarea
                  required
                  rows={8}
                  value={modalData.content || ""}
                  onChange={(e) => setModalData({ ...modalData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono text-[11px]"
                  placeholder="Write the full wedding article here..."
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Featured Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const res = await handleFileUpload(f);
                      if (res) setModalData({ ...modalData, coverImage: { url: res.url, public_id: res.public_id } });
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
                {uploadingImage && <p className="text-amber-600 mt-1 font-semibold">Uploading to Cloudinary...</p>}
                {modalData.coverImage?.url && (
                  <p className="text-emerald-600 mt-1 font-semibold text-[11px]">✓ Image: {modalData.coverImage.url.slice(0, 45)}...</p>
                )}
              </div>
              <button
                type="submit"
                disabled={saveLoading || uploadingImage}
                className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl shadow-md hover:bg-rose-700 transition-colors"
              >
                {saveLoading ? "Publishing..." : "Publish Blog Post"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Gallery Modal */}
      {showModal === "gallery" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowModal(null)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-xl text-gray-900 mb-4">Add Gallery Photo</h3>
            <form onSubmit={handleSaveGallery} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Photo Title</label>
                <input
                  type="text"
                  required
                  value={modalData.title || ""}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  placeholder="e.g. Royal Mandap Ceremony"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={modalData.category || "Ceremony"}
                  onChange={(e) => setModalData({ ...modalData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                >
                  <option value="Ceremony">Ceremony</option>
                  <option value="Reception">Reception</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Decor">Decor</option>
                  <option value="Bride">Bride</option>
                  <option value="Details">Details</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Photo (Auto WebP)</label>
                <input
                  type="file"
                  required={!modalData.image?.url}
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const res = await handleFileUpload(f);
                      if (res) setModalData({ ...modalData, image: { url: res.url, public_id: res.public_id } });
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
                {uploadingImage && <p className="text-amber-600 mt-1 font-semibold">Uploading to Cloudinary WebP...</p>}
                {modalData.image?.url && (
                  <p className="text-emerald-600 mt-1 font-semibold text-[11px]">✓ Ready: {modalData.image.url.slice(0, 45)}...</p>
                )}
              </div>
              <button
                type="submit"
                disabled={saveLoading || uploadingImage || !modalData.image?.url}
                className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl shadow-md hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {saveLoading ? "Saving Photo..." : "Add to Gallery"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Admin User Modal */}
      {showModal === "adminUser" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowModal(null)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-gray-900 leading-tight">Add New Admin</h3>
                <p className="text-[11px] text-gray-500">Grant full website editing and lead management access</p>
              </div>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-4 text-xs mt-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={modalData.name || ""}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address (Login Username)</label>
                <input
                  type="email"
                  required
                  placeholder="admin@riwaj.in"
                  value={modalData.email || ""}
                  onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Login Password (Min 6 chars)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={modalData.password || ""}
                  onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Role & Permissions</label>
                <select
                  value={modalData.role || "superadmin"}
                  onChange={(e) => setModalData({ ...modalData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-white"
                >
                  <option value="superadmin">Super Admin (Can Edit Everything + Manage Admins)</option>
                  <option value="editor">Editor (Can Manage Leads, Gallery, Blogs, Services)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saveLoading}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saveLoading ? "Creating Admin Account..." : "Grant Admin Access"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Testimonial Modal */}
      {showModal === "testimonial" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(null)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-xl text-gray-900 mb-1">
              {modalData._id ? "Edit Client Testimonial" : "Add Client Testimonial"}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Add genuine couple feedback. Images are automatically compressed to WebP and removed from Cloudinary if deleted.
            </p>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Couple Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditya & Priya"
                    value={modalData.coupleName || ""}
                    onChange={(e) => setModalData({ ...modalData, coupleName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Wedding Type / Ceremony</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Rewa Palace Wedding"
                    value={modalData.weddingType || ""}
                    onChange={(e) => setModalData({ ...modalData, weddingType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Rewa, MP"
                    value={modalData.location || ""}
                    onChange={(e) => setModalData({ ...modalData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Rating</label>
                  <select
                    value={modalData.rating || 5}
                    onChange={(e) => setModalData({ ...modalData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-white"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Review & Feedback Text *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="What did the couple say about RIWAJ decor, planning, and execution?"
                  value={modalData.reviewText || ""}
                  onChange={(e) => setModalData({ ...modalData, reviewText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={modalData.order ?? 0}
                    onChange={(e) => setModalData({ ...modalData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div className="pt-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={modalData.isActive !== false}
                      onChange={(e) => setModalData({ ...modalData, isActive: e.target.checked })}
                      className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <span>Show on Website (Active)</span>
                  </label>
                </div>
              </div>

              {/* Couple Photo Upload with WebP conversion & Delete Photo feature */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700 mb-1">Couple Photo (WebP Auto-Compressed)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const res = await handleFileUpload(f);
                      if (res) {
                        setModalData({
                          ...modalData,
                          image: { url: res.url, public_id: res.public_id, alt: modalData.coupleName || "" },
                        });
                      }
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
                {uploadingImage && (
                  <p className="text-amber-600 mt-1 font-semibold flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Compressing & converting to WebP on Cloudinary...</span>
                  </p>
                )}

                {modalData.image?.url && (
                  <div className="mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white shadow-sm">
                      <Image src={modalData.image.url} alt="Couple" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-[11px]">
                      <p className="font-semibold text-emerald-700">✓ WebP Photo Attached</p>
                      <p className="text-gray-400 truncate">{modalData.image.url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (modalData._id) {
                          handleDeleteTestimonialPhoto(modalData._id);
                        } else {
                          setModalData({ ...modalData, image: { url: "", public_id: "", alt: "" } });
                        }
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Photo</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saveLoading || uploadingImage}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 text-xs"
              >
                {saveLoading ? "Saving Testimonial..." : modalData._id ? "Update Testimonial" : "Create Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Team Member Modal */}
      {showModal === "teamMember" && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(null)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-xl text-gray-900 mb-1">
              {modalData._id ? "Edit Team Member" : "Add Team Member"}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Team profile shown on About page. Photos are auto-compressed to WebP and removed from Cloudinary upon replacement or deletion.
            </p>

            <form onSubmit={handleSaveTeamMember} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Member Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shivam Patel"
                    value={modalData.name || ""}
                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founder & Event Director"
                    value={modalData.role || ""}
                    onChange={(e) => setModalData({ ...modalData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Experience / Background</label>
                  <input
                    type="text"
                    placeholder="e.g. Started from Sound & DJ (2021)"
                    value={modalData.experience || ""}
                    onChange={(e) => setModalData({ ...modalData, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={modalData.order ?? 0}
                    onChange={(e) => setModalData({ ...modalData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Bio / Specialization</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Started in 2021 with DJ sounds & production. Passionate about royal decor and on-ground coordination."
                  value={modalData.bio || ""}
                  onChange={(e) => setModalData({ ...modalData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={modalData.isActive !== false}
                    onChange={(e) => setModalData({ ...modalData, isActive: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <span>Show on About Page (Active)</span>
                </label>
              </div>

              {/* Photo Upload with WebP conversion & Delete Photo feature */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700 mb-1">Member Photo (Auto-Compressed to WebP)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const res = await handleFileUpload(f);
                      if (res) {
                        setModalData({
                          ...modalData,
                          image: { url: res.url, public_id: res.public_id, alt: modalData.name || "" },
                        });
                      }
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
                {uploadingImage && (
                  <p className="text-amber-600 mt-1 font-semibold flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Compressing & converting to WebP on Cloudinary...</span>
                  </p>
                )}

                {modalData.image?.url && (
                  <div className="mt-3 flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white shadow-sm">
                        <Image src={modalData.image.url} alt="Team Member" fill className="object-cover" />
                      </div>
                      <div className="min-w-0 text-[11px]">
                        <p className="font-semibold text-emerald-700">✓ WebP Photo Attached</p>
                        <p className="text-gray-400 truncate max-w-[200px]">{modalData.image.url}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (modalData._id) {
                          handleDeleteTeamPhoto(modalData._id);
                        } else {
                          setModalData({ ...modalData, image: { url: "", public_id: "", alt: "" } });
                        }
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Photo</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading || uploadingImage}
                  className="px-5 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saveLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalData._id ? "Update Member" : "Save Member"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
