"use client";
import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess("Signup successful! Please check your email for verification.");
        setForm({ firstName: "", lastName: "", email: "", phone: "", password: "" });
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        setError(data.message || data.errors?.[0]?.msg || "Signup failed");
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-orange-500 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <input 
              name="firstName" 
              value={form.firstName} 
              onChange={handleChange} 
              placeholder="First Name" 
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
            <input 
              name="lastName" 
              value={form.lastName} 
              onChange={handleChange} 
              placeholder="Last Name" 
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          
          <input 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="Email Address" 
            type="email" 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
          
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            placeholder="Phone Number (10 digits)" 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
          
          <input 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            placeholder="Password (min 6 characters)" 
            type="password" 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
          
          <button 
            type="submit" 
            className="bg-gradient-to-br from-blue-600 to-orange-500 text-white font-bold py-3 rounded-lg hover:from-orange-500 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-center">
            {success}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 