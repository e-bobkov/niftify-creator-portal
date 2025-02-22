
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Token } from "@/types/user";
import { NFTCard } from "@/components/NFTCard";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Collection = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data: tokens, isLoading, error } = useQuery({
    queryKey: ['collection', id],
    queryFn: async (): Promise<Token[]> => {
      const response = await fetch('https://test.ftsoa.art/profile/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          collection_id: id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }

      const data = await response.json();
      return data.tokens;
    },
    enabled: !!token && !!id
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-primary/10 rounded-lg aspect-square mb-2"></div>
              <div className="h-4 bg-primary/10 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-primary/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p>Failed to load collection tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="glass-card rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Collection Tokens</h1>
        {!tokens?.length ? (
          <div className="text-muted-foreground text-center p-8">
            No tokens in this collection
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokens.map((token) => (
              <NFTCard
                key={token.id}
                id={token.id}
                title={token.metadata.name}
                image={token.metadata.image}
                price={token.total_amount}
                creator={token.partner_id}
                likes={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
