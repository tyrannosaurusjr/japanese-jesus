"use client";

import { useEffect, useState } from "react";
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

  const goalProgress = 38;

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
      className="relative overflow-hidden border-y border-[#EFE4CF]/30 py-24 px-6 md:px-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,228,207,0.08),transparent_36%),radial-gradient(circle_at_15%_70%,rgba(196,74,50,0.14),transparent_30%),linear-gradient(180deg,rgba(239,228,207,0.02),rgba(7,11,20,0.18))]" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {checkoutStatus === "success" ? (
          <div className="lg:col-span-2 rounded-3xl border border-[#C44A32]/40 bg-[#C44A32]/[0.08] px-6 py-5">
            <p className="label text-[#D6B56E] mb-2">Offering Received</p>
            <p
              className="text-[#EFE4CF] text-base md:text-lg"
            >
              Thank you. Your support crossed the threshold and is now fueling the Shingo field expedition.
            </p>
          </div>
        ) : null}

        {checkoutStatus === "cancel" ? (
          <div className="lg:col-span-2 rounded-3xl border border-[#EFE4CF]/15 bg-[#EFE4CF]/[0.04] px-6 py-5">
            <p className="label text-[#EFE4CF]/55 mb-2">Path Paused</p>
            <p
              className="text-[#EFE4CF]/80 text-base"
            >
              No charge was made. You can choose another amount and reopen checkout whenever you are ready.
            </p>
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-[#EFE4CF]/10 bg-[#070B14]/70 p-8 md:p-10 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <Sigil variant="citrine" size={34} className="opacity-80" />
            <p className="label text-[#D6B56E]">Fund The Ascent</p>
          </div>

          <h2
            className="max-w-2xl text-4xl md:text-6xl text-[#EFE4CF] leading-[0.95] mb-6"
          >
            Help us walk into the thin place with cameras on, microphones open, and no guarantee of what answers back.
          </h2>

          <p
            className="max-w-2xl text-base md:text-lg text-[#EFE4CF]/68 leading-relaxed mb-8"
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
                className="rounded-3xl border border-[#EFE4CF]/8 bg-[#EFE4CF]/[0.03] p-5"
              >
                <p className="label text-[#EFE4CF]/35 mb-2">Supports</p>
                <p
                  className="text-sm text-[#EFE4CF]/70"
                >
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-[#C44A32]/20 bg-[#C44A32]/[0.06] p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label text-[#EFE4CF]/45 mb-2">Current Progress</p>
                <p
                  className="text-2xl text-[#EFE4CF]"
                >
                  Goal: $4,400 field budget
                </p>
              </div>
              <p className="label text-[#D6B56E]">{goalProgress}% of goal reached</p>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EFE4CF]/8">
              <div
                className="h-full w-[38%] rounded-full bg-gradient-to-r from-[#C44A32] via-[#C44A32] to-[#EFE4CF]"
              />
            </div>
            <p className="label mt-4 text-[#EFE4CF]/42">
              Progress updates as verified Stripe offerings clear.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#C44A32]/15 bg-[#070B14]/90 p-8 md:p-10 shadow-[0_0_80px_rgba(7,11,20,0.45)]">
          <p className="label text-[#D6B56E] mb-4">Open The Path</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {suggestedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setSelectedAmount(amount)}
                className={`rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                  selectedAmount === amount
                    ? "border-[#C44A32] bg-[#C44A32]/10 text-[#EFE4CF]"
                    : "border-[#EFE4CF]/10 bg-[#EFE4CF]/[0.02] text-[#EFE4CF]/70 hover:border-[#C44A32]/50"
                }`}
              >
                <span className="label block mb-1">
                  {amount === 33 ? "Offer" : amount === 72 ? "Provision" : amount === 108 ? "Threshold" : "Patron"}
                </span>
                <span
                  className="text-2xl"
                >
                  ${amount}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-[#EFE4CF]/8 bg-[#EFE4CF]/[0.03] p-5 mb-6">
            <p className="label text-[#EFE4CF]/35 mb-2">Chosen Offering</p>
            <p
              className="text-4xl text-[#EFE4CF]"
            >
              ${selectedAmount}
            </p>
            <p
              className="mt-3 text-sm text-[#EFE4CF]/58"
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
              className="label mb-4 flex w-full items-center justify-center rounded-2xl bg-[#C44A32] px-6 py-4 text-[#EFE4CF] transition-colors duration-300 hover:bg-[#A73523]"
            >
              Give ${selectedAmount} To The Expedition
            </a>
          ) : stripeCheckoutEnabled ? (
            <button
              type="button"
              onClick={startStripeCheckout}
              disabled={checkoutLoading}
              className="label mb-4 flex w-full items-center justify-center rounded-2xl bg-[#C44A32] px-6 py-4 text-[#EFE4CF] transition-colors duration-300 hover:bg-[#A73523] disabled:opacity-50"
            >
              {checkoutLoading ? "Opening Checkout..." : `Give $${selectedAmount} With Stripe`}
            </button>
          ) : (
            <div className="mb-4 rounded-2xl border border-[#C44A32]/20 bg-[#C44A32]/[0.06] px-4 py-4">
              <p
                className="text-sm text-[#EFE4CF]/74"
              >
                Direct payment coming soon. Leave your address to receive the private route now.
              </p>
            </div>
          )}

          {checkoutError ? (
            <p
              className="mb-4 text-sm text-[#C44A32]"
            >
              {checkoutError}
            </p>
          ) : null}

          {submitted ? (
            <div className="rounded-2xl border border-[#EFE4CF] bg-[#EFE4CF]/10 px-5 py-4">
              <p className="label text-[#D6B56E] mb-2">Signal Received</p>
              <p
                className="text-sm text-[#EFE4CF]/70"
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
                className="w-full rounded-2xl border border-[#EFE4CF]/10 bg-transparent px-4 py-3 text-sm text-[#EFE4CF] outline-none transition-colors duration-300 placeholder:text-[#EFE4CF]/25 focus:border-[#C44A32]"
              />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@address.com"
                required
                className="w-full rounded-2xl border border-[#EFE4CF]/10 bg-transparent px-4 py-3 text-sm text-[#EFE4CF] outline-none transition-colors duration-300 placeholder:text-[#EFE4CF]/25 focus:border-[#C44A32]"
              />

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                placeholder="If you want a note back, a question pursued, or a document hunted down, leave a trace."
                className="w-full rounded-2xl border border-[#EFE4CF]/10 bg-transparent px-4 py-3 text-sm text-[#EFE4CF] outline-none transition-colors duration-300 placeholder:text-[#EFE4CF]/25 focus:border-[#C44A32]"
              />

              <button
                type="submit"
                disabled={submitting}
                className="label w-full rounded-2xl border border-[#EFE4CF]/12 px-6 py-4 text-[#EFE4CF]/80 transition-all duration-300 hover:border-[#C44A32] hover:text-[#C44A32] disabled:opacity-50"
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
