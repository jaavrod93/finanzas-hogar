importar React, { useEffect, useMemo, useRef, useState, createContext, useContext } de "react";
importar {
  Contenedor responsivo,
  Gráfico de líneas,
  Línea,
  Eje X,
  Eje YA,
  Información sobre herramientas,
  Leyenda,
  Gráfico de barras,
  Bar,
  Cuadrícula cartesiana,
} de "recharts";
importar { Descargar, Cargar, Trash2, Lápiz, RefreshCcw } de "lucide-react";

/* ---------------------------------------------------------
   Interfaz de usuario “portátil” (sin shadcn/ui, sin alias @/components)
   - Esto hace que el archivo funcione en cualquier plantilla React/TS
   - Estilos: simples e inline (sobrios) para que se vea prolijo
--------------------------------------------------------- */

constante ui = {
  tarjeta: {
    borde: "1px sólido rgba(0,0,0,0.08)",
    radio del borde: 16,
    fondo: "rgba(255,255,255,0.9)",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  } como React.CSSProperties,
  cardHeader: { relleno: 16, borde inferior: "1px sólido rgba(0,0,0,0.06)" } como React.CSSProperties,
  cardContent: { relleno: 16 } como React.CSSProperties,
  hTitle: { tamaño de fuente: 16, peso de fuente: 700 } como React.CSSProperties,
  botón: {
    borde: "1px sólido rgba(0,0,0,0.12)",
    fondo: "blanco",
    radio del borde: 12,
    relleno: "10px 12px",
    cursor: "puntero",
    pantalla: "inline-flex",
    alignItems: "centro",
    brecha: 8,
  } como React.CSSProperties,
  botónPrimario: {
    borde: "1px sólido rgba(0,0,0,0.12)",
    fondo: "#0ea5e9",
    color: "blanco",
    radio del borde: 12,
    relleno: "10px 12px",
    cursor: "puntero",
    pantalla: "inline-flex",
    alignItems: "centro",
    brecha: 8,
  } como React.CSSProperties,
  botónPeligro: {
    borde: "1px sólido rgba(0,0,0,0.12)",
    fondo: "#e11d48",
    color: "blanco",
    radio del borde: 12,
    relleno: "10px 12px",
    cursor: "puntero",
    pantalla: "inline-flex",
    alignItems: "centro",
    brecha: 8,
  } como React.CSSProperties,
  aporte: {
    ancho: "100%",
    borde: "1px sólido rgba(0,0,0,0.14)",
    radio del borde: 12,
    relleno: "10px 12px",
    esquema: "ninguno",
  } como React.CSSProperties,
  etiqueta: { tamaño de fuente: 12, color: "rgba(0,0,0,0.65)", peso de fuente: 600 } como React.CSSProperties,
  insignia: {
    pantalla: "inline-flex",
    alignItems: "centro",
    relleno: "2px 8px",
    radio del borde: 999,
    borde: "1px sólido rgba(0,0,0,0.12)",
    Tamaño de fuente: 12,
    fondo: "rgba(255,255,255,0.9)",
  } como React.CSSProperties,
  sep: { altura: 1, fondo: "rgba(0,0,0,0.08)", margen: "16px 0" } como React.CSSProperties,
  tableWrap: { overflowX: "auto", borde: "1px sólido rgba(0,0,0,0.08)", radio del borde: 16 } como React.CSSProperties,
  tabla: { ancho: "100%", borderCollapse: "separado", borderSpacing: 0 } como React.CSSProperties,
  o: {
    posición: "pegajosa" como constante,
    arriba: 0,
    fondo: "rgba(250,250,250,0.98)",
    textAlign: "izquierda" como constante,
    Tamaño de fuente: 12,
    color: "rgba(0,0,0,0.65)",
    relleno: "10px 12px",
    borderBottom: "1px sólido rgba(0,0,0,0.08)",
    Índice z: 1,
  } como React.CSSProperties,
  td: { relleno: "10px 12px", borde inferior: "1px sólido rgba(0,0,0,0.06)", tamaño de fuente: 13 } como React.CSSProperties,
  superposición: {
    posición: "fija" como constante,
    inserción: 0,
    fondo: "rgba(0,0,0,0.45)",
    pantalla: "flexible",
    alignItems: "centro",
    justificarContenido: "centro",
    relleno: 16,
    Índice z: 50,
  } como React.CSSProperties,
  modal: {
    ancho: "min(900px, 100%)",
    radio del borde: 16,
    fondo: "blanco",
    borde: "1px sólido rgba(0,0,0,0.12)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
    desbordamiento: "oculto",
  } como React.CSSProperties,
  modalHeader: { relleno: 16, borde inferior: "1px sólido rgba(0,0,0,0.06)" } como React.CSSProperties,
  modalBody: { relleno: 16, altura máxima: "70vh", desbordamiento: "auto" } como React.CSSProperties,
  modalFooter: { relleno: 16, borde superior: "1px sólido rgba(0,0,0,0.06)", visualización: "flexible", justificación: "flex-end", espacio: 8 } como React.CSSProperties,
  alerta: { borde: "1px sólido rgba(0,0,0,0.12)", radio del borde: 16, relleno: 12, fondo: "rgba(250,250,250,0.95)" } como React.CSSProperties,
};

función Tarjeta({
  niños,
  estilo,
  nombreDeClase,
  ...descansar
}: React.HTMLAttributes<HTMLDivElement> & { hijos: React.ReactNode; estilo?: React.CSSProperties }) {
  variables constantes = {
    ["--texto" como cualquiera]: "rgba(15,23,42,0.94)",
    ["--muted" como cualquiera]: "rgba(15,23,42,0.62)",
  } como cualquiera;

  devolver (
    <división
      {...descansar}
      nombreDeClase={nombreDeClase}
      estilo={{
        ...tarjeta ui,
        color: "rgba(15,23,42,0.94)",
        ...vars,
        ...(estilo || {}),
      }}
    >
      {niños}
    </div>
  );
}
función CardHeader({ hijos }: { hijos: React.ReactNode }) {
  devolver <div style={ui.cardHeader}>{hijos}</div>;
}
función CardTitle({ hijos }: { hijos: React.ReactNode }) {
  return <div style={ui.hTitle}>{niños}</div>;
}
función CardContent({ hijos, estilo }: { hijos: React.ReactNode; estilo?: React.CSSProperties }) {
  devolver <div style={{ ...ui.cardContent, ...style }}>{hijos}</div>;
}

función Botón({ hijos, onClick, variante, deshabilitado, estilo, tipo }: cualquiera) {
  const base = variant === "destructivo" ? ui.buttonDanger : variant === "primario" ? ui.buttonPrimary : ui.button;
  devolver (
    <button type={type || "button"} onClick={onClick} disabled={disabled} style={{ ...base, opacidad: disabled ? 0.6 : 1, ...style }}>
      {niños}
    </botón>
  );
}
función Entrada(props: React.InputHTMLAttributes<HTMLInputElement>) {
  devolver <input {...props} estilo={{ ...ui.input, ...(props.style || {}) }} />;
}
función Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  devolver <textarea {...props} estilo={{ ...ui.input, minHeight: 88, ...(props.style || {}) }} />;
}
función Label({ hijos }: { hijos: React.ReactNode }) {
  devolver <div style={ui.label}>{hijos}</div>;
}
función Insignia({ hijos, estilo }: { hijos: React.ReactNode; estilo?: React.CSSProperties }) {
  devolver <span style={{ ...ui.badge, ...style }}>{hijos}</span>;
}
función Separador() {
  devolver <div style={ui.sep} />;
}
función Switch({ marcada, onCheckedChange }: { marcada: booleano; onCheckedChange: (v: booleano) => void }) {
  devolver (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <input type="casilla de verificación" marcada={marcada} onChange={(e) => onCheckedChange(e.target.checked)} />
    </etiqueta>
  );
}

// Selección simple
función Select({ valor, onValueChange, hijos }: cualquiera) {
  devuelve React.Children.map(hijos, (hijo) => {
    si (!React.isValidElement(child)) devuelve hijo;
    devuelve React.cloneElement(hijo como cualquiera, { valor, onValueChange });
  });
}
función SelectTrigger({ hijos }: cualquiera) {
  devolver <>{hijos}</>;
}
función SelectValue({ marcador de posición }: cualquiera) {
  devolver <span style={{ color: "rgba(0,0,0,0.6)" }}>{marcador de posición}</span>;
}
función SelectContent({ hijos, valor, onValueChange }: cualquiera) {
  // Convertimos SelectItem a <opción>
  opciones constantes: Array<{ valor: cadena; etiqueta: cadena }> = [];
  React.Children.forEach(hijos, (ch) => {
    si (!React.isValidElement(ch)) retorna;
    constante anyCh: any = ch;
    si (anyCh.type === SelectItem) opciones.push({ valor: anyCh.props.value, etiqueta: anyCh.props.children });
  });
  devolver (
    <seleccionar valor={valor} onChange={(e) => onValueChange?.(e.target.value)} estilo={ui.input}>
      {opciones.map((o) => (
        <opción clave={o.valor} valor={o.valor}>
          {o.etiqueta}
        </opción>
      )) }
    </seleccionar>
  );
}
función SelectItem({ hijos }: cualquiera) {
  devolver <>{hijos}</>;
}

// Pestañas
const TabsCtx = createContext<{ valor: cadena; setValue: (v: cadena) => void } | null>(null);
función Tabs({ valor, onValueChange, hijos }: cualquiera) {
  const ctx = useMemo(() => ({ valor, setValue: onValueChange }), [valor, onValueChange]);
  devolver <TabsCtx.Provider valor={ctx}>{hijos}</TabsCtx.Provider>;
}
función TabsList({ hijos }: cualquiera) {
  devolver <div style={{ display: "inline-flex", espacio: 8, relleno: 6, radio del borde: 14, borde: "1px sólido rgba(0,0,0,0.10)", fondo: "rgba(255,255,255,0.8)" }}>{hijos}</div>;
}
función TabsTrigger({ valor, hijos }: cualquiera) {
  constante ctx = useContext(TabsCtx)!;
  const activo = ctx.value === valor;
  devolver (
    <botón
      onClick={() => ctx.setValue(valor)}
      estilo={{
        relleno: "8px 12px",
        radio del borde: 12,
        borde: "1px sólido rgba(0,0,0,0.10)",
        Fondo: ¿activo? "rgba(14,165,233,0.15)": "transparente",
        cursor: "puntero",
      }}
    >
      {niños}
    </botón>
  );
}
función TabsContent({ valor, hijos, nombreClase }: cualquiera) {
  constante ctx = useContext(TabsCtx)!;
  si (ctx.value !== valor) devuelve nulo;
  devolver <div className={className}>{hijos}</div>;
}

// Diálogo (modal)
const DialogCtx = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);
función Dialog({ hijos }: { hijos: React.ReactNode }) {
  const [abrir, establecerAbierto] = useState(falso);
  devolver <DialogCtx.Provider valor={{ abrir, establecerOpen }}>{hijos}</DialogCtx.Provider>;
}
función DialogTrigger({ asChild, children }: any) {
  const ctx = useContext(DialogCtx)!;
  si (asChild && React.isValidElement(hijos)) {
    devuelve React.cloneElement(hijos como cualquiera, { onClick: (e: cualquiera) => { (hijos como cualquiera).props?.onClick?.(e); ctx.setOpen(true); } });
  }
  devolver <button onClick={() => ctx.setOpen(true)}>{hijos}</button>;
}
función DialogContent({ children, className }: any) {
  const ctx = useContext(DialogCtx)!;
  si (!ctx.open) devuelve nulo;

  variables constantes = {
    ["--texto" como cualquiera]: "rgba(15,23,42,0.94)",
    ["--muted" como cualquiera]: "rgba(15,23,42,0.62)",
  } como cualquiera;

  devolver (
    <div style={ui.overlay} onMouseDown={() => ctx.setOpen(false)}>
      <división
        estilo={{
          ...ui.modal,
          color: "rgba(15,23,42,0.94)",
          ...vars,
        }}
        nombreDeClase={nombreDeClase}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {niños}
      </div>
    </div>
  );
}
función DialogHeader({ hijos }: cualquiera) {
  devolver <div style={ui.modalHeader}>{hijos}</div>;
}
función DialogTitle({ hijos }: cualquiera) {
  devolver <div style={{ fontSize: 16, fontWeight: 800 }}>{hijos}</div>;
}
función DialogDescription({ hijos }: cualquiera) {
  devolver <div style={{ marginTop: 6, fontSize: 13, color: "rgba(0,0,0,0.65)" }}>{hijos}</div>;
}
función DialogFooter({ hijos }: cualquiera) {
  devolver <div style={ui.modalFooter}>{hijos}</div>;
}

// Alerta
función Alerta({ hijos }: cualquiera) {
  devolver <div style={ui.alert}>{hijos}</div>;
}
función AlertTitle({ hijos }: cualquiera) {
  devolver <div style={{ fontWeight: 800, marginBottom: 4 }}>{hijos}</div>;
}
función AlertDescription({ hijos }: cualquiera) {
  devolver <div style={{ fontSize: 13, color: "rgba(0,0,0,0.75)" }}>{hijos}</div>;
}

// Mesa
función Tabla({ hijos }: cualquiera) {
  devolver <table style={ui.table}>{hijos}</table>;
}
función TableHeader({ children, className }: any) {
  devolver <thead className={className}>{hijos}</thead>;
}
función TableBody({ hijos }: cualquiera) {
  devolver <tbody>{hijos}</tbody>;
}
función TableRow({ hijos, nombreClase }: cualquiera) {
  devolver <tr className={className}>{hijos}</tr>;
}
función TableHead({ hijos, nombreDeClase, estilo }: cualquiera) {
  devolver (
    <th nombreClase={nombreClase} estilo={{ ...ui.th, ...(estilo || {}) }}>
      {niños}
    </th>
  );
}
función TableCell({ hijos, nombreClase, colSpan, estilo, título }: cualquiera) {
  devolver (
    <td className={nombreDeClase} colSpan={colSpan} estilo={{ ...ui.td, ...(estilo || {}) }} título={título}>
      {niños}
    </td>
  );
}


/**
 * Finanzas del Hogar (2026)
 * - 2 pestañas: Carga + Tablero
 * - Presupuestos por categoría (mensuales) con progreso/colores (ARS)
 * - USD real separado: se carga y se visualiza como una economía aparte (sin conversión)
 * - Persistencia: localStorage
 * - Colaboración opcional: Supabase + Realtime
 */

// ------------------ Configuración ------------------

const APP_KEY = "finanzas_hogar_v1";

constante CATEGORÍAS_GASTOS = [
  "Alquiler",
  "Gastos",
  "Súper",
  "Luz",
  "Gas",
  "Salud",
  "Televisión/Internet",
  "Auto",
  "TLCAN",
  "Gastos en USD",
  "Taz y Milo",
  "Ropa",
  "Entrega",
  "Regalos",
  "Casa/Hogar",
  "Salidas",
  "Gustos personales",
  "Extras",
] como constante;

const CATEGORIES_POSITIVE = ["Ingresos Javi", "Ingresos Miki", "Ahorro"] as const;

const TODAS_CATEGORÍAS = [...GASTOS_CATEGORÍAS, ...CATEGORÍAS_POSITIVOS] como const;

tipo Categoría = (tipo de TODAS_CATEGORÍAS)[número];

tipo Moneda = "ARS" | "USD";

tipo Entrada = {
  id: cadena;
  categoría:Categoría;
  moneda: Moneda;
  cantidad: número; // monto en la moneda indicada
  fecha: cadena; // AAAA-MM-DD
  comentario?: cadena;
  creadoEn: numero;
  actualizadoEn: numero;
};

tipo Presupuesto = {
  id: cadena; // `${monthKey}__${categoría}`
  clave_mes: cadena; // 2026-01 .. 2026-12
  categoría:Categoría;
  limitARS: numero;
  actualizadoEn: numero;
};

tipo CollaborationConfig = {
  habilitado: booleano;
  supabaseUrl: cadena;
  supabaseAnonKey: cadena;
  habitación: cuerda;
};

constante DEFAULT_COLLAB: CollaborationConfig = {
  habilitado: falso,
  supabaseUrl: "",
  supabaseAnonKey: "",
  habitación: "familia",
};

const USD_CATEGORY: Category = "Gastos en USD";
const CATEGORÍA_AHORRO: Categoría = "Ahorro";

const ARS_EXPENSE_CATEGORIES = (CATEGORIES_EXPENSE como solo lectura Categoría[]).filter(
  (c) => c !== CATEGORÍA USD
);

// ------------------ Utilidades ------------------

función uid() {
  devuelve `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

función toMonthKey(fechaAAAAMMDD: cadena) {
  devolver fechaAAAAMMDD.slice(0, 7);
}

función monthLabel(monthKey: cadena) {
  const [y, m] = monthKey.split("-").map((x) => parseInt(x, 10));
  meses constantes = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "Puede",
    "Jun",
    "Jul",
    "Atrás",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  devuelve `${meses[(m || 1) - 1]} ${y}`;
}

función prevMonthKey(monthKey: cadena) {
  constante [yStr, mStr] = monthKey.split("-");
  constante y = parseInt(yStr, 10);
  constante m = parseInt(mStr, 10);
  si (!Number.isFinite(y) || !Number.isFinite(m)) devuelve "";
  constante d = nueva Fecha(y, m - 1, 1);
  d.setMonth(d.getMonth() - 1);
  constante yy = d.getFullYear();
  constante mm = String(d.getMonth() + 1).padStart(2, "0");
  devuelve `${aa}-${mm}`;
}

función formatMoneyARS(n: número) {
  intentar {
    devuelve nuevo Intl.NumberFormat("es-AR", {
      estilo: "moneda",
      moneda: "ARS",
      máximoFracciónDígitos: 0,
    }).formato(n);
  } atrapar {
    devuelve `$ ${Math.round(n).toLocaleString("es-AR")}`;
  }
}

función formatMoneyUSD(n: número) {
  const val = Número.isFinite(n) ? n : 0;
  devuelve `$ ${val.toFixed(2)} USD`;
}

función safeNumber(entrada: cadena) {
  const limpiado = entrada
    .recortar()
    .reemplazar(/\./g, "")
    .reemplazar(/,/g, ".")
    .reemplazar(/[^0-9.-]/g, "");
  const n = Número(limpiado);
  devolver Número.isFinite(n) ? n : 0;
}

función esGasto(cat: Categoría) {
  devuelve (CATEGORIES_GASTOS como cadena de solo lectura[]).includes(cat);
}

función normalizarEntrada(raw: any): Entrada | null {
  si (!raw || !raw.id || !raw.category || !raw.date) devuelve nulo;

  constante categoría: Categoría = raw.category;

  // Compatibilidad hacia atrás: versiones viejas traían montoARS y nada de moneda/amount
  constante legacyARS = Número(raw.amountARS);

  // Si es categoría USD, asumimos USD.
  constante inferidaCurrency: Moneda =
    moneda.bruta === "USD" || categoría === CATEGORÍA_USD || categoría === CATEGORÍA_AHORRO ? "USD" : "ARS";

  constante cantidad = Número.isFinite(Número(raw.cantidad))
    ? Número(cantidad bruta)
    : Moneda inferida === "USD"
      ? Número(bruto.cantidadUSD)
      :legadoARS;

  devolver {
    id: Cadena(raw.id),
    categoría,
    moneda: Moneda inferida,
    cantidad: Número.isFinite(cantidad) ? cantidad : 0,
    fecha: String(raw.date),
    comentario: raw.comment || "",
    createdAt: Número(raw.createdAt) || Fecha.ahora(),
    actualizadoEn: Número(raw.updatedAt) || Fecha.ahora(),
  };
}

función loadLocal(): { entradas: Entry[]; presupuestos: Budget[]; collab: CollaborationConfig } {
  constante raw = localStorage.getItem(APP_KEY);
  si (!raw) devuelve { entradas: [], presupuestos: [], colaboración: DEFAULT_COLLAB };
  intentar {
    constante analizada = JSON.parse(raw);
    const normalizedEntries: Entrada[] = Array.isArray(parsed.entries)
      ? parsed.entries.map(normalizeEntry).filter(Boolean)
      : [];

    devolver {
      entradas: normalizedEntries como Entry[],
      presupuestos: Array.isArray(parsed.presupuestos) ? parsed.presupuestos : [],
      colaboración: analizado.collab ? { ...DEFAULT_COLLAB, ...analizado.collab } : DEFAULT_COLLAB,
    };
  } atrapar {
    devolver { entradas: [], presupuestos: [], colaboración: DEFAULT_COLLAB };
  }
}

función saveLocal(entradas: Entrada[], presupuestos: Presupuesto[], colaboración: CollaborationConfig) {
  localStorage.setItem(APP_KEY, JSON.stringify({ entradas, presupuestos, colaboración }));
}

// ------------------ Supabase (opcional) ------------------

función asíncrona getSupabaseClient(url: cadena, clave: cadena) {
  const mod = await importación("@supabase/supabase-js");
  devolver mod.createClient(url, clave);
}

// ------------------ Principal ------------------

exportar función predeterminada FinanzasHogarApp() {
  const [entradas, setEntries] = useState<Entry[]>([]);
  const [presupuestos, establecerPresupuestos] = useState<Presupuesto[]>([]);
  constante [collab, setCollab] = useState<CollaborationConfig>(DEFAULT_COLLAB);
  const [activeTab, setActiveTab] = useState<"carga" | "dashboard">("carga");

  // colaboración / Supabase
  const [collabStatus, setCollabStatus] = useState<"fuera de línea" | "conectando" | "en línea" | "error">("fuera de línea");
  const [collabError, setCollabError] = useState<string>("");
  const supabaseRef = useRef<any>(null);
  const channelRef = useRef<any>(null);

  // forma
  const [categoría, setCategory] = useState<Categoría>("Super");
  const [cantidadStr, establecerCantidadStr] = useState<string>("");
  const [fecha, establecerFecha] = useState<string>(() => {
    const d = nueva Fecha();
    constante yyyy = d.getFullYear();
    constante mm = String(d.getMonth() + 1).padStart(2, "0");
    constante dd = String(d.getDate()).padStart(2, "0");
    devuelve `${aaaa}-${mm}-${dd}`;
  });
  const [comentario, setComment] = useState<string>("");

  const [edición, setEditing] = useState<Entry | null>(null);
  const [buscar, establecerBuscar] = useState<string>("");

  // mes (2026)
  const [monthFilter, setMonthFilter] = useState<string>(""); // "" = todos, "01".."12"

  constante MESES_2026 = useMemo(
    () =>
      Matriz.from({ longitud: 12 }, (_, i) => {
        constante mm = String(i + 1).padStart(2, "0");
        devuelve `2026-${mm}`;
      }),
    []
  );

  constante OPCIONES_MES = useMemo(
    () => [
      { valor: "", etiqueta: "Todos" },
      { valor: "01", etiqueta: "Enero" },
      { valor: "02", etiqueta: "Febrero" },
      { valor: "03", etiqueta: "Marzo" },
      { valor: "04", etiqueta: "Abril" },
      { valor: "05", etiqueta: "Mayonesa" },
      { valor: "06", etiqueta: "Junio" },
      { valor: "07", etiqueta: "Julio" },
      { valor: "08", etiqueta: "Agosto" },
      { valor: "09", etiqueta: "Septiembre" },
      { valor: "10", etiqueta: "Octubre" },
      { valor: "11", etiqueta: "Noviembre" },
      { valor: "12", etiqueta: "Diciembre" },
    ],
    []
  );

  constante monthKeyFromFilter = useMemo(
    () => (monthFilter ? `2026-${monthFilter}` : ""),
    [Filtro de mes]
  );

  // Lista fija de meses (2026)
  const meses = useMemo(() => MESES_2026, [MESES_2026]);

  // ------------------ Búsqueda de presupuestos (DEBE estar ANTES de cualquier useMemo que llame a getBudget) ------------------
  constante presupuestosPorId = useMemo(() => {
    const map = new Map<string, Presupuesto>();
    para (const b de presupuestos) map.set(b.id, b);
    mapa de retorno;
  }, [presupuestos]);

  función budgetId(monthKey: cadena, cat: Categoría) {
    devuelve `${monthKey}__${cat}`;
  }

  función obtenerPresupuesto(monthKey: cadena, cat: Categoría) {
    devolver presupuestosPorId.get(presupuestoId(monthKey, cat));
  }

  función progressColorClass(pct: número) {
    si (pct >= 1) devuelve "bg-rose-500";
    si (pct >= 0.8) devuelve "bg-amber-500";
    devolver "bg-emerald-500";
  }

  // ------------ Persistencia local + Sincronización Supabase ------------

  // cargador local al iniciar
  usarEfecto(() => {
    const { entradas: e, presupuestos: b, colaboración: c } = loadLocal();
    setEntries(e.sort((a, b2) => b2.date.localeCompare(a.date)));
    establecerPresupuestos(b);
    establecerCollab(c);
  }, []);

  // guardar local
  usarEfecto(() => {
    saveLocal(entradas, presupuestos, colaboración);
  }, [entradas, presupuestos, colaboración]);

  // conectar/desconectar supabase
  usarEfecto(() => {
    dejar cancelado = falso;

    función asíncrona cleanup() {
      intentar {
        si (canalRef.actual && supabaseRef.actual) {
          esperar supabaseRef.current.removeChannel(channelRef.current);
        }
      } atrapar {
        // ignorar
      }
      canalRef.actual = nulo;
      supabaseRef.current = nulo;
    }

    función asíncrona connect() {
      esperar limpieza();

      si (!collab.enabled) {
        setCollabStatus("fuera de línea");
        establecerErrorDeCollab("");
        devolver;
      }

      si (!collab.subabaseUrl || !collab.subabaseAnonKey) {
        setCollabStatus("error");
        setCollabError("URL de Faltan Supabase o clave anónima");
        devolver;
      }

      setCollabStatus("conectando");
      establecerErrorDeCollab("");

      intentar {
        constante supabase = await getSupabaseClient(collab.supabaseUrl, collab.supabaseAnonKey);
        si (cancelado) regreso;
        supabaseRef.current = supabase;

        // tirar inicial
        const { datos: entradas remotas, error: eErr } = await supabase
          .from("entradas_financieras")
          .seleccionar("*")
          .eq("habitación", collab.habitación);
        si (eErr) lanzar eErr;

        const { datos: presupuestos remotos, error: bErr } = await supabase
          .from("presupuestos_financieros")
          .seleccionar("*")
          .eq("habitación", collab.habitación);
        si (bErr) lanzar bErr;

        // fusionar local <- remoto (remoto gana por updateAt)
        constante fusionadasEntradas = (() => {
          const map = new Map<string, Entrada>();
          para (const it de entradas) map.set(it.id, it);
          para (const r de entradas remotas || []) {
            constante n = normalizarEntrada(r);
            si (!n) continúa;
            constante cur = mapa.get(n.id);
            si (!cur || (n.updatedAt || 0) >= (cur.updatedAt || 0)) mapa.set(n.id, n);
          }
          devuelve Array.from(map.values()).sort((a, b2) => b2.date.localeCompare(a.date));
        })();

        constante fusionadosPresupuestos = (() => {
          const map = new Map<string, Presupuesto>();
          para (const it de presupuestos) map.set(it.id, it);
          para (const r de presupuestos remotos || []) {
            constante id = String(r.id || "");
            si (!id) continúa;
            const next: Presupuesto = {
              identificación,
              claveMes: String(r.claveMes || ""),
              categoría: r.category como Categoría,
              limitARS: Número(r.limitARS) || 0,
              actualizadoEn: Número(r.actualizadoEn) || Fecha.ahora(),
            };
            constante cur = mapa.get(id);
            si (!cur || (siguiente.actualizadoEn || 0) >= (cur.actualizadoEn || 0)) mapa.set(id, siguiente);
          }
          devuelve Array.from(mapa.valores());
        })();

        si (!cancelado) {
          setEntries(entradasfusionadas);
          establecerPresupuestos(presupuestosfusionados);
        }

        // tiempo real
        constante ch = supabase
          .canal(`finanzas_${collab.room}`)
          .en(
            "cambios_postgres",
            { evento: "*", esquema: "público", tabla: "entradas_finanzas", filtro: `sala=eq.${collab.sala}` },
            (carga útil: cualquiera) => {
              const rec = carga útil?.nueva || carga útil?.viejo;
              si (!rec) retorna;
              constante n = normalizarEntrada(rec);
              si (!n) retorna;

              si (carga útil.tipo de evento === "BORRAR") {
                setEntries((prev) => prev.filter((x) => x.id !== n.id));
              } demás {
                setEntries((prev) => {
                  constante map = nuevo Map(prev.map((x) => [x.id, x] como constante));
                  constante cur = mapa.get(n.id);
                  si (!cur || (n.updatedAt || 0) >= (cur.updatedAt || 0)) mapa.set(n.id, n);
                  devuelve Array.from(map.values()).sort((a, b2) => b2.date.localeCompare(a.date));
                });
              }
            }
          )
          .en(
            "cambios_postgres",
            { evento: "*", esquema: "público", tabla: "presupuestos_financieros", filtro: `room=eq.${collab.room}` },
            (carga útil: cualquiera) => {
              const rec = carga útil?.nueva || carga útil?.viejo;
              si (!rec?.id) retorna;
              const next: Presupuesto = {
                id: Cadena(rec.id),
                claveMes: String(rec.claveMes || ""),
                categoría: rec.category como Categoría,
                limitARS: Número(rec.limitARS) || 0,
                actualizadoEn: Número(rec.actualizadoEn) || Fecha.ahora(),
              };

              si (carga útil.tipo de evento === "BORRAR") {
                establecerPresupuestos((prev) => prev.filter((b) => b.id !== next.id));
              } demás {
                establecerPresupuestos((prev) => {
                  constante map = nuevo Map(prev.map((b) => [b.id, b] como constante));
                  const cur = mapa.get(siguiente.id);
                  si (!cur || (siguiente.actualizadoEn || 0) >= (cur.actualizadoEn || 0)) mapa.set(siguiente.id, siguiente);
                  devuelve Array.from(mapa.valores());
                });
              }
            }
          )
          .subscribe((estado: cadena) => {
            si (cancelado) regreso;
            si (estado === "SUSCRITO") setCollabStatus("en línea");
          });

        canalRef.actual = ch;
      } catch (e: cualquiera) {
        si (cancelado) regreso;
        setCollabStatus("error");
        setCollabError(e?.message || "Error conectando a Supabase");
      }
    }

    conectar();

    devolver() => {
      cancelado = verdadero;
      limpieza();
    };
    // eslint-deshabilitar-siguiente-línea react-hooks/exhaustive-deps
  }, [collab.habilitado, collab.subabaseUrl, collab.subabaseAnonKey, collab.sala]);

  // ------------ Ayudantes remotos ------------

  función asíncrona upsertRemote(e: Entrada) {
    si (!collab.enabled || collabStatus !== "en línea" || !subabaseRef.current) devolver;
    constante supabase = supabaseRef.current;

    // Para mantener compatibilidad si tu tabla hoy solo tiene montoARS, dejamos montoARS cargado:
    // - ARS: montoARS = monto
    // - USD: amountUSD = amount, amountARS = 0 (no convertimos)
    carga útil constante = {
      sala: collab.room,
      identificación: e.id,
      categoría: e.categoría,
      moneda: moneda electrónica,
      cantidad: e.cantidad,
      amountARS: e.moneda === "ARS" ? e.cantidad : 0,
      amountUSD: e.currency === "USD" ? e.amount : null,
      fecha: e.date,
      comentario: e.comment || "",
      creadoEn: e.creadoEn,
      actualizadoEn: e.actualizadoEn,
    };

    const { error } = await supabase.from("finance_entries").upsert(payload, { onConflict: "id" });
    si (error) arroja error;
  }

  función asíncrona deleteRemote(id: cadena) {
    si (!collab.enabled || collabStatus !== "en línea" || !subabaseRef.current) devolver;
    constante supabase = supabaseRef.current;
    const { error } = await supabase
      .from("entradas_financieras")
      .borrar()
      .eq("id", id)
      .eq("habitación", collab.habitación);
    si (error) arroja error;
  }

  función asíncrona upsertBudgetRemote(b: Presupuesto) {
    si (!collab.enabled || collabStatus !== "en línea" || !subabaseRef.current) devolver;
    constante supabase = supabaseRef.current;
    const payload = { ...b, sala: collab.room };
    const { error } = await supabase.from("finance_budgets").upsert(payload, { onConflict: "id" });
    si (error) arroja error;
  }

  función asíncrona deleteBudgetRemote(id: cadena) {
    si (!collab.enabled || collabStatus !== "en línea" || !subabaseRef.current) devolver;
    constante supabase = supabaseRef.current;
    const { error } = await supabase
      .from("presupuestos_financieros")
      .borrar()
      .eq("id", id)
      .eq("habitación", collab.habitación);
    si (error) arroja error;
  }

  // ------------ Acciones ------------

  función asíncrona handleSubmit() {
    constante cantidad = safeNumber(cantidadStr);
    si (!categoría || !fecha || !Numero.isFinite(cantidad) || cantidad <= 0) devolver;

    const moneda: Moneda = categoría === CATEGORÍA_USD || categoría === CATEGORÍA_AHORRO ? "USD" : "ARS";

    si (edición) {
      constante actualizada: Entrada = {
        ...edición,
        categoría,
        divisa,
        cantidad,
        fecha,
        comentario,
        actualizadoEn: Fecha.ahora(),
      };
      setEntries((prev) =>
        anterior
          .map((x) => (x.id === actualizado.id ? actualizado : x))
          .sort((a, b) => b.date.localeCompare(a.date))
      );
      setEditing(nulo);
      establecerCantidadStr("");
      establecerComentario("");
      intentar {
        esperar upsertRemote(actualizado);
      } catch (e: cualquiera) {
        setCollabStatus("error");
        setCollabError(e?.message || "Error guardando en Supabase");
      }
      devolver;
    }

    const ahora = Fecha.ahora();
    constante nuevaEntrada: Entrada = {
      identificación: uid(),
      categoría,
      divisa,
      cantidad,
      fecha,
      comentario,
      createdAt: ahora,
      actualizadoEn: ahora,
    };
    setEntries((prev) => [newEntry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    establecerCantidadStr("");
    establecerComentario("");

    intentar {
      esperar upsertRemote(nuevaEntrada);
    } catch (e: cualquiera) {
      setCollabStatus("error");
      setCollabError(e?.message || "Error guardando en Supabase");
    }
  }

  función startEdit(e: Entrada) {
    setEditando(e);
    setCategory(e.categoría);
    setDate(e.fecha);
    setAmountStr(Cadena(e.cantidad));
    setComment(e.comentario || "");
    setActiveTab("carga");
  }

  función asíncrona removeEntry(e: Entry) {
    setEntries((prev) => prev.filter((x) => x.id !== e.id));
    intentar {
      esperar deleteRemote(e.id);
    } catch (err: cualquiera) {
      setCollabStatus("error");
      setCollabError(err?.message || "Error borrando en Supabase");
    }
  }

  función asíncrona setBudget(monthKey: cadena, cat: Categoría, limitARS: número) {
    constante id = presupuestoId(claveMes, cat);
    const ahora = Fecha.ahora();

    si (!Numero.esFinito(limitARS) || limitARS <= 0) {
      establecerPresupuestos((prev) => prev.filter((b) => b.id !== id));
      intentar {
        esperar deleteBudgetRemote(id);
      } catch (e: cualquiera) {
        setCollabStatus("error");
        setCollabError(e?.message || "Error borrando presupuesto en Supabase");
      }
      devolver;
    }

    const next: Presupuesto = { id, monthKey, categoría: cat, limitARS, updatedAt: ahora };
    establecerPresupuestos((prev) => {
      constante idx = prev.findIndex((b) => b.id === id);
      si (idx >= 0) {
        constante copia = prev.slice();
        copia[idx] = siguiente;
        devolver copia;
      }
      devolver [...prev, next];
    });

    intentar {
      esperar upsertBudgetRemote(siguiente);
    } catch (e: cualquiera) {
      setCollabStatus("error");
      setCollabError(e?.message || "Error guardando presupuesto en Supabase");
    }
  }

  función exportJSON() {
    const blob = new Blob([JSON.stringify({ entradas, presupuestos }, null, 2)], {
      tipo: "aplicación/json",
    });
    constante url = URL.createObjectURL(blob);
    constante a = document.createElement("a");
    a.href = url;
    a.download = `finanzas_hogar_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  función importJSON(archivo: Archivo) {
    const lector = nuevo FileReader();
    lector.onload = () => {
      intentar {
        constante obj = JSON.parse(String(lector.resultado || "{}"));
        const incomingRaw: any[] = Array.isArray(obj.entries) ? obj.entries : [];
        constante entrante: Entrada[] = incomingRaw.map(normalizeEntry).filter(Boolean) como Entrada[];
        const presupuestosentrantes: Presupuesto[] = Array.isArray(obj.presupuestos) ? obj.presupuestos : [];

        setEntries((prev) => {
          const map = new Map<string, Entrada>();
          para (const it de prev) map.set(it.id, it);
          para (const. de entrante) {
            si (!it?.id) continúa;
            const cur = map.get(it.id);
            si (!cur || (it.updatedAt || 0) >= (cur.updatedAt || 0)) mapa.set(it.id, it);
          }
          devuelve Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
        });

        establecerPresupuestos((prev) => {
          const map = new Map<string, Presupuesto>();
          para (const it de prev) map.set(it.id, it);
          para (const it de presupuestos entrantes) {
            si (!it?.id) continúa;
            const cur = map.get(it.id);
            si (!cur || (it.updatedAt || 0) >= (cur.updatedAt || 0)) mapa.set(it.id, it);
          }
          devuelve Array.from(mapa.valores());
        });
      } atrapar {
        // ignorar
      }
    };
    lector.readAsText(archivo);
  }

  // ------------ Datos derivados ------------

  constante scopedEntries = useMemo(() => {
    const base = entradas;
    si (!monthKeyFromFilter) devuelve base;
    devuelve base.filter((e) => toMonthKey(e.date) === monthKeyFromFilter);
  }, [entradas, monthKeyFromFilter]);

  constante filteredEntries = useMemo(() => {
    constante q = búsqueda.trim().toLowerCase();
    si (!q) devuelve scopedEntries;
    devolver scopedEntries.filter((e) => {
      devolver (
        e.category.toLowerCase().includes(q) ||
        e.date.toLowerCase().incluye(q) ||
        (e.comentario || "").toLowerCase().includes(q)
      );
    });
  }, [scopedEntries, búsqueda]);

  constante pivotARS = useMemo(() => {
    const out: Registro<cadena, Registro<cadena, número>> = {};
    para (const c de TODAS_CATEGORÍAS) out[c] = {};

    para (constante e de entradas) {
      si (e.moneda !== "ARS") continuar;
      constante mk = toMonthKey(e.fecha);
      si (!mk.startsWith("2026-")) continuar;
      out[e.categoría][mk] = (out[e.categoría][mk] || 0) + (Número(e.cantidad) || 0);
    }
    devuelve como Registro<Categoría, Registro<cadena, número>>;
  }, [entradas]);

  constante usdGastosPorMes = useMemo(() => {
    const out: Registro<cadena, número> = {};
    para (constante e de entradas) {
      si (e.currency !== "USD" continuar;
      si (e.category !== USD_CATEGORY) continuar;
      constante mk = toMonthKey(e.fecha);
      si (!mk.startsWith("2026-")) continuar;
      out[mk] = (out[mk] || 0) + (Number(e.amount) || 0);
    }
    volver afuera;
  }, [entradas]);

  constante usdAhorrosPorMes = useMemo(() => {
    const out: Registro<cadena, número> = {};
    para (constante e de entradas) {
      si (e.currency !== "USD" continuar;
      si (e.categoría !== CATEGORÍA_DE_AHORRO) continuar;
      constante mk = toMonthKey(e.fecha);
      si (!mk.startsWith("2026-")) continuar;
      out[mk] = (out[mk] || 0) + (Number(e.amount) || 0);
    }
    volver afuera;
  }, [entradas]);

  constante usdBalanceByMonth = useMemo(() => {
    const out: Registro<cadena, número> = {};
    para (const m de MESES_2026) {
      salida[m] = (usdAhorrosPorMes[m] || 0) - (usdGastosPorMes[m] || 0);
    }
    volver afuera;
  }, [MESES_2026, usdAhorrosPorMes, usdGastosPorMes]);

  constante totalesCurrentFilter = useMemo(() => {
    deje que los ingresos sean 0;
    sea ​​gastos = 0;
    sea ​​gastosUSD = 0;
    deje ahorroUSD = 0;

    para (const e de scopedEntries) {
      si (e.moneda === "USD") {
        si (e.categoría === USD_CATEGORY) gastosUSD += e.monto;
        si (e.categoría === CATEGORÍA_DE_AHORRO) ahorroUSD += e.monto;
      } demás {
        si (isExpense(e.categoría)) {
          // Gastos en ARS, excluye la categoría USD
          si (e.categoría !== USD_CATEGORY) gastos += e.monto;
        } demás {
          ingresos += e.cantidad;
        }
      }
    }

    devolver {
      ingresos,
      gastos,
      balance: ingresos - gastos,
      gastosUSD,
      ahorroUSD,
      balanceUSD: ahorroUSD - gastosUSD,
    };
  }, [Entradas con ámbito]);

  constante totalesPorMesARS = useMemo(() => {
    devolver MESES_2026.map((m) => {
      const ingresos = (pivotARS["Ingresos Javi"]?.[m] || 0) + (pivotARS["Ingresos Miki"]?.[m] || 0);
      sea ​​gastos = 0;
      para (const c de ARS_CATEGORÍAS_DE_GASTOS) gastos += pivotARS[c]?.[m] || 0;
      devolver {
        mes: monthLabel(m),
        ingresos,
        gastos,
        balance: ingresos - gastos,
      };
    });
  }, [MESES_2026, pivotARS]);

  constante topCategoriesForBarsARS = useMemo(() => {
    constante mk = monthKeyFromFilter;
    totales constantes: Array<{ categoría: cadena; total: número }> = [];
    para (const c de CATEGORÍAS_DE_GASTOS_ARS) {
      total constante = mk
        ? (pivotARS[c]?.[mk] || 0)
        : MESES_2026.reduce((acc, m) => acc + (pivotARS[c]?.[m] || 0), 0);
      totales.push({ categoría: c, total });
    }
    totales.sort((a, b) => b.total - a.total);
    devolver totales.slice(0, 10);
  }, [CATEGORÍAS_DE_GASTOS_ARS, MESES_2026, pivotARS, monthKeyFromFilter]);

  constante smartComparison = useMemo(() => {
    si (!monthKeyFromFilter) devuelve nulo;
    constante cur = monthKeyFromFilter;
    constante prev = prevMonthKey(cur);
    si (!prev) devuelve nulo;

    filas constantes: Array<{ category: Categoría; cur: número; prv: número; delta: número; pct: número | null }> = [];
    para (const c de CATEGORÍAS_DE_GASTOS_ARS) {
      constante curV = pivotARS[c]?.[cur] || 0;
      constante prvV = pivotARS[c]?.[prev] || 0;
      constante delta = curV - prvV;
      constante pct = prvV > 0 ? delta / prvV : curV > 0 ? nulo : 0;
      filas.push({ categoría: c, cur: curV, prv: prvV, delta, pct });
    }

    constante aumenta = filas
      .filtro((r) => r.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 5);

    constante disminuye = filas
      .filtro((r) => r.delta < 0)
      .sort((a, b) => a.delta - b.delta)
      .slice(0, 5);

    constante usd = {
      gastos: {
        cur: usdGastosPorMes[cur] || 0,
        prv: usdExpensesByMonth[prev] || 0,
        delta: (usdExpensesByMonth[actual] || 0) - (usdExpensesByMonth[anterior] || 0),
      },
      ahorro: {
        cur: usdAhorrosPorMes[cur] || 0,
        prv: usdAhorrosPorMes[prev] || 0,
        delta: (usdAhorrosPorMes[actual] || 0) - (usdAhorrosPorMes[anterior] || 0),
      },
      balance: {
        actual: SaldoUsdPorMes[actual] || 0,
        prv: usdBalanceByMonth[anterior] || 0,
        delta: (usdBalanceByMonth[actual] || 0) - (usdBalanceByMonth[anterior] || 0),
      },
    };

    return { prev, aumenta, disminuye, usd };
  }, [monthKeyFromFilter, pivotARS, CATEGORÍAS_DE_GASTOS_ARS, usdGastosPorMes, usdAhorrosPorMes, usdSaldoPorMes]);

  const saludfinanciera = useMemo(() => {
    const mode = monthKeyFromFilter ? "mes" : "año";
    const ingresosARS = totalesCurrentFilter.ingresos;
    const gastosARS = totalesCurrentFilter.gastos;
    constante balanceARS = totalesCurrentFilter.balance;
    constante gastosUSD = totalsCurrentFilter.gastosUSD;
    const ahorroUSD = totalesCurrentFilter.ahorroUSD;
    constante balanceUSD = totalsCurrentFilter.balanceUSD;

    const savingRate = ingresosARS > 0 ? Math.max(0, balanceARS / ingresosARS) : 0;

    const alertas: Array<{ tono: "info" | "advertencia" | "malo"; texto: cadena }> = [];

    if (ingresosARS > 0 && balanceARS < 0) alerts.push({ tone: "bad", text: "Están gastando más ARS de lo que ingresa este período." });
    if (ingresosARS > 0 && SavingRate < 0.1) alerts.push({ tone: "warn", text: "Tasa de ahorro ARS baja (<10%)." });
    si (monthKeyFromFilter) {
      // alertas por presupuestos
      para (const c de CATEGORÍAS_DE_GASTOS_ARS) {
        constante b = obtenerPresupuesto(monthKeyFromFilter, c);
        si (!b || !b.limitARS) continuar;
        constante gastada = pivotARS[c]?.[monthKeyFromFilter] || 0;
        if (spent > b.limitARS) alerts.push({ tone: "warn", text: `Presupuesto excedido en ${c}.` });
      }
    }

    // puntuación simple
    sea ​​puntuación = 60;
    si (ingresosARS > 0) puntaje += Math.round(tasaDeAhorro * 30);
    si (balanceARS < 0) puntuación -= 20;
    si (alertas.algunas((a) => a.tono === "malo")) puntuación -= 10;
    puntuación = Math.max(0, Math.min(100, puntuación));

    const status = puntuación >= 75 ? "ok" : puntuación >= 55 ? "warn" : "malo";

    devolver {
      modo,
      estado,
      puntaje,
      ingresosARS,
      gastosARS,
      balanceARS,
      tasa de ahorro,
      gastosUSD,
      ahorroUSD,
      balanceUSD,
      alertas,
    };
  }, [monthKeyFromFilter, totalsCurrentFilter, CATEGORÍAS_DE_GASTOS_ARS, pivotARS, obtenerPresupuesto]);

  // ------------------ Interfaz de usuario ------------------

  const isUSDSelected = categoría === CATEGORÍA_USD || categoría === CATEGORÍA_AHORROS;

  devolver (
    <div className="min-h-screen w-full text-foreground bg-gradient-to-b from-sky-50 via-background to-emerald-50 dark:from-slate-950 dark:via-background dark:to-slate-900">
      <div className="mx-auto max-w-6xl p-4 md:p-8 relativo">
        <div aria-hidden className="eventos-de-puntero-ninguno absoluto inserción-0 -z-10 desbordamiento-oculto">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10" />
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Finanzas del Hogar</h1>
            <p className="text-sm texto-silenciado-en-primer-plano">
              2026 · Cargá gastos, ingresos y ahorro en ARS, y USD por separado como una economía distinta.
            </p>
          </div>
          <div className="elementos flexibles-centro espacio-2">
            Variante de insignia={CollabStatus === "en línea" ? "predeterminado" : "secundario"} className="rounded-full">
              {collab.enabled ? (collabStatus === "online" ? "Colaborativo online" : collabStatus) : "Modo local"}
            </Insignia>
            <Diálogo>
              <DialogTrigger como hijo>
                <Button variant="outline" className="gap-2 rounded-2xl bg-white/50 dark:bg-white/5">
                  <RefreshCcw className="h-4 w-4" /> Colaboración
                </Botón>
              </Disparador de diálogo>
              <DialogContent nombre de clase="max-w-2xl">
                <Encabezado de diálogo>
                  <DialogTitle>Edición colaborativa (opcional)</DialogTitle>
                  <Descripción del diálogo>
                    Por defecto la aplicación guarda en tu navegador (localStorage). Si quieres que se sincronice entre dos o más
                    dispositivos en tiempo real, activará Supabase.
                  </Descripción del diálogo>
                </Encabezado de diálogo>

                <div className="cuadrícula cuadrícula-columnas-1 md:cuadrícula-columnas-2 espacio-4">
                  <div className="espacio-y-3">
                    <div className="flex items-center justify-between rounded-xl border p-3">
                      <div>
                        <div className="font-medium">Activar Supabase</div>
                        <div className="text-xs text-muted-foreground">Sincronización y tiempo real</div>
                      </div>
                      <Cambiar
                        marcado={collab.enabled}
                        onCheckedChange={(v) => setCollab((c) => ({ ...c, habilitado: Boolean(v) }))}
                      />
                    </div>

                    <div className="espacio-y-2">
                      <Label>Habitación (nombre de familia)</Label>
                      <Entrada
                        valor={collab.room}
                        onChange={(e) => setCollab((c) => ({ ...c, habitación: e.target.value.trim() || "familia" }))}
                        marcador de posición="ej: rodríguez"
                      />
                      <p className="text-xs texto-silenciado-en-primer-plano">
                        Use la misma habitación en todos los dispositivos para ver los mismos datos.
                      </p>
                    </div>

                    <div className="espacio-y-2">
                      URL de Supabase
                      <Entrada
                        valor={collab.subabaseUrl}
                        onChange={(e) => setCollab((c) => ({ ...c, supabaseUrl: e.target.value }))}
                        marcador de posición="https://xxxx.supabase.co"
                      />
                    </div>

                    <div className="espacio-y-2">
                      <Label>Clave anónima de Supabase</Label>
                      <Entrada
                        valor={collab.subabaseAnonKey}
                        onChange={(e) => setCollab((c) => ({ ...c, supabaseAnonKey: e.target.value }))}
                        marcador de posición="eyJhbGciOi..."
                      />
                    </div>
                  </div>

                  <div className="espacio-y-3">
                    <Alerta>
                      <AlertTitle>Lista de verificación rápida</AlertTitle>
                      <Descripción de alerta>
                        <ol className="lista-decimal ml-5 espacio-y-1 texto-sm">
                          <li>Crear un proyecto en Supabase</li>
                          <li>
                            Crear tablas <span className="font-mono">finance_entries</span> y{" "}
                            <span className="font-mono">presupuestos financieros</span> (DDL abajo)
                          </li>
                          <li>Activar tiempo real para ambas tablas</li>
                          <li>Pegar URL + Clave anónima</li>
                        </ol>
                      </Descripción de alerta>
                    </Alerta>

                    {estado de colaboración === "error" && (
                      <Alerta>
                        <AlertTitle>Error</AlertTitle>
                        <Descripción de alerta>{collabError || "Revisá credenciales y Realtime"}</AlertDescription>
                      </Alerta>
                    )}

                    <div className="borde redondeado-xl p-3">
                      <div className="text-sm font-medium">Privacidad</div>
                      <p className="text-xs texto-silenciado-primer-plano mt-1">
                        Para producción, lo ideal es habilitar RLS + autenticación. Para uso familiar simple, podés mantener
                        privado y agregar RLS más adelante.
                      </p>
                    </div>
                  </div>
                </div>

                <Pie de página del diálogo>
                  <Variante del botón="contorno" al hacer clic={() => setCollab((c) => ({ ...c, habilitado: falso }))}>
                    Volver al modo local
                  </Botón>
                </Pie de página del diálogo>
              </Contenido del diálogo>
            </Diálogo>
          </div>
        </div>

        <Separador className="my-6" />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v como cualquiera)}>
          <div className="elementos flexibles-centro justificar-entre-espacio-3 flex-wrap">
            <TabsList className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur border shadow-sm">
              <TabsTrigger value="carga">Carga</TabsTrigger>
              <TabsTrigger value="dashboard">Panel de control</TabsTrigger>
            </Lista de pestañas>

            <div className="elementos flexibles-centro espacio-2">
              <div className="elementos flexibles-centro espacio-2">
                <Label className="text-xs text-muted-foreground">Mes</Label>
                <Seleccionar valor={monthFilter || "todos"} onValueChange={(v) => setMonthFilter(v === "todos" ? "" : v)}>
                  <SelectTrigger className="w-[180px] redondeado-2xl fondo blanco/50 oscuro:fondo blanco/5">
                    <SelectValue placeholder="Todos" />
                  </Seleccionar disparador>
                  <SeleccionarContenido>
                    <SelectItem value="all">Todos</SelectItem>
                    {OPCIONES_MES.filter((o) => o.value).map((o) => (
                      <SelectItem clave={o.value} valor={o.value}>
                        {o.etiqueta}
                      </SeleccionarElemento>
                    ))}
                  </SeleccionarContenido>
                </Seleccionar>
              </div>

              <Diálogo>
                <DialogTrigger como hijo>
                  <Button variant="outline" className="rounded-2xl bg-white/50 dark:bg-white/5">
                    Presupuestos
                  </Botón>
                </Disparador de diálogo>
                <DialogContent nombre de clase="max-w-3xl">
                  <Encabezado de diálogo>
                    <DialogTitle>Presupuestos por categoría (ARS)</DialogTitle>
                    <Descripción del diálogo>
                      Definió un tope mensual por categoría en ARS. El USD queda fuera porque es otra economía.
                    </Descripción del diálogo>
                  </Encabezado de diálogo>

                  {!monthKeyFromFilter ? (
                    <Alerta>
                      <AlertTitle>Elegí un mes</AlertTitle>
                      <Descripción de alerta>
                        Para definir presupuestos, seleccione un mes específico (Enero..Diciembre).
                      </Descripción de alerta>
                    </Alerta>
                  ) : (
                    <div className="espacio-y-3 máx.-h-[60vh] desbordamiento-automático pr-1">
                      {CATEGORÍAS_DE_GASTOS_ARS.map((c) => {
                        constante gastada = pivotARS[c]?.[monthKeyFromFilter] || 0;
                        constante b = obtenerPresupuesto(monthKeyFromFilter, c);
                        constante limite = b?.limitARS || 0;
                        const pctLabel = límite > 0 ? Math.round((gastado / límite) * 100) : 0;
                        const pct = límite > 0 ? gastado / límite : 0;
                        devolver (
                          <div key={c} className="borde redondeado-2xl p-3 fondo-blanco/40 oscuro:fondo-blanco/5">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div className="min-w-[190px]">
                                <div className="font-medium">{c}</div>
                                <div className="text-xs texto-silenciado-en-primer-plano">
                                  Gastado: <span className="font-medium">{formatMoneyARS(spent)}</span>
                                  {límite > 0 ? (
                                    <>
                                      {" "}· Presupuesto: <span className="font-medium">{formatMoneyARS(limit)}</span>
                                    </>
                                  ) : nulo}
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="h-2 w-completo redondeado-completo fondo-silenciado desbordamiento-oculto">
                                  {límite > 0 ? (
                                    <división
                                      className={`h-2 ${progressColorClass(pct)} redondeado-completo`}
                                      estilo={{ ancho: `${Math.min(pct * 100, 100)}%` }}
                                    />
                                  ) : (
                                    <div className="h-2 bg-transparente" />
                                  )}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {límite > 0? `${pctLabel}% usado` : "Sin presupuesto"}
                                </div>
                              </div>

                              <div className="espacio-y-1">
                                <Label className="text-xs">Presupuesto ARS</Label>
                                <Entrada
                                  className="w-[180px] redondeado-2xl"
                                  modo de entrada="decimal"
                                  Valor predeterminado = {límite ? Cadena(límite): ""}
                                  marcador de posición="Ej: 250000"
                                  onBlur={(e) => setBudget(monthKeyFromFilter, c, safeNumber(e.target.value))}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <Pie de página del diálogo>
                    <Button variant="outline" className="rounded-2xl">Cerrar</Button>
                  </Pie de página del diálogo>
                </Contenido del diálogo>
              </Diálogo>
            </div>
          </div>

          <TabsContent valor="carga" nombreClase="mt-4">
            <div className="cuadrícula cuadrícula-columnas-1 lg:cuadrícula-columnas-3 espacio-4">
              <Card className="lg:col-span-1 rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm">
                <CardHeader>
                  <Título de la tarjeta>{¿edición? "Editar movimiento" : "Agregar movimiento"}</CardTitle>
                </CardHeader>
                <CardContent className="espacio-y-4">
                  <div className="espacio-y-2">
                    <Label>Categoría</Label>
                    <Seleccionar valor={categoría} onValueChange={(v) => setCategory(v como Categoría)}>
                      <SelectTrigger className="redondeado-2xl">
                        <SelectValue placeholder="Elegí una categoría" />
                      </Seleccionar disparador>
                      <SeleccionarContenido>
                        <div className="px-2 py-1 text-xs text-muted-foreground">Gastos</div>
                        {CATEGORÍAS_GASTOS.map((c) => (
                          <Clave SelectItem={c} valor={c}>
                            {do}
                          </SeleccionarElemento>
                        ))}
                        <div className="px-2 py-1 text-xs text-muted-foreground">Positivos</div>
                        {CATEGORÍAS_POSITIVAS.map((c) => (
                          <Clave SelectItem={c} valor={c}>
                            {do}
                          </SeleccionarElemento>
                        ))}
                      </SeleccionarContenido>
                    </Seleccionar>

                    <div className="text-xs texto-silenciado-primer plano elementos flexibles-centro espacio-2">
                      <span>
                        {isExpense(categoría)
                          ? "Se contabiliza como gasto"
                          : "Se contabiliza como ingreso/ahorro"}
                      </span>
                      {isUSDSelected && <Badge variant="outline" className="rounded-full">USD</Badge>}
                      {!isUSDSelected && isExpense(categoría) && <Badge variant="outline" className="rounded-full">ARS</Badge>}
                      {!isExpense(categoría) && !isUSDSelected && <Badge variant="outline" className="rounded-full">ARS</Badge>}
                    </div>
                  </div>

                  <div className="espacio-y-2">
                    <Label>{isUSDSelected ? "Monto (USD)": "Importe (ARS)"}</Label>
                    <Entrada
                      valor={cantidadStr}
                      onChange={(e) => setAmountStr(e.target.value)}
                      modo de entrada="decimal"
                      marcador de posición={isUSDSelected ? "Ej: 35" : "Ej: 125000"}
                      nombreDeClase="redondeado-2xl"
                    />
                    <div className="text-xs texto-silenciado-en-primer-plano">
                      Vista:{" "}
                      <span className="fuente-mediana">
                        {cantidadStr
                          ?isUSDSelected
                            ? formatMoneyUSD(safeNumber(amountStr))
                            : formatMoneyARS(número seguro(cantidadStr))
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="espacio-y-2">
                    <Label>Fecha</Label>
                    <Tipo de entrada="fecha" valor={fecha} onChange={(e) => setDate(e.target.value)} className="rounded-2xl" />
                    <div className="text-xs text-muted-foreground">Consejo: para que se vea en el tablero, use fechas 2026.</div>
                  </div>

                  <div className="espacio-y-2">
                    <Label>Comentario (opcional)</Label>
                    <Área de texto
                      valor={comentario}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Ej: supermercado + farmacia"
                      nombreDeClase="redondeado-2xl"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Botón
                      className="flex-1 redondeado-2xl"
                      onClick={manejarEnvío}
                      deshabilitado={!categoría || !fecha || safeNumber(amountStr) <= 0}
                    >
                      {edición? "Guardar cambios": "Agregar"}
                    </Botón>
                    {edición && (
                      <Botón
                        variante="contorno"
                        nombreDeClase="redondeado-2xl"
                        al hacer clic={() => {
                          setEditing(nulo);
                          establecerCantidadStr("");
                          establecerComentario("");
                        }}
                      >
                        Cancelar
                      </Botón>
                    )}
                  </div>

                  <Separador />

                  <div className="flex flex-wrap gap-2">
                    <Variante del botón="contorno" className="espacio-2 redondeado-2xl" al hacer clic={exportJSON}>
                      <Descargar className="h-4 w-4" /> Exportar
                    </Botón>
                    <label className="inline-flex">
                      <entrada
                        tipo="archivo"
                        aceptar="aplicación/json"
                        nombreDeClase="oculto"
                        al cambiar={(e) => {
                          constante f = e.objetivo.archivos?.[0];
                          si (f) importJSON(f);
                          e.currentTarget.value = "";
                        }}
                      />
                      <Botón variante="contorno" nombre de clase="espacio-2 redondeado-2xl" tipo="botón">
                        <Upload className="h-4 w-4" /> Importar
                      </Botón>
                    </etiqueta>
                    <Diálogo>
                      <DialogTrigger como hijo>
                        <Botón variante="destructivo" className="gap-2 rounded-2xl">
                          <Trash2 className="h-4 w-4" /> Borrar todo
                        </Botón>
                      </Disparador de diálogo>
                      <Contenido del diálogo>
                        <Encabezado de diálogo>
                          <DialogTitle>¿Borrar todo?</DialogTitle>
                          <Descripción del diálogo>
                            Esto elimina los datos locales del navegador. Si tenés Supabase activada, no borra remoto.
                          </Descripción del diálogo>
                        </Encabezado de diálogo>
                        <Pie de página del diálogo>
                          <Button variant="outline">Cancelar</Button>
                          <Botón
                            variante="destructivo"
                            al hacer clic={() => {
                              establecerEntradas([]);
                              establecerPresupuestos([]);
                              localStorage.removeItem(CLAVE_APP);
                            }}
                          >
                            Borrar
                          </Botón>
                        </Pie de página del diálogo>
                      </Contenido del diálogo>
                    </Diálogo>
                  </div>
                </Contenido de la tarjeta>
              </Tarjeta>

              <Card className="lg:col-span-2 rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <CardTitle>Movimientos</CardTitle>
                    <Entrada
                      valor={búsqueda}
                      onChange={(e) => setSearch(e.objetivo.valor)}
                      placeholder="Buscar (categoría, fecha, comentario)"
                      className="w-full md:w-[340px] redondeado-2xl"
                    />
                  </div>
                </CardHeader>
                <Contenido de la tarjeta>
                  <div className="cuadrícula cuadrícula-columnas-2 md:cuadrícula-columnas-6 espacio-3 mb-4">
                    <SummaryKPI title="Ingresos (ARS)" value={formatMoneyARS(totalsCurrentFilter.ingresos)} />
                    <SummaryKPI title="Gastos (ARS)" value={formatMoneyARS(totalsCurrentFilter.gastos)} />
                    <Resumen KPI
                      título="Saldo (ARS)"
                      valor={formatMoneyARS(totalesCurrentFilter.balance)}
                      énfasis={totalsCurrentFilter.balance >= 0}
                    />
                    <SummaryKPI title="Gastos (USD)" value={formatMoneyUSD(totalsCurrentFilter.gastosUSD)} />
                    <SummaryKPI title="Ahorro (USD)" value={formatMoneyUSD(totalsCurrentFilter.ahorroUSD)} />
                    <Resumen KPI
                      título="Saldo (USD)"
                      valor={formatMoneyUSD(totalsCurrentFilter.balanceUSD)}
                      énfasis={totalsCurrentFilter.balanceUSD >= 0}
                    />
                  </div>

                  <div className="borde redondeado 3xl borde blanco/40 fondo blanco/40 oscuro: fondo blanco/5 desbordamiento oculto sombra pequeña">
                    <Tabla>
                      <Encabezado de tabla>
                        <TableRow className="bg-white/30 oscuro:bg-white/5">
                          Fecha
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">Importar</TableHead>
                          <TableHead>Comentario</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </FilaDeTabla>
                      </Encabezado de tabla>
                      <Cuerpo de la tabla>
                        {Entradasfiltradas.length === 0 ? (
                          <Fila de tabla>
                            <TableCell colSpan={5} className="texto-centro texto-sm texto-silenciado-primer-plano py-10">
                              Sin movimientos todavía.
                            </CeldaDeTabla>
                          </FilaDeTabla>
                        ) : (
                          Entradas filtradas.slice(0, 200).map((e) => (
                            <TableRow key={e.id} className="colores de transición hover:bg-white/30 oscuro:hover:bg-white/5">
                              <TableCell className="whitespace-nowrap">{e.date}</TableCell>
                              <CeldaDeTabla>
                                <div className="elementos flexibles-centro espacio-2">
                                  <span>{e.categoría}</span>
                                  {isExpense(e.category) ? <Badge variant="secondary">Gasto</Badge> : <Badge>+</Badge>}
                                  <Badge variant="outline" className="rounded-full">{e.currency}</Badge>
                                </div>
                              </CeldaDeTabla>
                              <TableCell className="texto-derecha números-tabularios">
                                {e.moneda === "USD" ? formatMoneyUSD(e.cantidad) : formatMoneyARS(e.cantidad)}
                              </CeldaDeTabla>
                              <TableCell className="max-w-[340px] truncate" title={e.comment || ""}>{e.comment || "—"}</TableCell>
                              <TableCell className="texto-derecha">
                                <div className="inline-flex gap-2">
                                  <Variante del botón="contorno" tamaño="icono" al hacer clic={() => startEdit(e)}>
                                    <Lápiz className="h-4 w-4" />
                                  </Botón>
                                  <Diálogo>
                                    <DialogTrigger como hijo>
                                      <Botón variante="destructivo" tamaño="icono">
                                        <Trash2 className="h-4 w-4" />
                                      </Botón>
                                    </Disparador de diálogo>
                                    <Contenido del diálogo>
                                      <Encabezado de diálogo>
                                        <DialogTitle>Eliminar movimiento</DialogTitle>
                                        <Descripción del diálogo>
                                          {e.fecha} · {e.categoría} · {e.moneda === "USD" ? formatMoneyUSD(e.cantidad) : formatMoneyARS(e.cantidad)}
                                        </Descripción del diálogo>
                                      </Encabezado de diálogo>
                                      <Pie de página del diálogo>
                                        <Button variant="outline">Cancelar</Button>
                                        <Variante del botón="destructivo" al hacer clic={() => eliminarEntrada(e)}>
                                          Eliminar
                                        </Botón>
                                      </Pie de página del diálogo>
                                    </Contenido del diálogo>
                                  </Diálogo>
                                </div>
                              </CeldaDeTabla>
                            </FilaDeTabla>
                          ))
                        )}
                      </CuerpoDeTabla>
                    </Tabla>
                  </div>

                  {Entradasfiltradas.length > 200 && (
                    <p className="text-xs text-muted-foreground mt-2">Mostrando 200 de {filteredEntries.length} resultados.</p>
                  )}
                </Contenido de la tarjeta>
              </Tarjeta>
            </div>
          Contenido de pestañas

          <TabsContent value="tablero" className="mt-4">
            <Card className="rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-small">
              <CardHeader>
                <CardTitle>Panel de control</CardTitle>
              </CardHeader>
              <Contenido de la tarjeta>
                <div className="borde redondeado 3xl borde blanco/40 fondo blanco/40 oscuro: fondo blanco/5 desbordamiento automático sombra pequeña">
                  {monthKeyFromFilter && (
                    <div className="p-3">
                      <div className="text-sm font-medium">Progreso de presupuestos · {monthLabel(monthKeyFromFilter)}</div>
                      <div className="mt-2 cuadrícula cuadrícula-cols-1 md:grid-cols-2 brecha-3">
                        {CATEGORÍAS_DE_GASTOS_ARS.map((c) => {
                          constante b = obtenerPresupuesto(monthKeyFromFilter, c);
                          si (!b) devuelve nulo;
                          constante gastada = pivotARS[c]?.[monthKeyFromFilter] || 0;
                          const pct = b.limitARS > 0 ? gastado / b.limitARS : 0;
                          const restante = b.limitARS - gastado;
                          devolver (
                            <div key={c} className="borde redondeado-2xl p-3 fondo-blanco/30 oscuro:fondo-blanco/5">
                              <div className="elementos flexibles-centro justificar-entre-espacio-3">
                                <div>
                                  <div className="text-sm font-medium">{c}</div>
                                  <div className="text-xs texto-silenciado-en-primer-plano">
                                    {formatMoneyARS(gastado)} / {formatMoneyARS(b.limitARS)} · {Math.round(pct * 100)}%
                                  </div>
                                </div>
                                <Insignia
                                  className="redondeado-completo"
                                  variante={pct >= 1 ? "destructivo" : pct >= 0.8 ? "secundario" : "predeterminado"}
                                >
                                  {restante >= 0
                                    ? `Restan ${formatMoneyARS(restante)}`
                                    : `Exceso ${formatMoneyARS(Math.abs(restante))}`}
                                </Insignia>
                              </div>
                              <div className="mt-2 h-2 w-completo redondeado-completo fondo-silenciado desbordamiento-oculto">
                                <división
                                  className={`h-2 ${progressColorClass(pct)} redondeado-completo`}
                                  estilo={{ ancho: `${Math.min(pct * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="p-3">
                    <div className="elementos flexibles-centro justificar-entre-espacio-3 ajuste-flexible">
                      <div>
                        <div className="text-sm font-medium">Salud financiera</div>
                        <div className="text-xs texto-silenciado-en-primer-plano">
                          {financialHealth.mode === "mes" && monthKeyFromFilter
                            ? `Mes: ${monthLabel(monthKeyFromFilter)}`
                            : "Vista general 2026 (acumulado)"}
                        </div>
                      </div>
                      <Insignia
                        className="redondeado-completo"
                        variante={
                          estado de salud financiera === "ok"
                            ? "por defecto"
                            : financialHealth.status === "advertencia"
                              ? "secundario"
                              : "destructivo"
                        }
                      >
                        Puntuación {financialHealth.score}/100
                      </Insignia>
                    </div>

                    <div className="mt-3 cuadrícula cuadrícula-cols-1 md:grid-cols-3 gap-3">
                      <div className="borde redondeado 2xl p-3 fondo blanco/30 oscuro:fondo blanco/5">
                        <div className="text-xs text-muted-foreground">ARS</div>
                        <div className="mt-1 text-sm">Ingresos: <span className="font-semibold">{formatMoneyARS(financialHealth.ingresosARS)}</span></div>
                        <div className="text-sm">Gastos: <span className="font-semibold">{formatMoneyARS(financialHealth.gastosARS)}</span></div>
                        <div className="text-sm">Saldo: <span className="font-semibold">{formatMoneyARS(financialHealth.balanceARS)}</span></div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Tasa de ahorro: {Math.round(financialHealth. SavingsRate * 100)}%
                        </div>
                      </div>

                      <div className="borde redondeado 2xl p-3 fondo blanco/30 oscuro:fondo blanco/5">
                        Dólar estadounidense
                        <div className="mt-1 text-sm">Ahorro: <span className="font-semibold">{formatMoneyUSD(financialHealth.ahorroUSD)}</span></div>
                        <div className="text-sm">Gastos: <span className="font-semibold">{formatMoneyUSD(financialHealth.gastosUSD)}</span></div>
                        <div className="text-sm">Saldo: <span className="font-semibold">{formatMoneyUSD(financialHealth.balanceUSD)}</span></div>
                        <div className="mt-2 text-xs text-muted-foreground">Balance USD = Ahorro USD − Gastos USD.</div>
                      </div>

                      <div className="borde redondeado 2xl p-3 fondo blanco/30 oscuro:fondo blanco/5">
                        <div className="text-xs text-muted-foreground">Alertas</div>
                        <div className="mt-2 espacio-y-2">
                          {financialHealth.alerts.length === 0 ? (
                            <div className="text-sm text-muted-foreground">Sin alertas.</div>
                          ) : (
                            saludfinanciera.alertas.map((a, idx) => (
                              <div key={idx} className="elementos flexibles-inicio espacio-2">
                                <lapso
                                  className={`mt-1 bloque en línea h-2 w-2 redondeado completo ${
                                    a.tone === "¿malo?" ? "bg-rose-500" : a.tone === "¿advertencia?" ? "bg-amber-500" : "bg-sky-500"
                                  }`}
                                />
                                <div className="text-sm leading-snug">{a.texto}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Tabla>
                    <TableHeader className="pegajoso top-0 z-20">
                      <TableRow className="bg-white/40 oscuro:bg-white/5">
                        <TableHead className="sticky left-0 bg-white/60 dark:bg-background/80 backdrop-blur z-10 min-w-[240px]">Categoría</TableHead>
                        {meses.map((m, idx) => (
                          <Cabecera de tabla
                            clave={m}
                            nombreDeClase={`espacioEnBlanco-ahora-texto-derecha ${idx === 0 ? "" : "borde-l"} fondo-blanco/30 oscuro:fondo-blanco/5`}
                          >
                            {etiquetaMes(m)}
                          </Cabecera de tabla>
                        ))}
                      </FilaDeTabla>
                    </Encabezado de tabla>
                    <Cuerpo de la tabla>
                      {TODAS_LAS_CATEGORÍAS.map((c) => (
                        < TableRow key={c} className="colores de transición pasar el cursor:bg-white/20 oscuro: pasar el cursor:bg-white/5">
                          <TableCell className="pegajoso izquierda-0 fondo-blanco/60 oscuro:fondo-fondo/80 fondo-desenfoque z-10 fuente-mediana">
                            <div className="elementos flexibles-centro espacio-2">
                              <span>{c}</span>
                              {isExpense(c) ? <Badge variant="secondary">Gasto</Badge> : <Badge>+</Badge>}
                              {c === CATEGORÍA_USD || c === CATEGORÍA_AHORRO ? (
                                USD
                              ) : (
                                <Insignia variante="outline" className="rounded-full">ARS</Insignia>
                              )}
                            </div>
                          </CeldaDeTabla>
                          {meses.map((m, idx) => {
                            celda constante = c === USD_CATEGORY
                              ? (gastosusdpormes[m] || 0)
                              : c === CATEGORÍA DE AHORRO
                                ? (Ahorros en dólares por mes[m] || 0)
                                :(pivotARS[c]?.[m] || 0);
                            devolver (
                              <Celda de tabla
                                clave={m}
                                className={`texto-derecha núms-tabularios espacio-ahora ${idx === 0 ? "" : "border-l"} ${idx % 2 === 0 ? "fondo-blanco/20 oscuro:fondo-blanco/0" : "fondo-blanco/10 oscuro:fondo-blanco/0"}`}
                              >
                                {celda ? ((c === CATEGORÍA_USD || c === CATEGORÍA_AHORRO) ? formatMoneyUSD(celda) : formatMoneyARS(celda)) : "—"}
                              </CeldaDeTabla>
                            );
                          })}
                        </FilaDeTabla>
                      ))}

                      <Fila de tabla>
                        <TableCell className="pegajoso izquierda-0 fondo-blanco/60 oscuro:fondo-fondo/80 fondo-desenfoque z-10 fuente-seminegrita">
                          Totales (Gastos ARS)
                        </CeldaDeTabla>
                        {meses.map((m, idx) => {
                          sea ​​total = 0;
                          para (const c de CATEGORÍAS_DE_GASTOS_ARS) total += pivotARS[c]?.[m] || 0;
                          devolver (
                            <Celda de tabla
                              clave={m}
                              className={`texto-derecha núms. tabulares negrita fuente espacio-ahora ${idx === 0 ? "" : "border-l"}`}
                            >
                              {total ? formatMoneyARS(total) : "—"}
                            </CeldaDeTabla>
                          );
                        })}
                      </FilaDeTabla>

                      <Fila de tabla>
                        <TableCell className="pegajoso izquierda-0 fondo-blanco/60 oscuro:fondo-fondo/80 fondo-desenfoque z-10 fuente-seminegrita">
                          Totales (Ingresos ARS)
                        </CeldaDeTabla>
                        {meses.map((m, idx) => {
                          const total = (pivotARS["Ingresos Javi"]?.[m] || 0) + (pivotARS["Ingresos Miki"]?.[m] || 0);
                          devolver (
                            <TableCell key={m} className={`text-right tabular-nums font-semibold whitespace-nowrap ${idx === 0 ? "" : "border-l"}`}>
                              {total ? formatMoneyARS(total) : "—"}
                            </CeldaDeTabla>
                          );
                        })}
                      </FilaDeTabla>

                      <Fila de tabla>
                        <TableCell className="pegajoso izquierda-0 fondo-blanco/60 oscuro:fondo-fondo/80 fondo-desenfoque z-10 fuente-seminegrita">
                          Totales (Ahorro USD)
                        </CeldaDeTabla>
                        {meses.map((m, idx) => {
                          constante total = usdAhorrosPorMes[m] || 0;
                          devolver (
                            <Celda de tabla
                              clave={m}
                              className={`texto-derecha núms. tabulares negrita fuente espacio-ahora ${idx === 0 ? "" : "border-l"}`}
                            >
                              {total ? formatMoneyUSD(total) : "—"}
                            </CeldaDeTabla>
                          );
                        })}
                      </FilaDeTabla>

                      <Fila de tabla>
                        <TableCell className="pegajoso izquierda-0 fondo-blanco/60 oscuro:fondo-fondo/80 fondo-desenfoque z-10 fuente-seminegrita">
                          Totales (Gastos USD)
                        </CeldaDeTabla>
                        {meses.map((m, idx) => {
                          constante total = usdGastosPorMes[m] || 0;
                          devolver (
                            <TableCell key={m} className={`text-right tabular-nums font-semibold whitespace-nowrap ${idx === 0 ? "" : "border-l"}`}>
                              {total ? formatMoneyUSD(total) : "—"}
                            </CeldaDeTabla>
                          );
                        })}
                      </FilaDeTabla>
                    </CuerpoDeTabla>
                  </Tabla>
                </div>

                <Separador className="my-6" />

                <div className="borde redondeado 3xl borde blanco/40 fondo blanco/40 oscuro: fondo blanco/5 p-4 sombra pequeño">
                  <div className="elementos flexibles-centro justificar-entre-espacio-3 ajuste-flexible">
                    <div>
                      <div className="text-sm font-medium">Comparativa inteligente</div>
                      <div className="text-xs texto-silenciado-en-primer-plano">
                        {clave de mes desde el filtro
                          ? `Comparando ${monthLabel(monthKeyFromFilter)} vs ${smartComparison?.prev ? monthLabel(smartComparison.prev) : "(sin mes previo)"}`
                          : "Seleccioná un mes para ver variaciones vs el mes anterior."}
                      </div>
                    </div>
                    {!monthKeyFromFilter && (
                      <Insignia variante="secundaria" className="redondeada-completa">
                        Elegí un mes arriba
                      </Insignia>
                    )}
                  </div>

                  {!monthKeyFromFilter || !comparacióninteligente ? (
                    <div className="mt-3">
                      <Alerta>
                        <AlertTitle>Consejo</AlertTitle>
                        <Descripción de alerta>
                          Elegí un mes (Enero..Diciembre) en el selector de arriba para ver subas/bajas por categoría y alertas.
                        </Descripción de alerta>
                      </Alerta>
                    </div>
                  ) : (
                    <div className="mt-4 cuadrícula cuadrícula-cols-1 lg:cuadrícula-cols-3 espacio-4">
                      <div className="borde redondeado 2xl p-3 fondo blanco/30 oscuro:fondo blanco/5">
                        <div className="text-sm font-semibold">Subas superiores (ARS)</div>
                        <div className="mt-2 espacio-y-2">
                          {smartComparison.aumenta.longitud === 0 ? (
                            <div className="text-sm text-muted-foreground">Sin subas relevantes.</div>
                          ) : (
                            smartComparison.increases.map((r) => (
                              <div key={r.category} className="elementos flexibles-inicio justificar-entre espacio-3">
                                <div>
                                  <div className="text-sm font-medium">{r.categoría}</div>
                                  <div className="text-xs texto-silenciado-en-primer-plano">
                                    {formatMoneyARS(r.prv)} → {formatMoneyARS(r.cur)}
                                  </div>
                                </div>
                                <div className="texto-derecha">
                                  <div className="text-sm font-semibold">+{formatMoneyARS(r.delta)}</div>
                                  <div className="text-xs texto-silenciado-en-primer-plano">
                                    {r.pct === nulo ? "—" : `+${Math.round(r.pct * 100)}%`}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="borde redondeado 2xl p-3 fondo blanco/30 oscuro:fondo blanco/5">
                        <div className="text-sm font-semibold">Top bajas (ARS)</div>
                        <div className="mt-2 espacio-y-2">
                          {smartComparison.disminuye.longitud === 0 ? (
                            <div className="text-sm text-muted-foreground">Sin bajas relevantes.</div>
                          ) : (
                            smartComparison.decreases.map((r) => (
                              <div key={r.category} className="elementos flexibles-inicio justificar-entre espacio-3">
                                <div>
                                  <div className="text-sm font-medium">{r.categoría}</div>
                                  <div className="text-xs texto-silenciado-en-primer-plano">
                                    {formatMoneyARS(r.prv)} → {formatMoneyARS(r.cur)}
                                  </div>
                                </div>
                                <div className="texto-derecha">
                                  <div className="text-sm font-semibold">{formatMoneyARS(r.delta)}</div>
                                  <div className="text-xs texto-silenciado-en-primer-plano">
                                    {r.pct === nulo ? "—" : `${Math.round(r.pct * 100)}%`}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="borde redondeado 2xl p-3 fondo blanco/30 oscuro:fondo blanco/5">
                        <div className="text-sm font-semibold">Currículum USD</div>
                        <div className="mt-2 espacio-y-3">
                          <div className="elementos flexibles-centro-justificar-entre">
                            Gastos USD
                            <div className="texto-derecha">
                              <div className="text-sm font-semibold">{formatMoneyUSD(smartComparison.usd.gastos.cur)}</div>
                              <div className="text-xs texto-silenciado-en-primer-plano">
                                Δ {formatoDineroUSD(smartComparison.usd.gastos.delta)}
                              </div>
                            </div>
                          </div>
                          <div className="elementos flexibles-centro-justificar-entre">
                            <div className="text-sm">Ahorro USD</div>
                            <div className="texto-derecha">
                              <div className="text-sm font-semibold">{formatMoneyUSD(smartComparison.usd.ahorro.cur)}</div>
                              <div className="text-xs texto-silenciado-en-primer-plano">
                                Δ {formatoDineroUSD(smartComparison.usd.ahorro.delta)}
                              </div>
                            </div>
                          </div>
                          <div className="elementos flexibles-centro-justificar-entre">
                            <div className="text-sm">Saldo en USD</div>
                            <div className="texto-derecha">
                              <div className="text-sm font-semibold">{formatMoneyUSD(smartComparison.usd.balance.cur)}</div>
                              <div className="text-xs texto-silenciado-en-primer-plano">
                                Δ {formatMoneyUSD(smartComparison.usd.balance.delta)}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs texto-silenciado-en-primer-plano">
                            Saldo USD = Ahorro USD − Gastos USD.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separador className="my-6" />

                <div className="cuadrícula cuadrícula-columnas-1 lg:cuadrícula-columnas-3 espacio-4">
                  <Card className="rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base">Evolución mensual (ARS)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px]">
                      <Contenedor responsivo ancho="100%" alto="100%">
                        <LineChart data={totalsByMonthARS} margin={{arriba: 10, derecha: 10, izquierda: 0, abajo: 0}}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ tamaño de fuente: 12 }} />
                          <Tooltip formatter={(v: any) => formatMoneyARS(Number(v) || 0)} />
                          <Leyenda />
                          <Tipo de línea="monótono" Clave de datos="ingresos" Nombre="Ingresos" Ancho de trazo={2} Punto={falso} />
                          <Tipo de línea="monótono" Clave de datos="gastos" Nombre="Gastos" Ancho de trazo={2} Punto={falso} />
                                                    <Tipo de línea="monótono" Clave de datos="balance" Nombre="Balance" Ancho de trazo={2} Punto={falso} />
                        </Gráfico de líneas>
                      </ContenedorResponsivo>
                    </Contenido de la tarjeta>
                  </Tarjeta>

                  <Card className="rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-small">
                    <CardHeader>
                      <CardTitle className="text-base">USD por mes (Gastos + Ahorro)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px]">
                      <Contenedor responsivo ancho="100%" alto="100%">
                        <Gráfico de líneas
                          datos={meses.map((m) => ({
                            mes: monthLabel(m),
                            gastosUSD: usdExpensesByMonth[m] || 0,
                            ahorroUSD: usdSavingsByMonth[m] || 0,
                            balanceUSD: balanceUSDPorMes[m] || 0,
                          }))}
                          margen={{arriba: 10, derecha: 10, izquierda: 0, abajo: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ tamaño de fuente: 12 }} />
                          <Tooltip formatter={(v: any) => formatMoneyUSD(Number(v) || 0)} />
                          <Leyenda />
                          <Tipo de línea="monótono" clave de datos="gastosUSD" nombre="Gastos USD" ancho de trazo={2} punto={falso} />
                          <Tipo de línea="monótono" clave de datos="ahorroUSD" nombre="Ahorro USD" ancho de trazo={2} punto={falso} />
                          <Tipo de línea="monótono" Clave de datos="balanceUSD" Nombre="Saldo USD" Ancho de trazo={2} Punto={falso} />
                        </Gráfico de líneas>
                      </ContenedorResponsivo>
                    </Contenido de la tarjeta>
                  </Tarjeta>

                  <Card className="rounded-3xl border-white/40 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm lg:col-span-3">
                    <CardHeader>
                      <CardTitle className="text-base">Principales categorías de gasto (ARS)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px]">
                      <Contenedor responsivo ancho="100%" alto="100%">
                        <BarChart data={topCategoriesForBarsARS} margin={{ arriba: 10, derecha: 10, izquierda: 0, abajo: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="categoría" tick={{ fontSize: 12 }} intervalo={0} ángulo={-20} textAnchor="fin" altura={80} />
                          <YAxis tick={{ tamaño de fuente: 12 }} />
                          <Tooltip formatter={(v: any) => formatMoneyARS(Number(v) || 0)} />
                          <Bar dataKey="total" name="Total" />
                        Gráfico de barras
                      </ContenedorResponsivo>
                    </Contenido de la tarjeta>
                  </Tarjeta>
                </div>
              </Contenido de la tarjeta>
            </Tarjeta>
          Contenido de pestañas
        </Pestañas>

        <div className="mt-10 borde redondeado 2xl p-4 texto-xs texto-silenciado-primer plano fondo-blanco/40 oscuro:fondo-blanco/5">
          <div className="font-medium text-foreground">DDL sugerido para Supabase</div>
          <p className="mt-1">
            Copie/pegue en el editor SQL de Supabase. Luego, en Base de datos → Replicación, habilitará Tiempo real para estas tablas.
          </p>
          <pre className="mt-3 espacio en blanco-pre-wrap redondeado-xl fondo-silenciado p-3 desbordamiento-automático">
{`-- Tabla principal (ARS + USD separado)
crear tabla si no existe public.finance_entries (
  el texto de la habitación no es nulo,
  clave principal del texto de identificación,
  el texto de la categoría no es nulo,
  texto de moneda no nulo predeterminado 'ARS',
  cantidad numérica no nula,
  -- Campos Legacy/Compat (opcional pero recomendados si ya los usabas)
  amountARS numérico no nulo predeterminado 0,
  cantidadUSD numérica,
  el texto de fecha no es nulo,
  texto del comentario,
  createdAt bigint no es nulo,
  actualizadoEn bigint no nulo
);

-- Presupuestos mensuales (ARS)
crear tabla si no existe public.finance_budgets (
  el texto de la habitación no es nulo,
  clave principal del texto de identificación,
  El texto de la clave del mes no es nulo,
  el texto de la categoría no es nulo,
  limitARS numérico no nulo,
  actualizadoEn bigint no nulo
);

-- Índices útiles
crear índice si no existe finance_entries_room_idx en public.finance_entries(room);
crear índice si no existe finance_entries_room_date_idx en public.finance_entries(room, date);

crear índice si no existe finance_budgets_room_idx en public.finance_budgets(room);
crear índice si no existe finance_budgets_room_month_idx en public.finance_budgets(room, monthKey);

-- (Opcional) RLS
-- alterar la tabla public.finance_entries habilitar seguridad a nivel de fila;
-- alterar la tabla public.finance_budgets habilitar seguridad a nivel de fila;
-- crear la política "room_read" en public.finance_entries para seleccionar usando (verdadero);
-- crear política "room_write" en public.finance_entries para insertar con verificación (verdadero);
-- crear la política "room_update" en public.finance_entries para actualizar usando (true);
-- crear la política "room_delete" en public.finance_entries para eliminar usando (true);
-- crear la política "budgets_read" en public.finance_budgets para seleccionar usando (verdadero);
-- crear política "budgets_write" en public.finance_budgets para insertar con verificación (verdadero);
-- crear la política "budgets_update" en public.finance_budgets para actualizar usando (true);
-- crear la política "budgets_delete" en public.finance_budgets para eliminar usando (true);
`}
          </pre>
        </div>
      </div>
    </div>
  );
}

Función ResumenKPI({
  título,
  valor,
  énfasis,
}: {
  título: cadena;
  valor: cadena;
  énfasis?: booleano;
}) {
  devolver (
    <div className="borde redondeado 2xl borde blanco/40 fondo blanco/50 oscuro: fondo blanco/5 p-3 sombra pequeño fondo desenfocado">
      <div className="text-xs text-muted-foreground">{título}</div>
      <div className={`mt-1 text-lg font-semibold tabular-nums ${énfasis ? "" : ""}`}>{valor}</div>
    </div>
  );
}
