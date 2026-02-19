
import React from 'react';
import { FileText, Printer, Sparkles, Loader2, User, ChevronRight } from 'lucide-react';
import { Citizen } from '../types';
import { generateLetterContent } from '../services/geminiService';

interface LettersProps {
  citizens: Citizen[];
}

const Letters: React.FC<LettersProps> = ({ citizens }) => {
  const [selectedCitizenId, setSelectedCitizenId] = React.useState('');
  const [letterType, setLetterType] = React.useState('Surat Pengantar');
  const [purpose, setPurpose] = React.useState('');
  const [generatedContent, setGeneratedContent] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const selectedCitizen = citizens.find(c => c.id === selectedCitizenId);

  const handleGenerate = async () => {
    if (!selectedCitizen || !purpose) return;
    setLoading(true);
    try {
      const content = await generateLetterContent(letterType, selectedCitizen.name, purpose);
      setGeneratedContent(content || '');
    } catch (error) {
      console.error("Error generating letter:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
            <FileText className="text-indigo-600" size={20} />
            <span>Buat Surat Baru</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Pilih Warga</label>
              <select 
                value={selectedCitizenId}
                onChange={(e) => setSelectedCitizenId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option value="">-- Pilih Nama Warga --</option>
                {citizens.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.nik})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Jenis Surat</label>
              <select 
                value={letterType}
                onChange={(e) => setLetterType(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option>Surat Pengantar</option>
                <option>Surat Keterangan Domisili</option>
                <option>Surat Keterangan Tidak Mampu</option>
                <option>Surat Kematian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Keperluan / Alasan</label>
              <textarea 
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Contoh: Mengurus pembuatan SKCK di Polsek..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !selectedCitizenId || !purpose}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              <span>Generate Draf AI</span>
            </button>
          </div>
        </div>

        {selectedCitizen && (
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center">
              <User size={16} className="mr-2" /> Detail Pemohon
            </h4>
            <div className="space-y-2 text-sm text-indigo-800">
              <div className="flex justify-between">
                <span className="opacity-70">NIK</span>
                <span className="font-medium">{selectedCitizen.nik}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Alamat</span>
                <span className="font-medium">{selectedCitizen.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Pekerjaan</span>
                <span className="font-medium">{selectedCitizen.occupation}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-bold text-slate-700">Preview Dokumen</h3>
          {generatedContent && (
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all font-medium text-sm"
            >
              <Printer size={16} />
              <span>Cetak Surat</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 min-h-[700px] print:shadow-none print:border-none" id="letter-preview">
          {/* Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-8">
            <h1 className="text-xl font-bold uppercase">Pemerintah Kota Administrasi Jakarta Selatan</h1>
            <h2 className="text-lg font-bold uppercase">Kecamatan Jagakarsa - Kelurahan Lenteng Agung</h2>
            <h3 className="text-md font-bold uppercase">PENGURUS RUKUN TETANGGA 01 / RW 05</h3>
            <p className="text-xs italic mt-1">Alamat: Jl. Melati No. 10, Jakarta Selatan 12610</p>
          </div>

          {!generatedContent && !loading ? (
            <div className="flex flex-col items-center justify-center h-96 text-slate-300 space-y-4">
              <FileText size={64} strokeWidth={1} />
              <p className="max-w-xs text-center">Silakan lengkapi form di samping dan klik Generate untuk melihat preview surat.</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center h-96 text-indigo-400 space-y-4">
              <Loader2 size={48} className="animate-spin" />
              <p className="font-medium">AI sedang menyusun kata-kata formal...</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-700">
              <div className="text-center mb-8">
                <h4 className="font-bold underline uppercase decoration-1 underline-offset-4">{letterType.toUpperCase()}</h4>
                <p className="text-sm">Nomor: 045 / RT01 / RW05 / {new Date().getMonth() + 1} / {new Date().getFullYear()}</p>
              </div>

              <div className="space-y-6 text-slate-800 leading-relaxed text-justify">
                <p>Yang bertanda tangan di bawah ini, Ketua RT 01 / RW 05 Kelurahan Lenteng Agung, menerangkan bahwa:</p>
                
                <div className="grid grid-cols-12 gap-y-2 ml-4">
                  <div className="col-span-4">Nama</div>
                  <div className="col-span-1">:</div>
                  <div className="col-span-7 font-bold">{selectedCitizen?.name}</div>

                  <div className="col-span-4">NIK</div>
                  <div className="col-span-1">:</div>
                  <div className="col-span-7">{selectedCitizen?.nik}</div>

                  <div className="col-span-4">Tempat, Tgl Lahir</div>
                  <div className="col-span-1">:</div>
                  <div className="col-span-7">{selectedCitizen?.pob}, {selectedCitizen?.dob}</div>

                  <div className="col-span-4">Alamat</div>
                  <div className="col-span-1">:</div>
                  <div className="col-span-7">{selectedCitizen?.address}</div>
                </div>

                <div className="prose prose-slate max-w-none whitespace-pre-wrap py-4">
                  {generatedContent}
                </div>

                <p>Demikian surat keterangan ini kami buat untuk dapat dipergunakan sebagaimana mestinya.</p>
              </div>

              {/* Signature Section */}
              <div className="mt-16 flex justify-between">
                <div className="w-48 text-center invisible">
                  {/* Left spacer for balance if needed */}
                  <p>Mengetahui,</p>
                  <p>Ketua RW 05</p>
                  <div className="h-24"></div>
                  <p className="font-bold">( ............................ )</p>
                </div>
                
                <div className="w-64 text-center">
                  <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold">Ketua RT 01</p>
                  <div className="h-24 flex items-center justify-center">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=VALID-SIK-RT01" alt="QR Signature" className="opacity-20" />
                  </div>
                  <p className="font-bold underline decoration-1">Bpk. Admin RT</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Letters;
