
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff, Lock, Mail, Check, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormErrorMessage } from "@/components/ui/form-error-message";

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

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({ email: "", password: "", confirmPassword: "" });

  // Password validation criteria
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const hasMinLength = password.length >= 8;
  const passwordsMatch = password === confirmPassword;

  const meetsAllRequirements = 
    hasUppercase && 
    hasLowercase && 
    hasNumber && 
    hasSpecialChar && 
    hasMinLength && 
    passwordsMatch &&
    termsAccepted &&
    privacyAccepted;

  const registerMutation = useMutation({
    mutationFn: async () => {
      // Validate inputs
      const errors = { email: "", password: "", confirmPassword: "" };
      
      if (!email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Please enter a valid email";
      }
      
      if (!password) {
        errors.password = "Password is required";
      } else if (!meetsAllRequirements) {
        errors.password = "Password doesn't meet all requirements";
      }
      
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      
      if (errors.email || errors.password || errors.confirmPassword) {
        setValidationErrors(errors);
        return false;
      }
      
      setValidationErrors({ email: "", password: "", confirmPassword: "" });
      
      try {
        await register(email, password);
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account before logging in.",
        });
        setShowEmailAlert(true);
        return true;
      } catch (error) {
        toast({
          title: "Registration failed",
          description: error instanceof Error ? error.message : "Failed to register. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    },
    onSuccess: (result) => {
      if (result) {
        // Redirect to login after a brief delay to show the success message
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  const handlePasswordSuggestion = () => {
    // Generate a strong password suggestion
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let suggestedPassword = "";
    
    // Ensure at least one uppercase
    suggestedPassword += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
    
    // Ensure at least one lowercase
    suggestedPassword += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
    
    // Ensure at least one number
    suggestedPassword += "0123456789".charAt(Math.floor(Math.random() * 10));
    
    // Ensure at least one special character
    suggestedPassword += "!@#$%^&*".charAt(Math.floor(Math.random() * 8));
    
    // Fill the rest randomly
    for (let i = 0; i < 8; i++) {
      suggestedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Shuffle the password
    suggestedPassword = suggestedPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    setPassword(suggestedPassword);
    setConfirmPassword(suggestedPassword);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 pt-16 md:pt-4">
      <CubeBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mb-12"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail 
                    className={`absolute left-3 top-2.5 h-5 w-5 ${
                      focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'
                    } transition-colors duration-200`}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 transition-all duration-300 focus:scale-[1.02]"
                    autoComplete="email"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                {validationErrors.email && <FormErrorMessage message={validationErrors.email} />}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock 
                    className={`absolute left-3 top-2.5 h-5 w-5 ${
                      focusedField === 'password' ? 'text-primary' : 'text-muted-foreground'
                    } transition-colors duration-200`}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 transition-all duration-300 focus:scale-[1.02]"
                    autoComplete="new-password"
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-2.5 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password && <FormErrorMessage message={validationErrors.password} />}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock 
                    className={`absolute left-3 top-2.5 h-5 w-5 ${
                      focusedField === 'confirmPassword' ? 'text-primary' : 'text-muted-foreground'
                    } transition-colors duration-200`}
                  />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 transition-all duration-300 focus:scale-[1.02]"
                    autoComplete="new-password"
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-2.5 transition-colors duration-200 ${
                      focusedField === 'confirmPassword' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && <FormErrorMessage message={validationErrors.confirmPassword} />}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-1"
                  onClick={handlePasswordSuggestion}
                >
                  Generate Strong Password
                </Button>
              </div>

              <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium text-sm">Password Requirements:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <PasswordRequirement meets={hasMinLength} label="At least 8 characters" />
                  <PasswordRequirement meets={hasUppercase} label="One uppercase letter" />
                  <PasswordRequirement meets={hasLowercase} label="One lowercase letter" />
                  <PasswordRequirement meets={hasNumber} label="One number" />
                  <PasswordRequirement meets={hasSpecialChar} label="One special character" />
                  <PasswordRequirement meets={passwordsMatch} label="Passwords match" />
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

              <Button 
                type="submit" 
                className="w-full animate-scale transition-transform hover:scale-105" 
                disabled={registerMutation.isPending || !meetsAllRequirements}
              >
                {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center w-full">
              <Link to="/login" className="text-primary hover:underline transition-all duration-300">
                Already have an account? Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
