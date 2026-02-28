import React, { useState, useRef, useEffect } from "react";

const STORAGE_KEY = "equipment-checklist-data";
const initialData = { jobs: [], nextId: 1 };

function generateId(state) {
  const id = state.nextId;
  return [id, { ...state, nextId: id + 1 }];
}

// ── Color Palette ──────────────────────────────────────────────────────────
const COLORS = [
  { label: "None",          value: null },
  // Reds
  { label: "Crimson",       value: "#dc2626" },
  { label: "Red",           value: "#ef4444" },
  { label: "Coral",         value: "#f87171" },
  { label: "Rose",          value: "#f43f5e" },
  { label: "Hot Pink",      value: "#ec4899" },
  // Oranges & Yellows
  { label: "Deep Orange",   value: "#ea580c" },
  { label: "Orange",        value: "#f97316" },
  { label: "Amber",         value: "#f59e0b" },
  { label: "Yellow",        value: "#eab308" },
  { label: "Gold",          value: "#E8C547" },
  // Greens
  { label: "Lime",          value: "#84cc16" },
  { label: "Green",         value: "#22c55e" },
  { label: "Emerald",       value: "#10b981" },
  { label: "Teal",          value: "#14b8a6" },
  { label: "Forest",        value: "#15803d" },
  { label: "Olive",         value: "#65a30d" },
  // Blues
  { label: "Cyan",          value: "#06b6d4" },
  { label: "Sky",           value: "#0ea5e9" },
  { label: "Blue",          value: "#3b82f6" },
  { label: "Royal Blue",    value: "#2563eb" },
  { label: "Navy",          value: "#1e40af" },
  { label: "Indigo",        value: "#6366f1" },
  // Purples
  { label: "Violet",        value: "#7c3aed" },
  { label: "Purple",        value: "#a855f7" },
  { label: "Lavender",      value: "#c084fc" },
  { label: "Fuchsia",       value: "#d946ef" },
  // Neutrals
  { label: "Brown",         value: "#92400e" },
  { label: "Tan",           value: "#d97706" },
  { label: "Silver",        value: "#94a3b8" },
  { label: "White",         value: "#e5e5e5" },
];

function ColorPicker({ value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Color Tag</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 7 }}>
        {COLORS.map(c => (
          <button key={c.label} onClick={() => onChange(c.value)} title={c.label}
            style={{ width: "100%", aspectRatio: "1", borderRadius: 10, border: value === c.value ? "3px solid #fff" : "2px solid transparent", background: c.value || "#2a2a2a", cursor: "pointer", boxShadow: value === c.value ? `0 0 0 2px ${c.value || "#E8C547"}` : "none", flexShrink: 0, transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!c.value && <span style={{ fontSize: 13, color: "#555" }}>∅</span>}
          </button>
        ))}
      </div>
      {value && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: value }} />
          {COLORS.find(c => c.value === value)?.label || "Custom"}
        </div>
      )}
    </div>
  );
}

// ── Emoji Libraries ────────────────────────────────────────────────────────
const JOB_EMOJIS = [
  "🎸","🎹","🎤","🎷","🎻","🥁","🎺","🪗","🎵","🎶","🎼","🎙️","🔊","📻","🎧","🎚️","🎛️","🪘","🪕","🎬",
  "🔧","🪚","🔨","⚒️","🛠️","🪛","🔩","🪝","🪜","🏗️","🧱","🪟","🚧","⚙️","🔌","💡","🔦","🧰","📐","📏",
  "🎨","✏️","🖌️","🖊️","📷","📸","🎭","🎪","🖼️","🧶","🪡","🧵","✂️","🖍️","📝","🗒️","🗃️","📋","📁","🗂️",
  "💻","🖥️","📱","⌨️","🖱️","🖨️","📡","📺","🔋","🔭","🔬","💾","💿","📀","🧲","🤖","🛰️","📲","☎️","📞",
  "🎉","🎊","🎈","🍽️","🥂","🎂","🪄","🎩","🪅","🎟️","🏆","🥇","🎖️","🎀","🎁","🎃","🎆","🎇","🥗","🍱",
  "🚐","🚚","🛻","⛺","🏕️","🌲","🧭","🗺️","🏋️","⚽","🏀","🎾","🏊","🚴","🧗","🏄","🎣","🏹","🤿","🥊",
  "🏥","💊","🩺","🩹","🧬","🦺","🧤","🥼","👔","👗","🎒","🧳","💼","👜","🪣","🧹","🧺","🪠","🧴","💈",
];
const BAG_EMOJIS = [
  "🎒","💼","🧳","👜","🛍️","👝","📦","🗃️","🗄️","🗂️","📂","📁","🧰","🪤","🪣","🫙","🏺","🗑️","📥","📤",
  "🎸","🎹","🥁","🎷","🎻","🎺","🪗","🪘","🪕","🎤","🎙️","🔊","🎧","🎚️","🎛️","📻","🎵","🎶","🎼","🎬",
  "🔧","🪚","🔨","⚒️","🛠️","🪛","🔩","🪝","🧰","🔦","💡","🔋","🔌","📐","📏","⚙️","🧲","🪜","🏗️","🚧",
  "🚐","🚚","🛻","🚜","✈️","🚂","🛳️","🚁","🛺","🛵","🚲","🛴","🏎️","🚗","🚕","🚙","🏍️","🚑","🚒","🛡️",
  "🍱","🧺","🥡","☕","🫖","🍶","🍾","🥂","🍽️","🥢","🫙","🪣","🥗","🍫","🎂","🧁","🍪","🥤","🧃","💧",
  "💻","📱","🖥️","📷","📸","📹","🎥","💾","💿","📀","🖨️","⌨️","🖱️","📡","🔭","🔬","🧪","📋","📝","📌",
];
const ITEM_EMOJIS = [
  "🔧","🪚","🔨","⚒️","🛠️","🪛","🔩","🪝","🪜","🔦","💡","🔋","🔌","🧲","📐","📏","✂️","🗜️","⚙️","🔑",
  "🎸","🎹","🎤","🎷","🎻","🥁","🎺","🪗","🎵","🎙️","🔊","📻","🎧","🎚️","🎛️","🎼","🪘","🪕","🎶","🎬",
  "💻","📱","🖥️","⌨️","🖱️","📡","📺","💾","💿","📀","📷","📸","📹","🎥","📽️","🎞️","🖨️","🕹️","🤖","🔭",
  "🔌","🔋","🧲","💡","🔦","🕯️","🪔","🔆","📲","☎️","📞","📟","📠","⌚","📡","🔭","🔬","🧪","🧫","🧬",
  "👔","👗","🥼","🦺","🧤","🧣","👒","🎩","⛑️","👓","🕶️","🥽","👟","🥾","🧢","🎒","💼","👜","🧳","🪖",
  "☕","🍵","🫖","💧","🥤","🍶","🍾","🥂","🥗","🍱","🧃","🫙","🥡","🍫","🍬","🍭","🧁","🍪","🎂","🥐",
  "📝","✏️","🖊️","🖋️","📌","📍","📎","🖇️","📋","📄","📃","📑","🗒️","📓","📔","📒","📕","📗","📘","📙",
  "🩹","💊","🩺","🩻","🧬","🧴","🧻","🪥","🧽","🧹","🧺","🗑️","🧯","🚨","⚠️","🔐","🛡️","🪪","🔒","🏥",
  "⛺","🧭","🗺️","🪤","🏋️","🎾","🏀","⚽","🏊","🚴","🧗","🏄","🎣","🏹","🪃","🥊","🎿","🏂","⛷️","🤿",
  "📦","🗃️","🗄️","🗂️","📂","🧰","🪣","🫧","🪄","🎩","🔮","🧿","🎯","🎲","🎮","🕹️","🧩","♟️","🪀","🎁",
];

// ── Helpers ────────────────────────────────────────────────────────────────
function progressOf(items) {
  if (!items || items.length === 0) return null;
  const checked = items.filter(i => i.checked).length;
  return { checked, total: items.length, pct: Math.round((checked / items.length) * 100) };
}
function allItemsInJob(job) {
  const bagItems = job.bags.flatMap(b => b.items);
  const looseItems = job.looseItems || [];
  return [...bagItems, ...looseItems];
}
// How many bags are "fully packed" (all items checked, and has at least 1 item)
function progressOfBags(job) {
  const bags = job.bags;
  if (!bags || bags.length === 0) return null;
  const packed = bags.filter(b => b.items.length > 0 && b.items.every(i => i.checked)).length;
  return { packed, total: bags.length };
}

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    back: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />,
    camera: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" strokeWidth={2} /></>,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />,
    reset: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    box: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    item: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
  };
  return <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icons[name]}</svg>;
};

// ── Shared UI ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, color = "#E8C547" }) {
  return (
    <div style={{ height: 4, background: "#2a2a2a", borderRadius: 2, overflow: "hidden", marginTop: 6 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.4s ease" }} />
    </div>
  );
}

function Badge({ children, color = "#E8C547" }) {
  return (
    <span style={{ background: color + "22", color, fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20, letterSpacing: "0.05em", border: `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

// Color dot shown on cards
function ColorDot({ color, size = 10 }) {
  if (!color) return null;
  return <div style={{ width: size, height: size, borderRadius: "50%", background: color, flexShrink: 0 }} />;
}

// Left accent bar — 6px solid strip + subtle background tint
function ColorAccent({ color }) {
  if (!color) return null;
  return <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: color, borderRadius: "16px 0 0 16px" }} />;
}
// Tinted background for colored cards
function cardBg(color) {
  return color ? `linear-gradient(135deg, ${color}18 0%, #1a1a1a 60%)` : "#1a1a1a";
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", padding: "24px 20px 44px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 700, color: "#E8C547", letterSpacing: "0.05em" }}>{title}</span>
          <button onClick={onClose} style={{ background: "#2a2a2a", border: "none", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EmojiPicker({ value, onChange, library, tabs }) {
  const [tab, setTab] = useState(0);
  const tabSize = Math.ceil(library.length / tabs.length);
  const visible = library.slice(tab * tabSize, (tab + 1) * tabSize);
  const isEmpty = !value;
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Icon</label>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        {/* Current selection preview */}
        <div style={{ fontSize: 30, width: 54, height: 54, background: "#111", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${isEmpty ? "#444" : "#E8C547"}`, flexShrink: 0, color: "#555" }}>
          {isEmpty ? <span style={{ fontSize: 18 }}>∅</span> : value}
        </div>
        {/* None button */}
        <button onClick={() => onChange(null)} style={{ background: isEmpty ? "#E8C54722" : "#1e1e1e", border: isEmpty ? "2px solid #E8C547" : "2px solid #333", borderRadius: 10, padding: "8px 14px", color: isEmpty ? "#E8C547" : "#666", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.15s" }}>
          ∅ None
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ background: tab === i ? "#E8C547" : "#252525", color: tab === i ? "#111" : "#777", border: "none", borderRadius: 8, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 5, maxHeight: 190, overflowY: "auto", background: "#111", borderRadius: 12, padding: 8 }}>
        {visible.map((e, i) => (
          <button key={i} onClick={() => onChange(e)} style={{ fontSize: 22, background: value === e ? "#E8C54733" : "transparent", border: value === e ? "2px solid #E8C547" : "2px solid transparent", borderRadius: 9, padding: "5px 2px", cursor: "pointer", transition: "all 0.12s", lineHeight: 1 }}>{e}</button>
        ))}
      </div>
    </div>
  );
}

function QuantityStepper({ label, value, onChange }) {
  const qty = parseInt(value) || 1;
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</label>}
      <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#111", border: "1px solid #333", borderRadius: 10, overflow: "hidden", width: "fit-content" }}>
        <button onClick={() => onChange(Math.max(1, qty - 1))}
          style={{ width: 48, height: 44, background: "none", border: "none", color: qty <= 1 ? "#444" : "#f0f0f0", fontSize: 22, fontWeight: 300, cursor: qty <= 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.15s" }}>
          −
        </button>
        <div style={{ minWidth: 44, textAlign: "center", fontSize: 17, fontWeight: 700, color: "#f0f0f0", borderLeft: "1px solid #2a2a2a", borderRight: "1px solid #2a2a2a", height: 44, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}>
          {qty}
        </div>
        <button onClick={() => onChange(qty + 1)}
          style={{ width: 48, height: 44, background: "none", border: "none", color: "#f0f0f0", fontSize: 22, fontWeight: 300, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          +
        </button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  const baseStyle = { width: "100%", background: "#111", border: "1px solid #333", borderRadius: 10, padding: "11px 14px", color: "#f0f0f0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        rows={1} autoCorrect="off" autoCapitalize="off" spellCheck="false"
        style={{ ...baseStyle, resize: "none", overflow: "hidden", lineHeight: "1.4" }}
        onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }} />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        autoComplete="new-password" autoCorrect="off" spellCheck="false" data-lpignore="true" data-form-type="other"
        style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 10, padding: "11px 14px", color: "#f0f0f0", fontSize: 15, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", icon }) {
  const styles = {
    primary: { background: "#E8C547", color: "#111", border: "none" },
    secondary: { background: "#2a2a2a", color: "#ccc", border: "1px solid #333" },
    danger: { background: "#ff444422", color: "#ff6666", border: "1px solid #ff444444" },
  };
  return (
    <button onClick={onClick} style={{ ...styles[variant], borderRadius: 12, padding: "12px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, letterSpacing: "0.02em", fontFamily: "inherit" }}>
      {icon && <span style={{ opacity: 0.85 }}>{icon}</span>}
      {children}
    </button>
  );
}

// ── Crop Tool ──────────────────────────────────────────────────────────────
function CropModal({ src, onSave, onCancel }) {
  const CANVAS_SIZE = 300;
  const containerRef = useRef();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const dragStart = useRef(null);
  const lastTouch = useRef(null);
  const lastPinchDist = useRef(null);

  // Load image and set initial zoom to fill circle
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      setImgSize({ w, h });
      const minZoom = Math.max(CANVAS_SIZE / w, CANVAS_SIZE / h);
      setZoom(minZoom);
      setOffset({ x: 0, y: 0 });
    };
    img.src = src;
  }, [src]);

  const minZoom = imgSize.w ? Math.max(CANVAS_SIZE / imgSize.w, CANVAS_SIZE / imgSize.h) : 1;
  const maxZoom = minZoom * 4;

  // Clamp offset so image always fills the circle
  function clamp(off, z) {
    const displayW = imgSize.w * z;
    const displayH = imgSize.h * z;
    const maxX = (displayW - CANVAS_SIZE) / 2;
    const maxY = (displayH - CANVAS_SIZE) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, off.x)),
      y: Math.max(-maxY, Math.min(maxY, off.y)),
    };
  }

  // Mouse drag
  function onMouseDown(e) {
    e.preventDefault();
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  }
  function onMouseMove(e) {
    if (!dragStart.current) return;
    const raw = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
    setOffset(clamp(raw, zoom));
  }
  function onMouseUp() { dragStart.current = null; }

  // Touch drag + pinch zoom
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      lastTouch.current = { x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y };
      lastPinchDist.current = null;
    } else if (e.touches.length === 2) {
      lastPinchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }
  function onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1 && lastTouch.current) {
      const raw = { x: e.touches[0].clientX - lastTouch.current.x, y: e.touches[0].clientY - lastTouch.current.y };
      setOffset(prev => clamp(raw, zoom));
    } else if (e.touches.length === 2 && lastPinchDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist / lastPinchDist.current;
      lastPinchDist.current = dist;
      setZoom(prev => {
        const next = Math.max(minZoom, Math.min(maxZoom, prev * delta));
        setOffset(o => clamp(o, next));
        return next;
      });
    }
  }
  function onTouchEnd() { lastTouch.current = null; lastPinchDist.current = null; }

  function handleZoomChange(e) {
    const next = parseFloat(e.target.value);
    setZoom(next);
    setOffset(o => clamp(o, next));
  }

  // Render cropped circle to canvas and export
  function handleSave() {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    const ctx = canvas.getContext("2d");
    // Clip to circle
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    // Draw image centred with offset
    const displayW = imgSize.w * zoom;
    const displayH = imgSize.h * zoom;
    const x = (CANVAS_SIZE - displayW) / 2 + offset.x;
    const y = (CANVAS_SIZE - displayH) / 2 + offset.y;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, x, y, displayW, displayH);
      onSave(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = src;
  }

  const displayW = imgSize.w * zoom;
  const displayH = imgSize.h * zoom;
  const imgX = (CANVAS_SIZE - displayW) / 2 + offset.x;
  const imgY = (CANVAS_SIZE - displayH) / 2 + offset.y;
  const zoomPct = minZoom > 0 ? Math.round(((zoom - minZoom) / (maxZoom - minZoom)) * 100) : 0;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: "#E8C547", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Crop Photo</div>

      {/* Crop area */}
      <div style={{ position: "relative", width: CANVAS_SIZE, height: CANVAS_SIZE, borderRadius: "50%", overflow: "hidden", border: "3px solid #E8C547", cursor: "grab", touchAction: "none", boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)", flexShrink: 0 }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        ref={containerRef}
      >
        {imgSize.w > 0 && (
          <img src={src} alt="crop"
            style={{ position: "absolute", left: imgX, top: imgY, width: displayW, height: displayH, userSelect: "none", pointerEvents: "none", draggable: false }}
          />
        )}
      </div>

      {/* Zoom slider */}
      <div style={{ width: CANVAS_SIZE, marginTop: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          <span>Zoom</span><span style={{ color: "#E8C547" }}>{zoomPct}%</span>
        </div>
        <input type="range" min={minZoom} max={maxZoom} step={(maxZoom - minZoom) / 200} value={zoom} onChange={handleZoomChange}
          style={{ width: "100%", accentColor: "#E8C547", cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#444", marginTop: 4 }}>
          <span>Fit</span><span>4×</span>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#444", marginTop: 16, textAlign: "center" }}>Drag to reposition · Pinch or slider to zoom</div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button onClick={handleSave} style={{ background: "#E8C547", border: "none", borderRadius: 14, padding: "13px 28px", fontSize: 15, fontWeight: 800, color: "#111", cursor: "pointer" }}>
          Use Photo
        </button>
        <button onClick={onCancel} style={{ background: "#2a2a2a", border: "1px solid #444", borderRadius: 14, padding: "13px 24px", fontSize: 15, fontWeight: 700, color: "#ccc", cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function PhotoField({ photo, onChange, label = "Photo (optional)" }) {
  const ref = useRef();
  const [cropSrc, setCropSrc] = useState(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    // Reset input so same file can be re-selected
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = ev => setCropSrc(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onSave={cropped => { onChange(cropped); setCropSrc(null); }}
          onCancel={() => setCropSrc(null)}
        />
      )}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>{label}</label>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", background: "#222", border: "2px solid #333", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>
            {photo
              ? <img src={photo} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <Icon name="camera" size={22} />
            }
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => ref.current.click()} style={{ background: "#222", border: "1px solid #333", borderRadius: 10, padding: "9px 16px", color: "#ccc", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
              <Icon name="camera" size={15} /> {photo ? "Change photo" : "Add photo"}
            </button>
            {photo && (
              <button onClick={() => { onChange(null); }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 12, textAlign: "left", padding: "0 4px" }}>✕ Remove</button>
            )}
          </div>
        </div>
        <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      </div>
    </>
  );
}

function PageHeader({ photo, icon, name, subtitle, onBack, backLabel, rightSlot }) {
  return (
    <div style={{ background: "#151515", borderBottom: "1px solid #1e1e1e", padding: "16px 20px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#E8C547", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0, marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
        <Icon name="back" size={16} /> {backLabel}
      </button>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          {/* Avatar: photo + emoji badge, or emoji square */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {photo ? (
              <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", border: "2px solid #444" }}>
                <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ fontSize: 28, width: 52, height: 52, background: "#222", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #2a2a2a" }}>{icon}</div>
            )}
            {photo && icon && (
              <div style={{ position: "absolute", bottom: -2, right: -4, fontSize: 14, background: "#151515", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #333" }}>{icon}</div>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>
        {rightSlot}
      </div>
    </div>
  );
}

// Expanding FAB with two options
function ExpandingFAB({ onBag, onItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 20, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, zIndex: 50 }}>
      {open && (
        <>
          <button onClick={() => { setOpen(false); onItem(); }} style={{ background: "#2a2a2a", border: "1px solid #444", borderRadius: 16, padding: "11px 18px", fontSize: 14, fontWeight: 700, color: "#f0f0f0", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
            <Icon name="item" size={16} /> Add Item
          </button>
          <button onClick={() => { setOpen(false); onBag(); }} style={{ background: "#2a2a2a", border: "1px solid #444", borderRadius: 16, padding: "11px 18px", fontSize: 14, fontWeight: 700, color: "#f0f0f0", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
            <Icon name="box" size={16} /> Add Bag
          </button>
        </>
      )}
      <button onClick={() => setOpen(o => !o)} style={{ background: open ? "#555" : "#E8C547", border: "none", borderRadius: 20, padding: "14px 22px", fontSize: 15, fontWeight: 800, color: open ? "#fff" : "#111", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 24px rgba(232,197,71,0.45)", transition: "all 0.2s" }}>
        {open ? <><Icon name="close" size={18} /> Close</> : <><Icon name="plus" size={18} /> Add</>}
      </button>
    </div>
  );
}

// Reusable item row (used in both BagsView loose items and ItemsView)
function ItemRow({ item, onToggle, onEdit, onDelete }) {
  const ac = item.color;
  const bg = item.checked ? "#181818" : (ac ? `linear-gradient(135deg, ${ac}15 0%, #1e1e1e 55%)` : "#1e1e1e");
  return (
    <div style={{ background: bg, borderRadius: 14, marginBottom: 10, border: `1px solid ${ac ? ac + "66" : (item.checked ? "#222" : "#2c2c2c")}`, overflow: "hidden", transition: "all 0.2s", position: "relative" }}>
      <ColorAccent color={item.checked ? null : ac} />
      <div style={{ display: "flex", alignItems: "center", padding: "12px 12px 12px 0", paddingLeft: ac ? "10px" : "0" }}>
        <button onClick={onToggle} style={{ minWidth: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${item.checked ? "#4ade80" : (ac || "#444")}`, background: item.checked ? "#4ade8022" : (ac ? ac + "22" : "transparent"), display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            {item.checked && <Icon name="check" size={15} />}
          </div>
        </button>
        {/* Avatar: photo or emoji, always shown */}
        <div style={{ position: "relative", flexShrink: 0, marginRight: 12 }}>
          {item.photo ? (
            <div style={{ width: 46, height: 46, borderRadius: "50%", overflow: "hidden", opacity: item.checked ? 0.45 : 1, border: ac ? `3px solid ${ac}` : "2px solid #444" }}>
              <img src={item.photo} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : item.emoji ? (
            <div style={{ fontSize: 24, width: 46, height: 46, background: ac ? ac + "30" : "#252525", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", opacity: item.checked ? 0.35 : 1, transition: "opacity 0.2s", border: ac ? `2px solid ${ac}88` : "1px solid #333" }}>{item.emoji}</div>
          ) : ac ? (
            <div style={{ width: 46, height: 46, borderRadius: 11, background: ac + "30", border: `2px solid ${ac}88`, flexShrink: 0, opacity: item.checked ? 0.35 : 1 }} />
          ) : null}
          {/* Emoji badge on photo */}
          {item.photo && item.emoji && (
            <div style={{ position: "absolute", bottom: -2, right: -4, fontSize: 12, background: "#1a1a1a", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #333", opacity: item.checked ? 0.5 : 1 }}>{item.emoji}</div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: item.checked ? "#555" : "#f0f0f0", textDecoration: item.checked ? "line-through" : "none", transition: "color 0.2s" }}>
            {item.name}
          </div>
          <div style={{ display: "flex", gap: 7, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
            {ac && !item.checked && <div style={{ width: 8, height: 8, borderRadius: "50%", background: ac, boxShadow: `0 0 5px ${ac}99`, flexShrink: 0 }} />}
            {item.qty > 1 && <Badge color={ac || "#666"}>×{item.qty}</Badge>}
            {item.notes && <span style={{ fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{item.notes}</span>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 6 }}>
          <button onClick={onEdit} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}><Icon name="edit" size={15} /></button>
          <button onClick={onDelete} style={{ background: "none", border: "none", color: "#3a3a3a", cursor: "pointer", padding: 4 }}><Icon name="trash" size={15} /></button>
        </div>
      </div>
    </div>
  );
}

// Item add/edit modal form (shared)
function ItemForm({ form, setForm, onSave, onCancel, title }) {
  const ITEM_TABS = ["Tools","Music","Electronics","Clothing","Food","Stationery","Health","Sport","Other"];
  return (
    <Modal title={title} onClose={onCancel}>
      <EmojiPicker value={form.emoji} onChange={v => setForm(f => ({ ...f, emoji: v }))} library={ITEM_EMOJIS} tabs={ITEM_TABS} />
      <ColorPicker value={form.color} onChange={v => setForm(f => ({ ...f, color: v }))} />
      <Input label="Item Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Guitar tuner, Hammer" />
      <QuantityStepper label="Quantity" value={form.qty} onChange={v => setForm(f => ({ ...f, qty: v }))} />
      <Textarea label="Notes (optional)" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="e.g. Check battery, stored in side pocket" />
      <PhotoField photo={form.photo} onChange={v => setForm(f => ({ ...f, photo: v }))} label="Photo (optional)" />
      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={onSave} icon={<Icon name="check" size={16} />}>{title.startsWith("EDIT") ? "Save Changes" : "Add Item"}</Btn>
        <Btn onClick={onCancel} variant="secondary">Cancel</Btn>
      </div>
    </Modal>
  );
}

// ── JOBS VIEW ──────────────────────────────────────────────────────────────
function JobsView({ data, setData, navigate }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState({ name: "", icon: "🎸", photo: null, color: null });
  const JOB_TABS = ["Music","Build","Art","Tech","Events","Sport","Health"];

  function openAdd() { setForm({ name: "", icon: "🎸", photo: null, color: null }); setEditJob(null); setShowAdd(true); }
  function openEdit(job, e) { e.stopPropagation(); setForm({ name: job.name, icon: job.icon, photo: job.photo || null, color: job.color || null }); setEditJob(job); setShowAdd(true); }

  function saveJob() {
    if (!form.name.trim()) return;
    if (editJob) {
      setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === editJob.id ? { ...j, name: form.name.trim(), icon: form.icon, photo: form.photo, color: form.color } : j) }));
    } else {
      let s = { ...data };
      let [id, ns] = generateId(s);
      ns.jobs = [...ns.jobs, { id, name: form.name.trim(), icon: form.icon, photo: form.photo, color: form.color, bags: [], looseItems: [] }];
      setData(ns);
    }
    setShowAdd(false);
  }

  function deleteJob(id) { setData(d => ({ ...d, jobs: d.jobs.filter(j => j.id !== id) })); }

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ background: "#151515", borderBottom: "1px solid #1e1e1e", padding: "22px 20px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#E8C547", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>Kit Manager</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>My Jobs</div>
        <div style={{ fontSize: 13, color: "#555", marginTop: 3 }}>{data.jobs.length} job type{data.jobs.length !== 1 ? "s" : ""}</div>
      </div>

      <div style={{ padding: "16px 16px 110px" }}>
        {data.jobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "70px 20px", color: "#444" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#555" }}>No jobs yet</div>
            <div style={{ fontSize: 14, marginTop: 6 }}>Tap + to add your first job type</div>
          </div>
        )}
        {data.jobs.map(job => {
          const items = allItemsInJob(job);
          const prog = progressOf(items);
          const ac = job.color;
          return (
            <div key={job.id} onClick={() => navigate("bags", job.id)} style={{ background: cardBg(ac), borderRadius: 18, marginBottom: 12, border: `1px solid ${ac ? ac + "66" : "#252525"}`, cursor: "pointer", overflow: "hidden", position: "relative" }}>
              <ColorAccent color={ac} />
              <div style={{ padding: "14px", paddingLeft: ac ? "20px" : "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Avatar: always show, with emoji badge on photo */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      {job.photo ? (
                        <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", border: ac ? `3px solid ${ac}` : "2px solid #444" }}>
                          <img src={job.photo} alt={job.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div style={{ fontSize: 26, width: 48, height: 48, background: ac ? ac + "30" : "#252525", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", border: ac ? `2px solid ${ac}88` : "1px solid #333" }}>{job.icon || ""}</div>
                      )}
                      {/* emoji moved to name row */}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: "#f0f0f0", display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                        {job.icon && <span style={{ fontSize: 18 }}>{job.icon}</span>}
                        {job.name}
                        {ac && <div style={{ width: 10, height: 10, borderRadius: "50%", background: ac, flexShrink: 0, boxShadow: `0 0 6px ${ac}99` }} />}
                      </div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{job.bags.length} bag{job.bags.length !== 1 ? "s" : ""} · {items.length} items</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      {(() => { const bp = progressOfBags(job); return bp ? <Badge color={ac || "#888"}>🎒 {bp.packed}/{bp.total}</Badge> : null; })()}
                      {prog && <Badge color={ac || "#E8C547"}>📦 {prog.checked}/{prog.total}</Badge>}
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <button onClick={e => openEdit(job, e)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}><Icon name="edit" size={15} /></button>
                      <button onClick={e => { e.stopPropagation(); deleteJob(job.id); }} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 4 }}><Icon name="trash" size={16} /></button>
                    </div>
                  </div>
                </div>
                {prog && <ProgressBar pct={prog.pct} color={ac || "#E8C547"} />}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "fixed", bottom: 24, right: 20 }}>
        <button onClick={openAdd} style={{ background: "#E8C547", border: "none", borderRadius: 20, padding: "14px 22px", fontSize: 15, fontWeight: 800, color: "#111", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 24px rgba(232,197,71,0.45)" }}>
          <Icon name="plus" size={18} /> New Job
        </button>
      </div>

      {showAdd && (
        <Modal title={editJob ? "EDIT JOB" : "NEW JOB TYPE"} onClose={() => setShowAdd(false)}>
          <EmojiPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} library={JOB_EMOJIS} tabs={JOB_TABS} />
          <ColorPicker value={form.color} onChange={v => setForm(f => ({ ...f, color: v }))} />
          <Input label="Job Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Music Gig, Carpentry" />
          <PhotoField photo={form.photo} onChange={v => setForm(f => ({ ...f, photo: v }))} label="Cover Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveJob} icon={<Icon name="check" size={16} />}>{editJob ? "Save Changes" : "Create Job"}</Btn>
            <Btn onClick={() => setShowAdd(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── BAGS VIEW ──────────────────────────────────────────────────────────────
function BagsView({ data, setData, jobId, navigate }) {
  const job = data.jobs.find(j => j.id === jobId);
  const [showBagModal, setShowBagModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editBag, setEditBag] = useState(null);
  const [editLooseItem, setEditLooseItem] = useState(null);
  const [bagForm, setBagForm] = useState({ name: "", icon: "🎒", photo: null, color: null });
  const [itemForm, setItemForm] = useState({ name: "", emoji: "🔧", qty: 1, notes: "", photo: null, color: null });
  const [showReset, setShowReset] = useState(false);
  const [showEditJob, setShowEditJob] = useState(false);
  const [jobEditForm, setJobEditForm] = useState({ name: "", icon: "🎸", photo: null, color: null });

  const BAG_TABS = ["Bags","Music","Tools","Transport","Food","Office"];
  const JOB_TABS_B = ["Music","Build","Art","Tech","Events","Sport","Health"];

  if (!job) return null;

  function saveEditJob() {
    if (!jobEditForm.name.trim()) return;
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === jobId ? { ...j, ...jobEditForm, name: jobEditForm.name.trim() } : j) }));
    setShowEditJob(false);
  }

  // Bag CRUD
  function openAddBag() { setBagForm({ name: "", icon: "🎒", photo: null, color: null }); setEditBag(null); setShowBagModal(true); }
  function openEditBag(bag, e) { e.stopPropagation(); setBagForm({ name: bag.name, icon: bag.icon, photo: bag.photo || null, color: bag.color || null }); setEditBag(bag); setShowBagModal(true); }
  function saveBag() {
    if (!bagForm.name.trim()) return;
    if (editBag) {
      setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, bags: j.bags.map(b => b.id === editBag.id ? { ...b, ...bagForm, name: bagForm.name.trim() } : b) }) }));
    } else {
      setData(d => {
        let s = { ...d }; let [id, ns] = generateId(s);
        ns.jobs = ns.jobs.map(j => j.id === jobId ? { ...j, bags: [...j.bags, { id, name: bagForm.name.trim(), icon: bagForm.icon, photo: bagForm.photo, color: bagForm.color, items: [] }] } : j);
        return ns;
      });
    }
    setShowBagModal(false);
  }
  function deleteBag(bagId) { setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === jobId ? { ...j, bags: j.bags.filter(b => b.id !== bagId) } : j) })); }

  // Loose item CRUD
  function openAddItem() { setItemForm({ name: "", emoji: "🔧", qty: 1, notes: "", photo: null, color: null }); setEditLooseItem(null); setShowItemModal(true); }
  function openEditItem(item, e) { e.stopPropagation(); setItemForm({ name: item.name, emoji: item.emoji || "🔧", qty: item.qty, notes: item.notes || "", photo: item.photo || null, color: item.color || null }); setEditLooseItem(item); setShowItemModal(true); }
  function saveLooseItem() {
    if (!itemForm.name.trim()) return;
    const looseItems = job.looseItems || [];
    if (editLooseItem) {
      setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, looseItems: (j.looseItems || []).map(i => i.id === editLooseItem.id ? { ...i, ...itemForm, name: itemForm.name.trim() } : i) }) }));
    } else {
      setData(d => {
        let s = { ...d }; let [id, ns] = generateId(s);
        ns.jobs = ns.jobs.map(j => j.id !== jobId ? j : { ...j, looseItems: [...(j.looseItems || []), { id, name: itemForm.name.trim(), emoji: itemForm.emoji, qty: itemForm.qty, notes: itemForm.notes, photo: itemForm.photo, color: itemForm.color, checked: false }] });
        return ns;
      });
    }
    setShowItemModal(false);
  }
  function deleteLooseItem(itemId) { setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, looseItems: (j.looseItems || []).filter(i => i.id !== itemId) }) })); }
  function toggleLooseItem(itemId) { setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, looseItems: (j.looseItems || []).map(i => i.id === itemId ? { ...i, checked: !i.checked } : i) }) })); }

  function resetAll() {
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, bags: j.bags.map(b => ({ ...b, items: b.items.map(i => ({ ...i, checked: false })) })), looseItems: (j.looseItems || []).map(i => ({ ...i, checked: false })) }) }));
    setShowReset(false);
  }

  const allItems = allItemsInJob(job);
  const prog = progressOf(allItems);
  const looseItems = job.looseItems || [];

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        photo={job.photo} icon={job.icon} name={job.name}
        subtitle={`${job.bags.length} bags · ${looseItems.length} items · ${allItems.length} total`}
        onBack={() => navigate("jobs")} backLabel="All Jobs"
        rightSlot={
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setJobEditForm({ name: job.name, icon: job.icon, photo: job.photo || null, color: job.color || null }); setShowEditJob(true); }} style={{ background: "#222", border: "1px solid #333", borderRadius: 10, padding: "8px 12px", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, flexShrink: 0 }}>
              <Icon name="edit" size={14} /> Edit
            </button>
            {prog && (
              <button onClick={() => setShowReset(true)} style={{ background: "#222", border: "1px solid #333", borderRadius: 10, padding: "8px 12px", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, flexShrink: 0 }}>
                <Icon name="reset" size={14} /> Reset
              </button>
            )}
          </div>
        }
      />
      {prog && (
        <div style={{ padding: "8px 20px 12px", background: "#151515", borderBottom: "1px solid #1e1e1e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555", marginBottom: 4 }}>
            <span>Overall progress</span><span style={{ color: "#E8C547", fontWeight: 700 }}>{prog.pct}%</span>
          </div>
          <ProgressBar pct={prog.pct} color={job.color || "#E8C547"} />
        </div>
      )}

      <div style={{ padding: "16px 16px 110px" }}>
        {/* Bags */}
        {job.bags.length > 0 && (
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Bags & Cases</div>
        )}
        {job.bags.map(bag => {
          const bp = progressOf(bag.items);
          const ac = bag.color;
          return (
            <div key={bag.id} onClick={() => navigate("items", jobId, bag.id)} style={{ background: cardBg(ac), borderRadius: 18, marginBottom: 10, border: `1px solid ${ac ? ac + "66" : "#252525"}`, cursor: "pointer", overflow: "hidden", position: "relative" }}>
              <ColorAccent color={ac} />
              <div style={{ padding: "12px 14px", paddingLeft: ac ? "20px" : "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      {bag.photo ? (
                        <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", border: ac ? `3px solid ${ac}` : "2px solid #444" }}>
                          <img src={bag.photo} alt={bag.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div style={{ fontSize: 22, width: 44, height: 44, background: ac ? ac + "30" : "#252525", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", border: ac ? `2px solid ${ac}88` : "1px solid #333" }}>{bag.icon || ""}</div>
                      )}
                      {bag.photo && bag.icon && (
                        <div style={{ position: "absolute", bottom: -2, right: -4, fontSize: 13, background: "#1a1a1a", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #333" }}>{bag.icon}</div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f0f0", display: "flex", alignItems: "center", gap: 7 }}>
                        {bag.name}{ac && <div style={{ width: 9, height: 9, borderRadius: "50%", background: ac, flexShrink: 0, boxShadow: `0 0 5px ${ac}99` }} />}
                      </div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{bag.items.length} item{bag.items.length !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {bp && <Badge color={ac || "#E8C547"}>{bp.checked}/{bp.total}</Badge>}
                    <button onClick={e => openEditBag(bag, e)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}><Icon name="edit" size={15} /></button>
                    <button onClick={e => { e.stopPropagation(); deleteBag(bag.id); }} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 4 }}><Icon name="trash" size={16} /></button>
                  </div>
                </div>
                {bp && <ProgressBar pct={bp.pct} color={ac || "#E8C547"} />}
              </div>
            </div>
          );
        })}

        {/* Loose Items */}
        {looseItems.length > 0 && (
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, marginTop: job.bags.length > 0 ? 16 : 0 }}>Individual Items</div>
        )}
        {looseItems.map(item => (
          <ItemRow key={item.id} item={item}
            onToggle={() => toggleLooseItem(item.id)}
            onEdit={e => openEditItem(item, e)}
            onDelete={() => deleteLooseItem(item.id)}
          />
        ))}

        {job.bags.length === 0 && looseItems.length === 0 && (
          <div style={{ textAlign: "center", padding: "70px 20px", color: "#444" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🎒</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#555" }}>Nothing here yet</div>
            <div style={{ fontSize: 14, marginTop: 6 }}>Tap + to add a bag or an individual item</div>
          </div>
        )}
      </div>

      <ExpandingFAB onBag={openAddBag} onItem={openAddItem} />

      {/* Bag modal */}
      {showBagModal && (
        <Modal title={editBag ? "EDIT BAG" : "ADD BAG / CASE"} onClose={() => setShowBagModal(false)}>
          <EmojiPicker value={bagForm.icon} onChange={v => setBagForm(f => ({ ...f, icon: v }))} library={BAG_EMOJIS} tabs={BAG_TABS} />
          <ColorPicker value={bagForm.color} onChange={v => setBagForm(f => ({ ...f, color: v }))} />
          <Input label="Bag / Case Name" value={bagForm.name} onChange={v => setBagForm(f => ({ ...f, name: v }))} placeholder="e.g. Guitar Case, Tool Belt" />
          <PhotoField photo={bagForm.photo} onChange={v => setBagForm(f => ({ ...f, photo: v }))} label="Cover Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveBag} icon={<Icon name="check" size={16} />}>{editBag ? "Save Changes" : "Add Bag"}</Btn>
            <Btn onClick={() => setShowBagModal(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Loose item modal */}
      {showItemModal && (
        <ItemForm
          form={itemForm} setForm={setItemForm}
          onSave={saveLooseItem} onCancel={() => setShowItemModal(false)}
          title={editLooseItem ? "EDIT ITEM" : "ADD ITEM"}
        />
      )}

      {showReset && (
        <Modal title="RESET CHECKLIST?" onClose={() => setShowReset(false)}>
          <p style={{ color: "#aaa", fontSize: 15, marginBottom: 20 }}>This will uncheck all items in <strong style={{ color: "#fff" }}>{job.name}</strong>. Ready for your next job?</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={resetAll} icon={<Icon name="reset" size={16} />}>Yes, Reset All</Btn>
            <Btn onClick={() => setShowReset(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
      )}

      {showEditJob && (
        <Modal title="EDIT JOB" onClose={() => setShowEditJob(false)}>
          <EmojiPicker value={jobEditForm.icon} onChange={v => setJobEditForm(f => ({ ...f, icon: v }))} library={JOB_EMOJIS} tabs={JOB_TABS_B} />
          <ColorPicker value={jobEditForm.color} onChange={v => setJobEditForm(f => ({ ...f, color: v }))} />
          <Input label="Job Name" value={jobEditForm.name} onChange={v => setJobEditForm(f => ({ ...f, name: v }))} placeholder="e.g. Music Gig, Carpentry" />
          <PhotoField photo={jobEditForm.photo} onChange={v => setJobEditForm(f => ({ ...f, photo: v }))} label="Cover Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveEditJob} icon={<Icon name="check" size={16} />}>Save Changes</Btn>
            <Btn onClick={() => setShowEditJob(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── ITEMS VIEW ────────────────────────────────────────────────────────────
function ItemsView({ data, setData, jobId, bagId, navigate }) {
  const job = data.jobs.find(j => j.id === jobId);
  const bag = job?.bags.find(b => b.id === bagId);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [form, setForm] = useState({ name: "", emoji: "🔧", qty: 1, notes: "", photo: null, color: null });

  if (!job || !bag) return null;

  function updateBag(updater) {
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, bags: j.bags.map(b => b.id !== bagId ? b : updater(b)) }) }));
  }

  function openAdd() { setForm({ name: "", emoji: "🔧", qty: 1, notes: "", photo: null, color: null }); setEditItem(null); setShowAdd(true); }
  function openEdit(item, e) { e.stopPropagation(); setForm({ name: item.name, emoji: item.emoji || "🔧", qty: item.qty, notes: item.notes || "", photo: item.photo || null, color: item.color || null }); setEditItem(item); setShowAdd(true); }

  function saveItem() {
    if (!form.name.trim()) return;
    if (editItem) {
      updateBag(b => ({ ...b, items: b.items.map(i => i.id === editItem.id ? { ...i, ...form, name: form.name.trim() } : i) }));
    } else {
      setData(d => {
        let s = { ...d }; let [id, ns] = generateId(s);
        ns.jobs = ns.jobs.map(j => j.id !== jobId ? j : { ...j, bags: j.bags.map(b => b.id !== bagId ? b : { ...b, items: [...b.items, { id, name: form.name.trim(), emoji: form.emoji, qty: form.qty, notes: form.notes, photo: form.photo, color: form.color, checked: false }] }) });
        return ns;
      });
    }
    setShowAdd(false);
  }

  function deleteItem(itemId) { updateBag(b => ({ ...b, items: b.items.filter(i => i.id !== itemId) })); }
  function toggleCheck(itemId) { updateBag(b => ({ ...b, items: b.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i) })); }
  function resetBag() { updateBag(b => ({ ...b, items: b.items.map(i => ({ ...i, checked: false })) })); setShowReset(false); }

  const prog = progressOf(bag.items);
  const ac = bag.color;

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        photo={bag.photo} icon={bag.icon} name={bag.name}
        subtitle={prog ? (prog.checked === prog.total ? "✓ All packed!" : `${prog.checked} of ${prog.total} packed`) : "No items yet"}
        onBack={() => navigate("bags", jobId)} backLabel={job.name}
        rightSlot={prog && (
          <button onClick={() => setShowReset(true)} style={{ background: "#222", border: "1px solid #333", borderRadius: 10, padding: "8px 12px", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, flexShrink: 0 }}>
            <Icon name="reset" size={14} /> Reset
          </button>
        )}
      />
      {prog && (
        <div style={{ padding: "8px 20px 12px", background: "#151515", borderBottom: "1px solid #1e1e1e" }}>
          <ProgressBar pct={prog.pct} color={prog.pct === 100 ? "#4ade80" : (ac || "#E8C547")} />
        </div>
      )}

      <div style={{ padding: "12px 16px 110px" }}>
        {bag.items.length === 0 && (
          <div style={{ textAlign: "center", padding: "70px 20px", color: "#444" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📦</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#555" }}>No items yet</div>
            <div style={{ fontSize: 14, marginTop: 6 }}>Tap + to add equipment</div>
          </div>
        )}
        {bag.items.map(item => (
          <ItemRow key={item.id} item={item}
            onToggle={() => toggleCheck(item.id)}
            onEdit={e => openEdit(item, e)}
            onDelete={() => deleteItem(item.id)}
          />
        ))}
      </div>

      <div style={{ position: "fixed", bottom: 24, right: 20 }}>
        <button onClick={openAdd} style={{ background: "#E8C547", border: "none", borderRadius: 20, padding: "14px 22px", fontSize: 15, fontWeight: 800, color: "#111", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 24px rgba(232,197,71,0.45)" }}>
          <Icon name="plus" size={18} /> Add Item
        </button>
      </div>

      {showAdd && (
        <ItemForm
          form={form} setForm={setForm}
          onSave={saveItem} onCancel={() => setShowAdd(false)}
          title={editItem ? "EDIT ITEM" : "ADD EQUIPMENT"}
        />
      )}

      {showReset && (
        <Modal title="RESET BAG?" onClose={() => setShowReset(false)}>
          <p style={{ color: "#aaa", fontSize: 15, marginBottom: 20 }}>This will uncheck all items in <strong style={{ color: "#fff" }}>{bag.name}</strong>.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={resetBag} icon={<Icon name="reset" size={16} />}>Yes, Reset</Btn>
            <Btn onClick={() => setShowReset(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── App Shell ──────────────────────────────────────────────────────────────
export default function App() {
  const [data, setDataRaw] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialData;
    } catch { return initialData; }
  });
  const [view, setView] = useState({ name: "jobs", jobId: null, bagId: null });

  function setData(updater) {
    setDataRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function navigate(name, jobId = null, bagId = null) { setView({ name, jobId, bagId }); }
  useEffect(() => { document.title = "Kit Manager"; }, []);

  if (view.name === "jobs") return <JobsView data={data} setData={setData} navigate={navigate} />;
  if (view.name === "bags") return <BagsView data={data} setData={setData} jobId={view.jobId} navigate={navigate} />;
  if (view.name === "items") return <ItemsView data={data} setData={setData} jobId={view.jobId} bagId={view.bagId} navigate={navigate} />;
  return null;
}
