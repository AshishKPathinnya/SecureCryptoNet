import { useQuery } from "@tanstack/react-query";
import { History, RefreshCw, Lock, Unlock, Shield, Check, CheckCheck, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Message, User } from "@shared/schema";

export default function MessageHistory() {
  const { data: messages = [], refetch } = useQuery<Message[]>({
    queryKey: ["/api/messages/user/1"], // Simplified: assuming current user ID is 1
    refetchInterval: 10000,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const getUserById = (id: number) => {
    return users.find(user => user.id === id);
  };

  const formatTimestamp = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-400" size={12} />;
      case "delivered":
        return <Check className="text-green-400" size={12} />;
      case "verified":
        return <CheckCheck className="text-green-400" size={12} />;
      default:
        return <Clock className="text-gray-400" size={12} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "delivered":
        return "Delivered";
      case "verified":
        return "Verified";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="mt-8">
      <Card className="bg-white dark:bg-crypto-gray border-gray-200 dark:border-crypto-blue/20 crypto-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl text-gray-900 dark:text-white">
              <History className="mr-2 text-crypto-accent" size={20} />
              Message History
            </CardTitle>
            <Button
              size="sm"
              onClick={() => refetch()}
              className="bg-crypto-accent hover:bg-blue-600"
            >
              <RefreshCw className="mr-2" size={16} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-600 dark:text-gray-400 mb-2">No messages found</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    Start by sending your first encrypted message
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const isSent = message.fromUserId === 1; // Simplified: assuming current user ID is 1
                  const otherUser = getUserById(isSent ? message.toUserId : message.fromUserId);
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md rounded-xl p-4 ${
                          isSent
                            ? "bg-crypto-blue ml-12"
                            : "bg-crypto-dark border border-crypto-green/30 mr-12"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {message.encryptedContent ? (
                              <>
                                <Lock className="text-green-400" size={12} />
                                <span className="text-xs text-gray-200">
                                  Encrypted ({message.encryptionMethod})
                                </span>
                              </>
                            ) : (
                              <>
                                <Unlock className="text-yellow-400" size={12} />
                                <span className="text-xs text-gray-200">Plain Text</span>
                              </>
                            )}
                          </div>
                          <span className="text-xs text-gray-300">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-white mb-2 break-words">
                          {message.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-300">
                          <span>
                            {isSent ? "To" : "From"}: {otherUser?.username || "Unknown"}
                          </span>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(message.status)}
                            <span>{getStatusText(message.status)}</span>
                          </div>
                        </div>

                        {/* Show hash for verified messages */}
                        {message.status === "verified" && message.messageHash && (
                          <div className="mt-2 pt-2 border-t border-gray-600">
                            <div className="flex items-center space-x-1 mb-1">
                              <Shield className="text-crypto-green" size={10} />
                              <span className="text-xs text-crypto-green">Hash Verified</span>
                            </div>
                            <div className="text-xs text-gray-400 font-mono break-all">
                              {message.messageHash}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
