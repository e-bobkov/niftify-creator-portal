
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TokenDetails = () => {
  const { collectionId, tokenId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data: tokenDetails, isLoading } = useQuery({
    queryKey: ['token', collectionId, tokenId],
    queryFn: async () => {
      const response = await fetch('https://test.ftsoa.art/profile/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          collection_id: collectionId,
          token_id: tokenId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch token details');
      }

      return response.json();
    },
    enabled: !!token && !!collectionId && !!tokenId
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-primary/10 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-primary/10 rounded w-1/3"></div>
            <div className="h-4 bg-primary/10 rounded w-2/3"></div>
          </div>
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

      <div className="glass-card rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Token Details</h1>
        <pre className="bg-muted p-4 rounded-lg overflow-auto">
          {JSON.stringify(tokenDetails, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TokenDetails;
