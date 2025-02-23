
import { memo } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MarketplaceSection = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-3xl p-12 md:p-16 lg:p-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
          Time to Collect
          <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            Digital Masterpieces
          </span>
        </h2>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Don't miss your chance to own unique digital art pieces
        </p>

        <div className="pt-8">
          <Button 
            size="lg"
            className="text-lg px-10 py-8"
            onClick={() => navigate('/marketplace')}
          >
            <span className="flex items-center gap-3">
              Explore Marketplace
              <ExternalLink className="w-6 h-6" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(MarketplaceSection);
