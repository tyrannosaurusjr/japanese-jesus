"use client";

import { useState } from "react";
import { POSTER_VARIANTS } from "@/lib/shop";
import { getImpactClickIdFromCookieString } from "@/lib/impact-click";

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
        body: JSON.stringify({
          syncVariantId: selectedId,
          impactClickId: getImpactClickIdFromCookieString(document.cookie),
        }),
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
                  ? "#C44A32"
                  : "rgba(239,228,207,0.2)",
              color:
                selectedId === v.printfulSyncVariantId
                  ? "#C44A32"
                  : "rgba(239,228,207,0.5)",
              background:
                selectedId === v.printfulSyncVariantId
                  ? "rgba(196,74,50,0.08)"
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
        className="label border border-[#C44A32]/60 text-[#C44A32] py-3 px-4 hover:bg-[#C44A32] hover:text-[#EFE4CF] transition-all duration-300 text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Opening checkout…"
          : `Carry This Object — $${selected.priceUsd} →`}
      </button>

      {error && (
        <p
          className="text-xs text-[#C44A32]"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
