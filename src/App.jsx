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
