"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Layers, User, Video, BookOpen } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description?: string;
  lectures?: number;
  hours?: number;
  timings?: string;
  batchStartDate?: string;
  platforms?: string[];
  doubtSolvingPlatform?: string;
  syllabusType?: string;
  videoLanguage?: string;
  faculty?: { name?: string };
  thumbnail?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Filters
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [faculty, setFaculty] = useState("");
  const [videoLanguage, setVideoLanguage] = useState("");
  const [syllabusType, setSyllabusType] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
          setFiltered(data.courses);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let filteredCourses = courses;
    if (title) filteredCourses = filteredCourses.filter(c => c.title.toLowerCase().includes(title.toLowerCase()));
    if (platform) filteredCourses = filteredCourses.filter(c => c.platforms?.some(p => p.toLowerCase().includes(platform.toLowerCase())));
    if (faculty) filteredCourses = filteredCourses.filter(c => c.faculty?.name?.toLowerCase().includes(faculty.toLowerCase()));
    if (videoLanguage) filteredCourses = filteredCourses.filter(c => c.videoLanguage?.toLowerCase().includes(videoLanguage.toLowerCase()));
    if (syllabusType) filteredCourses = filteredCourses.filter(c => c.syllabusType?.toLowerCase().includes(syllabusType.toLowerCase()));
    setFiltered(filteredCourses);
  }, [title, platform, faculty, videoLanguage, syllabusType, courses]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      {/* Modern Filter Bar */}
      <div className="w-full max-w-5xl mx-auto mb-8">
        <div className="bg-white/80 rounded-xl shadow flex flex-col md:flex-row gap-4 p-4 items-center">
          <div className="flex-1 flex flex-col md:flex-row gap-2 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                className="pl-10 pr-3 py-2 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Search by title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <Layers className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                className="pl-10 pr-3 py-2 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Platform"
                value={platform}
                onChange={e => setPlatform(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                className="pl-10 pr-3 py-2 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Faculty"
                value={faculty}
                onChange={e => setFaculty(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <Video className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                className="pl-10 pr-3 py-2 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Video Language"
                value={videoLanguage}
                onChange={e => setVideoLanguage(e.target.value)}
              />
            </div>
            <div className="relative w-full">
              <BookOpen className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                className="pl-10 pr-3 py-2 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Syllabus Type"
                value={syllabusType}
                onChange={e => setSyllabusType(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              onClick={() => {}}
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 text-white font-semibold shadow hover:from-orange-500 hover:to-blue-600 transition"
            >
              Search
            </button>
            <button
              onClick={() => { setTitle(""); setPlatform(""); setFaculty(""); setVideoLanguage(""); setSyllabusType(""); }}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : filtered.length === 0 ? (
        <div>No courses found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(course => {
            // Find lowest price from accessOptions
            let minPrice = undefined;
            if (Array.isArray((course as any).accessOptions) && (course as any).accessOptions.length > 0) {
              minPrice = Math.min(...(course as any).accessOptions.map((o: any) => o.price));
            }
            return (
              <div key={course._id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
                {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded mb-2" />}
                <h2 className="font-bold text-lg">{course.title}</h2>
                <div className="text-gray-600 text-sm line-clamp-2">{course.description}</div>
                <div className="text-xs text-gray-500">{course.platforms?.join(", ")}</div>
                <div className="text-xs text-gray-500">Faculty: {course.faculty?.name}</div>
                <div className="text-xs text-gray-500">Video Language: {course.videoLanguage}</div>
                <div className="text-xs text-gray-500">Syllabus: {course.syllabusType}</div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm cursor-default" disabled>
                    Price Starting From {minPrice !== undefined ? `₹${minPrice}` : '—'}
                  </button>
                  <Link href={`/dashboard/courses/view/${course._id}`} className="px-4 py-2 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 text-white font-semibold text-sm shadow hover:from-orange-500 hover:to-blue-600 transition">
                    View Details
                  </Link>
                  <button className="px-4 py-2 rounded-full bg-green-500 text-white font-semibold text-sm shadow hover:bg-green-600 transition">Buy Now</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 