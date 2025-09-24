import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, TrendingUp } from "lucide-react";
import tradingBg from "@/assets/trading-bg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleLogin = (type: 'email' | 'mobile') => {
    const value = type === 'email' ? email : mobile;
    
    if (!value) {
      toast({
        title: "Required Field",
        description: `Please enter your ${type}`,
        variant: "destructive",
      });
      return;
    }

    // Simple validation
    if (type === 'email' && !value.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (type === 'mobile' && value.length < 10) {
      toast({
        title: "Invalid Mobile",
        description: "Please enter a valid mobile number",
        variant: "destructive",
      });
      return;
    }

    // Store login method for OTP verification
    localStorage.setItem('loginMethod', type);
    localStorage.setItem('loginValue', value);

    toast({
      title: "OTP Sent",
      description: `Verification code sent to your ${type}`,
    });

    navigate('/otp');
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
            <Tabs defaultValue="mobile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mobile" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Mobile
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="mobile" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="transition-all duration-200"
                  />
                </div>
                <Button 
                  onClick={() => handleLogin('mobile')} 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Send OTP
                </Button>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition-all duration-200"
                  />
                </div>
                <Button 
                  onClick={() => handleLogin('email')} 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Send OTP
                </Button>
              </TabsContent>
            </Tabs>
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