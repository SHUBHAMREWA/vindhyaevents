"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, Keyboard, Check, X } from "lucide-react";

interface ClockTimePicker12Props {
  value?: string;
  onChange: (time12: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function parseTime12(value?: string): {
  hour: number;
  minute: number;
  ampm: "AM" | "PM";
  hasValue: boolean;
} {
  if (!value || !value.trim()) {
    return { hour: 7, minute: 0, ampm: "PM", hasValue: false };
  }
  const clean = value.trim().toUpperCase();

  // Match 12-hour: e.g. "07:00 PM", "7:00 PM", "10:30 AM"
  const match12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = parseInt(match12[2], 10);
    let mod = (match12[3] as "AM" | "PM") || (h >= 12 ? "PM" : "AM");
    if (h > 12) {
      mod = "PM";
      h = h - 12;
    }
    if (h === 0) h = 12;
    return { hour: h, minute: isNaN(m) ? 0 : m, ampm: mod, hasValue: true };
  }

  // Match 24-hour: e.g. "19:00", "07:00", "22:30"
  const match24 = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    let h = parseInt(match24[1], 10);
    const m = parseInt(match24[2], 10);
    const mod: "AM" | "PM" = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return { hour: h, minute: isNaN(m) ? 0 : m, ampm: mod, hasValue: true };
  }

  return { hour: 7, minute: 0, ampm: "PM", hasValue: false };
}

export function formatTime12(hour: number, minute: number, ampm: "AM" | "PM"): string {
  const h = hour.toString().padStart(2, "0");
  const m = minute.toString().padStart(2, "0");
  return `${h}:${m} ${ampm}`;
}

export default function ClockTimePicker12({
  value,
  onChange,
  placeholder = "Pick Time (12-Hr)",
  className = "",
  disabled = false,
}: ClockTimePicker12Props) {
  const [isOpen, setIsOpen] = useState(false);
  const parsed = parseTime12(value);

  // Temporary dialog state until OK is clicked
  const [dialogHour, setDialogHour] = useState(parsed.hour);
  const [dialogMinute, setDialogMinute] = useState(parsed.minute);
  const [dialogAmpm, setDialogAmpm] = useState<"AM" | "PM">(parsed.ampm);
  const [mode, setMode] = useState<"hour" | "minute">("hour");
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);

  const dialRef = useRef<HTMLDivElement>(null);

  // Synchronize when value changes externally
  useEffect(() => {
    const p = parseTime12(value);
    setDialogHour(p.hour);
    setDialogMinute(p.minute);
    setDialogAmpm(p.ampm);
  }, [value]);

  const handleOpen = () => {
    if (disabled) return;
    const p = parseTime12(value);
    setDialogHour(p.hour);
    setDialogMinute(p.minute);
    setDialogAmpm(p.ampm);
    setMode("hour");
    setIsKeyboardMode(false);
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onChange(formatTime12(dialogHour, dialogMinute, dialogAmpm));
    setIsOpen(false);
  };

  // Hour click -> select hour and auto-switch to minute after 200ms
  const handleSelectHour = (h: number) => {
    setDialogHour(h);
    setTimeout(() => {
      setMode("minute");
    }, 220);
  };

  // Minute click
  const handleSelectMinute = (m: number) => {
    setDialogMinute(m);
  };

  // Click anywhere on clock dial face
  const handleDialClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clickX = e.clientX - rect.left - centerX;
    const clickY = e.clientY - rect.top - centerY;

    let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (mode === "hour") {
      let h = Math.round(angle / 30);
      if (h === 0) h = 12;
      handleSelectHour(h);
    } else {
      let m = Math.round(angle / 6) % 60;
      handleSelectMinute(m);
    }
  };

  // 12 hour positions on the circle (radius = 92px)
  const hourPositions = [
    { num: 12, angle: 0 },
    { num: 1, angle: 30 },
    { num: 2, angle: 60 },
    { num: 3, angle: 90 },
    { num: 4, angle: 120 },
    { num: 5, angle: 150 },
    { num: 6, angle: 180 },
    { num: 7, angle: 210 },
    { num: 8, angle: 240 },
    { num: 9, angle: 270 },
    { num: 10, angle: 300 },
    { num: 11, angle: 330 },
  ];

  // 12 minute positions (00, 05, 10 ... 55)
  const minutePositions = [
    { num: 0, label: "00", angle: 0 },
    { num: 5, label: "05", angle: 30 },
    { num: 10, label: "10", angle: 60 },
    { num: 15, label: "15", angle: 90 },
    { num: 20, label: "20", angle: 120 },
    { num: 25, label: "25", angle: 150 },
    { num: 30, label: "30", angle: 180 },
    { num: 35, label: "35", angle: 210 },
    { num: 40, label: "40", angle: 240 },
    { num: 45, label: "45", angle: 270 },
    { num: 50, label: "50", angle: 300 },
    { num: 55, label: "55", angle: 330 },
  ];

  // Current hand angle
  const handAngle = mode === "hour" ? (dialogHour % 12) * 30 : dialogMinute * 6;

  return (
    <div className={`relative ${className}`}>
      {/* ── Trigger Input Button ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className={`w-full px-3 py-2 border rounded-xl bg-white flex items-center justify-between text-xs font-mono transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? "border-purple-500 ring-2 ring-purple-100"
            : "border-slate-200 hover:border-slate-300"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}`}
      >
        <div className="flex items-center gap-2 text-slate-800">
          <Clock className={`w-3.5 h-3.5 ${parsed.hasValue ? "text-purple-600" : "text-slate-400"}`} />
          <span className={parsed.hasValue ? "font-bold text-slate-900" : "text-slate-400"}>
            {parsed.hasValue ? formatTime12(parsed.hour, parsed.minute, parsed.ampm) : placeholder}
          </span>
        </div>

        {parsed.hasValue ? (
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              parsed.ampm === "AM"
                ? "bg-amber-100 text-amber-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {parsed.ampm}
          </span>
        ) : (
          <span className="text-[10px] text-slate-400">12-Hr Clock</span>
        )}
      </button>

      {/* ── Material Clock Dialog Modal (Exact Design from Image) ── */}
      {isOpen && (
        <div className="fixed inset-0 z-[85] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white rounded-3xl max-w-[310px] w-full p-5 shadow-2xl relative border border-slate-200/90 animate-in zoom-in-95 duration-150 select-none">
            {/* Header: SELECT TIME */}
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-3">
              SELECT TIME
            </div>

            {/* Time Digital Boxes & AM/PM Vertical Pill */}
            <div className="flex items-center justify-between gap-1.5 mb-5">
              <div className="flex items-center gap-1.5">
                {/* Hour Box */}
                <button
                  type="button"
                  onClick={() => setMode("hour")}
                  className={`w-20 h-16 rounded-2xl flex items-center justify-center text-4xl font-sans font-bold transition-all cursor-pointer ${
                    mode === "hour"
                      ? "bg-purple-100/90 text-purple-700 ring-2 ring-purple-400/40"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {dialogHour.toString().padStart(2, "0")}
                </button>

                {/* Colon */}
                <span className="text-3xl font-bold text-slate-700 font-sans -mt-1">:</span>

                {/* Minute Box */}
                <button
                  type="button"
                  onClick={() => setMode("minute")}
                  className={`w-20 h-16 rounded-2xl flex items-center justify-center text-4xl font-sans font-bold transition-all cursor-pointer ${
                    mode === "minute"
                      ? "bg-purple-100/90 text-purple-700 ring-2 ring-purple-400/40"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {dialogMinute.toString().padStart(2, "0")}
                </button>
              </div>

              {/* AM / PM Vertical Segmented Pill */}
              <div className="flex flex-col rounded-xl border border-slate-300 overflow-hidden w-12 text-xs font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setDialogAmpm("AM")}
                  className={`py-2 text-center transition-colors cursor-pointer ${
                    dialogAmpm === "AM"
                      ? "bg-purple-100 text-purple-700 font-extrabold"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setDialogAmpm("PM")}
                  className={`py-2 text-center border-t border-slate-200 transition-colors cursor-pointer ${
                    dialogAmpm === "PM"
                      ? "bg-purple-100 text-purple-700 font-extrabold"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* ── Main Clock Face (Circular Analog Dial) ── */}
            {!isKeyboardMode ? (
              <div
                ref={dialRef}
                onClick={handleDialClick}
                className="w-64 h-64 mx-auto rounded-full bg-slate-200/80 relative flex items-center justify-center cursor-pointer shadow-inner"
              >
                {/* Center Pivot Dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-purple-600 z-20 pointer-events-none" />

                {/* Clock Hand Line */}
                <div
                  style={{ transform: `rotate(${handAngle}deg)` }}
                  className="absolute inset-0 pointer-events-none transition-transform duration-200 ease-out"
                >
                  {/* Line from center (128, 128) up to 92px */}
                  <div className="w-0.5 bg-purple-600 h-[92px] absolute left-1/2 -translate-x-1/2 top-[36px]" />
                  {/* Knob circle on the active number */}
                  <div className="w-10 h-10 rounded-full bg-purple-600 absolute left-1/2 -translate-x-1/2 top-[16px] shadow-md flex items-center justify-center text-white font-bold text-sm" />
                </div>

                {/* Numbers Layer */}
                {mode === "hour" ? (
                  // Hour Numbers: 1 to 12
                  hourPositions.map((pos) => {
                    const isSelected = dialogHour === pos.num;
                    const rad = ((pos.angle - 90) * Math.PI) / 180;
                    const x = 128 + 92 * Math.cos(rad);
                    const y = 128 + 92 * Math.sin(rad);

                    return (
                      <button
                        key={pos.num}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectHour(pos.num);
                        }}
                        style={{ left: `${x}px`, top: `${y}px` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors z-10 cursor-pointer ${
                          isSelected ? "text-white font-bold" : "text-slate-800 hover:text-purple-700"
                        }`}
                      >
                        {pos.num}
                      </button>
                    );
                  })
                ) : (
                  // Minute Numbers: 00 to 55
                  minutePositions.map((pos) => {
                    const isSelected = dialogMinute === pos.num;
                    const rad = ((pos.angle - 90) * Math.PI) / 180;
                    const x = 128 + 92 * Math.cos(rad);
                    const y = 128 + 92 * Math.sin(rad);

                    return (
                      <button
                        key={pos.num}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectMinute(pos.num);
                        }}
                        style={{ left: `${x}px`, top: `${y}px` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors z-10 cursor-pointer ${
                          isSelected ? "text-white font-bold" : "text-slate-800 hover:text-purple-700"
                        }`}
                      >
                        {pos.label}
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              // Keyboard Manual Input Mode
              <div className="py-8 px-4 text-center space-y-4">
                <p className="text-xs text-slate-500">Enter custom time manually:</p>
                <div className="flex items-center justify-center gap-2 font-mono">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={dialogHour}
                    onChange={(e) => {
                      const v = Math.min(12, Math.max(1, parseInt(e.target.value, 10) || 1));
                      setDialogHour(v);
                    }}
                    className="w-16 h-12 text-center text-2xl font-bold border border-slate-300 rounded-xl outline-none focus:border-purple-600"
                  />
                  <span className="text-2xl font-bold">:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={dialogMinute}
                    onChange={(e) => {
                      const v = Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0));
                      setDialogMinute(v);
                    }}
                    className="w-16 h-12 text-center text-2xl font-bold border border-slate-300 rounded-xl outline-none focus:border-purple-600"
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions: Keyboard Icon + CANCEL + OK */}
            <div className="flex items-center justify-between pt-4 mt-2">
              <button
                type="button"
                onClick={() => setIsKeyboardMode(!isKeyboardMode)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-purple-600 transition-colors cursor-pointer"
                title={isKeyboardMode ? "Switch to Clock Dial" : "Switch to Keyboard"}
              >
                <Keyboard className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3.5 py-1.5 rounded-lg text-purple-700 hover:bg-purple-50 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-4 py-1.5 rounded-lg text-purple-700 hover:bg-purple-50 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
