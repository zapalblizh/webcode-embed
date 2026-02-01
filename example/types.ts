/**
 * Type definitions for the User Dashboard application
 */

export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  avatar?: string;
  role?: UserRole;
}

export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: keyof User;
  order?: 'asc' | 'desc';
}

export interface UserFilters {
  active?: boolean;
  role?: UserRole;
  search?: string;
}
