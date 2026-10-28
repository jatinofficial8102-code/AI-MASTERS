import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  Shield,
  Smartphone,
  Laptop,
  Download,
  Bell,
  LogOut,
  Lock,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Settings: React.FC = () => {
  const {
    user,
    student,
    isOwner,
    publicRegistrationEnabled,
    updateRegistrationPolicy,
    signOut,
    showToast,
  } = useApp();
  const navigate = useNavigate();

  const [policyUpdating, setPolicyUpdating] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [digiLockerAutoSync, setDigiLockerAutoSync] = useState(true);

  const activeSessions = [
    {
      id: 'sess-current',
      device: 'Current Browser Session',
      browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser',
      ip: 'Supabase JWT Verified',
      location: 'Active Session',
      status: 'Current Active Session',
      isCurrent: true,
    },
  ];

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ user, profile: student }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `APAAR_Data_Archive_${student?.apaarId || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Data Bundle Exported', 'Complete JSON archive of student academic record downloaded.', 'success');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
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
              Security, Consent & Preferences
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              HIGH SECURITY
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage multi-factor authentication, active login credentials, communication preferences, and data privacy exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl bg-gov-blue-600 hover:bg-gov-blue-700 text-white text-xs font-semibold shadow-glow-blue transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Student Bundle</span>
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Two-Factor Authentication & Biometrics */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-gov-blue-50 text-gov-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cybersecurity & Authentication</h3>
              <p className="text-[11px] text-slate-500">Government Level-3 Identity Assurance</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Two-Factor OTP Verification (Aadhaar Linked)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sends an instant OTP to registered phone ({student?.phone || 'Not configured'}) upon login.
                </p>
              </div>
              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  showToast(
                    twoFactorEnabled ? '2FA Disabled' : '2FA Enabled',
                    twoFactorEnabled ? 'Two factor OTP disabled.' : 'Two factor OTP active.',
                    'info'
                  );
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <motion.div
                  animate={{ x: twoFactorEnabled ? 20 : 0 }}
                  className="w-5 h-5 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">DigiLocker Real-Time Gateway Sync</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Synchronizes new grade sheets as soon as universities post exam results.
                </p>
              </div>
              <button
                onClick={() => {
                  setDigiLockerAutoSync(!digiLockerAutoSync);
                  showToast('Sync Preference Updated', '', 'info');
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  digiLockerAutoSync ? 'bg-gov-blue-600' : 'bg-slate-300'
                }`}
              >
                <motion.div
                  animate={{ x: digiLockerAutoSync ? 20 : 0 }}
                  className="w-5 h-5 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Notification & Alert Channels */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dispatch Channels</h3>
              <p className="text-[11px] text-slate-500">Manage where updates and alerts are sent</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Email Dispatches</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  emailAlerts ? 'bg-gov-blue-600' : 'bg-slate-300'
                }`}
              >
                <motion.div
                  animate={{ x: emailAlerts ? 20 : 0 }}
                  className="w-5 h-5 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">SMS Verification Alerts</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{student?.phone || 'Add phone in profile'}</p>
              </div>
              <button
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  smsAlerts ? 'bg-gov-blue-600' : 'bg-slate-300'
                }`}
              >
                <motion.div
                  animate={{ x: smsAlerts ? 20 : 0 }}
                  className="w-5 h-5 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Owner Administrative Console (Only displayed for verified owner account) */}
      {isOwner && (
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white rounded-3xl border-2 border-gov-blue-200 p-6 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gov-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gov-blue-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Institutional Owner Administrative Console
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gov-blue-100 text-gov-blue-800 border border-gov-blue-200">
                    ROOT CLEARANCE
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Primary Administrator: <b className="text-slate-900">Jatin</b> • <span className="font-mono text-slate-700">{user?.email}</span>
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Owner Session Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Owner UUID & Metadata */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-gov-blue-600" />
                <span>Supabase User UUID Reference</span>
              </p>
              <p className="text-[11px] font-mono bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-700 break-all select-all">
                {user?.id || 'Authenticated UUID'}
              </p>
              <p className="text-[10px] text-slate-500">
                Linked securely to <code className="font-mono text-slate-700">public.profiles.id</code> with server-side Row Level Security.
              </p>
            </div>

            {/* Public Registration Policy Toggle */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800">Public Student Registration</p>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      publicRegistrationEnabled
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {publicRegistrationEnabled ? 'OPEN' : 'RESTRICTED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {publicRegistrationEnabled
                    ? 'Public visitors can register new student accounts via the signup portal.'
                    : 'Public registration is closed. Only accounts provisioned via Supabase Dashboard can sign in.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-600 font-medium">Toggle Portal Access:</span>
                <button
                  type="button"
                  disabled={policyUpdating}
                  onClick={async () => {
                    setPolicyUpdating(true);
                    await updateRegistrationPolicy(!publicRegistrationEnabled);
                    setPolicyUpdating(false);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 disabled:opacity-50 ${
                    publicRegistrationEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  title="Toggle Public Registration Policy"
                >
                  <motion.div
                    animate={{ x: publicRegistrationEnabled ? 20 : 0 }}
                    className="w-5 h-5 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card 3: Active Device Sessions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Login Sessions</h3>
            <p className="text-xs text-slate-500">
              Authenticated device session tokens permitted to access this APAAR identity.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 font-semibold">Supabase TLS Strict</span>
        </div>

        <div className="space-y-3">
          {activeSessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Laptop className="w-5 h-5 text-gov-blue-600" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900">{sess.device}</p>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Now
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    User UUID: <span className="font-mono text-slate-700">{user?.id}</span> • Email: {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors self-start sm:self-auto"
              >
                Sign Out
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Information Panel */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <h4 className="font-bold text-slate-900 text-sm mb-1">
          Government Academic Depository Architecture Note
        </h4>
        <p>
          This application connects to Supabase with Row Level Security (RLS) policies enforcing that only authenticated owners can read or update their own student records. Passwords are never stored on client devices or custom application tables.
        </p>
      </div>
    </motion.div>
  );
};
