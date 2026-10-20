import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Check,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { ScheduleItem } from '../types';

export const TimetableSection: React.FC = () => {
  const { 
    schedule, 
    activeRole, 
    currentUser,
    attendanceRecords,
    setActiveTab,
    sendInstantNotification,
    addScheduleLecture, 
    updateScheduleLecture, 
    deleteScheduleLecture, 
    subjects 
  } = useApp();

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Form State for Add / Edit
  const [subjectName, setSubjectName] = useState(subjects[0]?.name || 'تعلم الآلة 1');
  const [subjectCode, setSubjectCode] = useState('312ARIE');
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('قاعة الخوارزمي (مبنى الهندسة)');
  const [teacherName, setTeacherName] = useState('أ.د. حيدر كاظم التميمي');
  const [lectureType, setLectureType] = useState<ScheduleItem['type']>('محاضرة نظرية');
  const [stage, setStage] = useState('المرحلة الثالثة - صباحي');

  const days: Array<'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس'> = [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const handleLectureNfc = (lecture: ScheduleItem) => {
    setActiveTab('home');
    sendInstantNotification(
      'بوابة قراءة شريحة الـ NFC 📡',
      `يرجى تقريب بطاقتك الذكية من قارئ NFC لتسجيل حضور محاضرة "${lecture.subjectName}".`,
      'schedule_alert'
    );
  };

  const currentDayLectures = schedule.filter(item => item.dayIndex === selectedDayIndex);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setSubjectName(subjects[0]?.name || '');
    setSubjectCode(subjects[0]?.code || '312ARIE');
    setStartTime('08:30');
    setEndTime('10:00');
    setRoom('قاعة الخوارزمي');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setSubjectName(item.subjectName);
    setSubjectCode(item.subjectCode);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setRoom(item.room);
    setTeacherName(item.teacherName);
    setLectureType(item.type);
    setStage(item.stage);
    setIsAddModalOpen(true);
  };

  const handleSaveLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateScheduleLecture(editingItem.id, {
        subjectName,
        subjectCode,
        startTime,
        endTime,
        room,
        teacherName,
        type: lectureType,
        stage,
      });
    } else {
      addScheduleLecture({
        day: days[selectedDayIndex],
        dayIndex: selectedDayIndex,
        subjectId: subjects.find(s => s.code === subjectCode)?.id || 'sub_gen',
        subjectName,
        subjectCode,
        startTime,
        endTime,
        room,
        teacherName,
        teacherId: 'prof_haider',
        type: lectureType,
        stage,
        section: 'شعبة A',
        color: 'border-l-indigo-500 text-indigo-400 bg-indigo-500/10',
      });
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">الجدول الدراسي الأسبوعي</h2>
              {activeRole === 'teacher' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  صلاحيات التعديل متاحة
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {activeRole === 'student' ? 'مواعيد المحاضرات والقاعات الدراسية' : 'إدارة ومتابعة وتعديل جدول المحاضرات'}
            </p>
          </div>
        </div>

        {/* Teacher Add Button */}
        {activeRole === 'teacher' ? (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة محاضرة</span>
          </button>
        ) : (
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-xl border border-indigo-500/20">
            الفصل الأول
          </span>
        )}
      </div>

      {/* Days Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none">
        {days.map((dayName, idx) => {
          const isSelected = selectedDayIndex === idx;
          const count = schedule.filter(s => s.dayIndex === idx).length;
          return (
            <button
              key={dayName}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-1 min-w-[70px] py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="block">{dayName}</span>
              <span className={`text-[10px] block font-mono ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                {count} م
              </span>
            </button>
          );
        })}
      </div>

      {/* Lectures for Selected Day */}
      <div className="space-y-3">
        {currentDayLectures.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
            <CalendarDays className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-xs text-slate-400">لا توجد محاضرات في هذا اليوم</p>
            {activeRole === 'teacher' && (
              <button
                onClick={handleOpenAdd}
                className="mt-3 px-3 py-1.5 bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold"
              >
                + إضافة أول محاضرة لهذا اليوم
              </button>
            )}
          </div>
        ) : (
          currentDayLectures.map(lecture => (
            <div
              key={lecture.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 transition-colors hover:border-slate-700 space-y-2.5 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {lecture.subjectCode}
                  </span>
                  <span className="text-xs font-bold text-white">{lecture.subjectName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                    {lecture.type}
                  </span>

                  {/* Student NFC Check-in Button */}
                  {activeRole === 'student' && currentUser && (
                    <div className="mr-2 border-r border-slate-800 pr-2">
                      {attendanceRecords.some(r => (r.studentAcademicId === currentUser.academicId || r.studentId === currentUser.id) && r.subjectId === lecture.subjectId && r.date === todayStr) ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>حاضر (NFC)</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleLectureNfc(lecture)}
                          className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 bg-indigo-600/30 hover:bg-indigo-600 hover:text-white px-2 py-0.5 rounded-lg border border-indigo-500/30 transition-all cursor-pointer shadow-sm"
                        >
                          <Radio className="w-3 h-3 text-amber-400" />
                          <span>تسجيل الحضور بـ NFC</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Teacher Edit & Delete Buttons */}
                  {activeRole === 'teacher' && (
                    <div className="flex items-center gap-1 mr-2 border-r border-slate-800 pr-2">
                      <button
                        onClick={() => handleOpenEdit(lecture)}
                        className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                        title="تعديل المحاضرة والقاعة"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteScheduleLecture(lecture.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                        title="حذف المحاضرة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1.5 font-mono text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>{lecture.startTime} - {lecture.endTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>{lecture.room}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                <UserIcon className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span>{lecture.teacherName}</span>
                <span className="mr-auto text-slate-500">{lecture.stage}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Teacher Add / Edit Modal */}
      {isAddModalOpen && activeRole === 'teacher' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingItem ? 'تعديل بيانات المحاضرة والقاعة' : `إضافة محاضرة جديدة ليوم (${days[selectedDayIndex]})`}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLecture} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">المادة الدراسية</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">رمز المقرر</label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={e => setSubjectCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">نوع المحاضرة</label>
                  <select
                    value={lectureType}
                    onChange={e => setLectureType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="محاضرة نظرية">محاضرة نظرية</option>
                    <option value="مختبر عملي">مختبر عملي</option>
                    <option value="حلقة نقاشية">حلقة نقاشية</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">توقيت البدء</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="08:30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">توقيت الانتهاء</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="10:00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">القاعة أو المختبر</label>
                <input
                  type="text"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">المرحلة والفئة</label>
                <input
                  type="text"
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/30"
                >
                  حفظ في الجدول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
