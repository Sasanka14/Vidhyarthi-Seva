// User Types
export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

// Course Types
export interface CourseView {
  type: string; // e.g., 'live', 'gd 1.2', 'pd 3'
  count: number;
}

export interface CoursePrice {
  type: string; // e.g., 'live', 'gd 1.2', 'pd 3'
  amount: number;
}

export interface CourseAccessOption {
  type: string;
  price: number;
  views: number;
  validity: string;
}

export interface Course {
  _id: string
  title: string
  description?: string
  lectures?: number
  hours?: number
  timings?: string
  batchStartDate?: string
  batchRecording?: {
    preRecorded?: string
    newRecording?: string
  }
  booksIncluded?: string[]
  accessOptions: CourseAccessOption[]
  platforms?: string[]
  doubtSolvingPlatform?: string
  syllabusType?: string
  videoLanguage?: string
  systemRequirements?: {
    supported?: string[]
    notSupported?: string[]
  }
  faculty?: {
    name?: string
    bio?: string
    experience?: string
    style?: string
    image?: string
  }
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

// Meal Types
export interface Meal {
  _id: string
  name: string
  description: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  price: number
  calories: number
  dietaryInfo: {
    vegetarian: boolean
    vegan: boolean
    glutenFree: boolean
    dairyFree: boolean
  }
  ingredients: string[]
  image?: string
  isAvailable: boolean
  preparationTime: number // in minutes
  createdAt: string
  updatedAt: string
}

// Accommodation Types
export interface Accommodation {
  _id: string
  name: string
  type: 'single' | 'double' | 'triple' | 'dormitory'
  description: string
  price: number
  capacity: number
  available: number
  amenities: string[]
  images: string[]
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  contactPerson: {
    name: string
    phone: string
    email: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Mentor Types
export interface Mentor {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string[]
  experience: number // in years
  education: string
  bio: string
  profilePicture?: string
  hourlyRate: number
  availability: {
    monday: { start: string; end: string; available: boolean }
    tuesday: { start: string; end: string; available: boolean }
    wednesday: { start: string; end: string; available: boolean }
    thursday: { start: string; end: string; available: boolean }
    friday: { start: string; end: string; available: boolean }
    saturday: { start: string; end: string; available: boolean }
    sunday: { start: string; end: string; available: boolean }
  }
  rating: number
  totalSessions: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Test Series Types
export interface TestSeries {
  _id: string
  name: string
  description: string
  category: string
  totalTests: number
  duration: number // in minutes per test
  price: number
  syllabus: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  startDate?: string
  endDate?: string
  isActive: boolean
  enrolledStudents: number
  maxStudents?: number
  createdAt: string
  updatedAt: string
}

// Gym Types
export interface Gym {
  _id: string
  name: string
  description: string
  equipment: string[]
  capacity: number
  currentOccupancy: number
  openingHours: {
    monday: { open: string; close: string }
    tuesday: { open: string; close: string }
    wednesday: { open: string; close: string }
    thursday: { open: string; close: string }
    friday: { open: string; close: string }
    saturday: { open: string; close: string }
    sunday: { open: string; close: string }
  }
  membershipFee: number
  isActive: boolean
  images: string[]
  createdAt: string
  updatedAt: string
}

// Library Types
export interface Library {
  _id: string
  name: string
  description: string
  totalBooks: number
  availableBooks: number
  categories: string[]
  openingHours: {
    monday: { open: string; close: string }
    tuesday: { open: string; close: string }
    wednesday: { open: string; close: string }
    thursday: { open: string; close: string }
    friday: { open: string; close: string }
    saturday: { open: string; close: string }
    sunday: { open: string; close: string }
  }
  membershipFee: number
  isActive: boolean
  images: string[]
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  count?: number
  courses?: Course[]
  users?: User[]
}

export interface PaginatedResponse<T> {
  success: boolean
  count: number
  pagination: {
    next?: { page: number; limit: number }
    prev?: { page: number; limit: number }
  }
  total: number
  data: T[]
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: 'student' | 'admin' | 'mentor' | 'staff'
}

export interface PasswordResetForm {
  currentPassword: string
  newPassword: string
}

// Dashboard Stats Types
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  usersByRole: Array<{ _id: string; count: number }>
  recentRegistrations: User[]
  monthlyRegistrations: Array<{ _id: { year: number; month: number }; count: number }>
}

// Navigation Types
export interface NavItem {
  title: string
  href: string
  icon: string
  badge?: string
  children?: NavItem[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  user?: User
} 