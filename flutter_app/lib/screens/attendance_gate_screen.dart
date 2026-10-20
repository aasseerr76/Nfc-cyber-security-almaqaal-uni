import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/attendance_provider.dart';
import '../services/nfc_service.dart';

class AttendanceGateScreen extends StatefulWidget {
  const AttendanceGateScreen({super.key});

  @override
  State<AttendanceGateScreen> createState() => _AttendanceGateScreenState();
}

class _AttendanceGateScreenState extends State<AttendanceGateScreen> {
  String selectedSubjectId = 'sub_ar_ai_312';
  bool isScanning = false;
  String? scanFeedback;
  bool isSuccess = false;

  void _startNfcAttendanceScan() async {
    final provider = context.read<AttendanceProvider>();
    final user = provider.currentUser;
    if (user == null) return;

    setState(() {
      isScanning = true;
      scanFeedback = 'قرّب بطاقتك الجامعية الذكية من خلف الهاتف...';
      isSuccess = false;
    });

    _showNfcDialog();

    // Trigger hardware NFC session
    await NfcService.instance.startNfcReading(
      onCardDetected: (cardUid) {
        final result = provider.registerAttendance(
          studentAcademicId: user.academicId,
          studentName: user.name,
          scannedNfcUid: cardUid,
          subjectId: selectedSubjectId,
        );

        if (mounted) {
          setState(() {
            isScanning = false;
            isSuccess = result['success'] == true;
            scanFeedback = result['message'];
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(result['message']),
              backgroundColor: result['success'] == true ? Colors.green.shade800 : Colors.red.shade800,
            ),
          );
        }
      },
      onError: (errMsg) {
        if (mounted) {
          setState(() {
            isScanning = false;
            isSuccess = false;
            scanFeedback = errMsg;
          });
        }
      },
    );
  }

  void _showNfcDialog() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (ctx) {
        final user = context.watch<AttendanceProvider>().currentUser;
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: const Color(0xFF0F172A),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              title: const Center(
                child: Text(
                  'بوابة قراءة شريحة الـ NFC',
                  style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isSuccess ? Colors.green.withOpacity(0.2) : Colors.indigo.withOpacity(0.2),
                      border: Border.all(
                        color: isSuccess ? Colors.greenAccent : Colors.indigoAccent,
                        width: 2,
                      ),
                    ),
                    child: Icon(
                      isSuccess ? Icons.check_circle : Icons.nfc,
                      size: 45,
                      color: isSuccess ? Colors.greenAccent : Colors.indigoAccent,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    scanFeedback ?? 'جاهز للقراءة...',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: isSuccess ? Colors.greenAccent : Colors.white70,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (user != null)
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.black26,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('بطاقتك المسجلة:', style: TextStyle(color: Colors.white54, fontSize: 11)),
                              Text(user.nfcCardId, style: const TextStyle(color: Colors.greenAccent, fontSize: 11, fontFamily: 'monospace')),
                            ],
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 16),
                  // Emulated Tap Button for test environments
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo.shade600,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      if (user != null) {
                        final prov = context.read<AttendanceProvider>();
                        final res = prov.registerAttendance(
                          studentAcademicId: user.academicId,
                          studentName: user.name,
                          scannedNfcUid: user.nfcCardId,
                          subjectId: selectedSubjectId,
                        );
                        setDialogState(() {
                          isSuccess = res['success'] == true;
                          scanFeedback = res['message'];
                        });
                        Future.delayed(const Duration(milliseconds: 1200), () {
                          if (mounted && Navigator.canPop(context)) {
                            Navigator.pop(context);
                          }
                        });
                      }
                    },
                    icon: const Icon(Icons.touch_app, size: 16),
                    label: const Text('محاكاة تقريب بطاقتي الصحيحة'),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    NfcService.instance.stopNfcReading();
                    Navigator.pop(ctx);
                  },
                  child: const Text('إغلاق', style: TextStyle(color: Colors.white60)),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AttendanceProvider>();
    final user = provider.currentUser;
    if (user == null) return const SizedBox();

    final isPresent = provider.isStudentPresent(user.academicId, selectedSubjectId);

    return Scaffold(
      backgroundColor: const Color(0xFF0B1120),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        title: const Text('بوابة الحضور بـ NFC', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, size: 20),
            onPressed: () => provider.logout(),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Student NFC Identity Card
            Card(
              color: isPresent ? const Color(0xFF064E3B) : const Color(0xFF1E1B4B),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: isPresent ? Colors.greenAccent.withOpacity(0.5) : Colors.indigoAccent.withOpacity(0.4))),
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('جامعة المعقل الأهلية', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14)),
                        Icon(Icons.nfc, color: isPresent ? Colors.greenAccent : Colors.indigoAccent),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(user.name, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                    Text('الرقم المعرفي: ${user.academicId}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('شريحة: ${user.nfcCardId}', style: const TextStyle(color: Colors.white54, fontSize: 10, fontFamily: 'monospace')),
                        if (isPresent)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(color: Colors.greenAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(10)),
                            child: const Text('حاضر اليوم ✅', style: TextStyle(color: Colors.greenAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                          )
                        else
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.indigoAccent,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            onPressed: _startNfcAttendanceScan,
                            icon: const Icon(Icons.nfc, size: 16),
                            label: const Text('تمرير بطاقتي'),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Roster Header with Strict Rules Note
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  provider.isTeacher ? 'كشف الحضور (صلاحيات الأستاذ الإدارية)' : 'كشف حضور وغياب الدفعة',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                ),
                Text(
                  provider.isTeacher ? 'إثبات / إلغاء' : 'للعرض فقط',
                  style: TextStyle(color: Colors.indigoAccent.shade100, fontSize: 11),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Sample Roster demonstrating Teacher vs Student permissions
            _buildSampleRoster(provider),
          ],
        ),
      ),
    );
  }

  Widget _buildSampleRoster(AttendanceProvider provider) {
    // Demonstration students list
    final students = [
      {'id': '1989616052', 'name': 'ابرار منخي لفته كزار'},
      {'id': '8153029478', 'name': 'ابراهيم محمد علي جاسم'},
      {'id': '7995964454', 'name': 'احمد اياد كاظم نعيمه'},
      {'id': '1825312889', 'name': 'آية عمار محمد عليوي'},
    ];

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollButtonPhysics(),
      itemCount: students.length,
      itemBuilder: (context, i) {
        final s = students[i];
        final id = s['id']!;
        final name = s['name']!;
        final isPresent = provider.isStudentPresent(id, selectedSubjectId);
        final isCurrentUser = provider.currentUser?.academicId == id;

        return Card(
          color: const Color(0xFF1E293B),
          margin: const EdgeInsets.symmetric(vertical: 4),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          child: ListTile(
            title: Text(name, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
            subtitle: Text('ID: $id', style: const TextStyle(color: Colors.white54, fontSize: 11)),
            trailing: isPresent
                ? Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('حاضر ✅', style: TextStyle(color: Colors.greenAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                      // TEACHER ONLY: Authority to remove attendance
                      if (provider.isTeacher)
                        IconButton(
                          icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                          tooltip: 'إلغاء الحضور',
                          onPressed: () {
                            final res = provider.removeAttendanceByTeacher(
                              studentAcademicId: id,
                              subjectId: selectedSubjectId,
                            );
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'])));
                          },
                        ),
                    ],
                  )
                : provider.isTeacher
                    // TEACHER ONLY: Authority to mark student present
                    ? ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green.shade700,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {
                          final res = provider.markStudentPresentByTeacher(
                            studentAcademicId: id,
                            studentName: name,
                            subjectId: selectedSubjectId,
                          );
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'])));
                        },
                        child: const Text('تسجيل حاضر', style: TextStyle(fontSize: 11)),
                      )
                    // STUDENT: Strictly disabled/hidden for peers, only allowed for self
                    : isCurrentUser
                        ? ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.indigoAccent),
                            onPressed: _startNfcAttendanceScan,
                            child: const Text('بطاقتي', style: TextStyle(fontSize: 11)),
                          )
                        : const Text('غائب', style: TextStyle(color: Colors.white38, fontSize: 11)),
          ),
        );
      },
    );
  }
}
