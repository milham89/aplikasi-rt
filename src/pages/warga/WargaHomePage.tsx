import { Card, CardContent } from '../../components/ui/Card';
import { CreditCard, FileText, AlertTriangle, PhoneCall } from 'lucide-react';

export default function WargaHomePage() {
  return (
    <div className="space-y-6">
      {/* Status Iuran Card */}
      <Card className="bg-gradient-to-br from-navy-900 to-navy-800 text-white border-0 shadow-md">
        <CardContent className="p-6">
          <p className="text-navy-100 text-sm mb-1">Status Iuran Bulan Ini</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold">Lunas</h2>
            <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-md font-medium">
              Terverifikasi
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Layanan Cepat</h3>
        <div className="grid grid-cols-4 gap-3">
          <button className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="bg-emerald-100 p-3 rounded-xl mb-2 text-emerald-600">
              <CreditCard className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-slate-700">Bayar</span>
          </button>
          
          <button className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="bg-blue-100 p-3 rounded-xl mb-2 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-slate-700">Surat</span>
          </button>

          <button className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="bg-amber-100 p-3 rounded-xl mb-2 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-slate-700">Lapor</span>
          </button>

          <button className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="bg-rose-100 p-3 rounded-xl mb-2 text-rose-600">
              <PhoneCall className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-slate-700">Darurat</span>
          </button>
        </div>
      </div>

      {/* Announcements */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Pengumuman RT</h3>
        <div className="space-y-3">
          <Card className="border border-slate-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-800 text-sm">Kerja Bakti Minggu Ini</h4>
                <span className="text-[10px] text-slate-400">2 hari lalu</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                Diberitahukan kepada seluruh warga Blok A dan B untuk mengikuti kerja bakti membersihkan selokan pada hari Minggu jam 08:00 WIB.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
