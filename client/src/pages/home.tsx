import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Terminal, Download, Cpu, ShieldAlert, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(["> SYSTEM_READY"]);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `> ${msg}`]);
  };

  const handleBuild = () => {
    setIsBuilding(true);
    setIsComplete(false);
    setProgress(0);
    setLogs(["> INITIALIZING BUILD SEQUENCE..."]);

    const sequence = [
      { t: 500, msg: "Allocating nothingness..." },
      { t: 1000, msg: "Importing 'void'..." },
      { t: 1500, msg: "Compiling main.py (0 lines)..." },
      { t: 2000, msg: "Optimizing emptiness..." },
      { t: 2500, msg: "Running PyInstaller..." },
      { t: 3000, msg: "Adding useless metadata..." },
      { t: 3500, msg: "Compressing air..." },
      { t: 4000, msg: "Verifying checksum of nothing..." },
      { t: 4500, msg: "BUILD SUCCESSFUL. TARGET: USELESS.EXE" },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= sequence.length) {
        clearInterval(interval);
        setIsBuilding(false);
        setIsComplete(true);
        toast({
          title: "BUILD COMPLETE",
          description: "useless.exe is ready for deployment.",
          className: "bg-black border border-green-500 text-green-500 font-mono",
        });
        return;
      }

      const step = sequence[currentStep];
      addLog(step.msg);
      setProgress(((currentStep + 1) / sequence.length) * 100);
      currentStep++;
    }, 500);
  };

  const handleDownload = () => {
    toast({
      title: "ERROR: FILE TOO LIGHT",
      description: "The file is so useless it floated away.",
      variant: "destructive",
      className: "font-mono border-2",
    });
    addLog("DOWNLOAD_ATTEMPT_FAILED: FILE_DOES_NOT_EXIST_PHYSICALLY");
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center font-mono relative">
      <div className="scanline" />
      <div className="crt-flicker" />
      
      <Card className="w-full max-w-2xl bg-black border-2 border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.3)] z-10 relative">
        <CardHeader className="border-b border-green-500/30">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2 text-green-500 tracking-wider">
            <Terminal className="w-6 h-6 animate-pulse" />
            USELESS_EXE_GENERATOR_V1.0
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-green-500/80 text-lg uppercase tracking-widest">
              Mission: Generate a Python executable that does absolutely nothing.
            </p>
          </div>

          <div className="h-64 bg-black border border-green-500/50 p-4 overflow-y-auto font-mono text-sm md:text-base scrollbar-hide rounded-sm relative">
             <div className="absolute top-2 right-2 text-xs text-green-500/50">/var/log/syslog</div>
             {logs.map((log, i) => (
               <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-green-500 mb-1"
               >
                 {log}
               </motion.div>
             ))}
             <div ref={logsEndRef} />
          </div>

          <AnimatePresence>
            {isBuilding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-xs text-green-500 uppercase">
                  <span>Compiling...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-4 border border-green-500 bg-black [&>div]:bg-green-500 rounded-none" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {!isComplete ? (
              <Button 
                onClick={handleBuild} 
                disabled={isBuilding}
                className="w-full h-14 text-xl border-2 border-green-500 bg-green-500/10 hover:bg-green-500 hover:text-black text-green-500 font-bold uppercase transition-all duration-200 rounded-none group"
              >
                {isBuilding ? (
                   <span className="flex items-center gap-2">
                     <Cpu className="w-5 h-5 animate-spin" /> PROCESSING
                   </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Code className="w-5 h-5 group-hover:rotate-12 transition-transform" /> INITIATE BUILD
                  </span>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleDownload}
                className="w-full h-14 text-xl border-2 border-green-500 bg-green-500 text-black hover:bg-green-400 font-bold uppercase transition-all duration-200 rounded-none animate-pulse"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5" /> DOWNLOAD .EXE
                </span>
              </Button>
            )}

            <Button 
              variant="outline" 
              className="w-full h-14 text-xl border-2 border-red-500/50 text-red-500 hover:bg-red-950/30 hover:border-red-500 hover:text-red-400 font-bold uppercase transition-all duration-200 rounded-none"
              onClick={() => {
                setLogs([]);
                setIsComplete(false);
                addLog("SYSTEM_RESET");
              }}
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> RESET SYSTEM
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="fixed bottom-4 right-4 text-green-900 text-xs font-mono select-none">
        PROTOTYPE_MODE // RESTRICTED_ENV
      </div>
    </div>
  );
}
