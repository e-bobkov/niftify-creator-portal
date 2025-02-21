
import { useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, LogOut, User, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NavLink = memo(({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    to={to}
    className="text-foreground/80 hover:text-primary transition-colors duration-200 transform hover:scale-105"
    onClick={onClick}
  >
    {children}
  </Link>
));

NavLink.displayName = 'NavLink';

const NavButton = memo(({ onClick, icon: Icon, children }: { 
  onClick: () => void; 
  icon: typeof User; 
  children: React.ReactNode 
}) => (
  <Button
    variant="outline"
    onClick={onClick}
    className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
  >
    <Icon size={18} />
    <span>{children}</span>
  </Button>
));

NavButton.displayName = 'NavButton';

export const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105">
            <span className="text-2xl font-bold text-primary">NFTify</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 animate-fade-in">
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/create">Create</NavLink>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 animate-fade-in">
                <span className="text-sm text-muted-foreground">{user?.email}</span>
                <NavButton onClick={() => navigate("/profile")} icon={User}>Profile</NavButton>
                <NavButton onClick={handleLogout} icon={LogOut}>Logout</NavButton>
              </div>
            ) : (
              <NavButton onClick={() => navigate("/auth")} icon={User}>Sign In</NavButton>
            )}
          </div>

          <button 
            className="md:hidden transition-transform duration-200 hover:scale-110" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slideUp">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <NavLink to="/explore" onClick={() => setIsOpen(false)}>Explore</NavLink>
            <NavLink to="/create" onClick={() => setIsOpen(false)}>Create</NavLink>
            {isAuthenticated ? (
              <>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
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
              </>
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
