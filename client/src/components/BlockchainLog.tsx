import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Group, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { blockchainService } from "@/lib/blockchain";
import type { Block } from "@shared/schema";

interface NetworkStats {
  totalMessages: number;
  activeUsers: number;
  encryptedMessages: number;
  hashVerifications: number;
  securityScore: number;
}

export default function BlockchainLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: blocks = [] } = useQuery<Block[]>({
    queryKey: ["/api/blocks"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: stats } = useQuery<NetworkStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const mineBlockMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/mine-block");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Block mined successfully",
        description: "New block has been added to the blockchain.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blocks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to mine block",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatTimestamp = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatHash = (hash: string) => {
    if (hash.length <= 20) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  return (
    <div className="lg:col-span-1">
      <Card className="bg-white dark:bg-crypto-gray border-gray-200 dark:border-crypto-blue/20 crypto-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl text-gray-900 dark:text-white">
              <Group className="mr-2 text-crypto-green" size={20} />
              Blockchain Log
            </CardTitle>
            <Button
              size="sm"
              onClick={() => mineBlockMutation.mutate()}
              disabled={mineBlockMutation.isPending}
              className="bg-crypto-accent hover:bg-blue-600"
            >
              {mineBlockMutation.isPending ? (
                <RefreshCw className="mr-2 animate-spin" size={16} />
              ) : (
                <Group className="mr-2" size={16} />
              )}
              Mine Block
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`rounded-lg p-4 text-white ${
                    index === 0
                      ? "blockchain-block"
                      : "bg-crypto-dark border border-crypto-blue/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Block #{block.height}
                    </span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {index === 0 ? "Latest" : "Confirmed"}
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Timestamp:</span>
                      <span className="font-mono">
                        {formatTimestamp(block.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Messages:</span>
                      <span>{block.messageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nonce:</span>
                      <span className="font-mono">{block.nonce}</span>
                    </div>
                    <div className="mt-2">
                      <span className="block mb-1">Hash:</span>
                      <span className="font-mono text-xs break-all">
                        {formatHash(block.hash)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Network Stats */}
          <div className="mt-6 pt-4 border-t border-crypto-blue/30">
            <h3 className="text-sm font-medium mb-3">Network Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-crypto-dark rounded-lg p-3">
                <div className="text-gray-400">Total Messages</div>
                <div className="text-lg font-bold text-crypto-green">
                  {stats?.totalMessages?.toLocaleString() || "0"}
                </div>
              </div>
              <div className="bg-crypto-dark rounded-lg p-3">
                <div className="text-gray-400">Active Users</div>
                <div className="text-lg font-bold text-crypto-accent">
                  {stats?.activeUsers || "0"}
                </div>
              </div>
              <div className="bg-crypto-dark rounded-lg p-3">
                <div className="text-gray-400">Encrypted</div>
                <div className="text-lg font-bold text-crypto-green">
                  {stats?.encryptedMessages || "0"}
                </div>
              </div>
              <div className="bg-crypto-dark rounded-lg p-3">
                <div className="text-gray-400">Verified</div>
                <div className="text-lg font-bold text-crypto-accent">
                  {stats?.hashVerifications || "0"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
