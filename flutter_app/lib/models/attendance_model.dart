class AttendanceRecordModel {
  final String id;
  final String studentId;
  final String studentName;
  final String studentAcademicId;
  final String subjectId;
  final String subjectName;
  final String date;
  final String time;
  final String status; // 'present' | 'absent' | 'late'
  final String method; // 'nfc' | 'manual'
  final String nfcTagId;

  AttendanceRecordModel({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.studentAcademicId,
    required this.subjectId,
    required this.subjectName,
    required this.date,
    required this.time,
    this.status = 'present',
    this.method = 'nfc',
    required this.nfcTagId,
  });

  factory AttendanceRecordModel.fromJson(Map<String, dynamic> json) {
    return AttendanceRecordModel(
      id: json['id'] ?? '',
      studentId: json['studentId'] ?? '',
      studentName: json['studentName'] ?? '',
      studentAcademicId: json['studentAcademicId'] ?? '',
      subjectId: json['subjectId'] ?? '',
      subjectName: json['subjectName'] ?? '',
      date: json['date'] ?? '',
      time: json['time'] ?? '',
      status: json['status'] ?? 'present',
      method: json['method'] ?? 'nfc',
      nfcTagId: json['nfcTagId'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'studentId': studentId,
      'studentName': studentName,
      'studentAcademicId': studentAcademicId,
      'subjectId': subjectId,
      'subjectName': subjectName,
      'date': date,
      'time': time,
      'status': status,
      'method': method,
      'nfcTagId': nfcTagId,
    };
  }
}

class SubjectModel {
  final String id;
  final String name;
  final String code;
  final String teacherName;
  final int totalLectures;
  final int attendedLectures;

  SubjectModel({
    required this.id,
    required this.name,
    required this.code,
    required this.teacherName,
    this.totalLectures = 14,
    this.attendedLectures = 0,
  });

  int get attendancePercentage =>
      totalLectures == 0 ? 0 : ((attendedLectures / totalLectures) * 100).round();
}
