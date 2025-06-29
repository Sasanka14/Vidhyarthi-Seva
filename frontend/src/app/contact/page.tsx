"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        setError(data.message || "Failed to send message");
      }
    } catch {
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-orange-500 flex flex-col pt-8 md:justify-center md:items-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Contact Us</h1>
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-700">Email: <a href="mailto:vidhyarthiseva7@gmail.com" className="text-blue-600 underline">vidhyarthiseva7@gmail.com</a></p>
          <p className="text-lg text-gray-700">Phone: <a href="tel:+918101008453" className="text-blue-600 underline">+91 81010 08453</a></p>
          <a href="https://wa.me/8101008453" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition">WhatsApp Us</a>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className="border rounded px-4 py-2" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Your Email" type="email" className="border rounded px-4 py-2" required />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" className="border rounded px-4 py-2" rows={5} required />
          <button type="submit" className="bg-gradient-to-br from-blue-600 to-orange-500 text-white font-bold py-2 rounded hover:from-orange-500 hover:to-blue-600 transition" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
          {success && <div className="text-green-600 text-center">{success}</div>}
          {error && <div className="text-red-600 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
} 