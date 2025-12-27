import { useState } from "react";
import { Menu, Share2, Minus, X, Copy, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  const copyKey = () => {
    navigator.clipboard.writeText("vless://57942d57-17e0-4875-80bc-...");
    toast({
      title: "Copied!",
      description: "Access key copied to clipboard",
      className: "bg-background border border-primary/20 text-foreground",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1e] text-slate-100 font-sans">
      <div className="w-full max-w-sm bg-[#0F1524] rounded-3xl shadow-2xl overflow-hidden border border-slate-800/50 relative flex flex-col h-[700px]">
        {/* Header */}
        <header className="p-4 flex items-center justify-between z-10">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-transparent">
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SayoVPN</span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-transparent w-8 h-8">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-transparent w-8 h-8">
              <Minus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-transparent w-8 h-8">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center relative">
          
          {/* Connection Ring Animation */}
          <div className="relative mb-12">
            {/* Outer Glow Ring */}
            <AnimatePresence>
              {isConnected && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-primary/30"
                />
              )}
            </AnimatePresence>
             <AnimatePresence>
              {isConnected && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-primary/20"
                />
              )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleConnection}
              className={`w-40 h-40 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative z-10 ${
                isConnected 
                  ? "border-primary bg-primary/10 shadow-[0_0_50px_rgba(234,179,8,0.2)]" 
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
              }`}
            >
              <Power className={`w-16 h-16 transition-all duration-500 ${
                isConnected ? "text-primary drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "text-slate-500"
              }`} />
            </motion.button>
          </div>

          {/* Status Text */}
          <motion.div 
            layout 
            className="text-center space-y-2"
          >
            <h2 className={`text-2xl font-medium transition-colors duration-300 ${isConnected ? "text-primary" : "text-slate-400"}`}>
              {isConnected ? "VPN connected" : "VPN disconnected"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isConnected ? "Secure traffic encrypted" : "Tap to connect"}
            </p>
          </motion.div>
        </main>

        {/* Footer / Access Key */}
        <footer className="p-6 w-full">
          <div className="space-y-3">
            <p className="text-slate-400 text-sm text-center">Your access key</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input 
                  readOnly
                  value="vless://57942d57-17e0-4875-80bc-..." 
                  className="bg-[#0a0f1e] border-slate-800 text-green-400 font-mono text-xs h-12 rounded-xl focus-visible:ring-primary/50 pl-4"
                />
              </div>
              <Button 
                onClick={copyKey}
                variant="outline" 
                className="h-12 w-12 rounded-xl border-slate-800 bg-[#0a0f1e] hover:bg-slate-800 hover:text-primary transition-colors p-0"
              >
                <Copy className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
