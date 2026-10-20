import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Search, 
  Users, 
  Smartphone,
  Trash2,
  X,
  ShieldCheck,
  ShieldAlert,
  Zap,
  CreditCard,
  HandMetal
} from 'lucide-react';
import { playNfcErrorSound, playNfcSuccessSound } from '../services/sound';
import { UserAvatar } from './UserAvatar';
import { AlmaaqalStudent } from '../services/studentsData';

export const IntegratedNfcAttendanceGate: React.FC = () => {
  const {
    currentUser,
    activeRole,
    subjects,
    attendanceRecords,
    registerAttendance,
    removeAttendanceForStudent,
    almaaqalStudentsList,
  } = useApp();

  const [activeSubjectId, setActiveSubjectId] = useState<string>(subjects[0]?.id || 'sub_ar_ai_312');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Target student currently being verified via NFC
  const [targetStudentForNfc, setTargetStudentForNfc] = useState<{
    id: string;
    name: string;
    academicId: string;
    nfcCardId: string;
  } | null>(null);

  // NFC Scan Modal State
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);
  const [nfcScanStatus, setNfcScanStatus] = useState<'waiting' | 'reading' | 'matched' | 'mismatched'>('waiting');
  const [nfcFeedbackMessage, setNfcFeedbackMessage] = useState<string>('');

  // Manual Confirmation Modal for Teachers
  const [manualConfirmStudent, setManualConfirmStudent] = useState<AlmaaqalStudent | null>(null);

  // Filters for the student roster
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

  // Open NFC Reader for a specific student (or current student user)
  const handleOpenNfcReader = (student: { id: string; name: string; academicId: string; nfcCardId: string }) => {
    // Strict security check: Student cannot initiate NFC for classmates
    if (activeRole === 'student' && student.academicId !== currentUser.academicId) {
      setErrorMessage('بصفتك طالباً، لا يمكنك تسجيل الحضور لزملائك. يمكنك تسجيل الحضور لبطاقتك الشخصية فقط.');
      playNfcErrorSound();
      return;
    }

    setTargetStudentForNfc(student);
    setErrorMessage(null);
    setSuccessMessage(null);
    setNfcScanStatus('waiting');
    setNfcFeedbackMessage('قرّب بطاقة الـ NFC الذكية من منطقة استشعار القارئ...');
    setIsNfcModalOpen(true);

    // If native Web NFC is supported on Android Chrome, activate native hardware scanner
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      try {
        const ndef = new (window as any).NDEFReader();
        ndef.scan().then(() => {
          ndef.onreading = (event: any) => {
            const serial = event.serialNumber || student.nfcCardId;
            handleCardScanned(serial, student);
          };
          ndef.onreadingerror = () => {
            setNfcScanStatus('mismatched');
            setNfcFeedbackMessage('تعذر قراءة شريحة الـ NFC. يرجى محاذاة البطاقة وإعادة المحاولة.');
            playNfcErrorSound();
          };
        }).catch((err: any) => {
          console.warn('Web NFC hardware error or permission denied:', err);
        });
      } catch (err) {
        console.warn('NDEFReader initialization failed:', err);
      }
    }
  };

  // Process Scanned Card UID against target student's registered card
  const handleCardScanned = (cardUid: string, targetStudent: { id: string; name: string; academicId: string; nfcCardId: string }) => {
    setNfcScanStatus('reading');
    setNfcFeedbackMessage('جاري الاتصال بالشريحة وفحص كود الـ UID...');

    setTimeout(() => {
      // 1. Validate if the tapped card UID matches the student's registered NFC card ID
      if (cardUid !== targetStudent.nfcCardId) {
        setNfcScanStatus('mismatched');
        setNfcFeedbackMessage(`❌ تم رفض الشريحة (${cardUid})! البطاقة المقربة غير مطابقة لبطاقة الطالب (${targetStudent.name}) المسجلة (${targetStudent.nfcCardId}). لا يمكن استخدام بطاقة أخرى.`);
        playNfcErrorSound();
        return;
      }

      // 2. Card matches perfectly
      setNfcScanStatus('matched');
      setNfcFeedbackMessage(`✅ تم التحقق والمطابقة بنجاح! شريحة NFC معتمدة (${cardUid}).`);
      playNfcSuccessSound();

      const result = registerAttendance(
        {
          id: targetStudent.id,
          name: targetStudent.name,
          academicId: targetStudent.academicId,
          nfcTag: cardUid,
        },
        activeSubjectId,
        'nfc'
      );

      if (result.success) {
        setSuccessMessage(`تم توثيق حضور (${targetStudent.name}) بنجاح لمادة ${currentSubject.name}`);
      }

      setTimeout(() => {
        setIsNfcModalOpen(false);
      }, 1600);
    }, 700);
  };

  // Teacher Authority: Remove / Cancel a student's attendance record
  const handleRemoveAttendance = (studentAcademicId: string, studentName: string) => {
    if (activeRole !== 'teacher') {
      setErrorMessage('إلغاء الحضور من الصلاحيات الإدارية الخاصة بالأستاذ فقط.');
      return;
    }

    const result = removeAttendanceForStudent(studentAcademicId, activeSubjectId);
    if (result.success) {
      setSuccessMessage(result.message);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.message);
    }
  };

  // Teacher Authority: Manual attendance override with explicit confirmation
  const handleManualAttendanceConfirm = () => {
    if (!manualConfirmStudent || activeRole !== 'teacher') return;

    const result = registerAttendance(
      {
        id: manualConfirmStudent.id,
        name: manualConfirmStudent.name,
        academicId: manualConfirmStudent.academicId,
        nfcTag: 'MANUAL-DOC-OVERRIDE',
      },
      activeSubjectId,
      'manual'
    );

    if (result.success) {
      setSuccessMessage(`تم تسجيل حضور الطالب (${manualConfirmStudent.name}) يدوياً بواسطة التدريسي.`);
      setErrorMessage(null);
    }
    setManualConfirmStudent(null);
  };

  // Filter students for the roster
  const filteredStudents = almaaqalStudentsList.filter(stu => {
    if (selectedFilter === 'stage2_morn' && !(stu.stage === 'المرحلة الثانية' && stu.shift === 'صباحي')) return false;
    if (selectedFilter === 'stage2_eve' && !(stu.stage === 'المرحلة الثانية' && stu.shift === 'مسائي')) return false;
    if (selectedFilter === 'stage3_morn' && !(stu.stage === 'المرحلة الثالثة' && stu.shift === 'صباحي')) return false;
    if (selectedFilter === 'stage3_eve' && !(stu.stage === 'المرحلة الثالثة' && stu.shift === 'مسائي')) return false;

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
                جامعة المعقل الاهلية
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {activeRole === 'student' 
                ? 'تسجيل الحضور يتطلب وضع بطاقة الـ NFC المعتمدة ومطابقتها' 
                : 'لوحة إدارة الحضور • إثبات الحضور بـ NFC أو يدوياً أو إلغائه'}
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
              setSuccessMessage(null);
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

      {/* Interactive Official University Smart NFC Card */}
      {(() => {
        const isSelfPresent = isStudentPresent(currentUser.academicId);
        const selfAttTime = getStudentAttendanceTime(currentUser.academicId);

        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {activeRole === 'student'
                    ? 'بطاقتك الجامعية الذكية • اضغط لفتح قارئ الـ NFC وتقريب البطاقة'
                    : 'بطاقة التدريسي المعتمدة'}
                </span>
              </span>
              {activeRole === 'student' && !isSelfPresent && (
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>يتطلب تقريب البطاقة</span>
                </span>
              )}
            </div>

            {/* Smart NFC Card Component - Clicking OPENS the scanner, NEVER auto-marks */}
            <div
              onClick={() => {
                if (activeRole === 'student') {
                  handleOpenNfcReader({
                    id: currentUser.id,
                    name: currentUser.name,
                    academicId: currentUser.academicId,
                    nfcCardId: currentUser.nfcCardId,
                  });
                }
              }}
              role="button"
              tabIndex={0}
              className={`group relative rounded-3xl p-5 sm:p-6 transition-all duration-300 select-none overflow-hidden ${
                isSelfPresent
                  ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 border-2 border-emerald-500/60 shadow-xl'
                  : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-500/50 shadow-xl cursor-pointer hover:border-indigo-400'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between relative z-10 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black tracking-wider text-white">
                      جامعة المعقل الأهلية
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold font-mono">
                      AL-MAAQAL UNIVERSITY
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-300/80 font-medium block mt-0.5">
                    كلية الهندسة والتكنولوجيا • قسم {currentUser.department}
                  </span>
                </div>

                {/* EMV Gold Chip & Contactless Waves */}
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-400 p-0.5 shadow-md flex items-center justify-center border border-amber-200">
                    <div className="w-full h-full rounded border border-amber-800/40 grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5 bg-amber-400/90">
                      <div className="border border-amber-900/30 rounded-xs"></div>
                      <div className="border border-amber-900/30 rounded-xs"></div>
                      <div className="border border-amber-900/30 rounded-xs"></div>
                      <div className="border border-amber-900/30 rounded-xs"></div>
                    </div>
                  </div>

                  <div className={`p-2 rounded-xl transition-all ${
                    isSelfPresent
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 animate-pulse'
                  }`}>
                    <Radio className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Card Center: Student Identity */}
              <div className="flex items-center gap-4 relative z-10 my-3">
                <UserAvatar
                  name={currentUser.name}
                  role={activeRole}
                  avatar={currentUser.avatar}
                  size="lg"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base sm:text-lg font-black text-white truncate">{currentUser.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                      {activeRole === 'student' ? 'طالب' : 'تدريسي'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="font-mono text-indigo-300 font-bold tracking-wider">
                      ID: {currentUser.academicId}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300 text-[11px] truncate">
                      {activeRole === 'student' ? currentUser.stage : currentUser.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Bottom: NFC UID & Action Prompt Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs relative z-10">
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span className="text-slate-500">NFC UID:</span>
                  <span className="text-indigo-400 font-bold">{currentUser.nfcCardId}</span>
                </div>

                <div>
                  {isSelfPresent ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>حاضر اليوم ({selfAttTime || 'مسجل'}) ✅</span>
                      </div>
                      {activeRole === 'teacher' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAttendance(currentUser.academicId, currentUser.name);
                          }}
                          className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-[11px] font-bold border border-rose-500/30 transition-colors"
                        >
                          إلغاء الحضور ❌
                        </button>
                      )}
                    </div>
                  ) : activeRole === 'student' ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNfcReader({
                          id: currentUser.id,
                          name: currentUser.name,
                          academicId: currentUser.academicId,
                          nfcCardId: currentUser.nfcCardId,
                        });
                      }}
                      className="flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30 cursor-pointer"
                    >
                      <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>فتح قارئ NFC لتقريب البطاقة 📡</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">
                      لوحة التدريسي لإدارة حضور الطلبة
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs text-emerald-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="p-1 text-emerald-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Error Feedback */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-2xl flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 text-rose-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Student Roster: Strict Role-Based Attendance */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white">
              {activeRole === 'teacher'
                ? 'إدارة كشف الحضور والغياب (صلاحية إثبات وإلغاء حضور الطلبة للتدريسي)'
                : 'كشف حضور وغياب طلاب المرحلة (عرض السجل العام)'}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              حاضر: {presentCountInView} من {filteredStudents.length}
            </span>
          </div>

          <button
            onClick={() => setShowRoster(prev => !prev)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium self-end sm:self-auto cursor-pointer"
          >
            {showRoster ? 'إخفاء الكشف' : 'عرض كشف الطلبة'}
          </button>
        </div>

        {showRoster && (
          <div className="space-y-3">
            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row gap-2">
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

              <select
                value={selectedFilter}
                onChange={e => setSelectedFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">جميع المراحل والدوام ({almaaqalStudentsList.length} طالب)</option>
                <option value="stage2_morn">المرحلة الثانية - صباحي (30)</option>
                <option value="stage2_eve">المرحلة الثانية - مسائي (20)</option>
                <option value="stage3_morn">المرحلة الثالثة - صباحي (26)</option>
                <option value="stage3_eve">المرحلة الثالثة - مسائي (18)</option>
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
                  const isCurrentUserRow = student.academicId === currentUser.academicId;

                  return (
                    <div
                      key={student.id}
                      className={`p-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                        isCurrentUserRow
                          ? 'bg-indigo-950/30 border-r-2 border-r-indigo-500'
                          : present
                          ? 'bg-emerald-950/20'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <UserAvatar name={student.name} role="student" size="sm" showBadge={false} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 truncate">{student.name}</span>
                            {isCurrentUserRow && (
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-bold border border-indigo-500/30">
                                أنت
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                              {student.academicId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{student.stage} ({student.shift})</span>
                            <span>•</span>
                            <span>{student.department}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action or Status - Strict Role Enforcement */}
                      <div className="flex items-center gap-2">
                        {present ? (
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1 text-emerald-400 font-bold text-[11px] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>حاضر (NFC)</span>
                              {attTime && <span className="font-mono text-[10px] mr-1">{attTime}</span>}
                            </div>

                            {/* TEACHER ONLY AUTHORITY: CANCEL/REMOVE ATTENDANCE */}
                            {activeRole === 'teacher' && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAttendance(student.academicId, student.name)}
                                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="إلغاء حضور هذا الطالب وتحويله إلى غائب"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>إلغاء الحضور</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div>
                            {/* TEACHER AUTHORITY */}
                            {activeRole === 'teacher' ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenNfcReader(student)}
                                  className="px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer"
                                  title="فتح قارئ NFC لتقريب بطاقة هذا الطالب"
                                >
                                  <Radio className="w-3 h-3 text-amber-300" />
                                  <span>فحص NFC</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setManualConfirmStudent(student)}
                                  className="px-2 py-1.5 rounded-xl font-bold text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                                  title="تسجيل يدوي بدون بطاقة NFC"
                                >
                                  يدوي
                                </button>
                              </div>
                            ) : isCurrentUserRow ? (
                              /* STUDENT CAN ONLY OPEN NFC SCANNER FOR THEMSELVES */
                              <button
                                type="button"
                                onClick={() => handleOpenNfcReader({
                                  id: currentUser.id,
                                  name: currentUser.name,
                                  academicId: currentUser.academicId,
                                  nfcCardId: currentUser.nfcCardId,
                                })}
                                className="px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer"
                              >
                                <Radio className="w-3 h-3 text-white animate-pulse" />
                                <span>تقريب بطاقتي (NFC)</span>
                              </button>
                            ) : (
                              /* STUDENTS CANNOT TAP FOR PEERS: STRICTLY READ-ONLY */
                              <span className="text-[11px] font-medium text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg">
                                غائب
                              </span>
                            )}
                          </div>
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

      {/* Realistic NFC Sensor Terminal Modal - MUST SCAN CARD */}
      {isNfcModalOpen && targetStudentForNfc && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsNfcModalOpen(false)}
              className="absolute top-4 left-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono mb-2">
                <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                <span>قارئ الـ NFC قيد الاستماع</span>
              </div>
              <h3 className="font-bold text-white text-base">بوابة التحقق ومطابقة شريحة الـ NFC</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                الطالب المطلوب: <strong className="text-white">{targetStudentForNfc.name}</strong>
              </p>
            </div>

            {/* Animated Contactless Scanning Radar */}
            <div className="py-3 flex justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${
                  nfcScanStatus === 'matched'
                    ? 'border-emerald-500 bg-emerald-500/20 scale-105'
                    : nfcScanStatus === 'mismatched'
                    ? 'border-rose-500 bg-rose-500/20'
                    : 'border-indigo-500/40 bg-indigo-500/10 animate-ping'
                }`}></div>
                
                <div className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all ${
                  nfcScanStatus === 'matched'
                    ? 'bg-emerald-600 shadow-emerald-500/40'
                    : nfcScanStatus === 'mismatched'
                    ? 'bg-rose-600 shadow-rose-500/40'
                    : 'bg-indigo-600 shadow-indigo-500/40'
                }`}>
                  {nfcScanStatus === 'matched' ? (
                    <ShieldCheck className="w-12 h-12 text-white animate-bounce" />
                  ) : nfcScanStatus === 'mismatched' ? (
                    <ShieldAlert className="w-12 h-12 text-white animate-bounce" />
                  ) : (
                    <>
                      <Radio className="w-10 h-10 text-white animate-pulse" />
                      <span className="text-[9px] font-bold mt-1 text-indigo-200">مستشعر NFC</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
              nfcScanStatus === 'matched'
                ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                : nfcScanStatus === 'mismatched'
                ? 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
                : 'bg-slate-950/70 border border-slate-800 text-slate-300'
            }`}>
              {nfcFeedbackMessage}
            </div>

            {/* Hardware NFC Instructions */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-400 space-y-1 text-right">
              <div className="flex justify-between">
                <span>معرف شريحة الطالب المطلوبة:</span>
                <span className="font-mono text-indigo-300 font-bold">{targetStudentForNfc.nfcCardId}</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                إذا كنت تستخدم هاتف أندرويد يدعم NFC: قرّب بطاقتك البلاستيكية الذكية مباشرة من ظهر الهاتف.
              </p>
            </div>

            {/* INTERACTIVE NFC TOUCH SENSOR - USER MUST ACTUALLY PLACE/TOUCH THE CARD */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <p className="text-[10px] font-semibold text-slate-400">
                منطقة تلامس البطاقة (ضع بطاقتك الجامعية هنا للمطابقة):
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Touch matching card */}
                <button
                  type="button"
                  onClick={() => handleCardScanned(targetStudentForNfc.nfcCardId, targetStudentForNfc)}
                  disabled={nfcScanStatus === 'reading'}
                  className="p-3 rounded-2xl bg-indigo-950/80 hover:bg-emerald-900/60 border border-indigo-500/40 hover:border-emerald-500 text-slate-200 hover:text-white transition-all shadow-md flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
                >
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-[11px]">ملامسة بطاقة الطالب</span>
                  <span className="text-[9px] font-mono text-slate-400">{targetStudentForNfc.nfcCardId}</span>
                </button>

                {/* Touch wrong / classmate's card */}
                <button
                  type="button"
                  onClick={() => handleCardScanned('NFC-MQ-OTHER-CARD-888', targetStudentForNfc)}
                  disabled={nfcScanStatus === 'reading'}
                  className="p-3 rounded-2xl bg-slate-950 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-300 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
                >
                  <HandMetal className="w-5 h-5 text-rose-400" />
                  <span className="font-bold text-[11px]">ملامسة بطاقة غير متطابقة</span>
                  <span className="text-[9px] font-mono text-slate-500">بطاقة زميل آخر</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Manual Attendance Confirmation Modal */}
      {manualConfirmStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-white text-base">تسجيل حضور يدوي (إداري)</h3>
              <p className="text-xs text-slate-400 mt-1">
                هل أنت متأكد من تسجيل حضور الطالب <strong>{manualConfirmStudent.name}</strong> يدوياً بدون فحص شريحة الـ NFC؟
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <button
                type="button"
                onClick={handleManualAttendanceConfirm}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md cursor-pointer"
              >
                تأكيد التسجيل اليدوي
              </button>

              <button
                type="button"
                onClick={() => setManualConfirmStudent(null)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
