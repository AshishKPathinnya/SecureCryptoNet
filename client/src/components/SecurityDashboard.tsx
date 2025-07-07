import { useQuery } from "@tanstack/react-query";
import { Lock, Shield, Network, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NetworkStats {
  totalMessages: number;
  activeUsers: number;
  encryptedMessages: number;
  hashVerifications: number;
  securityScore: number;
}

export default function SecurityDashboard() {
  const { data: stats } = useQuery<NetworkStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 10000,
  });

  const securityCards = [
    {
      title: "Messages Encrypted",
      value: stats?.encryptedMessages || 0,
      icon: <Lock className="text-crypto-green text-xl" />,
      bgColor: "bg-crypto-green/20",
      textColor: "text-crypto-green",
    },
    {
      title: "Hash Verifications",
      value: stats?.hashVerifications || 0,
      icon: <Shield className="text-crypto-accent text-xl" />,
      bgColor: "bg-crypto-accent/20",
      textColor: "text-crypto-accent",
    },
    {
      title: "Active Connections",
      value: stats?.activeUsers || 0,
      icon: <Network className="text-yellow-400 text-xl" />,
      bgColor: "bg-yellow-400/20",
      textColor: "text-yellow-400",
    },
    {
      title: "Security Score",
      value: `${stats?.securityScore?.toFixed(1) || 0}%`,
      icon: <Medal className="text-green-400 text-xl" />,
      bgColor: "bg-green-400/20",
      textColor: "text-green-400",
    },
  ];

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityCards.map((card, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-crypto-gray border-gray-200 dark:border-crypto-blue/20 crypto-glow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
