"use client";
import Link from 'next/link';
import { GraduationCap, User, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    router.push('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#f7f8fa] shadow-sm border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500">
            <GraduationCap size={28} className="text-white" />
          </span>
          <span className="text-2xl font-extrabold text-gray-900">Vidhyarthi Seva</span>
        </div>
        
        <div className="hidden md:flex gap-10 items-center">
          <span className="text-gray-700 hover:text-blue-700 font-medium transition cursor-pointer" onClick={() => router.push("/about")}>About</span>
          <span className="text-gray-700 hover:text-blue-700 font-medium transition cursor-pointer" onClick={() => router.push("/services")}>Services</span>
          <span className="text-gray-700 hover:text-blue-700 font-medium transition cursor-pointer" onClick={() => router.push("/contact")}>Contact Us</span>
        </div>
        
        <div className="flex gap-5 items-center">
          {!loading && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-gray-700 font-medium">
                      {user.firstName}
                    </span>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings size={16} />
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="font-bold text-gray-900 hover:text-blue-700 transition">
                    Login
                  </Link>
                  <Link href="/signup" className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-br from-blue-600 to-orange-500 text-white shadow hover:from-orange-500 hover:to-blue-600 transition">
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        {user && (
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.firstName.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium">{user.firstName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
            <div className="mt-2 flex gap-4">
              <Link href="/profile" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Profile
              </Link>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 