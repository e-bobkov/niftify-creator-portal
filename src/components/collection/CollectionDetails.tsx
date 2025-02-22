
import { Calendar, Database, ExternalLink, Link as LinkIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Collection } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BaseComponentProps } from "@/types/common";

interface CollectionDetailsProps extends BaseComponentProps {
  collection: Collection;
  tokensCount: number;
  onShare: (platform: 'twitter' | 'telegram' | 'facebook') => void;
}

export const CollectionDetails = ({ collection, tokensCount, onShare }: CollectionDetailsProps) => {
  return (
    <div className="glass-card rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square relative rounded-lg overflow-hidden">
          <img 
            src={collection.image_url} 
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{collection.name}</h1>
            <p className="text-muted-foreground">{collection.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-sm">
                {tokensCount} tokens minted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm">
                {format(new Date(collection.created_at), 'PP')}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href={`https://polygonscan.com/address/${collection.contract_address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <LinkIcon className="w-4 h-4" />
              <span className="text-sm">View on PolygonScan</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Collection
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onShare('twitter')}>
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare('telegram')}>
                  Share on Telegram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare('facebook')}>
                  Share on Facebook
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
