import { Users, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warga</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">124</div>
            <p className="text-xs text-slate-500 mt-1">Tersebar di 35 Kartu Keluarga</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permintaan Surat</CardTitle>
            <FileText className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">3</div>
            <p className="text-xs text-slate-500 mt-1">Menunggu persetujuan Anda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laporan Aktif</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">1</div>
            <p className="text-xs text-slate-500 mt-1">Laporan kerusakan fasilitas</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Aktivitas Terbaru</h3>
        <Card>
          <div className="p-6">
            <p className="text-sm text-slate-500">Belum ada aktivitas terbaru hari ini.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
