import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../utils/supabase/client';
import { useApp } from '../../context/AppContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, publicRegistrationEnabled } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Initial Owner & Institutional Registration Policy
  // Public registration is closed by default unless enabled by the verified owner in app_settings
  const isRegistrationClosed = !publicRegistrationEnabled;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isRegistrationClosed) {
      setErrorMessage(
        'Public registration is currently closed. Accounts must be pre-provisioned in Supabase Authentication by the institution administrator.'
      );
      return;
    }

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the APAAR terms of service and privacy charter.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Supabase publishable key is not configured in .env.local. Please provide your NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setRegisteredSuccess(true);
      showToast('Registration Initiated', 'Please check your inbox to confirm your email.', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-gov-blue-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gov-blue-600 via-gov-cyan-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-gov-blue-600" />
            </div>
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Student Registry Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          APAAR National Academic Account Registry (SIH26263)
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-card"
        >
          {registeredSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Check Your Email</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                We have sent an authentication verification link to <b className="text-slate-900">{email}</b>. Click the link to activate your permanent academic registry profile.
              </p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gov-blue-600 text-white text-xs font-semibold shadow-glow-blue"
                >
                  <span>Return to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Registration Policy Notice */}
              {isRegistrationClosed ? (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Public Registration Restricted</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Public registration is currently closed. Only pre-authorized institutional and administrative accounts can be initialized.
                  </p>
                  <div className="pt-1.5 border-t border-amber-200/70 text-[11px] text-amber-900">
                    Intended owner account: <b className="font-semibold">jathin.cybersecurity@gmail.com</b>. Initial owner setup is provisioned securely through Supabase Authentication.
                  </div>
                </div>
              ) : (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Public Registration Active</span>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                      Student registration is currently open for AICTE affiliated institutions.
                    </p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      disabled={isRegistrationClosed}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isRegistrationClosed ? 'Registration unavailable' : 'e.g. Jatin'}
                      required={!isRegistrationClosed}
                      className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed focus:bg-white focus:outline-none focus:border-gov-blue-500 focus:ring-2 focus:ring-gov-blue-500/20 text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      disabled={isRegistrationClosed}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isRegistrationClosed ? 'Registration unavailable' : 'jathin.cybersecurity@gmail.com'}
                      required={!isRegistrationClosed}
                      className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed focus:bg-white focus:outline-none focus:border-gov-blue-500 focus:ring-2 focus:ring-gov-blue-500/20 text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password (Min. 8 characters)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      disabled={isRegistrationClosed}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required={!isRegistrationClosed}
                      className="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed focus:bg-white focus:outline-none focus:border-gov-blue-500 focus:ring-2 focus:ring-gov-blue-500/20 text-slate-900 transition-all font-mono"
                    />
                    <button
                      type="button"
                      disabled={isRegistrationClosed}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      disabled={isRegistrationClosed}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required={!isRegistrationClosed}
                      className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed focus:bg-white focus:outline-none focus:border-gov-blue-500 focus:ring-2 focus:ring-gov-blue-500/20 text-slate-900 transition-all font-mono"
                    />
                  </div>
                </div>

                {!isRegistrationClosed && (
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-gov-blue-600 focus:ring-gov-blue-500"
                    />
                    <label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight">
                      I acknowledge that academic credentials are authenticated via DigiLocker and National Academic Depository (NAD).
                    </label>
                  </div>
                )}

                {/* Submit / Action Button */}
                {isRegistrationClosed ? (
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Registration Unavailable (Closed)</span>
                    </button>

                    <Link
                      to="/login"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gov-blue-600 hover:bg-gov-blue-700 text-white shadow-glow-blue transition-all flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Sign In with Existing Credentials</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gov-blue-600 hover:bg-gov-blue-700 disabled:opacity-50 text-white shadow-glow-blue transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Already have an account? Sign in</span>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
