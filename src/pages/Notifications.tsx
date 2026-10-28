import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Notifications: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('All');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'Unread') return !n.read;
    if (filterType === 'All') return true;
    return n.type === filterType.toLowerCase();
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'verification':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'consent':
        return <KeyRound className="w-4 h-4 text-purple-500" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default:
        return <GraduationCap className="w-4 h-4 text-gov-blue-500" />;
    }
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
              Notification & Alert Dispatch
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time notifications synchronized with your Supabase account.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4 text-slate-500" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        {['All', 'Unread', 'Verification', 'Consent', 'Security'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              filterType === cat
                ? 'bg-gov-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.actionPath) navigate(notif.actionPath);
              }}
              className={`p-5 rounded-3xl border bg-white shadow-card cursor-pointer transition-all hover:shadow-card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !notif.read ? 'border-gov-blue-300 bg-blue-50/20 ring-1 ring-gov-blue-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-gov-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="text-[11px] font-mono text-slate-400">{notif.timestamp}</span>
                {notif.actionPath && (
                  <span className="text-xs text-gov-blue-600 font-semibold flex items-center gap-1 hover:underline">
                    <span>View Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 shadow-card">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">No notifications at this time.</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Updates will appear here as verifications or consent requests are processed.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
