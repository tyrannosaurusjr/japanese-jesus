"use client";

import { useEffect, useMemo, useState } from "react";
import { Sigil } from "@/components/Sigil";

const suggestedAmounts = [33, 72, 108, 216];
const donationUrl = process.env.NEXT_PUBLIC_DONATION_URL;
const stripeCheckoutEnabled = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_ENABLED === "true";

export function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState<number>(108);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"success" | "cancel" | null>(null);

  const goalProgress = useMemo(() => {
    const target = 4400;
    const committed = 1680;
    return Math.min(100, Math.round((committed / target) * 100));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const donation = params.get("donation");

    if (donation === "success" || donation === "cancel") {
      setCheckoutStatus(donation);
      params.delete("donation");
      const nextQuery = params.toString();
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", nextUrl);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      return;
    }

    setSubmitting(true);

    try {
      await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          amount: selectedAmount,
          note,
        }),
      });
    } catch {
      // Silent fail to preserve flow.
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const startStripeCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      const response = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedAmount,
          email,
          name,
          note,
        }),
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        setCheckoutError(payload.error ?? "The path is not open yet.");
        return;
      }

      window.location.href = payload.url;
    } catch {
      setCheckoutError("The path is not open yet.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <section
      id="fund-the-ascent"
      className="relative overflow-hidden border-y border-[#2D4A3E]/30 py-24 px-6 md:px-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,212,77,0.12),transparent_36%),radial-gradient(circle_at_15%_70%,rgba(192,57,43,0.14),transparent_30%),linear-gradient(180deg,rgba(245,242,235,0.02),rgba(13,27,42,0.18))]" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {checkoutStatus === "success" ? (
          <div className="lg:col-span-2 rounded-3xl border border-[#E8D44D]/40 bg-[#E8D44D]/[0.08] px-6 py-5">
            <p className="label text-[#E8D44D] mb-2">Offering Received</p>
            <p
              className="text-[#F5F2EB] text-base md:text-lg"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Thank you. Your support crossed the threshold and is now fueling the Shingo field expedition.
            </p>
          </div>
        ) : null}

        {checkoutStatus === "cancel" ? (
          <div className="lg:col-span-2 rounded-3xl border border-[#F5F2EB]/15 bg-[#F5F2EB]/[0.04] px-6 py-5">
            <p className="label text-[#F5F2EB]/55 mb-2">Path Paused</p>
            <p
              className="text-[#F5F2EB]/80 text-base"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              No charge was made. You can choose another amount and reopen checkout whenever you are ready.
            </p>
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-[#F5F2EB]/10 bg-[#0D1B2A]/70 p-8 md:p-10 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <Sigil variant="citrine" size={34} className="opacity-80" />
            <p className="label text-[#E8D44D]">Fund The Ascent</p>
          </div>

          <h2
            className="max-w-2xl text-4xl md:text-6xl text-[#F5F2EB] leading-[0.95] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
          >
            Help us walk into the thin place with cameras on, microphones open, and no guarantee of what answers back.
          </h2>

          <p
            className="max-w-2xl text-base md:text-lg text-[#F5F2EB]/68 leading-relaxed mb-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            This expedition funds the trip to Shingo and the surrounding ground: train lines north,
            rural lodging, field audio, documentary video, archival scans, and the strange paper trail
            that still clings to the mountain air.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
            {[
              "Field audio and ambient recordings",
              "Photo and video documentation on site",
              "Copies of maps, pamphlets, and physical records",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-[#F5F2EB]/8 bg-[#F5F2EB]/[0.03] p-5"
              >
                <p className="label text-[#F5F2EB]/35 mb-2">Supports</p>
                <p
                  className="text-sm text-[#F5F2EB]/70"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-[#C0392B]/20 bg-[#C0392B]/[0.06] p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label text-[#F5F2EB]/45 mb-2">Current Progress</p>
                <p
                  className="text-2xl text-[#F5F2EB]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  Goal: $4,400 field budget
                </p>
              </div>
              <p className="label text-[#E8D44D]">{goalProgress}% of goal reached</p>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F5F2EB]/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C0392B] via-[#E8D44D] to-[#F5F2EB]"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <p className="label mt-4 text-[#F5F2EB]/42">
              Progress updates as verified Stripe offerings clear.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#E8D44D]/15 bg-[#09131F]/90 p-8 md:p-10 shadow-[0_0_80px_rgba(13,27,42,0.45)]">
          <p className="label text-[#E8D44D] mb-4">Open The Path</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {suggestedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setSelectedAmount(amount)}
                className={`rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                  selectedAmount === amount
                    ? "border-[#E8D44D] bg-[#E8D44D]/10 text-[#F5F2EB]"
                    : "border-[#F5F2EB]/10 bg-[#F5F2EB]/[0.02] text-[#F5F2EB]/70 hover:border-[#C0392B]/50"
                }`}
              >
                <span className="label block mb-1">
                  {amount === 33 ? "Offer" : amount === 72 ? "Provision" : amount === 108 ? "Threshold" : "Patron"}
                </span>
                <span
                  className="text-2xl"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  ${amount}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-[#F5F2EB]/8 bg-[#F5F2EB]/[0.03] p-5 mb-6">
            <p className="label text-[#F5F2EB]/35 mb-2">Chosen Offering</p>
            <p
              className="text-4xl text-[#F5F2EB]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              ${selectedAmount}
            </p>
            <p
              className="mt-3 text-sm text-[#F5F2EB]/58"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Select an amount, then either step directly into the donation portal or leave your address
              to receive the private route and future field dispatches.
            </p>
          </div>

          {donationUrl ? (
            <a
              href={donationUrl}
              target="_blank"
              rel="noreferrer"
              className="label mb-4 flex w-full items-center justify-center rounded-2xl bg-[#C0392B] px-6 py-4 text-[#F5F2EB] transition-colors duration-300 hover:bg-[#a93226]"
            >
              Give ${selectedAmount} To The Expedition
            </a>
          ) : stripeCheckoutEnabled ? (
            <button
              type="button"
              onClick={startStripeCheckout}
              disabled={checkoutLoading}
              className="label mb-4 flex w-full items-center justify-center rounded-2xl bg-[#C0392B] px-6 py-4 text-[#F5F2EB] transition-colors duration-300 hover:bg-[#a93226] disabled:opacity-50"
            >
              {checkoutLoading ? "Opening Checkout..." : `Give $${selectedAmount} With Stripe`}
            </button>
          ) : (
            <div className="mb-4 rounded-2xl border border-[#C0392B]/20 bg-[#C0392B]/[0.06] px-4 py-4">
              <p
                className="text-sm text-[#F5F2EB]/74"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Direct payment coming soon. Leave your address to receive the private route now.
              </p>
            </div>
          )}

          {checkoutError ? (
            <p
              className="mb-4 text-sm text-[#E8D44D]"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              {checkoutError}
            </p>
          ) : null}

          {submitted ? (
            <div className="rounded-2xl border border-[#2D4A3E] bg-[#2D4A3E]/10 px-5 py-4">
              <p className="label text-[#E8D44D] mb-2">Signal Received</p>
              <p
                className="text-sm text-[#F5F2EB]/70"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                The route details are queued. Watch your inbox for the next transmission.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name (optional)"
                className="w-full rounded-2xl border border-[#F5F2EB]/10 bg-transparent px-4 py-3 text-sm text-[#F5F2EB] outline-none transition-colors duration-300 placeholder:text-[#F5F2EB]/25 focus:border-[#C0392B]"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@address.com"
                required
                className="w-full rounded-2xl border border-[#F5F2EB]/10 bg-transparent px-4 py-3 text-sm text-[#F5F2EB] outline-none transition-colors duration-300 placeholder:text-[#F5F2EB]/25 focus:border-[#C0392B]"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              />

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                placeholder="If you want a note back, a question pursued, or a document hunted down, leave a trace."
                className="w-full rounded-2xl border border-[#F5F2EB]/10 bg-transparent px-4 py-3 text-sm text-[#F5F2EB] outline-none transition-colors duration-300 placeholder:text-[#F5F2EB]/25 focus:border-[#C0392B]"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              />

              <button
                type="submit"
                disabled={submitting}
                className="label w-full rounded-2xl border border-[#F5F2EB]/12 px-6 py-4 text-[#F5F2EB]/80 transition-all duration-300 hover:border-[#E8D44D] hover:text-[#E8D44D] disabled:opacity-50"
              >
                {submitting ? "Opening..." : "Send Me the Route & Field Dispatches"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
