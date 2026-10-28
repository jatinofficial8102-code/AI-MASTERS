import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileUp,
  GraduationCap,
  BadgeCheck,
  KeyRound,
  Building2,
  ArrowRight,
  Loader2,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, showToast } = useApp();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = (id: string, action: () => void) => {
    setActionLoading(id);
    setTimeout(() => {
      setActionLoading(null);
      action();
    }, 350);
  };

  const actions = [
    {
      id: 'view-records',
      title: 'Academic Records',
      subtitle: 'View transcripts & credits',
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-600',
      action: () => navigate('/academic-records'),
    },
    {
      id: 'upload-doc',
      title: 'Upload Document',
      subtitle: 'Drag & drop certificates',
      icon: FileUp,
      color: 'from-cyan-600 to-blue-600',
      action: () => openModal('upload-document'),
    },
    {
      id: 'request-verify',
      title: 'Request Verification',
      subtitle: 'Submit for registrar stamp',
      icon: BadgeCheck,
      color: 'from-emerald-600 to-teal-600',
      action: () => openModal('request-verification'),
    },
    {
      id: 'manage-consent',
      title: 'Manage Consent',
      subtitle: 'Review recruiter access',
      icon: KeyRound,
      color: 'from-purple-600 to-indigo-600',
      action: () => navigate('/consent'),
    },
    {
      id: 'view-institutions',
      title: 'AICTE Institutes',
      subtitle: 'Explore university partners',
      icon: Building2,
      color: 'from-amber-600 to-orange-600',
      action: () => navigate('/institutions'),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Quick Operations</h3>
          <p className="text-xs text-slate-500">
            Frequently performed student credential actions and integrations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          const isLoading = actionLoading === act.id;

          return (
            <motion.button
              key={act.id}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAction(act.id, act.action)}
              className="flex flex-col items-start p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-card transition-all text-left group focus:outline-none focus:ring-2 focus:ring-gov-blue-500/30"
            >
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${act.color} text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-gov-blue-600 transition-colors">
                {act.title}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                {act.subtitle}
              </p>

              <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-slate-400 group-hover:text-gov-blue-600 transition-colors">
                <span>Proceed</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
