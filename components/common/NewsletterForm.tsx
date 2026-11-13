"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
    setEmail("");
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email của bạn..."
        className="w-full px-3.5 py-2.5 text-sm bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-60"
      >
        {isSubmitted ? "✓ Đã Đăng Ký Thành Công!" : "Đăng Ký"}
      </button>
      {isSubmitted && (
        <p className="text-[11px] text-amber-400 text-center animate-fade-in">
          Cảm ơn bạn đã đồng hành cùng văn hóa Hmong!
        </p>
      )}
    </form>
  );
}
export default NewsletterForm;
