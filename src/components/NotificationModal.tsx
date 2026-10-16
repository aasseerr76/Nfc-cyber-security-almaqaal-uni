import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Trash2, X, CheckCircle2, Clock, AlertCircle, ShieldAlert } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useApp();

  if (!isOpen) return null;

  const requestNativeNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('تم تفعيل الإشعارات الفورية! 🔔', {
          body: 'ستصلك تنبيهات الحضور والغياب بشكل فوري على هاتفك.',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">مركز الإشعارات الفورية</h3>
              <p className="text-xs text-slate-400">تنبيهات الحضور المباشرة والجداول الأكاديمية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            لديك <strong className="text-indigo-400 font-semibold">{unreadNotificationsCount}</strong> إشعار غير مقروء
          </span>
          <div className="flex items-center gap-3">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <CheckCheck className="w-4 h-4" />
                تحديد الكل كمقروء
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                مسح الكل
              </button>
            )}
          </div>
        </div>

        {/* Browser native push permission banner */}
        {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
          <div className="mx-5 my-3 p-3 bg-indigo-950/50 border border-indigo-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-200">
              <ShieldAlert className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>فعل إشعارات النظام لتلقي تأكيد الحضور الفوري في خلفية الهاتف</span>
            </div>
            <button
              onClick={requestNativeNotification}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] whitespace-nowrap shadow-sm"
            >
              تفعيل الآن
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500">
                <Bell className="w-7 h-7" />
              </div>
              <h4 className="text-slate-300 font-semibold mb-1">لا توجد إشعارات حالياً</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                عند تسجيل حضورك ببطاقة NFC أو جدولة أي محاضرة جديدة ستظهر تنبيهاتك الفورية هنا.
              </p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  notif.read
                    ? 'bg-slate-900/40 border-slate-800/60 text-slate-300'
                    : 'bg-indigo-950/30 border-indigo-500/30 text-white shadow-sm'
                }`}
              >
                {!notif.read && (
                  <span className="absolute top-3.5 left-3.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
                )}
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                    notif.type === 'attendance_success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : notif.type === 'attendance_warning'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {notif.type === 'attendance_success' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : notif.type === 'attendance_warning' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h4 className="text-xs font-bold truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                    {notif.metadata?.nfcTag && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] font-mono text-indigo-300 border border-slate-700">
                        <span>NFC:</span>
                        <span>{notif.metadata.nfcTag}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/80 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
