import { Badge } from "@/components/ui/badge";
import { Shield, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlockchainRecordBadgeProps {
  hash: string;
  network?: string;
}

export const BlockchainRecordBadge = ({ 
  hash, 
  network = "Polygon Amoy" 
}: BlockchainRecordBadgeProps) => {
  const shortHash = hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : "";

  if (!hash) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant="outline" 
          className="cursor-pointer border-green-500/50 text-green-600 bg-green-500/10 hover:bg-green-500/20"
        >
          <Shield className="w-3 h-3 mr-1" />
          {shortHash}
          <ExternalLink className="w-3 h-3 ml-1" />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs">
          <p className="font-semibold mb-1">Blockchain Secured</p>
          <p className="text-muted-foreground">Network: {network}</p>
          <p className="text-muted-foreground break-all max-w-[250px]">Hash: {hash}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};