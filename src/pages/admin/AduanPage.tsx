import { Card } from '../../components/ui/Card';

export default function AduanPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Laporan & Aduan Warga</h2>
          <p className="text-slate-500 text-sm mt-1">Tindak lanjuti keluhan atau laporan dari warga</p>
        </div>
      </div>
      
      <Card>
        <div className="p-6 border-b border-slate-200">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">Semua</button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">Baru</button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">Diproses</button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">Selesai</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Pelapor</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500">07 Mei 2026</td>
                <td className="px-6 py-4 font-medium text-slate-900">Siti Aminah</td>
                <td className="px-6 py-4">Fasilitas Umum</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">Lampu jalan di depan Blok A mati total</td>
                <td className="px-6 py-4">
                  <span className="bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Baru (Open)</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium">Lihat Detail</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
