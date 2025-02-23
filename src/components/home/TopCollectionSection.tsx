
import { memo } from 'react';
import { Collection } from '@/types/user';
import { format } from "date-fns";
import { ExternalLink, TrendingUp, Users, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  collection: Collection;
  soldCount: number;
}

const TopCollectionSection = ({ collection, soldCount }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-3 grid grid-cols-1 gap-6">
        <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-primary">{soldCount}</p>
          <p className="text-sm text-muted-foreground">Total Sales</p>
        </div>
        
        <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-primary">
            {format(new Date(collection.created_at), 'MMM dd')}
          </p>
          <p className="text-sm text-muted-foreground">Created</p>
        </div>
        
        <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <CircleDollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-primary">{(soldCount * 0.1).toFixed(1)}K</p>
          <p className="text-sm text-muted-foreground">Volume</p>
        </div>
      </div>

      <div className="lg:col-span-9">
        <div className="glass-card rounded-lg overflow-hidden transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <img 
                src={collection.image_url} 
                alt={collection.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{collection.name}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {collection.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <a 
                  href={`https://polygonscan.com/address/${collection.contract_address}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline inline-flex items-center gap-2"
                >
                  View on PolygonScan
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/my-collection/${collection.id}`)}
                >
                  Explore Collection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TopCollectionSection);
