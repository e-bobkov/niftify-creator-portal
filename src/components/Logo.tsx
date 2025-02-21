
import { memo } from 'react';
import { Link } from "react-router-dom";

export const Logo = memo(() => {
  return (
    <Link 
      to="/" 
      className="transition-all duration-300 hover:scale-110"
    >
      <span className="text-2xl font-bold">
        <span className="text-primary">ft</span>
        <span className="text-foreground">soa</span>
        <span className="text-primary">.art</span>
      </span>
    </Link>
  );
});

Logo.displayName = 'Logo';
