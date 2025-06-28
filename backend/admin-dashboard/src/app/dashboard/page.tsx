"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiService from "@/lib/api";

const quickActions = [
  { title: 'Add New User', description: 'Register a new student or staff member', icon: '👤', href: '/dashboard/users', color: 'from-blue-500 to-blue-600' },
  { title: 'Create Course', description: 'Add a new course to the curriculum', icon: '📖', href: '/dashboard/courses', color: 'from-green-500 to-green-600' },
  { title: 'Manage Meals', description: 'Update meal plans and menus', icon: '🍽️', href: '/dashboard/meals', color: 'from-orange-500 to-orange-600' },
  { title: 'Assign Rooms', description: 'Manage accommodation assignments', icon: '🏠', href: '/dashboard/accommodations', color: 'from-purple-500 to-purple-600' },
  { title: 'Add Mentor', description: 'Register a new mentor', icon: '👨‍🏫', href: '/dashboard/mentors', color: 'from-indigo-500 to-indigo-600' },
  { title: 'Create Test', description: 'Add a new test series', icon: '📝', href: '/dashboard/test-series', color: 'from-red-500 to-red-600' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCourses: 0,
    mealPlans: 0, // Placeholder
    availableRooms: 0, // Placeholder
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
    if (!token || user.role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError("");
      try {
        // Fetch user stats
        const userStats = await apiService.getUserStats();
        // Fetch courses
        const coursesRes = await apiService.getCourses();
        setStats({
          totalUsers: userStats.data?.totalUsers || 0,
          activeCourses: Array.isArray(coursesRes.data) ? coursesRes.data.length : (coursesRes.count || 0),
          mealPlans: 0, // Placeholder
          availableRooms: 0, // Placeholder
        });
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  }

  const statsArray = [
    { label: 'Total Users', value: stats.totalUsers, change: '', icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Active Courses', value: stats.activeCourses, change: '', icon: '📚', color: 'from-green-500 to-green-600' },
    { label: 'Meal Plans', value: stats.mealPlans, change: '', icon: '🍽️', color: 'from-orange-500 to-orange-600' },
    { label: 'Available Rooms', value: stats.availableRooms, change: '', icon: '🏠', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-8 py-8 px-4 bg-gradient-to-b from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          Vidhyarthi Seva's Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsArray.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {stat.change && <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>}
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-200`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New user registered', user: 'John Doe', time: '2 minutes ago', type: 'user' },
            { action: 'Course updated', user: 'Mathematics 101', time: '15 minutes ago', type: 'course' },
            { action: 'Meal plan created', user: 'Weekly Menu', time: '1 hour ago', type: 'meal' },
            { action: 'Room assigned', user: 'Room 205', time: '2 hours ago', type: 'accommodation' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 