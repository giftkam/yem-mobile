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
