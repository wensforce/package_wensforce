import { useState, useEffect } from "react";

export const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", symbol: "$", name: "US Dollar" },
  { code: "EUR", flag: "🇪🇺", symbol: "€", name: "Euro" },
  { code: "JPY", flag: "🇯🇵", symbol: "¥", name: "Japanese Yen" },
  { code: "GBP", flag: "🇬🇧", symbol: "£", name: "British Pound" },
  { code: "CNY", flag: "🇨🇳", symbol: "¥", name: "Chinese Yuan" },
  { code: "CHF", flag: "🇨🇭", symbol: "Fr", name: "Swiss Franc" },
  { code: "CAD", flag: "🇨🇦", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", flag: "🇦🇺", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", flag: "🇮🇳", symbol: "₹", name: "Indian Rupee" },
];

export const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

export const fmtForeign = (amount, code) => {
  if (!amount || isNaN(amount)) return "…";
  const cur = CURRENCIES.find((c) => c.code === code);
  if (!cur) return "";
  const decimals = ["JPY", "KRW", "VND", "IDR"].includes(code) ? 0 : 2;
  return (
    cur.symbol +
    Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
};

export const roundForeign = (amount, code) => {
  if (["JPY", "KRW", "VND", "IDR"].includes(code)) return Math.ceil(amount);
  return Math.ceil(amount * 100) / 100;
};

export const useCurrency = (initialCurrency = "INR") => {
  const [currency, setCurrency] = useState(initialCurrency);
  const [rate, setRate] = useState(1);
  const [rateLoading, setRateLoading] = useState(false);

  useEffect(() => {
    if (currency === "INR") {
      setRate(1);
      return;
    }
    setRateLoading(true);
    fetch(`/api/exchange-rate?currency=${currency}`)
      .then((r) => r.json())
      .then((d) => setRate(d.rate ?? 1))
      .catch(() => setRate(1))
      .finally(() => setRateLoading(false));
  }, [currency]);

  // INR amount → formatted foreign string
  const toForeign = (inrAmount) => {
    if (currency === "INR") return INR(inrAmount);
    if (rateLoading) return "…";
    return fmtForeign(roundForeign(inrAmount / rate, currency), currency);
  };

  const selectedCur = CURRENCIES.find((c) => c.code === currency);

  return {
    currency,
    setCurrency,
    rate,
    rateLoading,
    selectedCur,
    CURRENCIES,
    toForeign,
    fmtForeign,
    INR,
  };
};
