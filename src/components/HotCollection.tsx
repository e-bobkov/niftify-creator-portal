
import { memo } from 'react';
import { Collection } from '@/types/user';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface HotCollectionProps {
  collection: Collection;
  soldCount: number;
}

const HotCollection = ({ collection, soldCount }: HotCollectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-lg overflow-hidden">
          <img 
            src={collection.image_url || '/placeholder.svg'} 
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">{collection.name}</h3>
          <p className="text-muted-foreground">{collection.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 text-center">
              <div className="text-xl font-bold">{soldCount}</div>
              <div className="text-sm text-muted-foreground">Sold NFTs</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-xl font-bold">{collection.tokens_count}</div>
              <div className="text-sm text-muted-foreground">Total NFTs</div>
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={() => navigate(`/collection/${collection.id}`)}
          >
            View Collection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(HotCollection);
