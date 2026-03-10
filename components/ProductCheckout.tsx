"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getImpactClickIdFromCookieString } from "@/lib/impact-click";

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
  const [loadingVariants, setLoadingVariants] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    fetch(`/api/shop/variants/${printfulSyncProductId}`)
      .then((r) => r.json())
      .then((data: { variants?: Variant[]; thumbnailUrl?: string; error?: string }) => {
        if (data.variants && data.variants.length > 0) {
          setVariants(data.variants);
          setSelectedId(data.variants[0].id);
        } else {
          setError(data.error ?? "No variants available.");
        }
        if (data.thumbnailUrl) setThumbnailUrl(data.thumbnailUrl);
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
        className="label text-[#EFE4CF]/30 py-3"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        Loading options…
      </div>
    );
  }

  if (error && variants.length === 0) {
    return (
      <p
        className="text-xs text-[#C44A32]"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {error}
      </p>
    );
  }

  const mainImageUrl = primaryImageUrl || thumbnailUrl;
  const alternateImageUrl = altImageUrl;
  const zoomScale = zoomEnabled && zoomed ? 2.2 : 1;
  const imageTransform = `scale(${zoomScale})`;
  const imageTransformOrigin = `${zoomOrigin.x}% ${zoomOrigin.y}%`;

  return (
    <div className="space-y-4">
      {mainImageUrl && (
        <div className="space-y-2">
          <div
            className={`relative w-full aspect-square bg-[#070B14] border border-[#EFE4CF]/40 overflow-hidden ${
              zoomEnabled ? "cursor-zoom-in" : ""
            }`}
            onMouseEnter={() => {
              if (alternateImageUrl) setHovered(true);
              if (zoomEnabled) setZoomed(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
              setZoomed(false);
              setZoomOrigin({ x: 50, y: 50 });
            }}
            onMouseMove={(event) => {
              if (!zoomEnabled) return;
              const rect = event.currentTarget.getBoundingClientRect();
              const x = ((event.clientX - rect.left) / rect.width) * 100;
              const y = ((event.clientY - rect.top) / rect.height) * 100;
              setZoomOrigin({
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
              });
            }}
          >
            <Image
              src={mainImageUrl}
              alt={`Japanese Jesus ${productName} product photo`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-2 transition-all duration-200"
              style={{
                opacity: hovered && alternateImageUrl ? 0 : 1,
                transform: imageTransform,
                transformOrigin: imageTransformOrigin,
              }}
            />
            {alternateImageUrl && (
              <Image
                src={alternateImageUrl}
                alt={`Japanese Jesus ${productName} alternate product photo`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-2 transition-all duration-200"
                style={{
                  opacity: hovered ? 1 : 0,
                  transform: imageTransform,
                  transformOrigin: imageTransformOrigin,
                }}
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setZoomEnabled((value) => !value);
              setZoomed(false);
              setZoomOrigin({ x: 50, y: 50 });
            }}
            className="label border border-[#EFE4CF]/60 text-[#EFE4CF]/70 px-3 py-2 hover:border-[#C44A32]/60 hover:text-[#C44A32] transition-colors duration-200 text-left"
            aria-label={`${zoomEnabled ? "Disable" : "Enable"} zoom for ${productName}`}
          >
            {zoomEnabled ? "Zoom: On (hover image)" : "Zoom: Off"}
          </button>
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
                  selectedId === v.id ? "#C44A32" : "rgba(239,228,207,0.4)",
                color:
                  selectedId === v.id ? "#C44A32" : "#EFE4CF",
                background:
                  selectedId === v.id ? "rgba(196,74,50,0.15)" : "transparent",
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
        className="label border border-[#C44A32] text-[#EFE4CF] py-3 px-4 hover:bg-[#C44A32] transition-all duration-300 text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Order ${productName}`}
      >
        {checkoutLoading
          ? "Opening checkout…"
          : `Order Item${selected ? ` — ${formatPrice(selected.price, selected.currency)}` : ""} →`}
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
