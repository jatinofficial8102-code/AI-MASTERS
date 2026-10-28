import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  FileText,
  BadgeCheck,
  Building2,
  KeyRound,
  Bell,
  Settings,
  ShieldCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, notifications, documents } = useApp();
  const location = useLocation();

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const pendingDocs = documents.filter((d) => d.status === 'Under Review').length;

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Academic Records', path: '/academic-records', icon: GraduationCap },
    { name: 'Documents', path: '/documents', icon: FileText, badge: pendingDocs > 0 ? pendingDocs : undefined },
    { name: 'Verification Center', path: '/verification', icon: BadgeCheck, badge: 'Active' },
    { name: 'Institutions', path: '/institutions', icon: Building2 },
    { name: 'Access & Consent', path: '/consent', icon: KeyRound },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 80 : 270 }}
      transition={{ type: 'spring', damping: 22, stiffness: 220 }}
      className="fixed left-0 top-0 bottom-0 z-30 bg-white border-r border-slate-200 text-slate-700 flex flex-col justify-between pt-20 pb-4 select-none shadow-sm"
    >
      {/* Top Section: Quick Branding Header */}
      <div className="px-4 py-2">
        {!sidebarCollapsed ? (
          <div className="p-3 rounded-2xl bg-gov-blue-50/70 border border-gov-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gov-blue-700">
                Official Registry
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                Connected
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 mt-1 truncate">
              National Academic Depository
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-xl bg-gov-blue-50 border border-gov-blue-100 flex items-center justify-center text-gov-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Middle Section: Navigation Items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group focus:outline-none focus:ring-2 focus:ring-gov-blue-500/30 ${
                isActive
                  ? 'text-gov-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {/* Animated Active Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-gov-blue-50/90 rounded-xl border border-gov-blue-200/80 shadow-sm"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}

              <div className="relative z-10 shrink-0 flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-gov-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
              </div>

              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 truncate font-semibold text-xs sm:text-sm tracking-tight"
                >
                  {item.name}
                </motion.span>
              )}

              {/* Badge */}
              {!sidebarCollapsed && item.badge && (
                <span
                  className={`relative z-10 ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badge === 'Active'
                      ? 'bg-gov-blue-100 text-gov-blue-800 border border-gov-blue-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section: Security Status Panel */}
      <div className="px-3 pt-2">
        {!sidebarCollapsed ? (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900 tracking-tight">
                  256-bit AES Simulated
                </p>
                <p className="text-[10px] text-slate-500">Session Authenticated</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AICTE Node: ON
              </span>
              <span className="text-gov-blue-700 font-bold">TLS 1.3</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center" title="256-bit AES Encryption Active">
              <Lock className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="mt-3 w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center gap-2 text-xs transition-colors"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[11px] font-medium">Collapse Menu</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};
