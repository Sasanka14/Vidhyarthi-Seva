"use client";
import { BedDouble, BookOpen, Users, Library, Dumbbell, Utensils, FileBarChart2 } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: <BedDouble size={36} className="text-blue-600" />,
    title: "Accommodation Finder",
    desc: "Find verified, affordable PG and hostel accommodations near your college or coaching center.",
    link: "/dashboard/accommodations",
  },
  {
    icon: <BookOpen size={36} className="text-orange-500" />,
    title: "Courses Directory",
    desc: "Explore top coaching classes and courses for IIT, NEET, UPSC, and more.",
    link: "/dashboard/courses",
  },
  {
    icon: <Users size={36} className="text-purple-500" />,
    title: "Mentorship Hub",
    desc: "Connect with experienced mentors for personalized guidance and career advice.",
    link: "/dashboard/mentors",
  },
  {
    icon: <Library size={36} className="text-green-500" />,
    title: "Library Access",
    desc: "Access digital and physical libraries for all your study needs.",
    link: "/dashboard/library",
  },
  {
    icon: <Dumbbell size={36} className="text-pink-500" />,
    title: "Gym & Fitness",
    desc: "Stay fit and healthy with access to modern gym and fitness facilities.",
    link: "/dashboard/gym",
  },
  {
    icon: <Utensils size={36} className="text-yellow-500" />,
    title: "Meals & Mess",
    desc: "Nutritious and affordable meal plans for students.",
    link: "/dashboard/meals",
  },
  {
    icon: <FileBarChart2 size={36} className="text-red-500" />,
    title: "Test Series",
    desc: "Practice with curated test series for all major exams.",
    link: "/dashboard/test-series",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-orange-500 flex flex-col pt-8 md:justify-center md:items-center">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Our Services</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.title} className="bg-white rounded-lg shadow p-6 flex flex-col gap-3 border-t-4 border-blue-600 hover:scale-105 hover:shadow-xl transition-transform duration-300">
              <div>{service.icon}</div>
              <h2 className="text-lg font-semibold text-gray-900">{service.title}</h2>
              <p className="text-gray-700 text-sm mb-2">{service.desc}</p>
              <Link href={service.link} className="mt-auto px-4 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 text-white font-semibold shadow hover:from-orange-500 hover:to-blue-600 transition text-center">Explore</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 