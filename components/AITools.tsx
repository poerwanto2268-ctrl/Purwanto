
import React from 'react';
/* Fix: 'ClipboardText' is not exported by 'lucide-react', replaced with 'ClipboardList' */
import { Camera, ClipboardList, Sparkles, Send, Loader2 } from 'lucide-react';
import { parseCitizenData } from '../services/geminiService';

const AITools: React.FC = () => {
  const [inputText, setInputText] = React.useState('');
  const [parsedResult, setParsedResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const handleParse = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    const result = await parseCitizenData(inputText);
    setParsedResult(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              {/* Fix: Replaced 'ClipboardText' with 'ClipboardList' */}
              <ClipboardList size={24} />
            </div>
            <h3 className="text-xl font-bold">Smart Data Extractor</h3>
          </div>
          <p className="text-slate-500 mb-6 leading-relaxed">
            Copy-paste teks dari foto KTP atau deskripsi manual warga. AI akan mengekstrak informasi secara otomatis untuk registrasi cepat.
          </p>
          
          <div className="space-y-4">
            <textarea 
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Contoh: NIK 3271234567890001 atas nama Andi lahir di Jakarta 12-05-1990..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <div className="flex space-x-2">
               <button 
                onClick={handleParse}
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                <span>Ekstrak Data</span>
              </button>
              <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">
                <Camera size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-indigo-900 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={120} />
          </div>
          <h4 className="text-lg font-bold mb-2">Tips Efisiensi</h4>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Anda dapat memasukkan beberapa data warga sekaligus dalam satu teks. Pastikan format nama dan NIK jelas agar AI dapat mengidentifikasi setiap individu dengan akurat.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold">Hasil Ekstraksi</h3>
        </div>
        
        <div className="flex-1 p-6 flex flex-col">
          {parsedResult ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <ResultItem label="Nama Lengkap" value={parsedResult.name} />
                <ResultItem label="NIK" value={parsedResult.nik} />
                <ResultItem label="Tempat Lahir" value={parsedResult.pob} />
                <ResultItem label="Tanggal Lahir" value={parsedResult.dob} />
                <ResultItem label="Gender" value={parsedResult.gender} />
                <ResultItem label="Pekerjaan" value={parsedResult.occupation} />
              </div>
              <div className="pt-6 border-t border-slate-100">
                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                  Simpan ke Data Warga
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <Send size={24} />
              </div>
              <p>Belum ada data yang diproses.<br/>Masukkan teks di kolom kiri.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{label}</p>
    <p className="text-slate-700 font-semibold bg-slate-50 p-2 rounded-lg border border-slate-100 min-h-[40px]">
      {value || '-'}
    </p>
  </div>
);

export default AITools;