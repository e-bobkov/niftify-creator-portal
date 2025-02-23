
import { memo } from 'react';
import { Shield, TrendingUp, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DigitalArtBenefits = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="absolute -inset-x-4 inset-y-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-[2rem] blur-3xl" />
      <div className="glass-card rounded-3xl p-12 md:p-16 lg:p-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight leading-none">
              Why Digital Art is the
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                Future of Collecting
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <BenefitCard
              icon={Shield}
              title="Authenticity"
              description="Each piece is unique and verifiable on the blockchain, ensuring genuine ownership and provenance."
              gradient="from-primary to-purple-600"
            />

            <BenefitCard
              icon={TrendingUp}
              title="Investment Potential"
              description="Digital art market is growing exponentially, offering significant returns on investment."
              gradient="from-purple-600 to-blue-600"
              className="md:translate-y-8"
            />

            <BenefitCard
              icon={Users}
              title="Community"
              description="Join a thriving community of collectors, artists, and enthusiasts sharing the same passion."
              gradient="from-blue-600 to-green-600"
              className="lg:translate-y-16"
            />
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-2xl" />
            <div className="relative glass-card rounded-2xl p-8 md:p-12 text-center transform hover:scale-[1.02] transition-transform duration-300">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Collection?
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Experience the future of art ownership with our curated digital masterpieces
              </p>
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-primary/90 hover:bg-primary transition-all duration-300 shadow-xl hover:shadow-primary/20"
                onClick={() => navigate('/marketplace')}
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Start Collecting
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BenefitCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  gradient,
  className = ''
}: { 
  icon: typeof Shield;
  title: string;
  description: string;
  gradient: string;
  className?: string;
}) => (
  <div className={`group relative ${className}`}>
    <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt`} />
    <div className="glass-card p-8 relative space-y-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 transform -rotate-6 group-hover:rotate-6 transition-transform duration-300">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
));

BenefitCard.displayName = 'BenefitCard';

export default memo(DigitalArtBenefits);
