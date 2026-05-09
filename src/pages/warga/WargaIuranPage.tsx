import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { CreditCard, Wallet, Landmark, QrCode, CheckCircle, Clock, Loader2, Zap, ArrowRight, ShieldCheck, AlertCircle, Calendar, Smartphone, Banknote, Timer } from 'lucide-react';

export default function WargaIuranPage() {
  const { resident } = useOutletContext<{ resident: any }>();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('Transfer Bank');

  useEffect(() => {
    if (resident?.id) fetchPayments();
  }, [resident]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const famId = resident?.family_id;
      if (!famId) {
        setPayments([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('family_id', famId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPayments(data || []);
      
      const pending = (data || []).find(p => p.status === 'pending');
      if (pending) setSelectedBill(pending);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pendingBills = payments.filter(p => p.status === 'pending');
  const waitingVerification = payments.filter(p => p.status === 'waiting_verification');
  const successPayments = payments.filter(p => p.status === 'success' || p.status === 'verified');
  const totalOutstanding = pendingBills.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0);

  const handlePay = async () => {
    if (!selectedBill) return;
    setIsPaying(true);
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'waiting_verification'
        })
        .eq('id', selectedBill.id);
      
      if (error) throw error;
      alert(`Konfirmasi ${selectedMethod} Terkirim! Mohon tunggu verifikasi Admin.`);
      setSelectedBill(null);
      fetchPayments();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="px-2">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Pembayaran Iuran</h2>
        <p className="text-[10px] text-slate-900 dark:text-white/70 font-black mt-1 uppercase tracking-widest">Digital RT Management System</p>
      </div>

      {/* Main Dashboard */}
      <Card className="border-none bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className={`p-8 text-white relative overflow-hidden transition-colors duration-700 ${totalOutstanding === 0 && waitingVerification.length === 0 ? 'bg-emerald-500' : waitingVerification.length > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}>
          <Zap className="absolute -right-4 -top-4 h-32 w-32 text-white/10 rotate-12" />
          <div className="relative z-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">
              {waitingVerification.length > 0 ? 'Sedang Diverifikasi' : selectedBill ? 'Jumlah yang akan dibayar' : 'Total Tagihan Anda'}
            </p>
            <h3 className="text-5xl font-black tracking-tighter">
              Rp {(selectedBill ? selectedBill.amount_paid : totalOutstanding).toLocaleString('id-ID')}
            </h3>
            <div className="flex items-center gap-2 mt-4 mx-auto bg-white/20 w-fit px-4 py-2 rounded-full backdrop-blur-md">
              {waitingVerification.length > 0 ? (
                <><Timer className="h-4 w-4 animate-pulse" /> <span className="text-[10px] font-black uppercase">Menunggu Admin</span></>
              ) : totalOutstanding === 0 ? (
                <><ShieldCheck className="h-4 w-4" /> <span className="text-[10px] font-black uppercase">Semua Tagihan Lunas</span></>
              ) : (
                <><AlertCircle className="h-4 w-4" /> <span className="text-[10px] font-black uppercase">{pendingBills.length} Tagihan Belum Bayar</span></>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-8 space-y-8">
          {pendingBills.length > 0 ? (
            <>
              {/* Step 1: Select Bill */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">1</div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Pilih Tagihan</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {pendingBills.map((bill) => (
                    <button 
                      key={bill.id}
                      onClick={() => setSelectedBill(bill)}
                      className={`p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${
                        selectedBill?.id === bill.id 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5' 
                        : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className={`h-5 w-5 ${selectedBill?.id === bill.id ? 'text-emerald-500' : 'text-slate-300'}`} />
                        <span className={`text-sm font-black uppercase ${selectedBill?.id === bill.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}`}>{bill.title || 'IURAN BULANAN'}</span>
                      </div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">Rp {(bill.amount_paid || 0).toLocaleString('id-ID')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Method */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">2</div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Metode Pembayaran</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MethodOption active={selectedMethod === 'Transfer Bank'} onClick={() => setSelectedMethod('Transfer Bank')} icon={<Landmark />} label="Transfer Bank" color="blue" />
                  <MethodOption active={selectedMethod === 'Tunai'} onClick={() => setSelectedMethod('Tunai')} icon={<Banknote />} label="Bayar Tunai" color="amber" />
                </div>
              </div>

              {/* Step 3: Action */}
              <div className="pt-4 space-y-4">
                {selectedMethod === 'Transfer Bank' ? (
                  <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Instruksi Transfer</p>
                    <p className="text-lg font-black text-slate-800 dark:text-white">123-456-7890</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">BANK BCA • A/N KAS RT DIGITAL</p>
                  </div>
                ) : (
                  <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-black text-amber-600 uppercase mb-2">Instruksi Tunai</p>
                    <p className="text-sm font-black text-slate-800 dark:text-white">Serahkan iuran ke Pengurus RT</p>
                  </div>
                )}
                
                <button 
                  onClick={handlePay}
                  disabled={isPaying || !selectedBill}
                  className={`w-full py-5 text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all ${selectedMethod === 'Transfer Bank' ? 'bg-blue-500 shadow-blue-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}
                >
                  {isPaying ? <Loader2 className="h-6 w-6 animate-spin" /> : <CreditCard className="h-6 w-6" />}
                  BAYAR SEKARANG (Rp {selectedBill?.amount_paid?.toLocaleString('id-ID')})
                </button>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Sistem Cicil Aktif: Pilih tagihan lain untuk mencicil</p>
              </div>
            </>
          ) : waitingVerification.length > 0 ? (
             <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="h-24 w-24 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500">
                <Timer className="h-12 w-12 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Sedang Diverifikasi</h4>
                <p className="text-xs text-slate-500 font-bold max-w-[200px] mx-auto mt-2 leading-relaxed">Admin akan segera mengecek pembayaran Anda. Mohon tunggu sejenak.</p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="h-24 w-24 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle className="h-12 w-12" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Tagihan Anda Lunas</h4>
                <p className="text-xs text-slate-500 font-bold max-w-[200px] mx-auto mt-2 leading-relaxed">Terima kasih atas kontribusi Anda.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <div className="space-y-4">
        <h3 className="px-2 text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Riwayat Pembayaran</h3>
        {loading ? (
          <div className="text-center py-10 italic text-slate-400 font-bold">Sinkronisasi...</div>
        ) : (
          [...waitingVerification, ...successPayments].map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 flex justify-between items-center mx-2 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${p.status === 'waiting_verification' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  {p.status === 'waiting_verification' ? <Timer className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" />}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white text-sm">{p.title || 'IURAN BULANAN'}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {p.method || 'Digital'} • {new Date(p.created_at).toLocaleDateString('id-ID')} {new Date(p.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-800 dark:text-white text-sm">Rp {(p.amount_paid || 0).toLocaleString('id-ID')}</p>
                <span className={`text-[9px] font-black uppercase ${p.status === 'waiting_verification' ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {p.status === 'waiting_verification' ? 'DIVERIFIKASI' : 'SUKSES'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MethodOption({ active, onClick, icon, label, color }: any) {
  const colorClasses: any = {
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-500',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-900/10 border-amber-500'
  };

  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all active:scale-95 ${
        active ? colorClasses[color] : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 grayscale'
      }`}
    >
      <div className="h-8 w-8 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}
