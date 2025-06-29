"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  const accessIdx = Number(searchParams.get("accessIdx"));

  const [course, setCourse] = useState<any>(null);
  const [accessOption, setAccessOption] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const RAZORPAY_ME_LINK = process.env.NEXT_PUBLIC_RAZORPAY_ME_LINK || "https://razorpay.me/@vivekgupta9697";

  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        if (data.success) {
          setCourse(data.course);
          setAccessOption(data.course.accessOptions?.[accessIdx] || null);
        } else {
          setError("Course not found");
        }
      } catch (err) {
        setError("Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, accessIdx]);

  const handleFormChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProceed = () => {
    window.open(RAZORPAY_ME_LINK, '_blank');
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!course || !accessOption) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-orange-500 flex flex-col pt-8 md:justify-center md:items-center px-2">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-6 text-white text-center rounded-t-2xl">
          <h1 className="text-3xl font-extrabold mb-1 drop-shadow">Checkout</h1>
          <p className="text-lg font-medium">Secure your course in just one step</p>
        </div>
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          <div className="bg-gray-50 rounded-xl shadow-inner p-4 mb-2">
            <h2 className="text-xl font-bold text-blue-700 mb-1">{course.title}</h2>
            <div className="flex flex-col sm:flex-row sm:gap-8 gap-1 text-gray-700 text-base">
              <div><b>Type:</b> {accessOption.type}</div>
              <div><b>Price:</b> <span className="font-bold text-orange-600">₹{accessOption.price}</span></div>
              <div><b>Validity:</b> {accessOption.validity}</div>
            </div>
          </div>
          <form onSubmit={e => { e.preventDefault(); handleProceed(); }} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Your Name</label>
              <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Email Address</label>
              <input name="email" value={form.email} onChange={handleFormChange} placeholder="Email" type="email" className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="Phone" className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <button type="submit" className="mt-4 bg-gradient-to-br from-blue-600 to-orange-500 text-white font-bold py-3 rounded-lg hover:from-orange-500 hover:to-blue-600 transition text-lg shadow">
              Proceed to Pay
            </button>
          </form>
          <button onClick={() => router.back()} className="w-full mt-2 text-gray-500 hover:text-blue-600 font-medium transition">Cancel</button>
        </div>
      </div>
    </div>
  );
} 