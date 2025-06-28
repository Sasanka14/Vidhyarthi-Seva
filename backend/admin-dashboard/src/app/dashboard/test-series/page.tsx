"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TestSeries {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  isActive: boolean;
  price: number;
  difficulty: string;
  attempts: number;
  averageScore: number;
}

export default function TestSeriesPage() {
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    const mockTestSeries: TestSeries[] = [
      {
        id: "1",
        title: "JEE Main Mathematics",
        description: "Complete mathematics test series for JEE Main preparation",
        subject: "Mathematics",
        duration: 180,
        totalQuestions: 75,
        isActive: true,
        price: 999,
        difficulty: "Advanced",
        attempts: 1250,
        averageScore: 78.5
      },
      {
        id: "2",
        title: "NEET Biology",
        description: "Comprehensive biology test series for NEET aspirants",
        subject: "Biology",
        duration: 200,
        totalQuestions: 90,
        isActive: true,
        price: 799,
        difficulty: "Intermediate",
        attempts: 890,
        averageScore: 82.3
      },
      {
        id: "3",
        title: "CAT Quantitative Aptitude",
        description: "Quantitative aptitude tests for CAT preparation",
        subject: "Quantitative Aptitude",
        duration: 120,
        totalQuestions: 50,
        isActive: false,
        price: 599,
        difficulty: "Advanced",
        attempts: 450,
        averageScore: 71.2
      }
    ];

    setTimeout(() => {
      setTestSeries(mockTestSeries);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTestSeries = testSeries.filter((test) => {
    const matchesSearch = 
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === "all" || test.subject === subjectFilter;
    const matchesDifficulty = difficultyFilter === "all" || test.difficulty === difficultyFilter;
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectBadgeColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return 'bg-blue-100 text-blue-800';
      case 'Biology': return 'bg-green-100 text-green-800';
      case 'Quantitative Aptitude': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Test Series Management</h1>
            <p className="text-gray-600 mt-1">Manage test series, questions, and results</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
            + Add New Test Series
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search test series by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="Quantitative Aptitude">Quantitative Aptitude</option>
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestSeries.map((test) => (
            <div key={test.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                  </div>
                  <div className={`w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2`}>
                    {test.title[0]}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">Price:</span>
                    <span className="font-semibold text-gray-900">₹{test.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">Duration:</span>
                    <span className="text-gray-900">{formatDuration(test.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">Questions:</span>
                    <span className="text-gray-900">{test.totalQuestions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">Attempts:</span>
                    <span className="text-gray-900">{test.attempts}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">Avg Score:</span>
                    <span className="text-gray-900">{test.averageScore}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSubjectBadgeColor(test.subject)}`}>
                    {test.subject}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBadgeColor(test.difficulty)}`}>
                    {test.difficulty}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {test.isActive ? 'Active' : 'Inactive'}
                  </span>
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

        {filteredTestSeries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No test series found matching your criteria.</p>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{testSeries.length}</p>
              <p className="text-sm text-gray-600">Total Test Series</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{testSeries.filter(t => t.isActive).length}</p>
              <p className="text-sm text-gray-600">Active Tests</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{testSeries.filter(t => t.subject === 'Mathematics').length}</p>
              <p className="text-sm text-gray-600">Math Tests</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{testSeries.filter(t => t.difficulty === 'Advanced').length}</p>
              <p className="text-sm text-gray-600">Advanced Level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 