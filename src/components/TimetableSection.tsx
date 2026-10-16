import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User as UserIcon,
  BookOpen
} from 'lucide-react';

export const TimetableSection: React.FC = () => {
  const { schedule, activeRole } = useApp();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const days: Array<'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس'> = [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
  ];

  const currentDayLectures = schedule.filter(item => item.dayIndex === selectedDayIndex);

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">الجدول الدراسي الأسبوعي</h2>
            <p className="text-[11px] text-slate-400">مواعيد المحاضرات والقاعات الدراسية</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-xl border border-indigo-500/20">
          الفصل الأول
        </span>
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
          </div>
        ) : (
          currentDayLectures.map(lecture => (
            <div
              key={lecture.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 transition-colors hover:border-slate-700 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {lecture.subjectCode}
                  </span>
                  <span className="text-xs font-bold text-white">{lecture.subjectName}</span>
                </div>
                <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                  {lecture.type}
                </span>
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
    </div>
  );
};
