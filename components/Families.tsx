
import React from 'react';
import { Search, Plus, Home, Users, MoreVertical, Eye, FileEdit, Trash2 } from 'lucide-react';
import { FamilyCard, Citizen } from '../types';

interface FamiliesProps {
  families: FamilyCard[];
  citizens: Citizen[];
}

const Families: React.FC<FamiliesProps> = ({ families, citizens }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredFamilies = families.filter(f => 
    f.noKk.includes(searchTerm) || 
    f.headName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari No. KK atau Kepala Keluarga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <button className="flex items-center justify-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
          <Plus size={18} />
          <span>Tambah KK Baru</span>
        </button>
      </div>

      {/* Families Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">No. Kartu Keluarga</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kepala Keluarga</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Alamat</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">RT/RW</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Jml Anggota</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFamilies.map((family) => {
                const memberCount = citizens.filter(c => c.familyCardId === family.id).length;
                
                return (
                  <tr key={family.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                          <Home size={18} />
                        </div>
                        <span className="font-mono font-bold text-slate-700 tracking-tight">{family.noKk}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{family.headName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {family.address}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                        {family.rt} / {family.rw}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <Users size={14} className="text-indigo-400" />
                        <span className="font-bold text-indigo-600">{memberCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button title="Lihat Detail" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Eye size={18} />
                        </button>
                        <button title="Edit Data" className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                          <FileEdit size={18} />
                        </button>
                        <button title="Hapus KK" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredFamilies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                      <Users size={48} strokeWidth={1} />
                      <p>Data Kartu Keluarga tidak ditemukan.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-start space-x-4">
        <div className="p-2 bg-indigo-600 text-white rounded-lg">
          <Users size={20} />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900">Statistik Keluarga</h4>
          <p className="text-sm text-indigo-700 leading-relaxed">
            Terdapat total <strong>{families.length}</strong> Kartu Keluarga terdaftar di wilayah RT 01. 
            Gunakan fitur ini untuk memantau komposisi rumah tangga dan validitas data kependudukan secara berkala.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Families;
