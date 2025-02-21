
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, LogOut, User, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">NFTify</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="text-foreground/80 hover:text-primary transition-colors">
              Explore
            </Link>
            <Link to="/create" className="text-foreground/80 hover:text-primary transition-colors">
              Create
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">{user?.email}</span>
                <Button variant="outline" onClick={() => navigate("/profile")} className="flex items-center space-x-2">
                  <User size={18} />
                  <span>Profile</span>
                </Button>
                <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => navigate("/auth")} className="flex items-center space-x-2">
                <User size={18} />
                <span>Sign In</span>
              </Button>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fadeIn">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/explore"
              className="block text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/create"
              className="block text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Create
            </Link>
            {isAuthenticated ? (
              <>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/auth");
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2"
              >
                <User size={18} />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
