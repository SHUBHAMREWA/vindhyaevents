"use client";

import { useState, useEffect, useMemo } from "react";
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
  Truck,
  Wrench,
  DollarSign,
  Send,
  Layers,
  MapPin,
  List,
  LayoutGrid,
  Copy,
  ChevronRight,
  ChevronDown,
  Sliders,
  CreditCard,
  Tag,
} from "lucide-react";
import CustomerCRM from "@/components/admin/CustomerCRM";
import BookingManagement from "@/components/admin/BookingManagement";
import WhatsAppCenter from "@/components/admin/WhatsAppCenter";
import { INDIAN_STATES_AND_CITIES, INDIAN_STATES } from "@/lib/indianLocations";

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

const DEFAULT_VENDOR_SKILLS = [
  "Catering & Food",
  "DJ & Sounds",
  "Stage Lighting",
  "Mandap & Floral Decor",
  "Photography & Video",
  "Safa Tying",
  "Baggi & Horse Entry",
  "Atishbaji & Cold Pyro",
  "Venue & Tent Setup",
  "Uniformed Staff",
  "Generator & Power Backup",
];

const DEFAULT_GALLERY_CATEGORIES = [
  "Ceremony",
  "Reception",
  "Outdoor",
  "Decor",
  "Bride",
  "Details",
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | "inquiries"
    | "customers"
    | "bookings"
    | "whatsapp_logs"
    | "vendors"
    | "hero_banner"
    | "subcategories"
    | "services"
    | "blogs"
    | "gallery"
    | "testimonials"
    | "team"
    | "settings"
    | "admins"
  >("inquiries");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [websiteSettingsOpen, setWebsiteSettingsOpen] = useState(true);

  // Data states
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [whatsappLogs, setWhatsappLogs] = useState<any[]>([]);
  const [whatsappInitialRecipients, setWhatsappInitialRecipients] = useState<any[]>([]);
  const [whatsappInitialDefaultMsg, setWhatsappInitialDefaultMsg] = useState<string>("");

  // Subcategories management states
  const [subcategoryCategoryFilter, setSubcategoryCategoryFilter] = useState("all");
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [editingSubcategory, setEditingSubcategory] = useState<any | null>(null);
  const [newRelevantImgInput, setNewRelevantImgInput] = useState<{ url: string; alt: string; public_id: string }>({
    url: "",
    alt: "",
    public_id: "",
  });
  const [isHeroDragging, setIsHeroDragging] = useState(false);
  const [isRelevantDragging, setIsRelevantDragging] = useState(false);
  const [multiUploadLoading, setMultiUploadLoading] = useState(false);
  const [multiUploadProgress, setMultiUploadProgress] = useState("");

  // Search & Filter
  const [searchInquiry, setSearchInquiry] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [viewInquiry, setViewInquiry] = useState<any | null>(null);
  const [inquiryNoteDraft, setInquiryNoteDraft] = useState("");

  // Vendor CRM states
  const [searchVendor, setSearchVendor] = useState("");
  const [vendorServiceFilter, setVendorServiceFilter] = useState("all");
  const [vendorViewLayout, setVendorViewLayout] = useState<"row" | "card">("row");
  const [viewVendor, setViewVendor] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState("");
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [assigningVendor, setAssigningVendor] = useState(false);
  const [newAssignment, setNewAssignment] = useState<any>({
    serviceName: "",
    vendorId: "",
    vendorName: "",
    vendorPhone: "",
    agreedCost: 0,
    advancePaid: 0,
    status: "assigned",
    reportingTime: "",
    notes: "",
  });

  // Gallery states
  const [customGalleryCategories, setCustomGalleryCategories] = useState<string[]>([]);
  const [newGalleryCategoryInput, setNewGalleryCategoryInput] = useState("");
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [adminGalleryCategoryFilter, setAdminGalleryCategoryFilter] = useState("all");

  const [cleaningDemo, setCleaningDemo] = useState(false);

  const handleCleanDemoData = async () => {
    const confirmed = confirm(
      "Are you sure you want to remove all predefined demo data?\n\nThis will permanently delete:\n- Demo team members (with stock photos)\n- Demo client reviews\n- Demo blogs\n- Demo vendors\n- Demo gallery items\n\nYour real content will stay intact."
    );
    if (!confirmed) return;

    setCleaningDemo(true);
    try {
      const res = await fetch("/api/admin/clean-demo-data", { method: "POST" });
      const data = await res.json();
      setCleaningDemo(false);
      if (data.success) {
        alert("Predefined demo data has been cleaned successfully!");
        fetchAdminAndData();
      } else {
        alert(data.message || "Failed to clean demo data");
      }
    } catch (err: any) {
      setCleaningDemo(false);
      alert("Error cleaning demo data: " + err.message);
    }
  };

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => setCopiedText(""), 2000);
      }
    } catch {
      // ignore
    }
  };

  // Load custom skills and custom gallery categories from localStorage on client mount
  useEffect(() => {
    try {
      const savedSkills = localStorage.getItem("riwaj_custom_skills");
      if (savedSkills) {
        const parsed = JSON.parse(savedSkills);
        if (Array.isArray(parsed)) {
          setCustomSkills(parsed);
        }
      }
      const savedGalleryCats = localStorage.getItem("riwaj_custom_gallery_categories");
      if (savedGalleryCats) {
        const parsed = JSON.parse(savedGalleryCats);
        if (Array.isArray(parsed)) {
          setCustomGalleryCategories(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

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

  // Compute all available skills (default + custom added + any existing from vendors & modal)
  const allAvailableSkills = useMemo(() => {
    const fromVendors = vendors.flatMap((v) => (Array.isArray(v.services) ? v.services : []));
    const fromModal = Array.isArray(modalData?.services) ? modalData.services : [];
    const combined = Array.from(
      new Set([...DEFAULT_VENDOR_SKILLS, ...customSkills, ...fromVendors, ...fromModal])
    ).filter(Boolean);
    return combined;
  }, [vendors, customSkills, modalData?.services]);

  // Compute all available gallery categories (defaults + custom created + any existing from gallery & modal)
  const allGalleryCategories = useMemo(() => {
    const fromGallery = gallery.map((g: any) => g.category).filter(Boolean);
    const fromModal = modalData?.category ? [modalData.category] : [];
    const combined = Array.from(
      new Set([...DEFAULT_GALLERY_CATEGORIES, ...customGalleryCategories, ...fromGallery, ...fromModal])
    ).filter((c): c is string => typeof c === "string" && c.trim().length > 0);
    return combined;
  }, [gallery, customGalleryCategories, modalData?.category]);

  // Handler to add custom gallery category
  const handleAddCustomGalleryCategory = (nameOverride?: string) => {
    const raw = (nameOverride || newGalleryCategoryInput).trim();
    if (!raw) return;

    const formatted = raw
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    if (!customGalleryCategories.some((c) => c.toLowerCase() === formatted.toLowerCase())) {
      const updated = [...customGalleryCategories, formatted];
      setCustomGalleryCategories(updated);
      try {
        localStorage.setItem("riwaj_custom_gallery_categories", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    setModalData((prev: any) => ({ ...prev, category: formatted }));
    setNewGalleryCategoryInput("");
    setIsCreatingNewCategory(false);
  };

  // Handler to add custom skill
  const handleAddCustomSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;

    // Check if not already in customSkills
    if (!customSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...customSkills, trimmed];
      setCustomSkills(updated);
      try {
        localStorage.setItem("riwaj_custom_skills", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    // Auto-select for the current vendor in modalData
    const currentServices: string[] = Array.isArray(modalData.services) ? modalData.services : [];
    if (!currentServices.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setModalData({
        ...modalData,
        services: [...currentServices, trimmed],
      });
    }

    setNewSkillInput("");
  };

  // Handler to remove a custom skill from list
  const handleRemoveCustomSkill = (skillToRemove: string) => {
    const updated = customSkills.filter((s) => s !== skillToRemove);
    setCustomSkills(updated);
    try {
      localStorage.setItem("riwaj_custom_skills", JSON.stringify(updated));
    } catch {
      // ignore
    }
    // Also unselect from modal if selected
    if (modalData.services && Array.isArray(modalData.services) && modalData.services.includes(skillToRemove)) {
      setModalData({
        ...modalData,
        services: modalData.services.filter((s: string) => s !== skillToRemove),
      });
    }
  };

  // Memoized filtered vendor list for Search & Skill filtering
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchSearch =
        !searchVendor ||
        (v.name && v.name.toLowerCase().includes(searchVendor.toLowerCase())) ||
        (v.phone && v.phone.includes(searchVendor)) ||
        (v.city && v.city.toLowerCase().includes(searchVendor.toLowerCase())) ||
        (v.state && v.state.toLowerCase().includes(searchVendor.toLowerCase())) ||
        (v.services && v.services.some((s: string) => s.toLowerCase().includes(searchVendor.toLowerCase())));
      const matchService =
        vendorServiceFilter === "all" ||
        (v.services && v.services.includes(vendorServiceFilter));
      return matchSearch && matchService;
    });
  }, [vendors, searchVendor, vendorServiceFilter]);

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
        fetchCustomers(),
        fetchBookings(),
        fetchWhatsAppLogs(),
        fetchVendors(),
        fetchSubcategories(),
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

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/admin/vendors");
      const data = await res.json();
      if (data.success) setVendors(data.vendors || []);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success) setCustomers(data.customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (data.success) setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchWhatsAppLogs = async () => {
    try {
      const res = await fetch("/api/admin/whatsapp");
      const data = await res.json();
      if (data.success) setWhatsappLogs(data.logs || []);
    } catch (err) {
      console.error("Error fetching whatsapp logs:", err);
    }
  };

  const handleOpenWhatsApp = (recipients: any[], defaultMsg?: string) => {
    setWhatsappInitialRecipients(recipients);
    if (defaultMsg) setWhatsappInitialDefaultMsg(defaultMsg);
    setActiveTab("whatsapp_logs");
  };

  // Vendor Actions
  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData.name?.trim() || !modalData.phone?.trim()) {
      alert("Vendor name and phone number are required.");
      return;
    }
    setSaveLoading(true);
    try {
      const isEdit = !!modalData._id;
      const res = await fetch("/api/admin/vendors", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { id: modalData._id, ...modalData } : modalData),
      });
      const d = await res.json();
      setSaveLoading(false);
      if (d.success) {
        setShowModal(null);
        setModalData({});
        setFeedbackMsg(isEdit ? "Partner / Vendor updated successfully!" : "New partner / vendor added!");
        setTimeout(() => setFeedbackMsg(""), 3500);
        fetchVendors();
      } else {
        alert(d.message || "Failed to save vendor");
      }
    } catch (err) {
      setSaveLoading(false);
      alert("Error saving vendor");
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor from directory?")) return;
    try {
      const res = await fetch(`/api/admin/vendors?id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        setFeedbackMsg("Vendor deleted");
        setTimeout(() => setFeedbackMsg(""), 3000);
        fetchVendors();
        setViewVendor((prev: any) => (prev && prev._id === id ? null : prev));
      } else {
        alert(d.message || "Failed to delete");
      }
    } catch {
      alert("Error deleting vendor");
    }
  };

  const handleToggleVendorStatus = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !current }),
      });
      const d = await res.json();
      if (d.success) {
        fetchVendors();
        setViewVendor((prev: any) => (prev && prev._id === id ? { ...prev, isActive: !current } : prev));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Vendor Work Order Assignment to Lead
  const handleAddVendorAssignment = async () => {
    if (!viewInquiry || !newAssignment.vendorName || !newAssignment.serviceName) {
      alert("Please select or enter a service and vendor");
      return;
    }
    const currentAssignments = viewInquiry.assignedVendors || [];
    const updatedAssignments = [
      ...currentAssignments,
      {
        ...newAssignment,
        _id: String(Date.now()),
        agreedCost: Number(newAssignment.agreedCost) || 0,
        advancePaid: Number(newAssignment.advancePaid) || 0,
      },
    ];

    setSaveLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: viewInquiry._id,
          assignedVendors: updatedAssignments,
        }),
      });
      const d = await res.json();
      setSaveLoading(false);
      if (d.success) {
        setViewInquiry((prev: any) => ({ ...prev, assignedVendors: updatedAssignments }));
        setAssigningVendor(false);
        setNewAssignment({
          serviceName: "",
          vendorId: "",
          vendorName: "",
          vendorPhone: "",
          agreedCost: 0,
          advancePaid: 0,
          status: "assigned",
          reportingTime: "",
          notes: "",
        });
        fetchInquiries();
        setFeedbackMsg("Work order assigned to vendor!");
        setTimeout(() => setFeedbackMsg(""), 3000);
      } else {
        alert(d.message || "Failed to update assignments");
      }
    } catch (err) {
      setSaveLoading(false);
      alert("Error saving vendor assignment");
    }
  };

  const handleRemoveVendorAssignment = async (indexToRemove: number) => {
    if (!viewInquiry) return;
    if (!confirm("Are you sure you want to remove this vendor assignment?")) return;
    const currentAssignments = viewInquiry.assignedVendors || [];
    const updatedAssignments = currentAssignments.filter((_: any, idx: number) => idx !== indexToRemove);

    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: viewInquiry._id,
          assignedVendors: updatedAssignments,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setViewInquiry((prev: any) => ({ ...prev, assignedVendors: updatedAssignments }));
        fetchInquiries();
      }
    } catch (err) {
      alert("Error removing vendor assignment");
    }
  };

  const handleUpdateInquiryFinancials = async (fields: { packagePrice?: number; advanceReceived?: number; venueAddress?: string; followUpDate?: string }) => {
    if (!viewInquiry) return;
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: viewInquiry._id,
          ...fields,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setViewInquiry((prev: any) => ({ ...prev, ...fields }));
        fetchInquiries();
        setFeedbackMsg("Financial details updated!");
        setTimeout(() => setFeedbackMsg(""), 3000);
      }
    } catch (err) {
      alert("Error updating financials");
    }
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

  const fetchSubcategories = async () => {
    try {
      const res = await fetch("/api/admin/subcategories");
      const data = await res.json();
      if (data.success) setSubcategories(data.subcategories || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcategory) return;
    setSaveLoading(true);

    try {
      const res = await fetch("/api/admin/subcategories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSubcategory._id,
          slug: editingSubcategory.slug,
          mainImage: editingSubcategory.mainImage,
          relevantImages: editingSubcategory.relevantImages || [],
          menuTitle: editingSubcategory.menuTitle,
          title: editingSubcategory.title,
          isActive: editingSubcategory.isActive,
        }),
      });
      const data = await res.json();
      setSaveLoading(false);
      if (data.success) {
        setShowModal(null);
        setEditingSubcategory(null);
        fetchSubcategories();
        setFeedbackMsg(`Images & SEO alt for "${editingSubcategory.menuTitle}" updated successfully!`);
        setTimeout(() => setFeedbackMsg(""), 3500);
      } else {
        alert(data.message || "Failed to update subcategory");
      }
    } catch (err: any) {
      setSaveLoading(false);
      alert(err.message || "Network error");
    }
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

  // Helper for batch drag-and-drop or multi-file upload for relevant showcase photos
  const handleMultiRelevantUpload = async (files: FileList | File[]) => {
    if (!editingSubcategory || !files || files.length === 0) return;
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    setMultiUploadLoading(true);
    const uploadedItems: { url: string; public_id: string; alt: string }[] = [];
    const baseCount = (editingSubcategory.relevantImages || []).length;

    for (let i = 0; i < fileArray.length; i++) {
      setMultiUploadProgress(`Uploading photo ${i + 1} of ${fileArray.length} to Cloudinary...`);
      try {
        const webpFile = await compressImageToWebP(fileArray[i]);
        const formData = new FormData();
        formData.append("file", webpFile);
        formData.append("folder", "riwaj_events");
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.data?.url) {
          uploadedItems.push({
            url: data.data.url,
            public_id: data.data.public_id || "",
            alt: `${editingSubcategory.menuTitle} Real Event Setup ${baseCount + i + 1} - RIWAJ Events`,
          });
        }
      } catch (err) {
        console.error("Multi upload error for file:", fileArray[i].name, err);
      }
    }

    if (uploadedItems.length > 0) {
      setEditingSubcategory((prev: any) => ({
        ...prev,
        relevantImages: [...(prev.relevantImages || []), ...uploadedItems],
      }));
    }
    setMultiUploadLoading(false);
    setMultiUploadProgress("");
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

    let categoryToSave = (modalData.category || "Ceremony").trim();
    if (isCreatingNewCategory && newGalleryCategoryInput.trim()) {
      const raw = newGalleryCategoryInput.trim();
      const formatted = raw
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      categoryToSave = formatted;
      if (!customGalleryCategories.some((c) => c.toLowerCase() === formatted.toLowerCase())) {
        const updated = [...customGalleryCategories, formatted];
        setCustomGalleryCategories(updated);
        try {
          localStorage.setItem("riwaj_custom_gallery_categories", JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
    }

    const payload = {
      ...modalData,
      category: categoryToSave || "Ceremony",
    };

    const method = modalData._id ? "PUT" : "POST";
    const res = await fetch("/api/admin/gallery", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modalData._id ? { id: modalData._id, ...payload } : payload),
    });
    const d = await res.json();
    setSaveLoading(false);
    if (d.success) {
      setShowModal(null);
      setIsCreatingNewCategory(false);
      setNewGalleryCategoryInput("");
      fetchGallery();
      setFeedbackMsg(modalData._id ? "Gallery photo updated!" : `Photo added to "${categoryToSave}" category!`);
      setTimeout(() => setFeedbackMsg(""), 3500);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("riwaj-gallery-updated"));
      }
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

          <button
            type="button"
            onClick={handleCleanDemoData}
            disabled={cleaningDemo}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            title="Permanently remove predefined demo data (team, reviews, blogs, vendors, gallery)"
          >
            <Trash2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">{cleaningDemo ? "Cleaning..." : "Clear Demo Data"}</span>
            <span className="sm:hidden">Clean</span>
          </button>

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
                  { id: "customers", label: "Customer CRM", icon: UserCheck, count: customers.length },
                  { id: "bookings", label: "Event Bookings", icon: Calendar, count: bookings.length },
                  { id: "whatsapp_logs", label: "WhatsApp & Logs", icon: MessageSquare, count: whatsappLogs.length },
                  { id: "vendors", label: "Vendor Directory", icon: Truck, count: vendors.length },
                  { id: "blogs", label: "Wedding Blogs", icon: BookOpen, count: blogs.length },
                  { id: "gallery", label: "Event Gallery", icon: ImageIcon, count: gallery.length },
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

                {/* Collapsible Website Settings Main Menu (Drawer) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setWebsiteSettingsOpen(!websiteSettingsOpen)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      ["hero_banner", "subcategories", "services", "testimonials", "team", "settings", "admins"].includes(activeTab)
                        ? "bg-rose-50 text-rose-800 font-bold border border-rose-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sliders className="w-4 h-4 text-rose-600" />
                      <span>Website Settings</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-200/80 text-gray-700 font-semibold font-mono">
                        7
                      </span>
                      {websiteSettingsOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {websiteSettingsOpen && (
                    <div className="ml-4 pl-3 border-l-2 border-rose-200 space-y-1 mt-1.5 animate-in slide-in-from-top-1 duration-150">
                      {[
                        { id: "hero_banner", label: "Banner & Hero", icon: Sparkles, count: settings?.heroSlides?.length || 0 },
                        { id: "subcategories", label: "Navbar Subcategories", icon: Layers, count: subcategories.length },
                        { id: "services", label: "Manage Services", icon: Briefcase, count: services.length },
                        { id: "testimonials", label: "Client Reviews", icon: Quote, count: testimonials.length },
                        { id: "team", label: "Meet Our Team", icon: UserCheck, count: team.length },
                        { id: "settings", label: "Site & Contacts", icon: Settings },
                        { id: "admins", label: "Team Access", icon: ShieldCheck, count: admins.length },
                      ].map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = activeTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setActiveTab(sub.id as any);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                              isSubActive
                                ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm font-semibold"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <SubIcon className="w-3.5 h-3.5" />
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.count !== undefined && (
                              <span className={`text-[10px] ${isSubActive ? "text-rose-100" : "text-gray-400"}`}>
                                {sub.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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
              { id: "customers", label: "Customer CRM", icon: UserCheck, count: customers.length },
              { id: "bookings", label: "Event Bookings", icon: Calendar, count: bookings.length },
              { id: "whatsapp_logs", label: "WhatsApp & Logs", icon: MessageSquare, count: whatsappLogs.length },
              { id: "vendors", label: "Vendor Directory", icon: Truck, count: vendors.length },
              { id: "blogs", label: "Wedding Blogs", icon: BookOpen, count: blogs.length },
              { id: "gallery", label: "Event Gallery", icon: ImageIcon, count: gallery.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200 font-semibold"
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

            {/* Collapsible Website Settings Main Menu (Desktop) */}
            <div className="pt-3">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Customization
              </div>
              <button
                type="button"
                onClick={() => setWebsiteSettingsOpen(!websiteSettingsOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  ["hero_banner", "subcategories", "services", "testimonials", "team", "settings", "admins"].includes(activeTab)
                    ? "bg-rose-50 text-rose-800 font-bold border border-rose-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-lg ${["hero_banner", "subcategories", "services", "testimonials", "team", "settings", "admins"].includes(activeTab) ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                  <span>Website Settings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 font-semibold font-mono">
                    7
                  </span>
                  {websiteSettingsOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Submenu Accordion Items */}
              {websiteSettingsOpen && (
                <div className="ml-4 pl-3 border-l-2 border-rose-200 space-y-1 mt-1.5 animate-in slide-in-from-top-1 duration-150">
                  {[
                    { id: "hero_banner", label: "Banner & Hero", icon: Sparkles, count: settings?.heroSlides?.length || 0 },
                    { id: "subcategories", label: "Navbar Subcategories", icon: Layers, count: subcategories.length },
                    { id: "services", label: "Manage Services", icon: Briefcase, count: services.length },
                    { id: "testimonials", label: "Client Reviews", icon: Quote, count: testimonials.length },
                    { id: "team", label: "Meet Our Team", icon: UserCheck, count: team.length },
                    { id: "settings", label: "Site & Contacts", icon: Settings },
                    { id: "admins", label: "Team Access", icon: ShieldCheck, count: admins.length },
                  ].map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setActiveTab(sub.id as any)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isSubActive
                            ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <SubIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </div>
                        {sub.count !== undefined && (
                          <span className={`text-[10px] ${isSubActive ? "text-rose-100" : "text-gray-400"}`}>
                            {sub.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
                        venueAddress: "",
                        packagePrice: 0,
                        advanceReceived: 0,
                        followUpDate: "",
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

          {/* TAB: CUSTOMER CRM */}
          {activeTab === "customers" && (
            <CustomerCRM
              customers={customers}
              onRefresh={fetchCustomers}
              onOpenWhatsApp={handleOpenWhatsApp}
              handleFileUpload={handleFileUpload}
              uploadingImage={uploadingImage}
            />
          )}

          {/* TAB: EVENT BOOKINGS & MULTI-EVENTS */}
          {activeTab === "bookings" && (
            <BookingManagement
              bookings={bookings}
              customers={customers}
              vendors={vendors}
              onRefresh={fetchBookings}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}

          {/* TAB: WHATSAPP COMMUNICATION & LOGS */}
          {activeTab === "whatsapp_logs" && (
            <WhatsAppCenter
              logs={whatsappLogs}
              customers={customers}
              bookings={bookings}
              onRefreshLogs={fetchWhatsAppLogs}
              initialRecipients={whatsappInitialRecipients}
              initialDefaultMsg={whatsappInitialDefaultMsg}
            />
          )}

          {/* TAB: VENDOR & PARTNER DIRECTORY (MINI CRM) */}
          {activeTab === "vendors" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Vendor & Partner Directory</h2>
                  <p className="text-sm text-gray-500">
                    Manage your network of catering contractors, DJ sounds, lighting, safa, baggi, and local event freelancers
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setModalData({
                        name: "",
                        phone: "",
                        whatsappNumber: "",
                        state: "Madhya Pradesh",
                        city: "Rewa",
                        address: "",
                        services: [],
                        rateEstimate: "",
                        rating: 5,
                        experienceYears: 3,
                        upiId: "",
                        bankDetails: "",
                        notes: "",
                        isActive: true,
                        totalEventsDone: 0,
                      });
                      setShowModal("vendor");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Partner</span>
                  </button>
                  <button
                    onClick={fetchVendors}
                    title="Refresh Directory"
                    className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Partners</span>
                    <Truck className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-2xl font-serif font-black text-gray-900">{vendors.length}</div>
                  <span className="text-[10px] text-gray-400">Registered contractors</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Status</span>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-serif font-black text-emerald-600">{vendors.filter((v) => v.isActive).length}</div>
                  <span className="text-[10px] text-gray-400">Ready for event allocation</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Events Done</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-serif font-black text-amber-600">
                    {vendors.reduce((acc, v) => acc + (Number(v.totalEventsDone) || 0), 0)}+
                  </div>
                  <span className="text-[10px] text-gray-400">Combined vendor history</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Coverage Area</span>
                    <MapPin className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-xl font-serif font-black text-gray-800">Rewa & MP</div>
                  <span className="text-[10px] text-gray-400">Vindhya regional network</span>
                </div>
              </div>

              {/* Search, Service Filter & Layout Toggle */}
              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xs">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by vendor name, phone, city, or service skill..."
                    value={searchVendor}
                    onChange={(e) => setSearchVendor(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-500 shrink-0">Filter:</span>
                    <select
                      value={vendorServiceFilter}
                      onChange={(e) => setVendorServiceFilter(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    >
                      <option value="all">All Services ({vendors.length})</option>
                      {allAvailableSkills.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Layout Toggle: Rows vs Small Cards */}
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setVendorViewLayout("row")}
                      title="Row Small Card View"
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        vendorViewLayout === "row"
                          ? "bg-white text-rose-600 shadow-xs"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Rows</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVendorViewLayout("card")}
                      title="Grid Small Card View"
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        vendorViewLayout === "card"
                          ? "bg-white text-rose-600 shadow-xs"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Cards</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Vendors List / Cards */}
              {filteredVendors.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-bold text-gray-700 text-sm">No partners or vendors found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click &ldquo;+ Add New Partner&rdquo; to add catering, DJ, decorator, or other local contractors.
                  </p>
                </div>
              ) : vendorViewLayout === "row" ? (
                /* 1. ROW SMALL CARD VIEW */
                <div className="space-y-2.5">
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor._id}
                      onClick={() => setViewVendor(vendor)}
                      className={`bg-white rounded-2xl border p-3.5 sm:p-4 transition-all shadow-xs hover:shadow-md hover:border-rose-300 cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                        vendor.isActive ? "border-gray-200" : "border-gray-200 opacity-60 bg-gray-50/50"
                      }`}
                    >
                      {/* Left: Avatar + Business Name + Location & Rating */}
                      <div className="flex items-center gap-3 min-w-[260px] max-w-sm">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100 flex items-center justify-center text-rose-700 font-serif font-bold text-sm shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          {vendor.name ? vendor.name.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-serif font-bold text-sm sm:text-base text-gray-900 group-hover:text-rose-600 transition-colors truncate">
                              {vendor.name}
                            </h3>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200 shrink-0">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              {vendor.rating || 5}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              {vendor.city || "Rewa"}{vendor.state ? `, ${vendor.state}` : ""}
                            </span>
                            {vendor.experienceYears && <span>• {vendor.experienceYears}+ Yrs Exp</span>}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Services Badges & Rate / Events */}
                      <div className="flex-1 flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                        {vendor.services && vendor.services.length > 0 ? (
                          <>
                            {vendor.services.slice(0, 3).map((svc: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-100"
                              >
                                {svc}
                              </span>
                            ))}
                            {vendor.services.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
                                +{vendor.services.length - 3} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">No specific service assigned</span>
                        )}
                        {vendor.rateEstimate && (
                          <span className="ml-auto md:ml-2 text-[11px] font-semibold text-gray-700 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                            💰 {vendor.rateEstimate}
                          </span>
                        )}
                      </div>

                      {/* Right: Quick Actions & Details Button */}
                      <div
                        className="flex items-center justify-between sm:justify-end gap-1.5 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleVendorStatus(vendor._id, vendor.isActive)}
                          className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-colors ${
                            vendor.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          title="Click to toggle status"
                        >
                          {vendor.isActive ? "Active" : "Inactive"}
                        </button>

                        <a
                          href={`tel:${vendor.phone}`}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                          title={`Call ${vendor.phone}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={`https://wa.me/${(vendor.whatsappNumber || vendor.phone).replace(/[^0-9]/g, "")}?text=नमस्ते%20${encodeURIComponent(
                            vendor.name
                          )}%20ji%2C%20RIWAJ%20Events%20Rewa%20se%20ek%20new%20wedding%20event%20regarding%20baat%20karni%20thi.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setModalData({
                              _id: vendor._id,
                              name: vendor.name,
                              phone: vendor.phone,
                              whatsappNumber: vendor.whatsappNumber || vendor.phone,
                              state: vendor.state || "Madhya Pradesh",
                              city: vendor.city || "Rewa",
                              address: vendor.address || "",
                              services: vendor.services || [],
                              rateEstimate: vendor.rateEstimate || "",
                              rating: vendor.rating || 5,
                              experienceYears: vendor.experienceYears || 3,
                              upiId: vendor.upiId || "",
                              bankDetails: vendor.bankDetails || "",
                              notes: vendor.notes || "",
                              isActive: vendor.isActive !== false,
                              totalEventsDone: vendor.totalEventsDone || 0,
                            });
                            setShowModal("vendor");
                          }}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors"
                          title="Edit Vendor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteVendor(vendor._id)}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors"
                          title="Delete Vendor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setViewVendor(vendor)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* 2. COMPACT SMALL CARD GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor._id}
                      onClick={() => setViewVendor(vendor)}
                      className={`bg-white rounded-2xl border p-4 transition-all shadow-xs hover:shadow-md hover:border-rose-300 cursor-pointer group flex flex-col justify-between ${
                        vendor.isActive ? "border-gray-200" : "border-gray-200 opacity-60 bg-gray-50/50"
                      }`}
                    >
                      <div>
                        {/* Top: Avatar, Name, Rating & Status */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100 flex items-center justify-center text-rose-700 font-serif font-bold text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                              {vendor.name ? vendor.name.charAt(0).toUpperCase() : "P"}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-serif font-bold text-sm text-gray-900 group-hover:text-rose-600 transition-colors truncate">
                                {vendor.name}
                              </h3>
                              <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                <span>{vendor.city || "Rewa"}{vendor.state ? `, ${vendor.state}` : ""}</span>
                                {vendor.experienceYears && <span>• {vendor.experienceYears}+ Yrs</span>}
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200 shrink-0">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            {vendor.rating || 5}
                          </span>
                        </div>

                        {/* Services chips */}
                        <div className="flex flex-wrap gap-1 my-2.5">
                          {vendor.services && vendor.services.length > 0 ? (
                            <>
                              {vendor.services.slice(0, 2).map((svc: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-100 truncate max-w-[120px]"
                                >
                                  {svc}
                                </span>
                              ))}
                              {vendor.services.length > 2 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
                                  +{vendor.services.length - 2}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">No services</span>
                          )}
                        </div>

                        {/* Rate Estimate */}
                        {vendor.rateEstimate && (
                          <div className="text-[11px] font-semibold text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg mb-2 truncate">
                            💰 {vendor.rateEstimate}
                          </div>
                        )}
                      </div>

                      {/* Bottom Footer Actions */}
                      <div
                        className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-1 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${vendor.phone}`}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                            title="Call"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                          <a
                            href={`https://wa.me/${(vendor.whatsappNumber || vendor.phone).replace(/[^0-9]/g, "")}?text=नमस्ते%20${encodeURIComponent(
                              vendor.name
                            )}%20ji%2C%20RIWAJ%20Events%20Rewa%20se%20ek%20new%20wedding%20event%20regarding%20baat%20karni%20thi.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                            title="WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setModalData({
                                _id: vendor._id,
                                name: vendor.name,
                                phone: vendor.phone,
                                whatsappNumber: vendor.whatsappNumber || vendor.phone,
                                state: vendor.state || "Madhya Pradesh",
                                city: vendor.city || "Rewa",
                                address: vendor.address || "",
                                services: vendor.services || [],
                                rateEstimate: vendor.rateEstimate || "",
                                rating: vendor.rating || 5,
                                experienceYears: vendor.experienceYears || 3,
                                upiId: vendor.upiId || "",
                                bankDetails: vendor.bankDetails || "",
                                notes: vendor.notes || "",
                                isActive: vendor.isActive !== false,
                                totalEventsDone: vendor.totalEventsDone || 0,
                              });
                              setShowModal("vendor");
                            }}
                            className="w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVendor(vendor._id)}
                            className="w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewVendor(vendor)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] rounded-lg transition-colors"
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

          {/* TAB: NAVBAR SUBCATEGORIES (EVENT PAGES) */}
          {activeTab === "subcategories" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">
                    Navbar Categories & Subcategories
                  </h2>
                  <p className="text-sm text-gray-500">
                    Control Main Hero Banners, Relevant Event Showcase Photos, and SEO Alt Tags for each subcategory page.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {subcategories.length} Total Subcategories (MongoDB Live)
                  </span>
                </div>
              </div>

              {/* Photo Upload Aspect Ratio Guideline Banner */}
              <div className="bg-gradient-to-br from-amber-50 via-rose-50/50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-serif font-bold text-gray-900 text-sm sm:text-base">
                        📸 Recommended Photo Aspect Ratios & SEO Alt Guidelines
                      </h4>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full">
                        Cloudinary Auto-WebP Enabled
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-700 pt-1">
                      <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                        <p className="font-bold text-rose-600 mb-1 flex items-center gap-1.5">
                          <span>1. Main Hero Banner</span>
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold">16:9 or 4:3</span>
                        </p>
                        <p className="text-[11px] text-gray-600">
                          Recommended: <strong>1200 x 800 px</strong> or <strong>1200 x 675 px</strong> (Landscape). Right hero column + OpenGraph social preview.
                        </p>
                      </div>

                      <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                        <p className="font-bold text-amber-700 mb-1 flex items-center gap-1.5">
                          <span>2. Showcase Gallery Setups</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">4:3 Landscape</span>
                        </p>
                        <p className="text-[11px] text-gray-600">
                          Recommended: <strong>800 x 600 px</strong> or <strong>1200 x 800 px</strong>. Displays under <em>&quot;Hamare Recent Setups&quot;</em> grid.
                        </p>
                      </div>

                      <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                        <p className="font-bold text-emerald-700 mb-1 flex items-center gap-1.5">
                          <span>3. SEO Image Alt Text</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Mandatory</span>
                        </p>
                        <p className="text-[11px] text-gray-600">
                          Add descriptive keywords (e.g. <em>&quot;Royal Wedding Catering Buffet Setup in Rewa - RIWAJ&quot;</em>) to rank on Google Images.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: "all", label: "All Subcategories", count: subcategories.length },
                    { id: "catering", label: "Catering", count: subcategories.filter((s) => s.category === "catering").length },
                    { id: "decoration", label: "Decoration", count: subcategories.filter((s) => s.category === "decoration").length },
                    { id: "wedding", label: "Wedding", count: subcategories.filter((s) => s.category === "wedding").length },
                    { id: "corporate", label: "Corporate Event", count: subcategories.filter((s) => s.category === "corporate").length },
                  ].map((cat) => {
                    const isSelected = subcategoryCategoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSubcategoryCategoryFilter(cat.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-rose-600 text-white shadow-sm"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-rose-50 hover:text-rose-600"
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Box */}
                <div className="relative min-w-[240px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={subcategorySearch}
                    onChange={(e) => setSubcategorySearch(e.target.value)}
                    placeholder="Search subcategory or slug..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              {/* Subcategories Grid */}
              {(() => {
                const filtered = subcategories.filter((sub) => {
                  const matchCategory =
                    subcategoryCategoryFilter === "all" || sub.category?.toLowerCase() === subcategoryCategoryFilter.toLowerCase();
                  const matchSearch =
                    !subcategorySearch.trim() ||
                    sub.menuTitle?.toLowerCase().includes(subcategorySearch.toLowerCase()) ||
                    sub.title?.toLowerCase().includes(subcategorySearch.toLowerCase()) ||
                    sub.slug?.toLowerCase().includes(subcategorySearch.toLowerCase());
                  return matchCategory && matchSearch;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
                      <Layers className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-gray-700">No subcategories found</p>
                      <p className="text-xs text-gray-400 mt-1">Try changing your search or category filter above.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((sub) => {
                      const categoryColors: Record<string, { bg: string; text: string; badge: string }> = {
                        catering: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-700", badge: "Catering" },
                        decoration: { bg: "bg-rose-50 text-rose-700 border-rose-200", text: "text-rose-700", badge: "Decoration" },
                        wedding: { bg: "bg-purple-50 text-purple-700 border-purple-200", text: "text-purple-700", badge: "Wedding" },
                        corporate: { bg: "bg-amber-50 text-amber-700 border-amber-200", text: "text-amber-700", badge: "Corporate" },
                      };
                      const catStyle = categoryColors[sub.category] || categoryColors.catering;

                      return (
                        <div
                          key={sub._id || sub.slug}
                          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          <div>
                            {/* Main Hero Image Thumbnail */}
                            <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden group">
                              <Image
                                src={sub.mainImage?.url || "/og-image.jpg"}
                                alt={sub.mainImage?.alt || sub.menuTitle}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              {/* Category Badge */}
                              <div className="absolute top-3 left-3 z-10">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${catStyle.bg}`}>
                                  {sub.category}
                                </span>
                              </div>
                              {/* Showcase count badge */}
                              <div className="absolute top-3 right-3 z-10">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md shadow-xs">
                                  🖼️ {(sub.relevantImages || []).length} Showcase Setups
                                </span>
                              </div>
                              {/* Slug / Route badge at bottom */}
                              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                                <p className="text-white text-xs font-bold line-clamp-1">{sub.menuTitle}</p>
                                <span className="text-[10px] text-gray-200 font-mono">/{sub.slug}</span>
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-4 space-y-2">
                              <div>
                                <h3 className="font-serif font-bold text-sm text-gray-900 leading-snug line-clamp-1">
                                  {sub.title}
                                </h3>
                              </div>

                              {/* SEO Alt Text Preview */}
                              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px]">
                                <span className="font-bold text-gray-500 block mb-0.5 text-[10px] uppercase tracking-wider">
                                  🔍 Main Hero Alt (SEO):
                                </span>
                                <p className="text-gray-700 italic line-clamp-1">
                                  &quot;{sub.mainImage?.alt || "No alt text set"}&quot;
                                </p>
                              </div>

                              {/* Showcase Mini Thumbnails */}
                              {sub.relevantImages && sub.relevantImages.length > 0 && (
                                <div>
                                  <span className="font-bold text-gray-500 block mb-1.5 text-[10px] uppercase tracking-wider">
                                    Relevant Setups ({sub.relevantImages.length}):
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    {sub.relevantImages.slice(0, 4).map((rel: any, idx: number) => (
                                      <div
                                        key={idx}
                                        className="relative w-12 h-9 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0"
                                        title={rel.alt || `Setup ${idx + 1}`}
                                      >
                                        <Image
                                          src={rel.url}
                                          alt={rel.alt || `Setup ${idx + 1}`}
                                          fill
                                          className="object-cover"
                                          sizes="50px"
                                        />
                                      </div>
                                    ))}
                                    {sub.relevantImages.length > 4 && (
                                      <span className="text-[10px] text-gray-400 font-bold px-1">
                                        +{sub.relevantImages.length - 4} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                            <a
                              href={`/${sub.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <span>View Page</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => {
                                setEditingSubcategory(JSON.parse(JSON.stringify(sub)));
                                setNewRelevantImgInput({ url: "", alt: "", public_id: "" });
                                setShowModal("subcategory");
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Photos & SEO Alt</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Event Photo Gallery</h2>
                  <p className="text-sm text-gray-500">
                    Upload & manage portfolio images with custom categories (synced live with public /gallery filter tabs)
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setIsCreatingNewCategory(true);
                      setNewGalleryCategoryInput("");
                      setModalData({ title: "", category: "", eventLocation: "Rewa, MP", order: gallery.length + 1 });
                      setShowModal("gallery");
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New Category</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingNewCategory(false);
                      setNewGalleryCategoryInput("");
                      setModalData({
                        title: "",
                        category: adminGalleryCategoryFilter !== "all" ? adminGalleryCategoryFilter : "Ceremony",
                        eventLocation: "Rewa, MP",
                        order: gallery.length + 1,
                      });
                      setShowModal("gallery");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl text-xs font-semibold shadow-md hover:opacity-90 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Category Filter Bar for Admin */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setAdminGalleryCategoryFilter("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    adminGalleryCategoryFilter === "all"
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >
                  All ({gallery.length})
                </button>
                {allGalleryCategories.map((cat: string) => {
                  const count = gallery.filter((g) => (g.category || "").toLowerCase() === cat.toLowerCase()).length;
                  const isSelected = adminGalleryCategoryFilter.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => setAdminGalleryCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-rose-600 text-white shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-rose-50 hover:text-rose-600"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Gallery Grid */}
              {(() => {
                const displayedGallery =
                  adminGalleryCategoryFilter === "all"
                    ? gallery
                    : gallery.filter((item) => (item.category || "").toLowerCase() === adminGalleryCategoryFilter.toLowerCase());

                if (displayedGallery.length === 0) {
                  return (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
                      <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-gray-700">No photos found in category &quot;{adminGalleryCategoryFilter}&quot;</p>
                      <p className="text-xs text-gray-400 mt-1">Upload a photo to populate this category!</p>
                      <button
                        onClick={() => {
                          setIsCreatingNewCategory(false);
                          setModalData({
                            title: "",
                            category: adminGalleryCategoryFilter !== "all" ? adminGalleryCategoryFilter : "Ceremony",
                            eventLocation: "Rewa, MP",
                            order: gallery.length + 1,
                          });
                          setShowModal("gallery");
                        }}
                        className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload to &quot;{adminGalleryCategoryFilter}&quot;</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {displayedGallery.map((item) => (
                      <div
                        key={item._id}
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-sm bg-gray-100 border border-gray-200"
                      >
                        <Image
                          src={item.image?.url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="25vw"
                        />
                        {/* Always visible category badge */}
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md shadow-sm border border-white/20">
                            {item.category || "Ceremony"}
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end z-20">
                          <p className="text-white text-xs font-bold line-clamp-1">{item.title}</p>
                          <span className="text-[10px] text-rose-200 mt-0.5">{item.category}</span>
                          <div className="flex items-center justify-end gap-1.5 mt-2">
                            <button
                              onClick={() => {
                                setIsCreatingNewCategory(false);
                                setNewGalleryCategoryInput("");
                                setModalData(item);
                                setShowModal("gallery");
                              }}
                              className="w-7 h-7 rounded-lg bg-white/90 text-gray-800 flex items-center justify-center hover:bg-white transition-colors shadow"
                              title="Edit photo & category"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-gray-700" />
                            </button>
                            <button
                              onClick={() => handleDeleteGallery(item._id)}
                              className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow"
                              title="Delete photo permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  {team.some((m) => m.image?.url?.includes("unsplash.com") || ["Shivam Patel", "Pooja Singh", "Aman Tiwari", "Ritika Mishra"].includes(m.name)) && (
                    <button
                      type="button"
                      onClick={handleCleanDemoData}
                      disabled={cleaningDemo}
                      className="px-3 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>{cleaningDemo ? "Purging..." : "Remove Demo Team"}</span>
                    </button>
                  )}
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
                    className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Team Member</span>
                  </button>
                </div>
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

                {/* Google Maps Location Link (OLX Style Map Box) */}
                <div className="p-4 bg-gradient-to-r from-emerald-50/60 to-teal-50/40 rounded-2xl border border-emerald-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>Google Maps Location Link (OLX-Style Interactive Map Box)</span>
                    </label>
                    {settings?.googleMapUrl && (
                      <a
                        href={settings.googleMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                      >
                        <span>Test Map Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/?q=Rewa+Madhya+Pradesh or https://goo.gl/maps/..."
                    value={settings?.googleMapUrl || ""}
                    onChange={(e) => setSettings({ ...settings, googleMapUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-emerald-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 bg-white font-mono"
                  />
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    💡 This link powers the clickable square location box on the <strong>Contact page</strong>, <strong>Footer</strong>, and other pages. Clicking redirects users directly to this map pin.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span>Instagram URL</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.instagram.com/..."
                      value={settings?.socialLinks?.instagram || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...(settings?.socialLinks || {}), instagram: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>Facebook URL</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.facebook.com/..."
                      value={settings?.socialLinks?.facebook || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...(settings?.socialLinks || {}), facebook: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      <span>YouTube Channel URL</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/@..."
                      value={settings?.socialLinks?.youtube || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...(settings?.socialLinks || {}), youtube: e.target.value },
                        })
                      }
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
          onClick={() => setActiveTab("customers")}
          className={`flex flex-col items-center gap-1 ${activeTab === "customers" ? "text-rose-600 font-bold" : "text-gray-500"}`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px]">Clients</span>
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex flex-col items-center gap-1 ${activeTab === "bookings" ? "text-rose-600 font-bold" : "text-gray-500"}`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Bookings</span>
        </button>

        <button
          onClick={() => setActiveTab("whatsapp_logs")}
          className={`flex flex-col items-center gap-1 ${activeTab === "whatsapp_logs" ? "text-rose-600 font-bold" : "text-gray-500"}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">WhatsApp</span>
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

              {/* Event Venue & Follow-up */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Venue / Hall Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajkamal Palace, Rewa"
                    value={modalData.venueAddress || ""}
                    onChange={(e) => setModalData({ ...modalData, venueAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={modalData.followUpDate || ""}
                    onChange={(e) => setModalData({ ...modalData, followUpDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>
              </div>

              {/* Deal Pricing & Client Advance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Client Deal / Package Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 250000"
                    value={modalData.packagePrice !== undefined ? modalData.packagePrice : ""}
                    onChange={(e) => setModalData({ ...modalData, packagePrice: e.target.value })}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 bg-white font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Advance Received (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50000"
                    value={modalData.advanceReceived !== undefined ? modalData.advanceReceived : ""}
                    onChange={(e) => setModalData({ ...modalData, advanceReceived: e.target.value })}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 bg-white font-bold text-emerald-800"
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

      {/* 0. Inquiry / Lead Details View Modal (Mini Event CRM & Work Order Chain) */}
      {viewInquiry && (() => {
        const assignedVendors = Array.isArray(viewInquiry.assignedVendors) ? viewInquiry.assignedVendors : [];
        const pkgPrice = Number(viewInquiry.packagePrice) || 0;
        const advReceived = Number(viewInquiry.advanceReceived) || 0;
        const clientBal = Math.max(0, pkgPrice - advReceived);
        const totalVendorCost = assignedVendors.reduce((acc: number, v: any) => acc + (Number(v.agreedCost) || 0), 0);
        const totalVendorAdvance = assignedVendors.reduce((acc: number, v: any) => acc + (Number(v.advancePaid) || 0), 0);
        const vendorBal = Math.max(0, totalVendorCost - totalVendorAdvance);
        const netProfit = pkgPrice - totalVendorCost;
        const profitPercent = pkgPrice > 0 ? Math.round((netProfit / pkgPrice) * 100) : 0;

        const vendorWorkOrderWhatsApp = (v: any) => {
          const text = `नमस्ते ${v.vendorName || "Partner"} ji,\n\nRIWAJ Events Rewa ki taraf se event work order:\n📋 Event: ${viewInquiry.eventType || "Wedding"} (${viewInquiry.name})\n📅 Date: ${viewInquiry.date || "Scheduled Date"}\n📍 Venue: ${viewInquiry.venueAddress || "Rewa, M.P."}\n🛠 Service: ${v.serviceName}\n⏰ Reporting Time: ${v.reportingTime || "As agreed"}\n💰 Agreed Cost: ₹${(Number(v.agreedCost) || 0).toLocaleString("en-IN")}\n💵 Advance Paid: ₹${(Number(v.advancePaid) || 0).toLocaleString("en-IN")}\n🪙 Pending Balance: ₹${Math.max(0, (Number(v.agreedCost) || 0) - (Number(v.advancePaid) || 0)).toLocaleString("en-IN")}${v.notes ? `\n📝 Special Note: ${v.notes}` : ""}\n\nKripya confirmation message bhejein. Dhanyawad!\n- RIWAJ Events Rewa`;
          const phoneClean = (v.vendorPhone || "").replace(/[^0-9]/g, "");
          return `https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`;
        };

        const clientFollowUpWhatsApp = () => {
          const text = `Namaste ${viewInquiry.name} ji,\n\nRIWAJ Events Rewa ki taraf se greetings! 🙏\nAapke upcoming ${viewInquiry.eventType || "Wedding"} celebration (${viewInquiry.date || "Event Date"}) ke decor and arrangements ke regarding hum connect karna chahte the.\n\nKya hum aapse convenient time par call par baat kar sakte hain ya office par visit plan karein?\n\nDhanyawad,\nRIWAJ Events & Luxury Decor, Rewa (M.P.)\nHelpline: ${settings?.primaryPhone || "+91 98270 00000"}`;
          const phoneClean = (viewInquiry.phone || "").replace(/[^0-9]/g, "");
          return `https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`;
        };

        return (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
            onClick={() => setViewInquiry(null)}
          >
            <div
              className="bg-white w-full sm:max-w-2xl max-h-[94vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
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

              {/* Quick Action Header Bar (Call, Direct WhatsApp, WhatsApp Follow-up, Status Selector) */}
              <div className="px-5 sm:px-6 py-2.5 bg-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <a
                    href={`tel:${viewInquiry.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={clientFollowUpWhatsApp()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
                    title="Send follow-up WhatsApp to client"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Follow-up WA</span>
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
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                  <div className="col-span-2 sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      Venue / Location
                    </span>
                    <span className="font-bold text-gray-800 text-xs">
                      {viewInquiry.venueAddress || "Rewa / Not specified"}
                    </span>
                  </div>
                  {viewInquiry.followUpDate && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Follow-up Due
                      </span>
                      <span className="font-bold text-amber-800 text-xs">{viewInquiry.followUpDate}</span>
                    </div>
                  )}
                </div>

                {/* 1. FINANCIALS & PROFIT CALCULATOR CARD */}
                <div className="bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 rounded-2xl p-4 border border-emerald-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-serif font-bold text-sm text-gray-900">Event Financials & Profit Margin</h4>
                    </div>
                    {pkgPrice > 0 ? (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          netProfit >= 0
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
                        {netProfit >= 0 ? `+${profitPercent}% Gross Margin` : `${profitPercent}% Margin (Loss)`}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                        Set package price to see margins
                      </span>
                    )}
                  </div>

                  {/* Financial Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-500 font-medium block">Client Deal Price</span>
                      <span className="font-serif font-bold text-base text-gray-900">
                        ₹{pkgPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 font-medium block">Advance Received</span>
                      <span className="font-serif font-bold text-base text-emerald-600">
                        ₹{advReceived.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[9px] text-gray-400 block">Due: ₹{clientBal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-rose-200">
                      <span className="text-[10px] text-rose-700 font-medium block">Total Vendor Costs</span>
                      <span className="font-serif font-bold text-base text-rose-600">
                        ₹{totalVendorCost.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[9px] text-gray-400 block">{assignedVendors.length} contractors</span>
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border ${
                        netProfit >= 0
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-rose-600 text-white border-rose-600"
                      }`}
                    >
                      <span className="text-[10px] text-white/80 font-medium block">Est. Net Margin</span>
                      <span className="font-serif font-black text-base text-white">
                        ₹{netProfit.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[9px] text-white/80 block">
                        {netProfit >= 0 ? "Profit" : "Loss"}
                      </span>
                    </div>
                  </div>

                  {/* Quick Inline Financial Updater */}
                  <div className="pt-2 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-semibold text-gray-600">Deal: ₹</span>
                        <input
                          type="number"
                          defaultValue={pkgPrice}
                          onBlur={(e) =>
                            handleUpdateInquiryFinancials({ packagePrice: Number(e.target.value) || 0 })
                          }
                          className="w-24 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-800"
                          placeholder="Deal Price"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-semibold text-gray-600">Advance: ₹</span>
                        <input
                          type="number"
                          defaultValue={advReceived}
                          onBlur={(e) =>
                            handleUpdateInquiryFinancials({ advanceReceived: Number(e.target.value) || 0 })
                          }
                          className="w-24 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold text-emerald-700"
                          placeholder="Advance"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 italic">Auto-saves on blur</span>
                  </div>
                </div>

                {/* 2. ASSIGNED VENDORS & WORK ORDER CHAIN */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-rose-500" />
                      <h4 className="font-serif font-bold text-sm text-gray-900">Contractor Work Orders & Chain</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {assignedVendors.length} Assigned
                    </span>
                  </div>

                  {/* Assigned Vendors List */}
                  {assignedVendors.length === 0 ? (
                    <div className="py-6 text-center bg-gray-50/70 rounded-xl border border-dashed border-gray-200">
                      <Truck className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
                      <p className="text-gray-600 font-semibold text-xs">No vendors or contractors assigned yet</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Assign contractors for DJ, Catering, Safa, Photography, etc. to delegate duties and dispatch WhatsApp work orders.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {assignedVendors.map((av: any, idx: number) => {
                        const avCost = Number(av.agreedCost) || 0;
                        const avAdv = Number(av.advancePaid) || 0;
                        const avBal = Math.max(0, avCost - avAdv);

                        return (
                          <div
                            key={idx}
                            className="bg-gray-50/80 rounded-xl p-3 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition"
                          >
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px]">
                                  {av.serviceName}
                                </span>
                                <h5 className="font-bold text-gray-900 text-xs">{av.vendorName}</h5>
                                <span className="text-[10px] text-gray-500 font-mono">({av.vendorPhone})</span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold capitalize ${
                                    av.status === "confirmed"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : av.status === "completed"
                                      ? "bg-blue-100 text-blue-800"
                                      : av.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {av.status || "assigned"}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-[11px] text-gray-600 flex-wrap">
                                <span>
                                  Agreed: <strong className="text-gray-800">₹{avCost.toLocaleString("en-IN")}</strong>
                                </span>
                                <span>
                                  Paid: <strong className="text-emerald-700">₹{avAdv.toLocaleString("en-IN")}</strong>
                                </span>
                                <span>
                                  Due: <strong className="text-rose-600">₹{avBal.toLocaleString("en-IN")}</strong>
                                </span>
                                {av.reportingTime && (
                                  <span className="text-gray-500">
                                    ⏰ Report: <strong>{av.reportingTime}</strong>
                                  </span>
                                )}
                              </div>

                              {av.notes && (
                                <p className="text-[10px] text-gray-500 italic bg-white p-1.5 rounded-lg border border-gray-200">
                                  Note: {av.notes}
                                </p>
                              )}
                            </div>

                            {/* Actions: Send WhatsApp Work Order & Remove */}
                            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                              <a
                                href={vendorWorkOrderWhatsApp(av)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition"
                                title="Send official Work Order WhatsApp to contractor"
                              >
                                <Send className="w-3 h-3" />
                                <span>Dispatch WA</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => handleRemoveVendorAssignment(idx)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Remove contractor assignment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Inline Add Assignment Button / Form */}
                  {!assigningVendor ? (
                    <button
                      type="button"
                      onClick={() => setAssigningVendor(true)}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-rose-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Assign Vendor / Create Work Order</span>
                    </button>
                  ) : (
                    <div className="bg-rose-50/40 p-3.5 rounded-xl border border-rose-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-rose-950">New Contractor Work Order</span>
                        <button
                          type="button"
                          onClick={() => setAssigningVendor(false)}
                          className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                        >
                          ✕ Cancel
                        </button>
                      </div>

                      {/* Select from registered vendors */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                          Select from Registered Partners (or enter below)
                        </label>
                        <select
                          value={newAssignment.vendorId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            if (!selectedId) {
                              setNewAssignment({
                                ...newAssignment,
                                vendorId: "",
                                vendorName: "",
                                vendorPhone: "",
                                serviceName: "",
                              });
                              return;
                            }
                            const v = vendors.find((vend) => vend._id === selectedId);
                            if (v) {
                              setNewAssignment({
                                ...newAssignment,
                                vendorId: v._id,
                                vendorName: v.name,
                                vendorPhone: v.whatsappNumber || v.phone,
                                serviceName: v.services?.[0] || newAssignment.serviceName,
                              });
                            }
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 font-medium"
                        >
                          <option value="">-- Choose from Vendor Directory --</option>
                          {vendors
                            .filter((v) => v.isActive)
                            .map((v) => (
                              <option key={v._id} value={v._id}>
                                {v.name} ({v.services?.join(", ") || "General"}) — {v.city || "Rewa"}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Contractor Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh DJ Sounds"
                            value={newAssignment.vendorName}
                            onChange={(e) => setNewAssignment({ ...newAssignment, vendorName: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Phone Number *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 9827012345"
                            value={newAssignment.vendorPhone}
                            onChange={(e) => setNewAssignment({ ...newAssignment, vendorPhone: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Service Tag *</label>
                          <input
                            type="text"
                            list="serviceTagsList"
                            required
                            placeholder="e.g. DJ & Sounds"
                            value={newAssignment.serviceName}
                            onChange={(e) => setNewAssignment({ ...newAssignment, serviceName: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                          />
                          <datalist id="serviceTagsList">
                            <option value="Catering & Food" />
                            <option value="DJ & Sounds" />
                            <option value="Stage Lighting" />
                            <option value="Mandap & Floral Decor" />
                            <option value="Photography & Video" />
                            <option value="Safa Tying" />
                            <option value="Baggi & Horse Entry" />
                            <option value="Atishbaji & Cold Pyro" />
                            <option value="Venue & Tent Setup" />
                            <option value="Uniformed Staff" />
                            <option value="Generator & Power Backup" />
                          </datalist>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Agreed Cost (₹)</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 15000"
                            value={newAssignment.agreedCost || ""}
                            onChange={(e) =>
                              setNewAssignment({ ...newAssignment, agreedCost: Number(e.target.value) || 0 })
                            }
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Advance Paid (₹)</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 5000"
                            value={newAssignment.advancePaid || ""}
                            onChange={(e) =>
                              setNewAssignment({ ...newAssignment, advancePaid: Number(e.target.value) || 0 })
                            }
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-emerald-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Reporting Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 4:00 PM"
                            value={newAssignment.reportingTime}
                            onChange={(e) => setNewAssignment({ ...newAssignment, reportingTime: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Work Order Note</label>
                          <input
                            type="text"
                            placeholder="Equipment specifics, special instructions..."
                            value={newAssignment.notes}
                            onChange={(e) => setNewAssignment({ ...newAssignment, notes: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setAssigningVendor(false)}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={saveLoading}
                          onClick={handleAddVendorAssignment}
                          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                        >
                          {saveLoading ? "Assigning..." : "Assign & Create Work Order"}
                        </button>
                      </div>
                    </div>
                  )}
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
                        venueAddress: current.venueAddress || "",
                        packagePrice: current.packagePrice || 0,
                        advanceReceived: current.advanceReceived || 0,
                        followUpDate: current.followUpDate || "",
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
        );
      })()}

      {/* 0.1 Vendor / Partner Full Details View Modal */}
      {viewVendor && (() => {
        // Find any inquiries where this vendor is assigned
        const vendorAllocations = inquiries.filter((inq: any) =>
          Array.isArray(inq.assignedVendors) &&
          inq.assignedVendors.some(
            (av: any) =>
              (av.vendorId && av.vendorId === viewVendor._id) ||
              (av.vendorName && viewVendor.name && av.vendorName.toLowerCase() === viewVendor.name.toLowerCase())
          )
        );

        const cleanPhone = (viewVendor.whatsappNumber || viewVendor.phone || "").replace(/[^0-9]/g, "");
        const waLink = `https://wa.me/${cleanPhone}?text=नमस्ते%20${encodeURIComponent(
          viewVendor.name || "Partner"
        )}%20ji%2C%20RIWAJ%20Events%20Rewa%20se%20ek%20new%20wedding%20event%20regarding%20baat%20karni%20thi.`;

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 border border-gray-100">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white font-serif font-black text-xl flex items-center justify-center shadow-md shadow-rose-200 shrink-0">
                    {viewVendor.name ? viewVendor.name.charAt(0).toUpperCase() : "P"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-black text-xl text-gray-900 leading-tight">
                        {viewVendor.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {viewVendor.rating || 5}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleVendorStatus(viewVendor._id, viewVendor.isActive)}
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-colors ${
                          viewVendor.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500"
                        }`}
                        title="Click to toggle active status"
                      >
                        {viewVendor.isActive ? "● Active Partner" : "○ Inactive"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{viewVendor.city || "Rewa"}{viewVendor.state ? `, ${viewVendor.state}` : ""}</span>
                      {viewVendor.experienceYears && <span>• {viewVendor.experienceYears}+ Years Experience</span>}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewVendor(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Contact & Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
                <a
                  href={`tel:${viewVendor.phone}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call {viewVendor.phone}</span>
                </a>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Services & Skills Badges */}
              <div className="mb-4 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Specialized Services & Skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(viewVendor.services) && viewVendor.services.length > 0 ? (
                    viewVendor.services.map((svc: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white text-rose-700 font-bold text-xs border border-rose-100 shadow-2xs"
                      >
                        {svc}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No services listed yet</span>
                  )}
                </div>
              </div>

              {/* 4-Stat Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-xs">
                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block mb-0.5">
                    Rate Estimate
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    {viewVendor.rateEstimate || "Negotiable / TBD"}
                  </span>
                </div>
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-0.5">
                    Experience
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    {viewVendor.experienceYears || 1}+ Yrs
                  </span>
                </div>
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-0.5">
                    Events Done
                  </span>
                  <span className="font-bold text-emerald-800 text-sm">
                    {viewVendor.totalEventsDone || 0} events
                  </span>
                </div>
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                    Location
                  </span>
                  <span className="font-bold text-gray-900 text-sm truncate block">
                    {viewVendor.city || "Rewa"}{viewVendor.state ? `, ${viewVendor.state}` : ""}
                  </span>
                </div>
              </div>

              {/* Contact & Location Details */}
              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 mb-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    Phone / Primary:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{viewVendor.phone}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(viewVendor.phone, "phone")}
                      className="text-[10px] px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded font-semibold transition-colors"
                    >
                      {copiedText === "phone" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {viewVendor.whatsappNumber && (
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      WhatsApp:
                    </span>
                    <span className="font-bold text-gray-900">{viewVendor.whatsappNumber}</span>
                  </div>
                )}

                {viewVendor.address && (
                  <div className="flex items-start justify-between text-gray-700 pt-1 border-t border-gray-100">
                    <span className="text-gray-400 flex items-center gap-1.5 shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      Full Address:
                    </span>
                    <span className="font-medium text-gray-800 text-right pl-3">{viewVendor.address}</span>
                  </div>
                )}
              </div>

              {/* Financial & Payout Info */}
              <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-3.5 rounded-2xl border border-emerald-100 mb-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    Payout & Payment Credentials
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">UPI ID / VPA</span>
                    <span className="font-mono font-bold text-emerald-800 text-xs">
                      {viewVendor.upiId || "Not added yet"}
                    </span>
                  </div>
                  {viewVendor.upiId && (
                    <button
                      type="button"
                      onClick={() => handleCopy(viewVendor.upiId, "upi")}
                      className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedText === "upi" ? "Copied!" : "Copy UPI"}</span>
                    </button>
                  )}
                </div>
                {viewVendor.bankDetails && (
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
                      Bank Account Details / Notes
                    </span>
                    <p className="font-mono text-gray-700 text-xs whitespace-pre-wrap">{viewVendor.bankDetails}</p>
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              {viewVendor.notes && (
                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/70 mb-4 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                    Internal Admin Notes & Special Instructions
                  </span>
                  <p className="text-gray-700 italic leading-relaxed whitespace-pre-wrap">&ldquo;{viewVendor.notes}&rdquo;</p>
                </div>
              )}

              {/* Event Engagements from CRM */}
              {vendorAllocations.length > 0 && (
                <div className="mb-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-rose-500" />
                      Assigned Wedding Events ({vendorAllocations.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {vendorAllocations.map((inq: any) => {
                      const assignment = inq.assignedVendors?.find(
                        (av: any) =>
                          (av.vendorId && av.vendorId === viewVendor._id) ||
                          (av.vendorName && viewVendor.name && av.vendorName.toLowerCase() === viewVendor.name.toLowerCase())
                      );
                      return (
                        <div key={inq._id} className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-gray-900 block">{inq.name} ({inq.eventType || "Wedding"})</span>
                            <span className="text-[10px] text-gray-500">
                              📅 {inq.date || "Scheduled"} • Service: {assignment?.serviceName || "Contractor"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-rose-600 block">
                              ₹{(Number(assignment?.agreedCost) || 0).toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              Adv: ₹{(Number(assignment?.advancePaid) || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteVendor(viewVendor._id);
                    setViewVendor(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Partner</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const current = viewVendor;
                      setViewVendor(null);
                      setModalData({
                        _id: current._id,
                        name: current.name,
                        phone: current.phone,
                        whatsappNumber: current.whatsappNumber || current.phone,
                        state: current.state || "Madhya Pradesh",
                        city: current.city || "Rewa",
                        address: current.address || "",
                        services: current.services || [],
                        rateEstimate: current.rateEstimate || "",
                        rating: current.rating || 5,
                        experienceYears: current.experienceYears || 3,
                        upiId: current.upiId || "",
                        bankDetails: current.bankDetails || "",
                        notes: current.notes || "",
                        isActive: current.isActive !== false,
                        totalEventsDone: current.totalEventsDone || 0,
                      });
                      setShowModal("vendor");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewVendor(null)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
            <h3 className="font-serif font-bold text-xl text-gray-900 mb-4">
              {modalData._id ? "Edit Gallery Photo" : "Add Gallery Photo"}
            </h3>
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

              {/* Category Selector & Custom Category Creation */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-gray-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-rose-500" />
                    <span>Category</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNewCategory(!isCreatingNewCategory);
                      setNewGalleryCategoryInput("");
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 transition-colors"
                  >
                    {isCreatingNewCategory ? "← Choose Existing" : "+ Create Custom Category"}
                  </button>
                </div>

                {isCreatingNewCategory ? (
                  <div className="space-y-2 p-3 bg-gradient-to-br from-rose-50/70 to-amber-50/50 rounded-2xl border border-rose-200/80">
                    <p className="text-[11px] text-gray-600 font-medium">
                      Enter a custom category name (will show publicly in gallery filter tabs):
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newGalleryCategoryInput}
                        onChange={(e) => setNewGalleryCategoryInput(e.target.value)}
                        placeholder="e.g. Haldi, Sangeet, Mandap..."
                        className="flex-1 px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomGalleryCategory();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomGalleryCategory()}
                        disabled={!newGalleryCategoryInput.trim()}
                        className="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold rounded-xl text-xs hover:opacity-95 disabled:opacity-50 shadow-sm"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick suggestion chips */}
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Quick Suggestions:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Haldi", "Mehndi", "Sangeet", "Mandap", "Pre-Wedding", "Cocktail", "Bidaai", "Varmala"].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleAddCustomGalleryCategory(chip)}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition-colors"
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <select
                      value={modalData.category || "Ceremony"}
                      onChange={(e) => {
                        if (e.target.value === "__create_new__") {
                          setIsCreatingNewCategory(true);
                          setNewGalleryCategoryInput("");
                        } else {
                          setModalData({ ...modalData, category: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 font-medium focus:ring-2 focus:ring-rose-400 outline-none"
                    >
                      {allGalleryCategories.map((cat: string) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__create_new__" className="text-rose-600 font-bold">
                        + Add Custom Category...
                      </option>
                    </select>
                    {modalData.category && (
                      <p className="mt-1 text-[11px] text-gray-500 flex items-center gap-1">
                        Active Category: <span className="font-bold text-rose-600">{modalData.category}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {modalData._id ? "Change Photo (Optional)" : "Select Photo (Auto WebP)"}
                </label>
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
                {saveLoading ? "Saving Photo..." : modalData._id ? "Update Photo" : "Add to Gallery"}
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

      {/* 8. Vendor / Contractor Partner Modal */}
      {showModal === "vendor" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowModal(null)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  {modalData._id ? "Edit Partner / Contractor" : "Add New Partner / Contractor"}
                </h3>
                <p className="text-[11px] text-gray-500">
                  Save contractors, multi-skill freelancers, rates & UPI for instant work order dispatch
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-4 text-xs">
              {/* Basic Info: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contractor / Agency Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh DJ & Sounds"
                    value={modalData.name || ""}
                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Primary Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9827012345"
                    value={modalData.phone || ""}
                    onChange={(e) => setModalData({ ...modalData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50 font-mono"
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">WhatsApp Number (for Work Orders)</label>
                <input
                  type="text"
                  placeholder="e.g. 9827012345 (Leave blank if same as phone)"
                  value={modalData.whatsappNumber || ""}
                  onChange={(e) => setModalData({ ...modalData, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50 font-mono"
                />
              </div>

              {/* State & City Selection */}
              <div className="bg-gradient-to-br from-rose-50/50 via-amber-50/30 to-orange-50/30 p-3.5 rounded-2xl border border-rose-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-rose-950 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Vendor Operating Location (State & City)</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Default: Rewa, MP (Customizable)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Step 1: Choose State */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      1. Select State / UT <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={modalData.state || "Madhya Pradesh"}
                      onChange={(e) => {
                        const newState = e.target.value;
                        const availableCities = INDIAN_STATES_AND_CITIES[newState] || [];
                        setModalData({
                          ...modalData,
                          state: newState,
                          city: availableCities[0] || "",
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-white font-medium text-xs text-gray-800"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Choose or Type City */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-gray-700">
                        2. Select or Add City <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-rose-600 font-medium">Type any city name</span>
                    </div>
                    <input
                      type="text"
                      list="vendorCityOptionsList"
                      placeholder="Rewa, Satna, Bhopal or custom..."
                      value={modalData.city || ""}
                      onChange={(e) => setModalData({ ...modalData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-white font-medium text-xs text-gray-900"
                    />
                    <datalist id="vendorCityOptionsList">
                      {(INDIAN_STATES_AND_CITIES[modalData.state || "Madhya Pradesh"] || []).map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Quick City Suggestions for Selected State */}
                {(() => {
                  const stateCities = INDIAN_STATES_AND_CITIES[modalData.state || "Madhya Pradesh"] || [];
                  const quickPills = stateCities.slice(0, 6);
                  if (quickPills.length === 0) return null;
                  return (
                    <div>
                      <span className="text-[10px] text-gray-500 block mb-1">
                        Quick select popular cities in {modalData.state || "Madhya Pradesh"}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickPills.map((c) => {
                          const isSelected = (modalData.city || "").toLowerCase() === c.toLowerCase();
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setModalData({ ...modalData, city: c })}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                                isSelected
                                  ? "bg-rose-500 text-white shadow-2xs"
                                  : "bg-white text-gray-600 border border-gray-200 hover:border-rose-300"
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

              {/* Address */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Office / Shop / Workshop Address</label>
                <input
                  type="text"
                  placeholder="e.g. Near Bus Stand, College Road, Rewa"
                  value={modalData.address || ""}
                  onChange={(e) => setModalData({ ...modalData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                />
              </div>

              {/* Multi-Service Skills Selection */}
              <div className="bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-rose-950">
                    Services & Skills (Select all that apply)
                  </label>
                  <span className="text-[10px] text-rose-600 font-semibold">
                    {(modalData.services || []).length} selected
                  </span>
                </div>

                {/* Available Skills Chips */}
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {allAvailableSkills.map((serviceTag) => {
                    const currentServices: string[] = Array.isArray(modalData.services) ? modalData.services : [];
                    const isSelected = currentServices.includes(serviceTag);
                    const isCustom = !DEFAULT_VENDOR_SKILLS.includes(serviceTag);
                    return (
                      <div
                        key={serviceTag}
                        className={`inline-flex items-center rounded-xl text-xs transition-all ${
                          isSelected
                            ? "bg-rose-600 text-white shadow-xs font-bold"
                            : "bg-white text-gray-700 border border-gray-200 hover:border-rose-300"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setModalData({
                                ...modalData,
                                services: currentServices.filter((s) => s !== serviceTag),
                              });
                            } else {
                              setModalData({
                                ...modalData,
                                services: [...currentServices, serviceTag],
                              });
                            }
                          }}
                          className="px-2.5 py-1 flex items-center gap-1 cursor-pointer"
                        >
                          {isSelected && <span>✓</span>}
                          <span>{serviceTag}</span>
                          {isCustom && (
                            <span
                              className={`text-[9px] px-1 py-0.2 rounded font-normal ${
                                isSelected ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"
                              }`}
                            >
                              Custom
                            </span>
                          )}
                        </button>
                        {isCustom && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCustomSkill(serviceTag);
                            }}
                            title="Remove this custom skill"
                            className={`pr-2 pl-0.5 text-xs hover:opacity-100 cursor-pointer ${
                              isSelected ? "text-white/80 hover:text-white" : "text-gray-400 hover:text-red-500"
                            }`}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Skill Field */}
                <div className="pt-2.5 border-t border-rose-200/60">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="+ Enter custom skill (e.g. Drone Shoot, Mehendi, Anchor)..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomSkill();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSkill}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Skill</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    💡 Tip: Enter any custom skill and press <b>Enter</b> or click <b>Add Skill</b>. It will be added and auto-selected for this partner.
                  </p>
                </div>
              </div>

              {/* Rate Estimate & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Standard Rate Estimate</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹20,000 / event or ₹500 / plate"
                    value={modalData.rateEstimate || ""}
                    onChange={(e) => setModalData({ ...modalData, rateEstimate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Vendor Rating (1 to 5 Stars)</label>
                  <select
                    value={modalData.rating || 5}
                    onChange={(e) => setModalData({ ...modalData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50 font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Top Tier)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Highly Reliable)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Moderate)</option>
                    <option value={2}>⭐⭐ (2 Stars - Backup Only)</option>
                    <option value={1}>⭐ (1 Star - Needs Improvement)</option>
                  </select>
                </div>
              </div>

              {/* Experience & Past Events Done */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={modalData.experienceYears !== undefined ? modalData.experienceYears : 3}
                    onChange={(e) => setModalData({ ...modalData, experienceYears: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total Events Completed</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 45"
                    value={modalData.totalEventsDone !== undefined ? modalData.totalEventsDone : 0}
                    onChange={(e) => setModalData({ ...modalData, totalEventsDone: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                  />
                </div>
              </div>

              {/* Payment Details: UPI & Bank */}
              <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 space-y-3">
                <span className="block font-bold text-emerald-950">Payout & Payment Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">UPI ID for Quick Advance</label>
                    <input
                      type="text"
                      placeholder="e.g. 9827012345@paytm"
                      value={modalData.upiId || ""}
                      onChange={(e) => setModalData({ ...modalData, upiId: e.target.value })}
                      className="w-full px-3 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">Bank Account / Branch Details</label>
                    <input
                      type="text"
                      placeholder="e.g. SBI Rewa A/C 3829... IFSC: SBIN000..."
                      value={modalData.bankDetails || ""}
                      onChange={(e) => setModalData({ ...modalData, bankDetails: e.target.value })}
                      className="w-full px-3 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Notes / Reliability */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Equipment Specifics & Reliability Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Has 4 JBL tops, 2 bass, sound engineer. Very punctual. Call 2 days in advance."
                  value={modalData.notes || ""}
                  onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 bg-gray-50"
                />
              </div>

              {/* Active Toggle */}
              <div>
                <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={modalData.isActive !== false}
                    onChange={(e) => setModalData({ ...modalData, isActive: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <span>Active & Available for Event Bookings</span>
                </label>
              </div>

              {/* Action Buttons */}
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
                  disabled={saveLoading}
                  className="px-5 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saveLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalData._id ? "Update Partner" : "Save Partner"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Subcategory Photos & SEO Alt Modal */}
      {showModal === "subcategory" && editingSubcategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setShowModal(null);
                setEditingSubcategory(null);
              }}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-4 pr-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  {editingSubcategory.category}
                </span>
                <span className="text-[11px] text-gray-400 font-mono">/{editingSubcategory.slug}</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-gray-900">
                Edit Photos & SEO: {editingSubcategory.menuTitle}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{editingSubcategory.title}</p>
            </div>

            {/* Aspect Ratio Reminder in Modal */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl mb-4 text-xs space-y-1">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Recommended Aspect Ratios for Best Visual Display:</span>
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 pt-0.5">
                <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                  <strong>📸 Main Hero:</strong> 16:9 / 4:3 (1200 x 800 px)
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                  <strong>🖼️ Showcase Photos:</strong> 4:3 Landscape (800 x 600 px)
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveSubcategory} className="space-y-5 text-xs">
              {/* SECTION 1: MAIN HERO BANNER */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-rose-600" />
                    <span>Main Hero Banner Image</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {editingSubcategory.mainImage?.url && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSubcategory({
                            ...editingSubcategory,
                            mainImage: { url: "", public_id: "", alt: "" },
                          });
                        }}
                        className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold hover:underline"
                        title="Delete main hero photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                      16:9 / 4:3 Ratio
                    </span>
                  </div>
                </div>

                {/* Main Hero Preview */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                  {editingSubcategory.mainImage?.url ? (
                    <Image
                      src={editingSubcategory.mainImage.url}
                      alt={editingSubcategory.mainImage?.alt || "Hero preview"}
                      fill
                      className="object-cover"
                      sizes="600px"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1 p-4 text-center">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <p className="text-xs font-semibold">No Main Photo Selected</p>
                      <p className="text-[10px]">Drag & drop an image below to set the main hero photo</p>
                    </div>
                  )}
                </div>

                {/* Drag & Drop Upload for Main Hero */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                    <span>Upload New Main Photo (Drag & Drop or Browse)</span>
                    <span className="text-[10px] text-rose-600 font-semibold">Auto WebP & Cloudinary</span>
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsHeroDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsHeroDragging(false);
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setIsHeroDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        const res = await handleFileUpload(file);
                        if (res) {
                          setEditingSubcategory({
                            ...editingSubcategory,
                            mainImage: {
                              ...editingSubcategory.mainImage,
                              url: res.url,
                              public_id: res.public_id,
                              alt: editingSubcategory.mainImage?.alt || `${editingSubcategory.menuTitle} - RIWAJ Events`,
                            },
                          });
                        }
                      }
                    }}
                    className={`relative rounded-2xl border-2 border-dashed p-4 text-center transition-all cursor-pointer ${
                      isHeroDragging
                        ? "border-rose-500 bg-rose-50/80 scale-[1.01]"
                        : "border-gray-300 hover:border-rose-400 bg-white"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const res = await handleFileUpload(file);
                          if (res) {
                            setEditingSubcategory({
                              ...editingSubcategory,
                              mainImage: {
                                ...editingSubcategory.mainImage,
                                url: res.url,
                                public_id: res.public_id,
                                alt: editingSubcategory.mainImage?.alt || `${editingSubcategory.menuTitle} - RIWAJ Events`,
                              },
                            });
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-xs text-gray-800">
                        Drag & drop main photo here, or <span className="text-rose-600 underline">browse</span>
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Drop image from your desktop • Automatically converted to WebP
                      </p>
                    </div>
                  </div>
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-rose-600 mt-2 font-semibold text-xs">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Optimizing with WebP & uploading to Cloudinary...</span>
                    </div>
                  )}
                </div>

                {/* Direct URL input for Main Hero */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Or Direct Image URL</label>
                  <input
                    type="url"
                    value={editingSubcategory.mainImage?.url || ""}
                    onChange={(e) =>
                      setEditingSubcategory({
                        ...editingSubcategory,
                        mainImage: {
                          ...editingSubcategory.mainImage,
                          url: e.target.value,
                        },
                      })
                    }
                    placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                  />
                </div>

                {/* Alt Text for Main Hero */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Main Hero Alt Text (Crucial for Google SEO)</span>
                    <span className="text-[10px] text-gray-400 font-normal">Rank on Google Image Search</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSubcategory.mainImage?.alt || ""}
                    onChange={(e) =>
                      setEditingSubcategory({
                        ...editingSubcategory,
                        mainImage: {
                          ...editingSubcategory.mainImage,
                          alt: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Grand Wedding Catering Royal Buffet Setup in Rewa - RIWAJ Events"
                    className="w-full px-3 py-2 border border-rose-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-rose-400 outline-none"
                  />
                </div>
              </div>

              {/* SECTION 2: OTHER RELEVANT SHOWCASE PHOTOS */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Other Relevant Showcase Photos (Real Event Setups)</span>
                    </label>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Displays in 3-column grid under &quot;Hamare Recent Setups&quot; on the public subcategory page.
                    </p>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold shrink-0">
                    4:3 Ratio
                  </span>
                </div>

                {/* List of Existing Relevant Images */}
                <div className="space-y-3">
                  {(editingSubcategory.relevantImages || []).map((rel: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-2xs"
                    >
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                        <Image src={rel.url} alt={rel.alt || `Photo ${idx + 1}`} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1 w-full space-y-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Photo #{idx + 1} SEO Alt Text:
                        </label>
                        <input
                          type="text"
                          value={rel.alt || ""}
                          onChange={(e) => {
                            const updated = [...(editingSubcategory.relevantImages || [])];
                            updated[idx] = { ...updated[idx], alt: e.target.value };
                            setEditingSubcategory({ ...editingSubcategory, relevantImages: updated });
                          }}
                          placeholder={`e.g. ${editingSubcategory.menuTitle} Real Event Setup ${idx + 1} - RIWAJ`}
                          className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingSubcategory.relevantImages || []).filter((_: any, i: number) => i !== idx);
                          setEditingSubcategory({ ...editingSubcategory, relevantImages: updated });
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-center"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {(!editingSubcategory.relevantImages || editingSubcategory.relevantImages.length === 0) && (
                    <p className="text-center py-4 text-gray-400 text-xs italic">
                      No relevant showcase photos added yet. Add photos below.
                    </p>
                  )}
                </div>

                {/* Drag & Drop Multi-Photo Upload Dropzone for Showcase */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsRelevantDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsRelevantDragging(false);
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setIsRelevantDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      await handleMultiRelevantUpload(e.dataTransfer.files);
                    }
                  }}
                  className={`relative rounded-2xl border-2 border-dashed p-4 text-center transition-all cursor-pointer ${
                    isRelevantDragging
                      ? "border-amber-500 bg-amber-50/80 scale-[1.01]"
                      : "border-amber-300 hover:border-amber-500 bg-amber-50/30"
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        await handleMultiRelevantUpload(e.target.files);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xs text-gray-800">
                      Drag & drop multiple setup photos here, or <span className="text-amber-700 underline">browse</span>
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Drop 1 or multiple photos • Auto WebP compression & Cloudinary upload with SEO alt tags
                    </p>
                  </div>
                </div>

                {multiUploadLoading && (
                  <div className="flex items-center justify-center gap-2 text-amber-700 bg-amber-50 py-2.5 px-4 rounded-xl border border-amber-200 font-semibold text-xs animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{multiUploadProgress || "Uploading showcase photos..."}</span>
                  </div>
                )}

                {/* Add New Relevant Image Form (Single URL / Alt option) */}
                <div className="p-3 bg-white rounded-xl border border-dashed border-rose-200 space-y-2">
                  <p className="font-bold text-gray-700 text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-rose-600" />
                    <span>Or Add Photo by Direct URL / Single Upload</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const res = await handleFileUpload(file);
                            if (res) {
                              setNewRelevantImgInput((prev) => ({
                                ...prev,
                                url: res.url,
                                public_id: res.public_id,
                                alt: prev.alt || `${editingSubcategory.menuTitle} Setup Photo ${(editingSubcategory.relevantImages || []).length + 1} - RIWAJ Events`,
                              }));
                            }
                          }
                        }}
                        className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        value={newRelevantImgInput.url}
                        onChange={(e) => setNewRelevantImgInput({ ...newRelevantImgInput, url: e.target.value })}
                        placeholder="Or paste image URL directly"
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newRelevantImgInput.alt}
                      onChange={(e) => setNewRelevantImgInput({ ...newRelevantImgInput, alt: e.target.value })}
                      placeholder={`Alt Text: e.g. ${editingSubcategory.menuTitle} Setup Photo ${(editingSubcategory.relevantImages || []).length + 1} - RIWAJ Events`}
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={!newRelevantImgInput.url.trim()}
                    onClick={() => {
                      if (!newRelevantImgInput.url.trim()) return;
                      const updated = [
                        ...(editingSubcategory.relevantImages || []),
                        {
                          url: newRelevantImgInput.url.trim(),
                          public_id: newRelevantImgInput.public_id || "",
                          alt: newRelevantImgInput.alt.trim() || `${editingSubcategory.menuTitle} Real Event Setup - RIWAJ`,
                        },
                      ];
                      setEditingSubcategory({ ...editingSubcategory, relevantImages: updated });
                      setNewRelevantImgInput({ url: "", alt: "", public_id: "" });
                    }}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg transition-colors disabled:opacity-40"
                  >
                    + Add to Showcase List
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(null);
                    setEditingSubcategory(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading || uploadingImage || multiUploadLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold shadow-md hover:opacity-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saveLoading ? "Saving Changes..." : "Save & Sync to Live Website"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
