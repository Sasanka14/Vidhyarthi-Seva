"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Course } from '@/types';
import apiService from '@/lib/api';
import { motion } from 'framer-motion';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCourses();
      if (response.success || response.courses) {
        // Support both {courses: Course[]} and paginated {data: Course[]}
        setCourses(response.courses || response.data || []);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      setError('Error fetching courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (courseId: string) => {
    router.push(`/dashboard/courses/edit/${courseId}`);
  };

  const handleView = (courseId: string) => {
    router.push(`/dashboard/courses/view/${courseId}`);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const response = await apiService.deleteCourse(courseId);
      if (response.success) {
        setCourses(courses.filter(course => course._id !== courseId));
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      alert('Error deleting course');
      console.error('Error deleting course:', err);
    }
  };

  const handleAddNew = () => {
    router.push('/dashboard/courses/add');
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.faculty?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'live' && course.accessOptions?.some(opt => opt.type.toLowerCase().includes('live'))) return matchesSearch;
    if (filterType === 'recorded' && course.accessOptions?.some(opt => ['gd', 'pd'].some(type => opt.type.toLowerCase().includes(type)))) return matchesSearch;
    
    return matchesSearch;
  });

  const getStatusBadge = (course: Course) => {
    if (course.views?.live) return 'Live';
    if (course.batchRecording?.preRecorded) return 'Pre-recorded';
    return 'New';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-100 text-green-800';
      case 'Pre-recorded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStartingPrice = (course: Course) => {
    if (!course.accessOptions || course.accessOptions.length === 0) return null;
    const prices = course.accessOptions
      .map(opt => typeof opt.price === 'number' ? opt.price : parseInt(opt.price))
      .filter(price => !isNaN(price));
    if (prices.length === 0) return null;
    return Math.min(...prices);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-2xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Courses</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchCourses} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 px-4 bg-gradient-to-b from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
          <p className="text-gray-600 mt-1">Manage all courses and their details</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          + Add New Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Courses</p>
                <p className="text-2xl font-bold text-blue-900">{courses.length}</p>
              </div>
              <div className="text-blue-500 text-2xl">📚</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Live Courses</p>
                <p className="text-2xl font-bold text-green-900">
                  {courses.filter(c => c.views?.live).length}
                </p>
              </div>
              <div className="text-green-500 text-2xl">🔴</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Pre-recorded</p>
                <p className="text-2xl font-bold text-purple-900">
                  {courses.filter(c => c.batchRecording?.preRecorded).length}
                </p>
              </div>
              <div className="text-purple-500 text-2xl">📹</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Active Faculty</p>
                <p className="text-2xl font-bold text-orange-900">
                  {new Set(courses.map(c => c.faculty?.name).filter(Boolean)).size}
                </p>
              </div>
              <div className="text-orange-500 text-2xl">👨‍🏫</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6 rounded-xl shadow-md bg-white/80 mb-6">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Search Courses
              </Label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Search by title, description, or faculty..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setSearchTerm(searchInput);
                  }}
                  className="mt-1 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:shadow-lg rounded-xl"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                  onClick={() => setSearchTerm(searchInput)}
                  tabIndex={-1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 1110 3a7 7 0 017 7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="filter" className="text-sm font-medium text-gray-700">
                Filter by Type
              </Label>
              <select
                id="filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="all">All Courses</option>
                <option value="live">Live Courses</option>
                <option value="recorded">Pre-recorded</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' ? 'No courses found' : 'No courses yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first course'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <Button 
                onClick={handleAddNew}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                + Add First Course
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            >
              <Card className="group hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/90 rounded-2xl">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatusBadge(course))}`}>
                          {getStatusBadge(course)}
                        </span>
                        {course.validity && (
                          <span className="text-xs text-gray-500">
                            Valid: {course.validity}
                          </span>
                        )}
                      </div>
                    </div>
                    {course.thumbnail && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {course.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  {(() => {
                    const startingPrice = getStartingPrice(course);
                    if (startingPrice !== null) {
                      return (
                        <div className="text-sm text-green-700 font-semibold mb-1">Price: Starting from ₹{startingPrice}</div>
                      );
                    }
                    return null;
                  })()}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {course.lectures && (
                      <div>
                        <span className="text-gray-500">Lectures:</span>
                        <span className="font-medium ml-1">{course.lectures}</span>
                      </div>
                    )}
                    {course.hours && (
                      <div>
                        <span className="text-gray-500">Hours:</span>
                        <span className="font-medium ml-1">{course.hours}</span>
                      </div>
                    )}
                    {course.timings && (
                      <div>
                        <span className="text-gray-500">Timings:</span>
                        <span className="font-medium ml-1">{course.timings}</span>
                      </div>
                    )}
                    {course.videoLanguage && (
                      <div>
                        <span className="text-gray-500">Language:</span>
                        <span className="font-medium ml-1">{course.videoLanguage}</span>
                      </div>
                    )}
                  </div>

                  {course.faculty?.image ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <img
                        src={course.faculty.image}
                        alt={course.faculty.name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.faculty?.name}</p>
                        {course.faculty?.experience && (
                          <p className="text-xs text-gray-500">{course.faculty.experience}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                        {course.faculty?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.faculty?.name}</p>
                        {course.faculty?.experience && (
                          <p className="text-xs text-gray-500">{course.faculty.experience}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(course._id)}
                      className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleView(course._id)}
                      className="flex-1 hover:bg-green-50 hover:border-green-300"
                    >
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(course._id)}
                      className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 