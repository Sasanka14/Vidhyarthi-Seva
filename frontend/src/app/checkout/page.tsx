"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Course {
  _id: string;
  title: string;
  description?: string;
  accessOptions?: AccessOption[];
  // add other fields as needed
}

interface AccessOption {
  type: string;
  price: number;
  views: number;
  validity: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  const accessIdx = Number(searchParams.get("accessIdx"));

  const [course, setCourse] = useState<Course | null>(null);
  const [accessOption, setAccessOption] = useState<AccessOption | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

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
      } catch {
        setError("Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, accessIdx]);

  useEffect(() => {
    // Check for user login
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login?redirect=/checkout" + window.location.search);
    }
  }, [router]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProceed = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login?redirect=/checkout" + window.location.search);
      return;
    }

    if (!course || !accessOption) {
      setError("Course information not available");
      return;
    }

    try {
      setLoading(true);
      
      // Create Razorpay order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: accessOption.price,
          courseId: course._id,
          userId: JSON.parse(localStorage.getItem("user") || "{}").id,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Vidhyarthi Seva",
        description: course.title,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course._id,
                userId: JSON.parse(localStorage.getItem("user") || "{}").id,
                amount: accessOption.price,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              router.push("/dashboard?payment=success");
            } else {
              setError("Payment verification failed");
            }
          } catch (error) {
            setError("Payment verification failed");
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#667eea",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      setError("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 bg-gradient-to-br from-blue-600 to-orange-500 text-white font-bold py-3 rounded-lg hover:from-orange-500 hover:to-blue-600 transition text-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Proceed to Pay"}
            </button>
          </form>
          <button onClick={() => router.back()} className="w-full mt-2 text-gray-500 hover:text-blue-600 font-medium transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <CheckoutContent />
    </Suspense>
  );
} 