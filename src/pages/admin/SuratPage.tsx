import { Card } from '../../components/ui/Card';

export default function SuratPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Manajemen Surat Pengantar</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola dan verifikasi permohonan surat dari warga</p>
        </div>
      </div>
      
      <Card>
        <div className="p-6 border-b border-slate-200 flex gap-4">
          <input 
            type="text" 
            placeholder="Cari nama pemohon..." 
            className="flex-1 max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Semua Status</option>
            <option value="requested">Menunggu Proses</option>
            <option value="processed">Sedang Diproses</option>
            <option value="ready">Siap Diambil</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Tanggal Masuk</th>
                <th className="px-6 py-4">Pemohon</th>
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Keperluan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500">08 Mei 2026</td>
                <td className="px-6 py-4 font-medium text-slate-900">Ahmad Fauzi</td>
                <td className="px-6 py-4">Surat Pengantar Pembuatan KTP</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">KTP Hilang, perlu pengantar ke Kelurahan</td>
                <td className="px-6 py-4">
                  <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Menunggu</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium mr-3">Proses</button>
                  <button className="text-rose-600 hover:text-rose-800 font-medium">Tolak</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
