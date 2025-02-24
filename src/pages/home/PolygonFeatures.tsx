
import { Shield, Rocket, CircleDollarSign, Globe, ExternalLink } from "lucide-react";

const PolygonFeature = ({
  icon: Icon,
  title,
  description,
  gradient
}: {
  icon: typeof Shield;
  title: string;
  description: string;
  gradient: string;
}) => (
  <div className="glass-card p-6 relative overflow-hidden group">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className={`w-full h-full ${gradient} opacity-10`} />
    </div>
    <div className="relative z-10">
      <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export const PolygonFeatures = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <span className="text-sm font-semibold text-primary tracking-wider uppercase">Why Polygon?</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          The Future of NFTs on
          <span className="relative inline-block ml-3 group">
            <span className="absolute -inset-1 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300" />
            <span className="relative">Polygon</span>
          </span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We've chosen Polygon as our mainnet for its exceptional benefits and features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PolygonFeature 
          icon={Shield} 
          title="Security First" 
          description="Built on Ethereum's security model with additional layers of protection for your NFTs" 
          gradient="bg-gradient-to-br from-green-500/20 to-blue-500/20" 
        />
        <PolygonFeature 
          icon={Rocket} 
          title="Lightning Speed" 
          description="Near-instant transactions and confirmations for seamless minting and trading" 
          gradient="bg-gradient-to-br from-purple-500/20 to-pink-500/20" 
        />
        <PolygonFeature 
          icon={CircleDollarSign} 
          title="Low Gas Fees" 
          description="Minimal transaction costs make creating and trading NFTs accessible to everyone" 
          gradient="bg-gradient-to-br from-yellow-500/20 to-red-500/20" 
        />
        <PolygonFeature 
          icon={Globe} 
          title="Global Scale" 
          description="Infrastructure capable of handling millions of transactions with ease" 
          gradient="bg-gradient-to-br from-blue-500/20 to-indigo-500/20" 
        />
      </div>

      <div className="flex justify-center pt-8">
        <a 
          href="https://polygon.technology" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          Learn more about Polygon
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
