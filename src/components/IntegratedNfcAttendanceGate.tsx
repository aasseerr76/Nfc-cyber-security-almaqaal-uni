import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Search, 
  Filter, 
  Users, 
  Smartphone,
  ChevronDown,
  Check,
  Zap
} from 'lucide-react';
import { playNfcErrorSound } from '../services/sound';
import { AlmaaqalStudent } from '../services/studentsData';

export const IntegratedNfcAttendanceGate: React.FC = () => {
  const {
    currentUser,
    activeRole,
    subjects,
    attendanceRecords,
    registerAttendance,
    almaaqalStudentsList,
  } = useApp();

  const [activeSubjectId, setActiveSubjectId] = useState<string>(subjects[0]?.id || 'sub_ar_ai_312');
  const [isTapping, setIsTapping] = useState(false);
  const [tappingStudentId, setTappingStudentId] = useState<string | null>(null);
  const [lastRegistered, setLastRegistered] = useState<{
    studentName: string;
    subjectName: string;
    time: string;
    academicId: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters for the Almaaqal student roster
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'stage2_morn' | 'stage2_eve' | 'stage3_morn' | 'stage3_eve'>('all');
  const [showRoster, setShowRoster] = useState(true);

  if (!currentUser) return null;

  const currentSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to check if student is already marked present for the selected subject today
  const isStudentPresent = (academicId: string) => {
    return attendanceRecords.some(
      r => r.studentAcademicId === academicId && r.subjectId === activeSubjectId && r.date === todayStr
    );
  };

  const getStudentAttendanceTime = (academicId: string) => {
    const rec = attendanceRecords.find(
      r => r.studentAcademicId === academicId && r.subjectId === activeSubjectId && r.date === todayStr
    );
    return rec ? rec.time : null;
  };

  // Perform NFC tap for a specific student (or current user)
  const handleTapStudent = (student: { id: string; name: string; academicId: string; nfcCardId: string }) => {
    setErrorMessage(null);
    setIsTapping(true);
    setTappingStudentId(student.id);

    setTimeout(() => {
      setIsTapping(false);
      setTappingStudentId(null);

      const result = registerAttendance(
        {
          id: student.id,
          name: student.name,
          academicId: student.academicId,
          nfcTag: student.nfcCardId,
        },
        activeSubjectId,
        'nfc'
      );

      if (result.success && result.record) {
        setLastRegistered({
          studentName: result.record.studentName,
          subjectName: result.record.subjectName,
          time: result.record.time,
          academicId: result.record.studentAcademicId,
        });
      } else {
        setErrorMessage(result.message);
        playNfcErrorSound();
      }
    }, 450);
  };

  // Filter students
  const filteredStudents = almaaqalStudentsList.filter(stu => {
    // Stage & Shift filter
    if (selectedFilter === 'stage2_morn' && !(stu.stage === 'المرحلة الثانية' && stu.shift === 'صباحي')) return false;
    if (selectedFilter === 'stage2_eve' && !(stu.stage === 'المرحلة الثانية' && stu.shift === 'مسائي')) return false;
    if (selectedFilter === 'stage3_morn' && !(stu.stage === 'المرحلة الثالثة' && stu.shift === 'صباحي')) return false;
    if (selectedFilter === 'stage3_eve' && !(stu.stage === 'المرحلة الثالثة' && stu.shift === 'مسائي')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return stu.name.toLowerCase().includes(q) || stu.academicId.includes(q);
    }
    return true;
  });

  const presentCountInView = filteredStudents.filter(s => isStudentPresent(s.academicId)).length;

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm">بوابة وقوائم تسجيل الحضور بـ NFC</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                جامعة المعقل
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              تسجيل ومطابقة كروت الـ NFC لطلاب كلية الهندسة
            </p>
          </div>
        </div>

        {/* Selected Subject Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">المادة:</span>
          <select
            value={activeSubjectId}
            onChange={e => {
              setActiveSubjectId(e.target.value);
              setErrorMessage(null);
              setLastRegistered(null);
            }}
            className="bg-transparent text-indigo-300 font-bold focus:outline-none cursor-pointer max-w-[200px] truncate"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick NFC Tap for the Active User (Student / Lecturer) */}
      <div
        onClick={() => !isTapping && handleTapStudent({
          id: currentUser.id,
          name: currentUser.name,
          academicId: currentUser.academicId,
          nfcCardId: currentUser.nfcCardId,
        })}
        className={`cursor-pointer rounded-2xl p-4 bg-gradient-to-r from-indigo-950/90 via-slate-850 to-slate-900 border transition-all duration-300 relative overflow-hidden select-none ${
          isTapping && !tappingStudentId
            ? 'scale-98 border-emerald-400 bg-emerald-950/30 ring-2 ring-emerald-500/30' 
            : 'border-indigo-500/40 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isTapping && !tappingStudentId ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white shadow-md'
            }`}>
              <Radio className={`w-6 h-6 ${isTapping ? 'animate-bounce' : 'animate-pulse'}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{currentUser.name}</span>
                <span className="text-[10px] text-indigo-300 font-mono">{currentUser.academicId}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {isTapping ? 'جاري قراءة الشريحة وتوثيق الحضور...' : 'المس هنا لتسجيل حضورك الفوري ببطاقة NFC'}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            تمرير البطاقة
          </span>
        </div>
      </div>

      {/* Confirmation Feedback */}
      {lastRegistered && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs text-emerald-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              تم توثيق حضور <strong>{lastRegistered.studentName}</strong> ({lastRegistered.academicId}) لمادة <strong>{lastRegistered.subjectName}</strong> بنجاح!
            </span>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
            {lastRegistered.time} • NFC ✅
          </span>
        </div>
      )}

      {/* Error Feedback */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-2xl flex items-center gap-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Official Almaaqal Student Rosters with NFC Action */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white">
              قوائم طلاب جامعة المعقل لتسجيل الحضور بـ NFC
            </h4>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              حاضر: {presentCountInView} من {filteredStudents.length}
            </span>
          </div>

          <button
            onClick={() => setShowRoster(prev => !prev)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium self-end sm:self-auto"
          >
            {showRoster ? 'إخفاء القائمة' : 'عرض القائمة الكاملة'}
          </button>
        </div>

        {showRoster && (
          <div className="space-y-3">
            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="بحث باسم الطالب أو الرقم المعرفي..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pr-9 pl-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute top-2.5 right-3 pointer-events-none" />
              </div>

              {/* Roster Filter */}
              <select
                value={selectedFilter}
                onChange={e => setSelectedFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">جميع المراحل والدوام ({almaaqalStudentsList.length} طالب)</option>
                <option value="stage2_morn">المرحلة الثانية - صباحي (141)</option>
                <option value="stage2_eve">المرحلة الثانية - مسائي (109)</option>
                <option value="stage3_morn">المرحلة الثالثة - صباحي (214)</option>
                <option value="stage3_eve">المرحلة الثالثة - مسائي (74)</option>
              </select>
            </div>

            {/* Students List Table */}
            <div className="max-h-72 overflow-y-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 divide-y divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  لا يوجد طلاب يطابقون معايير البحث
                </div>
              ) : (
                filteredStudents.map(student => {
                  const present = isStudentPresent(student.academicId);
                  const attTime = getStudentAttendanceTime(student.academicId);
                  const isCurrentTapping = tappingStudentId === student.id;

                  return (
                    <div
                      key={student.id}
                      className={`p-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                        present ? 'bg-emerald-950/20' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 truncate">{student.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                            {student.academicId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{student.stage} ({student.shift})</span>
                          <span>•</span>
                          <span className="font-mono text-indigo-400 text-[10px]">{student.nfcCardId}</span>
                        </div>
                      </div>

                      {/* Action or Status */}
                      <div>
                        {present ? (
                          <div className="flex items-center gap-1 text-emerald-400 font-bold text-[11px] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>حاضر (NFC)</span>
                            {attTime && <span className="font-mono text-[10px] mr-1">{attTime}</span>}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleTapStudent(student)}
                            disabled={isTapping}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                              isCurrentTapping
                                ? 'bg-emerald-500 text-white animate-pulse'
                                : 'bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40'
                            }`}
                            title="تمرير بطاقة الـ NFC لهذا الطالب"
                          >
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>تمرير NFC</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
