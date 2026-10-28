import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  numericTarget?: number;
  prefix?: string;
  suffix?: string;
  subtitle: string;
  badgeText?: string;
  badgeType?: 'success' | 'info' | 'warning' | 'purple';
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  numericTarget,
  prefix = '',
  suffix = '',
  subtitle,
  badgeText,
  badgeType = 'success',
  icon: Icon,
  iconBg,
  iconColor,
  onClick,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  // Animate count-up if numericTarget is provided
  useEffect(() => {
    if (numericTarget === undefined) return;
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20; // 50 updates/sec
    const totalSteps = duration / stepTime;
    const increment = numericTarget / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setDisplayValue(numericTarget);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [numericTarget]);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group select-none`}
    >
      {/* Moving highlight across the card on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gov-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none" />

      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {numericTarget !== undefined ? (
            <>
              {prefix}
              {displayValue}
              {suffix}
            </>
          ) : (
            value
          )}
        </h4>

        {badgeText && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
              badgeType === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : badgeType === 'info'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : badgeType === 'purple'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {badgeType === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span className="truncate">{subtitle}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-gov-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </motion.div>
  );
};
