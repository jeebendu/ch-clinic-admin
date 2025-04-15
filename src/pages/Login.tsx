
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/use-tenant";
import { getTenantFileUrl } from "@/utils/tenantUtils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuthService from "@/services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tenant } = useTenant();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userData = await AuthService.login(username, password);
      
      // Show success toast
      toast({
        title: "Login successful",
        description: `Welcome ${userData.name}`,
      });
      
      // Redirect to admin dashboard
      navigate("/admin");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotLoading(true);
    setError("");

    try {
      await AuthService.forgotPassword(forgotEmail);
      
      // Always show success message regardless of actual result for security
      setForgotEmailSent(true);
      toast({
        title: "Email sent",
        description: "If this email is registered in our system, you'll receive instructions to reset your password.",
      });
    } catch (err: any) {
      console.error("Forgot password error:", err);
      // For security reasons, we don't reveal if the email exists or not
      setForgotEmailSent(true);
      toast({
        title: "Email sent",
        description: "If this email is registered in our system, you'll receive instructions to reset your password.",
      });
    } finally {
      setIsForgotLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setForgotEmail("");
    setForgotEmailSent(false);
    setForgotPasswordOpen(false);
  };

  // Get logo URL
  const logoUrl = tenant?.logo ? getTenantFileUrl(tenant.logo, 'logo') : '';
  const bannerUrl = tenant?.bannerHome ? getTenantFileUrl(tenant.bannerHome, 'banner') : '';

  return (
    <div className="min-h-screen flex flex-row">
      {/* Banner Section - Left 50% */}
      <div className="hidden md:block md:w-1/2 bg-brand-light">
        {bannerUrl ? (
          <div 
            className="w-full h-full bg-cover bg-center flex items-center justify-center" 
            style={{ backgroundImage: `url(${bannerUrl})` }}
          >
            <div className="bg-black/30 p-8 rounded-lg backdrop-blur-sm">
              <h1 className="text-4xl font-bold text-white mb-4">{tenant?.title || 'Clinic Management System'}</h1>
              <p className="text-white text-xl">Your health, our priority</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-4xl font-bold mb-4">{tenant?.title || 'Clinic Management System'}</h1>
              <p className="text-xl">Your health, our priority</p>
            </div>
          </div>
        )}
      </div>

      {/* Login Form - Right 50% */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {logoUrl ? (
              <div className="flex justify-center mb-4">
                <img 
                  src={logoUrl} 
                  alt={tenant?.title || 'Clinic Logo'} 
                  className="h-20 w-auto"
                />
              </div>
            ) : null}
            <h1 className="text-3xl font-bold text-brand-dark">{tenant?.title || 'Clinic Management System'}</h1>
            <p className="text-gray-600 mt-2">Access your clinic dashboard</p>
          </div>

          <Card className="w-full shadow-lg border-brand-light">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-50 p-3 rounded-md flex items-center gap-2 text-red-800 text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              
                <Button 
                  type="submit" 
                  className="w-full bg-brand-primary hover:bg-brand-secondary"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-gray-500 text-center w-full">
                <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                  <DialogTrigger asChild>
                    <span className="hover:text-brand-primary cursor-pointer">Forgot password?</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Reset your password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    {!forgotEmailSent ? (
                      <form onSubmit={handleForgotPassword} className="space-y-4 py-4">
                        <div className="space-y-2">
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="Email address"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            className="w-full bg-brand-primary hover:bg-brand-secondary"
                            disabled={isForgotLoading}
                          >
                            {isForgotLoading ? "Sending..." : "Send reset link"}
                          </Button>
                        </DialogFooter>
                      </form>
                    ) : (
                      <div className="py-6 text-center space-y-4">
                        <div className="flex justify-center">
                          <div className="rounded-full bg-green-100 p-3">
                            <Mail className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          If this email is registered in our system, you'll receive instructions to reset your password.
                        </p>
                        <Button 
                          variant="outline"
                          onClick={resetForgotPassword}
                          className="mt-4"
                        >
                          Close
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-xs text-gray-400 text-center w-full">
                Demo access: jeebendu / password
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
