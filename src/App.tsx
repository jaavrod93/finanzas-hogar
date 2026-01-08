import React, { useEffect, useMemo, useRef, useState, createContext, useContext } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { Download, Upload, Trash2, Pencil, RefreshCcw } from "lucide-react";

/* ---------------------------------------------------------
   UI “portable” (sin shadcn/ui, sin alias @/components)
   - Esto hace que el archivo funcione en CRA / Vercel
   - Estilos: sobrios, inline + clases no rompen si no existe Tailwind
--------------------------------------------------------- */

const ui = {
  card: {
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16,
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  } as React.CSSProperties,
  cardHeader: { padding: 16, borderBottom: "1px solid rgba(0,0,0,0.06)" } as React.CSSProperties,
  cardContent: { padding: 16 } as React.CSSProperties,
  hTitle: { fontSize: 16, fontWeight: 700 } as React.CSSProperties,
  button: {
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    borderRadius: 12,
    padding: "10px 12px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,
  buttonPrimary: {
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#0ea5e9",
    color: "white",
    borderRadius: 12,
    padding: "10px 12px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,
  buttonDanger: {
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#e11d48",
    color: "white",
    borderRadius: 12,
    padding: "10px 12px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,
  input: {
    width: "100%",
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: 12,
    padding: "10px 12px",
    outline: "none",
  } as React.CSSProperties,
  label: { fontSize: 12, color: "rgba(0,0,0,0.65)", fontWeight: 600 } as React.CSSProperties,
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    fontSize: 12,
    background: "rgba(255,255,255,0.9)",
  } as React.CSSProperties,
  sep: { height: 1, background: "rgba(0,0,0,0.08)", margin: "16px 0" } as React.CSSProperties,
  tableWrap: { overflowX: "auto", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16 } as React.CSSProperties,
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0 } as React.CSSProperties,
  th: {
    position: "sticky" as const,
    top: 0,
    background: "rgba(250,250,250,0.98)",
    textAlign: "left" as const,
    fontSize: 12,
    color: "rgba(0,0,0,0.65)",
    padding: "10px 12px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    zIndex: 1,
  } as React.CSSProperties,
  td: { padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)", fontSize: 13 } as React.CSSProperties,
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 50,
  } as React.CSSProperties,
  modal: {
    width: "min(900px, 100%)",
    borderRadius: 16,
    background: "white",
    border: "1px solid rgba(0,0,0,0.12)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
    overflow: "hidden",
  } as React.CSSProperties,
  modalHeader: { padding: 16, borderBottom: "1px solid rgba(0,0,0,0.06)" } as React.CSSProperties,
  modalBody: { padding: 16, maxHeight: "70vh", overflow: "auto" } as React.CSSProperties,
  modalFooter: { padding: 16, borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "flex-end", gap: 8 } as React.CSSProperties,
  alert: { border: "1px solid rgba(0,0,0,0.12)", borderRadius: 16, padding: 12, background: "rgba(250,250,250,0.95)" } as React.CSSProperties,
};

function Card({
  children,
  style,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; style?: React.CSSProperties }) {
  const vars = {
    ["--text" as any]: "rgba(15,23,42,0.94)",
    ["--muted" as any]: "rgba(15,23,42,0.62)",
  } as any;

  return (
    <div
      {...rest}
      className={className}
      style={{
        ...ui.card,
        color: "rgba(15,23,42,0.94)",
        ...vars,
        ...(style || {}),
      }}
    >
      {children}
    </div>
  );
}
function CardHeader({ children }: { children: React.ReactNode }) {
  return <div style={ui.cardHeader}>{children}</div>;
}
function CardTitle({ children }: { children: React.ReactNode }) {
  return <div style={ui.hTitle}>{children}</div>;
}
function CardContent({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return <div className={className} style={{ ...ui.cardContent, ...style }}>{children}</div>;
}

function Button({ children, onClick, variant, disabled, style, type, className, size }: any) {
  const base = variant === "destructive" ? ui.buttonDanger : variant === "primary" ? ui.buttonPrimary : ui.button;
  const sizeStyle =
    size === "icon"
      ? { padding: 10, width: 40, height: 40, justifyContent: "center" }
      : {};
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{ ...base, ...sizeStyle, opacity: disabled ? 0.6 : 1, ...style }}
    >
      {children}
    </button>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return <input {...props} className={props.className} style={{ ...ui.input, ...(props.style || {}) }} />;
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return <textarea {...props} className={props.className} style={{ ...ui.input, minHeight: 88, ...(props.style || {}) }} />;
}
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className} style={ui.label}>{children}</div>;
}

/** ✅ FIX CLAVE: Badge acepta variant + className (evita el error TS2322 en Vercel) */
type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | string;
function Badge({
  children,
  style,
  className,
  variant,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  style?: React.CSSProperties;
  variant?: BadgeVariant;
}) {
  const variantStyle: React.CSSProperties =
    variant === "destructive"
      ? { background: "rgba(225, 29, 72, 0.10)", borderColor: "rgba(225, 29, 72, 0.35)", color: "rgba(159, 18, 57, 1)" }
      : variant === "secondary"
        ? { background: "rgba(2, 132, 199, 0.10)", borderColor: "rgba(2, 132, 199, 0.30)", color: "rgba(3, 105, 161, 1)" }
        : variant === "outline"
          ? { background: "transparent" }
          : {};
  return (
    <span {...rest} className={className} style={{ ...ui.badge, ...variantStyle, ...(style || {}) }}>
      {children}
    </span>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={className} style={ui.sep} />;
}
function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
    </label>
  );
}

// Simple Select
function Select({ value, onValueChange, children }: any) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as any, { value, onValueChange });
  });
}
function SelectTrigger({ children }: any) {
  return <>{children}</>;
}
function SelectValue({ placeholder }: any) {
  return <span style={{ color: "rgba(0,0,0,0.6)" }}>{placeholder}</span>;
}
function SelectContent({ children, value, onValueChange }: any) {
  const options: Array<{ value: string; label: string }> = [];
  React.Children.forEach(children, (ch) => {
    if (!React.isValidElement(ch)) return;
    const anyCh: any = ch;
    if (anyCh.type === SelectItem) options.push({ value: anyCh.props.value, label: anyCh.props.children });
  });
  return (
    <select value={value} onChange={(e) => onValueChange?.(e.target.value)} style={ui.input}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
function SelectItem({ children }: any) {
  return <>{children}</>;
}

// Tabs
const TabsCtx = createContext<{ value: string; setValue: (v: string) => void } | null>(null);
function Tabs({ value, onValueChange, children }: any) {
  const ctx = useMemo(() => ({ value, setValue: onValueChange }), [value, onValueChange]);
  return <TabsCtx.Provider value={ctx}>{children}</TabsCtx.Provider>;
}
function TabsList({ children, className }: any) {
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        gap: 8,
        padding: 6,
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.10)",
        background: "rgba(255,255,255,0.8)",
      }}
    >
      {children}
    </div>
  );
}
function TabsTrigger({ value, children }: any) {
  const ctx = useContext(TabsCtx)!;
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.10)",
        background: active ? "rgba(14,165,233,0.15)" : "transparent",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
function TabsContent({ value, children, className }: any) {
  const ctx = useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}

// Dialog (modal)
const DialogCtx = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);
function Dialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <DialogCtx.Provider value={{ open, setOpen }}>{children}</DialogCtx.Provider>;
}
function DialogTrigger({ asChild, children }: any) {
  const ctx = useContext(DialogCtx)!;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      onClick: (e: any) => {
        (children as any).props?.onClick?.(e);
        ctx.setOpen(true);
      },
    });
  }
  return <button onClick={() => ctx.setOpen(true)}>{children}</button>;
}
function DialogContent({ children, className }: any) {
  const ctx = useContext(DialogCtx)!;
  if (!ctx.open) return null;

  const vars = {
    ["--text" as any]: "rgba(15,23,42,0.94)",
    ["--muted" as any]: "rgba(15,23,42,0.62)",
  } as any;

  return (
    <div style={ui.overlay} onMouseDown={() => ctx.setOpen(false)}>
      <div
        style={{
          ...ui.modal,
          color: "rgba(15,23,42,0.94)",
          ...vars,
        }}
        className={className}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
function DialogHeader({ children }: any) {
  return <div style={ui.modalHeader}>{children}</div>;
}
function DialogTitle({ children }: any) {
  return <div style={{ fontSize: 16, fontWeight: 800 }}>{children}</div>;
}
function DialogDescription({ children }: any) {
  return <div style={{ marginTop: 6, fontSize: 13, color: "rgba(0,0,0,0.65)" }}>{children}</div>;
}
function DialogFooter({ children }: any) {
  return <div style={ui.modalFooter}>{children}</div>;
}

// Alert
function Alert({ children }: any) {
  return <div style={ui.alert}>{children}</div>;
}
function AlertTitle({ children }: any) {
  return <div style={{ fontWeight: 800, marginBottom: 4 }}>{children}</div>;
}
function AlertDescription({ children }: any) {
  return <div style={{ fontSize: 13, color: "rgba(0,0,0,0.75)" }}>{children}</div>;
}

// Table
function Table({ children }: any) {
  return <table style={ui.table}>{children}</table>;
}
function TableHeader({ children, className }: any) {
  return <thead className={className}>{children}</thead>;
}
function TableBody({ children }: any) {
  return <tbody>{children}</tbody>;
}
function TableRow({ children, className }: any) {
  return <tr className={className}>{children}</tr>;
}
function TableHead({ children, className, style }: any) {
  return (
    <th className={className} style={{ ...ui.th, ...(style || {}) }}>
      {children}
    </th>
  );
}
function TableCell({ children, className, colSpan, style, title }: any) {
  return (
    <td className={className} colSpan={colSpan} style={{ ...ui.td, ...(style || {}) }} title={title}>
      {children}
    </td>
  );
}

/**
 * Finanzas del Hogar (2026)
 * - 2 pestañas: Carga + Dashboard
 * - Presupuestos por categoría (mensuales) con progreso/colores (ARS)
 * - USD real separado: se carga y se visualiza como una economía aparte (sin conversión)
 * - Ahorros: siempre USD
 * - Persistencia: localStorage
 * - Colaboración opcional: Supabase + Realtime
 */

// ------------------ Config ------------------

const APP_KEY = "finanzas_hogar_v1";

const CATEGORIES_EXPENSE = [
  "Alquiler",
  "Expensas",
  "Super",
  "Luz",
  "Gas",
  "Salud",
  "TV/Internet",
  "Auto",
  "Nafta",
  "Gastos en USD",
  "Taz y Milo",
  "Ropa",
  "Delivery",
  "Regalos",
  "Casa/Hogar",
  "Salidas",
  "Gustos personales",
  "Extras",
] as const;

const CATEGORIES_POSITIVE = ["Ingresos Javi", "Ingresos Miki", "Ahorro"] as const;

const ALL_CATEGORIES = [...CATEGORIES_EXPENSE, ...CATEGORIES_POSITIVE] as const;

type Category = (typeof ALL_CATEGORIES)[number];
type Currency = "ARS" | "USD";

type Entry = {
  id: string;
  category: Category;
  currency: Currency;
  amount: number;
  date: string; // YYYY-MM-DD
  comment?: string;
  createdAt: number;
  updatedAt: number;
};

type Budget = {
  id: string; // `${monthKey}__${category}`
  monthKey: string; // 2026-01 .. 2026-12
  category: Category;
  limitARS: number;
  updatedAt: number;
};

type CollaborationConfig = {
  enabled: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  room: string;
};

const DEFAULT_COLLAB: CollaborationConfig = {
  enabled: false,
  supabaseUrl: "",
  supabaseAnonKey: "",
  room: "familia",
};

const USD_CATEGORY: Category = "Gastos en USD";
const SAVINGS_CATEGORY: Category = "Ahorro";

const ARS_EXPENSE_CATEGORIES = (CATEGORIES_EXPENSE as readonly Category[]).filter((c) => c !== USD_CATEGORY);

// ------------------ Utils ------------------

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
function toMonthKey(dateYYYYMMDD: string) {
  return dateYYYYMMDD.slice(0, 7);
}
function monthLabel(monthKey: string) {
  const [y, m] = monthKey.split("-").map((x) => parseInt(x, 10));
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${months[(m || 1) - 1]} ${y}`;
}
function prevMonthKey(monthKey: string) {
  const [yStr, mStr] = monthKey.split("-");
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  if (!Number.isFinite(y) || !Number.isFinite(m)) return "";
  const d = new Date(y, m - 1, 1);
  d.setMonth(d.getMonth() - 1);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yy}-${mm}`;
}
function formatMoneyARS(n: number) {
  try {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$ ${Math.round(n).toLocaleString("es-AR")}`;
  }
}
function formatMoneyUSD(n: number) {
  const val = Number.isFinite(n) ? n : 0;
  return `$ ${val.toFixed(2)} USD`;
}
function safeNumber(input: string) {
  const cleaned = input.trim().replace(/\./g, "").replace(/,/g, ".").replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}
function isExpense(cat: Category) {
  return (CATEGORIES_EXPENSE as readonly string[]).includes(cat);
}
function normalizeEntry(raw: any): Entry | null {
  if (!raw || !raw.id || !raw.category || !raw.date) return null;

  const category: Category = raw.category;

  const legacyARS = Number(raw.amountARS);
  const inferredCurrency: Currency =
    raw.currency === "USD" || category === USD_CATEGORY || category === SAVINGS_CATEGORY ? "USD" : "ARS";

  const amount = Number.isFinite(Number(raw.amount))
    ? Number(raw.amount)
    : inferredCurrency === "USD"
      ? Number(raw.amountUSD)
      : legacyARS;

  return {
    id: String(raw.id),
    category,
    currency: inferredCurrency,
    amount: Number.isFinite(amount) ? amount : 0,
    date: String(raw.date),
    comment: raw.comment || "",
    createdAt: Number(raw.createdAt) || Date.now(),
    updatedAt: Number(raw.updatedAt) || Date.now(),
  };
}
function loadLocal(): { entries: Entry[]; budgets: Budget[]; collab: CollaborationConfig } {
  const raw = localStorage.getItem(APP_KEY);
  if (!raw) return { entries: [], budgets: [], collab: DEFAULT_COLLAB };
  try {
    const parsed = JSON.parse(raw);
    const normalizedEntries: Entry[] = Array.isArray(parsed.entries) ? parsed.entries.map(normalizeEntry).filter(Boolean) : [];
    return {
      entries: normalizedEntries as Entry[],
      budgets: Array.isArray(parsed.budgets) ? parsed.budgets : [],
      collab: parsed.collab ? { ...DEFAULT_COLLAB, ...parsed.collab } : DEFAULT_COLLAB,
    };
  } catch {
    return { entries: [], budgets: [], collab: DEFAULT_COLLAB };
  }
}
function saveLocal(entries: Entry[], budgets: Budget[], collab: CollaborationConfig) {
  localStorage.setItem(APP_KEY, JSON.stringify({ entries, budgets, collab }));
}

// ------------------ Supabase (opcional) ------------------

async function getSupabaseClient(url: string, key: string) {
  const mod = await import("@supabase/supabase-js");
  return mod.createClient(url, key);
}

// ------------------ Main ------------------

export default function FinanzasHogarApp() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [collab, setCollab] = useState<CollaborationConfig>(DEFAULT_COLLAB);
  const [activeTab, setActiveTab] = useState<"carga" | "dashboard">("carga");

  // colaboración / Supabase
  const [collabStatus, setCollabStatus] = useState<"offline" | "connecting" | "online" | "error">("offline");
  const [collabError, setCollabError] = useState<string>("");
  const supabaseRef = useRef<any>(null);
  const channelRef = useRef<any>(null);

  // form
  const [category, setCategory] = useState<Category>("Super");
  const [amountStr, setAmountStr] = useState<string>("");
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [comment, setComment] = useState<string>("");

  const [editing, setEditing] = useState<Entry | null>(null);
  const [search, setSearch] = useState<string>("");

  // mes (2026)
  const [monthFilter, setMonthFilter] = useState<string>(""); // "" = todos, "01".."12"

  const MONTHS_2026 = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `2026-${String(i + 1).padStart(2, "0")}`),
    []
  );

  const MONTH_OPTIONS = useMemo(
    () => [
      { value: "", label: "Todos" },
      { value: "01", label: "Enero" },
      { value: "02", label: "Febrero" },
      { value: "03", label: "Marzo" },
      { value: "04", label: "Abril" },
      { value: "05", label: "Mayo" },
      { value: "06", label: "Junio" },
      { value: "07", label: "Julio" },
      { value: "08", label: "Agosto" },
      { value: "09", label: "Septiembre" },
      { value: "10", label: "Octubre" },
      { value: "11", label: "Noviembre" },
      { value: "12", label: "Diciembre" },
    ],
    []
  );

  const monthKeyFromFilter = useMemo(() => (monthFilter ? `2026-${monthFilter}` : ""), [monthFilter]);
  const months = useMemo(() => MONTHS_2026, [MONTHS_2026]);

  // ------------------ Budgets lookup (antes de cualquier uso) ------------------
  const budgetsById = useMemo(() => {
    const map = new Map<string, Budget>();
    for (const b of budgets) map.set(b.id, b);
    return map;
  }, [budgets]);

  function budgetId(monthKey: string, cat: Category) {
    return `${monthKey}__${cat}`;
  }
  function getBudget(monthKey: string, cat: Category) {
    return budgetsById.get(budgetId(monthKey, cat));
  }
  function progressColorClass(pct: number) {
    if (pct >= 1) return "bg-rose-500";
    if (pct >= 0.8) return "bg-amber-500";
    return "bg-emerald-500";
  }

  // ------------ Persistencia local + Sync Supabase ------------

  useEffect(() => {
    const { entries: e, budgets: b, collab: c } = loadLocal();
    setEntries((e as Entry[]).sort((a, b2) => b2.date.localeCompare(a.date)));
    setBudgets(b);
    setCollab(c);
  }, []);

  useEffect(() => {
    saveLocal(entries, budgets, collab);
  }, [entries, budgets, collab]);

  useEffect(() => {
    let cancelled = false;

    async function cleanup() {
      try {
        if (channelRef.current && supabaseRef.current) {
          await supabaseRef.current.removeChannel(channelRef.current);
        }
      } catch {}
      channelRef.current = null;
      supabaseRef.current = null;
    }

    async function connect() {
      await cleanup();

      if (!collab.enabled) {
        setCollabStatus("offline");
        setCollabError("");
        return;
      }

      if (!collab.supabaseUrl || !collab.supabaseAnonKey) {
        setCollabStatus("error");
        setCollabError("Faltan Supabase URL o Anon Key");
        return;
      }

      setCollabStatus("connecting");
      setCollabError("");

      try {
        const supabase = await getSupabaseClient(collab.supabaseUrl, collab.supabaseAnonKey);
        if (cancelled) return;
        supabaseRef.current = supabase;

        const { data: remoteEntries, error: eErr } = await supabase.from("finance_entries").select("*").eq("room", collab.room);
        if (eErr) throw eErr;

        const { data: remoteBudgets, error: bErr } = await supabase.from("finance_budgets").select("*").eq("room", collab.room);
        if (bErr) throw bErr;

        const mergedEntries = (() => {
          const map = new Map<string, Entry>();
          for (const it of entries) map.set(it.id, it);
          for (const r of remoteEntries || []) {
            const n = normalizeEntry(r);
            if (!n) continue;
            const cur = map.get(n.id);
            if (!cur || (n.updatedAt || 0) >= (cur.updatedAt || 0)) map.set(n.id, n);
          }
          return Array.from(map.values()).sort((a, b2) => b2.date.localeCompare(a.date));
        })();

        const mergedBudgets = (() => {
          const map = new Map<string, Budget>();
          for (const it of budgets) map.set(it.id, it);
          for (const r of remoteBudgets || []) {
            const id = String(r.id || "");
            if (!id) continue;
            const next: Budget = {
              id,
              monthKey: String(r.monthKey || ""),
              category: r.category as Category,
              limitARS: Number(r.limitARS) || 0,
              updatedAt: Number(r.updatedAt) || Date.now(),
            };
            const cur = map.get(id);
            if (!cur || (next.updatedAt || 0) >= (cur.updatedAt || 0)) map.set(id, next);
          }
          return Array.from(map.values());
        })();

        if (!cancelled) {
          setEntries(mergedEntries);
          setBudgets(mergedBudgets);
        }

        const ch = supabase
          .channel(`finanzas_${collab.room}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "finance_entries", filter: `room=eq.${collab.room}` },
            (payload: any) => {
              const rec = payload?.new || payload?.old;
              if (!rec) return;
              const n = normalizeEntry(rec);
              if (!n) return;

              if (payload.eventType === "DELETE") {
                setEntries((prev) => prev.filter((x) => x.id !== n.id));
              } else {
                setEntries((prev) => {
                  const map = new Map(prev.map((x) => [x.id, x] as const));
                  const cur = map.get(n.id);
                  if (!cur || (n.updatedAt || 0) >= (cur.updatedAt || 0)) map.set(n.id, n);
                  return Array.from(map.values()).sort((a, b2) => b2.date.localeCompare(a.date));
                });
              }
            }
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "finance_budgets", filter: `room=eq.${collab.room}` },
            (payload: any) => {
              const rec = payload?.new || payload?.old;
              if (!rec?.id) return;
              const next: Budget = {
                id: String(rec.id),
                monthKey: String(rec.monthKey || ""),
                category: rec.category as Category,
                limitARS: Number(rec.limitARS) || 0,
                updatedAt: Number(rec.updatedAt) || Date.now(),
              };

              if (payload.eventType === "DELETE") {
                setBudgets((prev) => prev.filter((b) => b.id !== next.id));
              } else {
                setBudgets((prev) => {
                  const map = new Map(prev.map((b) => [b.id, b] as const));
                  const cur = map.get(next.id);
                  if (!cur || (next.updatedAt || 0) >= (cur.updatedAt || 0)) map.set(next.id, next);
                  return Array.from(map.values());
                });
              }
            }
          )
          .subscribe((status: string) => {
            if (cancelled) return;
            if (status === "SUBSCRIBED") setCollabStatus("online");
          });

        channelRef.current = ch;
      } catch (e: any) {
        if (cancelled) return;
        setCollabStatus("error");
        setCollabError(e?.message || "Error conectando a Supabase");
      }
    }

    connect();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [collab.enabled, collab.supabaseUrl, collab.supabaseAnonKey, collab.room]);

  // ------------ Remote helpers ------------

  async function upsertRemote(e: Entry) {
    if (!collab.enabled || collabStatus !== "online" || !supabaseRef.current) return;
    const supabase = supabaseRef.current;

    const payload = {
      room: collab.room,
      id: e.id,
      category: e.category,
      currency: e.currency,
      amount: e.amount,
      amountARS: e.currency === "ARS" ? e.amount : 0,
      amountUSD: e.currency === "USD" ? e.amount : null,
      date: e.date,
      comment: e.comment || "",
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };

    const { error } = await supabase.from("finance_entries").upsert(payload, { onConflict: "id" });
    if (error) throw error;
  }
  async function deleteRemote(id: string) {
    if (!collab.enabled || collabStatus !== "online" || !supabaseRef.current) return;
    const supabase = supabaseRef.current;
    const { error } = await supabase.from("finance_entries").delete().eq("id", id).eq("room", collab.room);
    if (error) throw error;
  }
  async function upsertBudgetRemote(b: Budget) {
    if (!collab.enabled || collabStatus !== "online" || !supabaseRef.current) return;
    const supabase = supabaseRef.current;
    const payload = { ...b, room: collab.room };
    const { error } = await supabase.from("finance_budgets").upsert(payload, { onConflict: "id" });
    if (error) throw error;
  }
  async function deleteBudgetRemote(id: string) {
    if (!collab.enabled || collabStatus !== "online" || !supabaseRef.current) return;
    const supabase = supabaseRef.current;
    const { error } = await supabase.from("finance_budgets").delete().eq("id", id).eq("room", collab.room);
    if (error) throw error;
  }

  // ------------ Actions ------------

  async function handleSubmit() {
    const amount = safeNumber(amountStr);
    if (!category || !date || !Number.isFinite(amount) || amount <= 0) return;

    const currency: Currency = category === USD_CATEGORY || category === SAVINGS_CATEGORY ? "USD" : "ARS";

    if (editing) {
      const updated: Entry = { ...editing, category, currency, amount, date, comment, updatedAt: Date.now() };
      setEntries((prev) => prev.map((x) => (x.id === updated.id ? updated : x)).sort((a, b) => b.date.localeCompare(a.date)));
      setEditing(null);
      setAmountStr("");
      setComment("");
      try { await upsertRemote(updated); } catch (e: any) { setCollabStatus("error"); setCollabError(e?.message || "Error guardando en Supabase"); }
      return;
    }

    const now = Date.now();
    const newEntry: Entry = { id: uid(), category, currency, amount, date, comment, createdAt: now, updatedAt: now };
    setEntries((prev) => [newEntry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    setAmountStr("");
    setComment("");

    try { await upsertRemote(newEntry); } catch (e: any) { setCollabStatus("error"); setCollabError(e?.message || "Error guardando en Supabase"); }
  }

  function startEdit(e: Entry) {
    setEditing(e);
    setCategory(e.category);
    setDate(e.date);
    setAmountStr(String(e.amount));
    setComment(e.comment || "");
    setActiveTab("carga");
  }

  async function removeEntry(e: Entry) {
    setEntries((prev) => prev.filter((x) => x.id !== e.id));
    try { await deleteRemote(e.id); } catch (err: any) { setCollabStatus("error"); setCollabError(err?.message || "Error borrando en Supabase"); }
  }

  async function setBudget(monthKey: string, cat: Category, limitARS: number) {
    const id = budgetId(monthKey, cat);
    const now = Date.now();

    if (!Number.isFinite(limitARS) || limitARS <= 0) {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      try { await deleteBudgetRemote(id); } catch (e: any) { setCollabStatus("error"); setCollabError(e?.message || "Error borrando presupuesto en Supabase"); }
      return;
    }

    const next: Budget = { id, monthKey, category: cat, limitARS, updatedAt: now };
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx >= 0) { const copy = prev.slice(); copy[idx] = next; return copy; }
      return [...prev, next];
    });

    try { await upsertBudgetRemote(next); } catch (e: any) { setCollabStatus("error"); setCollabError(e?.message || "Error guardando presupuesto en Supabase"); }
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ entries, budgets }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finanzas_hogar_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result || "{}"));
        const incomingRaw: any[] = Array.isArray(obj.entries) ? obj.entries : [];
        const incoming: Entry[] = incomingRaw.map(normalizeEntry).filter(Boolean) as Entry[];
        const incomingBudgets: Budget[] = Array.isArray(obj.budgets) ? obj.budgets : [];

        setEntries((prev) => {
          const map = new Map<string, Entry>();
          for (const it of prev) map.set(it.id, it);
          for (const it of incoming) {
            if (!it?.id) continue;
            const cur = map.get(it.id);
            if (!cur || (it.updatedAt || 0) >= (cur.updatedAt || 0)) map.set(it.id, it);
          }
          return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
        });

        setBudgets((prev) => {
          const map = new Map<string, Budget>();
          for (const it of prev) map.set(it.id, it);
          for (const it of incomingBudgets) {
            if (!it?.id) continue;
            const cur = map.get(it.id);
            if (!cur || (it.updatedAt || 0) >= (cur.updatedAt || 0)) map.set(it.id, it);
          }
          return Array.from(map.values());
        });
      } catch {}
    };
    reader.readAsText(file);
  }

  // ------------ Derived data ------------

  const scopedEntries = useMemo(() => {
    const base = entries;
    if (!monthKeyFromFilter) return base;
    return base.filter((e) => toMonthKey(e.date) === monthKeyFromFilter);
  }, [entries, monthKeyFromFilter]);

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return scopedEntries;
    return scopedEntries.filter((e) => e.category.toLowerCase().includes(q) || e.date.toLowerCase().includes(q) || (e.comment || "").toLowerCase().includes(q));
  }, [scopedEntries, search]);

  const pivotARS = useMemo(() => {
    const out: Record<string, Record<string, number>> = {};
    for (const c of ALL_CATEGORIES) out[c] = {};
    for (const e of entries) {
      if (e.currency !== "ARS") continue;
      const mk = toMonthKey(e.date);
      if (!mk.startsWith("2026-")) continue;
      out[e.category][mk] = (out[e.category][mk] || 0) + (Number(e.amount) || 0);
    }
    return out as Record<Category, Record<string, number>>;
  }, [entries]);

  const usdExpensesByMonth = useMemo(() => {
    const out: Record<string, number> = {};
    for (const e of entries) {
      if (e.currency !== "USD") continue;
      if (e.category !== USD_CATEGORY) continue;
      const mk = toMonthKey(e.date);
      if (!mk.startsWith("2026-")) continue;
      out[mk] = (out[mk] || 0) + (Number(e.amount) || 0);
    }
    return out;
  }, [entries]);

  const usdSavingsByMonth = useMemo(() => {
    const out: Record<string, number> = {};
    for (const e of entries) {
      if (e.currency !== "USD") continue;
      if (e.category !== SAVINGS_CATEGORY) continue;
      const mk = toMonthKey(e.date);
      if (!mk.startsWith("2026-")) continue;
      out[mk] = (out[mk] || 0) + (Number(e.amount) || 0);
    }
    return out;
  }, [entries]);

  const usdBalanceByMonth = useMemo(() => {
    const out: Record<string, number> = {};
    for (const m of MONTHS_2026) out[m] = (usdSavingsByMonth[m] || 0) - (usdExpensesByMonth[m] || 0);
    return out;
  }, [MONTHS_2026, usdSavingsByMonth, usdExpensesByMonth]);

  const totalsCurrentFilter = useMemo(() => {
    let ingresos = 0;
    let gastos = 0;
    let gastosUSD = 0;
    let ahorroUSD = 0;

    for (const e of scopedEntries) {
      if (e.currency === "USD") {
        if (e.category === USD_CATEGORY) gastosUSD += e.amount;
        if (e.category === SAVINGS_CATEGORY) ahorroUSD += e.amount;
      } else {
        if (isExpense(e.category)) {
          if (e.category !== USD_CATEGORY) gastos += e.amount;
        } else {
          ingresos += e.amount;
        }
      }
    }

    return { ingresos, gastos, balance: ingresos - gastos, gastosUSD, ahorroUSD, balanceUSD: ahorroUSD - gastosUSD };
  }, [scopedEntries]);

  const totalsByMonthARS = useMemo(() => {
    return MONTHS_2026.map((m) => {
      const ingresos = (pivotARS["Ingresos Javi"]?.[m] || 0) + (pivotARS["Ingresos Miki"]?.[m] || 0);
      let gastos = 0;
      for (const c of ARS_EXPENSE_CATEGORIES) gastos += pivotARS[c]?.[m] || 0;
      return { month: monthLabel(m), ingresos, gastos, balance: ingresos - gastos };
    });
  }, [MONTHS_2026, pivotARS]);

  const topCategoriesForBarsARS = useMemo(() => {
    const mk = monthKeyFromFilter;
    const totals: Array<{ category: string; total: number }> = [];
    for (const c of ARS_EXPENSE_CATEGORIES) {
      const total = mk ? (pivotARS[c]?.[mk] || 0) : MONTHS_2026.reduce((acc, m) => acc + (pivotARS[c]?.[m] || 0), 0);
      totals.push({ category: c, total });
    }
    totals.sort((a, b) => b.total - a.total);
    return totals.slice(0, 10);
  }, [MONTHS_2026, pivotARS, monthKeyFromFilter]);

  const smartComparison = useMemo(() => {
    if (!monthKeyFromFilter) return null;
    const cur = monthKeyFromFilter;
    const prev = prevMonthKey(cur);
    if (!prev) return null;

    const rows: Array<{ category: Category; cur: number; prv: number; delta: number; pct: number | null }> = [];
    for (const c of ARS_EXPENSE_CATEGORIES) {
      const curV = pivotARS[c]?.[cur] || 0;
      const prvV = pivotARS[c]?.[prev] || 0;
      const delta = curV - prvV;
      const pct = prvV > 0 ? delta / prvV : curV > 0 ? null : 0;
      rows.push({ category: c, cur: curV, prv: prvV, delta, pct });
    }

    const increases = rows.filter((r) => r.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 5);
    const decreases = rows.filter((r) => r.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 5);

    const usd = {
      gastos: { cur: usdExpensesByMonth[cur] || 0, prv: usdExpensesByMonth[prev] || 0, delta: (usdExpensesByMonth[cur] || 0) - (usdExpensesByMonth[prev] || 0) },
      ahorro: { cur: usdSavingsByMonth[cur] || 0, prv: usdSavingsByMonth[prev] || 0, delta: (usdSavingsByMonth[cur] || 0) - (usdSavingsByMonth[prev] || 0) },
      balance: { cur: usdBalanceByMonth[cur] || 0, prv: usdBalanceByMonth[prev] || 0, delta: (usdBalanceByMonth[cur] || 0) - (usdBalanceByMonth[prev] || 0) },
    };

    return { prev, increases, decreases, usd };
  }, [monthKeyFromFilter, pivotARS, usdExpensesByMonth, usdSavingsByMonth, usdBalanceByMonth, MONTHS_2026]);

  const financialHealth = useMemo(() => {
    const mode = monthKeyFromFilter ? "month" : "year";
    const ingresosARS = totalsCurrentFilter.ingresos;
    const gastosARS = totalsCurrentFilter.gastos;
    const balanceARS = totalsCurrentFilter.balance;
    const gastosUSD = totalsCurrentFilter.gastosUSD;
    const ahorroUSD = totalsCurrentFilter.ahorroUSD;
    const balanceUSD = totalsCurrentFilter.balanceUSD;

    const savingsRate = ingresosARS > 0 ? Math.max(0, balanceARS / ingresosARS) : 0;
    const alerts: Array<{ tone: "info" | "warn" | "bad"; text: string }> = [];

    if (ingresosARS > 0 && balanceARS < 0) alerts.push({ tone: "bad", text: "Están gastando más ARS de lo que ingresa este período." });
    if (ingresosARS > 0 && savingsRate < 0.1) alerts.push({ tone: "warn", text: "Tasa de ahorro ARS baja (<10%)." });
    if (monthKeyFromFilter) {
      for (const c of ARS_EXPENSE_CATEGORIES) {
        const b = getBudget(monthKeyFromFilter, c);
        if (!b || !b.limitARS) continue;
        const spent = pivotARS[c]?.[monthKeyFromFilter] || 0;
        if (spent > b.limitARS) alerts.push({ tone: "warn", text: `Presupuesto excedido en ${c}.` });
      }
    }

    let score = 60;
    if (ingresosARS > 0) score += Math.round(savingsRate * 30);
    if (balanceARS < 0) score -= 20;
    if (alerts.some((a) => a.tone === "bad")) score -= 10;
    score = Math.max(0, Math.min(100, score));
    const status = score >= 75 ? "ok" : score >= 55 ? "warn" : "bad";

    return { mode, status, score, ingresosARS, gastosARS, balanceARS, savingsRate, gastosUSD, ahorroUSD, balanceUSD, alerts };
  }, [monthKeyFromFilter, totalsCurrentFilter, pivotARS, budgetsById]);

  // ------------------ UI ------------------

  const isUSDSelected = category === USD_CATEGORY || category === SAVINGS_CATEGORY;

  return (
    <div style={{ minHeight: "100vh", padding: 16, background: "linear-gradient(180deg, #eef6ff 0%, #f7fbff 50%, #ecfdf5 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ margin: 0 }}>Finanzas del Hogar</h1>
            <div style={{ marginTop: 4, color: "rgba(0,0,0,0.62)", fontSize: 13 }}>
              2026 · ARS y USD separados (Ahorro siempre USD).
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Badge variant={collab.enabled ? (collabStatus === "online" ? "default" : "secondary") : "outline"}>
              {collab.enabled ? (collabStatus === "online" ? "Colaborativo online" : collabStatus) : "Modo local"}
            </Badge>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <RefreshCcw className="h-4 w-4" /> Colaboración
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edición colaborativa (opcional)</DialogTitle>
                  <DialogDescription>
                    Modo local guarda en tu navegador. Con Supabase sincroniza entre dispositivos.
                  </DialogDescription>
                </DialogHeader>

                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>Activar Supabase</div>
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>Sincronización realtime</div>
                    </div>
                    <Switch checked={collab.enabled} onCheckedChange={(v) => setCollab((c) => ({ ...c, enabled: Boolean(v) }))} />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <Label>Room (nombre de familia)</Label>
                    <Input value={collab.room} onChange={(e) => setCollab((c) => ({ ...c, room: e.target.value.trim() || "familia" }))} />
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)", marginTop: 6 }}>
                      Usen el mismo room en todos los dispositivos.
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <Label>Supabase URL</Label>
                    <Input value={collab.supabaseUrl} onChange={(e) => setCollab((c) => ({ ...c, supabaseUrl: e.target.value }))} placeholder="https://xxxx.supabase.co" />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <Label>Supabase Anon Key</Label>
                    <Input value={collab.supabaseAnonKey} onChange={(e) => setCollab((c) => ({ ...c, supabaseAnonKey: e.target.value }))} placeholder="eyJhbGciOi..." />
                  </div>

                  {collabStatus === "error" && (
                    <div style={{ marginTop: 12 }}>
                      <Alert>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{collabError || "Revisá credenciales y Realtime"}</AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setCollab((c) => ({ ...c, enabled: false }))}>
                    Volver a modo local
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <TabsList>
              <TabsTrigger value="carga">Carga</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Label>Mes</Label>
              <Select value={monthFilter || "all"} onValueChange={(v: any) => setMonthFilter(v === "all" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {MONTH_OPTIONS.filter((o) => o.value).map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Presupuestos</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Presupuestos por categoría (ARS)</DialogTitle>
                    <DialogDescription>Elegí un mes para setear topes. USD queda fuera.</DialogDescription>
                  </DialogHeader>

                  <div style={ui.modalBody}>
                    {!monthKeyFromFilter ? (
                      <Alert>
                        <AlertTitle>Elegí un mes</AlertTitle>
                        <AlertDescription>Seleccioná un mes específico arriba.</AlertDescription>
                      </Alert>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {ARS_EXPENSE_CATEGORIES.map((c) => {
                          const spent = pivotARS[c]?.[monthKeyFromFilter] || 0;
                          const b = getBudget(monthKeyFromFilter, c);
                          const limit = b?.limitARS || 0;
                          const pct = limit > 0 ? spent / limit : 0;
                          return (
                            <div key={c} style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.8)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                <div style={{ minWidth: 220 }}>
                                  <div style={{ fontWeight: 700 }}>{c}</div>
                                  <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                                    Gastado: <b>{formatMoneyARS(spent)}</b>{" "}
                                    {limit > 0 ? <>· Presupuesto: <b>{formatMoneyARS(limit)}</b></> : null}
                                  </div>
                                </div>
                                <div style={{ flex: 1, minWidth: 200 }}>
                                  <div style={{ height: 8, borderRadius: 999, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
                                    <div style={{ height: 8, width: `${Math.min(pct * 100, 100)}%`, background: pct >= 1 ? "#e11d48" : pct >= 0.8 ? "#f59e0b" : "#10b981" }} />
                                  </div>
                                  <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                                    {limit > 0 ? `${Math.round(pct * 100)}% usado` : "Sin presupuesto"}
                                  </div>
                                </div>
                                <div style={{ minWidth: 220 }}>
                                  <Label>Presupuesto ARS</Label>
                                  <Input
                                    defaultValue={limit ? String(limit) : ""}
                                    placeholder="Ej: 250000"
                                    onBlur={(e) => setBudget(monthKeyFromFilter, c, safeNumber(e.target.value))}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline">Cerrar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* ------------------ TAB CARGA ------------------ */}
          <TabsContent value="carga" className="mt-4">
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{editing ? "Editar movimiento" : "Agregar movimiento"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                    <div>
                      <Label>Categoría</Label>
                      <Select value={category} onValueChange={(v: any) => setCategory(v as Category)}>
                        <SelectTrigger><SelectValue placeholder="Elegí una categoría" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="" disabled>—</SelectItem>
                          {CATEGORIES_EXPENSE.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                          {CATEGORIES_POSITIVE.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.62)", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span>{isExpense(category) ? "Se contabiliza como gasto" : "Se contabiliza como ingreso/ahorro"}</span>
                        {isUSDSelected ? <Badge variant="outline">USD</Badge> : <Badge variant="outline">ARS</Badge>}
                      </div>
                    </div>

                    <div>
                      <Label>{isUSDSelected ? "Monto (USD)" : "Importe (ARS)"}</Label>
                      <Input value={amountStr} onChange={(e) => setAmountStr(e.target.value)} inputMode="decimal" placeholder={isUSDSelected ? "Ej: 35" : "Ej: 125000"} />
                      <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                        Vista: <b>{amountStr ? (isUSDSelected ? formatMoneyUSD(safeNumber(amountStr)) : formatMoneyARS(safeNumber(amountStr))) : "—"}</b>
                      </div>
                    </div>

                    <div>
                      <Label>Fecha</Label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                      <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                        Tip: para dashboard 2026, usá fechas 2026.
                      </div>
                    </div>

                    <div>
                      <Label>Comentario (opcional)</Label>
                      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ej: supermercado + farmacia" />
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={!category || !date || safeNumber(amountStr) <= 0}
                        style={{ flex: 1 }}
                      >
                        {editing ? "Guardar cambios" : "Agregar"}
                      </Button>
                      {editing && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditing(null);
                            setAmountStr("");
                            setComment("");
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>

                    <Separator />

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <Button variant="outline" onClick={exportJSON}>
                        <Download className="h-4 w-4" /> Exportar
                      </Button>

                      <label>
                        <input
                          type="file"
                          accept="application/json"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) importJSON(f);
                            (e.currentTarget as any).value = "";
                          }}
                        />
                        <Button variant="outline" type="button">
                          <Upload className="h-4 w-4" /> Importar
                        </Button>
                      </label>

                      <Button
                        variant="destructive"
                        onClick={() => {
                          setEntries([]);
                          setBudgets([]);
                          localStorage.removeItem(APP_KEY);
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Borrar todo
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <Label>Buscar</Label>
                      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="categoría, fecha, comentario" />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 10 }}>
                      <SummaryKPI title="Ingresos (ARS)" value={formatMoneyARS(totalsCurrentFilter.ingresos)} />
                      <SummaryKPI title="Gastos (ARS)" value={formatMoneyARS(totalsCurrentFilter.gastos)} />
                      <SummaryKPI title="Balance (ARS)" value={formatMoneyARS(totalsCurrentFilter.balance)} emphasis={totalsCurrentFilter.balance >= 0} />
                      <SummaryKPI title="Gastos (USD)" value={formatMoneyUSD(totalsCurrentFilter.gastosUSD)} />
                      <SummaryKPI title="Ahorro (USD)" value={formatMoneyUSD(totalsCurrentFilter.ahorroUSD)} />
                      <SummaryKPI title="Balance (USD)" value={formatMoneyUSD(totalsCurrentFilter.balanceUSD)} emphasis={totalsCurrentFilter.balanceUSD >= 0} />
                    </div>

                    <div style={ui.tableWrap}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead style={{ textAlign: "right" }}>Importe</TableHead>
                            <TableHead>Comentario</TableHead>
                            <TableHead style={{ textAlign: "right" }}>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEntries.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} style={{ textAlign: "center", padding: 24, color: "rgba(0,0,0,0.55)" }}>
                                Sin movimientos todavía.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredEntries.slice(0, 200).map((e) => (
                              <TableRow key={e.id}>
                                <TableCell>{e.date}</TableCell>
                                <TableCell>
                                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                    <span>{e.category}</span>
                                    {isExpense(e.category) ? <Badge variant="secondary">Gasto</Badge> : <Badge variant="default">+</Badge>}
                                    <Badge variant="outline">{e.currency}</Badge>
                                  </div>
                                </TableCell>
                                <TableCell style={{ textAlign: "right" }}>
                                  {e.currency === "USD" ? formatMoneyUSD(e.amount) : formatMoneyARS(e.amount)}
                                </TableCell>
                                <TableCell title={e.comment || ""} style={{ maxWidth: 360, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {e.comment || "—"}
                                </TableCell>
                                <TableCell style={{ textAlign: "right" }}>
                                  <div style={{ display: "inline-flex", gap: 8 }}>
                                    <Button variant="outline" size="icon" onClick={() => startEdit(e)}>
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={() => removeEntry(e)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {filteredEntries.length > 200 && (
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                        Mostrando 200 de {filteredEntries.length}.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ------------------ TAB DASHBOARD ------------------ */}
          <TabsContent value="dashboard" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Dashboard</CardTitle></CardHeader>
              <CardContent>
                <div style={{ display: "grid", gap: 12 }}>
                  {monthKeyFromFilter && (
                    <Card style={{ background: "rgba(255,255,255,0.7)" }}>
                      <CardHeader>
                        <CardTitle>Progreso de presupuestos · {monthLabel(monthKeyFromFilter)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10 }}>
                          {ARS_EXPENSE_CATEGORIES.map((c) => {
                            const b = getBudget(monthKeyFromFilter, c);
                            if (!b) return null;
                            const spent = pivotARS[c]?.[monthKeyFromFilter] || 0;
                            const pct = b.limitARS > 0 ? spent / b.limitARS : 0;
                            const remaining = b.limitARS - spent;
                            return (
                              <div key={c} style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.8)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                                  <div>
                                    <div style={{ fontWeight: 700 }}>{c}</div>
                                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                                      {formatMoneyARS(spent)} / {formatMoneyARS(b.limitARS)} · {Math.round(pct * 100)}%
                                    </div>
                                  </div>
                                  <Badge variant={pct >= 1 ? "destructive" : pct >= 0.8 ? "secondary" : "default"}>
                                    {remaining >= 0 ? `Restan ${formatMoneyARS(remaining)}` : `Exceso ${formatMoneyARS(Math.abs(remaining))}`}
                                  </Badge>
                                </div>
                                <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
                                  <div style={{ height: 8, width: `${Math.min(pct * 100, 100)}%`, background: pct >= 1 ? "#e11d48" : pct >= 0.8 ? "#f59e0b" : "#10b981" }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card style={{ background: "rgba(255,255,255,0.7)" }}>
                    <CardHeader><CardTitle>Salud financiera</CardTitle></CardHeader>
                    <CardContent>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ fontSize: 13, color: "rgba(0,0,0,0.62)" }}>
                          {financialHealth.mode === "month" && monthKeyFromFilter ? `Mes: ${monthLabel(monthKeyFromFilter)}` : "Vista general 2026 (acumulado)"}
                        </div>
                        <Badge variant={financialHealth.status === "ok" ? "default" : financialHealth.status === "warn" ? "secondary" : "destructive"}>
                          Score {financialHealth.score}/100
                        </Badge>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginTop: 12 }}>
                        <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.8)" }}>
                          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>ARS</div>
                          <div style={{ marginTop: 6 }}>Ingresos: <b>{formatMoneyARS(financialHealth.ingresosARS)}</b></div>
                          <div>Gastos: <b>{formatMoneyARS(financialHealth.gastosARS)}</b></div>
                          <div>Balance: <b>{formatMoneyARS(financialHealth.balanceARS)}</b></div>
                          <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                            Tasa de ahorro: {Math.round(financialHealth.savingsRate * 100)}%
                          </div>
                        </div>

                        <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.8)" }}>
                          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>USD</div>
                          <div style={{ marginTop: 6 }}>Ahorro: <b>{formatMoneyUSD(financialHealth.ahorroUSD)}</b></div>
                          <div>Gastos: <b>{formatMoneyUSD(financialHealth.gastosUSD)}</b></div>
                          <div>Balance: <b>{formatMoneyUSD(financialHealth.balanceUSD)}</b></div>
                          <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                            Balance USD = Ahorro USD − Gastos USD
                          </div>
                        </div>

                        <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.8)" }}>
                          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>Alertas</div>
                          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                            {financialHealth.alerts.length === 0 ? (
                              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.62)" }}>Sin alertas.</div>
                            ) : (
                              financialHealth.alerts.map((a, idx) => (
                                <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                  <span style={{ width: 10, height: 10, borderRadius: 999, marginTop: 4, background: a.tone === "bad" ? "#e11d48" : a.tone === "warn" ? "#f59e0b" : "#0ea5e9" }} />
                                  <div style={{ fontSize: 13 }}>{a.text}</div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ background: "rgba(255,255,255,0.7)" }}>
                    <CardHeader><CardTitle>Evolución mensual (ARS)</CardTitle></CardHeader>
                    <CardContent style={{ height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={totalsByMonthARS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(v: any) => formatMoneyARS(Number(v) || 0)} />
                          <Legend />
                          <Line type="monotone" dataKey="ingresos" name="Ingresos" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="gastos" name="Gastos" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="balance" name="Balance" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card style={{ background: "rgba(255,255,255,0.7)" }}>
                    <CardHeader><CardTitle>USD por mes (Gastos + Ahorro)</CardTitle></CardHeader>
                    <CardContent style={{ height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={months.map((m) => ({
                            month: monthLabel(m),
                            gastosUSD: usdExpensesByMonth[m] || 0,
                            ahorroUSD: usdSavingsByMonth[m] || 0,
                            balanceUSD: usdBalanceByMonth[m] || 0,
                          }))}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(v: any) => formatMoneyUSD(Number(v) || 0)} />
                          <Legend />
                          <Line type="monotone" dataKey="gastosUSD" name="Gastos USD" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="ahorroUSD" name="Ahorro USD" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="balanceUSD" name="Balance USD" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card style={{ background: "rgba(255,255,255,0.7)" }}>
                    <CardHeader><CardTitle>Top categorías de gasto (ARS)</CardTitle></CardHeader>
                    <CardContent style={{ height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topCategoriesForBarsARS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={80} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(v: any) => formatMoneyARS(Number(v) || 0)} />
                          <Bar dataKey="total" name="Total" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card style={{ background: "rgba(255,255,255,0.7)" }}>
                    <CardHeader><CardTitle>Comparativa inteligente</CardTitle></CardHeader>
                    <CardContent>
                      {!monthKeyFromFilter || !smartComparison ? (
                        <Alert>
                          <AlertTitle>Tip</AlertTitle>
                          <AlertDescription>Elegí un mes específico para comparar contra el mes anterior.</AlertDescription>
                        </Alert>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
                          <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.8)" }}>
                            <div style={{ fontWeight: 800 }}>Top subas (ARS)</div>
                            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                              {smartComparison.increases.length === 0 ? (
                                <div style={{ color: "rgba(0,0,0,0.62)" }}>Sin subas relevantes.</div>
                              ) : (
                                smartComparison.increases.map((r) => (
                                  <div key={r.category} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                                    <div>
                                      <div style={{ fontWeight: 700 }}>{r.category}</div>
                                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>{formatMoneyARS(r.prv)} → {formatMoneyARS(r.cur)}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                      <div style={{ fontWeight: 800 }}>+{formatMoneyARS(r.delta)}</div>
                                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>{r.pct === null ? "—" : `+${Math.round(r.pct * 100)}%`}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.8)" }}>
                            <div style={{ fontWeight: 800 }}>Top bajas (ARS)</div>
                            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                              {smartComparison.decreases.length === 0 ? (
                                <div style={{ color: "rgba(0,0,0,0.62)" }}>Sin bajas relevantes.</div>
                              ) : (
                                smartComparison.decreases.map((r) => (
                                  <div key={r.category} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                                    <div>
                                      <div style={{ fontWeight: 700 }}>{r.category}</div>
                                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>{formatMoneyARS(r.prv)} → {formatMoneyARS(r.cur)}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                      <div style={{ fontWeight: 800 }}>{formatMoneyARS(r.delta)}</div>
                                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>{r.pct === null ? "—" : `${Math.round(r.pct * 100)}%`}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.8)" }}>
                            <div style={{ fontWeight: 800 }}>Resumen USD</div>
                            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Gastos USD</span>
                                <b>{formatMoneyUSD(smartComparison.usd.gastos.cur)}</b>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Ahorro USD</span>
                                <b>{formatMoneyUSD(smartComparison.usd.ahorro.cur)}</b>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Balance USD</span>
                                <b>{formatMoneyUSD(smartComparison.usd.balance.cur)}</b>
                              </div>
                              <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>Balance USD = Ahorro − Gastos.</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card style={{ background: "rgba(255,255,255,0.7)" }}>
                    <CardHeader><CardTitle>Tabla completa (Categorías x Meses)</CardTitle></CardHeader>
                    <CardContent>
                      <div style={ui.tableWrap}>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead style={{ minWidth: 220 }}>Categoría</TableHead>
                              {months.map((m) => (
                                <TableHead key={m} style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                  {monthLabel(m)}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ALL_CATEGORIES.map((c) => (
                              <TableRow key={c}>
                                <TableCell style={{ fontWeight: 700 }}>
                                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                    <span>{c}</span>
                                    {isExpense(c) ? <Badge variant="secondary">Gasto</Badge> : <Badge variant="default">+</Badge>}
                                    {c === USD_CATEGORY || c === SAVINGS_CATEGORY ? <Badge variant="outline">USD</Badge> : <Badge variant="outline">ARS</Badge>}
                                  </div>
                                </TableCell>
                                {months.map((m) => {
                                  const cell =
                                    c === USD_CATEGORY ? (usdExpensesByMonth[m] || 0)
                                    : c === SAVINGS_CATEGORY ? (usdSavingsByMonth[m] || 0)
                                    : (pivotARS[c]?.[m] || 0);
                                  return (
                                    <TableCell key={m} style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                      {cell ? ((c === USD_CATEGORY || c === SAVINGS_CATEGORY) ? formatMoneyUSD(cell) : formatMoneyARS(cell)) : "—"}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div style={{ marginTop: 18, fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
          Tip: si querés colaboración real, activá Supabase y usen el mismo Room.
        </div>
      </div>
    </div>
  );
}

function SummaryKPI({ title, value, emphasis }: { title: string; value: string; emphasis?: boolean }) {
  return (
    <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 14, padding: 12, background: "rgba(255,255,255,0.75)" }}>
      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800 }}>
        {value}
        {typeof emphasis === "boolean" ? "" : ""}
      </div>
    </div>
  );
}
