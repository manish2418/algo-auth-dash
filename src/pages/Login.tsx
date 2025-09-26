import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Phone, TrendingUp, Lock, Loader2 } from "lucide-react";
import tradingBg from "@/assets/trading-bg.jpg";
import { apiService } from "@/lib/api";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to format mobile number
  const formatMobileNumber = (mobile: string): string => {
    // Remove any non-digit characters
    const cleaned = mobile.replace(/\D/g, '');
    
    // If it starts with 91, keep it as is
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    }
    
    // If it's 10 digits, assume it's Indian number and add +91
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // If it already has +, return as is
    if (mobile.startsWith('+')) {
      return mobile;
    }
    
    // Default: add +91 for Indian numbers
    return `+91${cleaned}`;
  };

  const handleLogin = async () => {
    // Validation
    if (!mobile) {
      toast({
        title: "Required Field",
        description: "Please enter your mobile number",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Required Field", 
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }

    // Format mobile number for API
    const formattedMobile = formatMobileNumber(mobile);
    console.log('Original mobile:', mobile);
    console.log('Formatted mobile:', formattedMobile);

    if (formattedMobile.length < 10) {
      toast({
        title: "Invalid Mobile",
        description: "Please enter a valid mobile number",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Generate view token with mobile and password
      const viewTokenResponse = await apiService.generateViewToken({
        mobileNumber: formattedMobile,
        password: password,
      });

      console.log('View Token Response:', viewTokenResponse);

      if (!viewTokenResponse.success) {
        // Parse error message for better user feedback
        let errorMessage = viewTokenResponse.error || "Failed to authenticate";
        
        // Check for specific error messages
        if (errorMessage.includes("User not found")) {
          errorMessage = "No account found with this mobile number. Please check your number or contact support.";
        } else if (errorMessage.includes("mobile number should start with")) {
          errorMessage = "Please enter a valid mobile number with country code (e.g., +91XXXXXXXXXX)";
        } else if (errorMessage.includes("Validation Errors")) {
          errorMessage = "Please check your mobile number format";
        }

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Debug: Log the full response data
      console.log('Response data:', viewTokenResponse.data);
      console.log('Token from response:', viewTokenResponse.data?.data?.token);

      // Extract token from response - FIXED: removed extra .data
      const token = viewTokenResponse.data?.data?.token;
      if (!token) {
        console.error('No token found in response:', viewTokenResponse.data);
        toast({
          title: "Login Failed",
          description: "No token received from server",
          variant: "destructive",
        });
        return;
      }

      console.log('Token extracted successfully:', token);

      // Store login data for OTP step
      localStorage.setItem('loginMethod', 'mobile');
      localStorage.setItem('loginValue', formattedMobile);
      localStorage.setItem('viewTokenData', JSON.stringify(viewTokenResponse.data));
      localStorage.setItem('jwtToken', token);

      // Step 2: Generate OTP using the JWT token
      const otpResponse = await apiService.generateOtpFromToken();

      console.log('OTP Response:', otpResponse);

      if (!otpResponse.success) {
        toast({
          title: "OTP Generation Failed",
          description: otpResponse.error || "Failed to send OTP",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "OTP Sent",
        description: "Verification code sent to your mobile number",
      });

      // Navigate to OTP verification page
      navigate('/otp');

    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${tradingBg})` 
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TradePro
          </h1>
          <p className="text-muted-foreground mt-2">
            Professional Trading Platform
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your trading dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number (e.g., 9876543210)"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="pl-10 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your 10-digit mobile number (we'll add +91 automatically)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleLogin} 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Login & Send OTP"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Protected by advanced security measures
        </div>
      </div>
    </div>
  );
};

export default Login;
