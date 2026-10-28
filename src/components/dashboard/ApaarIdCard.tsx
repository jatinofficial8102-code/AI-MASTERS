import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Copy,
  Check,
  Eye,
  EyeOff,
  RotateCw,
  QrCode,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApaarIdCard: React.FC = () => {
  const { user, student, showToast } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const apaarId = student?.apaarId || '0824-0000-0000';
  const maskedId = student?.maskedId || `${apaarId.slice(0, 4)} •••• •••• ${apaarId.slice(-4)}`;
  const displayId = isRevealed ? apaarId : maskedId;
  const displayName = student?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Authenticated Student';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(apaarId);
    setCopied(true);
    showToast('Copied to Clipboard', `APAAR ID (${apaarId}) copied.`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('Digital ID Downloaded', 'Official APAAR Identity Card PDF generated.', 'info');
  };

  return (
    <div className="flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div className="w-full max-w-md h-[260px] sm:h-[275px] perspective-1000 group">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="w-full h-full relative transform-style-preserve-3d"
        >
          {/* ================= FRONT SIDE ================= */}
          <div className="absolute inset-0 w-full h-full rounded-2xl p-5 backface-hidden bg-gradient-to-br from-gov-navy-950 via-gov-navy-900 to-gov-navy-850 text-white border border-gov-cyan-500/30 shadow-2xl overflow-hidden flex flex-col justify-between group-hover:border-gov-cyan-400/60 transition-colors">
            {/* Holographic Sheen Overlay */}
            <div className="absolute inset-0 holo-sheen pointer-events-none opacity-40 mix-blend-screen" />

            {/* Subtle background national emblem & grid pattern */}
            <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 pointer-events-none">
              <svg viewBox="0 0 200 200" fill="currentColor">
                <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="4" fill="none" />
                <path d="M100 20 L100 180 M20 100 L180 100 M43 43 L157 157 M43 157 L157 43" stroke="white" strokeWidth="2" />
              </svg>
            </div>

            {/* Top Bar: Chip, Issuer & Floating Cap */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                {/* Smart Card Chip */}
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-yellow-500 p-0.5 shadow-sm border border-amber-600/40 relative overflow-hidden">
                  <div className="w-full h-full border border-amber-800/40 rounded flex items-center justify-center">
                    <div className="w-4 h-3 border-x border-amber-800/40" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs tracking-wider text-white">APAAR</span>
                    <span className="text-[9px] bg-gov-cyan-500/20 text-gov-cyan-300 px-1 rounded border border-gov-cyan-500/30 font-mono">
                      GOV TECH
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-300 tracking-tight">
                    Ministry of Education • AICTE
                  </p>
                </div>
              </div>

              {/* Floating Academic Cap Badge */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-8 h-8 rounded-xl bg-gov-blue-500/20 border border-gov-cyan-400/40 flex items-center justify-center text-gov-cyan-300 shadow-glow-cyan"
              >
                <GraduationCap className="w-4 h-4" />
              </motion.div>
            </div>

            {/* Middle Section: Photo & Student Bio */}
            <div className="relative z-10 flex items-center gap-4 my-auto">
              <div className="relative shrink-0">
                <img
                  src={student?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.email || 'User')}`}
                  alt={displayName}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border-2 border-gov-cyan-400/60 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-slate-950">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide truncate">
                  {displayName}
                </h3>
                <p className="text-[11px] text-gov-cyan-300 font-medium truncate mt-0.5">
                  {student?.course || 'Degree Program Pending'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {student?.institution || 'AICTE Verified Student'}
                </p>

                <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-300">
                  <span>BG: <b className="text-white font-sans">{student?.bloodGroup || 'N/A'}</b></span>
                  <span>SEM: <b className="text-gov-cyan-400 font-sans">{student?.currentSemester || 1}st</b></span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: APAAR ID Display & Status */}
            <div className="relative z-10 pt-2 border-t border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                  APAAR Permanent Academic ID
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-gov-cyan-300">
                  {displayId}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {student?.status === 'Active & Verified' ? 'Verified' : 'Active'}
              </div>
            </div>
          </div>

          {/* ================= BACK SIDE ================= */}
          <div className="absolute inset-0 w-full h-full rounded-2xl p-5 backface-hidden rotate-y-180 bg-gradient-to-br from-gov-navy-950 via-slate-900 to-gov-navy-900 text-white border border-slate-700 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Top Bar: Security Verification */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white tracking-wide">
                  DigiLocker Cryptographic Proof
                </span>
              </div>
              <span className="text-[10px] font-mono text-gov-cyan-400">
                ABC Node: AICTE-IND
              </span>
            </div>

            {/* Middle Section: QR Code & Hashes */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-20 h-20 bg-white rounded-xl p-1.5 shrink-0 flex items-center justify-center shadow-md">
                <QrCode className="w-full h-full text-slate-950" />
              </div>

              <div className="text-[10px] text-slate-300 space-y-1 font-mono leading-relaxed">
                <p>
                  <span className="text-slate-400">Auth UUID: </span>
                  <span className="text-gov-cyan-300 truncate block max-w-[190px]">
                    {user?.id || 'Authenticated'}
                  </span>
                </p>
                <p>
                  <span className="text-slate-400">ABC ID: </span>
                  <span className="text-white font-semibold">{student?.abcId || 'Unassigned'}</span>
                </p>
                <p>
                  <span className="text-slate-400">Roll No: </span>
                  <span className="text-white">{student?.rollNo || 'Pending'}</span>
                </p>
                <p className="text-[9px] text-emerald-400 font-sans">
                  ✓ Tamper-evident ledger recorded
                </p>
              </div>
            </div>

            {/* Bottom Bar: Barcode */}
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[9px] text-slate-400">
              <p className="max-w-[210px] leading-tight">
                National Academic Registry for AICTE institutions.
              </p>
              <div className="font-mono text-slate-300 text-[10px] tracking-widest">
                ||| | |||| || |||
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Card Micro-Interaction Controls */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setIsFlipped((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all shadow-sm group"
        >
          <RotateCw className="w-3.5 h-3.5 text-gov-blue-600 group-hover:rotate-180 transition-transform duration-500" />
          <span>{isFlipped ? 'Show Front' : 'Flip to QR / Security'}</span>
        </button>

        <button
          onClick={() => setIsRevealed((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all shadow-sm"
        >
          {isRevealed ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-amber-600" />
              <span>Mask ID</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-gov-blue-600" />
              <span>Show ID</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy ID</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gov-blue-600 hover:bg-gov-blue-700 text-white text-xs font-semibold shadow-glow-blue transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Card</span>
        </button>
      </div>
    </div>
  );
};
