import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ApiResponse, PaginatedResponse, User, LoginForm, RegisterForm, AuthResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Token management
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  // Authentication
  async login(credentials: LoginForm): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials)
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  async register(userData: RegisterForm): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData)
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.removeToken()
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/auth/me')
    return response.data
  }

  async updatePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.put('/auth/update-password', passwordData)
    return response.data
  }

  // User Management
  async getUsers(params?: {
    page?: number
    limit?: number
    role?: string
    search?: string
    isActive?: boolean
  }): Promise<PaginatedResponse<User>> {
    const response: AxiosResponse<PaginatedResponse<User>> = await this.api.get('/users', { params })
    return response.data
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get(`/users/${id}`)
    return response.data
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put(`/users/${id}`, userData)
    return response.data
  }

  async deleteUser(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.delete(`/users/${id}`)
    return response.data
  }

  async getUserStats(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/users/stats/overview')
    return response.data
  }

  async bulkUpdateUsers(userIds: string[], updates: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.put('/users/bulk-update', {
      userIds,
      updates,
    })
    return response.data
  }

  // Course Management
  async getCourses(params?: {
    page?: number
    limit?: number
    category?: string
    level?: string
    search?: string
  }): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get('/courses', { params })
    return response.data
  }

  async getCourse(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/courses/${id}`)
    return response.data
  }

  async createCourse(courseData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/courses', courseData)
    return response.data
  }

  async updateCourse(id: string, courseData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.put(`/courses/${id}`, courseData)
    return response.data
  }

  async deleteCourse(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.delete(`/courses/${id}`)
    return response.data
  }

  async uploadThumbnail(file: File): Promise<{ success: boolean; url?: string }> {
    const formData = new FormData();
    formData.append('thumbnail', file);
    const response = await this.api.post('/courses/upload-thumbnail', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // Meal Management
  async getMeals(params?: {
    page?: number
    limit?: number
    type?: string
    search?: string
  }): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get('/meals', { params })
    return response.data
  }

  async getMeal(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/meals/${id}`)
    return response.data
  }

  async createMeal(mealData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/meals', mealData)
    return response.data
  }

  async updateMeal(id: string, mealData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.put(`/meals/${id}`, mealData)
    return response.data
  }

  async deleteMeal(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.delete(`/meals/${id}`)
    return response.data
  }

  // Accommodation Management
  async getAccommodations(params?: {
    page?: number
    limit?: number
    type?: string
    search?: string
  }): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get('/accommodations', { params })
    return response.data
  }

  async getAccommodation(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/accommodations/${id}`)
    return response.data
  }

  async createAccommodation(accommodationData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/accommodations', accommodationData)
    return response.data
  }

  async updateAccommodation(id: string, accommodationData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.put(`/accommodations/${id}`, accommodationData)
    return response.data
  }

  async deleteAccommodation(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.delete(`/accommodations/${id}`)
    return response.data
  }

  // Mentor Management
  async getMentors(params?: {
    page?: number
    limit?: number
    specialization?: string
    search?: string
  }): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get('/mentors', { params })
    return response.data
  }

  async getMentor(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/mentors/${id}`)
    return response.data
  }

  async createMentor(mentorData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/mentors', mentorData)
    return response.data
  }

  async updateMentor(id: string, mentorData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.put(`/mentors/${id}`, mentorData)
    return response.data
  }

  async deleteMentor(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.delete(`/mentors/${id}`)
    return response.data
  }

  // Test Series Management
  async getTestSeries(params?: {
    page?: number
    limit?: number
    category?: string
    difficulty?: string
    search?: string
  }): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get('/test-series', { params })
    return response.data
  }

  async getTestSeriesItem(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/test-series/${id}`)
    return response.data
  }

  async createTestSeries(testSeriesData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/test-series', testSeriesData)
    return response.data
  }

  async updateTestSeries(id: string, testSeriesData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.put(`/test-series/${id}`, testSeriesData)
    return response.data
  }

  async deleteTestSeries(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.delete(`/test-series/${id}`)
    return response.data
  }

  // Gym Management
  async getGyms(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get('/gym', { params })
    return response.data
  }

  async getGym(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/gym/${id}`)
    return response.data
  }

  async createGym(gymData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/gym', gymData)
    return response.data
  }

  async updateGym(id: string, gymData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.put(`/gym/${id}`, gymData)
    return response.data
  }

  async deleteGym(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.delete(`/gym/${id}`)
    return response.data
  }

  // Library Management
  async getLibraries(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get('/library', { params })
    return response.data
  }

  async getLibrary(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/library/${id}`)
    return response.data
  }

  async createLibrary(libraryData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/library', libraryData)
    return response.data
  }

  async updateLibrary(id: string, libraryData: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.put(`/library/${id}`, libraryData)
    return response.data
  }

  async deleteLibrary(id: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.delete(`/library/${id}`)
    return response.data
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/health')
    return response.data
  }
}

export const apiService = new ApiService()
export default apiService 