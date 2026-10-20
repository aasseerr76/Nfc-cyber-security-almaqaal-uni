import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AttendanceRecord, NotificationItem, SubjectItem, ScheduleItem, AttendanceStatus } from '../types';
import { mockStudent, mockTeacher, initialSubjects, weeklySchedule, initialAttendanceRecords, initialNotifications, simulatedStudents } from '../services/mockData';
import { almaaqalStudents, AlmaaqalStudent } from '../services/studentsData';
import { playNfcSuccessSound, playNotificationSound } from '../services/sound';
import confetti from 'canvas-confetti';

interface ToastData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: string;
}

interface AppContextType {
  currentUser: User | null;
  activeRole: UserRole;
  activeTab: 'home' | 'schedule' | 'subjects' | 'profile';
  setActiveTab: (tab: 'home' | 'schedule' | 'subjects' | 'profile') => void;
  loginWithUser: (user: User) => void;
  logout: () => void;
  switchRole: () => void;
  
  // Attendance & Subjects
  subjects: SubjectItem[];
  schedule: ScheduleItem[];
  attendanceRecords: AttendanceRecord[];
  registerAttendance: (
    studentData: { id: string; name: string; academicId: string; nfcTag: string },
    subjectId: string,
    method?: 'nfc' | 'manual'
  ) => { success: boolean; message: string; record?: AttendanceRecord };
  
  // Teacher Admin Editing Permissions
  updateAttendanceStatus: (recordId: string, newStatus: AttendanceStatus, notes?: string) => void;
  deleteAttendanceRecord: (recordId: string) => void;
  removeAttendanceForStudent: (studentAcademicId: string, subjectId: string) => { success: boolean; message: string };
  addScheduleLecture: (lecture: Omit<ScheduleItem, 'id'>) => void;
  updateScheduleLecture: (id: string, updated: Partial<ScheduleItem>) => void;
  deleteScheduleLecture: (id: string) => void;
  updateSubjectDetails: (id: string, updated: Partial<SubjectItem>) => void;
  updateSubjectGrades: (subjectId: string, grades: NonNullable<SubjectItem['grades']>) => void;
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  sendInstantNotification: (title: string, message: string, type?: NotificationItem['type'], metadata?: NotificationItem['metadata']) => void;
  activeToast: ToastData | null;
  dismissToast: () => void;

  // Preferences & Layout
  soundEnabled: boolean;
  toggleSound: () => void;
  almaaqalStudentsList: AlmaaqalStudent[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'subjects' | 'profile'>('home');
  const [subjects, setSubjects] = useState<SubjectItem[]>(initialSubjects);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(weeklySchedule);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    if (typeof window === 'undefined') return initialAttendanceRecords;
    try {
      const saved = localStorage.getItem('almaaqal_attendance_records');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return initialAttendanceRecords;
  });

  // Sync attendance records to storage
  useEffect(() => {
    if (typeof window !== 'undefined' && attendanceRecords.length > 0) {
      try {
        localStorage.setItem('almaaqal_attendance_records', JSON.stringify(attendanceRecords));
      } catch (e) {
        console.warn('Failed saving attendance:', e);
      }
    }
  }, [attendanceRecords]);
  const [activeToast, setActiveToast] = useState<ToastData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Auto hide toast after 5 seconds
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('almaaqal_current_session');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.avatar && (u.avatar.includes('unsplash.com') || u.avatar.includes('photo-'))) {
          u.avatar = '';
          localStorage.setItem('almaaqal_current_session', JSON.stringify(u));
        }
        return u;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    if (typeof window === 'undefined') return 'student';
    try {
      const raw = localStorage.getItem('almaaqal_current_session');
      if (raw) {
        const u = JSON.parse(raw);
        return u.role || 'student';
      }
    } catch {
      // fallback
    }
    return 'student';
  });

  const loginWithUser = (user: User) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('almaaqal_current_session', JSON.stringify(user));
    }
    setActiveTab('home');

    sendInstantNotification(
      'مرحباً بك في نظام حضورك | جامعة المعقل 🎓',
      `تم تسجيل الدخول بنجاح بحساب ${user.role === 'student' ? 'الطالب' : 'التدريسي'} (${user.name}).`,
      'schedule_alert'
    );
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('almaaqal_current_session');
    }
    setActiveTab('home');
  };

  const switchRole = () => {
    logout();
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const sendInstantNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'attendance_success',
    metadata?: NotificationItem['metadata']
  ) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUser?.id || 'all',
      title,
      message,
      timestamp: 'الآن',
      read: false,
      type,
      metadata,
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Show instant visual toast
    setActiveToast({
      id: newNotif.id,
      title,
      message,
      type: type === 'attendance_warning' ? 'warning' : 'success',
      timestamp: 'الآن',
    });

    // Play chime sound
    if (soundEnabled) {
      playNotificationSound();
    }

    // Try standard Web Notification API if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }
  };

  const registerAttendance = (
    studentData: { id: string; name: string; academicId: string; nfcTag: string },
    subjectId: string,
    method: 'nfc' | 'manual' = 'nfc'
  ) => {
    // 1. Strict Security: Student can ONLY register attendance for themselves and only with their matching card
    if (activeRole === 'student') {
      if (currentUser && studentData.academicId !== currentUser.academicId) {
        return {
          success: false,
          message: 'مرفوض أمنياً: لا يمكنك تسجيل الحضور لزملائك، يحق لك تسجيل حضور بطاقتك الشخصية فقط.',
        };
      }
      if (currentUser && studentData.nfcTag && studentData.nfcTag !== currentUser.nfcCardId) {
        return {
          success: false,
          message: 'البطاقة المقربة غير متوافقة مع بطاقتك الجامعية المسجلة في النظام.',
        };
      }
    }

    const targetSubject = subjects.find(s => s.id === subjectId) || subjects[0];
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });

    // Check if already registered today for this subject
    const alreadyRegistered = attendanceRecords.find(
      r => (r.studentId === studentData.id || r.studentAcademicId === studentData.academicId) && r.subjectId === targetSubject.id && r.date === todayStr
    );

    if (alreadyRegistered) {
      if (soundEnabled) {
        playNfcSuccessSound();
      }
      sendInstantNotification(
        `تأكيد قراءة شريحة NFC بنجاح ✅`,
        `الطالب (${studentData.name}) مسجل حاضر بالفعل لمقرر "${targetSubject.name}" في تمام ${alreadyRegistered.time}.`,
        'attendance_success',
        {
          subjectName: targetSubject.name,
          room: 'قاعة الخوارزمي (302)',
          status: 'present',
          nfcTag: studentData.nfcTag,
        }
      );
      return {
        success: true,
        message: `تم التحقق من شريحة NFC! الطالب (${studentData.name}) حاضر بالفعل لهذه المحاضرة اليوم (${alreadyRegistered.time}).`,
        record: alreadyRegistered,
      };
    }

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      studentId: studentData.id,
      studentName: studentData.name,
      studentAcademicId: studentData.academicId,
      subjectId: targetSubject.id,
      subjectName: targetSubject.name,
      date: todayStr,
      time: nowTimeStr,
      status: 'present',
      method: method,
      lectureTopic: 'جلسة الحضور المباشرة عبر بطاقة NFC',
      room: 'قاعة الخوارزمي (302)',
      verifiedByTeacherId: mockTeacher.id,
    };

    // Prepend to records
    setAttendanceRecords(prev => [newRecord, ...prev]);

    // Update subject attended count
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id === targetSubject.id) {
          const newAttended = sub.attendedLectures + 1;
          const newPercentage = Math.round((newAttended / (sub.totalLectures || 1)) * 100);
          return {
            ...sub,
            attendedLectures: newAttended,
            attendancePercentage: Math.min(100, newPercentage),
          };
        }
        return sub;
      })
    );

    // Audio & Haptic celebration
    if (soundEnabled) {
      playNfcSuccessSound();
    }

    // Trigger visual confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    // Trigger Instant Notification for user!
    sendInstantNotification(
      `تم تأكيد حضورك بنجاح عبر NFC 🟢`,
      `تم توثيق حضور ${studentData.name} لمقرر "${targetSubject.name}" في ${nowTimeStr} - القاعة 302.`,
      'attendance_success',
      {
        subjectName: targetSubject.name,
        room: 'قاعة الخوارزمي (302)',
        status: 'present',
        nfcTag: studentData.nfcTag,
      }
    );

    return {
      success: true,
      message: `تم تسجيل حضور ${studentData.name} بنجاح!`,
      record: newRecord,
    };
  };

  // --- Teacher Administrative Handlers ---
  const updateAttendanceStatus = (recordId: string, newStatus: AttendanceStatus, notes?: string) => {
    setAttendanceRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          return {
            ...r,
            status: newStatus,
            notes: notes !== undefined ? notes : r.notes,
          };
        }
        return r;
      })
    );
    sendInstantNotification(
      'تم تعديل حالة الحضور ✏️',
      `قام التدريسي بتعديل حالة السجل إلى (${newStatus === 'present' ? 'حاضر' : newStatus === 'late' ? 'متأخر' : newStatus === 'absent' ? 'غائب' : 'بعذر'}).`,
      'attendance_warning'
    );
  };

  const deleteAttendanceRecord = (recordId: string) => {
    setAttendanceRecords(prev => prev.filter(r => r.id !== recordId));
    sendInstantNotification('تم حذف سجل الحضور 🗑️', 'تم إزالة السجل المحدد من قاعدة البيانات.');
  };

  const removeAttendanceForStudent = (studentAcademicId: string, subjectId: string) => {
    if (activeRole !== 'teacher') {
      return {
        success: false,
        message: 'إلغاء الحضور من الصلاحيات الإدارية الحصرية للتدريسي فقط.',
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const record = attendanceRecords.find(
      r => r.studentAcademicId === studentAcademicId && r.subjectId === subjectId && r.date === todayStr
    );

    if (!record) {
      return {
        success: false,
        message: 'لا يوجد تسجيل حضور لهذا الطالب اليوم في هذه المادة.',
      };
    }

    setAttendanceRecords(prev => prev.filter(r => r.id !== record.id));

    // Decrement attended lectures count
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id === subjectId) {
          const newAttended = Math.max(0, sub.attendedLectures - 1);
          const newPercentage = Math.round((newAttended / (sub.totalLectures || 1)) * 100);
          return {
            ...sub,
            attendedLectures: newAttended,
            attendancePercentage: Math.min(100, newPercentage),
          };
        }
        return sub;
      })
    );

    sendInstantNotification(
      'تم إلغاء تسجيل الحضور ❌',
      `قام التدريسي بإلغاء حضور الطالب (${record.studentName}) لمادة "${record.subjectName}".`,
      'attendance_warning'
    );

    return {
      success: true,
      message: `تم إلغاء حضور الطالب (${record.studentName}) وتعديل حالته إلى غائب بنجاح.`,
    };
  };

  const addScheduleLecture = (lecture: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...lecture,
      id: `sch_${Date.now()}`,
    };
    setSchedule(prev => [...prev, newItem]);
    sendInstantNotification('تمت إضافة محاضرة جديدة للجدول 📅', `المادة: ${lecture.subjectName} - يوم ${lecture.day}.`);
  };

  const updateScheduleLecture = (id: string, updated: Partial<ScheduleItem>) => {
    setSchedule(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
    sendInstantNotification('تم تحديث الجدول الدراسي ✏️', 'تم حفظ التعديلات الجديدة على مواعيد وقاعات المحاضرات.');
  };

  const deleteScheduleLecture = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
    sendInstantNotification('تم حذف محاضرة من الجدول 🗑️', 'تم تحديث جدول المحاضرات الأسبوعي.');
  };

  const updateSubjectDetails = (id: string, updated: Partial<SubjectItem>) => {
    setSubjects(prev => prev.map(sub => (sub.id === id ? { ...sub, ...updated } : sub)));
    sendInstantNotification('تم تعديل بيانات المادة الدراسية 📚', 'تم حفظ التعديلات على المقرر الدراسي.');
  };

  const updateSubjectGrades = (subjectId: string, grades: NonNullable<SubjectItem['grades']>) => {
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            grades,
          };
        }
        return sub;
      })
    );
    sendInstantNotification('تم تعديل ورصد الدرجات 📊', 'تم تحديث درجات السعي والتقييمات للطلبة.');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        activeTab,
        setActiveTab,
        loginWithUser,
        logout,
        switchRole,
        subjects,
        schedule,
        attendanceRecords,
        registerAttendance,
        updateAttendanceStatus,
        deleteAttendanceRecord,
        removeAttendanceForStudent,
        addScheduleLecture,
        updateScheduleLecture,
        deleteScheduleLecture,
        updateSubjectDetails,
        updateSubjectGrades,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        sendInstantNotification,
        activeToast,
        dismissToast,
        soundEnabled,
        toggleSound,
        almaaqalStudentsList: almaaqalStudents,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
