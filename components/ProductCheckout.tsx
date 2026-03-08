"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat(
    typeof navigator !== "undefined" ? navigator.language : "en-US",
    { style: "currency", currency },
  ).format(price);
}

interface Variant {
  id: string;
  label: string;
  price: number;
  currency: string;
}

interface Props {
  printfulSyncProductId: string;
  productName: string;
  primaryImageUrl?: string;
  altImageUrl?: string;
}

export function ProductCheckout({ printfulSyncProductId, productName, primaryImageUrl, altImageUrl }: Props) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [apiAltImageUrl, setApiAltImageUrl] = useState<string | null>(null);
  const [loadingVariants, setLoadingVariants] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    fetch(`/api/shop/variants/${printfulSyncProductId}`)
      .then((r) => r.json())
      .then((data: { variants?: Variant[]; thumbnailUrl?: string; altThumbnailUrl?: string; error?: string }) => {
        if (data.variants && data.variants.length > 0) {
          setVariants(data.variants);
          setSelectedId(data.variants[0].id);
        } else {
          setError(data.error ?? "No variants available.");
        }
        if (data.thumbnailUrl) setThumbnailUrl(data.thumbnailUrl);
        if (data.altThumbnailUrl) setApiAltImageUrl(data.altThumbnailUrl);
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

  const mainImageUrl = primaryImageUrl || thumbnailUrl;

  return (
    <div className="space-y-4">
      {mainImageUrl && (
        <div
          className="relative w-full aspect-square bg-[#111D2B] border border-[#2D4A3E]/40 overflow-hidden"
          onMouseEnter={() => altImageUrl && setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Image
            src={mainImageUrl}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-2 transition-opacity duration-300"
            style={{ opacity: hovered && altImageUrl ? 0 : 1 }}
          />
          {altImageUrl && (
            <Image
              src={altImageUrl}
              alt={`${productName} — alternate view`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-2 transition-opacity duration-300"
              style={{ opacity: hovered ? 1 : 0 }}
            />
          )}
        </div>
      )}

      {variants.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedId(v.id)}
              className="label py-2 px-3 border transition-all duration-200"
              style={{
                borderColor:
                  selectedId === v.id ? "#C0392B" : "rgba(245,242,235,0.4)",
                color:
                  selectedId === v.id ? "#E8D44D" : "#F5F2EB",
                background:
                  selectedId === v.id ? "rgba(192,57,43,0.15)" : "transparent",
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
        className="label border border-[#C0392B] text-[#F5F2EB] py-3 px-4 hover:bg-[#C0392B] transition-all duration-300 text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Order ${productName}`}
      >
        {checkoutLoading
          ? "Opening checkout…"
          : `Carry This Object${selected ? ` — ${formatPrice(selected.price, selected.currency)}` : ""} →`}
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
