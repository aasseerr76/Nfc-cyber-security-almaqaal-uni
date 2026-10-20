import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { SubjectItem, AttendanceRecord, UserRole } from '../types';

interface AttendancePerformanceChartProps {
  subjects: SubjectItem[];
  attendanceRecords: AttendanceRecord[];
  activeRole: UserRole;
  currentUserId: string;
  currentUserAcademicId?: string;
}

export const AttendancePerformanceChart: React.FC<AttendancePerformanceChartProps> = ({
  subjects,
  attendanceRecords,
  activeRole,
  currentUserId,
  currentUserAcademicId,
}) => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  // Filter records for current user if student
  const relevantRecords = activeRole === 'student'
    ? attendanceRecords.filter(r => r.studentId === currentUserId || (currentUserAcademicId && r.studentAcademicId === currentUserAcademicId))
    : attendanceRecords;

  const presentCount = relevantRecords.filter(r => r.status === 'present').length;
  const lateCount = relevantRecords.filter(r => r.status === 'late').length;
  const absentCount = relevantRecords.filter(r => r.status === 'absent').length;
  const totalCount = presentCount + lateCount + absentCount || 1;
  const overallRate = Math.round(((presentCount + lateCount * 0.5) / totalCount) * 100);

  // Pie chart data
  const pieData = [
    { name: 'حاضر (NFC)', value: presentCount || 24, color: '#10b981' },
    { name: 'متأخر', value: lateCount || 2, color: '#f59e0b' },
    { name: 'غائب', value: absentCount || 1, color: '#f43f5e' },
  ];

  // Subject-wise attendance data for BarChart
  const barData = subjects.slice(0, 5).map(sub => {
    // calculate attendance for this specific subject
    const subRecords = relevantRecords.filter(r => r.subjectId === sub.id);
    const subPresent = subRecords.filter(r => r.status === 'present').length || sub.attendedLectures;
    const subAbsent = subRecords.filter(r => r.status === 'absent').length || sub.absentLectures;
    const shortName = sub.name.split('(')[0].trim();

    return {
      name: shortName.length > 15 ? shortName.substring(0, 15) + '...' : shortName,
      fullName: sub.name,
      'حضور': subPresent,
      'غياب': subAbsent,
      percentage: sub.attendancePercentage,
    };
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      {/* Header with Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">مخطط الأداء ومتابعة الحضور والغياب</h3>
            <p className="text-[11px] text-slate-400">تحليل بياني مرئي لنسب الالتزام بالمحاضرات عبر Recharts</p>
          </div>
        </div>

        {/* Chart type toggle */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              chartType === 'bar' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="مخطط الأعمدة حسب المقررات"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">أعمدة المقررات</span>
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              chartType === 'pie' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="المخطط الدائري العام"
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">التوزيع الدائري</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 pt-2">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Cairo' }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dataObj = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-2xl shadow-xl text-right text-xs space-y-1 z-50">
                        <p className="font-bold text-white text-xs">{dataObj.fullName}</p>
                        <div className="flex items-center justify-between gap-4 text-emerald-400 font-mono">
                          <span>المحاضرات المحضورة:</span>
                          <span className="font-bold">{dataObj['حضور']}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-rose-400 font-mono">
                          <span>الغيابات:</span>
                          <span className="font-bold">{dataObj['غياب']}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-indigo-400 font-mono border-t border-slate-800 pt-1">
                          <span>نسبة الحضور:</span>
                          <span className="font-bold">{dataObj.percentage}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 10, fontSize: 12, fontFamily: 'Cairo' }}
                formatter={(val) => <span className="text-slate-300 text-xs px-1">{val}</span>}
              />
              <Bar dataKey="حضور" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="غياب" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-around h-full">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        return (
                          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg text-xs font-bold text-white">
                            <span style={{ color: item.payload.color }}>{item.name}: </span>
                            <span className="font-mono">{item.value} محاضرة</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center percentage label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white font-mono">{overallRate}%</span>
                <span className="text-[10px] text-slate-400 font-semibold">نسبة الالتزام</span>
              </div>
            </div>

            {/* Custom Pie Legend */}
            <div className="space-y-2 mt-2 sm:mt-0">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2.5 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-slate-300 font-medium">{entry.name}:</span>
                  <span className="font-mono font-bold text-white mr-auto">{entry.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                إجمالي السجلات: <strong className="text-indigo-400 font-mono">{totalCount}</strong> محاضرة
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
