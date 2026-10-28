import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  GraduationCap,
  FileCheck2,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Edit3,
  Award,
  BookOpen,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApaarIdCard } from '../components/dashboard/ApaarIdCard';
import { StatCard } from '../components/dashboard/StatCard';
import { VerificationTracker } from '../components/dashboard/VerificationTracker';
import { QuickActions } from '../components/dashboard/QuickActions';
import { AcademicPerformanceChart } from '../components/dashboard/AcademicPerformanceChart';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, student, academicRecords, documents, institutions, openModal } = useApp();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const verifiedRecordsCount = academicRecords.filter((r) => r.status === 'Verified').length;
  const verifiedDocsCount = documents.filter((d) => d.status === 'Verified').length;

  const displayName = student?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* ================= 1. WELCOME HERO SECTION (Crisp White / Soft Blue Gov Theme) ================= */}
      <div
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-blue-50/40 to-indigo-50/30 text-slate-900 p-6 sm:p-8 border border-slate-200/90 shadow-card group"
      >
        {/* Subtle radial cursor follow glow for desktop */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37, 99, 235, 0.08), transparent 80%)`,
          }}
        />

        {/* Network Nodes Motifs */}
        <div className="absolute top-0 right-0 w-96 h-full bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-gov-blue-50 text-gov-blue-700 border border-gov-blue-200">
                <Sparkles className="w-3.5 h-3.5" />
                SIH26263 AICTE Registry
              </span>
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                ID: {student?.apaarId || 'Pending Assignment'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back, {displayName}!
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Your academic identity, securely connected. Verify credentials, manage institution consents, and track nationwide certifications.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gov-blue-600" />
                <span>
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-gov-blue-600" />
                <span>{student?.institution || 'Institution Profile Pending'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Supabase Session Active</span>
              </div>
            </div>
          </div>

          {/* Profile Completion Widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shrink-0 max-w-xs shadow-sm">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Profile Completion</span>
              <span className="font-bold text-gov-blue-700 font-mono">
                {student?.profileCompletionPercentage || 25}%
              </span>
            </div>
            <div className="w-44 sm:w-52 h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${student?.profileCompletionPercentage || 25}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-gov-blue-600 to-gov-cyan-500 rounded-full"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {academicRecords.length > 0
                ? `${academicRecords.length} academic credential(s) recorded in registry.`
                : 'Upload mark sheets and fill out demographics to complete profile.'}
            </p>
          </div>
        </div>
      </div>

      {/* ================= 2. FOUR COUNT-UP STATISTICS CARDS (Real Database Records) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="APAAR ID Status"
          value={student?.status || 'Pending Verification'}
          subtitle={user?.email || 'Authenticated User'}
          badgeText={student?.status === 'Active & Verified' ? 'Active' : 'Unverified'}
          badgeType={student?.status === 'Active & Verified' ? 'success' : 'warning'}
          icon={ShieldCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          onClick={() => navigate('/verification')}
        />

        <StatCard
          title="Academic Records"
          value={academicRecords.length}
          numericTarget={academicRecords.length}
          subtitle={`${verifiedRecordsCount} fully authenticated in DB`}
          badgeText={academicRecords.length > 0 ? 'Logged' : 'No Records'}
          badgeType="info"
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-gov-blue-600"
          onClick={() => navigate('/academic-records')}
        />

        <StatCard
          title="Uploaded Documents"
          value={documents.length}
          numericTarget={documents.length}
          subtitle={`${verifiedDocsCount} certified by authorities`}
          badgeText={documents.length > 0 ? 'Protected' : 'Empty'}
          badgeType="purple"
          icon={FileCheck2}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          onClick={() => navigate('/documents')}
        />

        <StatCard
          title="Associated Institutes"
          value={institutions.length || 3}
          numericTarget={institutions.length || 3}
          subtitle="AICTE Approved Nodes"
          badgeText="NIRF Ranked"
          badgeType="warning"
          icon={Building2}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          onClick={() => navigate('/institutions')}
        />
      </div>

      {/* ================= 3. CORE HIGHLIGHT: APAAR ID CARD & STUDENT OVERVIEW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Animated APAAR Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gov-blue-700">
                Official Digital Credential
              </span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Government APAAR Smart Card
              </h3>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono font-medium">
              3D Flip Enabled
            </span>
          </div>

          <ApaarIdCard />
        </div>

        {/* Student Overview Profile Panel (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <img
                src={student?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.email || 'User')}`}
                alt={displayName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {displayName}
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    student?.status === 'Active & Verified'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {student?.status === 'Active & Verified' ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Roll: {student?.rollNo || 'Not Set'} • APAAR: {student?.maskedId || 'Pending'}
                </p>
              </div>
            </div>

            <button
              onClick={() => openModal('edit-profile')}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Degree & Major</span>
              <span className="font-semibold text-slate-800 line-clamp-1">{student?.course || 'Not Configured'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Current Semester</span>
              <span className="font-semibold text-slate-800">
                {student?.currentSemester ? `Semester ${student.currentSemester}` : 'Unassigned'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Cumulative CGPA</span>
              <span className="font-bold text-gov-blue-700 font-mono text-sm">{student?.cgpa || '0.00'} / 10.0</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Academic Bank (ABC)</span>
              <span className="font-semibold text-slate-800 font-mono text-[11px] truncate">
                {student?.abcId || 'Pending Sync'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Accumulated Credits</span>
              <span className="font-semibold text-slate-800 font-mono">
                {student?.creditsAccumulated || 0} / {student?.totalCreditsRequired || 160} Credits
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Academic Tenure</span>
              <span className="font-semibold text-slate-800">{student?.academicYear || 'Current'}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gov-blue-600" />
              <span>
                Authenticated User: <b>{user?.email}</b>
              </span>
            </div>
            <Link to="/profile" className="text-gov-blue-700 font-semibold hover:underline flex items-center gap-0.5">
              Full Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 4. FOUR-STEP VERIFICATION TRACKER ================= */}
      <VerificationTracker />

      {/* ================= 5. QUICK ACTIONS STRIP ================= */}
      <QuickActions />

      {/* ================= 6. ACADEMIC PERFORMANCE & CREDIT CHARTS ================= */}
      <AcademicPerformanceChart />

      {/* ================= 7. ACADEMIC RECORDS TABLE (Real DB Records / Clean Empty State) ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Academic Credentials Repository
            </h3>
            <p className="text-xs text-slate-500">
              Chronological ledger of authenticated board, university, and certification records.
            </p>
          </div>
          <Link
            to="/academic-records"
            className="text-xs text-gov-blue-600 hover:text-gov-blue-700 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {academicRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Credential Title</th>
                  <th className="py-2.5 px-3">Institution / Board</th>
                  <th className="py-2.5 px-3">Tenure</th>
                  <th className="py-2.5 px-3">Score / Grade</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {academicRecords.slice(0, 5).map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {rec.title}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{rec.institution}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{rec.academicYear}</td>
                    <td className="py-3 px-3 font-bold font-mono text-slate-900">{rec.score}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[10px] ${
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
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate('/academic-records')}
                        className="text-gov-blue-600 hover:text-gov-blue-800 font-medium hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Clean Empty State as explicitly instructed */
          <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-gov-blue-600 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">No academic records found.</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
              Your APAAR profile has no academic records logged in the database yet.
            </p>
            <button
              onClick={() => openModal('request-verification')}
              className="mt-3 px-3.5 py-1.5 rounded-xl bg-gov-blue-600 hover:bg-gov-blue-700 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Academic Record</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
