import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, BookOpen, CheckCircle2, Edit2, X, Check, ShieldCheck } from 'lucide-react';
import { SubjectItem } from '../types';

export const SubjectsAndGradesSection: React.FC = () => {
  const { subjects, currentUser, activeRole, updateSubjectGrades, updateSubjectDetails } = useApp();
  const [subTab, setSubTab] = useState<'subjects' | 'grades'>('subjects');

  // Teacher Editing Modal state for Grades
  const [editingGradeSubject, setEditingGradeSubject] = useState<SubjectItem | null>(null);
  const [editMidterm, setEditMidterm] = useState<number>(25);
  const [editPractical, setEditPractical] = useState<number>(18);
  const [editAssignments, setEditAssignments] = useState<number>(9);
  const [editFinal, setEditFinal] = useState<number>(38);

  // Teacher Editing Modal state for Subject Details
  const [editingSubjectInfo, setEditingSubjectInfo] = useState<SubjectItem | null>(null);
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSubjectCredits, setEditSubjectCredits] = useState(4);
  const [editSubjectTeacher, setEditSubjectTeacher] = useState('');

  if (!currentUser) return null;

  const gpa = currentUser.gpa || 3.84;

  const handleOpenGradeEdit = (sub: SubjectItem) => {
    setEditingGradeSubject(sub);
    setEditMidterm(sub.grades?.midterm || 25);
    setEditPractical(sub.grades?.practical || 18);
    setEditAssignments(sub.grades?.assignments || 9);
    setEditFinal(sub.grades?.finalExam || 35);
  };

  const handleSaveGrades = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGradeSubject) return;

    const total = editMidterm + editPractical + editAssignments + editFinal;
    let gradeLetter = 'B';
    if (total >= 90) gradeLetter = 'A+';
    else if (total >= 80) gradeLetter = 'A';
    else if (total >= 70) gradeLetter = 'B+';
    else if (total >= 60) gradeLetter = 'C';
    else if (total >= 50) gradeLetter = 'D';
    else gradeLetter = 'F';

    updateSubjectGrades(editingGradeSubject.id, {
      midterm: editMidterm,
      practical: editPractical,
      assignments: editAssignments,
      finalExam: editFinal,
      total,
      maxScore: 100,
      gradeLetter,
      status: total >= 50 ? 'ناجح' : 'تحت المراجعة',
    });

    setEditingGradeSubject(null);
  };

  const handleOpenSubjectEdit = (sub: SubjectItem) => {
    setEditingSubjectInfo(sub);
    setEditSubjectName(sub.name);
    setEditSubjectCredits(sub.credits);
    setEditSubjectTeacher(sub.teacherName);
  };

  const handleSaveSubjectInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubjectInfo) return;

    updateSubjectDetails(editingSubjectInfo.id, {
      name: editSubjectName,
      credits: editSubjectCredits,
      teacherName: editSubjectTeacher,
    });

    setEditingSubjectInfo(null);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header with Switcher */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-3xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">المواد الدراسية والنتائج</h2>
              {activeRole === 'teacher' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  صلاحيات رصد الدرجات متاحة
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {activeRole === 'student' ? 'متابعة المواد ونسب الحضور والدرجات' : 'إدارة المقررات ورصد درجات وسعي الطلاب'}
            </p>
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

                <div className="flex items-center gap-2">
                  <div className="text-left font-mono">
                    <span className="text-xs font-black text-emerald-400">{sub.attendancePercentage}%</span>
                    <span className="text-[10px] text-slate-500 block">حضور</span>
                  </div>

                  {activeRole === 'teacher' && (
                    <button
                      onClick={() => handleOpenSubjectEdit(sub)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer mr-1"
                      title="تعديل بيانات المقرر"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
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
              <span className="text-[11px] text-indigo-300">المعدل التراكمي المعتمد</span>
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
                  {activeRole === 'teacher' && <th className="py-2.5 px-3">إجراءات التدريسي</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {subjects.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                      {sub.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {(sub.grades?.midterm || 0) + (sub.grades?.practical || 0) + (sub.grades?.assignments || 0)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{sub.grades?.finalExam ? sub.grades.finalExam.toFixed(1) : '—'}</td>
                    <td className="py-2.5 px-3 font-bold text-indigo-400">{sub.grades?.total.toFixed(1)}%</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                        {sub.grades?.gradeLetter}
                      </span>
                    </td>
                    {activeRole === 'teacher' && (
                      <td className="py-2.5 px-3 font-sans">
                        <button
                          onClick={() => handleOpenGradeEdit(sub)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer border border-indigo-500/40"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>تعديل السعي والدرجات</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teacher Grade Edit Modal */}
      {editingGradeSubject && activeRole === 'teacher' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">رصد وتعديل درجات المادة</h3>
                <p className="text-[11px] text-slate-400">{editingGradeSubject.name}</p>
              </div>
              <button onClick={() => setEditingGradeSubject(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGrades} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">الامتحان الفصلي (30)</label>
                  <input
                    type="number"
                    step="0.5"
                    max="30"
                    min="0"
                    value={editMidterm}
                    onChange={e => setEditMidterm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">العملي والمختبر (20)</label>
                  <input
                    type="number"
                    step="0.5"
                    max="20"
                    min="0"
                    value={editPractical}
                    onChange={e => setEditPractical(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">الواجبات والأنشطة (10)</label>
                  <input
                    type="number"
                    step="0.5"
                    max="10"
                    min="0"
                    value={editAssignments}
                    onChange={e => setEditAssignments(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">الامتحان النهائي (40)</label>
                  <input
                    type="number"
                    step="0.5"
                    max="40"
                    min="0"
                    value={editFinal}
                    onChange={e => setEditFinal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Total preview */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">المجموع النهائي المحسوب:</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {editMidterm + editPractical + editAssignments + editFinal} / 100
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGradeSubject(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/30"
                >
                  حفظ وتحديث السجل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Subject Info Edit Modal */}
      {editingSubjectInfo && activeRole === 'teacher' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">تعديل بيانات المادة الدراسية</h3>
              <button onClick={() => setEditingSubjectInfo(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubjectInfo} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">اسم المقرر</label>
                <input
                  type="text"
                  value={editSubjectName}
                  onChange={e => setEditSubjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">عدد الوحدات الدراسية (Credits)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editSubjectCredits}
                  onChange={e => setEditSubjectCredits(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">أستاذ المادة</label>
                <input
                  type="text"
                  value={editSubjectTeacher}
                  onChange={e => setEditSubjectTeacher(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSubjectInfo(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/30"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
