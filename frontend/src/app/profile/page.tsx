"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isEmailVerified: boolean;
  studentId?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  address?: Address;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    } as Address
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setForm({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          phone: data.user.phone || "",
          dateOfBirth: data.user.dateOfBirth ? data.user.dateOfBirth.split('T')[0] : "",
          gender: data.user.gender || "",
          bio: data.user.bio || "",
          address: {
            street: data.user.address?.street || "",
            city: data.user.address?.city || "",
            state: data.user.address?.state || "",
            zipCode: data.user.address?.zipCode || "",
            country: data.user.address?.country || ""
          }
        });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserProfile();
  }, [router, fetchUserProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          address: form.address
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Profile updated successfully!');
        setEditing(false);
        fetchUserProfile(); // Refresh user data
      } else {
        setError(data.message || (data.errors && data.errors[0]?.msg) || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-orange-500">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-orange-500 flex flex-col pt-8 md:justify-center md:items-center">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                  <p className="text-blue-100">{user.email}</p>
                  <p className="text-blue-100 capitalize">{user.role}</p>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all text-black border border-white"
                  >
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all text-white font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600">
                {success}
              </div>
            )}

            {editing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={(e) => setForm({...form, firstName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={(e) => setForm({...form, lastName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={(e) => setForm({...form, dateOfBirth: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={(e) => setForm({...form, gender: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={(e) => setForm({...form, bio: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="street"
                      value={form.address.street}
                      onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                      placeholder="Street"
                      className="border border-gray-300 rounded-lg px-4 py-2 mb-2"
                    />
                    <input
                      name="city"
                      value={form.address.city}
                      onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                      placeholder="City"
                      className="border border-gray-300 rounded-lg px-4 py-2 mb-2"
                    />
                    <input
                      name="state"
                      value={form.address.state}
                      onChange={e => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
                      placeholder="State"
                      className="border border-gray-300 rounded-lg px-4 py-2 mb-2"
                    />
                    <input
                      name="zipCode"
                      value={form.address.zipCode}
                      onChange={e => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })}
                      placeholder="Zip Code"
                      className="border border-gray-300 rounded-lg px-4 py-2 mb-2"
                    />
                    <input
                      name="country"
                      value={form.address.country}
                      onChange={e => setForm({ ...form, address: { ...form.address, country: e.target.value } })}
                      placeholder="Country"
                      className="border border-gray-300 rounded-lg px-4 py-2 mb-2"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-orange-500 hover:to-blue-600 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Full Name</span>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="font-medium">{user.email}</p>
                        {user.isEmailVerified && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                            Verified
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Phone</span>
                        <p className="font-medium">{user.phone || 'Not provided'}</p>
                      </div>
                      {user.dateOfBirth && (
                        <div>
                          <span className="text-sm text-gray-500">Date of Birth</span>
                          <p className="font-medium">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      )}
                      {user.gender && (
                        <div>
                          <span className="text-sm text-gray-500">Gender</span>
                          <p className="font-medium capitalize">{user.gender}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Student ID</span>
                        <p className="font-medium">{user.studentId || 'Not assigned'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Role</span>
                        <p className="font-medium capitalize">{user.role}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Member Since</span>
                        <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {user.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
                      <p className="text-gray-700">{user.bio}</p>
                    </div>
                  )}

                  {user.address && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
                      <p className="text-gray-700">
                        {user.address.street && <span>{user.address.street}, </span>}
                        {user.address.city && <span>{user.address.city}, </span>}
                        {user.address.state && <span>{user.address.state}, </span>}
                        {user.address.zipCode && <span>{user.address.zipCode}, </span>}
                        {user.address.country && <span>{user.address.country}</span>}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 