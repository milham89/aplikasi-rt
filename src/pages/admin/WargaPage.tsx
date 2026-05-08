import { Card } from '../../components/ui/Card';

export default function WargaPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy-900">Data Warga</h2>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
          + Tambah Warga
        </button>
      </div>
      
      <Card>
        <div className="p-6 border-b border-slate-200">
          <input 
            type="text" 
            placeholder="Cari nama atau NIK..." 
            className="w-full md:w-80 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">NIK</th>
                <th className="px-6 py-4">Blok / Rumah</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">Budi Santoso</td>
                <td className="px-6 py-4 text-slate-500">3201234567890001</td>
                <td className="px-6 py-4">Blok A No. 12</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Aktif</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium">Detail</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
