import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  CheckCircle2,
  ChevronDown,
  User,
  GraduationCap,
  LogOut,
  Sliders,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    user,
    student,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    academicRecords,
    setSidebarCollapsed,
    showToast,
    signOut,
  } = useApp();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayName = student?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Authenticated User';
  const displayAvatar = student?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.email || 'User')}`;
  const displayApaar = student?.apaarId || 'Pending';
  const displayMasked = student?.maskedId || 'Pending Assignment';

  // Search filtering
  const filteredRecords = searchQuery.trim()
    ? academicRecords.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.recordType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const studentMatches = (searchQuery.trim() && student)
    ? [student].filter(
        (s) =>
          s &&
          (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.apaarId.includes(searchQuery) ||
            (s.rollNo && s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : [];

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-800 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between gap-4">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-blue-500 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-gov-blue-600 via-gov-cyan-500 to-indigo-600 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-gov-blue-600 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-slate-900">
                  APAAR
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-gov-blue-50 text-gov-blue-700 border border-gov-blue-200">
                  AICTE / GOV
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                One ID • Unified Student Data
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search APAAR ID, student name, or roll number..."
              className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-gov-blue-500 focus:ring-2 focus:ring-gov-blue-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          <AnimatePresence>
            {showSearchDropdown && searchQuery.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 max-h-96 overflow-y-auto"
              >
                <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 px-2 py-1">
                  Matching Students
                </div>
                {studentMatches.length > 0 ? (
                  studentMatches.map((s) => (
                    <div
                      key={s.apaarId}
                      onClick={() => {
                        navigate('/profile');
                        setShowSearchDropdown(false);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={s.avatarUrl}
                          alt={s.name}
                          className="w-7 h-7 rounded-full object-cover border border-gov-blue-300"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{s.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{s.apaarId}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gov-blue-700 bg-gov-blue-50 px-2 py-0.5 rounded border border-gov-blue-200">
                        {s.course || 'Enrolled'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 px-2 py-1">No student record found.</p>
                )}

                <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 px-2 py-1 mt-2">
                  Matching Academic Credentials
                </div>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        navigate('/academic-records');
                        setShowSearchDropdown(false);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{rec.title}</p>
                        <p className="text-[11px] text-slate-500">{rec.institution}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          rec.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {rec.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 px-2 py-1">No credentials matched.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Security Pill, Notifications & Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* SIH Hackathon Demo Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 font-medium text-[11px]">SIH26263 Live Connected</span>
          </div>

          {/* Notifications Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 rounded-xl bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 focus:outline-none transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gov-blue-400 opacity-75"></span>
                  <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-gov-blue-600 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 text-slate-800"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-slate-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-[11px] bg-gov-blue-50 text-gov-blue-700 border border-gov-blue-200 px-2 py-0.5 rounded-full font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-gov-blue-600 hover:text-gov-blue-700 font-medium transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.actionPath) navigate(n.actionPath);
                            setShowNotifications(false);
                          }}
                          className={`p-3 rounded-xl transition-colors cursor-pointer hover:bg-slate-50 ${
                            !n.read ? 'bg-blue-50/50 border-l-2 border-gov-blue-600' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-xs text-slate-900">{n.title}</p>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-center text-xs text-slate-400">No notifications.</p>
                    )}
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        navigate('/notifications');
                        setShowNotifications(false);
                      }}
                      className="text-xs text-gov-blue-600 hover:underline font-semibold"
                    >
                      View all notification logs →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/80 focus:outline-none transition-all group"
            >
              <div className="relative">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-300"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 leading-tight group-hover:text-gov-blue-600 transition-colors">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-500 font-mono tracking-tight">
                  {displayMasked}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block group-hover:text-slate-700 transition-transform" />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 text-slate-800"
                >
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{displayName}</p>
                    <p className="text-[11px] text-gov-blue-600 font-mono mt-0.5">{displayApaar}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{user?.email}</p>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Authenticated Session</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-xl flex items-center gap-2.5 transition-colors text-slate-700 hover:text-slate-900"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/academic-records');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-xl flex items-center gap-2.5 transition-colors text-slate-700 hover:text-slate-900"
                    >
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <span>Academic Records</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-xl flex items-center gap-2.5 transition-colors text-slate-700 hover:text-slate-900"
                    >
                      <Sliders className="w-4 h-4 text-slate-400" />
                      <span>Security & Settings</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={async () => {
                        setShowProfileMenu(false);
                        await signOut();
                        navigate('/login', { replace: true });
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
