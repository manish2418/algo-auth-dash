import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPInput } from "@/components/ui/otp-input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, Timer } from "lucide-react";
import tradingBg from "@/assets/trading-bg.jpg";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const loginMethod = localStorage.getItem('loginMethod');
  const loginValue = localStorage.getItem('loginValue');

  useEffect(() => {
    if (!loginMethod || !loginValue) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loginMethod, loginValue, navigate]);

  const handleVerifyOTP = () => {
    if (otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 4-digit code",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, accept any 4-digit code
    // In real app, this would validate against the server
    if (otp === "1234" || otp.length === 4) {
      toast({
        title: "Verification Successful",
        description: "Welcome to TradePro!",
      });
      
      // Clear stored login data
      localStorage.removeItem('loginMethod');
      localStorage.removeItem('loginValue');
      
      navigate('/dashboard');
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check your code and try again",
        variant: "destructive",
      });
    }
  };

  const handleResendOTP = () => {
    setTimeLeft(30);
    setCanResend(false);
    setOtp("");
    
    toast({
      title: "OTP Resent",
      description: `New verification code sent to your ${loginMethod}`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskValue = (value: string, type: string) => {
    if (type === 'email') {
      const [name, domain] = value.split('@');
      return `${name.slice(0, 2)}***@${domain}`;
    } else {
      return `***-***-${value.slice(-4)}`;
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
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Timer className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
            <CardDescription>
              We've sent a 4-digit code to {maskValue(loginValue || '', loginMethod || '')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <OTPInput
                value={otp}
                onChange={setOtp}
                length={4}
                className="justify-center"
              />
              
              <div className="text-center">
                {!canResend ? (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Resend code in {formatTime(timeLeft)}
                  </p>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleResendOTP}
                    className="text-primary hover:text-primary/80"
                  >
                    Resend OTP
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleVerifyOTP}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={otp.length !== 4}
              >
                Verify & Continue
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          For demo: use any 4-digit code or "1234"
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;