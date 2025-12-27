import { useState, useEffect } from "react";
import { Menu, Share2, Minus, X, Copy, Power, Globe, Send, ExternalLink, Key, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import logoUrl from "@assets/изображение_1766809894227.png";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [savedKey, setSavedKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem("sayovpn_key");
    if (storedKey) {
      setSavedKey(storedKey);
      setShowWelcome(false);
    }
  }, []);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(savedKey || "vless://...");
    toast({
      title: "Скопировано!",
      description: "Ключ доступа скопирован",
      className: "bg-background border border-primary/20 text-foreground",
    });
  };

  const openTelegram = () => {
    window.open("https://t.me/SayoVPN_bot", "_blank");
  };

  const openWebsite = () => {
    window.open("https://sayovpn.replit.app/", "_blank");
  };

  const getKeyFromBot = () => {
    window.open("https://t.me/SayoVPN_bot", "_blank");
    setShowKeyInput(true);
  };

  const continueWithKey = () => {
    setShowKeyInput(true);
  };

  const validateAndSaveKey = async () => {
    if (!keyInput.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите ключ",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      const response = await fetch("/api/keys/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: keyInput.trim() }),
      });

      const data = await response.json();

      if (data.valid) {
        localStorage.setItem("sayovpn_key", keyInput.trim());
        setSavedKey(keyInput.trim());
        setShowWelcome(false);
        setShowKeyInput(false);
        toast({
          title: "Успешно!",
          description: "Ключ активирован",
          className: "bg-background border border-primary/20 text-foreground",
        });
      } else {
        toast({
          title: "Неверный ключ",
          description: "Получите ключ в Telegram боте @SayoVPN_bot",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось проверить ключ",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1e] text-slate-100 font-sans">
      
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0f1e] z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="w-full max-w-sm bg-[#0F1524] rounded-3xl border border-slate-800/50 p-8 space-y-8"
            >
              {/* Logo */}
              <div className="flex flex-col items-center gap-4">
                <motion.img 
                  src={logoUrl} 
                  alt="SayoVPN Logo" 
                  className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", damping: 10, delay: 0.2 }}
                />
                <h1 className="text-3xl font-bold text-primary drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                  SayoVPN
                </h1>
                <p className="text-slate-400 text-center text-sm">
                  Быстрый и безопасный VPN для вашей защиты
                </p>
              </div>

              {/* Key Input Mode */}
              {showKeyInput ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Введите ваш ключ:</label>
                    <Input
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="vless://xxxxxxxx-xxxx-xxxx-xxxx"
                      className="bg-[#0a0f1e] border-slate-700 text-primary font-mono text-sm h-12 rounded-xl focus-visible:ring-primary/50"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={validateAndSaveKey}
                    disabled={isValidating}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-black font-bold text-lg hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(255,215,0,0.3)] disabled:opacity-50"
                  >
                    {isValidating ? (
                      <span>Проверка...</span>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Активировать ключ
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={() => setShowKeyInput(false)}
                    className="w-full text-sm text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    ← Назад
                  </button>
                </div>
              ) : (
                /* Buttons */
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={getKeyFromBot}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-black font-bold text-lg hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                  >
                    <Send className="w-5 h-5" />
                    Получить ключ
                  </motion.button>
                  
                  <p className="text-xs text-slate-500 text-center">
                    Получите бесплатный ключ в нашем Telegram боте
                  </p>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[#0F1524] px-4 text-xs text-slate-600">или</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={continueWithKey}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-slate-300 font-medium hover:border-primary/50 hover:text-primary transition-all"
                  >
                    <Key className="w-5 h-5" />
                    У меня уже есть ключ
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-sm bg-[#0F1524] rounded-3xl shadow-2xl overflow-hidden border border-slate-800/50 relative flex flex-col h-[700px]">
        
        {/* Side Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="absolute inset-0 bg-black/60 z-20"
              />
              
              {/* Side Menu */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute left-0 top-0 bottom-0 w-72 bg-[#0a0f1e] border-r border-slate-800 z-30 flex flex-col"
              >
                {/* Menu Header */}
                <div className="p-6 border-b border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <img 
                      src={logoUrl} 
                      alt="SayoVPN Logo" 
                      className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-primary">SayoVPN</h2>
                      <p className="text-xs text-slate-500">Быстрый и безопасный</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 p-4 space-y-2">
                  <button
                    onClick={openTelegram}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 hover:bg-primary/10 border border-slate-700/50 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#229ED9]/20 flex items-center justify-center">
                      <Send className="w-5 h-5 text-[#229ED9]" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-slate-200 group-hover:text-primary transition-colors">Telegram Бот</p>
                      <p className="text-xs text-slate-500">@SayoVPN_bot</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-primary/50" />
                  </button>

                  <button
                    onClick={openWebsite}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 hover:bg-primary/10 border border-slate-700/50 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-slate-200 group-hover:text-primary transition-colors">Наш сайт</p>
                      <p className="text-xs text-slate-500">sayovpn.replit.app</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-primary/50" />
                  </button>
                </div>

                {/* Menu Footer */}
                <div className="p-4 border-t border-slate-800/50">
                  <p className="text-xs text-slate-600 text-center">SayoVPN v1.0.0</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="p-4 flex items-center justify-between z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(true)}
            className="text-slate-400 hover:text-primary hover:bg-transparent"
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-2">
            <img 
              src={logoUrl} 
              alt="SayoVPN Logo" 
              className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]"
            />
            <span className="text-xl font-bold tracking-tight text-primary drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">SayoVPN</span>
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
                  className="absolute inset-0 rounded-full border-2 border-primary/40 bg-primary/5"
                />
              )}
            </AnimatePresence>
             <AnimatePresence>
              {isConnected && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-primary/30"
                />
              )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleConnection}
              className={`w-40 h-40 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative z-10 ${
                isConnected 
                  ? "border-primary bg-primary/20 shadow-[0_0_50px_rgba(255,215,0,0.4)]" 
                  : "border-slate-700 bg-slate-800/50 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]"
              }`}
            >
              <Power className={`w-16 h-16 transition-all duration-500 ${
                isConnected ? "text-primary drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" : "text-slate-500 group-hover:text-primary/70"
              }`} />
            </motion.button>
          </div>

          {/* Status Text */}
          <motion.div 
            layout 
            className="text-center space-y-2"
          >
            <h2 className={`text-2xl font-bold transition-all duration-300 tracking-wide ${isConnected ? "text-primary drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" : "text-slate-400"}`}>
              {isConnected ? "VPN подключён" : "VPN отключён"}
            </h2>
            <p className={`text-sm transition-colors duration-300 ${isConnected ? "text-primary/80" : "text-slate-500"}`}>
              {isConnected ? "Защищенное соединение активно" : "Нажмите для подключения"}
            </p>
          </motion.div>
        </main>

        {/* Footer / Access Key */}
        <footer className="p-6 w-full">
          <div className="space-y-3">
            <p className="text-slate-400 text-sm text-center">Ваш ключ доступа</p>
            <div className={`flex gap-2 p-1 rounded-2xl transition-all duration-300 border ${isConnected ? "border-primary/30 bg-primary/5 shadow-[0_0_15px_rgba(255,215,0,0.1)]" : "border-transparent"}`}>
              <div className="relative flex-1">
                <Input 
                  readOnly
                  value={savedKey ? `${savedKey.substring(0, 30)}...` : "Ключ не активирован"} 
                  className={`bg-[#0a0f1e] border-slate-800 font-mono text-xs h-12 rounded-xl pl-4 focus-visible:ring-primary/50 transition-colors ${isConnected ? "text-primary border-primary/30" : savedKey ? "text-green-400" : "text-slate-500"}`}
                />
              </div>
              <Button 
                onClick={copyKey}
                variant="outline" 
                disabled={!savedKey}
                className={`h-12 w-12 rounded-xl bg-[#0a0f1e] hover:bg-slate-800 transition-colors p-0 border-slate-800 ${isConnected ? "text-primary hover:text-primary border-primary/30" : "text-slate-400 hover:text-primary"} disabled:opacity-50`}
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
