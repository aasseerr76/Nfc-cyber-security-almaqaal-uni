import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Radio, 
  CreditCard, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Bell, 
  Repeat, 
  LogOut,
  Volume2,
  VolumeX
} from 'lucide-react';

export const ProfileSection: React.FC = () => {
  const {
    currentUser,
    activeRole,
    switchRole,
    logout,
    soundEnabled,
    toggleSound,
    sendInstantNotification,
  } = useApp();

  const [notifGranted, setNotifGranted] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  if (!currentUser) return null;

  const handleRequestPush = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotifGranted(true);
        sendInstantNotification(
          'تم تفعيل الإشعارات الفورية! 🔔',
          'ستصلك تنبيهات الحضور فور تمرير بطاقة NFC.',
          'attendance_success'
        );
      }
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">الملف الشخصي</h2>
            <p className="text-[11px] text-slate-400">بيانات الحساب والهوية الجامعية الذكية</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>خروج</span>
        </button>
      </div>

      {/* Digital Student / Teacher NFC Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-indigo-300 font-bold block">{currentUser.university}</span>
            <h3 className="text-xs font-black text-white">{currentUser.college}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-amber-400 rounded-md border border-amber-300 flex items-center justify-center">
              <div className="w-5 h-3 border-t border-b border-amber-950/40"></div>
            </div>
            <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400/60 shadow-md"
          />
          <div>
            <h4 className="text-base font-black text-white">{currentUser.name}</h4>
            <p className="text-xs text-indigo-300 font-mono">{currentUser.academicId}</p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {currentUser.department}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>NFC UID: {currentUser.nfcCardId}</span>
          <span className="text-emerald-400 font-sans font-bold text-[11px]">شريحة مفعلة ✅</span>
        </div>
      </div>

      {/* Details Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
        <h4 className="font-bold text-white mb-2">المعلومات الأكاديمية</h4>

        <div className="space-y-2 text-slate-300">
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">القسم:</span>
            <span className="font-semibold">{currentUser.department}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">المرحلة / الصفة:</span>
            <span className="font-semibold">{activeRole === 'student' ? currentUser.stage : currentUser.title}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">البريد الأكاديمي:</span>
            <span className="font-mono">{currentUser.email}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">الهاتف:</span>
            <span className="font-mono">{currentUser.phone}</span>
          </div>
        </div>
      </div>

      {/* Preferences & Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h4 className="font-bold text-white text-xs mb-2">الإعدادات والتنبيهات</h4>

        {/* Push Notification */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>الإشعارات الفورية عند الحضور</span>
          </div>
          <button
            onClick={handleRequestPush}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
              notifGranted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-600 text-white'
            }`}
          >
            {notifGranted ? 'مفعلة' : 'تفعيل'}
          </button>
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>صوت رنين الـ NFC</span>
          </div>
          <button
            onClick={toggleSound}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
              soundEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {soundEnabled ? 'مفعل' : 'معطل'}
          </button>
        </div>

        {/* Switch Account */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Repeat className="w-4 h-4 text-purple-400" />
            <span>تبديل المسار التجريبي</span>
          </div>
          <button
            onClick={switchRole}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold rounded-xl border border-slate-700"
          >
            {activeRole === 'student' ? 'الدخول كتدريسي' : 'الدخول كطالب'}
          </button>
        </div>
      </div>
    </div>
  );
};
