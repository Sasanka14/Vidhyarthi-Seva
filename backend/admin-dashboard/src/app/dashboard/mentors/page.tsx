"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  expertise: string[];
  experience: number;
  isAvailable: boolean;
  rating: number;
  studentsCount: number;
  bio: string;
  specialization: string;
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  useEffect(() => {
    const mockMentors: Mentor[] = [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@vidhyarthiseva.com",
        phone: "+91 98765 43210",
        expertise: ["Mathematics", "Physics", "Calculus"],
        experience: 8,
        isAvailable: true,
        rating: 4.8,
        studentsCount: 25,
        bio: "Experienced mathematics professor with expertise in advanced calculus and physics.",
        specialization: "Mathematics"
      },
      {
        id: "2",
        name: "Prof. Michael Chen",
        email: "michael.chen@vidhyarthiseva.com",
        phone: "+91 98765 43211",
        expertise: ["Computer Science", "Programming", "Data Structures"],
        experience: 12,
        isAvailable: true,
        rating: 4.9,
        studentsCount: 32,
        bio: "Senior computer science professor specializing in programming and algorithms.",
        specialization: "Computer Science"
      }
    ];

    setTimeout(() => {
      setMentors(mockMentors);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExpertise = expertiseFilter === "all" || mentor.expertise.includes(expertiseFilter);
    const matchesAvailability = availabilityFilter === "all" || 
      (availabilityFilter === "available" && mentor.isAvailable) ||
      (availabilityFilter === "unavailable" && !mentor.isAvailable);
    
    return matchesSearch && matchesExpertise && matchesAvailability;
  });

  const getSpecializationBadgeColor = (specialization: string) => {
    switch (specialization) {
      case 'Mathematics': return 'bg-blue-100 text-blue-800';
      case 'Computer Science': return 'bg-purple-100 text-purple-800';
      case 'Business': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 px-4 bg-gradient-to-b from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentors Management</h1>
            <p className="text-gray-600 mt-1">Manage mentor profiles and expertise</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
            + Add New Mentor
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search mentors by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={expertiseFilter}
              onChange={(e) => setExpertiseFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Expertise</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Business">Business</option>
            </select>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{mentor.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{mentor.email}</p>
                    <p className="text-sm text-gray-600">{mentor.phone}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold ml-2`}>
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">Experience:</span>
                    <span className="text-gray-900">{mentor.experience} years</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">Students:</span>
                    <span className="text-gray-900">{mentor.studentsCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">Rating:</span>
                    <span className="text-gray-900">★ {mentor.rating}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">{mentor.bio}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSpecializationBadgeColor(mentor.specialization)}`}>
                    {mentor.specialization}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${mentor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {mentor.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-1">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.map((skill, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-900 flex-1">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-900 flex-1">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No mentors found matching your criteria.</p>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{mentors.length}</p>
              <p className="text-sm text-gray-600">Total Mentors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{mentors.filter(m => m.isAvailable).length}</p>
              <p className="text-sm text-gray-600">Available Mentors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{mentors.filter(m => m.specialization === 'Mathematics').length}</p>
              <p className="text-sm text-gray-600">Math Mentors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{mentors.filter(m => m.specialization === 'Computer Science').length}</p>
              <p className="text-sm text-gray-600">CS Mentors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 