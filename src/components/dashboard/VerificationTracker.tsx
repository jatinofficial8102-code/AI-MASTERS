import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationStep } from '../../types';

export const VerificationTracker: React.FC = () => {
  const { verificationSteps, openModal } = useApp();

  const handleStepClick = (step: VerificationStep) => {
    openModal('verification-details', step);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Verification Progress Tracker
            </h3>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-gov-blue-50 text-gov-blue-700 border border-gov-blue-200">
              STAGE 3 OF 4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic ledger tracking AICTE & DigiLocker multi-stage credential authenticity.
          </p>
        </div>

        <button
          onClick={() => openModal('request-verification')}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-gov-blue-50 hover:bg-gov-blue-100 text-gov-blue-700 text-xs font-semibold border border-gov-blue-200 transition-colors flex items-center gap-1.5"
        >
          <span>Audit Status Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4-Step Connected Tracker */}
      <div className="relative">
        {/* Background Connecting Line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 rounded-full hidden md:block" />

        {/* Animated Active Glowing Progress Line (covers steps 1 to 2.5) */}
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '68%' }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute top-5 left-6 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-gov-cyan-400 rounded-full shadow-glow-emerald hidden md:block"
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
          {verificationSteps.map((step, idx) => {
            const isCompleted = step.status === 'Completed';
            const isInProgress = step.status === 'In Progress';
            const isPending = step.status === 'Pending';

            return (
              <motion.div
                key={step.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleStepClick(step)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                    : isInProgress
                    ? 'bg-sky-50/50 border-sky-300 ring-2 ring-sky-400/20 shadow-md'
                    : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300 opacity-80'
                }`}
              >
                <div className="flex items-center md:flex-col md:items-start gap-3">
                  {/* Step Icon Badge */}
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.15 }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isInProgress
                          ? 'bg-gov-cyan-500 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : isInProgress ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </motion.div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Step 0{step.id}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
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

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 flex items-center justify-between">
                  <span className="truncate">
                    {isCompleted
                      ? '✓ DigiLocker Verified'
                      : isInProgress
                      ? '⏳ Dean Seal Pending'
                      : '🔒 Final Stage'}
                  </span>
                  <span className="text-gov-blue-600 font-semibold group-hover:underline">
                    Inspect
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
