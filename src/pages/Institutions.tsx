import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Search,
  CheckCircle2,
  MapPin,
  Mail,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { officialInstitutions } from '../data/mockData';

export const Institutions: React.FC = () => {
  const { showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const types = ['All', 'State University', 'IIT', 'NIT'];

  const filtered = officialInstitutions.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'All' || inst.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleContactLiaison = (email: string) => {
    showToast('Liaison Contact', `Inquiry channeled to ${email}`, 'info');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              AICTE-Approved Higher Education Institutions
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-gov-blue-50 text-gov-blue-700 border border-gov-blue-200">
              {officialInstitutions.length} AICTE Nodes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official partner institutions connected via the National Academic Registry for credit verification.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by university name, code or location..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-gov-blue-500 focus:bg-white transition-all text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedType === t
                  ? 'bg-gov-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inst) => {
          return (
            <motion.div
              key={inst.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card flex flex-col justify-between group hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md text-sm shrink-0"
                    style={{ backgroundColor: inst.logoColor || '#2563eb' }}
                  >
                    <Building2 className="w-6 h-6" />
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 block mb-1">
                      NIRF #{inst.nirfRank}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {inst.studentStatus}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-gov-blue-600 transition-colors">
                  {inst.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{inst.city}, {inst.state}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">AICTE Code</span>
                    <span className="font-mono font-bold text-slate-800 text-[10px] truncate block">{inst.code}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">NAAC Rating</span>
                    <span className="font-bold text-slate-800">{inst.naacGrade}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">Academic Programs</span>
                    <span className="font-bold text-slate-800">{inst.programsCount} Approved</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">Registry Node</span>
                    <span className="font-bold text-emerald-700">Online</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Liaison: {inst.liaisonOfficer}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  AICTE Authenticated
                </span>
                <button
                  onClick={() => handleContactLiaison(inst.contactEmail || 'registrar@aicte.gov.in')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-gov-blue-50 text-slate-700 hover:text-gov-blue-700 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Node</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
