"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Send,
  CheckCheck,
  Check,
  AlertCircle,
  Clock,
  User,
  Crown,
  Sparkles,
  ExternalLink,
  RefreshCw,
  X,
  FileText,
  Filter,
  Layers,
  Settings,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { CustomerData } from "./CustomerCRM";
import { BookingData } from "./BookingManagement";

export interface WhatsAppLogData {
  _id?: string;
  recipientPhone: string;
  recipientName: string;
  customerId?: string;
  bookingId?: string;
  messageType: string;
  channel: "Meta-Cloud-API" | "WhatsApp-Web-Direct";
  messageText: string;
  status: "Sent" | "Delivered" | "Read" | "Failed";
  metaMessageId?: string;
  errorReason?: string;
  sentByAdminName: string;
  sentAt: string;
}

interface WhatsAppCenterProps {
  logs: WhatsAppLogData[];
  customers: CustomerData[];
  bookings: BookingData[];
  onRefreshLogs: () => void;
  initialRecipients?: { phone: string; name: string; customerId?: string; bookingId?: string }[];
  initialDefaultMsg?: string;
}

const PRESET_TEMPLATES = [
  {
    id: "booking_confirm",
    label: "📋 Booking Confirmation & Receipt",
    type: "Booking-Confirmation",
    text: `Namaste {{name}} ji! 🙏\n\nRIWAJ Events me aapka grand event booking successfully confirm ho gaya hai.\n\nHumari decor aur catering team royal execution ke liye tayyar hai. Kisi bhi query ke liye humein call karein.\n\n*RIWAJ Events & Weddings*\nContact: +91 98935 18332`,
  },
  {
    id: "payment_reminder",
    label: "💰 Payment Milestone Reminder",
    type: "Payment-Reminder",
    text: `Namaste {{name}} ji! 🙏\n\nAapke upcoming event ke payment schedule ka reminder:\nKripya pending installment clear karein taaki raw materials aur vendors final lock kiye ja sakein.\n\nUPI / Account details:\nGooglePay/PhonePe: +91 98935 18332\n\nDhanyawad,\n*RIWAJ Events*`,
  },
  {
    id: "wedding_offer",
    label: "✨ Wedding Season Royal Package Offer",
    type: "Greeting",
    text: `Namaste {{name}} ji! 🌟\n\nIs wedding season me RIWAJ Events lekar aaya hai exclusive Royal Mandap & Catering packages with complimentary Drone Shoot & Flower Entryway!\n\nApne family function ki date lock karne ke liye aaj hi contact karein: +91 98935 18332.\n\n*RIWAJ Events - The Royal Artistry*`,
  },
  {
    id: "anniversary_wishes",
    label: "🎂 Anniversary / Birthday Royal Wishes",
    type: "Greeting",
    text: `Namaste {{name}} ji! 💐\n\nRIWAJ Events ki poori team ki taraf se aapko bohot bohot shubhkamnayein! Ishwar aapke jeevan me hamesha khushiyaan aur samriddhi banaye rakhein.\n\nAapke agle parivarik function ke liye humare paas special 10% privilege discount uplabdh hai.\n\nWarm Regards,\n*RIWAJ Events*`,
  },
  {
    id: "custom",
    label: "✍️ Write Custom Message",
    type: "Custom",
    text: `Namaste {{name}} ji! `,
  },
];

export default function WhatsAppCenter({
  logs,
  customers,
  bookings,
  onRefreshLogs,
  initialRecipients,
  initialDefaultMsg,
}: WhatsAppCenterProps) {
  const [activeSubTab, setActiveSubTab] = useState<"compose" | "history" | "api_config">("compose");

  // API Config states (Stored directly in MongoDB SiteSetting collection - no env file required!)
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [businessAccountId, setBusinessAccountId] = useState("");
  const [officialPhone, setOfficialPhone] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [saveErrorMsg, setSaveErrorMsg] = useState("");

  // Test connection states
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load existing API credentials from SiteSetting on component mount
  const fetchApiConfig = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setPhoneNumberId(data.settings.whatsAppPhoneNumberId || "");
        setAccessToken(data.settings.whatsAppAccessToken || "");
        setBusinessAccountId(data.settings.whatsAppBusinessAccountId || "");
        setOfficialPhone(data.settings.whatsAppNumber || "");
      }
    } catch (err) {
      console.error("Failed to load WhatsApp API settings from database:", err);
    }
  };

  useEffect(() => {
    fetchApiConfig();
  }, []);

  const isApiConfigured = Boolean(phoneNumberId.trim() && accessToken.trim());

  // Save API config directly to MongoDB database
  const handleSaveApiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setSaveSuccessMsg("");
    setSaveErrorMsg("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsAppPhoneNumberId: phoneNumberId.trim(),
          whatsAppAccessToken: accessToken.trim(),
          whatsAppBusinessAccountId: businessAccountId.trim(),
          whatsAppNumber: officialPhone.trim(),
        }),
      });

      const data = await res.json();
      setSavingConfig(false);

      if (data.success) {
        setSaveSuccessMsg("WhatsApp API credentials successfully saved in database! You can now send official Meta messages.");
        setTimeout(() => setSaveSuccessMsg(""), 5000);
      } else {
        setSaveErrorMsg(data.message || "Failed to save WhatsApp API credentials.");
      }
    } catch (err: any) {
      setSavingConfig(false);
      setSaveErrorMsg(err.message || "Network error while saving API credentials.");
    }
  };

  // Send a live test message to verify the credentials
  const handleTestApiConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhoneNumber.trim()) {
      alert("Please enter a WhatsApp number to receive the test message.");
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/admin/whatsapp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testPhone: testPhoneNumber.trim() }),
      });

      const data = await res.json();
      setTestingConnection(false);
      setTestResult({
        success: data.success,
        message: data.message,
      });

      if (data.success) {
        onRefreshLogs();
      }
    } catch (err: any) {
      setTestingConnection(false);
      setTestResult({
        success: false,
        message: err.message || "Network error during test message dispatch.",
      });
    }
  };

  // Compose states
  const [recipients, setRecipients] = useState<
    { phone: string; name: string; customerId?: string; bookingId?: string }[]
  >(initialRecipients || []);
  const [singlePhoneInput, setSinglePhoneInput] = useState("");
  const [singleNameInput, setSingleNameInput] = useState("");
  const [messageText, setMessageText] = useState(
    initialDefaultMsg || PRESET_TEMPLATES[0].text
  );
  const [channel, setChannel] = useState<"Meta-Cloud-API" | "WhatsApp-Web-Direct">(
    "Meta-Cloud-API"
  );
  const [messageType, setMessageType] = useState<string>("Custom");
  const [sending, setSending] = useState(false);
  const [sendResultSummary, setSendResultSummary] = useState<string>("");

  // History states
  const [historySearch, setHistorySearch] = useState("");
  const [historyChannelFilter, setHistoryChannelFilter] = useState("all");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");
  const [viewLogDetail, setViewLogDetail] = useState<WhatsAppLogData | null>(null);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase();
        const mName = l.recipientName?.toLowerCase().includes(q);
        const mPhone = l.recipientPhone?.toLowerCase().includes(q);
        const mText = l.messageText?.toLowerCase().includes(q);
        const mAdmin = l.sentByAdminName?.toLowerCase().includes(q);
        if (!mName && !mPhone && !mText && !mAdmin) return false;
      }
      if (historyChannelFilter !== "all" && l.channel !== historyChannelFilter) return false;
      if (historyStatusFilter !== "all" && l.status !== historyStatusFilter) return false;
      return true;
    });
  }, [logs, historySearch, historyChannelFilter, historyStatusFilter]);

  // Handle template selection
  const handleSelectTemplate = (tpl: (typeof PRESET_TEMPLATES)[0]) => {
    setMessageText(tpl.text);
    setMessageType(tpl.type);
  };

  // Quick recipient pickers
  const handleAddAllHighValue = () => {
    const vip = customers.filter((c) => c.customerTier === "High-Value");
    const formatted = vip.map((c) => ({
      phone: c.whatsappNumber || c.phone,
      name: c.name,
      customerId: c._id!,
    }));
    setRecipients(formatted);
  };

  const handleAddAllCustomers = () => {
    const all = customers.map((c) => ({
      phone: c.whatsappNumber || c.phone,
      name: c.name,
      customerId: c._id!,
    }));
    setRecipients(all);
  };

  const handleAddSingleManual = () => {
    if (!singlePhoneInput.trim()) return;
    setRecipients([
      ...recipients,
      {
        phone: singlePhoneInput.trim(),
        name: singleNameInput.trim() || "Customer",
      },
    ]);
    setSinglePhoneInput("");
    setSingleNameInput("");
  };

  // Send WhatsApp Action
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recipients.length === 0) {
      alert("Please specify at least one recipient.");
      return;
    }
    if (!messageText.trim()) {
      alert("Message text cannot be empty.");
      return;
    }

    setSending(true);
    setSendResultSummary("");

    try {
      const res = await fetch("/api/admin/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          messageText,
          channel,
          messageType,
        }),
      });

      const data = await res.json();
      setSending(false);

      if (data.success) {
        setSendResultSummary(data.message);
        onRefreshLogs();

        // If Direct Web mode, open the first recipient in a new tab
        if (channel === "WhatsApp-Web-Direct" && data.results?.[0]?.directUrl) {
          window.open(data.results[0].directUrl, "_blank");
        }
      } else {
        alert(data.message || "Failed to dispatch messages");
      }
    } catch (err: any) {
      setSending(false);
      alert(err.message || "Network error while sending messages");
    }
  };

  return (
    <div className="space-y-5 pb-28 sm:pb-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-serif leading-tight">
              WhatsApp Communication &amp; Logs
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-normal">
            Bulk/1-on-1 messages via Meta Official Cloud API or Direct WhatsApp Web.
          </p>
        </div>

        {/* Sub-tab toggle - Full width segmented control on mobile */}
        <div className="w-full md:w-auto flex bg-gray-100/90 p-1 rounded-2xl text-xs font-bold gap-1 shadow-inner overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab("compose")}
            className={`flex-1 md:flex-initial py-2 px-3 rounded-xl transition-all whitespace-nowrap text-center text-[11px] sm:text-xs ${
              activeSubTab === "compose"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            💬 Compose
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSubTab("history");
              onRefreshLogs();
            }}
            className={`flex-1 md:flex-initial py-2 px-3 rounded-xl transition-all whitespace-nowrap text-center text-[11px] sm:text-xs ${
              activeSubTab === "history"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            📜 History ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSubTab("api_config");
              fetchApiConfig();
            }}
            className={`flex-1 md:flex-initial py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap text-[11px] sm:text-xs ${
              activeSubTab === "api_config"
                ? "bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-400 font-bold"
                : "text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100"
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>API Config</span>
            {isApiConfigured ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="API Configured" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" title="API Not Configured" />
            )}
          </button>
        </div>
      </div>

      {/* ── SUB-TAB 1: COMPOSE & BROADCAST ── */}
      {activeSubTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: 7 Cols */}
          <div className="lg:col-span-7 bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs space-y-4 sm:space-y-5 text-xs">
            {/* Direct Quick Settings Card for API */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white rounded-2xl border border-emerald-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Key className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                      Meta Cloud API Setup
                    </h4>
                    <p className="text-[10px] text-gray-500 truncate">
                      {isApiConfigured ? "Active & Connected to Database" : "Phone Number ID & Token Missing"}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                  isApiConfigured
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                }`}>
                  {isApiConfigured ? "Ready" : "Keys Missing"}
                </span>
              </div>

              <p className="text-[11px] text-gray-600 leading-relaxed">
                {isApiConfigured
                  ? "Aapke Meta API credentials database me securely stored hain. Broadcast messages bhejne ke liye ready."
                  : "WhatsApp Phone Number ID aur Access Token ko direct admin se database me add karein (no .env needed)."}
              </p>

              <div className="pt-0.5 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab("api_config");
                    fetchApiConfig();
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 shrink-0" />
                  <span>{isApiConfigured ? "Manage WhatsApp API" : "Add Meta API Keys"} →</span>
                </button>
              </div>
            </div>

            {/* Channel Selection */}
            <div>
              <label className="block font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                <span>Select WhatsApp Delivery Channel</span>
                <span className="text-[10px] text-gray-400 font-normal">Choose according to volume</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel("Meta-Cloud-API")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    channel === "Meta-Cloud-API"
                      ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-400"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs">🚀 Meta Official Cloud API</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                      1,000 Free / mo
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                    Automated batch broadcast, official delivery ticks, 100% legal with zero ban risk.
                  </p>
                  {isApiConfigured ? (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">Connected ({phoneNumberId ? `ID: ...${phoneNumberId.slice(-4)}` : "Active"})</span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-between text-[10px] text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 font-medium">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>API keys not set yet</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSubTab("api_config");
                          fetchApiConfig();
                        }}
                        className="font-bold underline text-amber-900 hover:text-black ml-1 cursor-pointer"
                      >
                        Add Keys →
                      </button>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setChannel("WhatsApp-Web-Direct")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    channel === "WhatsApp-Web-Direct"
                      ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-400"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs">🌐 Direct WhatsApp Web (wa.me)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-bold">
                      Free Forever
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                    Opens pre-filled message directly in your WhatsApp Web / App, auto-logged to database.
                  </p>
                </button>
              </div>
            </div>

            {/* Recipient Selector */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="font-bold text-gray-800">
                  Target Recipients ({recipients.length} Selected)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleAddAllHighValue}
                    className="px-2 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] hover:bg-amber-200 flex items-center gap-1"
                  >
                    <Crown className="w-2.5 h-2.5" />
                    <span>All VIPs</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAllCustomers}
                    className="px-2 py-1 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px] hover:bg-rose-200"
                  >
                    All Clients ({customers.length})
                  </button>
                  {recipients.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setRecipients([])}
                      className="px-2 py-1 rounded-md text-gray-500 hover:text-red-600 text-[10px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Recipient pills */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white rounded-xl border border-gray-200">
                {recipients.map((r, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-800 text-[11px] flex items-center gap-1 font-medium"
                  >
                    <span>
                      {r.name} ({r.phone})
                    </span>
                    <button
                      type="button"
                      onClick={() => setRecipients(recipients.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {recipients.length === 0 && (
                  <span className="text-gray-400 text-xs italic p-1">
                    No recipients selected. Add clients below or pick from quick buttons above.
                  </span>
                )}
              </div>

              {/* Add manual single phone */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Client Name (e.g. Ramesh)"
                  value={singleNameInput}
                  onChange={(e) => setSingleNameInput(e.target.value)}
                  className="w-full sm:w-1/3 px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                />
                <div className="flex gap-2 w-full sm:flex-1">
                  <input
                    type="tel"
                    placeholder="10-digit mobile (e.g. 9893518332)"
                    value={singlePhoneInput}
                    onChange={(e) => setSinglePhoneInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs font-mono outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddSingleManual}
                    disabled={!singlePhoneInput.trim()}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black disabled:opacity-30 shrink-0 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Template Presets */}
            <div>
              <label className="block font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                <span>Select Message Template</span>
                <span className="text-[10px] text-gray-400">Click to fill content</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className="px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-rose-50 hover:border-rose-300 text-gray-700 text-[11px] font-medium transition-all"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center justify-between">
                <span>Message Content</span>
                <span className="text-[10px] text-rose-600 font-semibold">
                  Placeholders supported: &#123;&#123;name&#125;&#125;, &#123;&#123;phone&#125;&#125;
                </span>
              </label>
              <textarea
                rows={6}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write message text here..."
                className="w-full p-3 border border-gray-200 rounded-2xl bg-white outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed text-xs"
              />
            </div>

            {/* Submit Dispatch Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={sending || recipients.length === 0}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-200 hover:opacity-95 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching WhatsApp Messages...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      Dispatch WhatsApp Broadcast ({recipients.length} Recipient
                      {recipients.length > 1 ? "s" : ""})
                    </span>
                  </>
                )}
              </button>

              {sendResultSummary && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sendResultSummary} Check Message History tab for delivery logs.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Simulated WhatsApp Chat Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0b141a] rounded-3xl p-4 shadow-xl border border-gray-800 text-white">
              {/* WhatsApp Mock Top Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
                <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center font-bold text-sm">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-xs">RIWAJ Events Official</h4>
                  <span className="text-[10px] text-emerald-400">Online • Verified Business</span>
                </div>
              </div>

              {/* Chat Bubble Container */}
              <div className="py-6 px-2 min-h-[280px] bg-[#0c1317] rounded-2xl mt-3 flex flex-col justify-end">
                <div className="max-w-[90%] self-end bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-xs text-xs shadow-md space-y-1">
                  <p className="whitespace-pre-line leading-relaxed font-sans">
                    {messageText
                      .replace(/\{\{name\}\}/gi, recipients[0]?.name || "Rajesh Singh")
                      .replace(/\{\{phone\}\}/gi, recipients[0]?.phone || "919893518332")}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/80 pt-1">
                    <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Helpful Guide Card */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1.5 text-gray-700">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Zero Cost & Ban-Free Tips:</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                • <strong>Meta Cloud API</strong> gives 1,000 free conversations every month, ideal for festival greetings and bulk booking notices.
              </p>
              <p className="text-[11px] leading-relaxed">
                • For daily 1-on-1 client followups, use <strong>Direct WhatsApp Web</strong> (100% Free, opens instant chat with zero API consumption).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: MESSAGE HISTORY & AUDIT LOGS ── */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          {/* History Search & Filters */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search logs by recipient name, phone, message content, admin..."
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none"
              />
            </div>

            <div className="w-full sm:w-44">
              <select
                value={historyChannelFilter}
                onChange={(e) => setHistoryChannelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none text-xs"
              >
                <option value="all">All Channels</option>
                <option value="Meta-Cloud-API">Meta Cloud API</option>
                <option value="WhatsApp-Web-Direct">WhatsApp Web Direct</option>
              </select>
            </div>

            <div className="w-full sm:w-36">
              <select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="Sent">Sent</option>
                <option value="Delivered">Delivered</option>
                <option value="Read">Read</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Immutable Logs Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Message Preview</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Admin</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredLogs.map((log) => {
                    const timeStr = new Date(log.sentAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={log._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                          {timeStr}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-900 block">{log.recipientName}</span>
                          <span className="font-mono text-[11px] text-gray-500">{log.recipientPhone}</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.channel === "Meta-Cloud-API"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {log.channel === "Meta-Cloud-API" ? "Cloud API" : "Web Direct"}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-gray-600 text-[11px]">
                          {log.messageType}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-gray-600">
                          {log.messageText}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.status === "Sent" || log.status === "Delivered" || log.status === "Read"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-[11px]">
                          {log.sentByAdminName}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setViewLogDetail(log)}
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                            title="View full message details"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400">
                        <MessageSquare className="w-8 h-8 mx-auto mb-1 text-gray-300" />
                        No message history logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 3: WHATSAPP API CONFIGURATION ── */}
      {activeSubTab === "api_config" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Left Column: API Credentials Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Key className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm font-serif">
                      Meta WhatsApp Cloud API Credentials
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Keys are stored directly in your MongoDB database. No server restarts or .env edits needed.
                    </p>
                  </div>
                </div>
                {isApiConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Configured</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>Needs Setup</span>
                  </span>
                )}
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {saveErrorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{saveErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveApiConfig} className="space-y-4">
                {/* 1. Phone Number ID */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1 flex items-center justify-between">
                    <span>WhatsApp Phone Number ID *</span>
                    <span className="text-[10px] text-gray-400 font-normal">From Meta API Setup</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={phoneNumberId}
                      onChange={(e) => setPhoneNumberId(e.target.value)}
                      placeholder="e.g. 104829182374921"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono text-xs outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Meta Developers &gt; WhatsApp &gt; API Setup &gt; <strong>Phone number ID</strong> (not your display phone number).
                  </p>
                </div>

                {/* 2. Access Token */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1 flex items-center justify-between">
                    <span>Meta Access Token (System User / Permanent) *</span>
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                    >
                      {showToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showToken ? "Hide" : "Show"}</span>
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type={showToken ? "text" : "password"}
                      required
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="e.g. EAAG..."
                      className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono text-xs outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Permanent System User Token (starts with <code>EAA...</code>) generated from Meta Business Manager with <code>whatsapp_business_messaging</code> permission.
                  </p>
                </div>

                {/* 3. WABA ID (Optional) */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1 flex items-center justify-between">
                    <span>WhatsApp Business Account ID (WABA ID) (Optional)</span>
                    <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                  </label>
                  <input
                    type="text"
                    value={businessAccountId}
                    onChange={(e) => setBusinessAccountId(e.target.value)}
                    placeholder="e.g. 109283746192834"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono text-xs outline-none"
                  />
                </div>

                {/* 4. Official Display WhatsApp Phone Number */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1 flex items-center justify-between">
                    <span>Default Business Sender WhatsApp Number</span>
                    <span className="text-[10px] text-gray-400 font-normal">e.g. 919893518332</span>
                  </label>
                  <input
                    type="text"
                    value={officialPhone}
                    onChange={(e) => setOfficialPhone(e.target.value)}
                    placeholder="e.g. 9893518332"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono text-xs outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    This phone number is also used on the website footer and floating chat button.
                  </p>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {savingConfig ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving API Credentials in Database...</span>
                      </>
                    ) : (
                      <>
                        <CheckCheck className="w-4 h-4" />
                        <span>Save WhatsApp API Configuration</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Test Connection Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Send className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">
                    Test Live WhatsApp Connection
                  </h4>
                  <p className="text-[10px] text-gray-500">
                    Send an instant confirmation ping to verify if your saved API credentials work.
                  </p>
                </div>
              </div>

              <form onSubmit={handleTestApiConnection} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                    placeholder="Enter 10-digit WhatsApp number (e.g. 9893518332)"
                    className="w-full sm:flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-mono text-xs"
                  />
                  <button
                    type="submit"
                    disabled={testingConnection || !phoneNumberId || !accessToken}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all shrink-0 cursor-pointer"
                  >
                    {testingConnection ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Testing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Test WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>

                {(!phoneNumberId || !accessToken) && (
                  <p className="text-[10px] text-amber-600 italic">
                    * Please fill and save Phone Number ID &amp; Access Token above first before testing.
                  </p>
                )}

                {testResult && (
                  <div
                    className={`p-3 rounded-2xl border text-xs font-semibold flex items-start gap-2 ${
                      testResult.success
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span className="whitespace-pre-line leading-relaxed">{testResult.message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Status & Setup Guide (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Status Card */}
            <div className="bg-gradient-to-br from-gray-900 to-[#0b141a] text-white p-5 rounded-3xl border border-gray-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                  Connection Status
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isApiConfigured
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {isApiConfigured ? "🟢 Active & Ready" : "⚠️ Incomplete Keys"}
                </span>
              </div>

              <div className="space-y-2 pt-1 border-t border-gray-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Storage Layer:</span>
                  <span className="text-emerald-300 font-mono font-semibold">MongoDB Database</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Phone Number ID:</span>
                  <span className="font-mono text-gray-200">
                    {phoneNumberId ? `${phoneNumberId.slice(0, 4)}••••${phoneNumberId.slice(-4)}` : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Access Token:</span>
                  <span className="font-mono text-gray-200">
                    {accessToken ? "•••••••••••• (Saved)" : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">WABA ID:</span>
                  <span className="font-mono text-gray-200">
                    {businessAccountId || "Not set (optional)"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-300 leading-relaxed">
                💡 <strong>Dynamic Config:</strong> Values updated here take effect immediately for all broadcasts without touching <code>.env</code> files or restarting Next.js.
              </div>
            </div>

            {/* Step-by-Step Meta Guide */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 space-y-3 text-gray-800">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>How to Get Meta WhatsApp Cloud API in 4 Steps</span>
              </div>

              <ol className="space-y-2.5 text-[11px] text-gray-700 list-decimal pl-4 leading-relaxed">
                <li>
                  Go to{" "}
                  <a
                    href="https://developers.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-amber-900 underline hover:text-black inline-flex items-center gap-0.5"
                  >
                    <span>developers.facebook.com</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>{" "}
                  and click <strong>My Apps &gt; Create App</strong> (choose <strong>Business</strong>).
                </li>
                <li>
                  In App Dashboard, add <strong>WhatsApp</strong> from the product list.
                </li>
                <li>
                  In sidebar, click <strong>WhatsApp &gt; API Setup</strong>:
                  <div className="mt-1 pl-2 border-l-2 border-amber-300 space-y-0.5 text-gray-600">
                    <div>• Copy the <strong>Phone number ID</strong></div>
                    <div>• Copy the <strong>Temporary Access Token</strong> (or create a permanent System User in Meta Business Settings)</div>
                  </div>
                </li>
                <li>
                  Paste both keys in the form on the left and click <strong>Save WhatsApp API Configuration</strong>.
                </li>
              </ol>

              <div className="pt-2 border-t border-amber-200/80 text-[10px] text-amber-900 leading-relaxed">
                📌 <strong>Zero Cost Benefit:</strong> Meta provides 1,000 free service conversation threads every calendar month.
              </div>
            </div>

            {/* Zero Cost Alternative Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-4 space-y-1.5 text-xs">
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>No API Token right now?</span>
              </span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                You can switch back to the <strong>Compose &amp; Broadcast</strong> tab and select <strong>Direct WhatsApp Web (wa.me)</strong>. It requires zero API keys and works 100% free forever.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab("compose")}
                className="mt-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline block cursor-pointer"
              >
                Go to Compose &amp; Broadcast →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Log Details Modal ── */}
      {viewLogDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 text-xs">
            <button
              onClick={() => setViewLogDetail(null)}
              className="absolute right-4 top-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">
              WhatsApp Message Audit Record
            </h3>
            <p className="text-gray-500 text-[11px] mb-3">
              Sent by {viewLogDetail.sentByAdminName} on{" "}
              {new Date(viewLogDetail.sentAt).toLocaleString()}
            </p>

            <div className="space-y-2.5 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Recipient:</span>
                <strong className="text-gray-900">
                  {viewLogDetail.recipientName} ({viewLogDetail.recipientPhone})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Channel:</span>
                <strong className="text-gray-900">{viewLogDetail.channel}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold text-emerald-700">{viewLogDetail.status}</span>
              </div>
              {viewLogDetail.errorReason && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[11px]">
                  <strong>Error:</strong> {viewLogDetail.errorReason}
                </div>
              )}
            </div>

            <div className="mt-3">
              <label className="block font-bold text-gray-700 mb-1">Full Message Content:</label>
              <div className="p-3 bg-gray-100 rounded-xl whitespace-pre-line text-gray-800 leading-relaxed font-sans max-h-48 overflow-y-auto">
                {viewLogDetail.messageText}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setViewLogDetail(null)}
                className="px-4 py-2 bg-gray-900 text-white font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
