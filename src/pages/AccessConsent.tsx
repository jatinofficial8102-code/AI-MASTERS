import React from 'react';
import { motion } from 'framer-motion';
import {
  KeyRound,
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  Building,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccessConsent: React.FC = () => {
  const { consents, toggleConsentStatus, openModal } = useApp();

  const activeConsentsCount = consents.filter((c) => c.status === 'Active').length;

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
              Access & Consent Governance
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {activeConsentsCount} Active Grants
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Zero-Trust Data Protection: You retain sovereign ownership over which recruiters and portals can access your academic records in Supabase.
          </p>
        </div>
      </div>

      {/* Security Info Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-blue-100 text-gov-blue-700 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Cryptographic Consent Token Architecture</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Third parties receive time-bound, read-only ephemeral tokens. Your raw credentials and identity biometrics are never permanently cloned.
            </p>
          </div>
        </div>
      </div>

      {/* Consents List or Empty State */}
      {consents.length > 0 ? (
        <div className="space-y-4">
          {consents.map((item) => {
            const isActive = item.status === 'Active';

            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border bg-white shadow-card transition-all ${
                  isActive ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200/50 opacity-75'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gov-blue-50 text-gov-blue-600 flex items-center justify-center">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{item.requesterName}</h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Category: <b className="text-slate-700">{item.requesterType}</b> • Level:{' '}
                          <span className="font-mono text-gov-blue-600">{item.securityLevel || 'Read-Only Standard'}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 max-w-2xl">
                      <span className="font-semibold text-slate-800">Purpose: </span>
                      {item.purpose}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Shared Attributes:
                      </span>
                      {item.requestedFields.map((field) => (
                        <span
                          key={field}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium flex items-center gap-1"
                        >
                          <Lock className="w-2.5 h-2.5 text-slate-500" />
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Status & Controls */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isActive ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      {item.status}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400">
                      Expiry: {item.expiryDate}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('review-consent', item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Audit</span>
                      </button>

                      <button
                        onClick={() => toggleConsentStatus(item.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow-emerald'
                        }`}
                      >
                        {isActive ? 'Revoke Consent' : 'Re-Authorize'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-14 text-center bg-white rounded-3xl border border-slate-200 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No active consent authorizations</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You have not granted third-party access to any corporate recruiters, scholarship boards, or institutions.
          </p>
        </div>
      )}
    </motion.div>
  );
};
