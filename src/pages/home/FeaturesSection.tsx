
import { Palette, DollarSign, Rocket } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="transform hover:scale-105 transition-all duration-300 relative">
        <div className="glass-card p-8 text-center">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
          <Palette className="w-12 h-12 mx-auto mb-4 text-primary relative z-10" />
          <h3 className="text-xl font-bold mb-2 relative z-10">Create</h3>
          <p className="text-muted-foreground relative z-10">Turn your digital art into unique NFT collections</p>
        </div>
      </div>
      
      <div className="md:translate-y-12 transform hover:scale-105 transition-all duration-300">
        <div className="glass-card p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary relative z-10" />
          <h3 className="text-xl font-bold mb-2 relative z-10">Monetize</h3>
          <p className="text-muted-foreground relative z-10">Sell your art and earn real money</p>
        </div>
      </div>
      
      <div className="relative group">
        <div className="glass-card p-8 text-center transform group-hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          <Rocket className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">Launch</h3>
          <p className="text-muted-foreground">Join the digital art revolution</p>
        </div>
      </div>
    </div>
  );
};
