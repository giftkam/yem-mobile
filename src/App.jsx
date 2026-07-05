import React, { useState, useEffect, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import {
  Home, BarChart2, Wallet, User, Plus, ChevronLeft, Search,
  ArrowUpRight, ArrowDownRight, Bell, ArrowRight, Banknote,
  Smartphone, Building2, CreditCard, Check, X, Info,
  ShieldCheck, Camera, Upload, FileText, Crown, LogOut, Eye, EyeOff, Loader2,
} from "lucide-react";
import { api, setAuthToken, loadStoredToken } from "./api";

/* ---------------------------------- tokens ---------------------------------- */
const C = {
  ink: "#10201B", ink2: "#16291F", ink3: "#1D3329", sand: "#F3ECDD",
  gold: "#D9A441", teal: "#3FB28F", coral: "#E2604F", blue: "#6C9BC9", mauve: "#B97A9B", ash: "#8FA39A",
};
const REGION_COLOR = { AFR: C.gold, EUR: C.blue, AM: C.mauve };
const LANGUAGES = [
  { code: "en", label: "English" }, { code: "fr", label: "Français" },
  { code: "sw", label: "Kiswahili" }, { code: "pt", label: "Português" },
];
/* ---------------------------------- i18n ---------------------------------- */
const I18N = {
  en: {
    "nav.home": "Home", "nav.markets": "Markets", "nav.orders": "Orders", "nav.wallet": "Wallet", "nav.profile": "Profile",
    "home.portfolioValue": "Available balance", "home.today": "today", "home.deposit": "Deposit", "home.markets": "Markets", "home.withdraw": "Withdraw", "home.marketsTitle": "Markets",
    "tabs.stocks": "Stocks", "tabs.crypto": "Crypto", "tabs.forex": "Forex",
    "asset.buy": "Buy", "asset.sell": "Sell", "asset.amount": "Amount", "asset.orderAmount": "Order amount", "asset.platformFee": "Platform fee", "asset.totalToPay": "Total to pay", "asset.youllReceive": "You'll receive",
    "asset.confirmBuy": "Confirm buy order", "asset.confirmSell": "Confirm sell order",
    "asset.filled": "Order filled", "asset.bought": "bought", "asset.sold": "sold",
    "wallet.title": "Wallet", "wallet.availableBalance": "Available balance", "wallet.deposit": "Deposit", "wallet.withdraw": "Withdraw",
    "wallet.depositWith": "Deposit with", "wallet.withdrawTo": "Withdraw to", "wallet.amount": "Amount", "wallet.platformFee": "Platform fee",
    "wallet.credited": "Credited to balance", "wallet.youllReceive": "You'll receive", "wallet.confirmDeposit": "Confirm deposit", "wallet.confirmWithdraw": "Confirm withdraw",
    "wallet.recentActivity": "Recent activity",
    "owner.dashboard": "Owner dashboard", "owner.earnings": "Available to pay out", "owner.settlement": "settlement account", "owner.requestPayout": "Request payout",
    "owner.platformOverview": "Platform overview", "owner.totalUsers": "Registered users", "owner.volumeToday": "Trade volume today", "owner.regionSplit": "Users by region",
    "profile.title": "Profile", "profile.verified": "Verified account", "profile.identity": "Identity verification", "profile.payments": "Linked payment methods",
    "profile.notifications": "Notifications", "profile.security": "Security", "profile.help": "Help & support",
    "kyc.title": "Identity verification", "kyc.personal": "Personal details", "kyc.fullName": "Full legal name", "kyc.country": "Country", "kyc.dob": "Date of birth",
    "kyc.document": "Identity document", "kyc.uploadDoc": "Upload document", "kyc.uploaded": "Document uploaded", "kyc.selfie": "Take a selfie",
    "kyc.selfieHint": "Match your face to your document photo", "kyc.captured": "Selfie captured", "kyc.review": "Review & submit",
    "kyc.submit": "Submit for review", "kyc.underReview": "Under review", "kyc.submittedNote": "We'll verify your details soon.",
    "kyc.next": "Continue", "kyc.back": "Back",
    "orders.title": "Order history", "orders.empty": "No orders yet — your filled trades will show up here.", "orders.all": "All", "orders.buys": "Buys", "orders.sells": "Sells", "orders.fee": "fee",
    "auth.welcome": "Welcome to Yem", "auth.tagline": "Multi-asset trading across Africa, Europe & the Americas",
    "auth.signup": "Sign up", "auth.login": "Log in", "auth.fullName": "Full name", "auth.email": "Email", "auth.phone": "Phone number",
    "auth.country": "Country", "auth.password": "Password", "auth.createAccount": "Create account", "auth.signIn": "Sign in",
    "auth.haveAccount": "Already have an account? Log in", "auth.noAccount": "New to Yem? Create an account", "auth.logout": "Log out",
  },
};
/* ---------------------------------- static display data ---------------------------------- */
const ASSETS = [
  { id: "aapl", symbol: "AAPL", name: "Apple Inc.", category: "stocks", region: "AM", price: 189.32, changePct: 1.24 },
  { id: "msft", symbol: "MSFT", name: "Microsoft Corp.", category: "stocks", region: "AM", price: 421.04, changePct: -0.42 },
  { id: "tsla", symbol: "TSLA", name: "Tesla Inc.", category: "stocks", region: "AM", price: 261.77, changePct: 3.18 },
  { id: "sap", symbol: "SAP", name: "SAP SE", category: "stocks", region: "EUR", price: 214.55, changePct: 0.61 },
  { id: "lvmh", symbol: "MC.PA", name: "LVMH", category: "stocks", region: "EUR", price: 668.20, changePct: -1.05 },
  { id: "shel", symbol: "SHEL", name: "Shell plc", category: "stocks", region: "EUR", price: 31.84, changePct: 0.88 },
  { id: "npn", symbol: "NPN", name: "Naspers Ltd.", category: "stocks", region: "AFR", price: 312.40, changePct: 2.05 },
  { id: "dangcem", symbol: "DANGCEM", name: "Dangote Cement", category: "stocks", region: "AFR", price: 24.10, changePct: 0.33 },
  { id: "scom", symbol: "SCOM", name: "Safaricom", category: "stocks", region: "AFR", price: 1.18, changePct: -0.72 },
  { id: "btc", symbol: "BTC", name: "Bitcoin", category: "crypto", region: "AM", price: 68420.50, changePct: 2.41 },
  { id: "eth", symbol: "ETH", name: "Ethereum", category: "crypto", region: "EUR", price: 3754.12, changePct: 1.77 },
  { id: "usdt", symbol: "USDT", name: "Tether", category: "crypto", region: "AM", price: 1.00, changePct: 0.01 },
  { id: "bnb", symbol: "BNB", name: "BNB", category: "crypto", region: "AFR", price: 612.30, changePct: -0.94 },
  { id: "sol", symbol: "SOL", name: "Solana", category: "crypto", region: "AM", price: 172.66, changePct: 4.52 },
  { id: "xrp", symbol: "XRP", name: "XRP", category: "crypto", region: "EUR", price: 0.62, changePct: -2.13 },
  { id: "usdngn", symbol: "USD/NGN", name: "Dollar – Naira", category: "forex", region: "AFR", price: 1550.25, changePct: 0.18 },
  { id: "eurusd", symbol: "EUR/USD", name: "Euro – Dollar", category: "forex", region: "EUR", price: 1.0742, changePct: -0.06 },
  { id: "gbpusd", symbol: "GBP/USD", name: "Pound – Dollar", category: "forex", region: "EUR", price: 1.2664, changePct: 0.11 },
  { id: "usdkes", symbol: "USD/KES", name: "Dollar – Shilling", category: "forex", region: "AFR", price: 129.40, changePct: -0.22 },
  { id: "usdzar", symbol: "USD/ZAR", name: "Dollar – Rand", category: "forex", region: "AFR", price: 18.21, changePct: 0.34 },
  { id: "eurgbp", symbol: "EUR/GBP", name: "Euro – Pound", category: "forex", region: "EUR", price: 0.8483, changePct: -0.04 },
];

const PAYMENT_METHODS = {
  AFR: [
    { id: "mpesa", label: "M-Pesa", icon: Smartphone, sub: "Mobile money · instant" },
    { id: "airtel", label: "Airtel Money", icon: Smartphone, sub: "Mobile money · instant" },
    { id: "momo", label: "MTN MoMo", icon: Smartphone, sub: "Mobile money · instant" },
    { id: "banktransfer", label: "Bank transfer", icon: Building2, sub: "1–2 business days" },
  ],
  EUR: [
    { id: "sepa", label: "SEPA transfer", icon: Building2, sub: "Same business day" },
    { id: "card", label: "Debit / credit card", icon: CreditCard, sub: "Instant" },
  ],
  AM: [
    { id: "ach", label: "ACH transfer", icon: Building2, sub: "1–3 business days" },
    { id: "card", label: "Debit / credit card", icon: CreditCard, sub: "Instant" },
    { id: "wire", label: "Wire transfer", icon: Banknote, sub: "Same business day" },
  ],
};
const DOCUMENT_TYPES = {
  AFR: ["National ID", "Passport", "Voter's card"],
  EUR: ["National ID card", "Passport"],
  AM: ["Driver's license", "Passport", "State ID"],
};
const COUNTRIES_BY_REGION = {
  AFR: ["Nigeria", "Kenya", "South Africa", "Zambia", "Ghana", "Tanzania"],
  EUR: ["Germany", "France", "United Kingdom", "Portugal", "Netherlands", "Spain"],
  AM: ["United States", "Canada", "Brazil", "Mexico"],
};
const ALL_COUNTRIES = Object.entries(COUNTRIES_BY_REGION).flatMap(([region, list]) => list.map((name) => ({ name, region })));
/* ---------------------------------- helpers ---------------------------------- */
function seededRandom(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
function genHistory(seedStr, points, base, volatility) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed += seedStr.charCodeAt(i) * (i + 7);
  const rand = seededRandom(seed);
  let v = base;
  const out = [];
  for (let i = 0; i < points; i++) { v = v + (rand() - 0.48) * volatility; if (v < base * 0.5) v = base * 0.5; out.push({ i, v: Number(v.toFixed(4)) }); }
  return out;
}
function formatUsd(value) {
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2 }).format(value); }
  catch { return `$${value.toFixed(2)}`; }
}

/* ---------------------------------- small components ---------------------------------- */
function RegionPill({ region }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-semibold tracking-wide" style={{ background: `${REGION_COLOR[region]}22`, color: REGION_COLOR[region] }}>
      <span className="h-[5px] w-[5px] rounded-full" style={{ background: REGION_COLOR[region] }} />{region}
    </span>
  );
}
function Sparkline({ data, positive }) {
  return (
    <div className="h-9 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}><YAxis hide domain={["dataMin", "dataMax"]} /><Line type="monotone" dataKey="v" stroke={positive ? C.teal : C.coral} strokeWidth={1.8} dot={false} isAnimationActive={false} /></LineChart>
      </ResponsiveContainer>
    </div>
  );
}
function TickerStrip() {
  const items = useMemo(() => [...ASSETS, ...ASSETS], []);
  return (
    <div className="relative overflow-hidden border-y" style={{ borderColor: "#FFFFFF14", background: C.ink2 }}>
      <div className="ticker-track flex w-max items-center gap-6 py-2 px-4">
        {items.map((a, idx) => {
          const positive = a.changePct >= 0;
          const display = a.category === "forex" ? a.price.toFixed(4) : formatUsd(a.price);
          return (
            <div key={idx} className="flex items-center gap-2 whitespace-nowrap text-xs">
              <RegionPill region={a.region} /><span className="font-semibold" style={{ color: C.sand }}>{a.symbol}</span>
              <span style={{ color: C.ash, fontFamily: "'IBM Plex Mono', monospace" }}>{display}</span>
              <span style={{ color: positive ? C.teal : C.coral }} className="flex items-center">{positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{Math.abs(a.changePct).toFixed(2)}%</span>
            </div>
          );
        })}
      </div>
      <style>{`
        .ticker-track { animation: yem-scroll 38s linear infinite; }
        @keyframes yem-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }
      `}</style>
    </div>
  );
}
function AssetRow({ asset, onClick }) {
  const positive = asset.changePct >= 0;
  const hist = useMemo(() => genHistory(asset.id, 20, asset.price, asset.price * 0.02), [asset]);
  const display = asset.category === "forex" ? asset.price.toFixed(4) : formatUsd(asset.price);
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between gap-3 border-b px-4 py-3 text-left transition-colors active:bg-white/5" style={{ borderColor: "#FFFFFF0F" }}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: C.ink3, color: C.gold }}>{asset.symbol.slice(0, 2)}</div>
        <div className="min-w-0">
          <div className="flex items-center gap-2"><span className="truncate text-sm font-semibold" style={{ color: C.sand }}>{asset.symbol}</span><RegionPill region={asset.region} /></div>
          <div className="truncate text-xs" style={{ color: C.ash }}>{asset.name}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Sparkline data={hist} positive={positive} />
        <div className="text-right">
          <div className="text-sm font-semibold" style={{ color: C.sand, fontFamily: "'IBM Plex Mono', monospace" }}>{display}</div>
          <div className="flex items-center justify-end gap-0.5 text-xs" style={{ color: positive ? C.teal : C.coral }}>{positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{Math.abs(asset.changePct).toFixed(2)}%</div>
        </div>
      </div>
    </button>
  );
}
function SegmentedTabs({ value, onChange, options }) {
  return (
    <div className="flex gap-1 rounded-full p-1" style={{ background: C.ink3 }}>
      {options.map((o) => <button key={o.value} onClick={() => onChange(o.value)} className="flex-1 rounded-full py-1.5 text-xs font-semibold transition-colors" style={{ background: value === o.value ? C.gold : "transparent", color: value === o.value ? C.ink : C.ash }}>{o.label}</button>)}
    </div>
  );
}
function Header({ lang, setLang, title, onBack }) {
  const [openLang, setOpenLang] = useState(false);
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-4 pb-3 pt-4" style={{ background: C.ink }}>
      <div className="flex items-center gap-2">
        {onBack ? <button onClick={onBack} className="rounded-full p-1.5 -ml-1.5" style={{ color: C.sand }}><ChevronLeft size={20} /></button> : <span className="text-xl font-bold" style={{ color: C.gold, fontFamily: "'Fraunces', serif" }}>Yem</span>}
        {title && <span className="text-base font-semibold" style={{ color: C.sand }}>{title}</span>}
      </div>
      <div className="flex items-center gap-1.5">
        {!title && <button className="rounded-full p-1.5" style={{ color: C.sand }}><Bell size={18} /></button>}
        <div className="relative">
          <button onClick={() => setOpenLang((v) => !v)} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase" style={{ background: C.ink3, color: C.sand }}>{lang}<span style={{ color: C.ash }}>▾</span></button>
          {openLang && (
            <div className="absolute right-0 z-30 mt-1 w-36 overflow-hidden rounded-xl border shadow-xl" style={{ background: C.ink2, borderColor: "#FFFFFF1A" }}>
              {LANGUAGES.map((l) => <button key={l.code} onClick={() => { setLang(l.code); setOpenLang(false); }} className="flex w-full items-center justify-between px-3 py-2 text-left text-xs" style={{ color: l.code === lang ? C.gold : C.sand }}><span>{l.label}</span><span style={{ color: C.ash }}>{l.code.toUpperCase()}</span></button>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
/* ---------------------------------- auth ---------------------------------- */
function AuthScreen({ lang, setLang, t, onAuth }) {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(ALL_COUNTRIES[0].name);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { token, user } = await api.signup({ fullName: name, email, phone, country, password });
        onAuth(token, user);
      } else {
        const { token, user } = await api.login({ email, password });
        onAuth(token, user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-10">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold" style={{ color: C.gold, fontFamily: "'Fraunces', serif" }}>Yem</span>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-full border-0 px-2.5 py-1 text-xs font-semibold uppercase outline-none" style={{ background: C.ink3, color: C.sand }}>
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.code.toUpperCase()}</option>)}
        </select>
      </div>
      <div className="mt-6">
        <div className="text-2xl font-bold" style={{ color: C.sand, fontFamily: "'Fraunces', serif" }}>{t("auth.welcome")}</div>
        <div className="mt-1 text-xs" style={{ color: C.ash }}>{t("auth.tagline")}</div>
      </div>
      <div className="mt-6"><SegmentedTabs value={mode} onChange={(v) => { setMode(v); setError(""); }} options={[{ value: "signup", label: t("auth.signup") }, { value: "login", label: t("auth.login") }]} /></div>
      <div className="mt-5 flex flex-col gap-3 overflow-y-auto">
        {mode === "signup" && (
          <div><label className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("auth.fullName")}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border-0 px-3 py-2.5 text-sm outline-none" style={{ background: C.ink2, color: C.sand }} placeholder="e.g. Amara Bello" /></div>
        )}
        <div><label className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("auth.email")}</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-xl border-0 px-3 py-2.5 text-sm outline-none" style={{ background: C.ink2, color: C.sand }} placeholder="you@example.com" /></div>
        {mode === "signup" && (
          <>
            <div><label className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("auth.phone")}</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border-0 px-3 py-2.5 text-sm outline-none" style={{ background: C.ink2, color: C.sand }} placeholder="+___ ___ ___ ___" /></div>
            <div><label className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("auth.country")}</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 w-full rounded-xl border-0 px-3 py-2.5 text-sm outline-none" style={{ background: C.ink2, color: C.sand }}>
                {ALL_COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select></div>
          </>
        )}
        <div><label className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("auth.password")}</label>
          <div className="relative mt-1">
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPw ? "text" : "password"} className="w-full rounded-xl border-0 px-3 py-2.5 text-sm outline-none" style={{ background: C.ink2, color: C.sand }} placeholder="••••••••" />
            <button onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.ash }}>{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>
          </div>
        </div>
        {error && <div className="rounded-lg px-3 py-2 text-xs" style={{ background: `${C.coral}1A`, color: C.coral }}>{error}</div>}
        <button onClick={submit} disabled={loading} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold" style={{ background: C.gold, color: C.ink, opacity: loading ? 0.7 : 1 }}>
          {loading && <Loader2 size={15} className="animate-spin" />}{mode === "signup" ? t("auth.createAccount") : t("auth.signIn")}
        </button>
        <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }} className="text-center text-xs font-medium" style={{ color: C.teal }}>{mode === "signup" ? t("auth.haveAccount") : t("auth.noAccount")}</button>
      </div>
    </div>
  );
}
/* ---------------------------------- screens ---------------------------------- */
function HomeScreen({ lang, setLang, t, balanceUsd, openAsset, setScreen }) {
  const [cat, setCat] = useState("stocks");
  const filtered = ASSETS.filter((a) => a.category === cat);
  return (
    <div>
      <Header lang={lang} setLang={setLang} />
      <TickerStrip />
      <div className="px-4 pt-5">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("home.portfolioValue")}</div>
        <div className="mt-1 text-3xl font-bold" style={{ color: C.sand, fontFamily: "'Fraunces', serif" }}>{formatUsd(balanceUsd)}</div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 px-4">
        {[{ label: t("home.deposit"), icon: Plus }, { label: t("home.markets"), icon: BarChart2 }, { label: t("home.withdraw"), icon: ArrowRight }].map((b) => (
          <button key={b.label} className="flex flex-col items-center gap-1.5 rounded-2xl py-3 text-xs font-semibold" style={{ background: C.ink2, color: C.sand }}><b.icon size={16} style={{ color: C.gold }} />{b.label}</button>
        ))}
      </div>
      <div className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold" style={{ color: C.sand }}>{t("home.marketsTitle")}</span><Search size={16} style={{ color: C.ash }} /></div>
        <SegmentedTabs value={cat} onChange={setCat} options={[{ value: "stocks", label: t("tabs.stocks") }, { value: "crypto", label: t("tabs.crypto") }, { value: "forex", label: t("tabs.forex") }]} />
      </div>
      <div className="mt-3 pb-4">{filtered.map((a) => <AssetRow key={a.id} asset={a} onClick={() => openAsset(a)} />)}</div>
    </div>
  );
}

function AssetScreen({ asset, lang, t, onBack, onOrderPlaced }) {
  const [range, setRange] = useState("1D");
  const [side, setSide] = useState("buy");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ranges = { "1D": 24, "1W": 28, "1M": 30, "3M": 36, "1Y": 48 };
  const hist = useMemo(() => genHistory(asset.id + range, ranges[range], asset.price, asset.price * 0.025), [asset, range]);
  const positive = asset.changePct >= 0;
  const display = asset.category === "forex" ? asset.price.toFixed(4) : formatUsd(asset.price);
  const amountUSD = Number(amount) || 0;

  const submit = async () => {
    if (amountUSD <= 0) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await api.placeOrder({ assetSymbol: asset.symbol, side, amountUsd: amountUSD });
      setResult(res);
      onOrderPlaced();
      setAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-6">
      <Header lang={lang} setLang={() => {}} title={asset.symbol} onBack={onBack} />
      <div className="px-4">
        <div className="flex items-center gap-2"><span className="text-sm" style={{ color: C.ash }}>{asset.name}</span><RegionPill region={asset.region} /></div>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-3xl font-bold" style={{ color: C.sand, fontFamily: "'Fraunces', serif" }}>{display}</span>
          <span className="mb-1 flex items-center gap-0.5 text-sm font-semibold" style={{ color: positive ? C.teal : C.coral }}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(asset.changePct).toFixed(2)}%</span>
        </div>
      </div>
      <div className="mt-4 h-44 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hist}><YAxis hide domain={["dataMin", "dataMax"]} /><Tooltip contentStyle={{ background: C.ink2, border: "none", borderRadius: 8, fontSize: 11 }} labelFormatter={() => ""} formatter={(v) => [Number(v).toFixed(asset.category === "forex" ? 4 : 2), asset.symbol]} /><Line type="monotone" dataKey="v" stroke={positive ? C.teal : C.coral} strokeWidth={2} dot={false} /></LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-2 px-4">{Object.keys(ranges).map((r) => <button key={r} onClick={() => setRange(r)} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: range === r ? C.ink3 : "transparent", color: range === r ? C.gold : C.ash }}>{r}</button>)}</div>
      <div className="mt-6 px-4">
        <SegmentedTabs value={side} onChange={(v) => { setSide(v); setResult(null); setError(""); }} options={[{ value: "buy", label: t("asset.buy") }, { value: "sell", label: t("asset.sell") }]} />
        <div className="mt-4">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("asset.amount")} (USD)</label>
          <input value={amount} onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, "")); setResult(null); setError(""); }} placeholder="0.00" inputMode="decimal" className="mt-1 w-full rounded-xl border-0 px-3 py-2.5 text-lg font-semibold outline-none" style={{ background: C.ink2, color: C.sand, fontFamily: "'IBM Plex Mono', monospace" }} />
        </div>
        {error && <div className="mt-3 rounded-lg px-3 py-2 text-xs" style={{ background: `${C.coral}1A`, color: C.coral }}>{error}</div>}
        <button onClick={submit} disabled={loading || amountUSD <= 0} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold" style={{ background: side === "buy" ? C.teal : C.coral, color: C.ink, opacity: amountUSD > 0 ? 1 : 0.5 }}>
          {loading && <Loader2 size={15} className="animate-spin" />}{side === "buy" ? t("asset.confirmBuy") : t("asset.confirmSell")}
        </button>
        {result && (
          <div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs" style={{ background: `${C.teal}1A`, color: C.teal }}>
            <Check size={14} className="mt-0.5 shrink-0" />
            <span>{t("asset.filled")} — {side === "buy" ? t("asset.bought") : t("asset.sold")} {result.quantity} {asset.symbol}. {t("asset.platformFee")}: {formatUsd(result.feeUsd)}.</span>
          </div>
        )}
      </div>
    </div>
  );
}
function OrdersScreen({ lang, setLang, t }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getOrders().then((r) => setOrders(r.orders)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const list = orders.filter((o) => filter === "all" || o.side === filter.slice(0, -1));
  return (
    <div className="pb-6">
      <Header lang={lang} setLang={setLang} title={t("orders.title")} />
      <div className="px-4"><SegmentedTabs value={filter} onChange={setFilter} options={[{ value: "all", label: t("orders.all") }, { value: "buys", label: t("orders.buys") }, { value: "sells", label: t("orders.sells") }]} /></div>
      <div className="mt-4 px-4">
        {loading && <div className="flex justify-center py-6"><Loader2 size={18} className="animate-spin" style={{ color: C.ash }} /></div>}
        {error && <div className="rounded-lg px-3 py-2 text-xs" style={{ background: `${C.coral}1A`, color: C.coral }}>{error}</div>}
        {!loading && !error && list.length === 0 && <div className="rounded-2xl p-5 text-center text-xs" style={{ background: C.ink2, color: C.ash }}>{t("orders.empty")}</div>}
        {!loading && list.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {list.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: C.ink2 }}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: C.ink3, color: o.side === "buy" ? C.teal : C.coral }}>{o.side === "buy" ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}</div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: C.sand }}>{o.side === "buy" ? t("asset.bought") : t("asset.sold")} {o.asset_symbol}</div>
                    <div className="text-[11px]" style={{ color: C.ash }}>{Number(o.quantity).toFixed(4)} · {t("orders.fee")} {formatUsd(o.fee_usd)}</div>
                  </div>
                </div>
                <div className="text-xs font-semibold" style={{ color: C.sand, fontFamily: "'IBM Plex Mono', monospace" }}>{formatUsd(o.total_usd)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WalletScreen({ lang, setLang, t, balanceUsd, refreshBalance }) {
  const region = "AFR";
  const methods = PAYMENT_METHODS[region];
  const [mode, setMode] = useState(null);
  const [picked, setPicked] = useState(null);
  const [amount, setAmount] = useState("");
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { api.getTransactions().then((r) => setTxns(r.transactions)).catch(() => {}); }, []);

  const amountUSD = Number(amount) || 0;
  const reset = () => { setMode(null); setPicked(null); setAmount(""); setError(""); };

  const confirm = async () => {
    if (amountUSD <= 0 || !picked) return;
    setLoading(true); setError("");
    try {
      if (mode === "deposit") await api.deposit({ method: picked, amountUsd: amountUSD, currency: "USD" });
      else await api.withdraw({ method: picked, amountUsd: amountUSD, currency: "USD", destination: picked });
      const [{ transactions }] = await Promise.all([api.getTransactions()]);
      setTxns(transactions);
      refreshBalance();
      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-6">
      <Header lang={lang} setLang={setLang} title={t("wallet.title")} />
      <div className="px-4">
        <div className="rounded-2xl p-4" style={{ background: C.ink2 }}>
          <div className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("wallet.availableBalance")}</div>
          <div className="mt-1 text-2xl font-bold" style={{ color: C.sand, fontFamily: "'Fraunces', serif" }}>{formatUsd(balanceUsd)}</div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setMode(mode === "deposit" ? null : "deposit")} className="flex-1 rounded-xl py-2 text-xs font-bold" style={{ background: C.gold, color: C.ink }}>{t("wallet.deposit")}</button>
            <button onClick={() => setMode(mode === "withdraw" ? null : "withdraw")} className="flex-1 rounded-xl py-2 text-xs font-bold" style={{ background: C.ink3, color: C.sand }}>{t("wallet.withdraw")}</button>
          </div>
        </div>
        {mode && (
          <div className="mt-4 rounded-2xl p-4" style={{ background: C.ink2 }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: C.sand }}>{mode === "deposit" ? t("wallet.depositWith") : t("wallet.withdrawTo")}</span>
              <button onClick={reset} style={{ color: C.ash }}><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-2">
              {methods.map((m) => (
                <button key={m.id} onClick={() => setPicked(m.id)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left" style={{ background: picked === m.id ? `${C.gold}1F` : C.ink3, border: picked === m.id ? `1px solid ${C.gold}` : "1px solid transparent" }}>
                  <m.icon size={16} style={{ color: C.gold }} />
                  <div className="flex-1"><div className="text-xs font-semibold" style={{ color: C.sand }}>{m.label}</div><div className="text-[11px]" style={{ color: C.ash }}>{m.sub}</div></div>
                  {picked === m.id && <Check size={14} style={{ color: C.gold }} />}
                </button>
              ))}
            </div>
            {picked && (
              <div className="mt-3">
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("wallet.amount")} (USD)</label>
                <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" inputMode="decimal" className="mt-1 w-full rounded-xl border-0 px-3 py-2.5 text-lg font-semibold outline-none" style={{ background: C.ink3, color: C.sand, fontFamily: "'IBM Plex Mono', monospace" }} />
                {error && <div className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ background: `${C.coral}1A`, color: C.coral }}>{error}</div>}
                <button onClick={confirm} disabled={loading} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold" style={{ background: C.teal, color: C.ink, opacity: amountUSD > 0 ? 1 : 0.5 }}>
                  {loading && <Loader2 size={14} className="animate-spin" />}{mode === "deposit" ? t("wallet.confirmDeposit") : t("wallet.confirmWithdraw")}
                </button>
              </div>
            )}
          </div>
        )}
        <div className="mt-6">
          <div className="mb-2 text-sm font-semibold" style={{ color: C.sand }}>{t("wallet.recentActivity")}</div>
          <div className="flex flex-col gap-2.5">
            {txns.length === 0 && <div className="text-xs" style={{ color: C.ash }}>—</div>}
            {txns.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: C.ink2 }}>
                <div><div className="text-xs font-semibold capitalize" style={{ color: C.sand }}>{tx.type} · {tx.method}</div><div className="text-[11px]" style={{ color: C.ash }}>{tx.status}</div></div>
                <div className="text-xs font-semibold" style={{ color: tx.type === "deposit" ? C.teal : C.coral, fontFamily: "'IBM Plex Mono', monospace" }}>{tx.type === "deposit" ? "+" : "-"}{formatUsd(tx.net_usd)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function OwnerPanel({ t }) {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  const [payoutResult, setPayoutResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => api.getAdminOverview().then(setOverview).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const requestPayout = async () => {
    setLoading(true); setPayoutResult(null); setError("");
    try {
      const res = await api.requestPayout();
      setPayoutResult(res);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="mt-4 rounded-2xl p-4 text-xs" style={{ background: `${C.coral}1A`, color: C.coral }}>{error}</div>;
  if (!overview) return <div className="mt-4 flex justify-center rounded-2xl p-4" style={{ background: C.ink2 }}><Loader2 size={16} className="animate-spin" style={{ color: C.ash }} /></div>;

  return (
    <>
      <div className="mt-4 rounded-2xl p-4" style={{ background: C.ink2 }}>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: C.gold }}>{t("owner.platformOverview")}</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-3" style={{ background: C.ink3 }}><div className="text-[10px]" style={{ color: C.ash }}>{t("owner.totalUsers")}</div><div className="mt-0.5 text-lg font-bold" style={{ color: C.sand }}>{overview.totalUsers}</div></div>
          <div className="rounded-xl p-3" style={{ background: C.ink3 }}><div className="text-[10px]" style={{ color: C.ash }}>{t("owner.volumeToday")}</div><div className="mt-0.5 text-lg font-bold" style={{ color: C.sand }}>{formatUsd(overview.tradeVolumeTodayUsd)}</div></div>
        </div>
        <div className="mt-3">
          <div className="mb-1.5 text-[10px]" style={{ color: C.ash }}>{t("owner.regionSplit")}</div>
          <div className="flex gap-2">
            {overview.regionSplit.length === 0 && <span className="text-[11px]" style={{ color: C.ash }}>No users yet</span>}
            {overview.regionSplit.map((r) => <div key={r.region} className="flex flex-1 items-center gap-1.5 rounded-lg px-2 py-1.5" style={{ background: C.ink3 }}><RegionPill region={r.region} /><span className="text-xs font-semibold" style={{ color: C.sand }}>{r.n}</span></div>)}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-2xl p-4" style={{ background: C.ink2, border: `1px solid ${C.gold}33` }}>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: C.gold }}>{t("owner.dashboard")}</div>
        <div className="text-xs" style={{ color: C.ash }}>{t("owner.earnings")}</div>
        <div className="mt-1 text-2xl font-bold" style={{ color: C.sand, fontFamily: "'Fraunces', serif" }}>{formatUsd(overview.availableForPayoutUsd)}</div>
        <div className="mt-1 text-[11px]" style={{ color: C.ash }}>Lifetime revenue: {formatUsd(overview.totalRevenueUsd)}</div>
        <button onClick={requestPayout} disabled={loading} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold" style={{ background: C.gold, color: C.ink }}>{loading && <Loader2 size={14} className="animate-spin" />}{t("owner.requestPayout")}</button>
        {payoutResult && (
          <div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-[11px] leading-relaxed" style={{ background: `${C.blue}1A`, color: C.blue }}>
            <Info size={13} className="mt-0.5 shrink-0" />
            <span>Payout {payoutResult.status} — {formatUsd(payoutResult.amountUsd)} to {payoutResult.destination}. This only actually reaches Airtel once paymentProvider.js is wired to a real, licensed aggregator.</span>
          </div>
        )}
      </div>
    </>
  );
}

function KycScreen({ region, lang, setLang, t, status, setStatus, onBack }) {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState(COUNTRIES_BY_REGION[region][0]);
  const [docType, setDocType] = useState(DOCUMENT_TYPES[region][0]);
  const [uploaded, setUploaded] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const steps = [t("kyc.personal"), t("kyc.document"), t("kyc.selfie"), t("kyc.review")];

  const submit = async () => {
    setSubmitting(true); setError("");
    try {
      await api.submitKyc({ documentType: docType, documentRef: "placeholder-doc", selfieRef: "placeholder-selfie", country });
      setStatus("pending");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "pending" || status === "verified") {
    return (
      <div className="px-4 pb-6">
        <Header lang={lang} setLang={setLang} title={t("kyc.title")} onBack={onBack} />
        <div className="mt-4 flex flex-col items-center rounded-2xl p-6 text-center" style={{ background: C.ink2 }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `${C.gold}22` }}><ShieldCheck size={22} style={{ color: C.gold }} /></div>
          <div className="mt-3 text-sm font-semibold" style={{ color: C.sand }}>{status === "verified" ? t("profile.verified") : t("kyc.underReview")}</div>
          <div className="mt-1 text-xs" style={{ color: C.ash }}>{t("kyc.submittedNote")}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 pb-6">
      <Header lang={lang} setLang={setLang} title={t("kyc.title")} onBack={onBack} />
      <div className="mb-4 flex items-center gap-1.5">{steps.map((_, i) => <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? C.gold : C.ink3 }} />)}</div>
      {step === 0 && (
        <div className="flex flex-col gap-3">
          <div><label className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("kyc.fullName")}</label><input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full rounded-xl border-0 px-3 py-2.5 text-sm outline-none" style={{ background: C.ink2, color: C.sand }} /></div>
          <div><label className="text-xs font-medium uppercase tracking-wider" style={{ color: C.ash }}>{t("kyc.country")}</label><select value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 w-full rounded-xl border-0 px-3 py-2.5 text-sm outline-none" style={{ background: C.ink2, color: C.sand }}>{COUNTRIES_BY_REGION[region].map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
        </div>
      )}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">{DOCUMENT_TYPES[region].map((d) => <button key={d} onClick={() => setDocType(d)} className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: docType === d ? C.gold : C.ink2, color: docType === d ? C.ink : C.sand }}>{d}</button>)}</div>
          <button onClick={() => setUploaded(true)} className="flex items-center justify-center gap-2 rounded-xl py-6 text-xs font-semibold" style={{ background: C.ink2, color: uploaded ? C.teal : C.sand, border: `1px dashed ${uploaded ? C.teal : "#FFFFFF33"}` }}>{uploaded ? <Check size={16} /> : <Upload size={16} />}{uploaded ? t("kyc.uploaded") : t("kyc.uploadDoc")}</button>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col items-center gap-3 py-4">
          <button onClick={() => setCaptured(true)} className="flex h-32 w-32 items-center justify-center rounded-full" style={{ background: C.ink2, border: `2px dashed ${captured ? C.teal : "#FFFFFF33"}` }}>{captured ? <Check size={28} style={{ color: C.teal }} /> : <Camera size={28} style={{ color: C.ash }} />}</button>
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col gap-2 rounded-2xl p-4 text-xs" style={{ background: C.ink2 }}>
          <div className="flex justify-between" style={{ color: C.ash }}><span>{t("kyc.fullName")}</span><span style={{ color: C.sand }}>{fullName || "—"}</span></div>
          <div className="flex justify-between" style={{ color: C.ash }}><span>{t("kyc.document")}</span><span style={{ color: C.sand }}>{docType} {uploaded && "✓"}</span></div>
          {error && <div className="rounded-lg px-3 py-2" style={{ background: `${C.coral}1A`, color: C.coral }}>{error}</div>}
        </div>
      )}
      <div className="mt-5 flex gap-2">
        {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="flex-1 rounded-xl py-2.5 text-xs font-bold" style={{ background: C.ink3, color: C.sand }}>{t("kyc.back")}</button>}
        {step < 3 ? <button onClick={() => setStep((s) => s + 1)} className="flex-1 rounded-xl py-2.5 text-xs font-bold" style={{ background: C.gold, color: C.ink }}>{t("kyc.next")}</button> : <button onClick={submit} disabled={submitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold" style={{ background: C.teal, color: C.ink }}>{submitting && <Loader2 size={14} className="animate-spin" />}{t("kyc.submit")}</button>}
      </div>
    </div>
  );
}
function ProfileScreen({ currentUser, lang, setLang, t, kycStatus, openKyc, onLogout }) {
  const isOwner = currentUser.role === "owner";
  return (
    <div className="px-4 pb-6">
      <Header lang={lang} setLang={setLang} title={t("profile.title")} />
      <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: C.ink2 }}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full text-base font-bold" style={{ background: C.gold, color: C.ink }}>{currentUser.fullName?.[0]?.toUpperCase() || "U"}</div>
        <div>
          <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: C.sand }}>{currentUser.fullName}{isOwner && <span className="inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-bold" style={{ background: `${C.gold}22`, color: C.gold }}><Crown size={10} />OWNER</span>}</div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: C.ash }}>{kycStatus === "verified" ? t("profile.verified") : t("kyc.underReview")} <RegionPill region={currentUser.region} /></div>
        </div>
      </div>
      {isOwner && <OwnerPanel t={t} />}
      <div className="mt-4 flex flex-col gap-px overflow-hidden rounded-2xl" style={{ background: "#FFFFFF14" }}>
        <button onClick={openKyc} className="flex items-center justify-between px-4 py-3 text-left text-sm" style={{ background: C.ink2, color: C.sand }}><span className="flex items-center gap-2"><ShieldCheck size={15} style={{ color: kycStatus === "verified" ? C.teal : C.ash }} />{t("profile.identity")}</span><ArrowRight size={14} style={{ color: C.ash }} /></button>
        {[t("profile.payments"), t("profile.notifications"), t("profile.security"), t("profile.help")].map((label) => <button key={label} className="flex items-center justify-between px-4 py-3 text-left text-sm" style={{ background: C.ink2, color: C.sand }}>{label}<ArrowRight size={14} style={{ color: C.ash }} /></button>)}
      </div>
      <button onClick={onLogout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold" style={{ background: `${C.coral}1A`, color: C.coral }}><LogOut size={14} />{t("auth.logout")}</button>
    </div>
  );
}

function BottomNav({ screen, setScreen, t }) {
  const items = [
    { id: "home", label: t("nav.home"), icon: Home }, { id: "markets", label: t("nav.markets"), icon: BarChart2 },
    { id: "orders", label: t("nav.orders"), icon: FileText }, { id: "wallet", label: t("nav.wallet"), icon: Wallet },
    { id: "profile", label: t("nav.profile"), icon: User },
  ];
  return (
    <div className="sticky bottom-0 z-20 flex items-center justify-around border-t px-1 py-2.5" style={{ background: C.ink, borderColor: "#FFFFFF14" }}>
      {items.map((it) => { const active = screen === it.id; return <button key={it.id} onClick={() => setScreen(it.id)} className="flex flex-col items-center gap-0.5 px-2 py-1"><it.icon size={18} style={{ color: active ? C.gold : C.ash }} /><span className="text-[9.5px] font-medium" style={{ color: active ? C.gold : C.ash }}>{it.label}</span></button>; })}
    </div>
  );
}
/* ---------------------------------- app shell ---------------------------------- */
export default function App() {
  const [booting, setBooting] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState("home");
  const [lang, setLang] = useState("en");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [balanceUsd, setBalanceUsd] = useState(0);
  const [kycStatus, setKycStatus] = useState("unverified");

  const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;

  const refreshBalance = () => api.getWallet().then((r) => setBalanceUsd(r.balanceUsd)).catch(() => {});

  useEffect(() => {
    const token = loadStoredToken();
    if (!token) { setBooting(false); return; }
    setAuthToken(token);
    Promise.all([api.getWallet(), api.getKycStatus()])
      .then(([wallet, kyc]) => {
        setBalanceUsd(wallet.balanceUsd);
        setKycStatus(kyc.kycStatus);
        setAuthed(true);
        setCurrentUser((u) => u || { fullName: "Trader", region: "AM", role: "user" });
      })
      .catch(() => setAuthToken(null))
      .finally(() => setBooting(false));
  }, []);

  const handleAuth = (token, user) => {
    setAuthToken(token);
    setCurrentUser(user);
    setKycStatus(user.kycStatus || "unverified");
    setAuthed(true);
    refreshBalance();
    setScreen("home");
  };
  const handleLogout = () => { setAuthToken(null); setAuthed(false); setCurrentUser(null); setScreen("home"); };
  const openAsset = (asset) => { setSelectedAsset(asset); setScreen("asset"); };

  if (booting) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center" style={{ background: C.ink }}>
        <Loader2 size={24} className="animate-spin" style={{ color: C.gold }} />
      </div>
    );
  }

  let body;
  if (!authed) {
    body = <AuthScreen lang={lang} setLang={setLang} t={t} onAuth={handleAuth} />;
  } else if (screen === "asset" && selectedAsset) {
    body = <AssetScreen asset={selectedAsset} lang={lang} t={t} onBack={() => setScreen("home")} onOrderPlaced={refreshBalance} />;
  } else if (screen === "markets") {
    body = <HomeScreen lang={lang} setLang={setLang} t={t} balanceUsd={balanceUsd} openAsset={openAsset} />;
  } else if (screen === "orders") {
    body = <OrdersScreen lang={lang} setLang={setLang} t={t} />;
  } else if (screen === "wallet") {
    body = <WalletScreen lang={lang} setLang={setLang} t={t} balanceUsd={balanceUsd} refreshBalance={refreshBalance} />;
  } else if (screen === "kyc") {
    body = <KycScreen region={currentUser?.region || "AM"} lang={lang} setLang={setLang} t={t} status={kycStatus} setStatus={setKycStatus} onBack={() => setScreen("profile")} />;
  } else if (screen === "profile") {
    body = <ProfileScreen currentUser={currentUser} lang={lang} setLang={setLang} t={t} kycStatus={kycStatus} openKyc={() => setScreen("kyc")} onLogout={handleLogout} />;
  } else {
    body = <HomeScreen lang={lang} setLang={setLang} t={t} balanceUsd={balanceUsd} openAsset={openAsset} />;
  }

  const showNav = authed && screen !== "asset" && screen !== "kyc";

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6" style={{ background: `radial-gradient(circle at 30% 20%, ${C.ink3} 0%, ${C.ink} 55%)`, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
      <div className="relative flex h-[850px] w-[420px] max-w-full flex-col overflow-hidden rounded-[36px] border shadow-2xl" style={{ background: C.ink, borderColor: "#FFFFFF1A" }}>
        <div className="flex-1 overflow-y-auto">{body}</div>
        {showNav && <BottomNav screen={screen} setScreen={setScreen} t={t} />}
      </div>
    </div>
  );
}
