export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  academicId: string;
  nfcCardId: string;
  department: string;
  college: string;
  university: string;
  phone: string;
  // Student specific
  stage?: string;
  section?: string;
  gpa?: number;
  totalCredits?: number;
  // Teacher specific
  title?: string;
  officeNumber?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentAcademicId: string;
  subjectId: string;
  subjectName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AttendanceStatus;
  method: 'nfc' | 'manual' | 'qr';
  lectureTopic?: string;
  room: string;
  verifiedByTeacherId?: string;
  notes?: string;
}

export interface ScheduleItem {
  id: string;
  day: 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  dayIndex: number; // 0 to 4
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  teacherId: string;
  startTime: string; // '08:30'
  endTime: string;   // '10:00'
  room: string;
  type: 'محاضرة نظرية' | 'مختبر عملي' | 'حلقة نقاشية';
  stage: string;
  section: string;
  color: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  credits: number;
  teacherName: string;
  department: string;
  semester: string;
  attendancePercentage: number;
  totalLectures: number;
  attendedLectures: number;
  absentLectures: number;
  lateLectures: number;
  progressPercent: number;
  color: string;
  iconName: string;
  // Grade details
  grades?: {
    midterm: number;
    practical: number;
    assignments: number;
    finalExam?: number;
    total: number;
    maxScore: number;
    gradeLetter: string;
    status: 'ناجح' | 'مستمر' | 'تحت المراجعة';
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'attendance_success' | 'attendance_warning' | 'schedule_alert' | 'grade_posted';
  metadata?: {
    subjectName?: string;
    room?: string;
    status?: AttendanceStatus;
    nfcTag?: string;
  };
}
