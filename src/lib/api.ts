// API Base URL - adjust this to match your backend server
const API_BASE_URL = "http://localhost:8001";

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
  otp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface LogTradeRequest {
  message: string;
}
export interface OrderPayload {
  am: string; // AMO
  dq: string; // Disclosed Quantity
  es: string; // Exchange Segment
  mp: string; // Market Protection
  pc: string; // Product Code
  pf: string; // Price Freeze
  pr: string; // Price
  pt: string; // Price Type (L, MKT, etc)
  qt: string; // Quantity
  rt: string; // Retention Type (DAY, IOC, etc)
  tp: string; // Trigger Price
  ts: string; // Trading Symbol
  tt: string; // Transaction Type (B/S)
  [key: string]: any;
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
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error:
            data.detail || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("API request error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Network error occurred",
      };
    }
  }

  // Step 1: Generate view token (initial login)
  async generateViewToken(loginData: LoginRequest): Promise<ApiResponse> {
    return this.makeRequest("/login/view-token", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  }

  // Step 2: Generate OTP using userId from JWT token
  async generateOtpFromToken(): Promise<ApiResponse> {
    return this.generateOtp();
  }

  // Step 2: Generate OTP (direct method)
  async generateOtp(): Promise<ApiResponse> {
    return this.makeRequest("/login/otp/generate", {
      method: "POST",
    });
  }

  // Step 3: Validate OTP and complete login
  async validateOtp(validateData: ValidateOtpRequest): Promise<ApiResponse> {
    return this.makeRequest("/login/validate", {
      method: "POST",
      body: JSON.stringify(validateData),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest("/health");
  }

  // Get funds
  async getFunds(): Promise<ApiResponse> {
    return this.makeRequest("/check-funds", {
      method: "POST",
    });
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

  async placeOrder(orderData: OrderPayload): Promise<ApiResponse> {
    return this.makeRequest("/orders/normal", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  // Get Watchlist data according to user.
  async getUserWatchList(user_id, watchlist_id): Promise<ApiResponse> {
    return this.makeRequest(`/watchlists/${user_id}/${watchlist_id}`, {
      method: "GET",
    });
  }
  async getStockData(search: string): Promise<ApiResponse> {
    return this.makeRequest(
      `/get_stock_data?search=${encodeURIComponent(search)}`,
      {
        method: "GET",
      }
    );
  }
  async addStocksToWatchlist(data: {
    user_id: string;
    watchlist_id: string;
    stocks: {
      symbol: string;
      name: string;
      tok: string;
      exSeg: string;
    }[];
  }): Promise<ApiResponse> {
    return this.makeRequest("/watchlists/add-stocks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async logTrade(data: LogTradeRequest): Promise<ApiResponse> {
    return this.makeRequest("/logTrade", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
