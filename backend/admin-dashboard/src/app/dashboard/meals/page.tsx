"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Meal {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens: string[];
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dietaryFilter, setDietaryFilter] = useState("all");

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockMeals: Meal[] = [
      {
        id: "1",
        name: "Chicken Biryani",
        description: "Aromatic rice dish with tender chicken and spices",
        category: "Main Course",
        price: 120,
        isVegetarian: false,
        isAvailable: true,
        nutritionalInfo: {
          calories: 450,
          protein: 25,
          carbs: 65,
          fat: 12
        },
        allergens: ["Gluten", "Dairy"]
      },
      {
        id: "2",
        name: "Paneer Tikka",
        description: "Grilled cottage cheese with Indian spices",
        category: "Appetizer",
        price: 80,
        isVegetarian: true,
        isAvailable: true,
        nutritionalInfo: {
          calories: 280,
          protein: 18,
          carbs: 8,
          fat: 22
        },
        allergens: ["Dairy"]
      },
      {
        id: "3",
        name: "Dal Khichdi",
        description: "Comforting rice and lentil porridge",
        category: "Main Course",
        price: 60,
        isVegetarian: true,
        isAvailable: true,
        nutritionalInfo: {
          calories: 320,
          protein: 12,
          carbs: 55,
          fat: 6
        },
        allergens: []
      }
    ];

    setTimeout(() => {
      setMeals(mockMeals);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = 
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || meal.category === categoryFilter;
    const matchesDietary = dietaryFilter === "all" || 
      (dietaryFilter === "vegetarian" && meal.isVegetarian) ||
      (dietaryFilter === "non-vegetarian" && !meal.isVegetarian);
    
    return matchesSearch && matchesCategory && matchesDietary;
  });

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Appetizer': return 'bg-blue-100 text-blue-800';
      case 'Main Course': return 'bg-green-100 text-green-800';
      case 'Dessert': return 'bg-purple-100 text-purple-800';
      case 'Beverage': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Meals Management</h1>
          <p className="text-gray-600 mt-1">Manage meal plans, menus, and dietary information</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          + Add New Meal
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search meals by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Main Course">Main Course</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
          </select>
          <select
            value={dietaryFilter}
            onChange={(e) => setDietaryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Dietary</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
          </select>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <div key={meal.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{meal.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                </div>
                <div className={`w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2`}>
                  {meal.name[0]}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Price:</span>
                  <span className="font-semibold text-gray-900">₹{meal.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Calories:</span>
                  <span className="text-gray-900">{meal.nutritionalInfo.calories} kcal</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Protein:</span>
                  <span className="text-gray-900">{meal.nutritionalInfo.protein}g</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(meal.category)}`}>
                  {meal.category}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${meal.isVegetarian ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {meal.isVegetarian ? 'Vegetarian' : 'Non-Veg'}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${meal.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {meal.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              {meal.allergens.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-1">Allergens:</p>
                  <div className="flex flex-wrap gap-1">
                    {meal.allergens.map((allergen, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No meals found matching your criteria.</p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{meals.length}</p>
            <p className="text-sm text-gray-600">Total Meals</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{meals.filter(m => m.isAvailable).length}</p>
            <p className="text-sm text-gray-600">Available Meals</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{meals.filter(m => m.isVegetarian).length}</p>
            <p className="text-sm text-gray-600">Vegetarian</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{meals.filter(m => !m.isVegetarian).length}</p>
            <p className="text-sm text-gray-600">Non-Vegetarian</p>
          </div>
        </div>
      </div>
    </div>
  );
} 