import { useState, useEffect } from "react";
import { Lock, Box } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { blockchainService } from "@/lib/blockchain";
import type { Block } from "@shared/schema";

export default function Header() {
  const [userStatus, setUserStatus] = useState("User Active");

  const { data: latestBlock } = useQuery<Block>({
    queryKey: ["/api/blocks/latest"],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  return (
    <header className="bg-crypto-gray border-b border-crypto-blue/30 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-crypto-blue rounded-lg flex items-center justify-center crypto-glow">
              <Lock className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SecureChain Messenger</h1>
              <p className="text-sm text-gray-400">Blockchain + Cryptography Communication</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* User Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">{userStatus}</span>
            </div>
            {/* Blockchain Status */}
            <div className="flex items-center space-x-2">
              <Box className="text-crypto-green" size={16} />
              <span className="text-sm text-gray-300">
                Block Height: <span className="text-crypto-green font-mono">
                  {latestBlock?.height?.toLocaleString() || "0"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
