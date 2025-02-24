
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-12">
      <div className="space-y-6 animate-slide-up">
        <h1 className="text-7xl md:text-8xl font-bold tracking-tight">
          For the sake
          <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent my-0 py-[10px]">
            of art
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed py-0">
          Transform your digital creations into valuable assets
        </p>

        <div className="pt-6">
          <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/create')}>
            <Sparkles className="mr-2" />
            Start Creating Now
          </Button>
        </div>
      </div>
    </div>
  );
};
