"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publicationYear: number;
  copies: number;
  availableCopies: number;
  location: string;
  isAvailable: boolean;
  rating: number;
  description: string;
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  useEffect(() => {
    const mockBooks: Book[] = [
      {
        id: "1",
        title: "Advanced Mathematics for Engineering",
        author: "Dr. Robert Smith",
        isbn: "978-0-123456-78-9",
        category: "Mathematics",
        publicationYear: 2023,
        copies: 5,
        availableCopies: 3,
        location: "Shelf A1",
        isAvailable: true,
        rating: 4.5,
        description: "Comprehensive mathematics textbook covering advanced topics for engineering students."
      },
      {
        id: "2",
        title: "Computer Science Fundamentals",
        author: "Prof. Sarah Johnson",
        isbn: "978-0-987654-32-1",
        category: "Computer Science",
        publicationYear: 2022,
        copies: 8,
        availableCopies: 0,
        location: "Shelf B2",
        isAvailable: false,
        rating: 4.8,
        description: "Essential computer science concepts and programming fundamentals."
      },
      {
        id: "3",
        title: "Business Management Principles",
        author: "Dr. Michael Chen",
        isbn: "978-0-456789-01-2",
        category: "Business",
        publicationYear: 2021,
        copies: 3,
        availableCopies: 2,
        location: "Shelf C3",
        isAvailable: true,
        rating: 4.2,
        description: "Core principles of business management and organizational behavior."
      },
      {
        id: "4",
        title: "Physics for Scientists and Engineers",
        author: "Prof. Emily Rodriguez",
        isbn: "978-0-789012-34-5",
        category: "Physics",
        publicationYear: 2023,
        copies: 6,
        availableCopies: 4,
        location: "Shelf D4",
        isAvailable: true,
        rating: 4.6,
        description: "Comprehensive physics textbook with practical applications."
      }
    ];

    setTimeout(() => {
      setBooks(mockBooks);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    const matchesAvailability = availabilityFilter === "all" || 
      (availabilityFilter === "available" && book.isAvailable) ||
      (availabilityFilter === "unavailable" && !book.isAvailable);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Mathematics': return 'bg-blue-100 text-blue-800';
      case 'Computer Science': return 'bg-purple-100 text-purple-800';
      case 'Business': return 'bg-green-100 text-green-800';
      case 'Physics': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityPercentage = (available: number, total: number) => {
    return Math.round((available / total) * 100);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600 mt-1">Manage books, categories, and borrowing system</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
          + Add New Book
        </Button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business">Business</option>
            <option value="Physics">Physics</option>
          </select>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                  <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                </div>
                <div className={`w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2`}>
                  {book.title[0]}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Publication:</span>
                  <span className="text-gray-900">{book.publicationYear}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Location:</span>
                  <span className="text-gray-900">{book.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Available:</span>
                  <span className="text-gray-900">{book.availableCopies}/{book.copies}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Rating:</span>
                  <span className="text-gray-900">★ {book.rating}</span>
                </div>
              </div>

              {/* Availability Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Availability</span>
                  <span>{getAvailabilityPercentage(book.availableCopies, book.copies)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getAvailabilityPercentage(book.availableCopies, book.copies) === 0 
                        ? 'bg-red-500' 
                        : getAvailabilityPercentage(book.availableCopies, book.copies) < 30 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${getAvailabilityPercentage(book.availableCopies, book.copies)}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{book.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(book.category)}`}>
                  {book.category}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${book.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {book.isAvailable ? 'Available' : 'Unavailable'}
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

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No books found matching your criteria.</p>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{books.length}</p>
            <p className="text-sm text-gray-600">Total Books</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{books.filter(b => b.isAvailable).length}</p>
            <p className="text-sm text-gray-600">Available Books</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{books.filter(b => b.category === 'Mathematics').length}</p>
            <p className="text-sm text-gray-600">Math Books</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{books.filter(b => b.category === 'Computer Science').length}</p>
            <p className="text-sm text-gray-600">CS Books</p>
          </div>
        </div>
      </div>
    </div>
  );
} 