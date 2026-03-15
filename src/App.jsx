import React, { useState, useRef, useEffect } from "react";

const STORAGE_KEY = "equipment-checklist-data";
const initialData = { jobs: [], nextId: 1 };

function generateId(state) {
  const id = state.nextId;
  return [id, { ...state, nextId: id + 1 }];
}

// ── Emoji Libraries ────────────────────────────────────────────────────────
const NONE_EMOJI = "";   // sentinel for "no icon"

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
  // Colors (solid square swatches)
  "🖤","🤍","🩶","🩷","❤️","🧡","💛","💚","💙","💜","🟥","🟧","🟨","🟩","🟦","🟪","🟫","⬛","⬜","🔲",
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
  // Colors
  "🖤","🤍","🩶","🩷","❤️","🧡","💛","💚","💙","💜","🟥","🟧","🟨","🟩","🟦","🟪","🟫","⬛","⬜","🔲",
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
  // Misc
  "📦","🗃️","🗄️","🗂️","📂","🧰","🪣","🫧","🪄","🎩","🔮","🧿","🎯","🎲","🎮","🕹️","🧩","♟️","🪀","🎁",
  // Nature
  "🌿","🌱","🌾","🍀","🌊","🔥","⚡","❄️","🌙","☀️","🌈","🌺","🍄","🦋","🐾","🌻","🪨","🪵","💧","🌍",
  // Colors
  "🖤","🤍","🩶","🩷","❤️","🧡","💛","💚","💙","💜","🟥","🟧","🟨","🟩","🟦","🟪","🟫","⬛","⬜","🔲",
];

// ── Helpers ────────────────────────────────────────────────────────────────
function progressOf(items) {
  if (!items || items.length === 0) return null;
  const checked = items.filter(i => i.checked).length;
  return { checked, total: items.length, pct: Math.round((checked / items.length) * 100) };
}

// Recursively collect all items from a bag (including nested bags)
function allItemsInBag(bag) {
  const direct = bag.items || [];
  const nested = (bag.bags || []).flatMap(b => allItemsInBag(b));
  return [...direct, ...nested];
}

function allItemsInJob(job) {
  return job.bags.flatMap(b => allItemsInBag(b));
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
    bag: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />,
  };
  return <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icons[name]}</svg>;
};

// ── Shared UI Components ───────────────────────────────────────────────────
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

// ── Emoji Picker with "None" option ───────────────────────────────────────
function EmojiPicker({ value, onChange, library, tabs }) {
  const [tab, setTab] = useState(0);
  const tabSize = Math.ceil(library.length / tabs.length);
  const visible = library.slice(tab * tabSize, (tab + 1) * tabSize);
  const isNone = value === NONE_EMOJI;

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Icon</label>
      {/* Current pick + None toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{
          fontSize: 28, width: 54, height: 54, background: "#111", borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid #E8C547", flexShrink: 0, color: "#555"
        }}>
          {isNone ? <span style={{ fontSize: 20 }}>∅</span> : value}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onChange(NONE_EMOJI)}
            style={{
              background: isNone ? "#E8C54722" : "#252525",
              color: isNone ? "#E8C547" : "#777",
              border: isNone ? "1px solid #E8C54766" : "1px solid #333",
              borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}
          >
            None
          </button>
          <span style={{ fontSize: 13, color: "#444", alignSelf: "center" }}>or tap an icon below</span>
        </div>
      </div>
      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ background: tab === i ? "#E8C547" : "#252525", color: tab === i ? "#111" : "#777", border: "none", borderRadius: 8, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>{t}</button>
        ))}
      </div>
      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 5, maxHeight: 190, overflowY: "auto", background: "#111", borderRadius: 12, padding: 8 }}>
        {visible.map((e, i) => (
          <button key={i} onClick={() => onChange(e)} style={{ fontSize: 22, background: value === e ? "#E8C54733" : "transparent", border: value === e ? "2px solid #E8C547" : "2px solid transparent", borderRadius: 9, padding: "5px 2px", cursor: "pointer", transition: "all 0.12s", lineHeight: 1 }}>{e}</button>
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

// Icon display helper — renders the emoji or a neutral fallback
function IconDisplay({ icon, size = 44, fontSize = 24, style = {} }) {
  const isEmpty = !icon || icon === NONE_EMOJI;
  return (
    <div style={{
      fontSize: isEmpty ? 14 : fontSize,
      width: size, height: size,
      background: "#222", borderRadius: Math.round(size * 0.27),
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, border: "2px solid #2a2a2a", color: "#444",
      ...style
    }}>
      {isEmpty ? "—" : icon}
    </div>
  );
}

// Shared header with optional cover photo
function PageHeader({ photo, icon, name, subtitle, onBack, backLabel, rightSlot }) {
  return (
    <div style={{ background: "#151515", borderBottom: "1px solid #1e1e1e" }}>
      {photo && (
        <div style={{ position: "relative", height: 130, overflow: "hidden" }}>
          <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25), #151515)" }} />
        </div>
      )}
      <div style={{ padding: photo ? "0 20px 16px" : "16px 20px 16px", position: "relative" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#E8C547", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0, marginBottom: photo ? 8 : 10, fontSize: 13, fontWeight: 600 }}>
          <Icon name="back" size={16} /> {backLabel}
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <IconDisplay icon={icon} size={46} fontSize={26} style={{ borderRadius: 13 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
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
  const [form, setForm] = useState({ name: "", icon: NONE_EMOJI, photo: null });

  const JOB_TABS = ["Music","Build","Art","Tech","Events","Sport","Health","Nature","Food","Colors"];

  function openAdd() { setForm({ name: "", icon: NONE_EMOJI, photo: null }); setEditJob(null); setShowAdd(true); }
  function openEdit(job, e) {
    e.stopPropagation();
    setForm({ name: job.name, icon: job.icon ?? NONE_EMOJI, photo: job.photo || null });
    setEditJob(job);
    setShowAdd(true);
  }

  function saveJob() {
    if (!form.name.trim()) return;
    if (editJob) {
      setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === editJob.id ? { ...j, name: form.name.trim(), icon: form.icon, photo: form.photo } : j) }));
    } else {
      let s = { ...data };
      let [id, ns] = generateId(s);
      ns.jobs = [...ns.jobs, { id, name: form.name.trim(), icon: form.icon, photo: form.photo, bags: [] }];
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
          return (
            <div key={job.id} onClick={() => navigate("bags", job.id)} style={{ background: "#1a1a1a", borderRadius: 18, marginBottom: 12, border: "1px solid #252525", cursor: "pointer", overflow: "hidden" }}>
              {job.photo && (
                <div style={{ height: 90, overflow: "hidden", position: "relative" }}>
                  <img src={job.photo} alt={job.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(26,26,26,0.95))" }} />
                </div>
              )}
              <div style={{ padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <IconDisplay icon={job.icon} size={44} fontSize={24} />
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700 }}>{job.name}</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{job.bags.length} bag{job.bags.length !== 1 ? "s" : ""} · {items.length} items</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {prog && <Badge>{prog.checked}/{prog.total}</Badge>}
                    <button onClick={e => openEdit(job, e)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}>
                      <Icon name="edit" size={15} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); deleteJob(job.id); }} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 4 }}>
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>
                {prog && <ProgressBar pct={prog.pct} />}
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
  const [showAdd, setShowAdd] = useState(false);
  const [editBag, setEditBag] = useState(null);
  const [form, setForm] = useState({ name: "", icon: NONE_EMOJI, photo: null });
  const [showReset, setShowReset] = useState(false);
  const [showEditJob, setShowEditJob] = useState(false);
  const [jobEditForm, setJobEditForm] = useState({ name: "", icon: NONE_EMOJI, photo: null });

  const BAG_TABS = ["Bags","Music","Tools","Transport","Food","Office","Outdoor","Colors"];
  const JOB_TABS_B = ["Music","Build","Art","Tech","Events","Sport","Health","Nature","Food","Colors"];

  if (!job) return null;

  function saveEditJob() {
    if (!jobEditForm.name.trim()) return;
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === jobId ? { ...j, name: jobEditForm.name.trim(), icon: jobEditForm.icon, photo: jobEditForm.photo } : j) }));
    setShowEditJob(false);
  }

  function openAdd() { setForm({ name: "", icon: NONE_EMOJI, photo: null }); setEditBag(null); setShowAdd(true); }
  function openEdit(bag, e) {
    e.stopPropagation();
    setForm({ name: bag.name, icon: bag.icon ?? NONE_EMOJI, photo: bag.photo || null });
    setEditBag(bag);
    setShowAdd(true);
  }

  function saveBag() {
    if (!form.name.trim()) return;
    if (editBag) {
      setData(d => ({ ...d, jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, bags: j.bags.map(b => b.id === editBag.id ? { ...b, name: form.name.trim(), icon: form.icon, photo: form.photo } : b) }) }));
    } else {
      setData(d => {
        let s = { ...d };
        let [id, ns] = generateId(s);
        ns.jobs = ns.jobs.map(j => j.id === jobId ? { ...j, bags: [...j.bags, { id, name: form.name.trim(), icon: form.icon, photo: form.photo, items: [], bags: [] }] } : j);
        return ns;
      });
    }
    setShowAdd(false);
  }

  function deleteBag(bagId) {
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === jobId ? { ...j, bags: j.bags.filter(b => b.id !== bagId) } : j) }));
  }

  function resetBagRecursive(bag) {
    return {
      ...bag,
      items: bag.items.map(i => ({ ...i, checked: false })),
      bags: (bag.bags || []).map(resetBagRecursive),
    };
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
        onBack={() => navigate("jobs")} backLabel="All Jobs"
        rightSlot={
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setJobEditForm({ name: job.name, icon: job.icon ?? NONE_EMOJI, photo: job.photo || null }); setShowEditJob(true); }} style={{ background: "#222", border: "1px solid #333", borderRadius: 10, padding: "8px 12px", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, flexShrink: 0 }}>
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
          <ProgressBar pct={prog.pct} />
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
          const allBagItems = allItemsInBag(bag);
          const bp = progressOf(allBagItems);
          const subBagCount = (bag.bags || []).length;
          return (
            <div key={bag.id} onClick={() => navigate("items", jobId, bag.id)} style={{ background: "#1a1a1a", borderRadius: 18, marginBottom: 12, border: "1px solid #252525", cursor: "pointer", overflow: "hidden" }}>
              {bag.photo && (
                <div style={{ height: 75, overflow: "hidden", position: "relative" }}>
                  <img src={bag.photo} alt={bag.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(26,26,26,0.95))" }} />
                </div>
              )}
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <IconDisplay icon={bag.icon} size={40} fontSize={22} style={{ borderRadius: 11 }} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{bag.name}</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                        {subBagCount > 0 && <span>{subBagCount} sub-bag{subBagCount !== 1 ? "s" : ""} · </span>}
                        {(bag.items || []).length} item{(bag.items || []).length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {bp && <Badge>{bp.checked}/{bp.total}</Badge>}
                    <button onClick={e => openEdit(bag, e)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}>
                      <Icon name="edit" size={15} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); deleteBag(bag.id); }} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 4 }}>
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>
                {bp && <ProgressBar pct={bp.pct} />}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "fixed", bottom: 24, right: 20 }}>
        <button onClick={openAdd} style={{ background: "#E8C547", border: "none", borderRadius: 20, padding: "14px 22px", fontSize: 15, fontWeight: 800, color: "#111", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 24px rgba(232,197,71,0.45)" }}>
          <Icon name="plus" size={18} /> Add Bag
        </button>
      </div>

      {showAdd && (
        <Modal title={editBag ? "EDIT BAG" : "ADD BAG / CASE"} onClose={() => setShowAdd(false)}>
          <EmojiPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} library={BAG_EMOJIS} tabs={BAG_TABS} />
          <Input label="Bag / Case Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Guitar Case, Tool Belt" />
          <PhotoField photo={form.photo} onChange={v => setForm(f => ({ ...f, photo: v }))} label="Cover Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveBag} icon={<Icon name="check" size={16} />}>{editBag ? "Save Changes" : "Add Bag"}</Btn>
            <Btn onClick={() => setShowAdd(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
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

// ── ITEMS VIEW (now also handles nested bags) ─────────────────────────────
function ItemsView({ data, setData, jobId, bagId, navigate }) {
  const job = data.jobs.find(j => j.id === jobId);

  // Find a bag anywhere in the tree (recursive)
  function findBag(bags, id) {
    for (const b of bags) {
      if (b.id === id) return b;
      const found = findBag(b.bags || [], id);
      if (found) return found;
    }
    return null;
  }

  // Find parent bag id (null = top-level under job)
  function findParentBagId(bags, targetId) {
    for (const b of bags) {
      if ((b.bags || []).some(sb => sb.id === targetId)) return b.id;
      const found = findParentBagId(b.bags || [], targetId);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  // Update a bag anywhere in the tree
  function updateBagInTree(bags, id, updater) {
    return bags.map(b => {
      if (b.id === id) return updater(b);
      return { ...b, bags: updateBagInTree(b.bags || [], id, updater) };
    });
  }

  // Delete a bag anywhere in the tree
  function deleteBagFromTree(bags, id) {
    return bags
      .filter(b => b.id !== id)
      .map(b => ({ ...b, bags: deleteBagFromTree(b.bags || [], id) }));
  }

  const bag = job ? findBag(job.bags, bagId) : null;

  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddBag, setShowAddBag] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editBag, setEditBag] = useState(null);
  const [itemForm, setItemForm] = useState({ name: "", emoji: NONE_EMOJI, qty: 1, notes: "", photo: null });
  const [bagForm, setBagForm] = useState({ name: "", icon: NONE_EMOJI, photo: null });

  const ITEM_TABS = ["Tools","Music","Electronics","Clothing","Food","Stationery","Health","Sport","Nature","Colors","Other"];
  const BAG_TABS = ["Bags","Music","Tools","Transport","Food","Office","Outdoor","Colors"];

  if (!job || !bag) return null;

  // Determine back navigation
  const parentBagId = findParentBagId(job.bags, bagId);
  function goBack() {
    if (parentBagId != null) navigate("items", jobId, parentBagId);
    else navigate("bags", jobId);
  }

  function updateThisBag(updater) {
    setData(d => ({
      ...d,
      jobs: d.jobs.map(j => j.id !== jobId ? j : {
        ...j,
        bags: updateBagInTree(j.bags, bagId, updater)
      })
    }));
  }

  // ── Items ──
  function openAddItem() { setItemForm({ name: "", emoji: NONE_EMOJI, qty: 1, notes: "", photo: null }); setEditItem(null); setShowAddItem(true); }
  function openEditItem(item, e) {
    e.stopPropagation();
    setItemForm({ name: item.name, emoji: item.emoji ?? NONE_EMOJI, qty: item.qty, notes: item.notes || "", photo: item.photo || null });
    setEditItem(item);
    setShowAddItem(true);
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
          ...j,
          bags: updateBagInTree(j.bags, bagId, b => ({
            ...b, items: [...(b.items || []), { id, name: itemForm.name.trim(), emoji: itemForm.emoji, qty: itemForm.qty, notes: itemForm.notes, photo: itemForm.photo, checked: false }]
          }))
        });
        return ns;
      });
    }
    setShowAddItem(false);
  }

  function deleteItem(itemId) { updateThisBag(b => ({ ...b, items: b.items.filter(i => i.id !== itemId) })); }
  function toggleCheck(itemId) { updateThisBag(b => ({ ...b, items: b.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i) })); }

  // ── Sub-bags ──
  function openAddBag() { setBagForm({ name: "", icon: NONE_EMOJI, photo: null }); setEditBag(null); setShowAddBag(true); }
  function openEditBag(subBag, e) {
    e.stopPropagation();
    setBagForm({ name: subBag.name, icon: subBag.icon ?? NONE_EMOJI, photo: subBag.photo || null });
    setEditBag(subBag);
    setShowAddBag(true);
  }

  function saveSubBag() {
    if (!bagForm.name.trim()) return;
    if (editBag) {
      setData(d => ({
        ...d,
        jobs: d.jobs.map(j => j.id !== jobId ? j : {
          ...j,
          bags: updateBagInTree(j.bags, editBag.id, b => ({ ...b, name: bagForm.name.trim(), icon: bagForm.icon, photo: bagForm.photo }))
        })
      }));
    } else {
      setData(d => {
        let s = { ...d };
        let [id, ns] = generateId(s);
        ns.jobs = ns.jobs.map(j => j.id !== jobId ? j : {
          ...j,
          bags: updateBagInTree(j.bags, bagId, b => ({
            ...b, bags: [...(b.bags || []), { id, name: bagForm.name.trim(), icon: bagForm.icon, photo: bagForm.photo, items: [], bags: [] }]
          }))
        });
        return ns;
      });
    }
    setShowAddBag(false);
  }

  function deleteSubBag(subBagId) {
    setData(d => ({
      ...d,
      jobs: d.jobs.map(j => j.id !== jobId ? j : {
        ...j,
        bags: updateBagInTree(j.bags, bagId, b => ({ ...b, bags: deleteBagFromTree(b.bags || [], subBagId) }))
      })
    }));
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
      />
      {prog && (
        <div style={{ padding: "8px 20px 12px", background: "#151515", borderBottom: "1px solid #1e1e1e" }}>
          <ProgressBar pct={prog.pct} color={prog.pct === 100 ? "#4ade80" : "#E8C547"} />
        </div>
      )}

      <div style={{ padding: "12px 16px 130px" }}>

        {/* ── Sub-bags section ── */}
        {subBags.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 2 }}>Sub-bags</div>
            {subBags.map(subBag => {
              const allSub = allItemsInBag(subBag);
              const sbp = progressOf(allSub);
              return (
                <div key={subBag.id} onClick={() => navigate("items", jobId, subBag.id)} style={{ background: "#1a1a1a", borderRadius: 16, marginBottom: 10, border: "1px solid #252525", cursor: "pointer", overflow: "hidden" }}>
                  {subBag.photo && (
                    <div style={{ height: 60, overflow: "hidden", position: "relative" }}>
                      <img src={subBag.photo} alt={subBag.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 10%, rgba(26,26,26,0.95))" }} />
                    </div>
                  )}
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <IconDisplay icon={subBag.icon} size={36} fontSize={20} style={{ borderRadius: 10 }} />
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{subBag.name}</div>
                          <div style={{ fontSize: 12, color: "#555", marginTop: 1 }}>
                            {(subBag.bags || []).length > 0 && <span>{(subBag.bags || []).length} sub-bag{(subBag.bags || []).length !== 1 ? "s" : ""} · </span>}
                            {(subBag.items || []).length} item{(subBag.items || []).length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        {sbp && <Badge>{sbp.checked}/{sbp.total}</Badge>}
                        <button onClick={e => openEditBag(subBag, e)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}><Icon name="edit" size={14} /></button>
                        <button onClick={e => { e.stopPropagation(); deleteSubBag(subBag.id); }} style={{ background: "none", border: "none", color: "#3a3a3a", cursor: "pointer", padding: 4 }}><Icon name="trash" size={14} /></button>
                      </div>
                    </div>
                    {sbp && <ProgressBar pct={sbp.pct} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Items section ── */}
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

        {items.map(item => (
          <div key={item.id} style={{ background: item.checked ? "#181818" : "#1e1e1e", borderRadius: 14, marginBottom: 10, border: `1px solid ${item.checked ? "#222" : "#2c2c2c"}`, overflow: "hidden", transition: "background 0.2s, border-color 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "12px 12px 12px 0" }}>
              <button onClick={() => toggleCheck(item.id)} style={{ minWidth: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${item.checked ? "#4ade80" : "#444"}`, background: item.checked ? "#4ade8022" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  {item.checked && <Icon name="check" size={15} />}
                </div>
              </button>

              {item.photo ? (
                <div style={{ width: 46, height: 46, borderRadius: 10, overflow: "hidden", marginRight: 12, flexShrink: 0, opacity: item.checked ? 0.45 : 1 }}>
                  <img src={item.photo} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <IconDisplay icon={item.emoji} size={44} fontSize={26} style={{ marginRight: 10, borderRadius: 11, opacity: item.checked ? 0.35 : 1, transition: "opacity 0.2s", border: "none", background: "#222" }} />
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: item.checked ? "#555" : "#f0f0f0", textDecoration: item.checked ? "line-through" : "none", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
                  {item.photo && item.emoji && item.emoji !== NONE_EMOJI && <span style={{ fontSize: 15, opacity: item.checked ? 0.5 : 1 }}>{item.emoji}</span>}
                  {item.name}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                  {item.qty > 1 && <Badge color="#666">×{item.qty}</Badge>}
                  {item.notes && <span style={{ fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 155 }}>{item.notes}</span>}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 6 }}>
                <button onClick={e => openEditItem(item, e)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}><Icon name="edit" size={15} /></button>
                <button onClick={() => deleteItem(item.id)} style={{ background: "none", border: "none", color: "#3a3a3a", cursor: "pointer", padding: 4 }}><Icon name="trash" size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── FAB: two buttons ── */}
      <div style={{ position: "fixed", bottom: 24, right: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
        <button onClick={openAddBag} style={{ background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: 20, padding: "12px 18px", fontSize: 14, fontWeight: 700, color: "#ccc", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
          <Icon name="bag" size={16} /> Add Sub-bag
        </button>
        <button onClick={openAddItem} style={{ background: "#E8C547", border: "none", borderRadius: 20, padding: "14px 22px", fontSize: 15, fontWeight: 800, color: "#111", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 24px rgba(232,197,71,0.45)" }}>
          <Icon name="plus" size={18} /> Add Item
        </button>
      </div>

      {showAddItem && (
        <Modal title={editItem ? "EDIT ITEM" : "ADD EQUIPMENT"} onClose={() => setShowAddItem(false)}>
          <EmojiPicker value={itemForm.emoji} onChange={v => setItemForm(f => ({ ...f, emoji: v }))} library={ITEM_EMOJIS} tabs={ITEM_TABS} />
          <Input label="Item Name" value={itemForm.name} onChange={v => setItemForm(f => ({ ...f, name: v }))} placeholder="e.g. Guitar tuner, Hammer" />
          <Input label="Quantity" value={itemForm.qty} onChange={v => setItemForm(f => ({ ...f, qty: parseInt(v) || 1 }))} type="number" placeholder="1" />
          <Textarea label="Notes (optional)" value={itemForm.notes} onChange={v => setItemForm(f => ({ ...f, notes: v }))} placeholder="e.g. Check battery, stored in side pocket" />
          <PhotoField photo={itemForm.photo} onChange={v => setItemForm(f => ({ ...f, photo: v }))} label="Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveItem} icon={<Icon name="check" size={16} />}>{editItem ? "Save Changes" : "Add Item"}</Btn>
            <Btn onClick={() => setShowAddItem(false)} variant="secondary">Cancel</Btn>
          </div>
        </Modal>
      )}

      {showAddBag && (
        <Modal title={editBag ? "EDIT SUB-BAG" : "ADD SUB-BAG"} onClose={() => setShowAddBag(false)}>
          <EmojiPicker value={bagForm.icon} onChange={v => setBagForm(f => ({ ...f, icon: v }))} library={BAG_EMOJIS} tabs={BAG_TABS} />
          <Input label="Sub-bag Name" value={bagForm.name} onChange={v => setBagForm(f => ({ ...f, name: v }))} placeholder="e.g. Front Pocket, Accessories Pouch" />
          <PhotoField photo={bagForm.photo} onChange={v => setBagForm(f => ({ ...f, photo: v }))} label="Cover Photo (optional)" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={saveSubBag} icon={<Icon name="check" size={16} />}>{editBag ? "Save Changes" : "Add Sub-bag"}</Btn>
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

  if (view.name === "jobs") return <JobsView data={data} setData={setData} navigate={navigate} />;
  if (view.name === "bags") return <BagsView data={data} setData={setData} jobId={view.jobId} navigate={navigate} />;
  if (view.name === "items") return <ItemsView data={data} setData={setData} jobId={view.jobId} bagId={view.bagId} navigate={navigate} />;
  return null;
}
