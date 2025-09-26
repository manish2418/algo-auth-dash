import { jwtDecode } from 'jwt-decode';

// API Base URL - adjust this to match your backend server
const API_BASE_URL = 'http://localhost:8000';

// JWT Token interface
interface JwtPayload {
  sub: string; // This is the userId we need
  exp: number;
  iat: number;
  iss: string;
  ucc: string;
  [key: string]: any;
}

// API Response Types
export interface LoginRequest {
  mobileNumber?: string;
  pan?: string;
  password: string;
}

export interface GenerateOtpRequest {
  userId: string;
  sendEmail?: boolean;
  isWhitelisted?: boolean;
}

export interface ValidateOtpRequest {
  // userId: string;
  otp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// API Service Class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Helper function to decode JWT token and extract userId
  decodeJwtToken(token: string): string | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.sub; // This is the userId
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  // Step 1: Generate view token (initial login)
  async generateViewToken(loginData: LoginRequest): Promise<ApiResponse> {
    return this.makeRequest('/login/view-token', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  // Step 2: Generate OTP using userId from JWT token
  async generateOtpFromToken(): Promise<ApiResponse> {
    // const userId = this.decodeJwtToken();
    
    // if (!userId) {
    //   return {
    //     success: false,
    //     error: 'Failed to decode JWT token to extract userId',
    //   };
    // }

    return this.generateOtp();
  }

  // Step 2: Generate OTP (direct method)
  async generateOtp(): Promise<ApiResponse> {
    return this.makeRequest('/login/otp/generate', {
      method: 'POST',
      // body: JSON.stringify(),
    });
  }

  // Step 3: Validate OTP and complete login
  async validateOtp(validateData: ValidateOtpRequest): Promise<ApiResponse> {
    return this.makeRequest('/login/validate', {
      method: 'POST',
      body: JSON.stringify(validateData),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest('/health');
  }

  // Get funds
  async getFunds(): Promise<ApiResponse> {
    return this.makeRequest('/funds');
  }

  // Get user limits
  async getUserLimits(params?: {
    seg?: string;
    exch?: string;
    prod?: string;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams(params);
    return this.makeRequest(`/user/limits?${searchParams}`);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 
