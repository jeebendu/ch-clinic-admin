
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTenant } from "@/hooks/use-tenant";
import { getTenantFileUrl } from "@/utils/tenantUtils";
import http from "@/lib/JwtInterceptor";
import { User } from "@/admin/modules/user/types/User";
import { EncryptionService } from "@/utils/encryptionService";
import { getEnvVariable } from "@/utils/envUtils";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tenant, isLoading: isTenantLoading } = useTenant();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Encrypt the password
      const encryptedPassword = EncryptionService.encrypt(password);
      
      // Set tenant header
      const defaultTenant = getEnvVariable('DEFAULT_TENANT');
      const headers = {
        tenant: defaultTenant || 'demo'
      };

      const response = await http.post('/api/v1/auth/signin', 
        {
          username,
          password: encryptedPassword
        },
        { headers }
      );
      
      const userData = response.data as User;
      
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('auth_token', userData.token);
      
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
                <span className="hover:text-brand-primary cursor-pointer">Forgot password?</span>
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
