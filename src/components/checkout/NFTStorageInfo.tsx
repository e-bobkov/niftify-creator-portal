
import { Info, ExternalLink } from "lucide-react";
import { CollapsibleInfo } from "./CollapsibleInfo";

export const NFTStorageInfo = () => {
  return (
    <CollapsibleInfo 
      title="NFT Storage Information" 
      icon={<Info className="h-4 w-4" />}
      iconColor="text-[#bcf655]"
    >
      <p>
        All NFTs are stored centrally on our platform's wallet for enhanced security and ease of access.
      </p>
      <div className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80">
        <a 
          href="https://polygonscan.com/address/0xe2Ab5329EccBb90fC3EB4542ff674e096A304f36" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center"
        >
          View platform wallet on Polygonscan
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
      <p>
        Upon purchase, you become the rightful owner and your ownership details will be securely encrypted in the NFT's metadata.
      </p>
    </CollapsibleInfo>
  );
};
