
import { memo } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MarketplaceCallToAction = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl" />
      <div className="glass-card rounded-3xl p-12 md:p-16 lg:p-20 relative overflow-hidden group">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block relative">
            <div className="absolute inset-0 animate-pulse bg-primary/20 blur-2xl rounded-full" />
            <div className="relative">
              <svg 
                viewBox="0 0 24 24" 
                className="w-24 h-24 md:w-32 md:h-32 mx-auto text-primary transform -rotate-12 group-hover:rotate-12 transition-transform duration-700"
              >
                <path 
                  fill="currentColor" 
                  d="M2.252 19.721c-.36-.36-.36-.945 0-1.305L9.797 10.5 2.252 2.584c-.36-.36-.36-.945 0-1.305.36-.36.945-.36 1.305 0L12 9.194l8.443-7.915c.36-.36.945-.36 1.305 0 .36.36.36.945 0 1.305L14.203 10.5l7.545 7.916c.36.36.36.945 0 1.305-.36.36-.945.36-1.305 0L12 11.806l-8.443 7.915c-.36.36-.945.36-1.305 0z"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
              Time to Collect
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                Digital Masterpieces
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Don't miss your chance to own unique digital art pieces
            </p>
          </div>

          <div className="pt-8">
            <Button 
              size="lg"
              className="text-lg px-10 py-8 bg-primary/90 hover:bg-primary transition-colors duration-300 group relative overflow-hidden"
              onClick={() => navigate('/marketplace')}
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore Marketplace
                <ExternalLink className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MarketplaceCallToAction);
