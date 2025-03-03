import { useState, memo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff, Lock, Mail, Check, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const PasswordRequirement = ({ meets, label }: { meets: boolean; label: string }) => (
  <div className="flex items-center gap-2 text-sm">
    {meets ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    )}
    <span className={meets ? "text-green-500" : "text-red-500"}>{label}</span>
  </div>
);

const AuthForm = memo(({ 
  isLogin, 
  email, 
  setEmail, 
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  onSubmit,
  termsAccepted,
  setTermsAccepted,
  privacyAccepted,
  setPrivacyAccepted
}: {
  isLogin: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
  privacyAccepted: boolean;
  setPrivacyAccepted: (value: boolean) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const hasMinLength = password.length >= 8;

  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 transition-all duration-300 focus:scale-[1.02]"
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 pr-10 transition-all duration-300 focus:scale-[1.02]"
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

        {!isLogin && (
          <>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-10 pr-10 transition-all duration-300 focus:scale-[1.02]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>

            <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-sm">Password Requirements:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <PasswordRequirement meets={hasMinLength} label="At least 8 characters" />
                <PasswordRequirement meets={hasUppercase} label="One uppercase letter" />
                <PasswordRequirement meets={hasLowercase} label="One lowercase letter" />
                <PasswordRequirement meets={hasNumber} label="One number" />
                <PasswordRequirement meets={hasSpecialChar} label="One special character" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  required
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                  required
                />
                <label htmlFor="privacy" className="text-sm">
                  I agree to the <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full animate-scale transition-transform hover:scale-105" 
        disabled={loading || (!isLogin && (!termsAccepted || !privacyAccepted || password !== confirmPassword))}
      >
        {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
      </Button>
    </form>
  );
});

AuthForm.displayName = 'AuthForm';

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

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [showAuthError, setShowAuthError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  useEffect(() => {
    const hasAuthError = localStorage.getItem('auth_error');
    if (hasAuthError) {
      setShowAuthError(true);
      localStorage.removeItem('auth_error');
    }
  }, []);

  const authMutation = useMutation({
    mutationFn: async () => {
      if (isLogin) {
        try {
          console.log("Attempting to log in with:", email);
          await login(email, password);
          return true;
        } catch (error) {
          console.error("Login error:", error);
          toast({
            title: "Login failed",
            description: error instanceof Error ? error.message : "Failed to login. Please check your credentials.",
            variant: "destructive",
          });
          return false;
        }
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await register(email, password);
        setIsLogin(true);
        setShowEmailAlert(true);
        return true;
      }
    },
    onSuccess: (result) => {
      if (isLogin && result) {
        navigate("/");
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAuthError(false);
    authMutation.mutate();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 pt-16 md:pt-4">
      <CubeBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 glass-card rounded-lg p-6"
      >
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold">{isLogin ? "Welcome back" : "Create account"}</h2>
          <p className="text-muted-foreground mt-2">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Enter your details to create your account"}
          </p>
        </div>

        {showEmailAlert && (
          <Alert 
            variant="default" 
            className="border-primary bg-primary/10 animate-fade-in"
          >
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              Please check your email to verify your account before logging in.
            </AlertDescription>
          </Alert>
        )}

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

        <AuthForm 
          isLogin={isLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          loading={authMutation.isPending}
          onSubmit={handleSubmit}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          privacyAccepted={privacyAccepted}
          setPrivacyAccepted={setPrivacyAccepted}
        />

        <div className="text-center animate-fade-in">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setShowEmailAlert(false);
              setShowAuthError(false);
            }}
            className="text-primary hover:underline transition-all duration-300"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
