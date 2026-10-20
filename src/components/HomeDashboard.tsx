import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  ShieldCheck,
  Radio,
  Trash2,
  Edit2
} from 'lucide-react';
import { IntegratedNfcAttendanceGate } from './IntegratedNfcAttendanceGate';
import { AttendancePerformanceChart } from './AttendancePerformanceChart';
import { UserAvatar } from './UserAvatar';

export const HomeDashboard: React.FC = () => {
  const {
    currentUser,
    activeRole,
    subjects,
    attendanceRecords,
    updateAttendanceStatus,
    deleteAttendanceRecord,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!currentUser) return null;

  // Calculate attendance statistics
  const userRecords = activeRole === 'student'
    ? attendanceRecords.filter(r => r.studentId === currentUser.id || r.studentAcademicId === currentUser.academicId)
    : attendanceRecords;

  const totalAttended = userRecords.filter(r => r.status === 'present').length;
  const totalLate = userRecords.filter(r => r.status === 'late').length;
  const totalAbsent = userRecords.filter(r => r.status === 'absent').length;
  const totalCount = totalAttended + totalLate + totalAbsent || 1;
  const attendanceRate = Math.round(((totalAttended + totalLate * 0.5) / totalCount) * 100);

  const filteredRecords = userRecords.filter(rec => {
    if (filterStatus === 'all') return true;
    return rec.status === filterStatus;
  });

  return (
    <div className="space-y-5 pb-20">
      {/* User Header & Academic Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <UserAvatar
            name={currentUser.name}
            role={activeRole}
            avatar={currentUser.avatar}
            size="lg"
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

      {/* Recharts Visual Performance Analytics */}
      <AttendancePerformanceChart
        subjects={subjects}
        attendanceRecords={attendanceRecords}
        activeRole={activeRole}
        currentUserId={currentUser.id}
        currentUserAcademicId={currentUser.academicId}
      />

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
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-200">{rec.subjectName}</h4>
                    {activeRole === 'teacher' && (
                      <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
                        {rec.studentName} ({rec.studentAcademicId})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5 font-mono">
                    <span>{rec.date}</span>
                    <span>•</span>
                    <span>{rec.time}</span>
                    <span>•</span>
                    <span>{rec.room}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeRole === 'teacher' ? (
                    /* Teacher Editing Controls */
                    <div className="flex items-center gap-2">
                      <select
                        value={rec.status}
                        onChange={e => updateAttendanceStatus(rec.id, e.target.value as any)}
                        className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none cursor-pointer transition-colors ${
                          rec.status === 'present'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                            : rec.status === 'late'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                            : rec.status === 'excused'
                            ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                            : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        <option value="present">حاضر (NFC)</option>
                        <option value="late">متأخر</option>
                        <option value="absent">غائب</option>
                        <option value="excused">بعذر رسمي</option>
                      </select>

                      <button
                        onClick={() => deleteAttendanceRecord(rec.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                        title="حذف هذا السجل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    /* Student Read-Only Badges */
                    rec.status === 'present' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        حاضر (NFC)
                      </span>
                    ) : rec.status === 'late' ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold text-[11px]">
                        <Clock className="w-3 h-3" />
                        متأخر
                      </span>
                    ) : rec.status === 'excused' ? (
                      <span className="inline-flex items-center gap-1 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold text-[11px]">
                        <ShieldCheck className="w-3 h-3" />
                        بعذر
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full font-bold text-[11px]">
                        <XCircle className="w-3 h-3" />
                        غائب
                      </span>
                    )
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
