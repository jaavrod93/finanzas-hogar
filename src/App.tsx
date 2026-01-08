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
   - Esto hace que el archivo funcione en cualquier template React/TS
   - Estilos: simples e inline (sobrios) para que se vea prolijo
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
function CardContent({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ ...ui.cardContent, ...style }}>{children}</div>;
}

function Button({ children, onClick, variant, disabled, style, type }: any) {
  const base = variant === "destructive" ? ui.buttonDanger : variant === "primary" ? ui.buttonPrimary : ui.button;
  return (
    <button type={type || "button"} onClick={onClick} disabled={disabled} style={{ ...base, opacity: disabled ? 0.6 : 1, ...style }}>
      {children}
    </button>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...ui.input, ...(props.style || {}) }} />;
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...ui.input, minHeight: 88, ...(props.style || {}) }} />;
}
function Label({ children }: { children: React.ReactNode }) {
  return <div style={ui.label}>{children}</div>;
}
function Badge({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <span style={{ ...ui.badge, ...style }}>{children}</span>;
}
function Separator() {
  return <div style={ui.sep} />;
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
  // Convertimos SelectItem a <option>
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
function TabsList({ children }: any) {
  return <div style={{ display: "inline-flex", gap: 8, padding: 6, borderRadius: 14, border: "1px solid rgba(0,0,0,0.10)", background: "rgba(255,255,255,0.8)" }}>{children}</div>;
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
    return React.cloneElement(children as any, { onClick: (e: any) => { (children as any).props?.onClick?.(e); ctx.setOpen(true); } });
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
  amount: number; // monto en la moneda indicada
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

const ARS_EXPENSE_CATEGORIES = (CATEGORIES_EXPENSE as readonly Category[]).filter(
  (c) => c !== USD_CATEGORY
);

// ------------------ Utils ------------------

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function toMonthKey(dateYYYYMMDD: string) {
  return dateYYYYMMDD.slice(0, 7);
}

function monthLabel(monthKey: string) {
  const [y, m] = monthKey.split("-").map((x) => parseInt(x, 10));
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
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
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$ ${Math.round(n).toLocaleString("es-AR")}`;
  }
}

function formatMoneyUSD(n: number) {
  const val = Number.isFinite(n) ? n : 0;
  return `$ ${val.toFixed(2)} USD`;
}

function safeNumber(input: string) {
  const cleaned = input
    .trim()
    .replace(/\./g, "")
    .replace(/,/g, ".")
    .replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function isExpense(cat: Category) {
  return (CATEGORIES_EXPENSE as readonly string[]).includes(cat);
}

function normalizeEntry(raw: any): Entry | null {
  if (!raw || !raw.id || !raw.category || !raw.date) return null;

  const category: Category = raw.category;

  // Backward compat: versiones viejas traían amountARS y nada de currency/amount
  const legacyARS = Number(raw.amountARS);

  // Si es categoría USD, asumimos USD.
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
    const normalizedEntries: Entry[] = Array.isArray(parsed.entries)
      ? parsed.entries.map(normalizeEntry).filter(Boolean)
      : [];

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
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const mm = String(i + 1).padStart(2, "0");
        return `2026-${mm}`;
      }),
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

  const monthKeyFromFilter = useMemo(
    () => (monthFilter ? `2026-${monthFilter}` : ""),
    [monthFilter]
  );

  // Lista fija de meses (2026)
  const months = useMemo(() => MONTHS_2026, [MONTHS_2026]);

  // ------------------ Budgets lookup (DEBE estar ANTES de cualquier useMemo que llame a getBudget) ------------------
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

  // cargar local al iniciar
  useEffect(() => {
    const { entries: e, budgets: b, collab: c } = loadLocal();
    setEntries(e.sort((a, b2) => b2.date.localeCompare(a.date)));
    setBudgets(b);
    setCollab(c);
  }, []);

  // guardar local
  useEffect(() => {
    saveLocal(entries, budgets, collab);
  }, [entries, budgets, collab]);

  // conectar/desconectar supabase
  useEffect(() => {
    let cancelled = false;

    async function cleanup() {
      try {
        if (channelRef.current && supabaseRef.current) {
          await supabaseRef.current.removeChannel(channelRef.current);
        }
      } catch {
        // ignore
      }
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

        // pull inicial
        const { data: remoteEntries, error: eErr } = await supabase
          .from("finance_entries")
          .select("*")
          .eq("room", collab.room);
        if (eErr) throw eErr;

        const { data: remoteBudgets, error: bErr } = await supabase
          .from("finance_budgets")
          .select("*")
          .eq("room", collab.room);
        if (bErr) throw bErr;

        // merge local <- remoto (remoto gana por updatedAt)
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

        // realtime
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collab.enabled, collab.supabaseUrl, collab.supabaseAnonKey, collab.room]);

  // ------------ Remote helpers ------------

  async function upsertRemote(e: Entry) {
    if (!collab.enabled || collabStatus !== "online" || !supabaseRef.current) return;
    const supabase = supabaseRef.current;

    // Para mantener compatibilidad si tu tabla hoy solo tiene amountARS, dejamos amountARS cargado:
    // - ARS: amountARS = amount
    // - USD: amountUSD = amount, amountARS = 0 (no convertimos)
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
    const { error } = await supabase
      .from("finance_entries")
      .delete()
      .eq("id", id)
      .eq("room", collab.room);
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
    const { error } = await supabase
      .from("finance_budgets")
      .delete()
      .eq("id", id)
      .eq("room", collab.room);
    if (error) throw error;
  }

  // ------------ Actions ------------

  async function handleSubmit() {
    const amount = safeNumber(amountStr);
    if (!category || !date || !Number.isFinite(amount) || amount <= 0) return;

    const currency: Currency = category === USD_CATEGORY || category === SAVINGS_CATEGORY ? "USD" : "ARS";

    if (editing) {
      const updated: Entry = {
        ...editing,
        category,
        currency,
        amount,
        date,
        comment,
        updatedAt: Date.now(),
      };
      setEntries((prev) =>
        prev
          .map((x) => (x.id === updated.id ? updated : x))
          .sort((a, b) => b.date.localeCompare(a.date))
      );
      setEditing(null);
      setAmountStr("");
      setComment("");
      try {
        await upsertRemote(updated);
      } catch (e: any) {
        setCollabStatus("error");
        setCollabError(e?.message || "Error guardando en Supabase");
      }
      return;
    }

    const now = Date.now();
    const newEntry: Entry = {
      id: uid(),
      category,
      currency,
      amount,
      date,
      comment,
      createdAt: now,
      updatedAt: now,
    };
    setEntries((prev) => [newEntry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    setAmountStr("");
    setComment("");

    try {
      await upsertRemote(newEntry);
    } catch (e: any) {
      setCollabStatus("error");
      setCollabError(e?.message || "Error guardando en Supabase");
    }
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
    try {
      await deleteRemote(e.id);
    } catch (err: any) {
      setCollabStatus("error");
      setCollabError(err?.message || "Error borrando en Supabase");
    }
  }

  async function setBudget(monthKey: string, cat: Category, limitARS: number) {
    const id = budgetId(monthKey, cat);
    const now = Date.now();

    if (!Number.isFinite(limitARS) || limitARS <= 0) {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      try {
        await deleteBudgetRemote(id);
      } catch (e: any) {
        setCollabStatus("error");
        setCollabError(e?.message || "Error borrando presupuesto en Supabase");
      }
      return;
    }

    const next: Budget = { id, monthKey, category: cat, limitARS, updatedAt: now };
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx >= 0) {
        const copy = prev.slice();
        copy[idx] = next;
        return copy;
      }
      return [...prev, next];
    });

    try {
      await upsertBudgetRemote(next);
    } catch (e: any) {
      setCollabStatus("error");
      setCollabError(e?.message || "Error guardando presupuesto en Supabase");
    }
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ entries, budgets }, null, 2)], {
      type: "application/json",
    });
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
      } catch {
        // ignore
      }
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
    return scopedEntries.filter((e) => {
      return (
        e.category.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q) ||
        (e.comment || "").toLowerCase().includes(q)
      );
    });
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
    for (const m of MONTHS_2026) {
      out[m] = (usdSavingsByMonth[m] || 0) - (usdExpensesByMonth[m] || 0);
    }
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
          // ARS expenses, excluye la categoría USD
          if (e.category !== USD_CATEGORY) gastos += e.amount;
        } else {
          ingresos += e.amount;
        }
      }
    }

    return {
      ingresos,
      gastos,
      balance: ingresos - gastos,
      gastosUSD,
      ahorroUSD,
      balanceUSD: ahorroUSD - gastosUSD,
    };
  }, [scopedEntries]);

  const totalsByMonthARS = useMemo(() => {
    return MONTHS_2026.map((m) => {
      const ingresos = (pivotARS["Ingresos Javi"]?.[m] || 0) + (pivotARS["Ingresos Miki"]?.[m] || 0);
      let gastos = 0;
      for (const c of ARS_EXPENSE_CATEGORIES) gastos += pivotARS[c]?.[m] || 0;
      return {
        month: monthLabel(m),
        ingresos,
        gastos,
        balance: ingresos - gastos,
      };
    });
  }, [MONTHS_2026, pivotARS]);

  const topCategoriesForBarsARS = useMemo(() => {
    const mk = monthKeyFromFilter;
    const totals: Array<{ category: string; total: number }> = [];
    for (const c of ARS_EXPENSE_CATEGORIES) {
      const total = mk
        ? (pivotARS[c]?.[mk] || 0)
        : MONTHS_2026.reduce((acc, m) => acc + (pivotARS[c]?.[m] || 0), 0);
      totals.push({ category: c, total });
    }
    totals.sort((a, b) => b.total - a.total);
    return totals.slice(0, 10);
  }, [ARS_EXPENSE_CATEGORIES, MONTHS_2026, pivotARS, monthKeyFromFilter]);

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

    const increases = rows
      .filter((r) => r.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 5);

    const decreases = rows
      .filter((r) => r.delta < 0)
      .sort((a, b) => a.delta - b.delta)
      .slice(0, 5);

    const usd = {
      gastos: {
        cur: usdExpensesByMonth[cur] || 0,
        prv: usdExpensesByMonth[prev] || 0,
        delta: (usdExpensesByMonth[cur] || 0) - (usdExpensesByMonth[prev] || 0),
      },
      ahorro: {
        cur: usdSavingsByMonth[cur] || 0,
        prv: usdSavingsByMonth[prev] || 0,
        delta: (usdSavingsByMonth[cur] || 0) - (usdSavingsByMonth[prev] || 0),
      },
      balance: {
        cur: usdBalanceByMonth[cur] || 0,
        prv: usdBalanceByMonth[prev] || 0,
        delta: (usdBalanceByMonth[cur] || 0) - (usdBalanceByMonth[prev] || 0),
      },
    };

    return { prev, increases, decreases, usd };
  }, [monthKeyFromFilter, pivotARS, ARS_EXPENSE_CATEGORIES, usdExpensesByMonth, usdSavingsByMonth, usdBalanceByMonth]);

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
      // alertas por presupuestos
      for (const c of ARS_EXPENSE_CATEGORIES) {
        const b = getBudget(monthKeyFromFilter, c);
        if (!b || !b.limitARS) continue;
        const spent = pivotARS[c]?.[monthKeyFromFilter] || 0;
        if (spent > b.limitARS) alerts.push({ tone: "warn", text: `Presupuesto excedido en ${c}.` });
      }
    }

    // score simple
    let score = 60;
    if (ingresosARS > 0) score += Math.round(savingsRate * 30);
    if (balanceARS < 0) score -= 20;
    if (alerts.some((a) => a.tone === "bad")) score -= 10;
    score = Math.max(0, Math.min(100, score));

    const status = score >= 75 ? "ok" : score >= 55 ? "warn" : "bad";

    return {
      mode,
      status,
      score,
      ingresosARS,
      gastosARS,
      balanceARS,
      savingsRate,
      gastosUSD,
      ahorroUSD,
      balanceUSD,
      alerts,
    };
  }, [monthKeyFromFilter, totalsCurrentFilter, ARS_EXPENSE_CATEGORIES, pivotARS, getBudget]);

  // ------------------ UI ------------------

  const isUSDSelected = category === USD_CATEGORY || category === SAVINGS_CATEGORY;

  return (
    <div className="min-h-screen w-full text-foreground bg-gradient-to-b from-sky-50 via-background to-emerald-50 dark:from-slate-950 dark:via-background dark:to-slate-900">
      <div className="mx-auto max-w-6xl p-4 md:p-8 relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10" />
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Finanzas del Hogar</h1>
            <p className="text-sm text-muted-foreground">
              2026 · Cargá gastos, ingresos y ahorro en ARS, y USD por separado como una economía distinta.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={collabStatus === "online" ? "default" : "secondary"} className="rounded-full">
              {collab.enabled ? (collabStatus === "online" ? "Colaborativo online" : collabStatus) : "Modo local"}
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-2xl bg-white/50 dark:bg-white/5">
                  <RefreshCcw className="h-4 w-4" /> Colaboración
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edición colaborativa (opcional)</DialogTitle>
                  <DialogDescription>
                    Por defecto la app guarda en tu navegador (localStorage). Si querés que se sincronice entre dos o más
                    dispositivos en tiempo real, activá Supabase.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border p-3">
                      <div>
                        <div className="font-medium">Activar Supabase</div>
                        <div className="text-xs text-muted-foreground">Sincronización y realtime</div>
                      </div>
                      <Switch
                        checked={collab.enabled}
                        onCheckedChange={(v) => setCollab((c) => ({ ...c, enabled: Boolean(v) }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Room (nombre de familia)</Label>
                      <Input
                        value={collab.room}
                        onChange={(e) => setCollab((c) => ({ ...c, room: e.target.value.trim() || "familia" }))}
                        placeholder="ej: rodriguez"
                      />
                      <p className="text-xs text-muted-foreground">
                        Usen el mismo room en todos los dispositivos para ver los mismos datos.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Supabase URL</Label>
                      <Input
                        value={collab.supabaseUrl}
                        onChange={(e) => setCollab((c) => ({ ...c, supabaseUrl: e.target.value }))}
                        placeholder="https://xxxx.supabase.co"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Supabase Anon Key</Label>
                      <Input
                        value={collab.supabaseAnonKey}
                        onChange={(e) => setCollab((c) => ({ ...c, supabaseAnonKey: e.target.value }))}
                        placeholder="eyJhbGciOi..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Alert>
                      <AlertTitle>Checklist rápido</AlertTitle>
                      <AlertDescription>
                        <ol className="list-decimal ml-5 space-y-1 text-sm">
                          <li>Crear un proyecto en Supabase</li>
                          <li>
                            Crear tablas <span className="font-mono">finance_entries</span> y{" "}
                            <span className="font-mono">finance_budgets</span> (DDL abajo)
                          </li>
                          <li>Activar Realtime para ambas tablas</li>
                          <li>Pegar URL + Anon Key</li>
                        </ol>
                      </AlertDescription>
                    </Alert>

                    {collabStatus === "error" && (
                      <Alert>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{collabError || "Revisá credenciales y Realtime"}</AlertDescription>
                      </Alert>
                    )}

                    <div className="rounded-xl border p-3">
                      <div className="text-sm font-medium">Privacidad</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Para producción, lo ideal es habilitar RLS + autenticación. Para uso familiar simple, podés mantenerlo
                        privado y agregar RLS más adelante.
                      </p>
                    </div>
                  </div>
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

        <Separator className="my-6" />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <TabsList className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur border shadow-sm">
              <TabsTrigger value="carga">Carga</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Mes</Label>
                <Select value={monthFilter || "all"} onValueChange={(v) => setMonthFilter(v === "all" ? "" : v)}>
                  <SelectTrigger className="w-[180px] rounded-2xl bg-white/50 dark:bg-white/5">
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
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-2xl bg-white/50 dark:bg-white/5">
                    Presupuestos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Presupuestos por categoría (ARS)</DialogTitle>
                    <DialogDescription>
                      Definí un tope mensual por categoría en ARS. USD queda fuera porque es otra economía.
                    </DialogDescription>
                  </DialogHeader>

                  {!monthKeyFromFilter ? (
                    <Alert>
                      <AlertTitle>Elegí un mes</AlertTitle>
                      <AlertDescription>
                        Para definir presupuestos, seleccioná un mes específico (Enero..Diciembre).
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
                      {ARS_EXPENSE_CATEGORIES.map((c) => {
                        const spent = pivotARS[c]?.[monthKeyFromFilter] || 0;
                        const b = getBudget(monthKeyFromFilter, c);
                        const limit = b?.limitARS || 0;
                        const pctLabel = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                        const pct = limit > 0 ? spent / limit : 0;
                        return (
                          <div key={c} className="rounded-2xl border p-3 bg-white/40 dark:bg-white/5">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div className="min-w-[190px]">
                                <div className="font-medium">{c}</div>
                                <div className="text-xs text-muted-foreground">
                                  Gastado: <span className="font-medium">{formatMoneyARS(spent)}</span>
                                  {limit > 0 ? (
                                    <>
                                      {" "}· Presupuesto: <span className="font-medium">{formatMoneyARS(limit)}</span>
                                    </>
                                  ) : null}
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                  {limit > 0 ? (
                                    <div
                                      className={`h-2 ${progressColorClass(pct)} rounded-full`}
                                      style={{ width: `${Math.min(pct * 100, 100)}%` }}
                                    />
                                  ) : (
                                    <div className="h-2 bg-transparent" />
                                  )}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {limit > 0 ? `${pctLabel}% usado` : "Sin presupuesto"}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs">Presupuesto ARS</Label>
                                <Input
                                  className="w-[180px] rounded-2xl"
                                  inputMode="decimal"
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

                  <DialogFooter>
                    <Button variant="outline" className="rounded-2xl">Cerrar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="carga" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-1 rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm">
                <CardHeader>
                  <CardTitle>{editing ? "Editar movimiento" : "Agregar movimiento"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Elegí una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1 text-xs text-muted-foreground">Gastos</div>
                        {CATEGORIES_EXPENSE.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs text-muted-foreground">Positivos</div>
                        {CATEGORIES_POSITIVE.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>
                        {isExpense(category)
                          ? "Se contabiliza como gasto"
                          : "Se contabiliza como ingreso/ahorro"}
                      </span>
                      {isUSDSelected && <Badge variant="outline" className="rounded-full">USD</Badge>}
                      {!isUSDSelected && isExpense(category) && <Badge variant="outline" className="rounded-full">ARS</Badge>}
                      {!isExpense(category) && !isUSDSelected && <Badge variant="outline" className="rounded-full">ARS</Badge>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{isUSDSelected ? "Monto (USD)" : "Importe (ARS)"}</Label>
                    <Input
                      value={amountStr}
                      onChange={(e) => setAmountStr(e.target.value)}
                      inputMode="decimal"
                      placeholder={isUSDSelected ? "Ej: 35" : "Ej: 125000"}
                      className="rounded-2xl"
                    />
                    <div className="text-xs text-muted-foreground">
                      Vista:{" "}
                      <span className="font-medium">
                        {amountStr
                          ? isUSDSelected
                            ? formatMoneyUSD(safeNumber(amountStr))
                            : formatMoneyARS(safeNumber(amountStr))
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl" />
                    <div className="text-xs text-muted-foreground">Tip: para que se vea en el dashboard, usá fechas 2026.</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Comentario (opcional)</Label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Ej: supermercado + farmacia"
                      className="rounded-2xl"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 rounded-2xl"
                      onClick={handleSubmit}
                      disabled={!category || !date || safeNumber(amountStr) <= 0}
                    >
                      {editing ? "Guardar cambios" : "Agregar"}
                    </Button>
                    {editing && (
                      <Button
                        variant="outline"
                        className="rounded-2xl"
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

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2 rounded-2xl" onClick={exportJSON}>
                      <Download className="h-4 w-4" /> Exportar
                    </Button>
                    <label className="inline-flex">
                      <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) importJSON(f);
                          e.currentTarget.value = "";
                        }}
                      />
                      <Button variant="outline" className="gap-2 rounded-2xl" type="button">
                        <Upload className="h-4 w-4" /> Importar
                      </Button>
                    </label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="gap-2 rounded-2xl">
                          <Trash2 className="h-4 w-4" /> Borrar todo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>¿Borrar todo?</DialogTitle>
                          <DialogDescription>
                            Esto elimina los datos locales del navegador. Si tenés Supabase activado, no borra remoto.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Cancelar</Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setEntries([]);
                              setBudgets([]);
                              localStorage.removeItem(APP_KEY);
                            }}
                          >
                            Borrar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <CardTitle>Movimientos</CardTitle>
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar (categoría, fecha, comentario)"
                      className="w-full md:w-[340px] rounded-2xl"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
                    <SummaryKPI title="Ingresos (ARS)" value={formatMoneyARS(totalsCurrentFilter.ingresos)} />
                    <SummaryKPI title="Gastos (ARS)" value={formatMoneyARS(totalsCurrentFilter.gastos)} />
                    <SummaryKPI
                      title="Balance (ARS)"
                      value={formatMoneyARS(totalsCurrentFilter.balance)}
                      emphasis={totalsCurrentFilter.balance >= 0}
                    />
                    <SummaryKPI title="Gastos (USD)" value={formatMoneyUSD(totalsCurrentFilter.gastosUSD)} />
                    <SummaryKPI title="Ahorro (USD)" value={formatMoneyUSD(totalsCurrentFilter.ahorroUSD)} />
                    <SummaryKPI
                      title="Balance (USD)"
                      value={formatMoneyUSD(totalsCurrentFilter.balanceUSD)}
                      emphasis={totalsCurrentFilter.balanceUSD >= 0}
                    />
                  </div>

                  <div className="rounded-3xl border border-white/40 bg-white/40 dark:bg-white/5 overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-white/30 dark:bg-white/5">
                          <TableHead>Fecha</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">Importe</TableHead>
                          <TableHead>Comentario</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEntries.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">
                              Sin movimientos todavía.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredEntries.slice(0, 200).map((e) => (
                            <TableRow key={e.id} className="transition-colors hover:bg-white/30 dark:hover:bg-white/5">
                              <TableCell className="whitespace-nowrap">{e.date}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span>{e.category}</span>
                                  {isExpense(e.category) ? <Badge variant="secondary">Gasto</Badge> : <Badge>+</Badge>}
                                  <Badge variant="outline" className="rounded-full">{e.currency}</Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {e.currency === "USD" ? formatMoneyUSD(e.amount) : formatMoneyARS(e.amount)}
                              </TableCell>
                              <TableCell className="max-w-[340px] truncate" title={e.comment || ""}>{e.comment || "—"}</TableCell>
                              <TableCell className="text-right">
                                <div className="inline-flex gap-2">
                                  <Button variant="outline" size="icon" onClick={() => startEdit(e)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Eliminar movimiento</DialogTitle>
                                        <DialogDescription>
                                          {e.date} · {e.category} · {e.currency === "USD" ? formatMoneyUSD(e.amount) : formatMoneyARS(e.amount)}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button variant="outline">Cancelar</Button>
                                        <Button variant="destructive" onClick={() => removeEntry(e)}>
                                          Eliminar
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredEntries.length > 200 && (
                    <p className="text-xs text-muted-foreground mt-2">Mostrando 200 de {filteredEntries.length} resultados.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-4">
            <Card className="rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm">
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-3xl border border-white/40 bg-white/40 dark:bg-white/5 overflow-auto shadow-sm">
                  {monthKeyFromFilter && (
                    <div className="p-3">
                      <div className="text-sm font-medium">Progreso de presupuestos · {monthLabel(monthKeyFromFilter)}</div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ARS_EXPENSE_CATEGORIES.map((c) => {
                          const b = getBudget(monthKeyFromFilter, c);
                          if (!b) return null;
                          const spent = pivotARS[c]?.[monthKeyFromFilter] || 0;
                          const pct = b.limitARS > 0 ? spent / b.limitARS : 0;
                          const remaining = b.limitARS - spent;
                          return (
                            <div key={c} className="rounded-2xl border p-3 bg-white/30 dark:bg-white/5">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-sm font-medium">{c}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatMoneyARS(spent)} / {formatMoneyARS(b.limitARS)} · {Math.round(pct * 100)}%
                                  </div>
                                </div>
                                <Badge
                                  className="rounded-full"
                                  variant={pct >= 1 ? "destructive" : pct >= 0.8 ? "secondary" : "default"}
                                >
                                  {remaining >= 0
                                    ? `Restan ${formatMoneyARS(remaining)}`
                                    : `Exceso ${formatMoneyARS(Math.abs(remaining))}`}
                                </Badge>
                              </div>
                              <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                  className={`h-2 ${progressColorClass(pct)} rounded-full`}
                                  style={{ width: `${Math.min(pct * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="p-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="text-sm font-medium">Salud financiera</div>
                        <div className="text-xs text-muted-foreground">
                          {financialHealth.mode === "month" && monthKeyFromFilter
                            ? `Mes: ${monthLabel(monthKeyFromFilter)}`
                            : "Vista general 2026 (acumulado)"}
                        </div>
                      </div>
                      <Badge
                        className="rounded-full"
                        variant={
                          financialHealth.status === "ok"
                            ? "default"
                            : financialHealth.status === "warn"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        Score {financialHealth.score}/100
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="rounded-2xl border p-3 bg-white/30 dark:bg-white/5">
                        <div className="text-xs text-muted-foreground">ARS</div>
                        <div className="mt-1 text-sm">Ingresos: <span className="font-semibold">{formatMoneyARS(financialHealth.ingresosARS)}</span></div>
                        <div className="text-sm">Gastos: <span className="font-semibold">{formatMoneyARS(financialHealth.gastosARS)}</span></div>
                        <div className="text-sm">Balance: <span className="font-semibold">{formatMoneyARS(financialHealth.balanceARS)}</span></div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Tasa de ahorro: {Math.round(financialHealth.savingsRate * 100)}%
                        </div>
                      </div>

                      <div className="rounded-2xl border p-3 bg-white/30 dark:bg-white/5">
                        <div className="text-xs text-muted-foreground">USD</div>
                        <div className="mt-1 text-sm">Ahorro: <span className="font-semibold">{formatMoneyUSD(financialHealth.ahorroUSD)}</span></div>
                        <div className="text-sm">Gastos: <span className="font-semibold">{formatMoneyUSD(financialHealth.gastosUSD)}</span></div>
                        <div className="text-sm">Balance: <span className="font-semibold">{formatMoneyUSD(financialHealth.balanceUSD)}</span></div>
                        <div className="mt-2 text-xs text-muted-foreground">Balance USD = Ahorro USD − Gastos USD.</div>
                      </div>

                      <div className="rounded-2xl border p-3 bg-white/30 dark:bg-white/5">
                        <div className="text-xs text-muted-foreground">Alertas</div>
                        <div className="mt-2 space-y-2">
                          {financialHealth.alerts.length === 0 ? (
                            <div className="text-sm text-muted-foreground">Sin alertas.</div>
                          ) : (
                            financialHealth.alerts.map((a, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span
                                  className={`mt-1 inline-block h-2 w-2 rounded-full ${
                                    a.tone === "bad" ? "bg-rose-500" : a.tone === "warn" ? "bg-amber-500" : "bg-sky-500"
                                  }`}
                                />
                                <div className="text-sm leading-snug">{a.text}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Table>
                    <TableHeader className="sticky top-0 z-20">
                      <TableRow className="bg-white/40 dark:bg-white/5">
                        <TableHead className="sticky left-0 bg-white/60 dark:bg-background/80 backdrop-blur z-10 min-w-[240px]">Categoría</TableHead>
                        {months.map((m, idx) => (
                          <TableHead
                            key={m}
                            className={`whitespace-nowrap text-right ${idx === 0 ? "" : "border-l"} bg-white/30 dark:bg-white/5`}
                          >
                            {monthLabel(m)}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ALL_CATEGORIES.map((c) => (
                        <TableRow key={c} className="transition-colors hover:bg-white/20 dark:hover:bg-white/5">
                          <TableCell className="sticky left-0 bg-white/60 dark:bg-background/80 backdrop-blur z-10 font-medium">
                            <div className="flex items-center gap-2">
                              <span>{c}</span>
                              {isExpense(c) ? <Badge variant="secondary">Gasto</Badge> : <Badge>+</Badge>}
                              {c === USD_CATEGORY || c === SAVINGS_CATEGORY ? (
                                <Badge variant="outline" className="rounded-full">USD</Badge>
                              ) : (
                                <Badge variant="outline" className="rounded-full">ARS</Badge>
                              )}
                            </div>
                          </TableCell>
                          {months.map((m, idx) => {
                            const cell = c === USD_CATEGORY
                              ? (usdExpensesByMonth[m] || 0)
                              : c === SAVINGS_CATEGORY
                                ? (usdSavingsByMonth[m] || 0)
                                : (pivotARS[c]?.[m] || 0);
                            return (
                              <TableCell
                                key={m}
                                className={`text-right tabular-nums whitespace-nowrap ${idx === 0 ? "" : "border-l"} ${idx % 2 === 0 ? "bg-white/20 dark:bg-white/0" : "bg-white/10 dark:bg-white/0"}`}
                              >
                                {cell ? ((c === USD_CATEGORY || c === SAVINGS_CATEGORY) ? formatMoneyUSD(cell) : formatMoneyARS(cell)) : "—"}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}

                      <TableRow>
                        <TableCell className="sticky left-0 bg-white/60 dark:bg-background/80 backdrop-blur z-10 font-semibold">
                          Totales (Gastos ARS)
                        </TableCell>
                        {months.map((m, idx) => {
                          let total = 0;
                          for (const c of ARS_EXPENSE_CATEGORIES) total += pivotARS[c]?.[m] || 0;
                          return (
                            <TableCell
                              key={m}
                              className={`text-right tabular-nums font-semibold whitespace-nowrap ${idx === 0 ? "" : "border-l"}`}
                            >
                              {total ? formatMoneyARS(total) : "—"}
                            </TableCell>
                          );
                        })}
                      </TableRow>

                      <TableRow>
                        <TableCell className="sticky left-0 bg-white/60 dark:bg-background/80 backdrop-blur z-10 font-semibold">
                          Totales (Ingresos ARS)
                        </TableCell>
                        {months.map((m, idx) => {
                          const total = (pivotARS["Ingresos Javi"]?.[m] || 0) + (pivotARS["Ingresos Miki"]?.[m] || 0);
                          return (
                            <TableCell key={m} className={`text-right tabular-nums font-semibold whitespace-nowrap ${idx === 0 ? "" : "border-l"}`}>
                              {total ? formatMoneyARS(total) : "—"}
                            </TableCell>
                          );
                        })}
                      </TableRow>

                      <TableRow>
                        <TableCell className="sticky left-0 bg-white/60 dark:bg-background/80 backdrop-blur z-10 font-semibold">
                          Totales (Ahorro USD)
                        </TableCell>
                        {months.map((m, idx) => {
                          const total = usdSavingsByMonth[m] || 0;
                          return (
                            <TableCell
                              key={m}
                              className={`text-right tabular-nums font-semibold whitespace-nowrap ${idx === 0 ? "" : "border-l"}`}
                            >
                              {total ? formatMoneyUSD(total) : "—"}
                            </TableCell>
                          );
                        })}
                      </TableRow>

                      <TableRow>
                        <TableCell className="sticky left-0 bg-white/60 dark:bg-background/80 backdrop-blur z-10 font-semibold">
                          Totales (Gastos USD)
                        </TableCell>
                        {months.map((m, idx) => {
                          const total = usdExpensesByMonth[m] || 0;
                          return (
                            <TableCell key={m} className={`text-right tabular-nums font-semibold whitespace-nowrap ${idx === 0 ? "" : "border-l"}`}>
                              {total ? formatMoneyUSD(total) : "—"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Separator className="my-6" />

                <div className="rounded-3xl border border-white/40 bg-white/40 dark:bg-white/5 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-sm font-medium">Comparativa inteligente</div>
                      <div className="text-xs text-muted-foreground">
                        {monthKeyFromFilter
                          ? `Comparando ${monthLabel(monthKeyFromFilter)} vs ${smartComparison?.prev ? monthLabel(smartComparison.prev) : "(sin mes previo)"}`
                          : "Seleccioná un mes para ver variaciones vs el mes anterior."}
                      </div>
                    </div>
                    {!monthKeyFromFilter && (
                      <Badge variant="secondary" className="rounded-full">
                        Elegí un mes arriba
                      </Badge>
                    )}
                  </div>

                  {!monthKeyFromFilter || !smartComparison ? (
                    <div className="mt-3">
                      <Alert>
                        <AlertTitle>Tip</AlertTitle>
                        <AlertDescription>
                          Elegí un mes (Enero..Diciembre) en el selector de arriba para ver subas/bajas por categoría y alertas.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="rounded-2xl border p-3 bg-white/30 dark:bg-white/5">
                        <div className="text-sm font-semibold">Top subas (ARS)</div>
                        <div className="mt-2 space-y-2">
                          {smartComparison.increases.length === 0 ? (
                            <div className="text-sm text-muted-foreground">Sin subas relevantes.</div>
                          ) : (
                            smartComparison.increases.map((r) => (
                              <div key={r.category} className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-medium">{r.category}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatMoneyARS(r.prv)} → {formatMoneyARS(r.cur)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-semibold">+{formatMoneyARS(r.delta)}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {r.pct === null ? "—" : `+${Math.round(r.pct * 100)}%`}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border p-3 bg-white/30 dark:bg-white/5">
                        <div className="text-sm font-semibold">Top bajas (ARS)</div>
                        <div className="mt-2 space-y-2">
                          {smartComparison.decreases.length === 0 ? (
                            <div className="text-sm text-muted-foreground">Sin bajas relevantes.</div>
                          ) : (
                            smartComparison.decreases.map((r) => (
                              <div key={r.category} className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-medium">{r.category}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatMoneyARS(r.prv)} → {formatMoneyARS(r.cur)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-semibold">{formatMoneyARS(r.delta)}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {r.pct === null ? "—" : `${Math.round(r.pct * 100)}%`}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border p-3 bg-white/30 dark:bg-white/5">
                        <div className="text-sm font-semibold">Resumen USD</div>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">Gastos USD</div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">{formatMoneyUSD(smartComparison.usd.gastos.cur)}</div>
                              <div className="text-xs text-muted-foreground">
                                Δ {formatMoneyUSD(smartComparison.usd.gastos.delta)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">Ahorro USD</div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">{formatMoneyUSD(smartComparison.usd.ahorro.cur)}</div>
                              <div className="text-xs text-muted-foreground">
                                Δ {formatMoneyUSD(smartComparison.usd.ahorro.delta)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">Balance USD</div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">{formatMoneyUSD(smartComparison.usd.balance.cur)}</div>
                              <div className="text-xs text-muted-foreground">
                                Δ {formatMoneyUSD(smartComparison.usd.balance.delta)}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Balance USD = Ahorro USD − Gastos USD.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base">Evolución mensual (ARS)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px]">
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

                  <Card className="rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">USD por mes (Gastos + Ahorro)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px]">
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

                  <Card className="rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm lg:col-span-3">
                    <CardHeader>
                      <CardTitle className="text-base">Top categorías de gasto (ARS)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px]">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-10 rounded-2xl border p-4 text-xs text-muted-foreground bg-white/40 dark:bg-white/5">
          <div className="font-medium text-foreground">DDL sugerido para Supabase</div>
          <p className="mt-1">
            Copiá/pegá en el SQL editor de Supabase. Luego, en Database → Replication, habilitá Realtime para estas tablas.
          </p>
          <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-muted p-3 overflow-auto">
{`-- Tabla principal (ARS + USD separado)
create table if not exists public.finance_entries (
  room text not null,
  id text primary key,
  category text not null,
  currency text not null default 'ARS',
  amount numeric not null,
  -- Campos legacy/compat (opcional pero recomendados si ya los usabas)
  amountARS numeric not null default 0,
  amountUSD numeric,
  date text not null,
  comment text,
  createdAt bigint not null,
  updatedAt bigint not null
);

-- Presupuestos mensuales (ARS)
create table if not exists public.finance_budgets (
  room text not null,
  id text primary key,
  monthKey text not null,
  category text not null,
  limitARS numeric not null,
  updatedAt bigint not null
);

-- Índices útiles
create index if not exists finance_entries_room_idx on public.finance_entries(room);
create index if not exists finance_entries_room_date_idx on public.finance_entries(room, date);

create index if not exists finance_budgets_room_idx on public.finance_budgets(room);
create index if not exists finance_budgets_room_month_idx on public.finance_budgets(room, monthKey);

-- (Opcional) RLS
-- alter table public.finance_entries enable row level security;
-- alter table public.finance_budgets enable row level security;
-- create policy "room_read" on public.finance_entries for select using (true);
-- create policy "room_write" on public.finance_entries for insert with check (true);
-- create policy "room_update" on public.finance_entries for update using (true);
-- create policy "room_delete" on public.finance_entries for delete using (true);
-- create policy "budgets_read" on public.finance_budgets for select using (true);
-- create policy "budgets_write" on public.finance_budgets for insert with check (true);
-- create policy "budgets_update" on public.finance_budgets for update using (true);
-- create policy "budgets_delete" on public.finance_budgets for delete using (true);
`}
          </pre>
        </div>
      </div>
    </div>
  );
}

function SummaryKPI({
  title,
  value,
  emphasis,
}: {
  title: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/50 dark:bg-white/5 p-3 shadow-sm backdrop-blur">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className={`mt-1 text-lg font-semibold tabular-nums ${emphasis ? "" : ""}`}>{value}</div>
    </div>
  );
}
