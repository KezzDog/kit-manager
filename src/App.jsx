import React, { useState, useRef, useEffect } from "react";

const STORAGE_KEY = "equipment-checklist-data";
const initialData = { jobs: [], nextId: 1 };

function generateId(state) {
  const id = state.nextId;
  return [id, { ...state, nextId: id + 1 }];
}

const NONE_EMOJI = "";

// ── Accent Colors ──────────────────────────────────────────────────────────
// null = no color (default). FALLBACK_ACCENT is used only for rendering when no color is set.
const NO_COLOR = null;
const FALLBACK_ACCENT = "#555555"; // neutral gray used when color is null
const DEFAULT_ACCENT = NO_COLOR;

const ACCENT_COLORS = [
  // Reds
  { label: "Crimson",      value: "#DC143C" },
  { label: "Red",          value: "#EF4444" },
  { label: "Tomato",       value: "#FF6347" },
  { label: "Coral",        value: "#FF7F7F" },
  { label: "Rose",         value: "#FB7185" },
  // Pinks
  { label: "Hot Pink",     value: "#FF69B4" },
  { label: "Pink",         value: "#EC4899" },
  { label: "Light Pink",   value: "#FFB6C1" },
  { label: "Fuchsia",      value: "#D946EF" },
  { label: "Magenta",      value: "#C026D3" },
  // Purples
  { label: "Purple",       value: "#A855F7" },
  { label: "Violet",       value: "#7C3AED" },
  { label: "Indigo",       value: "#6366F1" },
  { label: "Lavender",     value: "#A78BFA" },
  { label: "Plum",         value: "#8B008B" },
  // Blues
  { label: "Navy",         value: "#1E3A8A" },
  { label: "Royal Blue",   value: "#3B82F6" },
  { label: "Cobalt",       value: "#0047AB" },
  { label: "Sky Blue",     value: "#38BDF8" },
  { label: "Baby Blue",    value: "#93C5FD" },
  // Cyans & Teals
  { label: "Cyan",         value: "#06B6D4" },
  { label: "Teal",         value: "#14B8A6" },
  { label: "Aqua",         value: "#00FFFF" },
  { label: "Steel Blue",   value: "#4682B4" },
  { label: "Cerulean",     value: "#0EA5E9" },
  // Greens
  { label: "Lime",         value: "#84CC16" },
  { label: "Green",        value: "#22C55E" },
  { label: "Emerald",      value: "#10B981" },
  { label: "Forest",       value: "#166534" },
  { label: "Mint",         value: "#6EE7B7" },
  { label: "Olive",        value: "#808000" },
  { label: "Sage",         value: "#84A98C" },
  // Yellows & Golds
  { label: "Yellow",       value: "#EAB308" },
  { label: "Gold",         value: "#E8C547" },
  { label: "Amber",        value: "#F59E0B" },
  { label: "Mustard",      value: "#CA8A04" },
  { label: "Lemon",        value: "#FDE047" },
  // Oranges
  { label: "Orange",       value: "#F97316" },
  { label: "Deep Orange",  value: "#EA580C" },
  { label: "Peach",        value: "#FBBF80" },
  { label: "Tangerine",    value: "#FF8C00" },
  // Browns
  { label: "Brown",        value: "#92400E" },
  { label: "Sienna",       value: "#A0522D" },
  { label: "Tan",          value: "#D2B48C" },
  { label: "Chocolate",    value: "#7B3F00" },
  // Grays & Neutrals
  { label: "White",        value: "#E5E5E5" },
  { label: "Light Gray",   value: "#D1D5DB" },
  { label: "Silver",       value: "#94A3B8" },
  { label: "Gray",         value: "#6B7280" },
  { label: "Charcoal",     value: "#374151" },
  { label: "Slate",        value: "#475569" },
  // Black
  { label: "Black",        value: "#111111" },
];

// ── Emoji Libraries ────────────────────────────────────────────────────────
const JOB_EMOJIS = [
  // Music
  "🎸","🎹","🎤","🎷","🎻","🥁","🎺","🪗","🎵","🎶","🎼","🎙️","🔊","📻","🎧","🎚️","🎛️","🪘","🪕","🎬",
  // Construction & Trades
  "🔧","🪚","🔨","⚒️","🛠️","🪛","🔩","🪝","🪜","🏗️","🧱","🪟","🚧","⚙️","🔌","💡","🔦","🧰","📐","📏",
  // Art & Photography
  "🎨","✏️","🖌️","🖊️","📷","📸","🎭","🎪","🖼️","🧶","🪡","🧵","✂️","🖍️","📝","🗒️","🗃️","📋","📁","🗂️",
  // Tech & AV
  "💻","🖥️","📱","⌨️","🖱️","🖨️","📡","📺","🔋","🔭","🔬","💾","💿","📀","🧲","🤖","🛰️","📲","☎️","📞",
  // Events & Catering
  "🎉","🎊","🎈","🍽️","🥂","🎂","🪄","🎩","🪅","🎟️","🏆","🥇","🎖️","🎀","🎁","🎃","🎆","🎇","🥗","🍱",
  // Outdoor & Sport
  "🚐","🚚","🛻","⛺","🏕️","🌲","🧭","🗺️","🏋️","⚽","🏀","🎾","🏊","🚴","🧗","🏄","🎣","🏹","🤿","🥊",
  // Health & Beauty
  "🏥","💊","🩺","🩹","🧬","🦺","🧤","🥼","👔","👗","🎒","🧳","💼","👜","🪣","🧹","🧺","🪠","🧴","💈",
  // Nature & Weather
  "🌿","🌱","🌾","🍀","🌊","🔥","⚡","❄️","🌙","☀️","🌈","🌍","🌺","🍄","🦋","🐾","🌻","🪨","🪵","💧",
  // Food & Drink
  "☕","🍵","🫖","🍾","🥂","🍻","🥗","🍱","🧃","💧","🥤","🫙","🍫","🎂","🧁","🍕","🌮","🥐","🍜","🧆",
];

const BAG_EMOJIS = [
  // Bags & Cases
  "🎒","💼","🧳","👜","🛍️","👝","📦","🗃️","🗄️","🗂️","📂","📁","🧰","🪤","🪣","🫙","🏺","🗑️","📥","📤",
  // Music Cases
  "🎸","🎹","🥁","🎷","🎻","🎺","🪗","🪘","🪕","🎤","🎙️","🔊","🎧","🎚️","🎛️","📻","🎵","🎶","🎼","🎬",
  // Tool Bags
  "🔧","🪚","🔨","⚒️","🛠️","🪛","🔩","🪝","🧰","🔦","💡","🔋","🔌","📐","📏","⚙️","🧲","🪜","🏗️","🚧",
  // Transport
  "🚐","🚚","🛻","🚜","✈️","🚂","🛳️","🚁","🛺","🛵","🚲","🛴","🏎️","🚗","🚕","🚙","🏍️","🚑","🚒","🛡️",
  // Food & Catering
  "🍱","🧺","🥡","☕","🫖","🍶","🍾","🥂","🍽️","🥢","🫙","🪣","🥗","🍫","🎂","🧁","🍪","🥤","🧃","💧",
  // Office & Tech
  "💻","📱","🖥️","📷","📸","📹","🎥","💾","💿","📀","🖨️","⌨️","🖱️","📡","🔭","🔬","🧪","📋","📝","📌",
  // Outdoor
  "⛺","🏕️","🌲","🧭","🗺️","🏋️","🎣","🏹","🤿","🥊","🎿","🏂","⛷️","🪂","🧗","🏄","🚴","🏊","⚽","🏀",
  // Containers & Storage
  "🪣","🫙","🏺","🗑️","📥","📤","🗃️","🗄️","🗂️","📂","📦","🧳","🛄","🛅","🛋️","🪞","🛏️","🚪","🪟","🧱",
];

const ITEM_EMOJIS = [
  // Tools
  "🔧","🪚","🔨","⚒️","🛠️","🪛","🔩","🪝","🪜","🔦","💡","🔋","🔌","🧲","📐","📏","✂️","🗜️","⚙️","🔑",
  // Music Gear
  "🎸","🎹","🎤","🎷","🎻","🥁","🎺","🪗","🎵","🎙️","🔊","📻","🎧","🎚️","🎛️","🎼","🪘","🪕","🎶","🎬",
  // Electronics
  "💻","📱","🖥️","⌨️","🖱️","📡","📺","💾","💿","📀","📷","📸","📹","🎥","📽️","🎞️","🖨️","🕹️","🤖","🔭",
  // Cables & Power
  "🔌","🔋","🧲","💡","🔦","🕯️","🪔","🔆","📲","☎️","📞","📟","📠","⌚","📡","🔭","🔬","🧪","🧫","🧬",
  // Clothing & PPE
  "👔","👗","🥼","🦺","🧤","🧣","👒","🎩","⛑️","👓","🕶️","🥽","👟","🥾","🧢","🎒","💼","👜","🧳","🪖",
  // Food & Drink
  "☕","🍵","🫖","💧","🥤","🍶","🍾","🥂","🥗","🍱","🧃","🫙","🥡","🍫","🍬","🍭","🧁","🍪","🎂","🥐",
  // Stationery
  "📝","✏️","🖊️","🖋️","📌","📍","📎","🖇️","📋","📄","📃","📑","🗒️","📓","📔","📒","📕","📗","📘","📙",
  // Health & Safety
  "🩹","💊","🩺","🩻","🧬","🧴","🧻","🪥","🧽","🧹","🧺","🗑️","🧯","🚨","⚠️","🔐","🛡️","🪪","🔒","🏥",
  // Outdoor & Sport
  "⛺","🧭","🗺️","🪤","🏋️","🎾","🏀","⚽","🏊","🚴","🧗","🏄","🎣","🏹","🪃","🥊","🎿","🏂","⛷️","🤿",
  // Nature
  "🌿","🌱","🌾","🍀","🌊","🔥","⚡","❄️","🌙","☀️","🌈","🌺","🍄","🦋","🐾","🌻","🪨","🪵","💧","🌍",
  // Misc
  "📦","🗃️","🗄️","🗂️","📂","🧰","🪣","🫧","🪄","🎩","🔮","🧿","🎯","🎲","🎮","🕹️","🧩","♟️","🪀","🎁",
];

// ── Helpers ────────────────────────────────────────────────────────────────
function progressOf(items) {
  if (!items || items.length === 0) return null;
  const checked = items.filter(i => i.checked).length;
  return { checked, total: items.length, pct: Math.round((checked / items.length) * 100) };
}
function allItemsInBag(bag) {
  const direct = bag.items || [];
  const nested = (bag.bags || []).flatMap(b => allItemsInBag(b));
  return [...direct, ...nested];
}
function allItemsInJob(job) {
  return job.bags.flatMap(b => allItemsInBag(b));
}
function accent(color) { return color || FALLBACK_ACCENT; }
function btnTextColor(c) {
  if (!c || c === FALLBACK_ACCENT) return "#f0f0f0";
  if (c === "#111111") return "#fff";
  // Dark colors need white text
  const hex = c.replace("#", "");
  const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
  return (r*0.299 + g*0.587 + b*0.114) > 140 ? "#111" : "#fff";
}

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    plus:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    back:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />,
    camera:<><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" strokeWidth={2} /></>,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />,
    reset: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    edit:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    bag:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />,
  };
  return <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icons[name]}</svg>;
};

// ── Shared UI ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, color = FALLBACK_ACCENT }) {
  return (
    <div style={{ height: 4, background: "#2a2a2a", borderRadius: 2, overflow: "hidden", marginTop: 6 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.4s ease" }} />
    </div>
  );
}

function Badge({ children, color = FALLBACK_ACCENT }) {
  const isBlack = color === "#111111";
  return (
    <span style={{
      background: isBlack ? "#333" : color + "22",
      color: isBlack ? "#aaa" : color,
      fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
      letterSpacing: "0.05em",
      border: `1px solid ${isBlack ? "#444" : color + "55"}`
    }}>
      {children}
    </span>
  );
}

function Modal({ title, onClose, children, accentColor = FALLBACK_ACCENT }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", padding: "24px 20px 44px", borderTop: `3px solid ${accentColor}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 700, color: accentColor, letterSpacing: "0.05em" }}>{title}</span>
          <button onClick={onClose} style={{ background: "#2a2a2a", border: "none", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Color Picker ───────────────────────────────────────────────────────────
function ColorPicker({ value, onChange }) {
  const isNone = value === NO_COLOR || value === null || value === undefined;
  const previewColor = isNone ? FALLBACK_ACCENT : value;
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Accent Color</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {/* None button */}
        <button onClick={() => onChange(NO_COLOR)} title="No color"
          style={{
            width: 34, height: 34, borderRadius: 10,
            background: "#1a1a1a",
            border: isNone ? "3px solid #fff" : "2px solid #444",
            cursor: "pointer", position: "relative",
            boxShadow: isNone ? "0 0 0 2px #666" : "none",
            transition: "all 0.12s", outline: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: isNone ? "#fff" : "#555", fontSize: 14, fontWeight: 700,
          }}>
          ∅
        </button>
        {ACCENT_COLORS.map(c => {
          const selected = !isNone && value === c.value;
          const isBlack = c.value === "#111111";
          const isDark = (() => { const h = c.value.replace("#",""); return (parseInt(h.slice(0,2),16)*0.299+parseInt(h.slice(2,4),16)*0.587+parseInt(h.slice(4,6),16)*0.114) < 100; })();
          return (
            <button key={c.value} onClick={() => onChange(c.value)} title={c.label}
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: isBlack ? "#1e1e1e" : c.value,
                border: selected ? "3px solid #fff" : `2px solid ${isBlack ? "#555" : c.value + "77"}`,
                cursor: "pointer", position: "relative",
                boxShadow: selected ? `0 0 0 2px ${c.value}` : "none",
                transition: "all 0.12s", outline: "none",
              }}>
              {selected && (
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={14} height={14} fill="none" stroke={isDark || isBlack ? "#fff" : "#000"} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/* Live preview */}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, background: "#111", borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ width: 14, height: 14, borderRadius: 4, background: isNone ? "#333" : value, border: isNone ? "1px dashed #555" : "none", flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "#555" }}>{isNone ? "No color" : "Preview:"}</span>
        <div style={{ height: 4, flex: 1, background: "#2a2a2a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: isNone ? "0%" : "60%", background: previewColor, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
        <Badge color={previewColor}>3/5</Badge>
      </div>
    </div>
  );
}

// ── Emoji Picker ───────────────────────────────────────────────────────────
function EmojiPicker({ value, onChange, library, tabs, accentColor = FALLBACK_ACCENT }) {
  const [tab, setTab] = useState(0);
  const tabSize = Math.ceil(library.length / tabs.length);
  const visible = library.slice(tab * tabSize, (tab + 1) * tabSize);
  const isNone = value === NONE_EMOJI;
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Icon</label>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 28, width: 54, height: 54, background: "#111", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${accentColor}`, flexShrink: 0, color: "#555" }}>
          {isNone ? <span style={{ fontSize: 20 }}>∅</span> : value}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => onChange(NONE_EMOJI)}
            style={{ background: isNone ? accentColor + "22" : "#252525", color: isNone ? accentColor : "#777", border: isNone ? `1px solid ${accentColor}66` : "1px solid #333", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            None
          </button>
          <span style={{ fontSize: 13, color: "#444" }}>or tap below</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            style={{ background: tab === i ? accentColor : "#252525", color: tab === i ? btnTextColor(accentColor) : "#777", border: "none", borderRadius: 8, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 5, maxHeight: 190, overflowY: "auto", background: "#111", borderRadius: 12, padding: 8 }}>
        {visible.map((e, i) => (
          <button key={i} onClick={() => onChange(e)}
            style={{ fontSize: 22, background: value === e ? accentColor + "33" : "transparent", border: value === e ? `2px solid ${accentColor}` : "2px solid transparent", borderRadius: 9, padding: "5px 2px", cursor: "pointer", transition: "all 0.12s", lineHeight: 1 }}>
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 10, padding: "11px 14px", color: "#f0f0f0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 10, padding: "11px 14px", color: "#f0f0f0", fontSize: 15, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", icon, color }) {
  const c = color || FALLBACK_ACCENT;
  const styles = {
    primary:   { background: c, color: btnTextColor(c), border: "none" },
    secondary: { background: "#2a2a2a", color: "#ccc", border: "1px solid #333" },
    danger:    { background: "#ff444422", color: "#ff6666", border: "1px solid #ff444444" },
  };
  return (
    <button onClick={onClick} style={{ ...styles[variant], borderRadius: 12, padding: "12px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, letterSpacing: "0.02em", fontFamily: "inherit" }}>
      {icon && <span style={{ opacity: 0.85 }}>{icon}</span>}
      {children}
    </button>
  );
}

function PhotoField({ photo, onChange, label = "Photo (optional)" }) {
  const ref = useRef();
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  }
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</label>
      {photo ? (
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
          <img src={photo} alt="preview" style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
          <button onClick={() => onChange(null)} style={{ position: "absolute", top: 8, right: 8, background: "#000000bb", border: "none", color: "#fff", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>✕ Remove</button>
        </div>
      ) : (
        <button onClick={() => ref.current.click()} style={{ width: "100%", background: "#111", border: "2px dashed #333", borderRadius: 12, padding: "18px", color: "#555", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, boxSizing: "border-box" }}>
          <Icon name="camera" size={18} /> Add photo
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}

// Icon display: shows emoji or neutral dash. Tinted by accent color.
function IconDisplay({ icon, size = 44, fontSize = 24, accentColor, style = {} }) {
  const isEmpty = !icon || icon === NONE_EMOJI;
  const isBlack = accentColor === "#111111";
  const bg = accentColor ? (isBlack ? "#1e1e1e" : accentColor + "22") : "#222";
  const border = accentColor ? `2px solid ${isBlack ? "#444" : accentColor + "44"}` : "2px solid #2a2a2a";
  return (
    <div style={{
      fontSize: isEmpty ? 14 : fontSize,
      width: size, height: size,
      background: bg,
      borderRadius: Math.round(size * 0.27),
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, border, color: "#555",
      ...style
    }}>
      {isEmpty ? "—" : icon}
    </div>
  );
}

function PageHeader({ photo, icon, name, subtitle, onBack, backLabel, rightSlot, accentColor }) {
  const c = accent(accentColor);
  return (
    <div style={{ background: "#151515", borderBottom: `2px solid ${c}55` }}>
      {photo && (
        <div style={{ position: "relative", height: 130, overflow: "hidden" }}>
          <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25), #151515)" }} />
        </div>
      )}
      <div style={{ padding: photo ? "0 20px 16px" : "16px 20px 16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: c, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0, marginBottom: photo ? 8 : 10, fontSize: 13, fontWeight: 600 }}>
          <Icon name="back" size={16} /> {backLabel}
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <IconDisplay icon={icon} size={46} fontSize={26} accentColor={c} style={{ borderRadius: 13 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{subtitle}</div>
            </div>
          </div>
          {rightSlot}
        </div>
      </div>
    </div>
  );
}

// ── JOBS VIEW ──────────────────────────────────────────────────────────────
function JobsView({ data, setData, navigate }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState({ name: "", icon: NONE_EMOJI, color: null, photo: null });
  const JOB_TABS = ["Music","Build","Art","Tech","Events","Sport","Health","Nature","Food"];

  function openAdd() { setForm({ name: "", icon: NONE_EMOJI, color: null, photo: null }); setEditJob(null); setShowAdd(true); }
  function openEdit(job, e) {
    e.stopPropagation();
    setForm({ name: job.name, icon: job.icon ?? NONE_EMOJI, color: job.color || DEFAULT_ACCENT, photo: job.photo || null });
    setEditJob(job); setShowAdd(true);
  }
  function saveJob() {
    if (!form.name.trim()) return;
    if (editJob) {
      setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === editJob.id ? { ...j, ...form, name: form.name.trim() } : j) }));
    } else {
      let s = { ...data };
      let [id, ns] = generateId(s);
      ns.jobs = [...ns.jobs, { id, name: form.name.trim(), icon: form.icon, color: form.color, photo: form.photo, bags: [] }];
      setData(ns);
    }
    setShowAdd(false);
  }
  function deleteJob(id) { setData(d => ({ ...d, jobs: d.jobs.filter(j => j.id !== id) })); }

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ background: "#151515", borderBottom: "1px solid #1e1e1e", padding: "22px 20px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: FALLBACK_ACCENT, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>Kit Manager</div>
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
          const c = accent(job.color);
          const items = allItemsInJob(job);
          const prog = progressOf(items);
          return (
            <div key={job.id} onClick={() => navigate("bags", job.id)}
              style={{ background: "#1a1a1a", borderRadius: 18, marginBottom: 12, border: `1px solid ${c}33`, borderLeft: `4px solid ${c}`, cursor: "pointer", overflow: "hidden" }}>
              {job.photo && (
                <div style={{ height: 90, overflow: "hidden", position: "relative" }}>
                  <img src={job.photo} alt={job.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(26,26,26,0.95))" }} />
                </div>
              )}
              <div style={{ padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <IconDisplay icon={job.icon} size={44} fontSize={24} accentColor={c} />
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700 }}>{job.name}</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{job.bags.length} bag{job.bags.length !== 1 ? "s" : ""} · {items.length} items</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {prog && <Badge color={c}>{prog.checked}/{prog.total}</Badge>}
                    <button onClick={e => openEdit(job, e)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}><Icon name="edit" size={15} /></button>
                    <button onClick={e => { e.stopPropagation(); deleteJob(job.id); }} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 4 }}><Icon name="trash" size={16} /></button>
                  </div>
                </div>
                {prog && <ProgressBar pct={prog.pct} color={prog.pct === 100 ? "#4ade80" : c} />}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "fixed", bottom: 24, right: 20 }}>
        <button onClick={openAdd} style={{ background: FALLBACK_ACCENT, border: "none", borderRadius: 20, padding: "14px 22px", fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 24px ${FALLBACK_ACCENT}66` }}>
          <Icon name="plus" size={18} /> New Job
        </button>
      </div>

      {showAdd && (
        <Modal title={editJob ? "EDIT JOB" : "NEW JOB TYPE"} onClose={() => setShowAdd(false)} accentColor={form.color}>
          <ColorPicker value={form.color} onChange={v => setForm(f => ({ ...f, color: v }))} />
          <EmojiPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} library={JOB_EMOJIS} tabs={JOB_TABS} accentColor={form.color} />
          <Input label="Job Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Music Gig, Carpentry" />
          <PhotoField photo={form.photo} onChange={v => setForm(f => ({ ...f, photo: v }))} label="Cover Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveJob} icon={<Icon name="check" size={16} />} color={form.color}>{editJob ? "Save Changes" : "Create Job"}</Btn>
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
  const [showAdd, setShowAdd] = useState(false);
  const [editBag, setEditBag] = useState(null);
  const [form, setForm] = useState({ name: "", icon: NONE_EMOJI, color: null, photo: null });
  const [showReset, setShowReset] = useState(false);
  const [showEditJob, setShowEditJob] = useState(false);
  const [jobEditForm, setJobEditForm] = useState({ name: "", icon: NONE_EMOJI, color: null, photo: null });

  const BAG_TABS = ["Bags","Music","Tools","Transport","Food","Office","Outdoor","Storage"];
  const JOB_TABS = ["Music","Build","Art","Tech","Events","Sport","Health","Nature","Food"];

  if (!job) return null;
  const jobColor = accent(job.color);

  function saveEditJob() {
    if (!jobEditForm.name.trim()) return;
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === jobId ? { ...j, ...jobEditForm, name: jobEditForm.name.trim() } : j) }));
    setShowEditJob(false);
  }
  function openAdd() { setForm({ name: "", icon: NONE_EMOJI, color: null, photo: null }); setEditBag(null); setShowAdd(true); }
  function openEdit(bag, e) {
    e.stopPropagation();
    setForm({ name: bag.name, icon: bag.icon ?? NONE_EMOJI, color: bag.color || DEFAULT_ACCENT, photo: bag.photo || null });
    setEditBag(bag); setShowAdd(true);
  }
  function saveBag() {
    if (!form.name.trim()) return;
    if (editBag) {
      setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, bags: j.bags.map(b => b.id === editBag.id ? { ...b, ...form, name: form.name.trim() } : b) }) }));
    } else {
      setData(d => {
        let s = { ...d };
        let [id, ns] = generateId(s);
        ns.jobs = ns.jobs.map(j => j.id === jobId ? { ...j, bags: [...j.bags, { id, name: form.name.trim(), icon: form.icon, color: form.color, photo: form.photo, items: [], bags: [] }] } : j);
        return ns;
      });
    }
    setShowAdd(false);
  }
  function deleteBag(bagId) {
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === jobId ? { ...j, bags: j.bags.filter(b => b.id !== bagId) } : j) }));
  }
  function resetBagRecursive(bag) {
    return { ...bag, items: bag.items.map(i => ({ ...i, checked: false })), bags: (bag.bags || []).map(resetBagRecursive) };
  }
  function resetAll() {
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, bags: j.bags.map(resetBagRecursive) }) }));
    setShowReset(false);
  }

  const allItems = allItemsInJob(job);
  const prog = progressOf(allItems);

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        photo={job.photo} icon={job.icon} name={job.name}
        subtitle={`${job.bags.length} bags · ${allItems.length} total items`}
        onBack={() => navigate("jobs")} backLabel="All Jobs" accentColor={jobColor}
        rightSlot={
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setJobEditForm({ name: job.name, icon: job.icon ?? NONE_EMOJI, color: job.color || DEFAULT_ACCENT, photo: job.photo || null }); setShowEditJob(true); }}
              style={{ background: "#222", border: "1px solid #333", borderRadius: 10, padding: "8px 12px", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <Icon name="edit" size={14} /> Edit
            </button>
            {prog && (
              <button onClick={() => setShowReset(true)} style={{ background: "#222", border: "1px solid #333", borderRadius: 10, padding: "8px 12px", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <Icon name="reset" size={14} /> Reset
              </button>
            )}
          </div>
        }
      />
      {prog && (
        <div style={{ padding: "8px 20px 12px", background: "#151515", borderBottom: "1px solid #1e1e1e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555", marginBottom: 4 }}>
            <span>Overall progress</span><span style={{ color: jobColor, fontWeight: 700 }}>{prog.pct}%</span>
          </div>
          <ProgressBar pct={prog.pct} color={prog.pct === 100 ? "#4ade80" : jobColor} />
        </div>
      )}

      <div style={{ padding: "16px 16px 110px" }}>
        {job.bags.length === 0 && (
          <div style={{ textAlign: "center", padding: "70px 20px", color: "#444" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🎒</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#555" }}>No bags yet</div>
            <div style={{ fontSize: 14, marginTop: 6 }}>Add bags, cases, or kit containers</div>
          </div>
        )}
        {job.bags.map(bag => {
          const c = accent(bag.color);
          const allBagItems = allItemsInBag(bag);
          const bp = progressOf(allBagItems);
          const subCount = (bag.bags || []).length;
          return (
            <div key={bag.id} onClick={() => navigate("items", jobId, bag.id)}
              style={{ background: "#1a1a1a", borderRadius: 18, marginBottom: 12, border: `1px solid ${c}33`, borderLeft: `4px solid ${c}`, cursor: "pointer", overflow: "hidden" }}>
              {bag.photo && (
                <div style={{ height: 75, overflow: "hidden", position: "relative" }}>
                  <img src={bag.photo} alt={bag.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(26,26,26,0.95))" }} />
                </div>
              )}
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <IconDisplay icon={bag.icon} size={40} fontSize={22} accentColor={c} style={{ borderRadius: 11 }} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{bag.name}</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                        {subCount > 0 && <>{subCount} sub-bag{subCount !== 1 ? "s" : ""} · </>}
                        {(bag.items || []).length} item{(bag.items || []).length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {bp && <Badge color={c}>{bp.checked}/{bp.total}</Badge>}
                    <button onClick={e => openEdit(bag, e)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}><Icon name="edit" size={15} /></button>
                    <button onClick={e => { e.stopPropagation(); deleteBag(bag.id); }} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 4 }}><Icon name="trash" size={16} /></button>
                  </div>
                </div>
                {bp && <ProgressBar pct={bp.pct} color={bp.pct === 100 ? "#4ade80" : c} />}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "fixed", bottom: 24, right: 20 }}>
        <button onClick={openAdd} style={{ background: jobColor, border: "none", borderRadius: 20, padding: "14px 22px", fontSize: 15, fontWeight: 800, color: btnTextColor(jobColor), cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 24px ${jobColor}66` }}>
          <Icon name="plus" size={18} /> Add Bag
        </button>
      </div>

      {showAdd && (
        <Modal title={editBag ? "EDIT BAG" : "ADD BAG / CASE"} onClose={() => setShowAdd(false)} accentColor={form.color}>
          <ColorPicker value={form.color} onChange={v => setForm(f => ({ ...f, color: v }))} />
          <EmojiPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} library={BAG_EMOJIS} tabs={BAG_TABS} accentColor={form.color} />
          <Input label="Bag / Case Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Guitar Case, Tool Belt" />
          <PhotoField photo={form.photo} onChange={v => setForm(f => ({ ...f, photo: v }))} label="Cover Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveBag} icon={<Icon name="check" size={16} />} color={form.color}>{editBag ? "Save Changes" : "Add Bag"}</Btn>
            <Btn onClick={() => setShowAdd(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
      )}
      {showReset && (
        <Modal title="RESET CHECKLIST?" onClose={() => setShowReset(false)} accentColor={jobColor}>
          <p style={{ color: "#aaa", fontSize: 15, marginBottom: 20 }}>This will uncheck all items in <strong style={{ color: "#fff" }}>{job.name}</strong>. Ready for your next job?</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={resetAll} icon={<Icon name="reset" size={16} />} color={jobColor}>Yes, Reset All</Btn>
            <Btn onClick={() => setShowReset(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
      )}
      {showEditJob && (
        <Modal title="EDIT JOB" onClose={() => setShowEditJob(false)} accentColor={jobEditForm.color}>
          <ColorPicker value={jobEditForm.color} onChange={v => setJobEditForm(f => ({ ...f, color: v }))} />
          <EmojiPicker value={jobEditForm.icon} onChange={v => setJobEditForm(f => ({ ...f, icon: v }))} library={JOB_EMOJIS} tabs={JOB_TABS} accentColor={jobEditForm.color} />
          <Input label="Job Name" value={jobEditForm.name} onChange={v => setJobEditForm(f => ({ ...f, name: v }))} placeholder="e.g. Music Gig, Carpentry" />
          <PhotoField photo={jobEditForm.photo} onChange={v => setJobEditForm(f => ({ ...f, photo: v }))} label="Cover Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveEditJob} icon={<Icon name="check" size={16} />} color={jobEditForm.color}>Save Changes</Btn>
            <Btn onClick={() => setShowEditJob(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── ITEMS VIEW ─────────────────────────────────────────────────────────────
function ItemsView({ data, setData, jobId, bagId, navigate }) {
  const job = data.jobs.find(j => j.id === jobId);

  function findBag(bags, id) {
    for (const b of bags) {
      if (b.id === id) return b;
      const found = findBag(b.bags || [], id);
      if (found) return found;
    }
    return null;
  }
  function findParentBagId(bags, targetId) {
    for (const b of bags) {
      if ((b.bags || []).some(sb => sb.id === targetId)) return b.id;
      const found = findParentBagId(b.bags || [], targetId);
      if (found !== undefined) return found;
    }
    return undefined;
  }
  function updateBagInTree(bags, id, updater) {
    return bags.map(b => b.id === id ? updater(b) : { ...b, bags: updateBagInTree(b.bags || [], id, updater) });
  }
  function deleteBagFromTree(bags, id) {
    return bags.filter(b => b.id !== id).map(b => ({ ...b, bags: deleteBagFromTree(b.bags || [], id) }));
  }

  const bag = job ? findBag(job.bags, bagId) : null;
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddBag, setShowAddBag] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editBag, setEditBag] = useState(null);
  const [itemForm, setItemForm] = useState({ name: "", emoji: NONE_EMOJI, color: null, qty: 1, notes: "", photo: null });
  const [bagForm, setBagForm] = useState({ name: "", icon: NONE_EMOJI, color: null, photo: null });

  const ITEM_TABS = ["Tools","Music","Electronics","Clothing","Food","Stationery","Health","Sport","Nature","Other"];
  const BAG_TABS  = ["Bags","Music","Tools","Transport","Food","Office","Outdoor","Storage"];

  if (!job || !bag) return null;
  const bagColor = accent(bag.color);
  const parentBagId = findParentBagId(job.bags, bagId);

  function goBack() {
    if (parentBagId != null) navigate("items", jobId, parentBagId);
    else navigate("bags", jobId);
  }
  function updateThisBag(updater) {
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, bags: updateBagInTree(j.bags, bagId, updater) }) }));
  }

  function openAddItem() { setItemForm({ name: "", emoji: NONE_EMOJI, color: null, qty: 1, notes: "", photo: null }); setEditItem(null); setShowAddItem(true); }
  function openEditItem(item, e) {
    e.stopPropagation();
    setItemForm({ name: item.name, emoji: item.emoji ?? NONE_EMOJI, color: item.color || DEFAULT_ACCENT, qty: item.qty, notes: item.notes || "", photo: item.photo || null });
    setEditItem(item); setShowAddItem(true);
  }
  function saveItem() {
    if (!itemForm.name.trim()) return;
    if (editItem) {
      updateThisBag(b => ({ ...b, items: b.items.map(i => i.id === editItem.id ? { ...i, ...itemForm, name: itemForm.name.trim() } : i) }));
    } else {
      setData(d => {
        let s = { ...d };
        let [id, ns] = generateId(s);
        ns.jobs = ns.jobs.map(j => j.id !== jobId ? j : {
          ...j, bags: updateBagInTree(j.bags, bagId, b => ({
            ...b, items: [...(b.items || []), { id, name: itemForm.name.trim(), emoji: itemForm.emoji, color: itemForm.color, qty: itemForm.qty, notes: itemForm.notes, photo: itemForm.photo, checked: false }]
          }))
        });
        return ns;
      });
    }
    setShowAddItem(false);
  }
  function deleteItem(itemId) { updateThisBag(b => ({ ...b, items: b.items.filter(i => i.id !== itemId) })); }
  function toggleCheck(itemId) { updateThisBag(b => ({ ...b, items: b.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i) })); }

  function openAddBag() { setBagForm({ name: "", icon: NONE_EMOJI, color: null, photo: null }); setEditBag(null); setShowAddBag(true); }
  function openEditBag(subBag, e) {
    e.stopPropagation();
    setBagForm({ name: subBag.name, icon: subBag.icon ?? NONE_EMOJI, color: subBag.color || DEFAULT_ACCENT, photo: subBag.photo || null });
    setEditBag(subBag); setShowAddBag(true);
  }
  function saveSubBag() {
    if (!bagForm.name.trim()) return;
    if (editBag) {
      setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, bags: updateBagInTree(j.bags, editBag.id, b => ({ ...b, ...bagForm, name: bagForm.name.trim() })) }) }));
    } else {
      setData(d => {
        let s = { ...d };
        let [id, ns] = generateId(s);
        ns.jobs = ns.jobs.map(j => j.id !== jobId ? j : {
          ...j, bags: updateBagInTree(j.bags, bagId, b => ({
            ...b, bags: [...(b.bags || []), { id, name: bagForm.name.trim(), icon: bagForm.icon, color: bagForm.color, photo: bagForm.photo, items: [], bags: [] }]
          }))
        });
        return ns;
      });
    }
    setShowAddBag(false);
  }
  function deleteSubBag(subBagId) {
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, bags: updateBagInTree(j.bags, bagId, b => ({ ...b, bags: deleteBagFromTree(b.bags || [], subBagId) })) }) }));
  }

  const allBagItems = allItemsInBag(bag);
  const prog = progressOf(allBagItems);
  const subBags = bag.bags || [];
  const items = bag.items || [];

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        photo={bag.photo} icon={bag.icon} name={bag.name}
        subtitle={prog ? (prog.checked === prog.total ? "✓ All packed!" : `${prog.checked} of ${prog.total} packed`) : "Empty"}
        onBack={goBack} backLabel={parentBagId != null ? (findBag(job.bags, parentBagId)?.name ?? job.name) : job.name}
        accentColor={bagColor}
      />
      {prog && (
        <div style={{ padding: "8px 20px 12px", background: "#151515", borderBottom: "1px solid #1e1e1e" }}>
          <ProgressBar pct={prog.pct} color={prog.pct === 100 ? "#4ade80" : bagColor} />
        </div>
      )}

      <div style={{ padding: "12px 16px 130px" }}>
        {subBags.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 2 }}>Sub-bags</div>
            {subBags.map(subBag => {
              const sc = accent(subBag.color);
              const allSub = allItemsInBag(subBag);
              const sbp = progressOf(allSub);
              return (
                <div key={subBag.id} onClick={() => navigate("items", jobId, subBag.id)}
                  style={{ background: "#1a1a1a", borderRadius: 16, marginBottom: 10, border: `1px solid ${sc}33`, borderLeft: `4px solid ${sc}`, cursor: "pointer", overflow: "hidden" }}>
                  {subBag.photo && (
                    <div style={{ height: 60, overflow: "hidden", position: "relative" }}>
                      <img src={subBag.photo} alt={subBag.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 10%, rgba(26,26,26,0.95))" }} />
                    </div>
                  )}
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <IconDisplay icon={subBag.icon} size={36} fontSize={20} accentColor={sc} style={{ borderRadius: 10 }} />
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{subBag.name}</div>
                          <div style={{ fontSize: 12, color: "#555", marginTop: 1 }}>
                            {(subBag.bags || []).length > 0 && <>{(subBag.bags || []).length} sub-bag{(subBag.bags || []).length !== 1 ? "s" : ""} · </>}
                            {(subBag.items || []).length} item{(subBag.items || []).length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        {sbp && <Badge color={sc}>{sbp.checked}/{sbp.total}</Badge>}
                        <button onClick={e => openEditBag(subBag, e)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}><Icon name="edit" size={14} /></button>
                        <button onClick={e => { e.stopPropagation(); deleteSubBag(subBag.id); }} style={{ background: "none", border: "none", color: "#3a3a3a", cursor: "pointer", padding: 4 }}><Icon name="trash" size={14} /></button>
                      </div>
                    </div>
                    {sbp && <ProgressBar pct={sbp.pct} color={sbp.pct === 100 ? "#4ade80" : sc} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(subBags.length > 0 || items.length > 0) && (
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 2, marginTop: subBags.length > 0 ? 12 : 0 }}>Items</div>
        )}

        {items.length === 0 && subBags.length === 0 && (
          <div style={{ textAlign: "center", padding: "70px 20px", color: "#444" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📦</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#555" }}>Empty bag</div>
            <div style={{ fontSize: 14, marginTop: 6 }}>Add items or nested sub-bags below</div>
          </div>
        )}

        {items.map(item => {
          const ic = accent(item.color);
          return (
            <div key={item.id} style={{ background: item.checked ? "#181818" : "#1e1e1e", borderRadius: 14, marginBottom: 10, border: `1px solid ${item.checked ? "#222" : ic + "33"}`, borderLeft: `4px solid ${item.checked ? "#2a2a2a" : ic}`, overflow: "hidden", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "12px 12px 12px 0" }}>
                <button onClick={() => toggleCheck(item.id)} style={{ minWidth: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${item.checked ? "#4ade80" : ic}`, background: item.checked ? "#4ade8022" : ic + "18", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                    {item.checked && <Icon name="check" size={15} />}
                  </div>
                </button>

                {item.photo ? (
                  <div style={{ width: 46, height: 46, borderRadius: 10, overflow: "hidden", marginRight: 12, flexShrink: 0, opacity: item.checked ? 0.45 : 1 }}>
                    <img src={item.photo} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <IconDisplay icon={item.emoji} size={44} fontSize={26} accentColor={item.checked ? undefined : ic} style={{ marginRight: 10, borderRadius: 11, opacity: item.checked ? 0.35 : 1, transition: "opacity 0.2s", border: "none" }} />
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: item.checked ? "#555" : "#f0f0f0", textDecoration: item.checked ? "line-through" : "none", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
                    {item.photo && item.emoji && item.emoji !== NONE_EMOJI && <span style={{ fontSize: 15, opacity: item.checked ? 0.5 : 1 }}>{item.emoji}</span>}
                    {item.name}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                    {item.qty > 1 && <Badge color={ic}>×{item.qty}</Badge>}
                    {item.notes && <span style={{ fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 155 }}>{item.notes}</span>}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 6 }}>
                  <button onClick={e => openEditItem(item, e)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}><Icon name="edit" size={15} /></button>
                  <button onClick={() => deleteItem(item.id)} style={{ background: "none", border: "none", color: "#3a3a3a", cursor: "pointer", padding: 4 }}><Icon name="trash" size={15} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "fixed", bottom: 24, right: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
        <button onClick={openAddBag} style={{ background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: 20, padding: "12px 18px", fontSize: 14, fontWeight: 700, color: "#ccc", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
          <Icon name="bag" size={16} /> Add Sub-bag
        </button>
        <button onClick={openAddItem} style={{ background: bagColor, border: "none", borderRadius: 20, padding: "14px 22px", fontSize: 15, fontWeight: 800, color: btnTextColor(bagColor), cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 24px ${bagColor}66` }}>
          <Icon name="plus" size={18} /> Add Item
        </button>
      </div>

      {showAddItem && (
        <Modal title={editItem ? "EDIT ITEM" : "ADD EQUIPMENT"} onClose={() => setShowAddItem(false)} accentColor={itemForm.color}>
          <ColorPicker value={itemForm.color} onChange={v => setItemForm(f => ({ ...f, color: v }))} />
          <EmojiPicker value={itemForm.emoji} onChange={v => setItemForm(f => ({ ...f, emoji: v }))} library={ITEM_EMOJIS} tabs={ITEM_TABS} accentColor={itemForm.color} />
          <Input label="Item Name" value={itemForm.name} onChange={v => setItemForm(f => ({ ...f, name: v }))} placeholder="e.g. Guitar tuner, Hammer" />
          <Input label="Quantity" value={itemForm.qty} onChange={v => setItemForm(f => ({ ...f, qty: parseInt(v) || 1 }))} type="number" placeholder="1" />
          <Textarea label="Notes (optional)" value={itemForm.notes} onChange={v => setItemForm(f => ({ ...f, notes: v }))} placeholder="e.g. Check battery, stored in side pocket" />
          <PhotoField photo={itemForm.photo} onChange={v => setItemForm(f => ({ ...f, photo: v }))} label="Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveItem} icon={<Icon name="check" size={16} />} color={itemForm.color}>{editItem ? "Save Changes" : "Add Item"}</Btn>
            <Btn onClick={() => setShowAddItem(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
      )}

      {showAddBag && (
        <Modal title={editBag ? "EDIT SUB-BAG" : "ADD SUB-BAG"} onClose={() => setShowAddBag(false)} accentColor={bagForm.color}>
          <ColorPicker value={bagForm.color} onChange={v => setBagForm(f => ({ ...f, color: v }))} />
          <EmojiPicker value={bagForm.icon} onChange={v => setBagForm(f => ({ ...f, icon: v }))} library={BAG_EMOJIS} tabs={BAG_TABS} accentColor={bagForm.color} />
          <Input label="Sub-bag Name" value={bagForm.name} onChange={v => setBagForm(f => ({ ...f, name: v }))} placeholder="e.g. Front Pocket, Accessories Pouch" />
          <PhotoField photo={bagForm.photo} onChange={v => setBagForm(f => ({ ...f, photo: v }))} label="Cover Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveSubBag} icon={<Icon name="check" size={16} />} color={bagForm.color}>{editBag ? "Save Changes" : "Add Sub-bag"}</Btn>
            <Btn onClick={() => setShowAddBag(false)} variant="secondary">Cancel</Btn>
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

  if (view.name === "jobs")  return <JobsView  data={data} setData={setData} navigate={navigate} />;
  if (view.name === "bags")  return <BagsView  data={data} setData={setData} jobId={view.jobId} navigate={navigate} />;
  if (view.name === "items") return <ItemsView data={data} setData={setData} jobId={view.jobId} bagId={view.bagId} navigate={navigate} />;
  return null;
}
