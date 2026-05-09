import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { CreditCard, TrendingUp, Users, Clock, CheckCircle, Search, Filter, Download, ArrowUpRight, X, Save, Loader2, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function KeuanganPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newBill, setNewBill] = useState({
    resident_id: '',
    month: '',
    amount: '' as any,
    type: 'Iuran Bulanan'
  });

  const formatRupiah = (value: string) => {
    if (!value) return '';
    const numberString = value.toString().replace(/[^,\d]/g, '');
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    return split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
  };

  const parseNumber = (formattedValue: string) => {
    if (!formattedValue) return 0;
    return parseInt(formattedValue.toString().replace(/\./g, '')) || 0;
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch residents for dropdown (Harus dimuat duluan)
      const { data: residentData, error: rError } = await supabase
        .from('residents')
        .select('id, full_name, nik, families(no_kk)')
        .order('full_name');
      if (residentData) setResidents(residentData);

      // 2. Fetch payments (Manual mapping)
      const { data: paymentData, error: pError } = await supabase
        .from('dues_payments')
        .select('*')
        .order('payment_date', { ascending: false });
      
      if (pError) throw pError;
      
      const mappedPayments = (paymentData || []).map(payment => ({
        ...payment,
        residents: residentData?.find(r => r.id === payment.resident_id) || null
      }));

      setPayments(mappedPayments);
      
    } catch (error: any) {
      console.error("Keuangan Fetch Error:", error);
      alert("Gagal sinkron data keuangan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBill.resident_id) return alert("Pilih warga terlebih dahulu!");
    
    setIsSaving(true);
    try {
      const { error } = await supabase.from('dues_payments').insert([{
        resident_id: newBill.resident_id,
        month: newBill.month,
        amount: parseNumber(newBill.amount.toString()),
        status: 'pending',
        method: newBill.type // Menggunakan jenis tagihan sebagai method/keterangan
      }]);
      if (error) throw error;
      alert("Tagihan iuran berhasil dibuat!");
      setIsModalOpen(false);
      setNewBill({ resident_id: '', month: '', amount: '', type: 'Iuran Bulanan' });
      fetchAllData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('dues_payments')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      fetchAllData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const totalIncome = payments.reduce((acc, curr) => acc + (curr.status === 'success' ? curr.amount : 0), 0);
  const filteredPayments = payments.filter(p => 
    p.residents?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.month?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Manajemen Keuangan</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Laporan Iuran Warga Real-time</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
            <Download className="h-4 w-4" /> Export Excel
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 active:scale-95 transition-all"
          >
            + BUAT TAGIHAN BARU
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<TrendingUp className="text-emerald-500" />} label="Total Kas" value={`Rp ${totalIncome.toLocaleString('id-ID')}`} trend="+12% bulan ini" color="bg-emerald-500" />
        <StatCard icon={<CreditCard className="text-blue-500" />} label="Menunggu Pembayaran" value={payments.filter(p => p.status === 'pending').length} trend="Total iuran tertunda" color="bg-amber-500" />
        <StatCard icon={<CheckCircle className="text-emerald-500" />} label="Total Lunas" value={payments.filter(p => p.status === 'success').length} trend="Transaksi sukses" color="bg-emerald-500" />
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Cari nama warga..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 font-black text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-8 py-5">Tanggal</th>
                <th className="px-8 py-5">Nama Warga</th>
                <th className="px-8 py-5">Periode</th>
                <th className="px-8 py-5">Nominal</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-bold italic">Sinkronisasi data...</td></tr>
              ) : filteredPayments.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-16 text-center text-slate-500 font-bold">Belum ada data keuangan</td></tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {new Date(payment.payment_date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                        Pukul {new Date(payment.payment_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{payment.residents?.full_name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">
                        NIK: {payment.residents?.nik?.startsWith('G-') ? payment.residents.nik.substring(2) : payment.residents?.nik}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600 uppercase">{payment.month}</td>
                    <td className="px-8 py-5 font-black text-emerald-600 text-sm">Rp {payment.amount?.toLocaleString('id-ID')}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        payment.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                        payment.status === 'waiting_verification' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {payment.status === 'success' ? 'LUNAS' : 
                         payment.status === 'waiting_verification' ? 'PERLU VERIFIKASI' : 'BELUM BAYAR'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {payment.status === 'waiting_verification' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(payment.id, 'success')}
                              className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-colors"
                              title="Setujui Pembayaran"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(payment.id, 'pending')}
                              className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                              title="Tolak Pembayaran"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-slate-400"><ArrowUpRight className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Buat Tagihan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Buat Tagihan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateBill} className="p-8 space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Pilih Warga</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <select 
                    required
                    value={newBill.resident_id}
                    onChange={(e) => setNewBill({...newBill, resident_id: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Pilih Nama Warga --</option>
                    {residents.map(r => {
                      // Hapus awalan 'G-' dari NIK jika ada agar rapi
                      const cleanNik = r.nik?.startsWith('G-') ? r.nik.substring(2) : r.nik;
                      
                      return (
                        <option key={r.id} value={r.id}>
                          {r.full_name} (NIK: {cleanNik})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-full">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Jenis Tagihan</label>
                  <input 
                    type="text" 
                    value={newBill.type} 
                    onChange={(e) => setNewBill({...newBill, type: e.target.value})} 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Contoh: Iuran Keamanan, Kebersihan, dll" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Periode Bulan</label>
                  <input type="text" value={newBill.month} onChange={(e) => setNewBill({...newBill, month: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500" placeholder="Mei 2024" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nominal (Rp)</label>
                  <input 
                    type="text" 
                    value={formatRupiah(newBill.amount.toString())} 
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\./g, '');
                      if (!isNaN(Number(rawValue)) || rawValue === '') {
                        setNewBill({...newBill, amount: rawValue});
                      }
                    }} 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Contoh: 50.000"
                  />
                </div>
              </div>

              <button type="submit" disabled={isSaving} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                SIMPAN TAGIHAN
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">{icon}</div>
          <span className={`px-2 py-1 rounded-lg text-[9px] font-black text-white ${color}`}>{trend}</span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h3>
      </CardContent>
    </Card>
  );
}
