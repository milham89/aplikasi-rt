import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Left Side - Visual Presentation (Immersive) */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-700 relative overflow-hidden items-center justify-center p-20">
        {/* Animated Background Decor */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-3xl animate-bounce duration-[10000ms]"></div>
        
        <div className="relative z-10 text-white max-w-2xl animate-in slide-in-from-left duration-1000">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-white/10 rounded-[2.5rem] backdrop-blur-xl border border-white/20 shadow-2xl">
              <ShieldCheck className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Digital RT</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Management v2.0</p>
            </div>
          </div>
          
          <h2 className="text-7xl font-black leading-[0.9] mb-10 uppercase tracking-tighter">
            SOLUSI <br/>
            <span className="text-emerald-200">LINGKUNGAN</span> <br/>
            MODERN.
          </h2>
          
          <p className="text-xl text-emerald-50/80 leading-relaxed font-medium max-w-xl">
            Portal Layanan Mandiri Warga Digital. Solusi administrasi lingkungan yang transparan, efisien, dan terintegrasi untuk kemajuan bersama.
          </p>
          
        </div>
      </div>

      {/* Right Side - Login Form (Clean & Focused) */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-20 xl:px-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center gap-4 mb-12">
            <div className="p-4 bg-emerald-500 rounded-3xl shadow-xl shadow-emerald-500/20">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Digital RT</h2>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}
