
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, Wallet, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <Button variant="outline" className="flex items-center space-x-2">
              <Wallet size={18} />
              <span>Connect Wallet</span>
            </Button>
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
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
              <Wallet size={18} />
              <span>Connect Wallet</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
