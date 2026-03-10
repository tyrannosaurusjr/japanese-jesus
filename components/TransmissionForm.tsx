"use client";

import { useState } from "react";

export function TransmissionForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      await fetch("/api/transmissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <p
        className="text-[#C44A32] text-sm"
      >
        Word has been received.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@address.com"
        required
        className="flex-1 bg-transparent border border-[#EFE4CF] text-[#EFE4CF] placeholder-[#EFE4CF]/30 px-4 py-3 text-sm outline-none focus:border-[#C44A32] transition-colors duration-300"
      />
      <button
        type="submit"
        disabled={loading}
        className="label bg-[#C44A32] text-[#EFE4CF] px-6 py-3 hover:bg-[#A73523] transition-colors duration-300 disabled:opacity-50"
      >
        {loading ? "—" : "Subscribe"}
      </button>
    </form>
  );
}
