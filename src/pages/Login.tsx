
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthWithToast } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormErrorMessage } from "@/components/ui/form-error-message";

const CubeBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-primary/20 rounded-lg"
          style={{
            width: `${(i + 1) * 200}px`,
            height: `${(i + 1) * 200}px`,
            left: `-${((i + 1) * 200) / 2}px`,
            top: `-${((i + 1) * 200) / 2}px`,
          }}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  </div>
);

// Sample login credentials for demonstration
const sampleCredentials = [
  { email: "user@example.com", password: "Password123!" },
  { email: "demo@example.com", password: "Demo2023$" },
  { email: "test@example.com", password: "Test1234#" }
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToast } = useAuthWithToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAuthError, setShowAuthError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({ email: "", password: "" });

  // Get the "from" location if available or default to homepage
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    const hasAuthError = localStorage.getItem('auth_error');
    if (hasAuthError) {
      setShowAuthError(true);
      localStorage.removeItem('auth_error');
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async () => {
      // Validate inputs
      const errors = { email: "", password: "" };
      
      if (!email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Please enter a valid email";
      }
      
      if (!password) {
        errors.password = "Password is required";
      }
      
      if (errors.email || errors.password) {
        setValidationErrors(errors);
        return false;
      }
      
      setValidationErrors({ email: "", password: "" });
      return await loginWithToast(email, password);
    },
    onSuccess: (result) => {
      if (result) {
        // Navigate to the page user was trying to access or homepage
        navigate(from);
      }
    }
  });

  const handleSampleCredentials = (credentials: { email: string, password: string }) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAuthError(false);
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 pt-16 md:pt-4">
      <CubeBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAuthError && (
              <Alert 
                variant="default" 
                className="border-primary bg-primary/10 animate-fade-in"
              >
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">
                  Please sign in again to continue.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 transition-all duration-300 focus:scale-[1.02]"
                    autoComplete="email"
                  />
                </div>
                {validationErrors.email && <FormErrorMessage message={validationErrors.email} />}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 transition-all duration-300 focus:scale-[1.02]"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {validationErrors.password && <FormErrorMessage message={validationErrors.password} />}
              </div>

              <Button 
                type="submit" 
                className="w-full animate-scale transition-transform hover:scale-105" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or try with sample credentials</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {sampleCredentials.map((cred, index) => (
                <Button
                  key={index}
                  variant="outline"
                  type="button"
                  className="text-xs"
                  onClick={() => handleSampleCredentials(cred)}
                >
                  {cred.email}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center w-full">
              <Link to="/register" className="text-primary hover:underline transition-all duration-300">
                Need an account? Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
