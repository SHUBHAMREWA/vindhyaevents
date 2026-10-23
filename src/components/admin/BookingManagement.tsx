"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Search,
  Plus,
  Phone,
  Clock,
  MapPin,
  Sparkles,
  CreditCard,
  Trash2,
  Edit3,
  X,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  DollarSign,
  AlertCircle,
  Truck,
  User,
  Layers,
  ChevronDown,
  ChevronUp,
  Eye,
  Table,
  LayoutGrid,
  Loader2,
  Wallet,
  Receipt,
  Users,
  CheckCircle2,
  TrendingUp,
  FileText,
  Send,
  PlusCircle,
  Briefcase,
  ListTodo,
  Copy,
  Check,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { CustomerData } from "./CustomerCRM";
import ClockTimePicker12 from "./ClockTimePicker12";

export interface VendorPayoutRecord {
  amount: number;
  paymentDate: string;
  mode: "Cash" | "UPI" | "Bank Transfer" | "Cheque";
  transactionRef?: string;
  note?: string;
}

export interface VendorBookingPayout {
  _id?: string;
  vendorId?: string;
  source: "VendorList" | "Manual";
  name: string;
  phone: string;
  serviceCategory: string;
  subEventName?: string;
  agreedCost: number;
  commissionEarned?: number;
  payoutHistory: VendorPayoutRecord[];
  totalPaid: number;
  balanceDue: number;
  payoutStatus: "Pending" | "Partial" | "Settled";
  reportingTime?: string;
  workScope?: string;
  workStatus?: "Assigned" | "Confirmed" | "Working" | "Completed";
  checklist?: string;
  notes?: string;
}

export interface AssignedPerson {
  source: "VendorList" | "Manual";
  vendorId?: string;
  name: string;
  phone: string;
  roleOrService: string;
  assignedCost?: number;
  commissionEarned?: number;
  reportingTime?: string;
  workScope?: string;
  workStatus?: "Assigned" | "Confirmed" | "Working" | "Completed";
  checklist?: string;
  notes?: string;
  payoutHistory?: VendorPayoutRecord[];
  totalPaidToVendor?: number;
  balanceDueToVendor?: number;
  payoutStatus?: "Pending" | "Partial" | "Settled";
}

export interface SubEvent {
  subEventName: string;
  date: string;
  startTime?: string;
  endTime?: string;
  venueName: string;
  venueAddress: string;
  mapUrl?: string;
  services: string[];
  assignedPersons: AssignedPerson[];
  subEventStatus: "Scheduled" | "Ongoing" | "Completed";
}

export interface PaymentRecord {
  amount: number;
  paymentDate: string;
  mode: "Cash" | "UPI" | "Bank Transfer" | "Cheque";
  transactionRef?: string;
  receiptNote?: string;
}

export interface BookingFinancials {
  totalPackageAmount: number;
  discountAmount: number;
  finalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: "Unpaid" | "Partial" | "Paid";
  paymentHistory: PaymentRecord[];
}

export interface BookingData {
  _id?: string;
  bookingNumber: string;
  customerId: string;
  customerSnapshot: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
  };
  bookingDate: string;
  primaryEventDate: string;
  status: "Draft" | "Confirmed" | "In-Progress" | "Completed" | "Cancelled";
  subEvents: SubEvent[];
  vendorPayouts?: VendorBookingPayout[];
  financials: BookingFinancials;
  specialNotes?: string;
  createdAt?: string;
}

interface BookingManagementProps {
  bookings: BookingData[];
  customers: CustomerData[];
  vendors: any[];
  onRefresh: () => void;
  onOpenWhatsApp: (
    recipients: { phone: string; name: string; customerId?: string; bookingId?: string }[],
    defaultMsg?: string
  ) => void;
}

const COMMON_SUB_EVENTS = [
  "Ring Ceremony / Roka",
  "Haldi Ceremony",
  "Mehndi Ceremony",
  "Sangeet & Dance Night",
  "Wedding Mandap & Phere",
  "Grand Reception Dinner",
  "Cocktail & Bachelor Party",
  "Mata ki Chowki / Bhajan",
  "Corporate Conference / Gala",
];

const COMMON_SERVICES = [
  "Royal Mandap & Stage Decor",
  "Catering & Live Food Counters",
  "DJ & Professional Sound Setup",
  "Cinematography & Drone Shoot",
  "Floral Entryway & Varmala Setup",
  "Ambience & Stage Lighting",
  "Rajasthani Dhol & Welcome Troupe",
  "Safa / Pagdi & Guest Hospitality",
  "Bar & Mocktail Lounge Setup",
  "Fireworks & Cold Pyro Entry",
  "Bridal & Guest Mehendi Artists",
  "Anchor / Emcee & Event Coordination",
  "Pandit Ji & Pooja Samagri",
  "Vintage Car & Doli Setup",
];

// Helper to convert any time string ("10:00 AM", "02:00 PM", "14:00") into 24-hour "HH:mm" for <input type="time">
export function toTime24(timeStr?: string): string {
  if (!timeStr) return "";
  const clean = timeStr.trim().toUpperCase();
  const ampmMatch = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2];
    const modifier = ampmMatch[3];
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }
  if (/^\d{2}:\d{2}$/.test(clean)) {
    return clean;
  }
  return "";
}

// Helper to convert 24-hour "HH:mm" into friendly 12-hour AM/PM format ("10:00 AM", "02:00 PM")
export function toTime12(time24?: string): string {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  if (hStr === undefined || mStr === undefined) return time24;
  let hours = parseInt(hStr, 10);
  const minutes = mStr;
  if (isNaN(hours)) return time24;
  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, "0")}:${minutes} ${modifier}`;
}

// Helper to generate 24-character hexadecimal ObjectId compatible string
export function generateUniqueHexId(): string {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

export default function BookingManagement({
  bookings,
  customers,
  vendors,
  onRefresh,
  onOpenWhatsApp,
}: BookingManagementProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingData | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  // New payment modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeBookingForPayment, setActiveBookingForPayment] = useState<BookingData | null>(null);
  const [newPaymentAmount, setNewPaymentAmount] = useState<number>(0);
  const [newPaymentMode, setNewPaymentMode] = useState<"Cash" | "UPI" | "Bank Transfer" | "Cheque">("UPI");
  const [newPaymentRef, setNewPaymentRef] = useState("");
  const [newPaymentNote, setNewPaymentNote] = useState("");

  // View mode & inline status change states
  const [viewMode, setViewMode] = useState<"table" | "cards">("table"); // Table is default as requested!
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [viewingBookingDetails, setViewingBookingDetails] = useState<BookingData | null>(null);
  const [detailsViewTab, setDetailsViewTab] = useState<
    "overview" | "timeline" | "vendors" | "clientPayments" | "vendorPayments" | "ledger"
  >("overview");
  const [copiedBookingId, setCopiedBookingId] = useState(false);

  // Quick vendor payout modal states for details view
  const [quickVendorPayoutOpen, setQuickVendorPayoutOpen] = useState(false);
  const [targetVendorBooking, setTargetVendorBooking] = useState<BookingData | null>(null);
  const [targetVendorIndex, setTargetVendorIndex] = useState<number | null>(null);
  const [quickVendorAmount, setQuickVendorAmount] = useState("");
  const [quickVendorMode, setQuickVendorMode] = useState<"Cash" | "UPI" | "Bank Transfer" | "Cheque">("UPI");
  const [quickVendorDate, setQuickVendorDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [quickVendorRef, setQuickVendorRef] = useState("");
  const [quickVendorNote, setQuickVendorNote] = useState("");
  const [quickVendorSubmitting, setQuickVendorSubmitting] = useState(false);

  const handleCopyBookingId = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedBookingId(true);
      setTimeout(() => setCopiedBookingId(false), 2000);
    }
  };

  // Accidental click protection confirmation modal states
  const [confirmCancelModalOpen, setConfirmCancelModalOpen] = useState(false);
  const [confirmSaveModalOpen, setConfirmSaveModalOpen] = useState(false);

  // Accidental close protection handler
  const handleRequestCloseBookingModal = () => {
    if (
      editingBooking &&
      (editingBooking.customerId ||
        editingBooking.primaryEventDate ||
        editingBooking._id ||
        (editingBooking.subEvents && editingBooking.subEvents.length > 1))
    ) {
      setConfirmCancelModalOpen(true);
    } else {
      setShowModal(false);
      setEditingBooking(null);
    }
  };

  // Directly change booking status from outside
  const handleInlineStatusChange = async (bookingId: string, newStatus: string) => {
    setStatusUpdatingId(bookingId);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.message || "Failed to update booking status");
      }
    } catch (err: any) {
      alert("Network error updating status: " + (err.message || ""));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Modal Tab navigation (5 Tabs Studio)
  const [modalTab, setModalTab] = useState<"events" | "vendorWork" | "clientPayments" | "vendorPayments" | "review">("events");

  // Vendor Work & Task Allocation states inside modal Tab 2
  const [workAssignSource, setWorkAssignSource] = useState<"VendorList" | "Manual">("Manual");
  const [workAssignVendorId, setWorkAssignVendorId] = useState<string>("");
  const [workAssignName, setWorkAssignName] = useState<string>("");
  const [workAssignPhone, setWorkAssignPhone] = useState<string>("");
  const [workAssignRole, setWorkAssignRole] = useState<string>("");
  const [workAssignSubEventIdx, setWorkAssignSubEventIdx] = useState<number>(0);
  const [workAssignReportingTime, setWorkAssignReportingTime] = useState<string>("");
  const [workAssignScope, setWorkAssignScope] = useState<string>("");
  const [workAssignCost, setWorkAssignCost] = useState<string>("");
  const [workAssignChecklist, setWorkAssignChecklist] = useState<string>("");
  const [workFilterSubEvent, setWorkFilterSubEvent] = useState<string>("all");

  // Client Installment states inside modal Tab 3
  const [tabInstallmentAmount, setTabInstallmentAmount] = useState<string>("");
  const [tabInstallmentDate, setTabInstallmentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [tabInstallmentMode, setTabInstallmentMode] = useState<"Cash" | "UPI" | "Bank Transfer" | "Cheque">("UPI");
  const [tabInstallmentRef, setTabInstallmentRef] = useState<string>("");
  const [tabInstallmentNote, setTabInstallmentNote] = useState<string>("");

  // Vendor Payouts states inside modal Tab 3
  const [newVendorSource, setNewVendorSource] = useState<"VendorList" | "Manual">("Manual");
  const [newVendorId, setNewVendorId] = useState<string>("");
  const [newVendorName, setNewVendorName] = useState<string>("");
  const [newVendorPhone, setNewVendorPhone] = useState<string>("");
  const [newVendorService, setNewVendorService] = useState<string>("");
  const [newVendorSubEvent, setNewVendorSubEvent] = useState<string>("");
  const [newVendorAgreedCost, setNewVendorAgreedCost] = useState<string>("");
  const [newVendorCommission, setNewVendorCommission] = useState<string>("");

  const [activeVendorForPayout, setActiveVendorForPayout] = useState<number | null>(null);
  const [vendorPayoutAmount, setVendorPayoutAmount] = useState<string>("");
  const [vendorPayoutDate, setVendorPayoutDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [vendorPayoutMode, setVendorPayoutMode] = useState<"Cash" | "UPI" | "Bank Transfer" | "Cheque">("UPI");
  const [vendorPayoutRef, setVendorPayoutRef] = useState<string>("");
  const [vendorPayoutNote, setVendorPayoutNote] = useState<string>("");

  // Customer search states for booking modal
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const customerDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close customer search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCustomerDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent mouse wheel from accidentally incrementing/decrementing number inputs
  useEffect(() => {
    const handleWheel = () => {
      if (document.activeElement && (document.activeElement as HTMLInputElement).type === "number") {
        (document.activeElement as HTMLInputElement).blur();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Filtered customers based on search query
  const searchableCustomers = useMemo(() => {
    if (!customerSearchQuery.trim()) return customers;
    const q = customerSearchQuery.toLowerCase().trim();
    return customers.filter((c) => {
      const matchName = c.name?.toLowerCase().includes(q);
      const matchPhone = c.phone?.toLowerCase().includes(q);
      const matchEmail = c.email?.toLowerCase().includes(q);
      const matchCity = c.locations?.some((l) => l.city?.toLowerCase().includes(q));
      return matchName || matchPhone || matchEmail || matchCity;
    });
  }, [customers, customerSearchQuery]);

  // Available years dynamically extracted from bookings
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    const currentYear = new Date().getFullYear();
    yearsSet.add(String(currentYear));
    yearsSet.add(String(currentYear + 1));
    bookings.forEach((b) => {
      if (b.primaryEventDate) {
        const y = new Date(b.primaryEventDate).getFullYear();
        if (!isNaN(y)) yearsSet.add(String(y));
      }
    });
    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, [bookings]);

  const monthsList = [
    { value: "all", label: "All Months" },
    { value: "1", label: "January (01)" },
    { value: "2", label: "February (02)" },
    { value: "3", label: "March (03)" },
    { value: "4", label: "April (04)" },
    { value: "5", label: "May (05)" },
    { value: "6", label: "June (06)" },
    { value: "7", label: "July (07)" },
    { value: "8", label: "August (08)" },
    { value: "9", label: "September (09)" },
    { value: "10", label: "October (10)" },
    { value: "11", label: "November (11)" },
    { value: "12", label: "December (12)" },
  ];

  // Reset infinite scroll count whenever filter criteria change
  useEffect(() => {
    setVisibleCount(20);
  }, [search, statusFilter, monthFilter, yearFilter]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const mNum = b.bookingNumber?.toLowerCase().includes(q);
        const mCust = b.customerSnapshot?.name?.toLowerCase().includes(q);
        const mPhone = b.customerSnapshot?.phone?.toLowerCase().includes(q);
        const mVenue = b.subEvents?.some((s) => s.venueName?.toLowerCase().includes(q));
        const mSub = b.subEvents?.some((s) => s.subEventName?.toLowerCase().includes(q));
        if (!mNum && !mCust && !mPhone && !mVenue && !mSub) return false;
      }
      if (statusFilter !== "all" && b.status !== statusFilter) return false;

      // Month filter (1 - 12)
      if (monthFilter !== "all") {
        if (!b.primaryEventDate) return false;
        const bMonth = (new Date(b.primaryEventDate).getMonth() + 1).toString();
        if (bMonth !== monthFilter) return false;
      }

      // Year filter
      if (yearFilter !== "all") {
        if (!b.primaryEventDate) return false;
        const bYear = new Date(b.primaryEventDate).getFullYear().toString();
        if (bYear !== yearFilter) return false;
      }

      return true;
    });
  }, [bookings, search, statusFilter, monthFilter, yearFilter]);

  // Displayed slice for Infinite Scroller (20 at a time)
  const displayedBookings = useMemo(() => {
    return filteredBookings.slice(0, visibleCount);
  }, [filteredBookings, visibleCount]);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredBookings.length) {
          setVisibleCount((prev) => Math.min(prev + 20, filteredBookings.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredBookings.length]);

  // Overall financial metrics (calculated dynamically from filtered bookings)
  const totalRevenue = useMemo(() => {
    return filteredBookings.reduce((sum, b) => sum + (b.financials?.finalAmount || 0), 0);
  }, [filteredBookings]);

  const totalAdvanceCollected = useMemo(() => {
    return filteredBookings.reduce((sum, b) => sum + (b.financials?.advancePaid || 0), 0);
  }, [filteredBookings]);

  const totalPendingBalance = useMemo(() => {
    return filteredBookings.reduce((sum, b) => sum + (b.financials?.balanceDue || 0), 0);
  }, [filteredBookings]);

  // Add payment installment inside Tab 2
  const handleAddClientInstallment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    const amt = Number(tabInstallmentAmount);
    if (!amt || amt <= 0) {
      alert("Please enter a valid payment amount (greater than 0).");
      return;
    }
    const newRec: PaymentRecord = {
      amount: amt,
      paymentDate: tabInstallmentDate || new Date().toISOString(),
      mode: tabInstallmentMode,
      transactionRef: tabInstallmentRef.trim(),
      receiptNote: tabInstallmentNote.trim() || "Milestone installment payment",
    };
    const updatedHistory = [...(editingBooking.financials?.paymentHistory || []), newRec];
    const newAdvance = updatedHistory.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const finalAmt = Number(editingBooking.financials?.finalAmount) || 0;
    const newBalance = Math.max(0, finalAmt - newAdvance);
    const newPaymentStatus = newAdvance >= finalAmt ? "Paid" : newAdvance > 0 ? "Partial" : "Unpaid";

    setEditingBooking({
      ...editingBooking,
      financials: {
        ...editingBooking.financials,
        advancePaid: newAdvance,
        balanceDue: newBalance,
        paymentStatus: newPaymentStatus,
        paymentHistory: updatedHistory,
      },
    });
    setTabInstallmentAmount("");
    setTabInstallmentRef("");
    setTabInstallmentNote("");
  };

  // Delete payment installment inside Tab 2
  const handleDeleteClientInstallment = (idx: number) => {
    if (!editingBooking) return;
    const updatedHistory = (editingBooking.financials?.paymentHistory || []).filter((_, i) => i !== idx);
    const newAdvance = updatedHistory.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const finalAmt = Number(editingBooking.financials?.finalAmount) || 0;
    const newBalance = Math.max(0, finalAmt - newAdvance);
    const newPaymentStatus = newAdvance >= finalAmt ? "Paid" : newAdvance > 0 ? "Partial" : "Unpaid";

    setEditingBooking({
      ...editingBooking,
      financials: {
        ...editingBooking.financials,
        advancePaid: newAdvance,
        balanceDue: newBalance,
        paymentStatus: newPaymentStatus,
        paymentHistory: updatedHistory,
      },
    });
  };

  // Add vendor to booking inside Tab 3
  const handleAddVendorToBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    if (!newVendorName.trim()) {
      alert("Please enter the vendor / worker name.");
      return;
    }
    const agreed = Number(newVendorAgreedCost) || 0;
    const comm = Number(newVendorCommission) || 0;
    const newV: VendorBookingPayout = {
      _id: generateUniqueHexId(),
      vendorId: newVendorId ? newVendorId : undefined,
      source: newVendorSource,
      name: newVendorName.trim(),
      phone: newVendorPhone.trim(),
      serviceCategory: newVendorService.trim() || "Event Service",
      subEventName: newVendorSubEvent.trim() || "Full Wedding",
      agreedCost: agreed,
      commissionEarned: comm,
      payoutHistory: [],
      totalPaid: 0,
      balanceDue: agreed,
      payoutStatus: "Pending",
    };

    setEditingBooking({
      ...editingBooking,
      vendorPayouts: [...(editingBooking.vendorPayouts || []), newV],
    });

    setNewVendorName("");
    setNewVendorPhone("");
    setNewVendorService("");
    setNewVendorSubEvent("");
    setNewVendorAgreedCost("");
    setNewVendorCommission("");
    setNewVendorId("");
  };

  // Record payout installment to vendor
  const handleRecordPayoutToVendor = (vendorIndex: number) => {
    if (!editingBooking || !editingBooking.vendorPayouts) return;
    const amt = Number(vendorPayoutAmount);
    if (!amt || amt <= 0) {
      alert("Please enter a valid payout amount.");
      return;
    }
    const updatedPayouts = [...editingBooking.vendorPayouts];
    const target = updatedPayouts[vendorIndex];
    if (!target) return;

    const newPayoutRec: VendorPayoutRecord = {
      amount: amt,
      paymentDate: vendorPayoutDate || new Date().toISOString(),
      mode: vendorPayoutMode,
      transactionRef: vendorPayoutRef.trim(),
      note: vendorPayoutNote.trim() || "Installment payout to vendor",
    };

    const updatedHistory = [...(target.payoutHistory || []), newPayoutRec];
    const totalPaid = updatedHistory.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const balanceDue = Math.max(0, target.agreedCost - totalPaid);
    const payoutStatus = totalPaid >= target.agreedCost ? "Settled" : totalPaid > 0 ? "Partial" : "Pending";

    updatedPayouts[vendorIndex] = {
      ...target,
      payoutHistory: updatedHistory,
      totalPaid,
      balanceDue,
      payoutStatus,
    };

    setEditingBooking({
      ...editingBooking,
      vendorPayouts: updatedPayouts,
    });

    setVendorPayoutAmount("");
    setVendorPayoutRef("");
    setVendorPayoutNote("");
    setActiveVendorForPayout(null);
  };

  // Delete vendor payout installment
  const handleDeleteVendorPayoutInstallment = (vIdx: number, pIdx: number) => {
    if (!editingBooking || !editingBooking.vendorPayouts) return;
    const updatedPayouts = [...editingBooking.vendorPayouts];
    const target = updatedPayouts[vIdx];
    if (!target) return;

    const updatedHistory = (target.payoutHistory || []).filter((_, i) => i !== pIdx);
    const totalPaid = updatedHistory.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const balanceDue = Math.max(0, target.agreedCost - totalPaid);
    const payoutStatus = totalPaid >= target.agreedCost ? "Settled" : totalPaid > 0 ? "Partial" : "Pending";

    updatedPayouts[vIdx] = {
      ...target,
      payoutHistory: updatedHistory,
      totalPaid,
      balanceDue,
      payoutStatus,
    };

    setEditingBooking({
      ...editingBooking,
      vendorPayouts: updatedPayouts,
    });
  };

  // Delete vendor from booking
  const handleDeleteVendorFromBooking = (vIdx: number) => {
    if (!editingBooking || !editingBooking.vendorPayouts) return;
    const updatedPayouts = editingBooking.vendorPayouts.filter((_, i) => i !== vIdx);
    setEditingBooking({
      ...editingBooking,
      vendorPayouts: updatedPayouts,
    });
  };

  // Add vendor work assignment to a specific function
  const handleAddVendorWorkAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    if (!workAssignName.trim()) {
      alert("Please provide the vendor or worker name.");
      return;
    }
    if (editingBooking.subEvents.length === 0) {
      alert("Please create at least one function in Tab 1 first.");
      return;
    }

    const subIdx = Math.max(0, Math.min(workAssignSubEventIdx, editingBooking.subEvents.length - 1));
    const targetSubEvent = editingBooking.subEvents[subIdx];
    const cost = Number(workAssignCost) || 0;

    const newPerson: AssignedPerson = {
      source: workAssignSource,
      vendorId: workAssignVendorId || undefined,
      name: workAssignName.trim(),
      phone: workAssignPhone.trim(),
      roleOrService: workAssignRole.trim() || "Event Service",
      assignedCost: cost,
      reportingTime: workAssignReportingTime,
      workScope: workAssignScope.trim(),
      workStatus: "Assigned",
      checklist: workAssignChecklist.trim(),
      payoutHistory: [],
      totalPaidToVendor: 0,
      balanceDueToVendor: cost,
      payoutStatus: "Pending",
    };

    const updatedSubEvents = [...editingBooking.subEvents];
    updatedSubEvents[subIdx].assignedPersons = [
      ...(updatedSubEvents[subIdx].assignedPersons || []),
      newPerson,
    ];

    // Sync into vendorPayouts as well
    const existingPayouts = [...(editingBooking.vendorPayouts || [])];
    const alreadyExists = existingPayouts.some(
      (vp) => vp.name.toLowerCase() === workAssignName.trim().toLowerCase()
    );
    if (!alreadyExists) {
      existingPayouts.push({
        _id: generateUniqueHexId(),
        vendorId: workAssignVendorId ? workAssignVendorId : undefined,
        source: workAssignSource,
        name: workAssignName.trim(),
        phone: workAssignPhone.trim(),
        serviceCategory: workAssignRole.trim() || "Event Service",
        subEventName: targetSubEvent.subEventName,
        agreedCost: cost,
        commissionEarned: 0,
        reportingTime: workAssignReportingTime,
        workScope: workAssignScope.trim(),
        workStatus: "Assigned",
        checklist: workAssignChecklist.trim(),
        payoutHistory: [],
        totalPaid: 0,
        balanceDue: cost,
        payoutStatus: "Pending",
      });
    }

    setEditingBooking({
      ...editingBooking,
      subEvents: updatedSubEvents,
      vendorPayouts: existingPayouts,
    });

    setWorkAssignName("");
    setWorkAssignPhone("");
    setWorkAssignRole("");
    setWorkAssignReportingTime("");
    setWorkAssignScope("");
    setWorkAssignCost("");
    setWorkAssignChecklist("");
    setWorkAssignVendorId("");
  };

  // Update vendor work status
  const handleUpdateVendorWorkStatus = (
    sIdx: number,
    pIdx: number,
    newStatus: "Assigned" | "Confirmed" | "Working" | "Completed"
  ) => {
    if (!editingBooking) return;
    const updatedSubEvents = [...editingBooking.subEvents];
    if (updatedSubEvents[sIdx]?.assignedPersons[pIdx]) {
      updatedSubEvents[sIdx].assignedPersons[pIdx].workStatus = newStatus;
      setEditingBooking({
        ...editingBooking,
        subEvents: updatedSubEvents,
      });
    }
  };

  // Delete vendor work assignment
  const handleDeleteVendorWorkAssignment = (sIdx: number, pIdx: number) => {
    if (!editingBooking) return;
    const updatedSubEvents = [...editingBooking.subEvents];
    if (updatedSubEvents[sIdx]) {
      updatedSubEvents[sIdx].assignedPersons = updatedSubEvents[sIdx].assignedPersons.filter(
        (_, i) => i !== pIdx
      );
      setEditingBooking({
        ...editingBooking,
        subEvents: updatedSubEvents,
      });
    }
  };

  // Send WhatsApp Duty Briefing to Assigned Vendor
  const handleSendVendorWorkOrderWhatsApp = (
    subEvent: SubEvent,
    person: AssignedPerson
  ) => {
    if (!person.phone) {
      alert("Please provide a phone number for this vendor.");
      return;
    }
    const cleanPhone = person.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    const eventDate = subEvent.date
      ? new Date(subEvent.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "As scheduled";

    const msg = `Namaste ${person.name} ji! 🙏\n\n*WORK ALLOCATION & EVENT BRIEFING*\n\n📋 *Event Booking*: ${editingBooking?.bookingNumber || "RIWAJ Event"}\n🎉 *Function*: ${subEvent.subEventName}\n📅 *Event Date*: ${eventDate}\n⏰ *Reporting Time*: ${person.reportingTime || subEvent.startTime || "TBD"}\n📍 *Venue*: ${subEvent.venueName || "Designated Venue"}\n🏢 *Address*: ${subEvent.venueAddress || "Contact planner"}\n${subEvent.mapUrl ? `🗺️ *Location Map*: ${subEvent.mapUrl}\n` : ""}🛠️ *Assigned Role / Service*: ${person.roleOrService}\n📝 *Scope of Work / Instructions*: ${person.workScope || "Standard setup as discussed"}\n${person.checklist ? `📦 *Required Equipment / Checklist*: ${person.checklist}\n` : ""}${person.assignedCost ? `💰 *Agreed Fee*: ₹${person.assignedCost.toLocaleString()}\n` : ""}\nKripya reporting time par venue par pahuchein aur work status update karein.\n\n*RIWAJ Events Team*`;

    onOpenWhatsApp(
      [{ phone: cleanPhone, name: person.name, bookingId: editingBooking?._id }],
      msg
    );
  };

  // Open modal for new booking
  const handleAddNew = () => {
    const year = new Date().getFullYear();
    const code = Math.floor(1000 + Math.random() * 9000);
    const defaultBookingNumber = `RWJ-${year}-${code}`;

    setEditingBooking({
      bookingNumber: defaultBookingNumber,
      customerId: "",
      customerSnapshot: {
        name: "",
        phone: "",
        city: "",
      },
      bookingDate: new Date().toISOString().split("T")[0],
      primaryEventDate: "",
      status: "Confirmed",
      subEvents: [
        {
          subEventName: "Wedding Mandap & Phere",
          date: "",
          startTime: "06:00 PM",
          endTime: "11:30 PM",
          venueName: "",
          venueAddress: "",
          mapUrl: "",
          services: ["Royal Mandap & Stage Decor", "Catering & Live Food Counters"],
          assignedPersons: [],
          subEventStatus: "Scheduled",
        },
      ],
      vendorPayouts: [],
      financials: {
        totalPackageAmount: 0,
        discountAmount: 0,
        finalAmount: 0,
        advancePaid: 0,
        balanceDue: 0,
        paymentStatus: "Unpaid",
        paymentHistory: [],
      },
      specialNotes: "",
    });
    setModalTab("events");
    setCustomerSearchQuery("");
    setIsCustomerDropdownOpen(false);
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = (booking: BookingData) => {
    setCustomerSearchQuery("");
    setIsCustomerDropdownOpen(false);
    setModalTab("events");

    // Gather existing vendor payouts or seed from assigned persons
    const existingPayouts: VendorBookingPayout[] = booking.vendorPayouts ? [...booking.vendorPayouts] : [];
    (booking.subEvents || []).forEach((se) => {
      (se.assignedPersons || []).forEach((ap) => {
        const alreadyExists = existingPayouts.some(
          (vp) => vp.name?.toLowerCase() === ap.name?.toLowerCase()
        );
        if (!alreadyExists && ap.name) {
          const cost = ap.assignedCost || 0;
          existingPayouts.push({
            _id: generateUniqueHexId(),
            vendorId: ap.vendorId ? ap.vendorId : undefined,
            source: ap.source,
            name: ap.name,
            phone: ap.phone,
            serviceCategory: ap.roleOrService || "Event Service",
            subEventName: se.subEventName,
            agreedCost: cost,
            commissionEarned: ap.commissionEarned || 0,
            payoutHistory: ap.payoutHistory || [],
            totalPaid: (ap.payoutHistory || []).reduce((s, p) => s + (p.amount || 0), 0),
            balanceDue: Math.max(0, cost - ((ap.payoutHistory || []).reduce((s, p) => s + (p.amount || 0), 0))),
            payoutStatus: "Pending",
          });
        }
      });
    });

    setEditingBooking({
      ...booking,
      primaryEventDate: booking.primaryEventDate ? booking.primaryEventDate.split("T")[0] : "",
      bookingDate: booking.bookingDate ? booking.bookingDate.split("T")[0] : "",
      subEvents: (booking.subEvents || []).map((s) => ({
        ...s,
        date: s.date ? s.date.split("T")[0] : "",
        services: s.services || [],
        assignedPersons: s.assignedPersons || [],
      })),
      vendorPayouts: existingPayouts,
    });
    setShowModal(true);
  };

  // Delete booking
  const handleDelete = async (id: string, num: string) => {
    if (!confirm(`Are you sure you want to delete Booking ${num}?`)) return;
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.message || "Failed to delete booking");
      }
    } catch {
      alert("Error deleting booking");
    }
  };

  // Save booking with accidental click confirmation
  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    if (!editingBooking.customerId) {
      alert("Please select a customer for this booking.");
      return;
    }
    if (!editingBooking.primaryEventDate) {
      alert("Please set the primary event date.");
      return;
    }

    // Open confirmation dialog before saving
    setConfirmSaveModalOpen(true);
  };

  // Actual Save API execution after user confirms in confirmation window
  const executeSaveBooking = async () => {
    if (!editingBooking) return;
    setSaveLoading(true);
    try {
      const isEdit = Boolean(editingBooking._id);
      const res = await fetch("/api/admin/bookings", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit ? { id: editingBooking._id, ...editingBooking } : editingBooking
        ),
      });
      const data = await res.json();
      setSaveLoading(false);

      if (data.success) {
        setConfirmSaveModalOpen(false);
        setShowModal(false);
        setEditingBooking(null);
        onRefresh();
      } else {
        alert(data.message || "Failed to save booking");
      }
    } catch (err: any) {
      setSaveLoading(false);
      alert(err.message || "Network error");
    }
  };

  // Quick Payment Logger
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBookingForPayment || newPaymentAmount <= 0) return;

    const oldAdvance = Number(activeBookingForPayment.financials?.advancePaid || 0);
    const updatedAdvance = oldAdvance + Number(newPaymentAmount);
    const finalAmt = Number(activeBookingForPayment.financials?.finalAmount || 0);
    const updatedBalance = Math.max(0, finalAmt - updatedAdvance);
    const updatedStatus = updatedAdvance >= finalAmt ? "Paid" : "Partial";

    const newRecord: PaymentRecord = {
      amount: Number(newPaymentAmount),
      paymentDate: new Date().toISOString(),
      mode: newPaymentMode,
      transactionRef: newPaymentRef,
      receiptNote: newPaymentNote || "Milestone payment received",
    };

    const updatedHistory = [
      ...(activeBookingForPayment.financials?.paymentHistory || []),
      newRecord,
    ];

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeBookingForPayment._id,
          financials: {
            ...activeBookingForPayment.financials,
            advancePaid: updatedAdvance,
            balanceDue: updatedBalance,
            paymentStatus: updatedStatus,
            paymentHistory: updatedHistory,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentModalOpen(false);
        setActiveBookingForPayment(null);
        setNewPaymentAmount(0);
        setNewPaymentRef("");
        setNewPaymentNote("");
        if (viewingBookingDetails && viewingBookingDetails._id === activeBookingForPayment._id) {
          setViewingBookingDetails({
            ...viewingBookingDetails,
            financials: {
              ...viewingBookingDetails.financials,
              advancePaid: updatedAdvance,
              balanceDue: updatedBalance,
              paymentStatus: updatedStatus,
              paymentHistory: updatedHistory,
            },
          });
        }
        onRefresh();
      } else {
        alert(data.message || "Failed to log payment");
      }
    } catch {
      alert("Error logging payment");
    }
  };

  // Quick Vendor Payout Logger from Details View
  const handleQuickRecordVendorPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetVendorBooking || targetVendorIndex === null) return;
    const amt = Number(quickVendorAmount);
    if (!amt || amt <= 0) {
      alert("Please enter a valid payout amount (greater than 0).");
      return;
    }
    const updatedPayouts = [...(targetVendorBooking.vendorPayouts || [])];
    const target = updatedPayouts[targetVendorIndex];
    if (!target) return;

    const newPayoutRec: VendorPayoutRecord = {
      amount: amt,
      paymentDate: quickVendorDate || new Date().toISOString(),
      mode: quickVendorMode,
      transactionRef: quickVendorRef.trim(),
      note: quickVendorNote.trim() || "Vendor milestone payout",
    };

    const updatedHistory = [...(target.payoutHistory || []), newPayoutRec];
    const totalPaid = updatedHistory.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const balanceDue = Math.max(0, (target.agreedCost || 0) - totalPaid);
    const payoutStatus =
      totalPaid >= (target.agreedCost || 0) ? "Settled" : totalPaid > 0 ? "Partial" : "Pending";

    updatedPayouts[targetVendorIndex] = {
      ...target,
      payoutHistory: updatedHistory,
      totalPaid,
      balanceDue,
      payoutStatus,
    };

    try {
      setQuickVendorSubmitting(true);
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetVendorBooking._id,
          vendorPayouts: updatedPayouts,
        }),
      });
      const data = await res.json();
      setQuickVendorSubmitting(false);
      if (data.success) {
        setQuickVendorPayoutOpen(false);
        setQuickVendorAmount("");
        setQuickVendorRef("");
        setQuickVendorNote("");
        if (viewingBookingDetails && viewingBookingDetails._id === targetVendorBooking._id) {
          setViewingBookingDetails({
            ...viewingBookingDetails,
            vendorPayouts: updatedPayouts,
          });
        }
        onRefresh();
      } else {
        alert(data.message || "Failed to record vendor payout");
      }
    } catch (err: any) {
      setQuickVendorSubmitting(false);
      alert(err.message || "Network error recording vendor payout");
    }
  };

  // Send WhatsApp Booking Confirmation / Invoice
  const handleSendBookingWhatsApp = (booking: BookingData) => {
    const custPhone = booking.customerSnapshot.phone;
    const custName = booking.customerSnapshot.name;
    const eventDate = new Date(booking.primaryEventDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const msg = `Namaste ${custName} ji! 🙏\n\nRIWAJ Events me aapka grand event booking confirm ho gaya hai.\n\n📋 *Booking Details:*\n• *Booking No:* ${booking.bookingNumber}\n• *Main Event Date:* ${eventDate}\n• *Total Package:* ₹${(booking.financials?.finalAmount || 0).toLocaleString()}\n• *Advance Paid:* ₹${(booking.financials?.advancePaid || 0).toLocaleString()}\n• *Balance Due:* ₹${(booking.financials?.balanceDue || 0).toLocaleString()}\n\nHumari expert team aapke royal execution ke liye tayyar hai. Kisi bhi update ke liye humein call karein.\n\n*RIWAJ Events & Weddings*\nContact: 7898522932`;

    onOpenWhatsApp(
      [
        {
          phone: custPhone,
          name: custName,
          customerId: booking.customerId,
          bookingId: booking._id,
        },
      ],
      msg
    );
  };

  // Send Vendor Duty Roster
  const handleSendVendorRoster = (booking: BookingData, subEvent: SubEvent, person: AssignedPerson) => {
    const eventDate = new Date(subEvent.date || booking.primaryEventDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const msg = `Namaste ${person.name} ji! 🛠️\n\nAapko RIWAJ Events ke upcoming setup ke liye assign kiya gaya hai.\n\n📍 *Event Details:*\n• *Client:* ${booking.customerSnapshot.name}\n• *Function:* ${subEvent.subEventName}\n• *Date:* ${eventDate}\n• *Timing:* ${subEvent.startTime || "As scheduled"} - ${subEvent.endTime || "Conclusion"}\n• *Venue:* ${subEvent.venueName || "Designated Venue"}\n• *Address:* ${subEvent.venueAddress || "Contact admin"}\n${subEvent.mapUrl ? `• *Location Map:* ${subEvent.mapUrl}\n` : ""}• *Your Assigned Role:* ${person.roleOrService}\n\nKripya samay par reporting ensure karein.\n\n*RIWAJ Events Team*`;

    onOpenWhatsApp(
      [
        {
          phone: person.phone,
          name: person.name,
          bookingId: booking._id,
        },
      ],
      msg
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              Event Bookings & Multi-Event Engine
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage complete event lifecycle: Haldi, Mehndi, Sangeet, Mandap, assigned vendors & payment milestones.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-md shadow-rose-200 hover:opacity-95 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Event Booking</span>
        </button>
      </div>

      {/* Financial Metrics Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
            Total Package Revenue
          </span>
          <div className="text-xl font-bold text-gray-900 font-mono mt-1">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-gray-400 mt-0.5 block">{bookings.length} Total Bookings</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            Advance Collected
          </span>
          <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
            ₹{totalAdvanceCollected.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 mt-0.5 block">Liquid cash / UPI received</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
            Pending Balance Due
          </span>
          <div className="text-xl font-bold text-amber-700 font-mono mt-1">
            ₹{totalPendingBalance.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-600 mt-0.5 block">To be collected before event day</span>
        </div>
      </div>

      {/* Search, Status & View Toggle Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Booking No, Client Name, Phone, Venue or Sub-event..."
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none"
            />
          </div>

          <div className="w-full sm:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none text-xs font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">✅ Confirmed</option>
              <option value="In-Progress">⏳ In-Progress / Ongoing</option>
              <option value="Draft">📝 Draft Proposal</option>
              <option value="Completed">🏆 Completed</option>
              <option value="Cancelled">❌ Cancelled</option>
            </select>
          </div>

          {/* Month Filter */}
          <div className="w-full sm:w-36">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none text-xs font-medium text-slate-700"
            >
              {monthsList.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="w-full sm:w-28">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none text-xs font-medium text-slate-700"
            >
              <option value="all">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Toggle (Table / Cards) */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-end sm:self-auto shrink-0 border border-gray-200">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
              viewMode === "table"
                ? "bg-white text-rose-700 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
            title="Table View (Columns & Rows)"
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
              viewMode === "cards"
                ? "bg-white text-rose-700 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Card View</span>
          </button>
        </div>
      </div>

      {/* Bookings Table / Cards View */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 whitespace-nowrap">Booking & Date</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Client Details</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Sub-Events & Venue</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Services Required</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Status (Quick Edit)</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Package / Balance</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedBookings.map((b) => {
                  const fin = b.financials || { totalPackageAmount: 0, advancePaid: 0, balanceDue: 0, paymentStatus: "Unpaid" };
                  const primaryDateStr = new Date(b.primaryEventDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const isUpdating = statusUpdatingId === b._id;

                  // Unique services across all subevents
                  const allServices = Array.from(
                    new Set((b.subEvents || []).flatMap((se) => se.services || []))
                  );

                  return (
                    <tr
                      key={b._id}
                      onClick={() => setViewingBookingDetails(b)}
                      className="hover:bg-rose-50/30 transition-colors cursor-pointer group"
                    >
                      {/* Booking & Date */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 text-rose-700 flex flex-col items-center justify-center font-bold text-center shrink-0">
                            <span className="text-[9px] uppercase leading-none text-gray-500 font-semibold">
                              {primaryDateStr.split(" ")[1]}
                            </span>
                            <span className="text-sm font-extrabold text-gray-900 leading-tight">
                              {primaryDateStr.split(" ")[0]}
                            </span>
                          </div>
                          <div>
                            <span className="font-mono font-bold text-gray-800 block text-xs group-hover:text-rose-600 transition-colors">
                              {b.bookingNumber}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {primaryDateStr.split(" ")[2]}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Client Details */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 text-xs">
                          {b.customerSnapshot?.name || "Unnamed"}
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-2.5 h-2.5 text-gray-400" />
                          <span>{b.customerSnapshot?.phone}</span>
                        </div>
                        {b.customerSnapshot?.city && (
                          <span className="text-[10px] text-gray-400 block truncate max-w-[130px]">
                            {b.customerSnapshot.city}
                          </span>
                        )}
                      </td>

                      {/* Sub-Events & Venue */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-gray-800 font-semibold text-[11px]">
                          <Layers className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>{(b.subEvents || []).length} Sub-Events</span>
                        </div>
                        {b.subEvents && b.subEvents.length > 0 && (
                          <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 truncate max-w-[180px]">
                            <MapPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                            <span className="truncate">
                              {b.subEvents[0]?.venueName || b.subEvents[0]?.subEventName || "Venue TBD"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Services */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[190px]">
                          {allServices.slice(0, 2).map((srv, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-medium whitespace-nowrap"
                            >
                              {srv}
                            </span>
                          ))}
                          {allServices.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                              +{allServices.length - 2}
                            </span>
                          )}
                          {allServices.length === 0 && (
                            <span className="text-gray-400 text-[10px] italic">None listed</span>
                          )}
                        </div>
                      </td>

                      {/* Status (Directly Changeable from Outside!) */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          {isUpdating ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-100 text-gray-600 font-bold text-[11px]">
                              <Loader2 className="w-3 h-3 animate-spin text-rose-600" />
                              <span>Saving...</span>
                            </div>
                          ) : (
                            <select
                              value={b.status}
                              onChange={(e) => handleInlineStatusChange(b._id!, e.target.value)}
                              className={`cursor-pointer px-2.5 py-1 rounded-xl font-bold text-[11px] border shadow-2xs outline-none transition-all ${
                                b.status === "Confirmed"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                  : b.status === "In-Progress"
                                  ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                                  : b.status === "Draft"
                                  ? "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100"
                                  : b.status === "Completed"
                                  ? "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100"
                                  : "bg-red-50 text-red-800 border-red-300 hover:bg-red-100"
                              }`}
                              title="Click to change booking status directly"
                            >
                              <option value="Draft">📝 Draft</option>
                              <option value="Confirmed">✅ Confirmed</option>
                              <option value="In-Progress">⏳ In-Progress</option>
                              <option value="Completed">🏆 Completed</option>
                              <option value="Cancelled">❌ Cancelled</option>
                            </select>
                          )}
                        </div>
                      </td>

                      {/* Package / Due */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-gray-900 text-xs">
                          ₹{fin.finalAmount?.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-bold ${
                              fin.balanceDue > 0 ? "text-amber-600 font-mono" : "text-emerald-600"
                            }`}
                          >
                            {fin.balanceDue > 0 ? `Due: ₹${fin.balanceDue.toLocaleString()}` : "Fully Paid"}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              fin.paymentStatus === "Paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : fin.paymentStatus === "Partial"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {fin.paymentStatus}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleSendBookingWhatsApp(b)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Send WhatsApp confirmation & receipt"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveBookingForPayment(b);
                              setNewPaymentAmount(fin.balanceDue > 0 ? fin.balanceDue : 0);
                              setPaymentModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                            title="Record Payment (+Pay)"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setViewingBookingDetails(b)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Full Booking Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(b)}
                            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Booking"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(b._id!, b.bookingNumber)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Infinite Scroll Sentinel & Load More */}
          {filteredBookings.length > 0 && (
            <div className="p-3 bg-slate-50/60 border-t border-gray-100 flex flex-col items-center justify-center">
              <div ref={loadMoreRef} className="h-1 w-full" />
              {visibleCount < filteredBookings.length ? (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 20, filteredBookings.length))}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs inline-flex items-center gap-2 transition-all border border-purple-200/80 cursor-pointer shadow-2xs"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                  <span>Scroll or Click to Load More ({displayedBookings.length} of {filteredBookings.length})</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-semibold tracking-wide">
                  ✓ Showing all {filteredBookings.length} bookings
                </span>
              )}
            </div>
          )}

          {filteredBookings.length === 0 && (
            <div className="py-16 text-center bg-white">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h4 className="font-bold text-gray-800 text-sm">No bookings found</h4>
              <p className="text-xs text-gray-500 mt-1">Create a new booking using the button above.</p>
            </div>
          )}
        </div>
      ) : (
        /* Bookings Cards List */
        <div className="space-y-4">
          {displayedBookings.map((b) => {
            const isExpanded = expandedBookingId === b._id;
            const fin = b.financials || { totalPackageAmount: 0, advancePaid: 0, balanceDue: 0, paymentStatus: "Unpaid" };
            const primaryDateStr = new Date(b.primaryEventDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const isUpdating = statusUpdatingId === b._id;

            return (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden hover:border-gray-300 transition-all"
              >
                {/* Card Header Summary */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 text-rose-700 shrink-0 text-center min-w-[64px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-gray-500">
                        Event
                      </span>
                      <span className="font-bold text-sm text-gray-900 block leading-tight">
                        {primaryDateStr.split(" ")[0]}
                      </span>
                      <span className="text-[11px] font-bold text-rose-600 block">
                        {primaryDateStr.split(" ")[1]}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          {b.bookingNumber}
                        </span>

                        {/* Inline Status Changer in Card Header */}
                        {isUpdating ? (
                          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold text-[10px]">
                            <Loader2 className="w-3 h-3 animate-spin text-rose-600" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <select
                            value={b.status}
                            onChange={(e) => handleInlineStatusChange(b._id!, e.target.value)}
                            className={`cursor-pointer px-2.5 py-0.5 rounded-full text-[10px] font-bold border outline-none ${
                              b.status === "Confirmed"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : b.status === "In-Progress"
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : b.status === "Draft"
                                ? "bg-purple-100 text-purple-800 border-purple-300"
                                : b.status === "Completed"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            }`}
                            title="Click to change booking status directly"
                          >
                            <option value="Draft">📝 Draft</option>
                            <option value="Confirmed">✅ Confirmed</option>
                            <option value="In-Progress">⏳ In-Progress</option>
                            <option value="Completed">🏆 Completed</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        )}

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            fin.paymentStatus === "Paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : fin.paymentStatus === "Partial"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          Payment: {fin.paymentStatus}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <span>{b.customerSnapshot?.name}</span>
                        <span className="text-xs font-normal text-gray-500 font-mono">
                          ({b.customerSnapshot?.phone})
                        </span>
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-rose-500" />
                          <span>{(b.subEvents || []).length} Sub-Events</span>
                        </span>
                        {b.subEvents?.[0]?.venueName && (
                          <span className="flex items-center gap-1 text-gray-700">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{b.subEvents[0].venueName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Financial Overview & Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    <div className="text-right sm:pr-3">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">
                        Total / Due
                      </span>
                      <span className="font-mono text-sm font-bold text-gray-900">
                        ₹{fin.finalAmount?.toLocaleString()}
                      </span>
                      <span className="text-xs text-amber-600 block font-semibold font-mono">
                        Due: ₹{fin.balanceDue?.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSendBookingWhatsApp(b)}
                        className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        title="Send WhatsApp confirmation & receipt"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveBookingForPayment(b);
                          setNewPaymentAmount(fin.balanceDue > 0 ? fin.balanceDue : 0);
                          setPaymentModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>+ Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewingBookingDetails(b)}
                        className="p-2 text-gray-500 hover:text-rose-600 hover:bg-gray-100 rounded-xl"
                        title="View Full Booking Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(b)}
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl"
                        title="Edit Booking"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(b._id!, b.bookingNumber)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedBookingId(isExpanded ? null : b._id!)
                        }
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl"
                        title={isExpanded ? "Collapse" : "View Events & Staff"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Sub-events & Staff Breakdown */}
                {isExpanded && (
                  <div className="bg-gray-50/70 p-4 sm:p-5 border-t border-gray-200 space-y-4 animate-in slide-in-from-top-2 duration-150">
                    <h4 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Sub-Events, Services & Staff Allocation</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {(b.subEvents || []).map((ev, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold text-gray-900 text-sm block">
                                {ev.subEventName}
                              </span>
                              <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 text-rose-500" />
                                <span>
                                  {ev.date ? new Date(ev.date).toLocaleDateString() : primaryDateStr} •{" "}
                                  {ev.startTime || "TBD"} - {ev.endTime || "TBD"}
                                </span>
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              {ev.subEventStatus}
                            </span>
                          </div>

                          {/* Venue */}
                          {(ev.venueName || ev.venueAddress) && (
                            <div className="text-[11px] text-gray-600 flex items-start gap-1">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                              <span>
                                <strong>{ev.venueName}:</strong> {ev.venueAddress}
                              </span>
                              {ev.mapUrl && (
                                <a
                                  href={ev.mapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline shrink-0"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Services */}
                          {ev.services && ev.services.length > 0 && (
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                Services:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {ev.services.map((srv, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-medium"
                                  >
                                    {srv}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Assigned Staff & Vendors */}
                          {ev.assignedPersons && ev.assignedPersons.length > 0 && (
                            <div className="pt-2 border-t border-gray-100 space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                Assigned Staff & Vendors:
                              </span>
                              {ev.assignedPersons.map((p, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="p-2 rounded-xl bg-gray-50 flex items-center justify-between text-[11px]"
                                >
                                  <div>
                                    <span className="font-bold text-gray-800">{p.name}</span>
                                    <span className="text-gray-500 ml-1.5 font-mono">({p.phone})</span>
                                    <span className="text-rose-600 ml-1.5 text-[10px] font-semibold">
                                      • {p.roleOrService}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleSendVendorRoster(b, ev, p)}
                                    className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold hover:bg-emerald-200 flex items-center gap-1"
                                    title="Send WhatsApp roster to vendor"
                                  >
                                    <MessageSquare className="w-2.5 h-2.5" />
                                    <span>Roster</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Payment Milestone Logs */}
                    {fin.paymentHistory && fin.paymentHistory.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-gray-700 block mb-1.5">
                          Payment Transaction History:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                          {fin.paymentHistory.map((rec, rIdx) => (
                            <div
                              key={rIdx}
                              className="p-2.5 bg-white rounded-xl border border-gray-200 flex items-center justify-between"
                            >
                              <div>
                                <span className="font-bold text-emerald-700 font-mono text-xs">
                                  ₹{rec.amount.toLocaleString()}
                                </span>
                                <span className="text-gray-400 ml-1.5 font-medium">({rec.mode})</span>
                                <span className="text-gray-500 text-[10px] block mt-0.5">
                                  {new Date(rec.paymentDate).toLocaleDateString()}
                                </span>
                              </div>
                              {rec.receiptNote && (
                                <span className="text-[10px] text-gray-500 max-w-[120px] truncate">
                                  {rec.receiptNote}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Cards Infinite Scroll Sentinel & Load More */}
          {filteredBookings.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center">
              <div ref={loadMoreRef} className="h-1 w-full" />
              {visibleCount < filteredBookings.length ? (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 20, filteredBookings.length))}
                  className="px-5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs inline-flex items-center gap-2 transition-all border border-purple-200/80 cursor-pointer shadow-2xs"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                  <span>Scroll or Click to Load More ({displayedBookings.length} of {filteredBookings.length})</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-semibold tracking-wide">
                  ✓ Showing all {filteredBookings.length} bookings
                </span>
              )}
            </div>
          )}

          {filteredBookings.length === 0 && (
            <div className="py-16 text-center bg-white rounded-3xl border border-gray-200">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h4 className="font-bold text-gray-800 text-sm">No bookings found</h4>
              <p className="text-xs text-gray-500 mt-1">Create a new booking using the button above.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Add / Edit Booking Modal (5-Tab Studio) ── */}
      {showModal && editingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-50/95 backdrop-blur-xl rounded-3xl max-w-5xl w-full shadow-[0_25px_80px_-15px_rgba(0,0,0,0.4)] border border-slate-200/90 relative max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* ── Top Luxury Header ── */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 pb-4 shrink-0 border-b border-slate-700/60">
              <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-rose-500/10 via-amber-500/10 to-transparent pointer-events-none" />

              {/* Close Button with Accidental Close Protection */}
              <button
                type="button"
                onClick={handleRequestCloseBookingModal}
                className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all z-10 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {/* Booking ID chip */}
                    <button
                      type="button"
                      onClick={() => handleCopyBookingId(editingBooking.bookingNumber)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 font-mono text-[11px] font-bold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Click to copy booking ID"
                    >
                      <span>{editingBooking.bookingNumber}</span>
                      {copiedBookingId ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-60" />
                      )}
                    </button>

                    {/* Booking Status Dropdown */}
                    <select
                      value={editingBooking.status}
                      onChange={(e) =>
                        setEditingBooking({ ...editingBooking, status: e.target.value as any })
                      }
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 border border-white/20 text-white outline-none cursor-pointer hover:bg-white/15"
                    >
                      <option value="Draft" className="text-slate-900">📝 Draft Proposal</option>
                      <option value="Confirmed" className="text-slate-900">✅ Confirmed</option>
                      <option value="In-Progress" className="text-slate-900">⏳ In-Progress</option>
                      <option value="Completed" className="text-slate-900">🏆 Completed</option>
                      <option value="Cancelled" className="text-slate-900">❌ Cancelled</option>
                    </select>

                    {editingBooking.customerSnapshot?.phone && (
                      <span className="text-[11px] text-slate-300 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{editingBooking.customerSnapshot.phone}</span>
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight">
                    {editingBooking._id ? "Edit Event Booking" : "Create New Event Booking"}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {editingBooking.customerSnapshot?.name
                      ? `Client: ${editingBooking.customerSnapshot.name} • ${editingBooking.subEvents.length} Functions Scheduled`
                      : "Configure event dates, venues, vendor duties, client payments & ledger."}
                  </p>
                </div>
              </div>

              {/* ── 5 Tabs Segmented Control Bar ── */}
              <div className="flex items-center gap-1.5 mt-4 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10 max-w-fit overflow-x-auto scrollbar-none text-xs">
                <button
                  type="button"
                  onClick={() => setModalTab("events")}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    modalTab === "events"
                      ? "bg-white text-slate-900 shadow-md font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span>1. Event & Sub-Events</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      modalTab === "events" ? "bg-rose-100 text-rose-800" : "bg-white/10 text-white"
                    }`}
                  >
                    {editingBooking.subEvents.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab("vendorWork")}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    modalTab === "vendorWork"
                      ? "bg-white text-slate-900 shadow-md font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span>2. Vendor Works & Tasks</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      modalTab === "vendorWork"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {(editingBooking.subEvents || []).reduce(
                      (sum, se) => sum + (se.assignedPersons || []).length,
                      0
                    )}{" "}
                    Tasks
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab("clientPayments")}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    modalTab === "clientPayments"
                      ? "bg-white text-slate-900 shadow-md font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <span>3. Client Payments</span>
                  {(editingBooking.financials?.balanceDue || 0) > 0 ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-mono font-extrabold">
                      Due ₹{(editingBooking.financials?.balanceDue || 0).toLocaleString()}
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                      Paid
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab("vendorPayments")}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    modalTab === "vendorPayments"
                      ? "bg-white text-slate-900 shadow-md font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Truck className="w-4 h-4 text-purple-400" />
                  <span>4. Vendor Payments</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      modalTab === "vendorPayments"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {(editingBooking.vendorPayouts || []).length} Vendors
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab("review")}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    modalTab === "review"
                      ? "bg-white text-slate-900 shadow-md font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>5. Review & WhatsApp</span>
                </button>
              </div>
            </div>

            {/* ── Scrollable Tab Body ── */}
            <form onSubmit={handleSaveBooking} className="flex-1 flex flex-col min-h-0 overflow-hidden text-xs">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                {/* ════════════════ TAB 1: EVENTS & SUB-EVENTS ════════════════ */}
              {modalTab === "events" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Card 1: Core Client & Booking Overview */}
                  <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Core Client & Booking Information
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* Searchable Customer Selector */}
                      <div className="relative" ref={customerDropdownRef}>
                        <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-rose-500" />
                            <span>Select Customer</span>
                            <span className="text-red-500">*</span>
                          </span>
                          {editingBooking.customerId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBooking({
                                  ...editingBooking,
                                  customerId: "",
                                  customerSnapshot: { name: "", phone: "" },
                                });
                                setIsCustomerDropdownOpen(true);
                              }}
                              className="text-[10px] text-rose-600 hover:underline font-semibold"
                            >
                              Change
                            </button>
                          )}
                        </label>

                        {/* Selected Client Card or Search Input */}
                        {editingBooking.customerId ? (
                          (() => {
                            const selCust = customers.find((c) => c._id === editingBooking.customerId);
                            return (
                              <div
                                onClick={() => setIsCustomerDropdownOpen((prev) => !prev)}
                                className="w-full p-2.5 bg-white border border-rose-300 rounded-xl flex items-center justify-between gap-2 cursor-pointer hover:border-rose-400 shadow-2xs transition-all"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-full overflow-hidden bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200">
                                    {selCust?.photo?.url ? (
                                      <Image
                                        src={selCust.photo.url}
                                        alt={selCust.name}
                                        width={32}
                                        height={32}
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <span className="text-rose-700 font-bold text-xs">
                                        {(editingBooking.customerSnapshot.name || "C")
                                          .charAt(0)
                                          .toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-gray-900 truncate text-xs">
                                        {editingBooking.customerSnapshot.name}
                                      </span>
                                      {selCust?.customerTier && (
                                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                                          {selCust.customerTier}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-mono truncate">
                                      📞 {editingBooking.customerSnapshot.phone}
                                      {editingBooking.customerSnapshot.city &&
                                        ` • ${editingBooking.customerSnapshot.city}`}
                                    </div>
                                  </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                              </div>
                            );
                          })()
                        ) : (
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                            <input
                              type="text"
                              required={!editingBooking.customerId}
                              value={customerSearchQuery}
                              onFocus={() => setIsCustomerDropdownOpen(true)}
                              onChange={(e) => {
                                setCustomerSearchQuery(e.target.value);
                                setIsCustomerDropdownOpen(true);
                              }}
                              placeholder="Search customer by name or phone..."
                              className="w-full pl-8 pr-7 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none text-xs"
                            />
                            {customerSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setCustomerSearchQuery("")}
                                className="absolute right-2 top-3 text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Customer Search Dropdown */}
                        {isCustomerDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 flex flex-col animate-in fade-in-50 duration-100">
                            {editingBooking.customerId && (
                              <div className="p-2 border-b border-gray-100 bg-gray-50">
                                <div className="relative">
                                  <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-gray-400" />
                                  <input
                                    type="text"
                                    value={customerSearchQuery}
                                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                                    placeholder="Search by name, phone, city..."
                                    className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg bg-white text-xs outline-none focus:ring-1 focus:ring-rose-400"
                                    autoFocus
                                  />
                                </div>
                              </div>
                            )}

                            <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                              {searchableCustomers.length > 0 ? (
                                searchableCustomers.map((c) => {
                                  const isSelected = c._id === editingBooking.customerId;
                                  return (
                                    <button
                                      key={c._id}
                                      type="button"
                                      onClick={() => {
                                        setEditingBooking({
                                          ...editingBooking,
                                          customerId: c._id!,
                                          customerSnapshot: {
                                            name: c.name,
                                            phone: c.phone,
                                            city: c.locations?.[0]?.city || "Rewa",
                                          },
                                        });
                                        setCustomerSearchQuery("");
                                        setIsCustomerDropdownOpen(false);
                                      }}
                                      className={`w-full p-2.5 text-left flex items-center justify-between gap-2 hover:bg-rose-50/60 transition-colors ${
                                        isSelected ? "bg-rose-50 font-bold" : ""
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex items-center justify-center">
                                          {c.photo?.url ? (
                                            <Image
                                              src={c.photo.url}
                                              alt={c.name}
                                              width={28}
                                              height={28}
                                              className="object-cover w-full h-full"
                                            />
                                          ) : (
                                            <span className="font-bold text-gray-600 text-xs">
                                              {c.name.charAt(0).toUpperCase()}
                                            </span>
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-gray-900 font-bold truncate text-xs">
                                              {c.name}
                                            </span>
                                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-gray-100 text-gray-600">
                                              {c.customerTier || "Mid-Level"}
                                            </span>
                                          </div>
                                          <div className="text-[10px] text-gray-500 font-mono">
                                            {c.phone} {c.locations?.[0]?.city && `• ${c.locations[0].city}`}
                                          </div>
                                        </div>
                                      </div>
                                      {isSelected && (
                                        <CheckCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })
                              ) : (
                                <div className="p-4 text-center text-gray-400 text-xs">
                                  No customers found matching &quot;{customerSearchQuery}&quot;
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <input
                          type="text"
                          required
                          value={editingBooking.customerId}
                          onChange={() => {}}
                          className="opacity-0 w-0 h-0 absolute -z-10"
                          tabIndex={-1}
                        />
                      </div>

                      {/* Primary Event Date */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-rose-500" />
                          <span>Primary Wedding / Event Date</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={editingBooking.primaryEventDate}
                          onChange={(e) =>
                            setEditingBooking({ ...editingBooking, primaryEventDate: e.target.value })
                          }
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white font-semibold text-gray-900 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        />
                      </div>

                      {/* Booking Status */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Booking Status</span>
                        </label>
                        <select
                          value={editingBooking.status}
                          onChange={(e) =>
                            setEditingBooking({ ...editingBooking, status: e.target.value as any })
                          }
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white font-bold text-gray-800 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        >
                          <option value="Draft">📝 Draft Proposal</option>
                          <option value="Confirmed">✅ Confirmed</option>
                          <option value="In-Progress">⏳ In-Progress / Ongoing</option>
                          <option value="Completed">🏆 Completed</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Special Notes & Theme */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        <span>Special Notes & Custom Client Requirements (Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={editingBooking.specialNotes || ""}
                        onChange={(e) =>
                          setEditingBooking({ ...editingBooking, specialNotes: e.target.value })
                        }
                        placeholder="VIP preferences, floral color themes, drone permissions, entrance song requests..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 text-xs"
                      />
                    </div>
                  </div>

                  {/* Card 2: Sub-Events (Multi-Event Hierarchy) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-rose-500" />
                          <span>Sub-Events & Functions Hierarchy</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            {editingBooking.subEvents.length} Functions
                          </span>
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Configure Haldi, Mehndi, Sangeet, Mandap & Reception with independent venues, timings & services.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingBooking({
                            ...editingBooking,
                            subEvents: [
                              ...editingBooking.subEvents,
                              {
                                subEventName: "Haldi Ceremony",
                                date: editingBooking.primaryEventDate || "",
                                startTime: "10:00 AM",
                                endTime: "02:00 PM",
                                venueName: "",
                                venueAddress: "",
                                mapUrl: "",
                                services: ["Royal Mandap & Stage Decor"],
                                assignedPersons: [],
                                subEventStatus: "Scheduled",
                              },
                            ],
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Function</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {editingBooking.subEvents.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 relative hover:border-rose-200 transition-all"
                        >
                          {/* Function Card Header */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs">
                                #{sIdx + 1}
                              </span>
                              <span className="font-bold text-slate-900 text-sm">
                                {sub.subEventName || `Function #${sIdx + 1}`}
                              </span>

                              {/* Quick preset chips to quickly set name */}
                              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                                {["Haldi", "Mehndi", "Sangeet", "Mandap & Phere", "Reception"].map((preset) => (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...editingBooking.subEvents];
                                      updated[sIdx].subEventName = `${preset} Ceremony`;
                                      setEditingBooking({ ...editingBooking, subEvents: updated });
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-[10px] font-semibold transition-colors cursor-pointer"
                                  >
                                    {preset}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={sub.subEventStatus}
                                onChange={(e) => {
                                  const updated = [...editingBooking.subEvents];
                                  updated[sIdx].subEventStatus = e.target.value as any;
                                  setEditingBooking({ ...editingBooking, subEvents: updated });
                                }}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200 bg-slate-50 outline-none cursor-pointer"
                              >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                              </select>

                              {editingBooking.subEvents.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = editingBooking.subEvents.filter((_, i) => i !== sIdx);
                                    setEditingBooking({ ...editingBooking, subEvents: updated });
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Remove Function"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Bento Grid: Function Title, Date & Time Range */}
                          <div className="space-y-3.5">
                            {/* Row 1: Function Title & Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Function / Event Title *</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={sub.subEventName}
                                  onChange={(e) => {
                                    const updated = [...editingBooking.subEvents];
                                    updated[sIdx].subEventName = e.target.value;
                                    setEditingBooking({ ...editingBooking, subEvents: updated });
                                  }}
                                  placeholder="e.g. Sangeet & Musical Night / Grand Reception"
                                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-900 bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Function Date *</span>
                                </label>
                                <input
                                  type="date"
                                  required
                                  value={sub.date}
                                  onChange={(e) => {
                                    const updated = [...editingBooking.subEvents];
                                    updated[sIdx].date = e.target.value;
                                    setEditingBooking({ ...editingBooking, subEvents: updated });
                                  }}
                                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white font-semibold text-slate-900 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-xs"
                                />
                              </div>
                            </div>

                            {/* Row 2: Timing Range (12-Hour Clock Pickers with AM/PM) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Function Start Time</span>
                                  </span>
                                  {sub.startTime && (
                                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[10px] font-bold text-slate-800">
                                      {sub.startTime}
                                    </span>
                                  )}
                                </label>
                                <ClockTimePicker12
                                  value={sub.startTime}
                                  onChange={(val12) => {
                                    const updated = [...editingBooking.subEvents];
                                    updated[sIdx].startTime = val12;
                                    setEditingBooking({ ...editingBooking, subEvents: updated });
                                  }}
                                  placeholder="Pick Start Time (12-Hr)"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                                    <span>Function End Time</span>
                                  </span>
                                  {sub.endTime && (
                                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[10px] font-bold text-slate-800">
                                      {sub.endTime}
                                    </span>
                                  )}
                                </label>
                                <ClockTimePicker12
                                  value={sub.endTime}
                                  onChange={(val12) => {
                                    const updated = [...editingBooking.subEvents];
                                    updated[sIdx].endTime = val12;
                                    setEditingBooking({ ...editingBooking, subEvents: updated });
                                  }}
                                  placeholder="Pick End Time (12-Hr)"
                                />
                              </div>
                            </div>

                            {/* Row 3: Venue, Address & Location Map Link */}
                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Venue / Hotel Name</span>
                                </label>
                                <input
                                  type="text"
                                  value={sub.venueName}
                                  onChange={(e) => {
                                    const updated = [...editingBooking.subEvents];
                                    updated[sIdx].venueName = e.target.value;
                                    setEditingBooking({ ...editingBooking, subEvents: updated });
                                  }}
                                  placeholder="e.g. Royal Palace Rewa"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs outline-none focus:border-rose-400"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  Venue Full Address
                                </label>
                                <input
                                  type="text"
                                  value={sub.venueAddress}
                                  onChange={(e) => {
                                    const updated = [...editingBooking.subEvents];
                                    updated[sIdx].venueAddress = e.target.value;
                                    setEditingBooking({ ...editingBooking, subEvents: updated });
                                  }}
                                  placeholder="e.g. Civil Lines, Rewa (M.P.)"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs outline-none focus:border-rose-400"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                                  <span>Google Map URL</span>
                                  {sub.mapUrl && (
                                    <a
                                      href={sub.mapUrl}
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
                                  value={sub.mapUrl || ""}
                                  onChange={(e) => {
                                    const updated = [...editingBooking.subEvents];
                                    updated[sIdx].mapUrl = e.target.value;
                                    setEditingBooking({ ...editingBooking, subEvents: updated });
                                  }}
                                  placeholder="https://maps.app.goo.gl/..."
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono text-[11px] outline-none focus:border-rose-400"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Section: Services Required (Single Clean Unified Interactive Tag Cloud!) */}
                          <div className="space-y-3 pt-2 border-t border-slate-100">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>Required Event Services ({sub.services.length} Selected)</span>
                              </label>

                              {sub.services.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...editingBooking.subEvents];
                                    updated[sIdx].services = [];
                                    setEditingBooking({ ...editingBooking, subEvents: updated });
                                  }}
                                  className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  Clear All
                                </button>
                              )}
                            </div>

                            {/* Unified Services Tag Cloud (No Duplicate Red Buttons!) */}
                            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50/70 rounded-2xl border border-slate-200/70 max-h-48 overflow-y-auto">
                              {/* Combine common services and any custom ones the user already added */}
                              {Array.from(new Set([...COMMON_SERVICES, ...(sub.services || [])])).map((srv) => {
                                const isSelected = sub.services.includes(srv);
                                const isCustom = !COMMON_SERVICES.includes(srv);
                                return (
                                  <button
                                    key={srv}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...editingBooking.subEvents];
                                      if (isSelected) {
                                        updated[sIdx].services = updated[sIdx].services.filter((s) => s !== srv);
                                      } else {
                                        updated[sIdx].services = [...updated[sIdx].services, srv];
                                      }
                                      setEditingBooking({ ...editingBooking, subEvents: updated });
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                      isSelected
                                        ? "bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs ring-1 ring-rose-400/20 hover:bg-rose-100"
                                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/70"
                                    }`}
                                  >
                                    <span className={isSelected ? "text-rose-600 font-bold" : "text-slate-400 font-bold"}>
                                      {isSelected ? "✓" : "+"}
                                    </span>
                                    <span>{srv}</span>
                                    {isCustom && (
                                      <span className="text-[9px] px-1 rounded bg-slate-200/70 text-slate-600 ml-1">
                                        Custom
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Input to Add Any Custom Service */}
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                id={`custom-service-input-${sIdx}`}
                                placeholder="Add custom service (e.g. Vintage Doli Car, Fireworks Entry, Live Tandoor)..."
                                className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 shadow-2xs"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const input = e.currentTarget;
                                    const val = input.value.trim();
                                    if (val && !sub.services.includes(val)) {
                                      const updated = [...editingBooking.subEvents];
                                      updated[sIdx].services = [...updated[sIdx].services, val];
                                      setEditingBooking({ ...editingBooking, subEvents: updated });
                                      input.value = "";
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById(
                                    `custom-service-input-${sIdx}`
                                  ) as HTMLInputElement;
                                  if (input && input.value.trim()) {
                                    const val = input.value.trim();
                                    if (!sub.services.includes(val)) {
                                      const updated = [...editingBooking.subEvents];
                                      updated[sIdx].services = [...updated[sIdx].services, val];
                                      setEditingBooking({ ...editingBooking, subEvents: updated });
                                    }
                                    input.value = "";
                                  }
                                }}
                                className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer shadow-2xs"
                              >
                                + Add Service
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════════ TAB 2: VENDOR WORKS & TASK ALLOCATION ════════════════ */}
              {modalTab === "vendorWork" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Top Task Progress & Metrics Banner */}
                  {(() => {
                    const allTasks: { subEvent: SubEvent; person: AssignedPerson; sIdx: number; pIdx: number }[] = [];
                    (editingBooking.subEvents || []).forEach((se, sIdx) => {
                      (se.assignedPersons || []).forEach((ap, pIdx) => {
                        allTasks.push({ subEvent: se, person: ap, sIdx, pIdx });
                      });
                    });

                    const totalAssigned = allTasks.length;
                    const assignedCount = allTasks.filter(
                      (t) => (t.person.workStatus || "Assigned") === "Assigned"
                    ).length;
                    const confirmedCount = allTasks.filter(
                      (t) => t.person.workStatus === "Confirmed"
                    ).length;
                    const workingCount = allTasks.filter(
                      (t) => t.person.workStatus === "Working"
                    ).length;
                    const completedCount = allTasks.filter(
                      (t) => t.person.workStatus === "Completed"
                    ).length;

                    return (
                      <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 rounded-2xl border border-indigo-100 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                            <span>Vendor Work Allocation & Execution Live Dashboard</span>
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            Total {totalAssigned} Tasks across {editingBooking.subEvents.length} Functions
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block">
                              1. Assigned (Pending)
                            </span>
                            <span className="font-mono font-bold text-lg text-blue-600 block mt-0.5">
                              {assignedCount}
                            </span>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-purple-700 uppercase block">
                              2. Confirmed by Vendor
                            </span>
                            <span className="font-mono font-bold text-lg text-purple-600 block mt-0.5">
                              {confirmedCount}
                            </span>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-amber-700 uppercase block">
                              3. Working / On-Site
                            </span>
                            <span className="font-mono font-bold text-lg text-amber-600 block mt-0.5">
                              {workingCount}
                            </span>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                              4. Work Completed
                            </span>
                            <span className="font-mono font-bold text-lg text-emerald-600 block mt-0.5">
                              {completedCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Form: Assign Work / Duty to a Vendor */}
                  <div className="p-4 sm:p-5 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4 text-indigo-600" />
                        <span>Assign New Duty / Work Scope to Vendor</span>
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Links directly with Sub-Event schedule & WhatsApp briefing
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                      {/* Sub-Event Selection */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Select Event / Function <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={workAssignSubEventIdx}
                          onChange={(e) => setWorkAssignSubEventIdx(Number(e.target.value))}
                          className="w-full px-2.5 py-2 border border-gray-200 rounded-xl bg-white text-xs font-bold text-gray-800 outline-none"
                        >
                          {editingBooking.subEvents.map((se, idx) => (
                            <option key={idx} value={idx}>
                              {idx + 1}. {se.subEventName} ({se.date || "Date TBD"})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Vendor Source Selection */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Vendor Source
                        </label>
                        <select
                          value={workAssignVendorId ? workAssignVendorId : "manual"}
                          onChange={(e) => {
                            if (e.target.value === "manual") {
                              setWorkAssignSource("Manual");
                              setWorkAssignVendorId("");
                            } else {
                              const v = vendors.find((item) => item._id === e.target.value);
                              if (v) {
                                setWorkAssignSource("VendorList");
                                setWorkAssignVendorId(v._id);
                                setWorkAssignName(v.name);
                                setWorkAssignPhone(v.phone);
                                setWorkAssignRole(v.services?.[0] || "");
                              }
                            }
                          }}
                          className="w-full px-2.5 py-2 border border-gray-200 rounded-xl bg-white text-xs outline-none"
                        >
                          <option value="manual">✍️ Manual Vendor / Staff</option>
                          <optgroup label="Select from Registered Vendors">
                            {vendors.map((v) => (
                              <option key={v._id} value={v._id}>
                                {v.name} ({v.city || "Vendor"})
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>

                      {/* Vendor Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Vendor / Worker Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={workAssignName}
                          onChange={(e) => setWorkAssignName(e.target.value)}
                          placeholder="e.g. Ramesh Photo Studio / Amit Decor"
                          className="w-full px-2.5 py-2 border border-gray-200 rounded-xl bg-white text-xs font-bold"
                        />
                      </div>

                      {/* Phone */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Vendor Phone (WhatsApp) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={workAssignPhone}
                          onChange={(e) => setWorkAssignPhone(e.target.value)}
                          placeholder="10-digit phone for briefing"
                          className="w-full px-2.5 py-2 border border-gray-200 rounded-xl bg-white text-xs font-mono"
                        />
                      </div>

                      {/* Role or Service */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Role / Service Category
                        </label>
                        <input
                          type="text"
                          value={workAssignRole}
                          onChange={(e) => setWorkAssignRole(e.target.value)}
                          placeholder="e.g. Traditional Photography / Sound & DJ"
                          className="w-full px-2.5 py-2 border border-gray-200 rounded-xl bg-white text-xs"
                        />
                      </div>

                      {/* Reporting Time with 12-Hour Clock Picker */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-rose-500" />
                          <span>Venue Reporting Time</span>
                        </label>
                        <ClockTimePicker12
                          value={workAssignReportingTime}
                          onChange={(val12) => setWorkAssignReportingTime(val12)}
                          placeholder="Reporting Time (12-Hr)"
                        />
                      </div>

                      {/* Scope of Work */}
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Scope of Work / Duties / Deliverables
                        </label>
                        <input
                          type="text"
                          value={workAssignScope}
                          onChange={(e) => setWorkAssignScope(e.target.value)}
                          placeholder="e.g. Stage lighting setup, 2 cameras coverage, live LED wall stream"
                          className="w-full px-2.5 py-2 border border-gray-200 rounded-xl bg-white text-xs"
                        />
                      </div>

                      {/* Equipment Checklist */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                          <ListTodo className="w-3 h-3 text-indigo-500" />
                          <span>Equipment Checklist / Items to bring</span>
                        </label>
                        <input
                          type="text"
                          value={workAssignChecklist}
                          onChange={(e) => setWorkAssignChecklist(e.target.value)}
                          placeholder="e.g. 2 Drones, Sound Mixer, 4 wireless mics"
                          className="w-full px-2.5 py-2 border border-gray-200 rounded-xl bg-white text-xs"
                        />
                      </div>

                      {/* Agreed Cost */}
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Agreed Fee (₹)
                        </label>
                        <input
                          type="number"
                          value={workAssignCost}
                          onChange={(e) => setWorkAssignCost(e.target.value)}
                          onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                          }}
                          placeholder="e.g. 15000"
                          className="w-full px-2.5 py-2 border border-gray-200 rounded-xl bg-white text-xs font-mono font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddVendorWorkAssignment}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Assign Work to Function</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter by Sub-Event / Function */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Filter:</span>
                      <button
                        type="button"
                        onClick={() => setWorkFilterSubEvent("all")}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                          workFilterSubEvent === "all"
                            ? "bg-indigo-600 text-white shadow-2xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        All Functions (
                        {(editingBooking.subEvents || []).reduce(
                          (sum, se) => sum + (se.assignedPersons || []).length,
                          0
                        )}
                        )
                      </button>
                      {editingBooking.subEvents.map((se, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setWorkFilterSubEvent(se.subEventName)}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                            workFilterSubEvent === se.subEventName
                              ? "bg-indigo-600 text-white shadow-2xs"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {se.subEventName} ({(se.assignedPersons || []).length})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assigned Vendors Work List & Tracking Cards */}
                  <div className="space-y-3">
                    {(() => {
                      const flattenedTasks: {
                        subEvent: SubEvent;
                        person: AssignedPerson;
                        sIdx: number;
                        pIdx: number;
                      }[] = [];
                      editingBooking.subEvents.forEach((se, sIdx) => {
                        (se.assignedPersons || []).forEach((person, pIdx) => {
                          if (
                            workFilterSubEvent === "all" ||
                            se.subEventName === workFilterSubEvent
                          ) {
                            flattenedTasks.push({ subEvent: se, person, sIdx, pIdx });
                          }
                        });
                      });

                      if (flattenedTasks.length === 0) {
                        return (
                          <div className="p-8 text-center bg-gray-50/60 rounded-2xl border border-dashed border-gray-200 text-gray-400 space-y-2">
                            <Briefcase className="w-8 h-8 mx-auto text-gray-300" />
                            <p className="font-semibold text-gray-600 text-sm">
                              Koi vendor work assign nahi hua hai
                            </p>
                            <p className="text-xs text-gray-400">
                              Upar diye gaye form se kisi bhi function ke liye vendor/worker ko kaam aur reporting time assign karein.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {flattenedTasks.map(({ subEvent, person, sIdx, pIdx }) => {
                            const curStatus = person.workStatus || "Assigned";
                            return (
                              <div
                                key={`${sIdx}-${pIdx}`}
                                className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs hover:border-indigo-200 transition-all space-y-3"
                              >
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                                        {subEvent.subEventName}
                                      </span>
                                      {subEvent.date && (
                                        <span className="text-[10px] text-gray-500 font-mono">
                                          {new Date(subEvent.date).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                          })}
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                                      <User className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{person.name}</span>
                                    </h4>
                                    <p className="text-[11px] text-indigo-600 font-medium">
                                      {person.roleOrService || "Event Service"}
                                      {person.phone && (
                                        <span className="text-gray-400 font-mono ml-2">
                                          📞 {person.phone}
                                        </span>
                                      )}
                                    </p>
                                  </div>

                                  {/* Delete Work Assignment */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteVendorWorkAssignment(sIdx, pIdx)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Unassign vendor work"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Work Status Tracker Buttons */}
                                <div className="p-2 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                                    Status:
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {(
                                      [
                                        {
                                          label: "Assigned",
                                          val: "Assigned",
                                          color: "bg-blue-50 text-blue-700 border-blue-200",
                                        },
                                        {
                                          label: "Confirmed",
                                          val: "Confirmed",
                                          color: "bg-purple-50 text-purple-700 border-purple-200",
                                        },
                                        {
                                          label: "Working",
                                          val: "Working",
                                          color: "bg-amber-50 text-amber-700 border-amber-200",
                                        },
                                        {
                                          label: "Completed",
                                          val: "Completed",
                                          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
                                        },
                                      ] as const
                                    ).map((st) => (
                                      <button
                                        key={st.val}
                                        type="button"
                                        onClick={() =>
                                          handleUpdateVendorWorkStatus(sIdx, pIdx, st.val)
                                        }
                                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                                          curStatus === st.val
                                            ? `${st.color} shadow-2xs font-extrabold ring-1 ring-inset ring-black/10`
                                            : "bg-white text-gray-400 border-gray-200 hover:text-gray-700"
                                        }`}
                                      >
                                        {st.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Details & Instructions */}
                                <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50/40 p-2.5 rounded-xl border border-gray-100">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                                      <Clock className="w-3 h-3 text-rose-500" />
                                      <span>
                                        Reporting:{" "}
                                        <strong>
                                          {person.reportingTime ||
                                            subEvent.startTime ||
                                            "Not Set"}
                                        </strong>
                                      </span>
                                    </span>
                                    {person.assignedCost ? (
                                      <span className="font-mono font-bold text-gray-900">
                                        Fee: ₹{person.assignedCost.toLocaleString()}
                                      </span>
                                    ) : null}
                                  </div>

                                  {person.workScope && (
                                    <div className="text-[11px] text-gray-700">
                                      <strong className="text-gray-900">Scope:</strong>{" "}
                                      {person.workScope}
                                    </div>
                                  )}

                                  {person.checklist && (
                                    <div className="text-[11px] text-gray-500 flex items-center gap-1">
                                      <ListTodo className="w-3 h-3 text-indigo-400 shrink-0" />
                                      <span>{person.checklist}</span>
                                    </div>
                                  )}

                                  {subEvent.venueName && (
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                      <span className="truncate">
                                        {subEvent.venueName}{" "}
                                        {subEvent.venueAddress
                                          ? `• ${subEvent.venueAddress}`
                                          : ""}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Action: WhatsApp Work Order Briefing */}
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[10px] font-bold text-gray-400">
                                    Duty Order #{sIdx + 1}.{pIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSendVendorWorkOrderWhatsApp(subEvent, person)
                                    }
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Send WhatsApp Duty Briefing</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* ════════════════ TAB 3: CLIENT PAYMENTS & MILESTONES ════════════════ */}
              {modalTab === "clientPayments" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Top Financial Breakdown Cards */}
                  {(() => {
                    const pkg = Number(editingBooking.financials?.totalPackageAmount) || 0;
                    const disc = Number(editingBooking.financials?.discountAmount) || 0;
                    const finalAmt = Math.max(0, pkg - disc);
                    const adv = Number(editingBooking.financials?.advancePaid) || 0;
                    const due = Math.max(0, finalAmt - adv);
                    const pct = finalAmt > 0 ? Math.min(100, Math.round((adv / finalAmt) * 100)) : 0;

                    return (
                      <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-50/40 via-white to-amber-50/40 rounded-2xl border border-rose-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                            <Wallet className="w-3.5 h-3.5 text-rose-600" />
                            <span>Client Financial Package & Due Balance Tracker</span>
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                              adv >= finalAmt && finalAmt > 0
                                ? "bg-emerald-100 text-emerald-800"
                                : adv > 0
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            Payment Status: {editingBooking.financials?.paymentStatus || "Unpaid"}
                          </span>
                        </div>

                        {/* Financial Inputs & Computed Dues */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">
                              Total Package (₹) *
                            </label>
                            <input
                              type="number"
                              required
                              value={editingBooking.financials?.totalPackageAmount || ""}
                              onChange={(e) => {
                                const newPkg = Number(e.target.value) || 0;
                                const newFinal = Math.max(0, newPkg - disc);
                                const newDue = Math.max(0, newFinal - adv);
                                setEditingBooking({
                                  ...editingBooking,
                                  financials: {
                                    ...editingBooking.financials,
                                    totalPackageAmount: newPkg,
                                    finalAmount: newFinal,
                                    balanceDue: newDue,
                                  },
                                });
                              }}
                              onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                              onKeyDown={(e) => {
                                if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                              }}
                              placeholder="e.g. 400000"
                              className="w-full font-mono font-bold text-sm text-gray-900 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">
                              Discount (₹)
                            </label>
                            <input
                              type="number"
                              value={editingBooking.financials?.discountAmount || ""}
                              onChange={(e) => {
                                const newDisc = Number(e.target.value) || 0;
                                const newFinal = Math.max(0, pkg - newDisc);
                                const newDue = Math.max(0, newFinal - adv);
                                setEditingBooking({
                                  ...editingBooking,
                                  financials: {
                                    ...editingBooking.financials,
                                    discountAmount: newDisc,
                                    finalAmount: newFinal,
                                    balanceDue: newDue,
                                  },
                                });
                              }}
                              onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                              onKeyDown={(e) => {
                                if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                              }}
                              placeholder="0"
                              className="w-full font-mono text-sm text-gray-900 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase">
                              Final Agreed
                            </span>
                            <span className="font-mono font-bold text-sm text-gray-900 block mt-1">
                              ₹{finalAmt.toLocaleString()}
                            </span>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                            <span className="block text-[10px] font-bold text-emerald-600 uppercase">
                              Received So Far
                            </span>
                            <span className="font-mono font-bold text-sm text-emerald-700 block mt-1">
                              ₹{adv.toLocaleString()}
                            </span>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-amber-200 bg-amber-50/50 shadow-2xs">
                            <span className="block text-[10px] font-bold text-amber-700 uppercase">
                              Balance Due
                            </span>
                            <span className="font-mono font-extrabold text-sm text-amber-800 block mt-1">
                              ₹{due.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
                            <span>Payment Collection Progress:</span>
                            <span className="font-mono text-rose-700 font-bold">
                              {pct}% Collected (₹{adv.toLocaleString()} / ₹{finalAmt.toLocaleString()})
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-rose-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Form: Record New Installment */}
                  <div className="p-4 sm:p-5 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4 text-emerald-600" />
                        <span>Record Client Installment Payment</span>
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Log advance, partial installments, or final settlement
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Amount Received (₹) *
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={tabInstallmentAmount}
                          onChange={(e) => setTabInstallmentAmount(e.target.value)}
                          onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                          }}
                          placeholder="e.g. 50000"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white font-mono font-bold text-emerald-700 text-xs outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Payment Date
                        </label>
                        <input
                          type="date"
                          value={tabInstallmentDate}
                          onChange={(e) => setTabInstallmentDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Payment Mode
                        </label>
                        <select
                          value={tabInstallmentMode}
                          onChange={(e) => setTabInstallmentMode(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs font-semibold"
                        >
                          <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                          <option value="Cash">Cash Handover</option>
                          <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Ref / UTR / Cheque No
                        </label>
                        <input
                          type="text"
                          value={tabInstallmentRef}
                          onChange={(e) => setTabInstallmentRef(e.target.value)}
                          placeholder="UTR or Cheque (optional)"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Milestone Note
                        </label>
                        <input
                          type="text"
                          value={tabInstallmentNote}
                          onChange={(e) => setTabInstallmentNote(e.target.value)}
                          placeholder="e.g. Initial Token / 2nd Installment"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddClientInstallment}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-2xs flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Payment Entry</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Installments Ledger Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                    <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                        <Receipt className="w-3.5 h-3.5 text-gray-500" />
                        <span>
                          Installment Payment History Ledger (
                          {(editingBooking.financials?.paymentHistory || []).length} Records)
                        </span>
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50/60 border-b border-gray-200 text-gray-500 uppercase font-bold text-[10px]">
                            <th className="py-2.5 px-4">Date</th>
                            <th className="py-2.5 px-4">Milestone / Note</th>
                            <th className="py-2.5 px-4">Mode</th>
                            <th className="py-2.5 px-4">Ref / UTR</th>
                            <th className="py-2.5 px-4">Amount Received</th>
                            <th className="py-2.5 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(editingBooking.financials?.paymentHistory || []).map((rec, rIdx) => (
                            <tr key={rIdx} className="hover:bg-gray-50/60">
                              <td className="py-2.5 px-4 font-mono">
                                {new Date(rec.paymentDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="py-2.5 px-4 font-medium text-gray-800">
                                {rec.receiptNote || "Milestone installment"}
                              </td>
                              <td className="py-2.5 px-4">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                                  {rec.mode}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 font-mono text-gray-500 text-[10px]">
                                {rec.transactionRef || "—"}
                              </td>
                              <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">
                                ₹{rec.amount.toLocaleString()}
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteClientInstallment(rIdx)}
                                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}

                          {(editingBooking.financials?.paymentHistory || []).length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-gray-400 italic">
                                No installments recorded yet. Fill the form above to add client payments.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════════ TAB 4: VENDOR'S PAYMENTS & COMMISSION ════════════════ */}
              {modalTab === "vendorPayments" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Top Vendor Metrics Overview */}
                  {(() => {
                    const totalVendorCost = (editingBooking.vendorPayouts || []).reduce(
                      (sum, v) => sum + (Number(v.agreedCost) || 0),
                      0
                    );
                    const totalVendorPaid = (editingBooking.vendorPayouts || []).reduce(
                      (sum, v) => sum + (Number(v.totalPaid) || 0),
                      0
                    );
                    const totalVendorDue = Math.max(0, totalVendorCost - totalVendorPaid);
                    const totalCommission = (editingBooking.vendorPayouts || []).reduce(
                      (sum, v) => sum + (Number(v.commissionEarned) || 0),
                      0
                    );
                    const clientFinal = Number(editingBooking.financials?.finalAmount) || 0;
                    const netMargin = Math.max(0, clientFinal - totalVendorCost + totalCommission);

                    return (
                      <div className="p-4 sm:p-5 bg-gradient-to-br from-purple-50/50 via-white to-amber-50/50 rounded-2xl border border-purple-100 space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-purple-600" />
                          <span>Vendor Payouts, Commission & Profit Margin Overview</span>
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block">
                              Total Vendor Cost
                            </span>
                            <span className="font-mono font-bold text-sm text-gray-900 block mt-1">
                              ₹{totalVendorCost.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-gray-400">Total agreed fees to vendors</span>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase block">
                              Total Paid to Vendors
                            </span>
                            <span className="font-mono font-bold text-sm text-emerald-700 block mt-1">
                              ₹{totalVendorPaid.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-emerald-600">Disbursed installments</span>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-amber-200 bg-amber-50/50 shadow-2xs">
                            <span className="text-[10px] font-bold text-amber-700 uppercase block">
                              Vendor Dues Remaining
                            </span>
                            <span className="font-mono font-extrabold text-sm text-amber-800 block mt-1">
                              ₹{totalVendorDue.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-amber-600">Pending to be paid</span>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-purple-200 bg-purple-50/40 shadow-2xs">
                            <span className="text-[10px] font-bold text-purple-700 uppercase block flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-purple-600" />
                              <span>Estimated Profit Margin</span>
                            </span>
                            <span className="font-mono font-extrabold text-sm text-purple-800 block mt-1">
                              ₹{netMargin.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-purple-600">Client final - Vendor cost</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Form: Add New Vendor / Partner to this Booking */}
                  <div className="p-4 sm:p-5 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-3">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4 text-purple-600" />
                      <span>Allocate New Vendor / Service Partner to Booking</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Vendor Source
                        </label>
                        <select
                          value={newVendorId ? newVendorId : "manual"}
                          onChange={(e) => {
                            if (e.target.value === "manual") {
                              setNewVendorSource("Manual");
                              setNewVendorId("");
                            } else {
                              const v = vendors.find((item) => item._id === e.target.value);
                              if (v) {
                                setNewVendorSource("VendorList");
                                setNewVendorId(v._id);
                                setNewVendorName(v.name);
                                setNewVendorPhone(v.phone);
                                setNewVendorService(v.services?.[0] || "Event Vendor");
                              }
                            }
                          }}
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs outline-none"
                        >
                          <option value="manual">✍️ Manual Vendor / Staff</option>
                          <optgroup label="Select from Vendor Directory">
                            {vendors.map((v) => (
                              <option key={v._id} value={v._id}>
                                {v.name} ({v.city || "Vendor"})
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Vendor Name *
                        </label>
                        <input
                          type="text"
                          value={newVendorName}
                          onChange={(e) => setNewVendorName(e.target.value)}
                          placeholder="e.g. Sharma Caterers"
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={newVendorPhone}
                          onChange={(e) => setNewVendorPhone(e.target.value)}
                          placeholder="10-digit mobile"
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Service Category
                        </label>
                        <input
                          type="text"
                          value={newVendorService}
                          onChange={(e) => setNewVendorService(e.target.value)}
                          placeholder="e.g. Catering / DJ"
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Sub-Event / Function
                        </label>
                        <select
                          value={newVendorSubEvent}
                          onChange={(e) => setNewVendorSubEvent(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs"
                        >
                          <option value="Full Wedding">All Functions / Full Wedding</option>
                          {editingBooking.subEvents.map((se, sIdx) => (
                            <option key={sIdx} value={se.subEventName}>
                              {se.subEventName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Agreed Cost to Vendor (₹) *
                        </label>
                        <input
                          type="number"
                          value={newVendorAgreedCost}
                          onChange={(e) => setNewVendorAgreedCost(e.target.value)}
                          onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                          }}
                          placeholder="e.g. 40000"
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-mono font-bold text-purple-700 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          Commission / Margin (₹)
                        </label>
                        <input
                          type="number"
                          value={newVendorCommission}
                          onChange={(e) => setNewVendorCommission(e.target.value)}
                          onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                          }}
                          placeholder="e.g. 5000"
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-mono text-emerald-600 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddVendorToBooking}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-2xs flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Vendor to Roster</span>
                      </button>
                    </div>
                  </div>

                  {/* Vendor Payout Ledger & Installments Management */}
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>Vendor Payout Ledger & Installment Disbursal</span>
                    </h4>

                    {(editingBooking.vendorPayouts || []).map((vp, vIdx) => {
                      const isPayoutModalOpen = activeVendorForPayout === vIdx;

                      return (
                        <div
                          key={vIdx}
                          className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3.5 hover:border-gray-300 transition-all"
                        >
                          {/* Vendor Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold text-gray-900 text-sm">{vp.name}</span>
                                <span className="text-[10px] font-semibold text-gray-500 font-mono">
                                  ({vp.phone || "No phone"})
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    vp.payoutStatus === "Settled"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : vp.payoutStatus === "Partial"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {vp.payoutStatus}
                                </span>
                              </div>
                              <span className="text-[11px] text-gray-500">
                                Service: <strong>{vp.serviceCategory}</strong> • Function:{" "}
                                {vp.subEventName || "Full Wedding"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveVendorForPayout(isPayoutModalOpen ? null : vIdx)
                                }
                                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center gap-1 transition-colors"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>+ Disburse Payout</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteVendorFromBooking(vIdx)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Remove Vendor"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Financial Metric Row for this Vendor */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-gray-50 rounded-xl text-[11px]">
                            <div>
                              <span className="text-gray-500 block text-[10px]">Agreed Fee</span>
                              <span className="font-mono font-bold text-gray-900 text-xs">
                                ₹{(vp.agreedCost || 0).toLocaleString()}
                              </span>
                            </div>

                            <div>
                              <span className="text-gray-500 block text-[10px]">Commission Earned</span>
                              <span className="font-mono font-bold text-emerald-600 text-xs">
                                ₹{(vp.commissionEarned || 0).toLocaleString()}
                              </span>
                            </div>

                            <div>
                              <span className="text-gray-500 block text-[10px]">Paid so far</span>
                              <span className="font-mono font-bold text-emerald-700 text-xs">
                                ₹{(vp.totalPaid || 0).toLocaleString()}
                              </span>
                            </div>

                            <div>
                              <span className="text-gray-500 block text-[10px]">Remaining Due</span>
                              <span
                                className={`font-mono font-bold text-xs ${
                                  (vp.balanceDue || 0) > 0 ? "text-amber-700" : "text-emerald-700"
                                }`}
                              >
                                ₹{(vp.balanceDue || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Inline Form: Record Payout to this specific Vendor */}
                          {isPayoutModalOpen && (
                            <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2.5 animate-in slide-in-from-top-1">
                              <span className="font-bold text-purple-900 text-xs block">
                                Disburse Installment Payment to {vp.name}:
                              </span>

                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                                    Payout Amount (₹) *
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    value={vendorPayoutAmount}
                                    onChange={(e) => setVendorPayoutAmount(e.target.value)}
                                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                                    onKeyDown={(e) => {
                                      if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                                    }}
                                    placeholder="e.g. 15000"
                                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white font-mono font-bold text-purple-700 text-xs outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                                    Payout Date
                                  </label>
                                  <input
                                    type="date"
                                    value={vendorPayoutDate}
                                    onChange={(e) => setVendorPayoutDate(e.target.value)}
                                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                                    Mode
                                  </label>
                                  <select
                                    value={vendorPayoutMode}
                                    onChange={(e) => setVendorPayoutMode(e.target.value as any)}
                                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-semibold"
                                  >
                                    <option value="UPI">UPI / NetBanking</option>
                                    <option value="Cash">Cash Handover</option>
                                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                                    <option value="Cheque">Cheque</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                                    Note / Milestone
                                  </label>
                                  <input
                                    type="text"
                                    value={vendorPayoutNote}
                                    onChange={(e) => setVendorPayoutNote(e.target.value)}
                                    placeholder="e.g. Advance 50% on booking"
                                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-xs"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setActiveVendorForPayout(null)}
                                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-bold text-xs"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRecordPayoutToVendor(vIdx)}
                                  className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors"
                                >
                                  Confirm & Save Payout
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Payout Installments History for this Vendor */}
                          {vp.payoutHistory && vp.payoutHistory.length > 0 ? (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                Payout Installments Log:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {vp.payoutHistory.map((prec, pIdx) => (
                                  <div
                                    key={pIdx}
                                    className="p-2 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-[11px]"
                                  >
                                    <div>
                                      <span className="font-mono font-bold text-purple-700">
                                        ₹{prec.amount.toLocaleString()}
                                      </span>
                                      <span className="text-gray-400 ml-1">({prec.mode})</span>
                                      <span className="text-[10px] text-gray-500 block">
                                        {new Date(prec.paymentDate).toLocaleDateString()} • {prec.note}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteVendorPayoutInstallment(vIdx, pIdx)}
                                      className="p-1 text-gray-400 hover:text-red-500"
                                      title="Delete payout installment"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic block">
                              No payouts made to this vendor yet.
                            </span>
                          )}
                        </div>
                      );
                    })}

                    {(editingBooking.vendorPayouts || []).length === 0 && (
                      <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
                        No vendors allocated to this booking yet. Allocate vendors above or inside function tabs.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ════════════════ TAB 5: REVIEW & WHATSAPP ════════════════ */}
              {modalTab === "review" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Complete 360° Booking Review */}
                  <div className="p-5 bg-gradient-to-br from-rose-50/50 via-white to-amber-50/50 rounded-2xl border border-rose-100 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          {editingBooking.bookingNumber}
                        </span>
                        <h3 className="font-serif font-bold text-xl text-gray-900 mt-1">
                          {editingBooking.customerSnapshot?.name || "Client Name"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          📞 {editingBooking.customerSnapshot?.phone} • {editingBooking.customerSnapshot?.city}
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          editingBooking.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {editingBooking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-gray-400 text-[10px] uppercase font-bold block">
                          Client Package
                        </span>
                        <span className="font-mono font-bold text-sm text-gray-900 block mt-0.5">
                          ₹{(editingBooking.financials?.finalAmount || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-emerald-600 text-[10px] uppercase font-bold block">
                          Client Paid
                        </span>
                        <span className="font-mono font-bold text-sm text-emerald-700 block mt-0.5">
                          ₹{(editingBooking.financials?.advancePaid || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-200 bg-amber-50/50">
                        <span className="text-amber-700 text-[10px] uppercase font-bold block">
                          Client Due Balance
                        </span>
                        <span className="font-mono font-extrabold text-sm text-amber-800 block mt-0.5">
                          ₹{(editingBooking.financials?.balanceDue || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-purple-200 bg-purple-50/50">
                        <span className="text-purple-700 text-[10px] uppercase font-bold block">
                          Vendor Dues Remaining
                        </span>
                        <span className="font-mono font-extrabold text-sm text-purple-800 block mt-0.5">
                          ₹{Math.max(
                            0,
                            (editingBooking.vendorPayouts || []).reduce(
                              (s, v) => s + (v.agreedCost || 0),
                              0
                            ) -
                              (editingBooking.vendorPayouts || []).reduce(
                                (s, v) => s + (v.totalPaid || 0),
                                0
                              )
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Quick Trigger Section */}
                  <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>Send WhatsApp Confirmation & Payment Receipt</span>
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Send an official WhatsApp message to the client with their booking confirmation, function dates, package breakdown, and remaining dues.
                    </p>

                    <div className="p-3.5 bg-gray-50 rounded-xl font-mono text-xs text-gray-700 border border-gray-200 whitespace-pre-line">
                      {`Namaste ${editingBooking.customerSnapshot?.name || "Client"}! 🙏\n\nYour event booking #${editingBooking.bookingNumber} is registered with us.\nPrimary Date: ${editingBooking.primaryEventDate || "TBD"}\nFunctions: ${editingBooking.subEvents.map((s) => s.subEventName).join(", ")}\n\nFinal Package: ₹${(editingBooking.financials?.finalAmount || 0).toLocaleString()}\nPaid So Far: ₹${(editingBooking.financials?.advancePaid || 0).toLocaleString()}\nBalance Due: ₹${(editingBooking.financials?.balanceDue || 0).toLocaleString()}\n\nThank you for choosing us!`}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSendBookingWhatsApp(editingBooking)}
                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors shadow-2xs flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Send WhatsApp to Client Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </div>

              {/* ── Sticky Modal Footer ── */}
              <div className="p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-slate-700 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-amber-800">Client Due:</span>
                    <strong className="font-mono text-amber-900 font-extrabold text-xs">
                      ₹{(editingBooking.financials?.balanceDue || 0).toLocaleString()}
                    </strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-slate-700 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-purple-800">Vendor Dues:</span>
                    <strong className="font-mono text-purple-900 font-extrabold text-xs">
                      ₹{Math.max(
                        0,
                        (editingBooking.vendorPayouts || []).reduce(
                          (s, v) => s + (v.agreedCost || 0),
                          0
                        ) -
                          (editingBooking.vendorPayouts || []).reduce(
                            (s, v) => s + (v.totalPaid || 0),
                            0
                          )
                      ).toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRequestCloseBookingModal}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  {modalTab !== "review" ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === "events") setModalTab("vendorWork");
                        else if (modalTab === "vendorWork") setModalTab("clientPayments");
                        else if (modalTab === "clientPayments") setModalTab("vendorPayments");
                        else if (modalTab === "vendorPayments") setModalTab("review");
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {saveLoading ? "Saving..." : "Save Event Booking"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Full Booking Details Modal (Enterprise Luxury Dossier UI) ── */}
      {viewingBookingDetails && (() => {
        const fin = viewingBookingDetails.financials || {
          totalPackageAmount: 0,
          discountAmount: 0,
          finalAmount: 0,
          advancePaid: 0,
          balanceDue: 0,
          paymentStatus: "Unpaid",
          paymentHistory: [],
        };
        const finalPkg = Number(fin.finalAmount || fin.totalPackageAmount || 0);
        const adv = Number(fin.advancePaid || 0);
        const due = Number(fin.balanceDue !== undefined ? fin.balanceDue : Math.max(0, finalPkg - adv));
        const paidPct = finalPkg > 0 ? Math.min(100, Math.round((adv / finalPkg) * 100)) : 0;

        const subEvents = viewingBookingDetails.subEvents || [];
        const allAssignedTasks: { subEvent: SubEvent; person: AssignedPerson; sIdx: number; pIdx: number }[] = [];
        subEvents.forEach((se, sIdx) => {
          (se.assignedPersons || []).forEach((ap, pIdx) => {
            allAssignedTasks.push({ subEvent: se, person: ap, sIdx, pIdx });
          });
        });

        const totalVendorCost = (viewingBookingDetails.vendorPayouts || []).reduce(
          (sum, v) => sum + (Number(v.agreedCost) || 0),
          0
        );
        const totalVendorPaid = (viewingBookingDetails.vendorPayouts || []).reduce(
          (sum, v) => sum + (Number(v.totalPaid) || 0),
          0
        );
        const totalVendorDue = Math.max(0, totalVendorCost - totalVendorPaid);
        const totalCommission = (viewingBookingDetails.vendorPayouts || []).reduce(
          (sum, v) => sum + (Number(v.commissionEarned) || 0),
          0
        );
        const netEstimatedMargin = Math.max(0, finalPkg - totalVendorCost + totalCommission);

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
            <div className="bg-slate-50/95 backdrop-blur-xl rounded-3xl max-w-5xl w-full shadow-[0_25px_80px_-15px_rgba(0,0,0,0.4)] border border-slate-200/90 relative max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-xs">
              
              {/* ── Modal Top Header with Brand & Close ── */}
              <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 pb-5 shrink-0 border-b border-slate-700/60">
                {/* Subtle luxury ambient glow */}
                <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-rose-500/10 via-amber-500/10 to-transparent pointer-events-none" />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setViewingBookingDetails(null)}
                  className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all z-10 cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
                  {/* Client Avatar & Identification */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 text-white font-serif font-bold text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-rose-950/40 ring-2 ring-white/20 shrink-0">
                      {viewingBookingDetails.customerSnapshot?.name
                        ? viewingBookingDetails.customerSnapshot.name.charAt(0).toUpperCase()
                        : "W"}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {/* Booking Number Chip with Copy */}
                        <button
                          type="button"
                          onClick={() => handleCopyBookingId(viewingBookingDetails.bookingNumber)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 font-mono text-[11px] font-bold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Click to copy booking ID"
                        >
                          <span>{viewingBookingDetails.bookingNumber}</span>
                          {copiedBookingId ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-60" />
                          )}
                        </button>

                        {/* Status with live pulsing dot */}
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-2xs ${
                            viewingBookingDetails.status === "Confirmed"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                              : viewingBookingDetails.status === "In-Progress"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                              : viewingBookingDetails.status === "Completed"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                              : viewingBookingDetails.status === "Cancelled"
                              ? "bg-red-500/20 text-red-300 border border-red-400/30"
                              : "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                          }`}
                        >
                          <span className="relative flex h-2 w-2">
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                viewingBookingDetails.status === "Confirmed"
                                  ? "bg-emerald-400"
                                  : "bg-amber-400"
                              }`}
                            />
                            <span
                              className={`relative inline-flex rounded-full h-2 w-2 ${
                                viewingBookingDetails.status === "Confirmed"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                          </span>
                          <span>{viewingBookingDetails.status}</span>
                        </span>

                        {/* Payment Status Pill */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            fin.paymentStatus === "Paid"
                              ? "bg-emerald-500 text-white"
                              : fin.paymentStatus === "Partial"
                              ? "bg-amber-400 text-slate-950 font-extrabold"
                              : "bg-rose-500 text-white"
                          }`}
                        >
                          {fin.paymentStatus === "Paid"
                            ? "✓ Paid in Full"
                            : fin.paymentStatus === "Partial"
                            ? "⏳ Partially Paid"
                            : "⚠️ Unpaid"}
                        </span>
                      </div>

                      <h2 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
                        <span>{viewingBookingDetails.customerSnapshot?.name || "Client Details"}</span>
                      </h2>

                      <div className="flex flex-wrap items-center gap-3 text-slate-300 text-xs mt-1">
                        <a
                          href={`tel:${viewingBookingDetails.customerSnapshot?.phone}`}
                          className="hover:text-amber-300 flex items-center gap-1 font-mono transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{viewingBookingDetails.customerSnapshot?.phone}</span>
                        </a>
                        {viewingBookingDetails.customerSnapshot?.city && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{viewingBookingDetails.customerSnapshot.city}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-rose-300 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-rose-400" />
                          <span>
                            Primary Date:{" "}
                            {new Date(viewingBookingDetails.primaryEventDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Header Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSendBookingWhatsApp(viewingBookingDetails)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Client</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const b = viewingBookingDetails;
                        setViewingBookingDetails(null);
                        handleEdit(b);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* ── Segmented Control Bar (Apple / Stripe Tab Switcher) ── */}
                <div className="flex items-center gap-1.5 mt-5 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10 max-w-fit overflow-x-auto scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setDetailsViewTab("overview")}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      detailsViewTab === "overview"
                        ? "bg-white text-slate-900 shadow-md font-extrabold"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Executive Overview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailsViewTab("timeline")}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      detailsViewTab === "timeline"
                        ? "bg-white text-slate-900 shadow-md font-extrabold"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>Functions & Timeline</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        detailsViewTab === "timeline"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {subEvents.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailsViewTab("vendors")}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      detailsViewTab === "vendors"
                        ? "bg-white text-slate-900 shadow-md font-extrabold"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Vendor Works & Duties</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        detailsViewTab === "vendors"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {allAssignedTasks.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailsViewTab("clientPayments")}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      detailsViewTab === "clientPayments" || detailsViewTab === "ledger"
                        ? "bg-white text-slate-900 shadow-md font-extrabold"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Client Payments</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        detailsViewTab === "clientPayments" || detailsViewTab === "ledger"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {(fin.paymentHistory || []).length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailsViewTab("vendorPayments")}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      detailsViewTab === "vendorPayments"
                        ? "bg-white text-slate-900 shadow-md font-extrabold"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Vendor Payments</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        detailsViewTab === "vendorPayments"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {(viewingBookingDetails.vendorPayouts || []).length}
                    </span>
                  </button>
                </div>
              </div>

              {/* ── Modal Scrollable Body ── */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

                {/* ════════════════ VIEW 1: EXECUTIVE OVERVIEW ════════════════ */}
                {detailsViewTab === "overview" && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Top Bento Financial Overview Card */}
                    <div className="p-5 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-rose-50/30 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Wallet className="w-4 h-4 text-rose-600" />
                          <span>Executive Financial Health & Cash Flow</span>
                        </span>

                        <span className="text-xs font-semibold text-slate-500">
                          {paidPct}% Collected • ₹{due.toLocaleString()} Due
                        </span>
                      </div>

                      {/* 4 Metric Bento Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Total Contract Value
                          </span>
                          <span className="font-mono font-extrabold text-lg sm:text-xl text-slate-900 block">
                            ₹{finalPkg.toLocaleString()}
                          </span>
                          {fin.discountAmount ? (
                            <span className="text-[10px] text-emerald-600 font-semibold block">
                              -₹{fin.discountAmount.toLocaleString()} discount applied
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 block">Standard Package</span>
                          )}
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                            Advance Collected
                          </span>
                          <span className="font-mono font-extrabold text-lg sm:text-xl text-emerald-700 block">
                            ₹{adv.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold block">
                            {(fin.paymentHistory || []).length} installment(s) paid
                          </span>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-amber-200/80 bg-amber-50/30 shadow-2xs space-y-1">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                            Outstanding Balance Due
                          </span>
                          <span className="font-mono font-extrabold text-lg sm:text-xl text-amber-700 block">
                            ₹{due.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {due === 0 ? "Payment complete" : "Collection in progress"}
                          </span>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-purple-200/80 shadow-2xs space-y-1">
                          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                            Net Est. Margin
                          </span>
                          <span className="font-mono font-extrabold text-lg sm:text-xl text-purple-700 block">
                            ₹{netEstimatedMargin.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Vendors: ₹{totalVendorCost.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Visual Cash Collection Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>Collection Progress</span>
                          <span className="font-mono">{paidPct}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              paidPct >= 100
                                ? "bg-emerald-500"
                                : paidPct > 50
                                ? "bg-gradient-to-r from-amber-500 to-emerald-500"
                                : "bg-gradient-to-r from-rose-500 to-amber-500"
                            }`}
                            style={{ width: `${paidPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2-Column Bento Grid: Functions Snapshot & Vendor Roster Snapshot */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Left: Functions & Event Itinerary Snapshot */}
                      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-rose-600" />
                            <span>Event Schedule ({subEvents.length} Functions)</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => setDetailsViewTab("timeline")}
                            className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>Full Timeline</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {subEvents.map((se, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-rose-200 transition-colors space-y-1.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-slate-900 text-xs">
                                    {sIdx + 1}. {se.subEventName}
                                  </h4>
                                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                                    <Clock className="w-3 h-3 text-rose-500" />
                                    <span>
                                      {se.date ? new Date(se.date).toLocaleDateString() : "Date TBD"} •{" "}
                                      {se.startTime || "TBD"} - {se.endTime || "TBD"}
                                    </span>
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  {se.subEventStatus}
                                </span>
                              </div>

                              {se.venueName && (
                                <div className="text-[11px] text-slate-600 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{se.venueName}</span>
                                </div>
                              )}

                              {(se.assignedPersons || []).length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200/50">
                                  {se.assignedPersons.map((ap, pIdx) => (
                                    <span
                                      key={pIdx}
                                      className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-medium"
                                    >
                                      {ap.name} ({ap.roleOrService})
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Vendor Duty Allocation Snapshot */}
                      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                            <span>Vendor Work Roster ({allAssignedTasks.length} Tasks)</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => setDetailsViewTab("vendors")}
                            className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>Manage Works</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {allAssignedTasks.length > 0 ? (
                          <div className="space-y-2.5">
                            {allAssignedTasks.slice(0, 4).map(({ subEvent, person, sIdx, pIdx }) => (
                              <div
                                key={`${sIdx}-${pIdx}`}
                                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <strong className="text-slate-900 text-xs">{person.name}</strong>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                                      {subEvent.subEventName}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500">
                                    {person.roleOrService}
                                    {person.reportingTime ? ` • ⏰ ${person.reportingTime}` : ""}
                                  </p>
                                </div>

                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  person.workStatus === "Completed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : person.workStatus === "Working"
                                    ? "bg-amber-100 text-amber-800"
                                    : person.workStatus === "Confirmed"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                  {person.workStatus || "Assigned"}
                                </span>
                              </div>
                            ))}

                            {allAssignedTasks.length > 4 && (
                              <p className="text-center text-[11px] text-slate-400 font-medium">
                                + {allAssignedTasks.length - 4} more assigned vendors in roster
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="p-6 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            No vendors assigned to this event yet.
                          </div>
                        )}

                        {/* Recent Transactions Box */}
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Recent Client Payments
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveBookingForPayment(viewingBookingDetails);
                                setNewPaymentAmount(due > 0 ? due : 0);
                                setPaymentModalOpen(true);
                              }}
                              className="text-emerald-600 font-bold hover:underline cursor-pointer"
                            >
                              + Record Payment
                            </button>
                          </div>

                          {(fin.paymentHistory || []).length > 0 ? (
                            <div className="space-y-1.5">
                              {(fin.paymentHistory || []).slice(0, 2).map((rec, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between font-mono text-[11px]"
                                >
                                  <div>
                                    <span className="font-bold text-emerald-800">
                                      ₹{rec.amount.toLocaleString()}
                                    </span>
                                    <span className="text-slate-500 ml-1">({rec.mode})</span>
                                  </div>
                                  <span className="text-slate-400 text-[10px]">
                                    {new Date(rec.paymentDate).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic block">
                              No payments recorded yet.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Special Notes & Requirements */}
                    {viewingBookingDetails.specialNotes && (
                      <div className="p-4 bg-amber-50/60 rounded-3xl border border-amber-200/80 text-slate-700 text-xs space-y-1">
                        <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] block">
                          Client Special Notes & Instructions:
                        </span>
                        <p className="whitespace-pre-line text-slate-700 leading-relaxed font-sans">
                          {viewingBookingDetails.specialNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ════════════════ VIEW 2: FUNCTIONS & TIMELINE ════════════════ */}
                {detailsViewTab === "timeline" && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-base text-slate-900">
                          Wedding Functions & Event Schedule
                        </h3>
                        <p className="text-xs text-slate-500">
                          Complete chronological itinerary with venues, addresses, services and vendor staff allocation.
                        </p>
                      </div>
                    </div>

                    {/* Vertical Connected Timeline */}
                    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-rose-200">
                      {subEvents.map((ev, sIdx) => (
                        <div key={sIdx} className="relative">
                          {/* Timeline Step Node */}
                          <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-md ring-4 ring-white">
                            {sIdx + 1}
                          </div>

                          {/* Function Card */}
                          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3.5 hover:border-rose-200 transition-colors">
                            {/* Function Header */}
                            <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-slate-100">
                              <div>
                                <h4 className="font-serif font-bold text-base text-slate-900">
                                  {ev.subEventName}
                                </h4>
                                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs mt-1">
                                  <span className="flex items-center gap-1 font-semibold text-rose-600">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>
                                      {ev.date
                                        ? new Date(ev.date).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                          })
                                        : "Date TBD"}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1 font-mono text-slate-700">
                                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                                    <span>
                                      {ev.startTime || "TBD"} — {ev.endTime || "TBD"}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                {ev.subEventStatus}
                              </span>
                            </div>

                            {/* Venue & Location Details */}
                            {(ev.venueName || ev.venueAddress) && (
                              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3 text-xs">
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="text-slate-900 block font-semibold">
                                      {ev.venueName || "Venue Address"}
                                    </strong>
                                    <span className="text-slate-600 block text-[11px] leading-relaxed">
                                      {ev.venueAddress}
                                    </span>
                                  </div>
                                </div>

                                {ev.mapUrl && (
                                  <a
                                    href={ev.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] shrink-0 flex items-center gap-1.5 transition-colors border border-blue-200"
                                  >
                                    <span>Location Map</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Services Required Tags */}
                            {ev.services && ev.services.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Services Required ({ev.services.length}):
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {ev.services.map((srv, i) => (
                                    <span
                                      key={i}
                                      className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-100"
                                    >
                                      {srv}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Assigned Staff & Vendors for this function */}
                            <div className="pt-2 border-t border-slate-100 space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Assigned Duty Roster ({(ev.assignedPersons || []).length} Staff/Vendors):
                              </span>

                              {(ev.assignedPersons || []).length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {ev.assignedPersons.map((p, pIdx) => (
                                    <div
                                      key={pIdx}
                                      className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5"
                                    >
                                      <div className="flex items-start justify-between gap-1">
                                        <div>
                                          <strong className="text-slate-900 block text-xs">{p.name}</strong>
                                          <p className="text-[11px] text-indigo-600 font-medium">
                                            {p.roleOrService}
                                            {p.phone && <span className="text-slate-400 ml-1.5 font-mono">📞 {p.phone}</span>}
                                          </p>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => handleSendVendorRoster(viewingBookingDetails, ev, p)}
                                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs transition-colors shrink-0"
                                          title="Send WhatsApp Duty Briefing"
                                        >
                                          <MessageSquare className="w-3.5 h-3.5" />
                                        </button>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                        {p.reportingTime && (
                                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200 flex items-center gap-0.5">
                                            ⏰ {p.reportingTime}
                                          </span>
                                        )}
                                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                                          p.workStatus === "Completed"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : p.workStatus === "Working"
                                            ? "bg-amber-100 text-amber-800"
                                            : p.workStatus === "Confirmed"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-blue-100 text-blue-800"
                                        }`}>
                                          {p.workStatus || "Assigned"}
                                        </span>
                                        {p.assignedCost ? (
                                          <span className="font-mono text-slate-700 ml-auto font-bold">
                                            ₹{p.assignedCost.toLocaleString()}
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic block">
                                  No staff or vendors assigned for this function yet.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ════════════════ VIEW 3: VENDOR WORKS & DUTIES ════════════════ */}
                {detailsViewTab === "vendors" && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Header with KPI Metrics */}
                    <div className="p-5 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 rounded-3xl border border-indigo-100 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                            <span>Vendor Work Allocation & Execution Roster</span>
                          </h3>
                          <p className="text-xs text-slate-500">
                            Track duty deliverables, reporting times, on-site execution status, and send WhatsApp briefings.
                          </p>
                        </div>

                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                          Total {allAssignedTasks.length} Assigned Duty Tasks
                        </span>
                      </div>

                      {/* KPI Counters */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Assigned</span>
                          <span className="font-mono font-bold text-lg text-blue-600 block mt-0.5">
                            {allAssignedTasks.filter(t => (t.person.workStatus || "Assigned") === "Assigned").length}
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                          <span className="text-[10px] font-bold text-purple-700 uppercase block">2. Confirmed</span>
                          <span className="font-mono font-bold text-lg text-purple-600 block mt-0.5">
                            {allAssignedTasks.filter(t => t.person.workStatus === "Confirmed").length}
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                          <span className="text-[10px] font-bold text-amber-700 uppercase block">3. Working / On-Site</span>
                          <span className="font-mono font-bold text-lg text-amber-600 block mt-0.5">
                            {allAssignedTasks.filter(t => t.person.workStatus === "Working").length}
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase block">4. Completed</span>
                          <span className="font-mono font-bold text-lg text-emerald-600 block mt-0.5">
                            {allAssignedTasks.filter(t => t.person.workStatus === "Completed").length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Task Cards Grid */}
                    {allAssignedTasks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allAssignedTasks.map(({ subEvent, person, sIdx, pIdx }) => (
                          <div
                            key={`${sIdx}-${pIdx}`}
                            className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs hover:border-indigo-200 transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                                    {subEvent.subEventName}
                                  </span>
                                  {subEvent.date && (
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {new Date(subEvent.date).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm">{person.name}</h4>
                                <p className="text-[11px] text-indigo-600 font-medium">
                                  {person.roleOrService}
                                  {person.phone && (
                                    <span className="text-slate-400 ml-2 font-mono">📞 {person.phone}</span>
                                  )}
                                </p>
                              </div>

                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                person.workStatus === "Completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : person.workStatus === "Working"
                                  ? "bg-amber-100 text-amber-800"
                                  : person.workStatus === "Confirmed"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {person.workStatus || "Assigned"}
                              </span>
                            </div>

                            {/* Duties & Instructions Box */}
                            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Reporting: <strong>{person.reportingTime || subEvent.startTime || "Not Set"}</strong></span>
                                </span>
                                {person.assignedCost ? (
                                  <span className="font-mono font-bold text-slate-900">
                                    Fee: ₹{person.assignedCost.toLocaleString()}
                                  </span>
                                ) : null}
                              </div>

                              {person.workScope && (
                                <p className="text-[11px] text-slate-700 pt-1 border-t border-slate-200/50">
                                  <strong className="text-slate-900">Scope:</strong> {person.workScope}
                                </p>
                              )}

                              {person.checklist && (
                                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <ListTodo className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                  <span>Checklist: {person.checklist}</span>
                                </p>
                              )}

                              {subEvent.venueName && (
                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{subEvent.venueName}</span>
                                </p>
                              )}
                            </div>

                            {/* WhatsApp Duty Briefing trigger */}
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] font-bold text-slate-400">
                                Task #{sIdx + 1}.{pIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleSendVendorRoster(viewingBookingDetails, subEvent, person)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Send WhatsApp Duty Briefing</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                        <Briefcase className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="font-semibold text-slate-700 text-sm">No vendor tasks allocated</p>
                        <p className="text-xs text-slate-400">
                          Edit this booking to assign photographers, decorators, sound DJs, and caterers to functions.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ════════════════ VIEW 4: CLIENT PAYMENTS ════════════════ */}
                {(detailsViewTab === "clientPayments" || detailsViewTab === "ledger") && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Client Milestone Receipts Ledger */}
                    <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <h4 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-emerald-600" />
                            <span>Client Milestone Payment Receipts & Ledger</span>
                          </h4>
                          <p className="text-xs text-slate-500">
                            Itemized record of all advances and installments paid by the client.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveBookingForPayment(viewingBookingDetails);
                            setNewPaymentAmount(due > 0 ? due : 0);
                            setPaymentModalOpen(true);
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Record New Payment</span>
                        </button>
                      </div>

                      {/* Financial Summary Strip */}
                      <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Contract</span>
                          <span className="font-mono font-bold text-sm text-slate-900">₹{finalPkg.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-emerald-700 block text-[10px] uppercase font-bold">Advance Collected</span>
                          <span className="font-mono font-bold text-sm text-emerald-700">₹{adv.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-amber-700 block text-[10px] uppercase font-bold">Balance Due</span>
                          <span className="font-mono font-bold text-sm text-amber-700">₹{due.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Transaction Table */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                              <th className="py-2.5 px-4">Date</th>
                              <th className="py-2.5 px-4">Milestone / Description</th>
                              <th className="py-2.5 px-4">Payment Mode</th>
                              <th className="py-2.5 px-4">Transaction Ref / UTR</th>
                              <th className="py-2.5 px-4 text-right">Amount Received</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(fin.paymentHistory || []).map((rec, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50/60">
                                <td className="py-2.5 px-4 font-mono font-medium">
                                  {new Date(rec.paymentDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </td>
                                <td className="py-2.5 px-4 font-medium text-slate-800">
                                  {rec.receiptNote || "Milestone installment"}
                                </td>
                                <td className="py-2.5 px-4">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                    {rec.mode}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 font-mono text-slate-400 text-[10px]">
                                  {rec.transactionRef || "—"}
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">
                                  ₹{rec.amount.toLocaleString()}
                                </td>
                              </tr>
                            ))}

                            {(fin.paymentHistory || []).length === 0 && (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                                  No client installments recorded yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ════════════════ VIEW 5: VENDOR PAYMENTS ════════════════ */}
                {detailsViewTab === "vendorPayments" && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Vendor Disbursals & Payouts Ledger */}
                    <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <h4 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-purple-600" />
                            <span>Vendor Disbursals & Payout Ledgers</span>
                          </h4>
                          <p className="text-xs text-slate-500">
                            Agreed contract costs, payouts disbursed in installments, commission, and remaining dues per vendor.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const b = viewingBookingDetails;
                              setViewingBookingDetails(null);
                              handleEdit(b);
                              setModalTab("vendorPayments");
                            }}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Manage / Add Vendors</span>
                          </button>
                        </div>
                      </div>

                      {/* KPI Summary Cards for Vendors */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-2xl text-xs">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Vendor Fee</span>
                          <span className="font-mono font-bold text-sm text-slate-900">₹{totalVendorCost.toLocaleString()}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                          <span className="text-emerald-700 block text-[10px] uppercase font-bold">Total Disbursed</span>
                          <span className="font-mono font-bold text-sm text-emerald-700">₹{totalVendorPaid.toLocaleString()}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                          <span className="text-amber-700 block text-[10px] uppercase font-bold">Vendor Dues</span>
                          <span className="font-mono font-bold text-sm text-purple-800">₹{totalVendorDue.toLocaleString()}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                          <span className="text-indigo-700 block text-[10px] uppercase font-bold">Agency Commission</span>
                          <span className="font-mono font-bold text-sm text-emerald-600">₹{totalCommission.toLocaleString()}</span>
                        </div>
                      </div>

                      {(viewingBookingDetails.vendorPayouts || []).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {viewingBookingDetails.vendorPayouts!.map((vp, vIdx) => (
                            <div
                              key={vIdx}
                              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-purple-200 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div>
                                  <strong className="text-slate-900 block text-xs">{vp.name}</strong>
                                  <span className="text-[11px] text-slate-500 block">
                                    {vp.serviceCategory} • {vp.subEventName || "Full Wedding"}
                                  </span>
                                  {vp.phone && (
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                                      <a
                                        href={`tel:${vp.phone}`}
                                        className="text-slate-600 hover:text-purple-700 flex items-center gap-0.5"
                                      >
                                        <Phone className="w-2.5 h-2.5" />
                                        <span>{vp.phone}</span>
                                      </a>
                                    </div>
                                  )}
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  vp.payoutStatus === "Settled"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : vp.payoutStatus === "Partial"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {vp.payoutStatus}
                                </span>
                              </div>

                              <div className="p-2.5 bg-white rounded-xl border border-slate-100 grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                                <div>
                                  <span className="text-slate-400 block">Agreed</span>
                                  <span className="font-bold text-slate-800">₹{(vp.agreedCost || 0).toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="text-emerald-700 block">Paid</span>
                                  <span className="font-bold text-emerald-700">₹{(vp.totalPaid || 0).toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="text-amber-700 block">Due</span>
                                  <span className="font-bold text-amber-700">₹{(vp.balanceDue || 0).toLocaleString()}</span>
                                </div>
                              </div>

                              {/* Payout history list */}
                              {(vp.payoutHistory || []).length > 0 && (
                                <div className="space-y-1 pt-1 border-t border-slate-200/60 max-h-28 overflow-y-auto">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Disbursed Installments:
                                  </span>
                                  {vp.payoutHistory!.map((ph, phIdx) => (
                                    <div
                                      key={phIdx}
                                      className="flex items-center justify-between text-[10px] text-slate-600 font-mono"
                                    >
                                      <span>{new Date(ph.paymentDate).toLocaleDateString()} ({ph.mode})</span>
                                      <strong className="text-purple-700 font-bold">₹{ph.amount.toLocaleString()}</strong>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Quick Disburse Button */}
                              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTargetVendorBooking(viewingBookingDetails);
                                    setTargetVendorIndex(vIdx);
                                    setQuickVendorAmount(vp.balanceDue ? String(vp.balanceDue) : "");
                                    setQuickVendorRef("");
                                    setQuickVendorNote("");
                                    setQuickVendorDate(new Date().toISOString().split("T")[0]);
                                    setQuickVendorPayoutOpen(true);
                                  }}
                                  className="w-full py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                  <span>+ Disburse Payout</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 space-y-3">
                          <Truck className="w-10 h-10 mx-auto text-slate-300" />
                          <div>
                            <h5 className="font-bold text-slate-700 text-sm">No Vendor Payouts Registered</h5>
                            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                              No vendors or external workers have been attached to this event booking yet. You can assign vendors and track payment installments in Edit mode.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const b = viewingBookingDetails;
                              setViewingBookingDetails(null);
                              handleEdit(b);
                              setModalTab("vendorPayments");
                            }}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                          >
                            + Add Vendors to Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* ── Sticky Modal Footer with Actions ── */}
              <div className="p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendBookingWhatsApp(viewingBookingDetails)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Official WhatsApp Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveBookingForPayment(viewingBookingDetails);
                      setNewPaymentAmount(due > 0 ? due : 0);
                      setPaymentModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-200/60"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>+ Record Client Payment</span>
                  </button>

                  {(viewingBookingDetails.vendorPayouts || []).length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const firstDueIdx = viewingBookingDetails.vendorPayouts?.findIndex(
                          (v) => (v.balanceDue || 0) > 0
                        );
                        const targetIdx = firstDueIdx !== -1 && firstDueIdx !== undefined ? firstDueIdx : 0;
                        setTargetVendorBooking(viewingBookingDetails);
                        setTargetVendorIndex(targetIdx);
                        const targetVp = viewingBookingDetails.vendorPayouts?.[targetIdx];
                        setQuickVendorAmount(
                          targetVp?.balanceDue ? String(targetVp.balanceDue) : ""
                        );
                        setQuickVendorRef("");
                        setQuickVendorNote("");
                        setQuickVendorDate(new Date().toISOString().split("T")[0]);
                        setQuickVendorPayoutOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-purple-200/60"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>+ Disburse Vendor Payout</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const b = viewingBookingDetails;
                      setViewingBookingDetails(null);
                      handleEdit(b);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Booking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingBookingDetails(null)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition-colors cursor-pointer shadow-md"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── Quick Record Client Milestone Payment Modal (Enterprise Overlay) ── */}
      {paymentModalOpen && activeBookingForPayment && (
        <div className="fixed inset-0 z-[70] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200/90 animate-in zoom-in-95 duration-150 text-xs">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                  Record Milestone Payment
                </h3>
                <p className="text-[11px] text-slate-500">
                  Booking: <strong className="text-slate-800">{activeBookingForPayment.bookingNumber}</strong> • Client:{" "}
                  <strong className="text-slate-800">{activeBookingForPayment.customerSnapshot?.name}</strong>
                </p>
              </div>
            </div>

            {/* Current Client Dues Summary */}
            {(() => {
              const fin = activeBookingForPayment.financials || {};
              const finalAmt = Number(fin.finalAmount || fin.totalPackageAmount || 0);
              const adv = Number(fin.advancePaid || 0);
              const due = Number(fin.balanceDue !== undefined ? fin.balanceDue : Math.max(0, finalAmt - adv));
              return (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Package</span>
                    <span className="font-mono font-bold text-emerald-950">₹{finalAmt.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Advance Received</span>
                    <span className="font-mono font-bold text-emerald-900">₹{adv.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-rose-600 block">Balance Due</span>
                    <span className="font-mono font-bold text-sm text-rose-700">₹{due.toLocaleString()}</span>
                  </div>
                </div>
              );
            })()}

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Amount Received (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPaymentAmount}
                    onChange={(e) => setNewPaymentAmount(Number(e.target.value) || 0)}
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                    }}
                    placeholder="Enter amount received"
                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl font-mono text-base font-bold text-emerald-700 outline-none focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                <select
                  value={newPaymentMode}
                  onChange={(e) => setNewPaymentMode(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-700 outline-none focus:border-emerald-500"
                >
                  <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash Handover</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction Ref / Cheque No</label>
                <input
                  type="text"
                  value={newPaymentRef}
                  onChange={(e) => setNewPaymentRef(e.target.value)}
                  placeholder="UPI Ref ID, Bank Transaction ID, or Cheque No (optional)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Receipt Note</label>
                <input
                  type="text"
                  value={newPaymentNote}
                  onChange={(e) => setNewPaymentNote(e.target.value)}
                  placeholder="e.g. 2nd advance installment, venue stage payment"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Confirm & Update Balance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Quick Record Vendor Payout Modal (Enterprise Overlay) ── */}
      {quickVendorPayoutOpen && targetVendorBooking && targetVendorIndex !== null && (
        <div className="fixed inset-0 z-[70] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200/90 animate-in zoom-in-95 duration-150 text-xs">
            <button
              type="button"
              onClick={() => setQuickVendorPayoutOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                  Record Vendor Payout
                </h3>
                <p className="text-[11px] text-slate-500">
                  Disburse milestone payment or advance to assigned vendor
                </p>
              </div>
            </div>

            {/* Vendor Switcher (if multiple vendors) */}
            {targetVendorBooking.vendorPayouts && targetVendorBooking.vendorPayouts.length > 1 ? (
              <div className="mb-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Select Vendor <span className="text-purple-600 font-normal">({targetVendorBooking.vendorPayouts.length} assigned)</span>
                </label>
                <select
                  value={targetVendorIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setTargetVendorIndex(idx);
                    const vp = targetVendorBooking.vendorPayouts?.[idx];
                    setQuickVendorAmount(vp?.balanceDue ? String(vp.balanceDue) : "");
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium text-xs text-slate-800 outline-none focus:border-purple-500"
                >
                  {targetVendorBooking.vendorPayouts.map((vp, i) => (
                    <option key={i} value={i}>
                      {vp.name} ({vp.serviceCategory || "Vendor"}) — Due: ₹{(vp.balanceDue || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {/* Current Target Vendor Info Card */}
            {(() => {
              const currentVp = targetVendorBooking.vendorPayouts?.[targetVendorIndex];
              return (
                <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl mb-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-purple-950 block text-xs">
                      {currentVp?.name || "Vendor"}
                    </span>
                    <span className="text-[11px] text-purple-700 block">
                      {currentVp?.serviceCategory || "Vendor Services"} • Agreed: ₹{(currentVp?.agreedCost || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">
                      Remaining Due
                    </span>
                    <span className="font-mono font-bold text-sm text-purple-900">
                      ₹{(currentVp?.balanceDue || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })()}

            <form onSubmit={handleQuickRecordVendorPayout} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payout Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quickVendorAmount}
                    onChange={(e) => setQuickVendorAmount(e.target.value)}
                    onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                    }}
                    placeholder="Enter amount to pay"
                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl font-mono text-base font-bold text-purple-700 outline-none focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={quickVendorMode}
                    onChange={(e) => setQuickVendorMode(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-700 outline-none focus:border-purple-500"
                  >
                    <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash Handover</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payout Date</label>
                  <input
                    type="date"
                    value={quickVendorDate}
                    onChange={(e) => setQuickVendorDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Transaction Ref / UTR / Cheque No
                </label>
                <input
                  type="text"
                  value={quickVendorRef}
                  onChange={(e) => setQuickVendorRef(e.target.value)}
                  placeholder="UPI Ref ID, IMPS Ref, or Cheque No (optional)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Disbursal Note</label>
                <input
                  type="text"
                  value={quickVendorNote}
                  onChange={(e) => setQuickVendorNote(e.target.value)}
                  placeholder="e.g. Stage advance installment, sound final settlement"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickVendorPayoutOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quickVendorSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{quickVendorSubmitting ? "Recording..." : "Confirm & Disburse Payout"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Accidental Cancel Confirmation Modal ── */}
      {confirmCancelModalOpen && (
        <div className="fixed inset-0 z-[85] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200/90 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">
              Discard Unsaved Changes?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Aapne booking me details fill ki hain. Agar aap bina save kiye exit karenge to saara entered data cancel ho jayega.
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmCancelModalOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmCancelModalOpen(false);
                  setShowModal(false);
                  setEditingBooking(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Yes, Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Accidental Save Confirmation Modal ── */}
      {confirmSaveModalOpen && editingBooking && (
        <div className="fixed inset-0 z-[85] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200/90 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                  Confirm & Save Booking
                </h3>
                <p className="text-[11px] text-slate-500">
                  Kripya final submit karne se pehle event summary check kar lijiye:
                </p>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Customer:</span>
                <span className="font-bold text-slate-900">
                  {editingBooking.customerSnapshot?.name || "Client Selected"}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Primary Date:</span>
                <span className="font-mono font-bold text-rose-700">
                  {editingBooking.primaryEventDate
                    ? new Date(editingBooking.primaryEventDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Sub-Events / Functions:</span>
                <span className="font-bold text-slate-800">
                  {editingBooking.subEvents?.length || 0} Function(s)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Total Package Amount:</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  ₹{(editingBooking.financials?.totalPackageAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={saveLoading}
                onClick={() => setConfirmSaveModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Review Details
              </button>
              <button
                type="button"
                disabled={saveLoading}
                onClick={executeSaveBooking}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Booking...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Yes, Confirm & Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
