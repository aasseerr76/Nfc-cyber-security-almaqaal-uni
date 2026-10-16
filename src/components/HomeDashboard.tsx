import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  ShieldCheck,
  Calendar,
  Radio
} from 'lucide-react';
import { IntegratedNfcAttendanceGate } from './IntegratedNfcAttendanceGate';

export const HomeDashboard: React.FC = () => {
  const {
    currentUser,
    activeRole,
    attendanceRecords,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!currentUser) return null;

  // Calculate attendance statistics
  const userRecords = activeRole === 'student'
    ? attendanceRecords.filter(r => r.studentId === currentUser.id)
    : attendanceRecords;

  const totalAttended = userRecords.filter(r => r.status === 'present').length;
  const totalLate = userRecords.filter(r => r.status === 'late').length;
  const totalAbsent = userRecords.filter(r => r.status === 'absent').length;
  const totalCount = totalAttended + totalLate + totalAbsent || 1;
  const attendanceRate = Math.round(((totalAttended + totalLate * 0.5) / totalCount) * 100) || 94;

  const filteredRecords = userRecords.filter(rec => {
    if (filterStatus === 'all') return true;
    return rec.status === filterStatus;
  });

  return (
    <div className="space-y-5 pb-20">
      {/* User Header & Academic Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">{currentUser.name}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                activeRole === 'student'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              }`}>
                {activeRole === 'student' ? 'طالب' : 'تدريسي'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser.department} • {activeRole === 'student' ? currentUser.stage : currentUser.title}
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-left text-xs">
          <span className="text-slate-400 block font-mono">{currentUser.academicId}</span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 justify-end font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            حساب نشط
          </span>
        </div>
      </div>

      {/* 3 Key Stats: Attendance Rate, Present, Absent */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-slate-400 text-xs block mb-1">نسبة الحضور</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{attendanceRate}%</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-slate-400 text-xs block mb-1">المحاضرات المحضورة</span>
          <span className="text-2xl font-black text-white font-mono">{totalAttended}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-slate-400 text-xs block mb-1">الغيابات</span>
          <span className="text-2xl font-black text-rose-400 font-mono">{totalAbsent}</span>
        </div>
      </div>

      {/* Integrated NFC Attendance Gateway (Hero feature) */}
      <IntegratedNfcAttendanceGate />

      {/* Attendance & Absence Records Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">سجل الحضور والغياب</h3>
            <p className="text-[11px] text-slate-400">توثيق حضور المحاضرات بالوقت والشريحة</p>
          </div>

          {/* Simple status filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterStatus('present')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'present' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              حاضر
            </button>
            <button
              onClick={() => setFilterStatus('absent')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'absent' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              غائب
            </button>
          </div>
        </div>

        {/* Compact, clean list */}
        <div className="space-y-2.5">
          {filteredRecords.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-500">لا توجد سجلات تطابق الاختيار</p>
          ) : (
            filteredRecords.map(rec => (
              <div
                key={rec.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-200">{rec.subjectName}</h4>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5 font-mono">
                    <span>{rec.date}</span>
                    <span>•</span>
                    <span>{rec.time}</span>
                    <span>•</span>
                    <span>{rec.room}</span>
                  </div>
                </div>

                <div>
                  {rec.status === 'present' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      حاضر (NFC)
                    </span>
                  ) : rec.status === 'late' ? (
                    <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold text-[11px]">
                      <Clock className="w-3 h-3" />
                      متأخر
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full font-bold text-[11px]">
                      <XCircle className="w-3 h-3" />
                      غائب
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
