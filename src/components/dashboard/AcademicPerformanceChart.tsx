import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Award, BookOpen, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AcademicPerformanceChart: React.FC = () => {
  const { academicRecords, openModal } = useApp();

  // Compute actual semester scores from authenticated database records
  const semesterRecords = academicRecords
    .filter((r) => r.recordType.toLowerCase().includes('sem') || r.recordType.toLowerCase().includes('year'))
    .map((r, idx) => ({
      semester: `Term ${idx + 1}`,
      title: r.title,
      score: parseFloat(r.score.replace(/[^0-9.]/g, '')) || 0,
      credits: r.creditsEarned || 0,
    }));

  const totalCredits = academicRecords.reduce((acc, r) => acc + (r.creditsEarned || 0), 0);

  // If no records exist in the database, show clean, genuine empty state
  if (academicRecords.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-card text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-gov-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          No Academic Performance Data Recorded
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
          As you log semester transcripts and certifications into your APAAR account, your verified GPA progression and Academic Bank of Credits (ABC) distribution will render here.
        </p>
        <button
          onClick={() => openModal('request-verification')}
          className="mt-4 px-4 py-2 rounded-xl bg-gov-blue-600 hover:bg-gov-blue-700 text-white text-xs font-semibold shadow-glow-blue transition-all inline-flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Initial Academic Credential</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* SGPA & CGPA Trend Progression (2 Cols) */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-card flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Academic Trajectory & SGPA
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {academicRecords.length} Records In Vault
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Authenticated performance logged in the national database.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gov-blue-600" />
              Recorded Score
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={semesterRecords} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="semester" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  color: '#0f172a',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="Score / GPA"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total Database Credits: <b className="text-slate-900 font-bold">{totalCredits}</b></span>
          <span className="text-gov-blue-600 font-semibold">{academicRecords.length} Authenticated Records</span>
        </div>
      </div>

      {/* Credit Summary Card (1 Col) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Academic Bank of Credits
            </h3>
            <Award className="w-4 h-4 text-gov-blue-600" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real credit tally accumulated in repository
          </p>
        </div>

        <div className="my-6 text-center">
          <div className="text-4xl font-extrabold text-gov-blue-600 font-mono">
            {totalCredits}
          </div>
          <p className="text-xs text-slate-500 mt-1">Accumulated Academic Credits</p>
        </div>

        <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
          <div className="flex justify-between text-slate-600">
            <span>Verified Records:</span>
            <span className="font-bold text-emerald-700">
              {academicRecords.filter((r) => r.status === 'Verified').length}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Pending Verification:</span>
            <span className="font-bold text-amber-700">
              {academicRecords.filter((r) => r.status === 'Pending').length}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Under Review:</span>
            <span className="font-bold text-blue-700">
              {academicRecords.filter((r) => r.status === 'Under Review').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
