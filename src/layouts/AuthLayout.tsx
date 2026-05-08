import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Left Side - Visual Presentation */}
      <div className="hidden lg:flex lg:w-1/2 bg-mesh-gradient relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-slate-950/20 dark:bg-slate-950/50 mix-blend-multiply"></div>
        <div className="relative z-10 text-white max-w-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-500/20 rounded-2xl backdrop-blur-sm border border-emerald-500/30">
              <ShieldCheck className="h-10 w-10 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Digital RT</h1>
          </div>
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Sistem Manajemen Lingkungan <span className="text-emerald-400">Modern.</span>
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Kelola data warga, iuran bulanan, hingga persuratan dengan mudah, aman, dan transparan dalam satu genggaman.
          </p>
          
          <div className="mt-12 flex items-center gap-4 text-sm text-slate-400">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/100?img=1" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/100?img=2" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/100?img=3" alt="User" />
            </div>
            <p>Bergabung dengan 100+ warga lainnya</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96 animate-fade-in stagger-1">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Digital RT</h2>
          </div>
          
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Selamat Datang
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
            Silakan masukkan kredensial Anda untuk mengakses portal warga.
          </p>

          <div className="mt-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
