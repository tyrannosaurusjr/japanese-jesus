"use client";

import { useState, useEffect } from "react";

const REGION_CURRENCY: Record<string, string> = {
  JP: "JPY", GB: "GBP", AU: "AUD", CA: "CAD", CH: "CHF",
  SG: "SGD", NZ: "NZD", HK: "HKD", KR: "KRW", IN: "INR",
  MX: "MXN", BR: "BRL", DE: "EUR", FR: "EUR", IT: "EUR",
  ES: "EUR", NL: "EUR", BE: "EUR", AT: "EUR", PT: "EUR",
  FI: "EUR", IE: "EUR", GR: "EUR", SK: "EUR", SI: "EUR",
  EE: "EUR", LV: "EUR", LT: "EUR", LU: "EUR", MT: "EUR", CY: "EUR",
};

// Module-level cache so we only fetch once per page load
let ratesCache: Record<string, number> | null = null;
let ratesFetchPromise: Promise<Record<string, number>> | null = null;

async function getRates(): Promise<Record<string, number>> {
  if (ratesCache) return ratesCache;
  if (!ratesFetchPromise) {
    ratesFetchPromise = fetch("https://api.frankfurter.app/latest?from=USD")
      .then((r) => r.json())
      .then((data: { rates: Record<string, number> }) => {
        ratesCache = data.rates;
        return data.rates;
      })
      .catch(() => ({}));
  }
  return ratesFetchPromise;
}

function formatPrice(priceUsd: number, rates: Record<string, number>): string {
  const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";
  const region = (locale.split("-")[1] ?? "").toUpperCase();
  const code = REGION_CURRENCY[region] ?? "USD";
  const rate = rates[code] ?? 1;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
  }).format(priceUsd * rate);
}

interface Variant {
  id: string;
  label: string;
  priceUsd: number;
}

interface Props {
  printfulSyncProductId: string;
  productName: string;
}

export function ProductCheckout({ printfulSyncProductId, productName }: Props) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingVariants, setLoadingVariants] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    getRates().then(setRates);
  }, []);

  useEffect(() => {
    fetch(`/api/shop/variants/${printfulSyncProductId}`)
      .then((r) => r.json())
      .then((data: { variants?: Variant[]; error?: string }) => {
        if (data.variants && data.variants.length > 0) {
          setVariants(data.variants);
          setSelectedId(data.variants[0].id);
        } else {
          setError(data.error ?? "No variants available.");
        }
      })
      .catch(() => setError("Could not load product options."))
      .finally(() => setLoadingVariants(false));
  }, [printfulSyncProductId]);

  async function handleCheckout() {
    if (!selectedId) return;
    setCheckoutLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncVariantId: selectedId }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Try again.");
        setCheckoutLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setCheckoutLoading(false);
    }
  }

  const selected = variants.find((v) => v.id === selectedId);

  if (loadingVariants) {
    return (
      <div
        className="label text-[#F5F2EB]/30 py-3"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        Loading options…
      </div>
    );
  }

  if (error && variants.length === 0) {
    return (
      <p
        className="text-xs text-[#FF4D6D]"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {variants.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedId(v.id)}
              className="label py-2 px-3 border transition-all duration-200"
              style={{
                borderColor:
                  selectedId === v.id ? "#C0392B" : "rgba(245,242,235,0.2)",
                color:
                  selectedId === v.id ? "#C0392B" : "rgba(245,242,235,0.5)",
                background:
                  selectedId === v.id ? "rgba(192,57,43,0.08)" : "transparent",
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={checkoutLoading || !selectedId}
        className="label border border-[#C0392B]/60 text-[#C0392B] py-3 px-4 hover:bg-[#C0392B] hover:text-[#F5F2EB] transition-all duration-300 text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Order ${productName}`}
      >
        {checkoutLoading
          ? "Opening checkout…"
          : `Carry This Object${selected ? ` — ${formatPrice(selected.priceUsd, rates)}` : ""} →`}
      </button>

      {error && (
        <p
          className="text-xs text-[#FF4D6D]"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
