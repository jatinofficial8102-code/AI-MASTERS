import React from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ShieldAlert, X, Building, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConsentItem } from '../../types';

export const ConsentReviewModal: React.FC = () => {
  const { closeModal, modalData, toggleConsentStatus } = useApp();
  const consent: ConsentItem = modalData;

  if (!consent) return null;

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
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Consent Authorization Review</h3>
              <p className="text-[11px] text-slate-500">Data Sharing & Access Control in Supabase</p>
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
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Building className="w-4 h-4 text-gov-blue-600" />
              <span>{consent.requesterName}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Category: <b className="text-slate-700">{consent.requesterType}</b>
            </p>
            <div className="mt-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
              <b>Declared Purpose:</b> {consent.purpose}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Accessible Data Attributes
            </h4>
            <div className="flex flex-wrap gap-2">
              {consent.requestedFields.map((field) => (
                <span
                  key={field}
                  className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-blue-500" />
                  {field}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Granted Date</span>
              <span className="font-semibold text-slate-800">{consent.grantedDate}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Valid Until</span>
              <span className="font-semibold text-slate-800">{consent.expiryDate}</span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Under AICTE National Academic Registry privacy bylaws, you retain irrevocable authority to terminate third-party access anytime.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              toggleConsentStatus(consent.id);
              closeModal();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              consent.status === 'Active'
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow-emerald'
            }`}
          >
            {consent.status === 'Active' ? 'Revoke Access Immediately' : 'Re-Authorize Access'}
          </button>

          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
