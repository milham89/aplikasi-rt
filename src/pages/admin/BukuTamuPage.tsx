import { Card } from '../../components/ui/Card';

export default function BukuTamuPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy-900">Buku Tamu</h2>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
          + Tamu Baru
        </button>
      </div>
      
      <Card>
        <div className="p-6 border-b border-slate-200">
          <input 
            type="text" 
            placeholder="Cari nama tamu..." 
            className="w-full md:w-80 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Nama Tamu</th>
                <th className="px-6 py-4">Tujuan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500">10:30 WIB</td>
                <td className="px-6 py-4 font-medium text-slate-900">Siti Aminah</td>
                <td className="px-6 py-4">Konsultasi KK</td>
                <td className="px-6 py-4">
                  <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Menunggu</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium mr-3">Layani</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
