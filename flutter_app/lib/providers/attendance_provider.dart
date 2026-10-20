import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/user_model.dart';
import '../models/attendance_model.dart';

class AttendanceProvider extends ChangeNotifier {
  UserModel? _currentUser;
  final List<AttendanceRecordModel> _attendanceRecords = [];
  final List<SubjectModel> _subjects = [
    SubjectModel(id: 'sub_ar_ai_312', name: 'الذكاء الاصطناعي التطبيقي', code: 'ENG-AI-312', teacherName: 'أ.د. حيدر كاظم التميمي', attendedLectures: 11),
    SubjectModel(id: 'sub_cyber_sec_304', name: 'الأمن السيبراني والشبكات', code: 'ENG-CY-304', teacherName: 'د. مصطفى رائد العميدي', attendedLectures: 9),
    SubjectModel(id: 'sub_embedded_308', name: 'الأنظمة المدمجة والمتحكمات', code: 'ENG-EM-308', teacherName: 'د. صادق مهدي الموسوي', attendedLectures: 12),
  ];

  UserModel? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;
  bool get isTeacher => _currentUser?.role == UserRole.teacher;
  bool get isStudent => _currentUser?.role == UserRole.student;
  List<AttendanceRecordModel> get attendanceRecords => _attendanceRecords;
  List<SubjectModel> get subjects => _subjects;

  void setUser(UserModel user) {
    _currentUser = user;
    notifyListeners();
  }

  void logout() {
    _currentUser = null;
    notifyListeners();
  }

  /// Checks if a student is marked present for a subject today
  bool isStudentPresent(String academicId, String subjectId) {
    final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
    return _attendanceRecords.any((rec) =>
        rec.studentAcademicId == academicId &&
        rec.subjectId == subjectId &&
        rec.date == todayStr &&
        rec.status == 'present');
  }

  /// Strict NFC Attendance Registration
  /// - Student: CAN ONLY register for themselves with their matching NFC tag!
  /// - Teacher: Can register any student.
  Map<String, dynamic> registerAttendance({
    required String studentAcademicId,
    required String studentName,
    required String scannedNfcUid,
    required String subjectId,
    String method = 'nfc',
  }) {
    // 1. Strict Security: Student can ONLY register for themselves
    if (isStudent) {
      if (_currentUser!.academicId != studentAcademicId) {
        return {
          'success': false,
          'message': 'مرفوض أمنياً: لا يمكنك تسجيل الحضور لزملائك، الصلاحية مقتصرة على حسابك فقط.',
        };
      }

      // NFC Card Validation: The tapped card must match the student's authorized UID
      if (scannedNfcUid != _currentUser!.nfcCardId) {
        return {
          'success': false,
          'message': 'البطاقة المقربة غير متوافقة مع بطاقتك الجامعية المسجلة في النظام!',
        };
      }
    }

    final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final nowTimeStr = DateFormat('hh:mm a').format(DateTime.now());

    // Check if already registered today
    final alreadyPresent = _attendanceRecords.any((r) =>
        r.studentAcademicId == studentAcademicId &&
        r.subjectId == subjectId &&
        r.date == todayStr);

    if (alreadyPresent) {
      return {
        'success': true,
        'message': 'الطالب مسجل حاضر بالفعل لهذه المحاضرة اليوم.',
      };
    }

    final targetSubject = _subjects.firstWhere(
      (s) => s.id == subjectId,
      orElse: () => _subjects.first,
    );

    final record = AttendanceRecordModel(
      id: 'att_${DateTime.now().millisecondsSinceEpoch}',
      studentId: studentAcademicId,
      studentName: studentName,
      studentAcademicId: studentAcademicId,
      subjectId: targetSubject.id,
      subjectName: targetSubject.name,
      date: todayStr,
      time: nowTimeStr,
      status: 'present',
      method: method,
      nfcTagId: scannedNfcUid,
    );

    _attendanceRecords.insert(0, record);
    notifyListeners();

    return {
      'success': true,
      'message': 'تم توثيق الحضور بنجاح عبر شريحة NFC المعتمدة ✅',
      'record': record,
    };
  }

  /// TEACHER EXCLUSIVE AUTHORITY: Remove / Cancel student attendance
  Map<String, dynamic> removeAttendanceByTeacher({
    required String studentAcademicId,
    required String subjectId,
  }) {
    if (!isTeacher) {
      return {
        'success': false,
        'message': 'إلغاء الحضور من الصلاحيات الإدارية الحصرية للأستاذ فقط.',
      };
    }

    final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final index = _attendanceRecords.indexWhere((r) =>
        r.studentAcademicId == studentAcademicId &&
        r.subjectId == subjectId &&
        r.date == todayStr);

    if (index == -1) {
      return {
        'success': false,
        'message': 'لم يتم العثور على تسجيل حضور لهذا الطالب اليوم لإلغائه.',
      };
    }

    _attendanceRecords.removeAt(index);
    notifyListeners();

    return {
      'success': true,
      'message': 'تم إلغاء تسجيل الحضور للطالب وتعديل حالته إلى غائب بنجاح ❌',
    };
  }

  /// TEACHER EXCLUSIVE AUTHORITY: Mark absent student present manually
  Map<String, dynamic> markStudentPresentByTeacher({
    required String studentAcademicId,
    required String studentName,
    required String subjectId,
  }) {
    if (!isTeacher) {
      return {
        'success': false,
        'message': 'هذه العملية تتطلب صلاحيات الأستاذ.',
      };
    }

    return registerAttendance(
      studentAcademicId: studentAcademicId,
      studentName: studentName,
      scannedNfcUid: 'NFC-DOC-OVERRIDE',
      subjectId: subjectId,
      method: 'manual',
    );
  }
}
