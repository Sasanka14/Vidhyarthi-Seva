"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GymEquipment {
  id: string;
  name: string;
  category: string;
  status: string;
  lastMaintenance: string;
  location: string;
  isAvailable: boolean;
  usageCount: number;
}

interface Trainer {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  isAvailable: boolean;
  rating: number;
  clientsCount: number;
}

export default function GymPage() {
  const [equipment, setEquipment] = useState<GymEquipment[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [activeTab, setActiveTab] = useState<'equipment' | 'trainers'>('equipment');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const mockEquipment: GymEquipment[] = [
      {
        id: "1",
        name: "Treadmill Pro X1",
        category: "Cardio",
        status: "Excellent",
        lastMaintenance: "2024-01-15",
        location: "Zone A",
        isAvailable: true,
        usageCount: 1250
      },
      {
        id: "2",
        name: "Weight Bench",
        category: "Strength",
        status: "Good",
        lastMaintenance: "2024-01-10",
        location: "Zone B",
        isAvailable: true,
        usageCount: 890
      },
      {
        id: "3",
        name: "Elliptical Machine",
        category: "Cardio",
        status: "Maintenance Required",
        lastMaintenance: "2023-12-20",
        location: "Zone A",
        isAvailable: false,
        usageCount: 2100
      }
    ];

    const mockTrainers: Trainer[] = [
      {
        id: "1",
        name: "Alex Johnson",
        specialization: "Strength Training",
        experience: 5,
        isAvailable: true,
        rating: 4.8,
        clientsCount: 15
      },
      {
        id: "2",
        name: "Maria Garcia",
        specialization: "Yoga & Pilates",
        experience: 8,
        isAvailable: true,
        rating: 4.9,
        clientsCount: 22
      },
      {
        id: "3",
        name: "David Chen",
        specialization: "Cardio & HIIT",
        experience: 3,
        isAvailable: false,
        rating: 4.6,
        clientsCount: 12
      }
    ];

    setTimeout(() => {
      setEquipment(mockEquipment);
      setTrainers(mockTrainers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch = 
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || trainer.specialization.includes(categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Maintenance Required': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Cardio': return 'bg-red-100 text-red-800';
      case 'Strength': return 'bg-blue-100 text-blue-800';
      case 'Yoga & Pilates': return 'bg-purple-100 text-purple-800';
      case 'Cardio & HIIT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Gym Management</h1>
            <p className="text-gray-600 mt-1">Manage equipment, trainers, and fitness programs</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
            + Add New {activeTab === 'equipment' ? 'Equipment' : 'Trainer'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200/50">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'equipment'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💪 Equipment
            </button>
            <button
              onClick={() => setActiveTab('trainers')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'trainers'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👨‍🏫 Trainers
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {activeTab === 'equipment' ? (
                <>
                  <option value="Cardio">Cardio</option>
                  <option value="Strength">Strength</option>
                </>
              ) : (
                <>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Yoga & Pilates">Yoga & Pilates</option>
                  <option value="Cardio & HIIT">Cardio & HIIT</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'equipment' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => (
              <div key={item.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">Location: {item.location}</p>
                    </div>
                    <div className={`w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2`}>
                      {item.name[0]}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-600">Usage Count:</span>
                      <span className="text-gray-900">{item.usageCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-600">Last Maintenance:</span>
                      <span className="text-gray-900">{item.lastMaintenance}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainers.map((trainer) => (
              <div key={trainer.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{trainer.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">Experience: {trainer.experience} years</p>
                    </div>
                    <div className={`w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2`}>
                      {trainer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-600">Clients:</span>
                      <span className="text-gray-900">{trainer.clientsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-600">Rating:</span>
                      <span className="text-gray-900">★ {trainer.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(trainer.specialization)}`}>
                      {trainer.specialization}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${trainer.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {trainer.isAvailable ? 'Available' : 'Unavailable'}
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
        )}

        {/* Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
              <p className="text-sm text-gray-600">Total Equipment</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{equipment.filter(e => e.isAvailable).length}</p>
              <p className="text-sm text-gray-600">Available Equipment</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{trainers.length}</p>
              <p className="text-sm text-gray-600">Total Trainers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{trainers.filter(t => t.isAvailable).length}</p>
              <p className="text-sm text-gray-600">Available Trainers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 