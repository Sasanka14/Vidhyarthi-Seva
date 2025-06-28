"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Accommodation {
  id: string;
  roomNumber: string;
  type: string;
  capacity: number;
  price: number;
  isAvailable: boolean;
  floor: number;
  amenities: string[];
  currentOccupants: number;
  building: string;
}

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockAccommodations: Accommodation[] = [
      {
        id: "1",
        roomNumber: "A101",
        type: "Single Room",
        capacity: 1,
        price: 8000,
        isAvailable: true,
        floor: 1,
        amenities: ["AC", "WiFi", "Attached Bathroom"],
        currentOccupants: 0,
        building: "Block A"
      },
      {
        id: "2",
        roomNumber: "B205",
        type: "Double Room",
        capacity: 2,
        price: 12000,
        isAvailable: false,
        floor: 2,
        amenities: ["AC", "WiFi", "Attached Bathroom", "Balcony"],
        currentOccupants: 2,
        building: "Block B"
      },
      {
        id: "3",
        roomNumber: "C301",
        type: "Triple Room",
        capacity: 3,
        price: 15000,
        isAvailable: true,
        floor: 3,
        amenities: ["AC", "WiFi", "Attached Bathroom", "Study Table"],
        currentOccupants: 0,
        building: "Block C"
      }
    ];

    setTimeout(() => {
      setAccommodations(mockAccommodations);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAccommodations = accommodations.filter((room) => {
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || room.type === typeFilter;
    const matchesAvailability = availabilityFilter === "all" || 
      (availabilityFilter === "available" && room.isAvailable) ||
      (availabilityFilter === "occupied" && !room.isAvailable);
    
    return matchesSearch && matchesType && matchesAvailability;
  });

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Single Room': return 'bg-blue-100 text-blue-800';
      case 'Double Room': return 'bg-green-100 text-green-800';
      case 'Triple Room': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accommodations Management</h1>
          <p className="text-gray-600 mt-1">Manage rooms, availability, and bookings</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
          + Add New Room
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by room number or building..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Single Room">Single Room</option>
            <option value="Double Room">Double Room</option>
            <option value="Triple Room">Triple Room</option>
          </select>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccommodations.map((room) => (
          <div key={room.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Room {room.roomNumber}</h3>
                  <p className="text-sm text-gray-600 mb-1">{room.building} • Floor {room.floor}</p>
                </div>
                <div className={`w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2`}>
                  {room.roomNumber[0]}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Price:</span>
                  <span className="font-semibold text-gray-900">₹{room.price}/month</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Capacity:</span>
                  <span className="text-gray-900">{room.capacity} persons</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Occupancy:</span>
                  <span className="text-gray-900">{room.currentOccupants}/{room.capacity}</span>
                </div>
              </div>

              {/* Occupancy Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Occupancy</span>
                  <span>{getOccupancyPercentage(room.currentOccupants, room.capacity)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getOccupancyPercentage(room.currentOccupants, room.capacity) === 0 
                        ? 'bg-green-500' 
                        : getOccupancyPercentage(room.currentOccupants, room.capacity) === 100 
                        ? 'bg-red-500' 
                        : 'bg-yellow-500'
                    }`}
                    style={{ width: `${getOccupancyPercentage(room.currentOccupants, room.capacity)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(room.type)}`}>
                  {room.type}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${room.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {room.isAvailable ? 'Available' : 'Occupied'}
                </span>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-600 mb-1">Amenities:</p>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.map((amenity, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {amenity}
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

      {filteredAccommodations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No rooms found matching your criteria.</p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{accommodations.length}</p>
            <p className="text-sm text-gray-600">Total Rooms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{accommodations.filter(r => r.isAvailable).length}</p>
            <p className="text-sm text-gray-600">Available Rooms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{accommodations.filter(r => r.type === 'Single Room').length}</p>
            <p className="text-sm text-gray-600">Single Rooms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{accommodations.filter(r => r.type === 'Double Room').length}</p>
            <p className="text-sm text-gray-600">Double Rooms</p>
          </div>
        </div>
      </div>
    </div>
  );
} 