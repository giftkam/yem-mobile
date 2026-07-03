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
