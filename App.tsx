
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Citizens from './components/Citizens';
import AITools from './components/AITools';
import Letters from './components/Letters';
import Families from './components/Families';
import Treasury from './components/Treasury';
import { ViewMode, Citizen, FamilyCard, Transaction } from './types';

// Initial Mock Data
const MOCK_CITIZENS: Citizen[] = [
  { id: '1', nik: '3201234567890001', name: 'Ahmad Subardjo', pob: 'Jakarta', dob: '1975-06-15', gender: 'Laki-laki', religion: 'Islam', maritalStatus: 'Kawin', occupation: 'Wiraswasta', address: 'Jl. Melati No. 1', isHeadOfFamily: true, familyCardId: 'kk1' },
  { id: '2', nik: '3201234567890002', name: 'Siti Aminah', pob: 'Bandung', dob: '1980-08-20', gender: 'Perempuan', religion: 'Islam', maritalStatus: 'Kawin', occupation: 'IRT', address: 'Jl. Melati No. 1', isHeadOfFamily: false, familyCardId: 'kk1' },
  { id: '3', nik: '3201234567890003', name: 'Budi Santoso', pob: 'Surabaya', dob: '2005-01-10', gender: 'Laki-laki', religion: 'Islam', maritalStatus: 'Belum Kawin', occupation: 'Pelajar', address: 'Jl. Melati No. 1', isHeadOfFamily: false, familyCardId: 'kk1' },
  { id: '4', nik: '3201234567890004', name: 'Linda Permata', pob: 'Semarang', dob: '1992-03-25', gender: 'Perempuan', religion: 'Kristen', maritalStatus: 'Kawin', occupation: 'Karyawan Swasta', address: 'Jl. Melati No. 4', isHeadOfFamily: true, familyCardId: 'kk2' },
];

const MOCK_FAMILIES: FamilyCard[] = [
  { id: 'kk1', noKk: '3201010101010101', headName: 'Ahmad Subardjo', address: 'Jl. Melati No. 1', rt: '01', rw: '05', members: ['1', '2', '3'] },
  { id: 'kk2', noKk: '3201010101010102', headName: 'Linda Permata', address: 'Jl. Melati No. 4', rt: '01', rw: '05', members: ['4'] },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-03-01', description: 'Iuran Sampah & Keamanan (Maret)', amount: 2500000, type: 'INCOME', category: 'Iuran' },
  { id: 't2', date: '2024-03-05', description: 'Perbaikan Lampu Jalan Gg. 3', amount: 450000, type: 'EXPENSE', category: 'Fasilitas' },
  { id: 't3', date: '2024-03-10', description: 'Sumbangan Donatur Bapak H. Mahmud', amount: 1000000, type: 'INCOME', category: 'Donasi' },
  { id: 't4', date: '2024-03-12', description: 'Biaya Fogging Lingkungan', amount: 750000, type: 'EXPENSE', category: 'Kesehatan' },
  { id: 't5', date: '2024-03-15', description: 'Iuran Bulanan (Sisa Warga)', amount: 1200000, type: 'INCOME', category: 'Iuran' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = React.useState<ViewMode>(ViewMode.DASHBOARD);
  const [citizens] = React.useState<Citizen[]>(MOCK_CITIZENS);
  const [families] = React.useState<FamilyCard[]>(MOCK_FAMILIES);
  const [transactions, setTransactions] = React.useState<Transaction[]>(MOCK_TRANSACTIONS);

  const handleAddTransaction = (newT: Omit<Transaction, 'id'>) => {
    const transaction = { ...newT, id: Math.random().toString(36).substring(7) };
    setTransactions(prev => [...prev, transaction]);
  };

  const renderContent = () => {
    switch (activeView) {
      case ViewMode.DASHBOARD:
        return <Dashboard citizens={citizens} families={families} transactions={transactions} />;
      case ViewMode.CITIZENS:
        return <Citizens citizens={citizens} />;
      case ViewMode.AI_TOOLS:
        return <AITools />;
      case ViewMode.LETTERS:
        return <Letters citizens={citizens} />;
      case ViewMode.FAMILIES:
        return <Families families={families} citizens={citizens} />;
      case ViewMode.TREASURY:
        return <Treasury transactions={transactions} onAddTransaction={handleAddTransaction} />;
      default:
        return <Dashboard citizens={citizens} families={families} transactions={transactions} />;
    }
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
