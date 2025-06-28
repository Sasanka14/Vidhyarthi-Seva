"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && (data.user || data.data)) {
          setUser(data.user || data.data);
        } else {
          setError(data.message || "User not found");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (field: keyof User, value: any) => {
    setUser((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard/users");
      } else {
        alert(data.message || "Failed to update user");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!user) {
    return <div className="p-8 text-center text-gray-500">User not found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 bg-white/90 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input value={user.firstName} onChange={e => handleChange('firstName', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input value={user.lastName} onChange={e => handleChange('lastName', e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input value={user.email} onChange={e => handleChange('email', e.target.value)} required type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input value={user.phone} onChange={e => handleChange('phone', e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select value={user.role} onChange={e => handleChange('role', e.target.value)} className="w-full rounded-lg border-gray-300">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="mentor">Mentor</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={user.isActive ? 'active' : 'inactive'} onChange={e => handleChange('isActive', e.target.value === 'active')} className="w-full rounded-lg border-gray-300">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email Verified</label>
          <select value={user.isEmailVerified ? 'verified' : 'pending'} onChange={e => handleChange('isEmailVerified', e.target.value === 'verified')} className="w-full rounded-lg border-gray-300">
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard/users')}>Cancel</Button>
          <Button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
} 