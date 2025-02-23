
import { memo } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const FeatureCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  className = '',
  gradientFrom = 'from-primary',
  gradientTo = 'to-primary/50'
}: FeatureCardProps) => {
  return (
    <div className={`transform hover:scale-105 transition-all duration-300 relative ${className}`}>
      <div className="glass-card p-8 text-center">
        <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full blur-xl opacity-20`} />
        <Icon className="w-12 h-12 mx-auto mb-4 text-primary relative z-10" />
        <h3 className="text-xl font-bold mb-2 relative z-10">{title}</h3>
        <p className="text-muted-foreground relative z-10">{description}</p>
      </div>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;
