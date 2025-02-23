
import { memo } from 'react';
import { Shield, Rocket, CircleDollarSign, Globe } from 'lucide-react';

const FeatureCard = memo(({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: typeof Shield;
  title: string;
  description: string;
}) => (
  <div className="glass-card p-6 relative overflow-hidden group">
    <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

const PolygonSection = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          The Future of NFTs on
          <span className="relative inline-block ml-3">Polygon</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We've chosen Polygon as our mainnet for its exceptional benefits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          icon={Shield}
          title="Security First"
          description="Built on Ethereum's security model with additional layers"
        />
        <FeatureCard 
          icon={Rocket}
          title="Lightning Speed"
          description="Near-instant transactions and confirmations"
        />
        <FeatureCard 
          icon={CircleDollarSign}
          title="Low Gas Fees"
          description="Minimal transaction costs make creating NFTs accessible"
        />
        <FeatureCard 
          icon={Globe}
          title="Global Scale"
          description="Infrastructure capable of handling millions of transactions"
        />
      </div>
    </div>
  );
};

export default memo(PolygonSection);
