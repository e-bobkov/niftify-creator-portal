
import { memo } from 'react';
import { Shield, TrendingUp, Users } from 'lucide-react';

const BenefitCard = memo(({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: typeof Shield;
  title: string;
  description: string;
}) => (
  <div className="glass-card p-8 relative space-y-4">
    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-2xl font-bold">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
));

BenefitCard.displayName = 'BenefitCard';

const DigitalArtBenefits = () => {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Why Digital Art is the
          <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            Future of Collecting
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BenefitCard
          icon={Shield}
          title="Authenticity"
          description="Each piece is unique and verifiable on the blockchain"
        />
        <BenefitCard
          icon={TrendingUp}
          title="Investment"
          description="Digital art market is growing exponentially"
        />
        <BenefitCard
          icon={Users}
          title="Community"
          description="Join a thriving community of collectors and artists"
        />
      </div>
    </div>
  );
};

export default memo(DigitalArtBenefits);
