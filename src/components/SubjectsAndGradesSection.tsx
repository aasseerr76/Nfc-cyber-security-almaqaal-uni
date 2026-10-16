import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, BookOpen, CheckCircle2 } from 'lucide-react';

export const SubjectsAndGradesSection: React.FC = () => {
  const { subjects, currentUser } = useApp();
  const [subTab, setSubTab] = useState<'subjects' | 'grades'>('subjects');

  if (!currentUser) return null;

  const gpa = currentUser.gpa || 3.84;

  return (
    <div className="space-y-4 pb-20">
      {/* Header with Switcher */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-3xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">المواد الدراسية والنتائج</h2>
            <p className="text-[11px] text-slate-400">متابعة المواد ونسب الحضور والدرجات</p>
          </div>
        </div>

        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSubTab('subjects')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'subjects' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            المواد
          </button>
          <button
            onClick={() => setSubTab('grades')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subTab === 'grades' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            النتائج (GPA)
          </button>
        </div>
      </div>

      {/* Tab 1: Subjects & Attendance */}
      {subTab === 'subjects' ? (
        <div className="space-y-3">
          {subjects.map(sub => (
            <div
              key={sub.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {sub.code}
                    </span>
                    <h3 className="text-xs font-bold text-white">{sub.name}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    المدرس: <span className="text-slate-300">{sub.teacherName}</span> • {sub.credits} وحدات
                  </p>
                </div>

                <div className="text-left font-mono">
                  <span className="text-xs font-black text-emerald-400">{sub.attendancePercentage}%</span>
                  <span className="text-[10px] text-slate-500 block">حضور</span>
                </div>
              </div>

              {/* Attendance Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full"
                    style={{ width: `${sub.attendancePercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>حضور: {sub.attendedLectures} من {sub.totalLectures}</span>
                  <span>غياب: {sub.absentLectures}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Tab 2: Grades & Results */
        <div className="space-y-4">
          {/* GPA Card */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-indigo-300">المعدل التراكمي (GPA)</span>
              <h3 className="text-2xl font-black text-white font-mono">{gpa} <span className="text-xs font-normal text-slate-400">/ 4.0</span></h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              تقدير: ممتاز
            </span>
          </div>

          {/* Grades List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                  <th className="py-2.5 px-3">المادة</th>
                  <th className="py-2.5 px-3">السعي</th>
                  <th className="py-2.5 px-3">النهائي</th>
                  <th className="py-2.5 px-3 font-bold text-indigo-300">المجموع</th>
                  <th className="py-2.5 px-3">التقدير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {subjects.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                      {sub.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{sub.grades?.midterm.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-slate-300">{sub.grades?.finalExam ? sub.grades.finalExam.toFixed(1) : '—'}</td>
                    <td className="py-2.5 px-3 font-bold text-indigo-400">{sub.grades?.total.toFixed(1)}%</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                        {sub.grades?.gradeLetter}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
