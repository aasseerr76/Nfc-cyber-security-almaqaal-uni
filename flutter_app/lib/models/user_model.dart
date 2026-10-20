enum UserRole { student, teacher }

class UserModel {
  final String id;
  final String name;
  final String academicId;
  final UserRole role;
  final String email;
  final String nfcCardId;
  final String department;
  final String stage;
  final String shift;
  final String university;
  final String college;

  UserModel({
    required this.id,
    required this.name,
    required this.academicId,
    required this.role,
    required this.email,
    required this.nfcCardId,
    required this.department,
    required this.stage,
    required this.shift,
    this.university = 'جامعة المعقل الأهلية',
    this.college = 'كلية الهندسة والتكنولوجيا',
  });

  bool get isStudent => role == UserRole.student;
  bool get isTeacher => role == UserRole.teacher;

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      academicId: json['academicId'] ?? '',
      role: json['role'] == 'teacher' ? UserRole.teacher : UserRole.student,
      email: json['email'] ?? '',
      nfcCardId: json['nfcCardId'] ?? '',
      department: json['department'] ?? '',
      stage: json['stage'] ?? '',
      shift: json['shift'] ?? '',
      university: json['university'] ?? 'جامعة المعقل الأهلية',
      college: json['college'] ?? 'كلية الهندسة والتكنولوجيا',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'academicId': academicId,
      'role': role == UserRole.teacher ? 'teacher' : 'student',
      'email': email,
      'nfcCardId': nfcCardId,
      'department': department,
      'stage': stage,
      'shift': shift,
      'university': university,
      'college': college,
    };
  }
}
