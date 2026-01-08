import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
  CSSProperties,
  ReactNode,
} from "react";
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

/* =========================================================
   UI PORTABLE (CRA-safe, sin shadcn, sin Vite)
========================================================= */

type Variant = "default" | "secondary" | "destructive" | "outline";

const ui = {
  card: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,.4)",
    background: "rgba(255,255,255,.65)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 30px rgba(0,0,0,.08)",
  } as CSSProperties,

  buttonBase: {
    borderRadius: 999,
    padding: "10px 16px",
    border: "1px solid rgba(0,0,0,.12)",
    cursor: "pointer",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  } as CSSProperties,

  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,.15)",
    outline: "none",
  } as CSSProperties,
};

/* ------------------ COMPONENTES BASE ------------------ */

function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...ui.card, ...style }}>{children}</div>;
}

function Button({
  children,
  variant = "default",
  className,
  style,
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const colors: Record<Variant, CSSProperties> = {
    default: { background: "#0ea5e9", color: "white" },
    secondary: { background: "#e5e7eb", color: "#111" },
    destructive: { background: "#e11d48", color: "white" },
    outline: { background: "transparent" },
  };

  return (
    <button
      {...rest}
      className={className}
      style={{ ...ui.buttonBase, ...colors[variant], ...style }}
    >
      {children}
    </button>
  );
}

function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const styles: Record<Variant, CSSProperties> = {
    default: { background: "#0ea5e9", color: "white" },
    secondary: { background: "#e5e7eb", color: "#111" },
    destructive: { background: "#e11d48", color: "white" },
    outline: { background: "transparent", border: "1px solid rgba(0,0,0,.2)" },
  };

  return (
    <span
      className={className}
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        ...styles[variant],
      }}
    >
      {children}
    </span>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={ui.input} />;
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [items, setItems] = useState<
    { id: string; amount: number; category: string }[]
  >([]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  function add() {
    if (!amount || !category) return;
    setItems((p) => [
      ...p,
      { id: crypto.randomUUID(), amount: Number(amount), category },
    ]);
    setAmount("");
    setCategory("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)",
        color: "#0f172a",
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ color: "white", fontSize: 32, marginBottom: 16 }}>
          Finanzas del Hogar
        </h1>

        <Card>
          <h3>Cargar gasto</h3>
          <Input
            placeholder="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <br />
          <br />
          <Input
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <br />
          <br />
          <Button onClick={add}>Agregar</Button>
        </Card>

        <br />

        <Card>
          <h3>Movimientos</h3>
          {items.length === 0 && <p>Sin datos</p>}
          {items.map((i) => (
            <div key={i.id} style={{ display: "flex", gap: 8 }}>
              <Badge variant="secondary">{i.category}</Badge>
              <strong>${i.amount}</strong>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
