import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Edit3,
  Copy,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyProfile: React.FC = () => {
  const { user, student, openModal, showToast } = useApp();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to Clipboard', `${label} copied successfully.`, 'success');
  };

  const displayName = student?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Authenticated Student';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Top Banner Profile Header (Clean White & Soft Blue) */}
      <div className="relative rounded-3xl bg-white border border-slate-200 shadow-card overflow-hidden">
        {/* Decorative Top Gradient Header */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-50 border-b border-slate-200/80 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-40" />
          <div className="absolute bottom-3 right-4 sm:right-6 flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-white/95 text-gov-blue-700 border border-slate-200 shadow-sm">
              Auth UUID: {user?.id.slice(0, 8)}...
            </span>
          </div>
        </div>

        {/* Profile Avatar & Primary Summary */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative">
              <img
                src={student?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.email || 'User')}`}
                alt={displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white border-2 border-white shadow">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {displayName}
                </h1>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  student?.status === 'Active & Verified'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {student?.status || 'Pending Verification'}
                </span>
                {student?.role && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gov-blue-50 text-gov-blue-700 border border-gov-blue-200 uppercase">
                    Role: {student.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {student?.course || 'Degree Program Pending'}
              </p>
              <p className="text-xs text-slate-500">
                {student?.institution || 'Institution Not Assigned'} • Roll No: <span className="font-mono">{student?.rollNo || 'Pending'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openModal('edit-profile')}
              className="px-4 py-2 rounded-xl bg-gov-blue-600 hover:bg-gov-blue-700 text-white text-xs font-semibold shadow-glow-blue transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Completion Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">National Academic Profile Completeness</h3>
            <p className="text-xs text-slate-500">
              Required for automated issuance of digital credentials on National Depository.
            </p>
          </div>
          <span className="text-base font-extrabold text-gov-blue-700 font-mono">
            {student?.profileCompletionPercentage || 25}% Completed
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gov-blue-600 to-gov-cyan-500 rounded-full"
            style={{ width: `${student?.profileCompletionPercentage || 25}%` }}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Supabase Auth (100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`w-3.5 h-3.5 ${student?.phone ? 'text-emerald-500' : 'text-slate-300'}`} />
            <span>Contact Verified ({student?.phone ? '100%' : '0%'})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`w-3.5 h-3.5 ${student?.dob ? 'text-emerald-500' : 'text-slate-300'}`} />
            <span>Demographics ({student?.dob ? '100%' : '0%'})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`w-3.5 h-3.5 ${student?.institution ? 'text-emerald-500' : 'text-slate-300'}`} />
            <span>Institution Node ({student?.institution ? '100%' : '0%'})</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Personal & Demographics vs Academic & Government Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Government & Academic Identifiers */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gov-blue-50 text-gov-blue-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">National Identifiers & Registry</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
              RLS PROTECTED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">APAAR Academic ID</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {student?.apaarId || 'Pending Assignment'}
                </span>
              </div>
              {student?.apaarId && (
                <button
                  onClick={() => handleCopy(student.apaarId, 'APAAR ID')}
                  className="p-1.5 text-slate-400 hover:text-gov-blue-600 transition-colors"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Academic Bank of Credits (ABC ID)</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {student?.abcId || 'Unassigned / Not Set'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Supabase Auth User ID</span>
                <span className="font-mono text-slate-700 text-[11px] truncate max-w-xs block">{user?.id}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Active</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">AICTE College Code</span>
                <span className="font-mono font-bold text-slate-900">
                  {student?.institutionCode || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Personal & Contact Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Personal Demographics</h3>
            </div>
            <button
              onClick={() => openModal('edit-profile')}
              className="text-xs text-gov-blue-600 font-semibold hover:underline"
            >
              Update
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Date of Birth</span>
              <span className="font-semibold text-slate-800">{student?.dob || 'Not Provided'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Gender & Blood Group</span>
              <span className="font-semibold text-slate-800">
                {student?.gender || 'Unspecified'} • {student?.bloodGroup || 'N/A'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Official Email</span>
              <span className="font-semibold text-slate-900 font-mono">{user?.email}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Mobile Contact</span>
              <span className="font-semibold text-slate-800 font-mono">{student?.phone || 'Not Provided'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Permanent Residential Address</span>
              <span className="font-medium text-slate-700 leading-relaxed">
                {student?.address || 'Address details not populated. Click Edit Profile to update.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
