
import { memo } from 'react';
import { useNavigate } from "react-router-dom";
import { Palette, DollarSign, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeatureCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  className = '' 
}: { 
  icon: typeof Palette; 
  title: string; 
  description: string; 
  className?: string; 
}) => (
  <div className={`transform hover:scale-105 transition-all duration-300 relative ${className}`}>
    <div className="glass-card p-8 text-center">
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <Icon className="w-12 h-12 mx-auto mb-4 text-primary relative z-10" />
      <h3 className="text-xl font-bold mb-2 relative z-10">{title}</h3>
      <p className="text-muted-foreground relative z-10">{description}</p>
    </div>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center space-y-12">
      <div className="space-y-6 animate-slide-up">
        <h1 className="text-7xl md:text-8xl font-bold tracking-tight">
          Future of
          <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            Digital Art
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Transform your digital creations into valuable assets
        </p>

        <div className="pt-6">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6" 
            onClick={() => navigate('/create')}
          >
            <Sparkles className="mr-2" />
            Start Creating Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={Palette}
          title="Create"
          description="Turn your digital art into unique NFT collections"
        />
        
        <FeatureCard
          icon={DollarSign}
          title="Monetize"
          description="Sell your art and earn real money"
          className="md:translate-y-12"
        />
        
        <FeatureCard
          icon={Rocket}
          title="Launch"
          description="Join the digital art revolution"
        />
      </div>
    </div>
  );
};

export default memo(HeroSection);
