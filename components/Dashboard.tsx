
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, Home, FileClock, Sparkles, Wallet } from 'lucide-react';
import { Citizen, FamilyCard, Transaction } from '../types';
import { getDemographicInsight } from '../services/geminiService';

interface DashboardProps {
  citizens: Citizen[];
  families: FamilyCard[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ citizens, families, transactions }) => {
  const [insight, setInsight] = React.useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = React.useState(false);

  const maleCount = citizens.filter(c => c.gender === 'Laki-laki').length;
  const femaleCount = citizens.filter(c => c.gender === 'Perempuan').length;

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const ageData = [
    { name: 'Anak-anak', value: citizens.filter(c => {
      const age = new Date().getFullYear() - new Date(c.dob).getFullYear();
      return age < 13;
    }).length },
    { name: 'Remaja', value: citizens.filter(c => {
      const age = new Date().getFullYear() - new Date(c.dob).getFullYear();
      return age >= 13 && age < 20;
    }).length },
    { name: 'Dewasa', value: citizens.filter(c => {
      const age = new Date().getFullYear() - new Date(c.dob).getFullYear();
      return age >= 20 && age < 60;
    }).length },
    { name: 'Lansia', value: citizens.filter(c => {
      const age = new Date().getFullYear() - new Date(c.dob).getFullYear();
      return age >= 60;
    }).length },
  ];

  const genderData = [
    { name: 'Laki-laki', value: maleCount },
    { name: 'Perempuan', value: femaleCount },
  ];

  const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981'];

  const fetchInsight = async () => {
    setLoadingInsight(true);
    const stats = {
      total_warga: citizens.length,
      pria: maleCount,
      wanita: femaleCount,
      kepala_keluarga: families.length,
      usia: ageData,
      keuangan: {
        saldo: currentBalance,
        pemasukan: totalIncome,
        pengeluaran: totalExpense
      }
    };
    const res = await getDemographicInsight(stats);
    setInsight(res || "Gagal mendapatkan analisis.");
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Warga" value={citizens.length} icon={Users} color="indigo" />
        <StatCard title="Saldo Kas RT" value={formatCurrency(currentBalance)} icon={Wallet} color="emerald" isCurrency={true} />
        <StatCard title="Total KK" value={families.length} icon={Home} color="amber" />
        <StatCard title="Surat Menunggu" value={2} icon={FileClock} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Distribusi Usia Warga</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Proporsi Gender</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around mt-4">
            {genderData.map((item, i) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                <span className="text-sm text-slate-600 font-medium">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold">Analisis AI Smart-RT</h3>
          </div>
          <button 
            onClick={fetchInsight}
            disabled={loadingInsight}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-sm disabled:opacity-50"
          >
            {loadingInsight ? 'Menganalisis...' : insight ? 'Update Analisis' : 'Mulai Analisis'}
          </button>
        </div>
        
        {insight ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="prose prose-invert max-w-none text-indigo-50">
              {insight.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-indigo-100 italic">Klik tombol di atas untuk mendapatkan saran berbasis data untuk lingkungan Anda.</p>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, isCurrency = false }: any) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };
  
  return (
    <div className={`p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center space-x-4`}>
      <div className={`p-3 rounded-xl ${colors[color as keyof typeof colors]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`${isCurrency ? 'text-xl' : 'text-2xl'} font-bold text-slate-800`}>{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
