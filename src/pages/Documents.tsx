import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Trash2,
  Download,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentItem } from '../types';

export const Documents: React.FC = () => {
  const { documents, deleteDocument, openModal, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Academic', 'Identity', 'Certificate'];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (doc: DocumentItem) => {
    showToast('Document Downloaded', `Encrypted copy of "${doc.name}" downloaded.`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header & Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Encrypted Document Repository
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {documents.length} Files
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Secure storage backed by Supabase storage with Row Level Security.
          </p>
        </div>

        <button
          onClick={() => openModal('upload-document')}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-gov-blue-600 hover:bg-gov-blue-700 text-white text-xs font-semibold shadow-glow-blue transition-all flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by filename or issuer..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-gov-blue-500 focus:bg-white transition-all text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-gov-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid or Empty State */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const isVerified = doc.status === 'Verified';

            return (
              <motion.div
                key={doc.id}
                whileHover={{ y: -3 }}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-card flex flex-col justify-between group hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gov-blue-50 text-gov-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isVerified
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isVerified ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-500" />
                      )}
                      {doc.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                    {doc.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    Issuer: {doc.issuer}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[10px] text-slate-500 font-mono">
                    <div className="flex justify-between">
                      <span>Size / Type:</span>
                      <span className="text-slate-700 font-semibold">{doc.fileSize} • {doc.fileType.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between truncate">
                      <span>Hash:</span>
                      <span className="text-gov-blue-700 truncate max-w-[150px]">{doc.verificationHash}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">Uploaded {doc.uploadedAt}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 text-slate-400 hover:text-gov-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-14 text-center bg-white rounded-3xl border border-slate-200 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No documents found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't uploaded any documents yet. Drag and drop marksheet PDFs or identity proofs to store them securely.
          </p>
          <button
            onClick={() => openModal('upload-document')}
            className="mt-4 px-4 py-2 rounded-xl bg-gov-blue-600 hover:bg-gov-blue-700 text-white text-xs font-semibold shadow-glow-blue inline-flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload First Document</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};
