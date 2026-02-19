
import React from 'react';
/* Fix: Added missing 'Bot' import from 'lucide-react' */
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Search, Filter, History, TrendingUp, Sparkles, Loader2, Bot } from 'lucide-react';
import { Transaction } from '../types';
import { GoogleGenAI } from "@google/genai";

interface TreasuryProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
}

const Treasury: React.FC<TreasuryProps> = ({ transactions, onAddTransaction }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loadingAI, setLoadingAI] = React.useState(false);
  const [aiInsight, setAiInsight] = React.useState<string | null>(null);

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getFinancialInsight = async () => {
    setLoadingAI(true);
    /* Fix: Consistently use the required initialization pattern for GoogleGenAI */
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisis data keuangan RT berikut: Saldo: Rp${balance}, Pemasukan: Rp${totalIncome}, Pengeluaran: Rp${totalExpense}. 
        Daftar transaksi terakhir: ${JSON.stringify(transactions.slice(0, 5))}.
        Berikan evaluasi kesehatan keuangan dan saran penghematan atau alokasi dana yang bijak dalam 3 poin singkat. Bahasa Indonesia santun.`
      });
      /* Fix: Accessed .text property directly as per guidelines */
      setAiInsight(response.text || null);
    } catch (e) {
      setAiInsight("Gagal memuat analisis keuangan.");
    } finally {
      setLoadingAI(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 -mr-8 -mt-8 rounded-full opacity-50"></div>
          <div className="relative flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Saldo Saat Ini</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Wallet size={20} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">{formatCurrency(balance)}</h2>
            <div className="mt-4 flex items-center text-xs text-slate-500">
              <TrendingUp size={14} className="mr-1 text-emerald-500" />
              <span>Update hari ini</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Pemasukan</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</h2>
          <p className="text-xs text-slate-500 mt-4">Total dari iuran & donasi</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Pengeluaran</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ArrowDownRight size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-rose-600">{formatCurrency(totalExpense)}</h2>
          <p className="text-xs text-slate-500 mt-4">Biaya operasional & sosial</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Transaction History */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <History className="text-indigo-600" size={20} />
              <h3 className="text-lg font-bold">Riwayat Transaksi</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 text-sm">{t.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                      Tidak ada transaksi ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Actions & AI */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {/* Fix: 'Bot' is now correctly imported and available */}
                    <Bot size={20} className="text-white" />
                  </div>
                  <h4 className="font-bold">Smart Finance Advisor</h4>
                </div>
                {aiInsight ? (
                  <div className="text-xs leading-relaxed text-indigo-100 mb-6 bg-white/10 p-4 rounded-xl border border-white/10">
                    {aiInsight.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}
                  </div>
                ) : (
                  <p className="text-sm text-indigo-200 mb-6 italic">Gunakan AI untuk menganalisis arus kas RT Anda.</p>
                )}
                <button 
                  onClick={getFinancialInsight}
                  disabled={loadingAI}
                  className="w-full flex items-center justify-center space-x-2 bg-white text-indigo-900 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50"
                >
                  {loadingAI ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  <span>Dapatkan Analisis AI</span>
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Plus size={20} />
              </div>
              <h3 className="font-bold">Input Transaksi</h3>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Jenis</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button className="flex-1 py-2 text-xs font-bold bg-white text-indigo-600 rounded-lg shadow-sm">PEMASUKAN</button>
                  <button className="flex-1 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">PENGELUARAN</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nominal (Rp)</label>
                <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Keterangan</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="Contoh: Iuran Warga Blk A" />
              </div>
              <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-all text-sm uppercase tracking-wide">
                Simpan Transaksi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treasury;
