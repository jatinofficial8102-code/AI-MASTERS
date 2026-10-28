import React from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VerificationCenter: React.FC = () => {
  const { user, academicRecords, documents, verificationSteps, openModal } = useApp();

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
              Verification Center & Audit Registry
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              TAMPER EVIDENT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verification status determined strictly by database records and official cryptographic checks.
          </p>
        </div>

        <button
          onClick={() => openModal('request-verification')}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-glow-emerald transition-all flex items-center gap-2"
        >
          <BadgeCheck className="w-4 h-4" />
          <span>Submit Verification Request</span>
        </button>
      </div>

      {/* Verification Stages Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">National Verification Stages</h3>
          <p className="text-xs text-slate-500">
            Real verification progress derived from your authenticated Supabase identity, uploaded documents, and academic records.
          </p>
        </div>

        <div className="space-y-4">
          {verificationSteps.map((step) => {
            const isCompleted = step.status === 'Completed';
            const isInProgress = step.status === 'In Progress';

            return (
              <div
                key={step.id}
                onClick={() => openModal('verification-details', step)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-card ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                    : isInProgress
                    ? 'bg-sky-50/40 border-sky-300 ring-2 ring-sky-300/20'
                    : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : isInProgress
                          ? 'bg-gov-blue-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isInProgress ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-xs">{step.id}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Stage 0{step.id}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isInProgress
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {step.title} — {step.subtitle}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {step.remarks}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 block">
                      {step.completedDate}
                    </span>
                    <span className="text-xs text-gov-blue-600 font-semibold hover:underline inline-flex items-center gap-1 mt-1">
                      Inspect Audit Trail →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Cryptographic Audit Log / Clean State */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Cryptographic Ledger History</h3>
            <p className="text-xs text-slate-500">
              Immutable timestamps recorded across participating educational nodes.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Auth ID: {user?.id.slice(0, 12)}...
          </span>
        </div>

        {academicRecords.length > 0 || documents.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {academicRecords.map((rec) => (
              <div key={rec.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rec.title}</span>
                    <span className={`text-[10px] px-2 py-0.2 rounded font-semibold border ${
                      rec.status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{rec.institution}</p>
                  <p className="text-[10px] font-mono text-gov-blue-700 truncate max-w-sm sm:max-w-md">
                    Hash: {rec.verificationHash || 'Pending calculation'}
                  </p>
                </div>

                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-600">No cryptographic verification events recorded yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Submit your first academic record or document to initiate ledger timestamps.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
