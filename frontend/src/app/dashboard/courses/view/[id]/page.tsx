"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Razorpay script loader
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [payMsg, setPayMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPaymentLink, setSelectedPaymentLink] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/courses/${id}`);
        const data = await res.json();
        if (data.success) {
          setCourse(data.course);
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
  }, [id]);

  const handleBuyNow = (accessIdx: number) => {
    router.push(`/checkout?courseId=${course._id}&accessIdx=${accessIdx}`);
  };

  const handleFormChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProceed = () => {
    // Optionally, append details as query params if needed
    window.open(selectedPaymentLink, '_blank');
    setShowModal(false);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!course) return null;

  // Find lowest price from accessOptions
  let minPrice = undefined;
  if (Array.isArray(course.accessOptions) && course.accessOptions.length > 0) {
    minPrice = Math.min(...course.accessOptions.map((o: any) => o.price));
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/90 rounded-2xl shadow-xl overflow-hidden relative"
      >
        {course.thumbnail && (
          <div className="w-full h-56 sm:h-72 bg-gray-100 overflow-hidden flex items-center justify-center">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-gray-900">{course.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {course.platforms?.map((p: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{p}</span>
            ))}
            {course.videoLanguage && (
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">{course.videoLanguage}</span>
            )}
            {course.syllabusType && (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">{course.syllabusType}</span>
            )}
          </div>
          <div className="mb-4 text-gray-700 text-lg leading-relaxed">{course.description}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div><b>Lectures:</b> {course.lectures ?? '—'}</div>
            <div><b>Hours:</b> {course.hours ?? '—'}</div>
            <div><b>Timings:</b> {course.timings ?? '—'}</div>
            <div><b>Batch Start Date:</b> {course.batchStartDate ? new Date(course.batchStartDate).toLocaleDateString() : '—'}</div>
            <div><b>Doubt Solving Platform:</b> {course.doubtSolvingPlatform ?? '—'}</div>
          </div>
          {course.faculty && (
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">Faculty</h2>
              <div className="flex items-center gap-4">
                {course.faculty.image && <img src={course.faculty.image} alt={course.faculty.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />}
                <div>
                  <div className="font-bold text-gray-900">{course.faculty.name}</div>
                  {course.faculty.bio && (
                    <div className="text-gray-700 mb-1"><b>Faculty Description:</b> {course.faculty.bio}</div>
                  )}
                  {course.faculty.experience && (
                    <div className="text-xs text-gray-500">Experience: {course.faculty.experience}</div>
                  )}
                  {course.faculty.style && (
                    <div className="text-xs text-gray-500">Style: {course.faculty.style}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          {Array.isArray(course.accessOptions) && course.accessOptions.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">Access Options</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.accessOptions.map((opt: any, idx: number) => (
                  <div key={idx} className="border rounded-xl p-4 flex flex-col gap-2 bg-gray-50">
                    <div><b>Type:</b> {opt.type}</div>
                    <div><b>Price:</b> <span className="font-bold text-blue-700">₹{opt.price}</span></div>
                    <div><b>Views:</b> {opt.views}</div>
                    <div><b>Validity:</b> {opt.validity}</div>
                    <button
                      onClick={() => handleBuyNow(idx)}
                      className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 text-white font-semibold shadow hover:from-orange-500 hover:to-blue-600 transition text-center"
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(course.booksIncluded) && course.booksIncluded.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">Books Included</h2>
              <ul className="list-disc list-inside text-gray-700">
                {course.booksIncluded.map((book: string, idx: number) => (
                  <li key={idx}>{book}</li>
                ))}
              </ul>
            </div>
          )}
          {course.systemRequirements && (
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">System Requirements</h2>
              <div className="text-sm text-gray-700">Supported: {course.systemRequirements.supported?.join(", ") ?? '—'}</div>
              <div className="text-sm text-gray-700">Not Supported: {course.systemRequirements.notSupported?.join(", ") ?? '—'}</div>
            </div>
          )}
          {payMsg && <div className="mt-4 text-center font-semibold text-blue-700">{payMsg}</div>}
        </div>
      </motion.div>

      {/* Modal for collecting user details */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Enter Your Details</h2>
            <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" className="mb-2 w-full border rounded px-3 py-2" />
            <input name="email" value={form.email} onChange={handleFormChange} placeholder="Email" className="mb-2 w-full border rounded px-3 py-2" />
            <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="Phone" className="mb-4 w-full border rounded px-3 py-2" />
            <button onClick={handleProceed} className="w-full bg-gradient-to-br from-blue-600 to-orange-500 text-white font-bold py-2 rounded">Proceed to Pay</button>
            <button onClick={() => setShowModal(false)} className="w-full mt-2 text-gray-500">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
} 