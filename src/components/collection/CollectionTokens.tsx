
import { Token } from "@/types/user";
import { NFTCard } from "@/components/NFTCard";
import { BaseComponentProps } from "@/types/common";

interface CollectionTokensProps extends BaseComponentProps {
  tokens: Token[];
  collectionId: string;
}

export const CollectionTokens = ({ tokens, collectionId }: CollectionTokensProps) => (
  <div className="glass-card rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-6">Collection Tokens</h2>
    {!tokens?.length ? (
      <div className="text-muted-foreground text-center p-8">
        No tokens in this collection
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokens.map((token) => (
          <NFTCard
            key={token.id}
            id={token.id.toString()}
            collectionId={collectionId}
            title={token.metadata.name}
            image={token.metadata.image}
            price={token.price || 0}
          />
        ))}
      </div>
    )}
  </div>
);
