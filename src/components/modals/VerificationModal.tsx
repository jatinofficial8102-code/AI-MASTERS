import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, X, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationStep } from '../../types';

export const VerificationModal: React.FC = () => {
  const { closeModal, modalData } = useApp();
  const step: VerificationStep = modalData || {
    id: 1,
    title: 'Verification Step Audit',
    subtitle: 'Official Status',
    status: 'Pending',
    remarks: 'Record verification status based on trusted database attributes.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 text-slate-900 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Verification Step Audit Detail</h3>
              <p className="text-[11px] text-slate-500">Stage 0{step.id}: {step.title}</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              step.status === 'Completed'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : step.status === 'In Progress'
                ? 'bg-sky-50 border-sky-200 text-sky-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {step.status === 'Completed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : step.status === 'In Progress' ? (
              <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Status: {step.status}
              </h4>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                {step.remarks}
              </p>
            </div>
          </div>

          {/* Audit Details Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Stage Subtitle</span>
              <span className="font-semibold text-slate-900">{step.subtitle}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Certified / Authenticated By</span>
              <span className="font-semibold text-slate-900 text-right">{step.verifiedBy || 'Pending Official'}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Timestamp</span>
              <span className="font-mono text-slate-700">{step.completedDate || 'Awaiting completion'}</span>
            </div>

            {step.securityHash && (
              <div className="pt-1">
                <span className="text-slate-500 font-medium block mb-1">Cryptographic Ledger Hash</span>
                <div className="font-mono text-[11px] bg-slate-900 text-gov-cyan-300 p-2.5 rounded-xl break-all">
                  {step.securityHash}
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-600 bg-slate-100 p-3 rounded-2xl flex items-center gap-2">
            <Award className="w-4 h-4 text-gov-blue-600 shrink-0" />
            <span>
              Real-time audit record synced with your Supabase session.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={closeModal}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            Close Audit View
          </button>
        </div>
      </motion.div>
    </div>
  );
};
