
import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const AuthForm = memo(({ 
  isLogin, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  loading, 
  onSubmit 
}: {
  isLogin: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) => (
  <form onSubmit={onSubmit} className="space-y-6 animate-fade-in">
    <div className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="transition-all duration-300 focus:scale-[1.02]"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="transition-all duration-300 focus:scale-[1.02]"
      />
    </div>

    <Button 
      type="submit" 
      className="w-full animate-scale transition-transform hover:scale-105" 
      disabled={loading}
    >
      {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
    </Button>
  </form>
));

AuthForm.displayName = 'AuthForm';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailAlert, setShowEmailAlert] = useState(false);

  const authMutation = useMutation({
    mutationFn: async () => {
      if (isLogin) {
        await login(email, password);
        navigate("/");
      } else {
        await register(email, password);
        setIsLogin(true);
        setShowEmailAlert(true);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    authMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 glass-card rounded-lg p-6 animate-slide-up">
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

        <AuthForm 
          isLogin={isLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={authMutation.isPending}
          onSubmit={handleSubmit}
        />

        <div className="text-center animate-fade-in">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setShowEmailAlert(false);
            }}
            className="text-primary hover:underline transition-all duration-300"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
