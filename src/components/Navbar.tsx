
import { useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, LogOut, User, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";

const NavLink = memo(({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    to={to}
    className="relative px-4 py-2 group"
    onClick={onClick}
  >
    <span className="relative z-10 text-foreground/80 group-hover:text-primary transition-colors duration-300">
      {children}
    </span>
    <div className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg" />
  </Link>
));

NavLink.displayName = 'NavLink';

const NavButton = memo(({ onClick, icon: Icon, children }: { 
  onClick: () => void; 
  icon: typeof User; 
  children: React.ReactNode 
}) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className="relative px-4 py-2 h-auto group hover:bg-transparent"
  >
    <div className="flex items-center gap-2 relative z-10">
      <Icon size={18} className="text-foreground/80 group-hover:text-primary transition-colors duration-300" />
      <span className="text-foreground/80 group-hover:text-primary transition-colors duration-300">{children}</span>
    </div>
    <div className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg" />
  </Button>
));

NavButton.displayName = 'NavButton';

export const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="hidden md:flex items-center space-x-4 animate-fade-in">
            <div className="bg-secondary/20 rounded-xl p-1 backdrop-blur-sm">
              <div className="flex items-center space-x-1">
                <NavLink to="/explore">Explore</NavLink>
                <NavLink to="/create">Create</NavLink>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="bg-secondary/20 rounded-xl p-1 backdrop-blur-sm">
                  <div className="flex items-center space-x-1">
                    <NavButton onClick={() => navigate("/profile")} icon={User}>Profile</NavButton>
                    <NavButton onClick={handleLogout} icon={LogOut}>Logout</NavButton>
                  </div>
                </div>
              </div>
            ) : (
              <NavButton
                onClick={() => navigate("/auth")}
                icon={User}
              >
                Sign In
              </NavButton>
            )}
          </div>

          <button 
            className="md:hidden relative w-10 h-10 flex items-center justify-center" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative z-10">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
            <div className="absolute inset-0 bg-secondary/20 rounded-lg transition-transform duration-300 hover:scale-110" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border animate-slideUp">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="space-y-2">
              <NavLink to="/explore" onClick={() => setIsOpen(false)}>Explore</NavLink>
              <NavLink to="/create" onClick={() => setIsOpen(false)}>Create</NavLink>
            </div>
            
            {isAuthenticated ? (
              <div className="space-y-2 pt-2">
                <NavButton
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  icon={User}
                >
                  Profile
                </NavButton>
                <NavButton
                  onClick={handleLogout}
                  icon={LogOut}
                >
                  Logout
                </NavButton>
              </div>
            ) : (
              <NavButton
                onClick={() => {
                  navigate("/auth");
                  setIsOpen(false);
                }}
                icon={User}
              >
                Sign In
              </NavButton>
            )}
          </div>
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = 'Navbar';
