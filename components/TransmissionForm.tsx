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
        className="text-[#E8D44D] text-sm"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
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
        className="flex-1 bg-transparent border border-[#2D4A3E] text-[#F5F2EB] placeholder-[#F5F2EB]/30 px-4 py-3 text-sm outline-none focus:border-[#C0392B] transition-colors duration-300"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      />
      <button
        type="submit"
        disabled={loading}
        className="label bg-[#C0392B] text-[#F5F2EB] px-6 py-3 hover:bg-[#a93226] transition-colors duration-300 disabled:opacity-50"
      >
        {loading ? "—" : "Subscribe"}
      </button>
    </form>
  );
}
