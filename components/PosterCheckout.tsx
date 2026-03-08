"use client";

import { useState } from "react";
import { POSTER_VARIANTS } from "@/lib/shop";

export function PosterCheckout() {
  const [selectedId, setSelectedId] = useState<string>(POSTER_VARIANTS[2].printfulSyncVariantId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = POSTER_VARIANTS.find((v) => v.printfulSyncVariantId === selectedId)!;

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: selectedId }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {POSTER_VARIANTS.map((v) => (
          <button
            key={v.printfulSyncVariantId}
            onClick={() => setSelectedId(v.printfulSyncVariantId)}
            className="label py-2 px-3 border transition-all duration-200"
            style={{
              borderColor:
                selectedId === v.printfulSyncVariantId
                  ? "#C0392B"
                  : "rgba(245,242,235,0.2)",
              color:
                selectedId === v.printfulSyncVariantId
                  ? "#C0392B"
                  : "rgba(245,242,235,0.5)",
              background:
                selectedId === v.printfulSyncVariantId
                  ? "rgba(192,57,43,0.08)"
                  : "transparent",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="label border border-[#C0392B]/60 text-[#C0392B] py-3 px-4 hover:bg-[#C0392B] hover:text-[#F5F2EB] transition-all duration-300 text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Opening checkout…"
          : `Carry This Object — $${selected.priceUsd} →`}
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
