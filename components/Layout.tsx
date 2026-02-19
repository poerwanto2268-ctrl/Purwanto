
import React from 'react';
import { LayoutDashboard, Users, CreditCard, FileText, Bot, LogOut, Menu, X, Wallet } from 'lucide-react';
import { ViewMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: ViewMode.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewMode.CITIZENS, label: 'Data Warga', icon: Users },
    { id: ViewMode.FAMILIES, label: 'Kartu Keluarga', icon: CreditCard },
    { id: ViewMode.TREASURY, label: 'Kas RT', icon: Wallet },
    { id: ViewMode.LETTERS, label: 'Administrasi Surat', icon: FileText },
    { id: ViewMode.AI_TOOLS, label: 'Bantuan AI', icon: Bot },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-indigo-900 text-white transition-all duration-300">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight">SIK-RT/RW <span className="text-indigo-300">Digital</span></h1>
          <p className="text-xs text-indigo-400 mt-1">Management System v1.0</p>
        </div>
        
        <nav className="flex-1 mt-4 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id ? 'bg-indigo-700 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button className="flex items-center space-x-3 px-4 py-3 text-indigo-300 hover:text-white transition-colors w-full">
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-indigo-900 text-white rounded-lg shadow-lg"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-indigo-900 z-40 flex flex-col p-8 pt-16 animate-in slide-in-from-right duration-300">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-4 text-white text-xl py-4 border-b border-indigo-800"
            >
              <item.icon size={24} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-semibold text-slate-700">
            {menuItems.find(i => i.id === activeView)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Bpk. Admin RT 01</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Ketua RT</p>
            </div>
            <img src="https://picsum.photos/seed/admin/40/40" className="w-10 h-10 rounded-full border-2 border-indigo-100" />
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
