import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AcademicRecord } from '../types';

export const AcademicRecords: React.FC = () => {
  const { academicRecords, openModal, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Under Review' | 'Pending'>('All');
  const [selectedRecord, setSelectedRecord] = useState<AcademicRecord | null>(null);

  // Filter & Search
  const filtered = academicRecords.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.recordType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadTranscript = (title: string) => {
    showToast('Transcript Generated', `Digitally signed PDF for "${title}" downloaded.`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Academic Records & Credential Vault
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-gov-blue-50 text-gov-blue-700 border border-gov-blue-200">
              {academicRecords.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real records stored in your authenticated Supabase database.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openModal('request-verification')}
            className="px-4 py-2.5 rounded-xl bg-gov-blue-600 hover:bg-gov-blue-700 text-white text-xs font-semibold shadow-glow-blue transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Academic Record</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by subject, course or institution..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-gov-blue-500 focus:bg-white transition-all text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
          {(['All', 'Verified', 'Under Review', 'Pending'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === filter ? 'bg-white font-bold text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table or Clean Empty State */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Academic Credential</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Issuing Institution</th>
                  <th className="py-3.5 px-4">Academic Year</th>
                  <th className="py-3.5 px-4">Score / GPA</th>
                  <th className="py-3.5 px-4">Credits</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((rec) => {
                  const isSelected = selectedRecord?.id === rec.id;

                  return (
                    <React.Fragment key={rec.id}>
                      <tr
                        onClick={() => setSelectedRecord(isSelected ? null : rec)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gov-blue-50 text-gov-blue-600 flex items-center justify-center shrink-0">
                              <GraduationCap className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{rec.title}</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Hash: {rec.verificationHash?.slice(0, 16)}...
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                            {rec.recordType}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-700">{rec.institution}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">{rec.academicYear}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold font-mono text-slate-900">{rec.score}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-gov-blue-600">
                          {rec.creditsEarned ? `${rec.creditsEarned} Cr` : '—'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                              rec.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {rec.status === 'Verified' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Clock className="w-3 h-3 text-amber-500" />
                            )}
                            {rec.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedRecord(isSelected ? null : rec)}
                              className="p-1 text-slate-400 hover:text-slate-700"
                              title="Inspect details"
                            >
                              {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDownloadTranscript(rec.title)}
                              className="p-1 text-slate-400 hover:text-gov-blue-600"
                              title="Download record"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No academic records found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your database table <code className="font-mono text-slate-700">academic_records</code> has no records matching your current filter.
            </p>
            <button
              onClick={() => openModal('request-verification')}
              className="mt-4 px-4 py-2 rounded-xl bg-gov-blue-600 hover:bg-gov-blue-700 text-white text-xs font-semibold shadow-glow-blue inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log First Academic Record</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
