import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  GraduationCap, 
  Briefcase, 
  Radio, 
  Lock, 
  User as UserIcon, 
  ArrowLeft
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [selectedPath, setSelectedPath] = useState<UserRole>('student');
  const [username, setUsername] = useState('1989616052'); // ابرار منخي لفته كزار
  const [password, setPassword] = useState('••••••••');

  const handlePathChange = (role: UserRole) => {
    setSelectedPath(role);
    if (role === 'student') {
      setUsername('1989616052');
    } else {
      setUsername('MQ-PROF-4012');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedPath, username.trim());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 mb-3">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <span className="text-[11px] font-bold text-indigo-400 block tracking-wider uppercase">
            جامعة المعقل | كلية الهندسة
          </span>
          <h1 className="text-xl font-black text-white mt-1">نظام الحضور والغياب الذكي NFC</h1>
          <p className="text-xs text-slate-400 mt-1">
            بوابة تسجيل الدخول بالرقم المعرفي والبطاقة الجامعية
          </p>
        </div>

        {/* Login Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
          {/* Role Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 text-center">
              اختر مسار الدخول:
            </label>
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 gap-1">
              <button
                type="button"
                onClick={() => handlePathChange('student')}
                className={`py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  selectedPath === 'student'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>مسار الطالب</span>
              </button>

              <button
                type="button"
                onClick={() => handlePathChange('teacher')}
                className={`py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  selectedPath === 'teacher'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>مسار التدريسي</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                {selectedPath === 'student' ? 'الرقم المعرفي للطالب (حسب كشف الكلية)' : 'الرقم الوظيفي للتدريسي'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder={selectedPath === 'student' ? 'مثال: 1989616052' : 'MQ-PROF-4012'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>تسجيل الدخول</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Selector from Almaaqal lists */}
          <div className="pt-3 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-500 block mb-2">
              دخول تجريبي سريع بأسماء من القوائم:
            </span>
            <div className="grid grid-cols-2 gap-2 text-right">
              <button
                type="button"
                onClick={() => {
                  setUsername('1989616052');
                  login('student', '1989616052');
                }}
                className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-[11px] font-semibold truncate border border-slate-700"
              >
                ابرار منخي (م2 صباحي)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('7475267419');
                  login('student', '7475267419');
                }}
                className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-[11px] font-semibold truncate border border-slate-700"
              >
                آلاء مهند (م3 صباحي)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('1825312889');
                  login('student', '1825312889');
                }}
                className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-[11px] font-semibold truncate border border-slate-700"
              >
                آية عمار (م2 مسائي)
              </button>
              <button
                type="button"
                onClick={() => login('teacher')}
                className="py-1.5 px-2.5 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 rounded-lg text-[11px] font-semibold truncate border border-indigo-500/30"
              >
                أ.د. حيدر التميمي (تدريسي)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
