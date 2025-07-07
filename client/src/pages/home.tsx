import Header from "@/components/Header";
import MessageComposer from "@/components/MessageComposer";
import BlockchainLog from "@/components/BlockchainLog";
import MessageHistory from "@/components/MessageHistory";
import SecurityDashboard from "@/components/SecurityDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-crypto-dark text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MessageComposer />
          <BlockchainLog />
        </div>
        
        <MessageHistory />
        <SecurityDashboard />
      </div>

      {/* Footer */}
      <footer className="bg-crypto-gray border-t border-crypto-blue/30 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                © 2024 SecureChain Messenger. All rights reserved.
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Powered by Web Crypto API</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Secure Connection</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
