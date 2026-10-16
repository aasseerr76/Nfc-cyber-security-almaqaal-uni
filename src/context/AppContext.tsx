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
  login: (role: UserRole, studentAcademicId?: string) => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'subjects' | 'profile'>('home');
  const [subjects, setSubjects] = useState<SubjectItem[]>(initialSubjects);
  const [schedule] = useState<ScheduleItem[]>(weeklySchedule);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
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

  const login = (role: UserRole, studentAcademicId?: string) => {
    setActiveRole(role);
    if (role === 'student') {
      if (studentAcademicId) {
        const found = almaaqalStudents.find(s => s.academicId === studentAcademicId || s.name.includes(studentAcademicId));
        if (found) {
          setCurrentUser({
            id: found.id,
            name: found.name,
            role: 'student',
            email: `${found.academicId}@almaaqal.edu.iq`,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
            academicId: found.academicId,
            nfcCardId: found.nfcCardId,
            department: found.department,
            college: 'كلية الهندسة',
            university: 'جامعة المعقل',
            phone: '+964 770 000 0000',
            stage: `${found.stage} (${found.shift})`,
            section: 'الشعبة العامة',
            gpa: 3.84,
            totalCredits: 132,
          });
        } else {
          setCurrentUser(mockStudent);
        }
      } else {
        setCurrentUser(mockStudent);
      }
    } else {
      setCurrentUser(mockTeacher);
    }
    setActiveTab('home');

    sendInstantNotification(
      'مرحباً بك في نظام حضورك | جامعة المعقل 🎓',
      `تم تسجيل الدخول بنجاح بحساب ${role === 'student' ? 'الطالب' : 'التدريسي'}.`,
      'schedule_alert'
    );
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const switchRole = () => {
    if (activeRole === 'student') {
      login('teacher');
    } else {
      login('student');
    }
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
    const targetSubject = subjects.find(s => s.id === subjectId) || subjects[0];
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });

    // Check if already registered today for this subject
    const alreadyRegistered = attendanceRecords.some(
      r => r.studentId === studentData.id && r.subjectId === subjectId && r.date === todayStr
    );

    if (alreadyRegistered) {
      return {
        success: false,
        message: `تم تسجيل حضور الطالب ${studentData.name} بالفعل لهذه المحاضرة اليوم!`,
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
        login,
        logout,
        switchRole,
        subjects,
        schedule,
        attendanceRecords,
        registerAttendance,
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
