"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Course {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

interface Payment {
  _id: string;
  course: Course;
  amount: number;       // in smallest currency unit, e.g. cents or paise
  currency: string;     // currency code, e.g. "INR", "USD"
  status: string;
  createdAt: string;    // ISO timestamp
}

export default function UserDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading]   = useState<boolean>(true);
  const [error, setError]       = useState<string>("");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch("/api/payments/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data  = await res.json();

        if (res.ok) {
          setPayments(data.payments);
        } else {
          setError(data.message ?? "Failed to fetch purchases");
        }
      } catch {
        setError("Failed to fetch purchases");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-orange-500 flex flex-col pt-8 md:justify-center md:items-center">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          My Purchases
        </h1>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : payments.length === 0 ? (
          <div className="text-center text-gray-600">
            You have not purchased any courses yet.
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => {
              // Safely parse date
              const date = payment.createdAt
                ? new Date(payment.createdAt).toLocaleDateString()
                : "Unknown date";

              // Format amount (assuming smallest unit)
              const displayAmount = (payment.amount / 100).toFixed(2);

              return (
                <div
                  key={payment._id}
                  className="flex flex-col md:flex-row items-center gap-4 border-b pb-4 last:border-b-0"
                >
                  {payment.course.thumbnail && (
                    <Image
                      src={payment.course.thumbnail}
                      alt={payment.course.title}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {payment.course.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-1">
                      Purchased on {date}
                    </p>
                    <p className="text-gray-700 font-medium">
                      Amount: {displayAmount} {payment.currency}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      Status: {payment.status}
                    </p>
                  </div>

                  <Link
                    href={`/courses/view/${payment.course._id}`}
                    className="px-4 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 text-white font-semibold shadow hover:from-orange-500 hover:to-blue-600 transition"
                  >
                    View Course
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
