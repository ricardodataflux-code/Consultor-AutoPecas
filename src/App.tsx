import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [serverStatus, setServerStatus] = useState<string>('verificando...');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setServerStatus(`Online (${data.status})`);
      } else {
        setServerStatus('Indisponível');
      }
    } catch {
      setServerStatus('Offline');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 antialiased selection:bg-zinc-800">
      <div className="max-w-md w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-sm text-center">
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-200 shadow-inner">
          <Sparkles className="w-7 h-7" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold tracking-tight text-white mb-2">
          Projeto Pronto do Zero
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          O projeto foi totalmente limpo e resetado. Digite o que você deseja construir a seguir.
        </p>

        {/* System info */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 mb-6 text-left space-y-2 font-mono text-xs text-zinc-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Terminal className="w-3.5 h-3.5 text-zinc-500" />
              Stack:
            </span>
            <span className="text-zinc-200">Express + Vite + React</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Servidor API:
            </span>
            <span className="text-emerald-400 font-medium">{serverStatus}</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={checkHealth}
          disabled={isChecking}
          className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 text-zinc-950 font-medium text-xs hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          Testar Conexão
        </button>
      </div>
    </div>
  );
}
