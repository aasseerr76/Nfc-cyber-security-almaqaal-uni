import { almaaqalStudents, AlmaaqalStudent } from './studentsData';

export function printStudentDirectoryPdf(studentsList: AlmaaqalStudent[] = almaaqalStudents) {
  // Sort or group by stage and shift
  const stages = [
    { title: 'المرحلة الثانية - صباحي', filter: (s: AlmaaqalStudent) => s.stage === 'المرحلة الثانية' && s.shift === 'صباحي' },
    { title: 'المرحلة الثانية - مسائي', filter: (s: AlmaaqalStudent) => s.stage === 'المرحلة الثانية' && s.shift === 'مسائي' },
    { title: 'المرحلة الثالثة - صباحي', filter: (s: AlmaaqalStudent) => s.stage === 'المرحلة الثالثة' && s.shift === 'صباحي' },
    { title: 'المرحلة الثالثة - مسائي', filter: (s: AlmaaqalStudent) => s.stage === 'المرحلة الثالثة' && s.shift === 'مسائي' },
  ];

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لطباعة أو حفظ ملف PDF');
    return;
  }

  const currentDate = new Date().toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>كشف حسابات وكلمات مرور طلبة جامعة المعقل الأهلية</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #ffffff;
          color: #0f172a;
          padding: 24px;
          line-height: 1.4;
          direction: rtl;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #1e293b;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .header-col-right {
          text-align: right;
        }

        .header-col-center {
          text-align: center;
        }

        .header-col-left {
          text-align: left;
        }

        h1 {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        h2 {
          font-size: 15px;
          font-weight: 700;
          color: #334155;
        }

        .meta-tag {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }

        .stats-bar {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 16px;
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .stats-item span {
          color: #2563eb;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
        }

        .stage-section {
          margin-bottom: 24px;
          page-break-inside: avoid;
        }

        .stage-title {
          font-size: 13px;
          font-weight: 800;
          background: #0f172a;
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 6px 6px 0 0;
          display: inline-block;
          margin-bottom: 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          margin-bottom: 14px;
          border: 1px solid #cbd5e1;
        }

        th {
          background-color: #f8fafc;
          color: #1e293b;
          font-weight: 700;
          text-align: right;
          padding: 6px 8px;
          border: 1px solid #cbd5e1;
        }

        td {
          padding: 5px 8px;
          border: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        tr:nth-child(even) {
          background-color: #f8fafc;
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          letter-spacing: -0.2px;
        }

        .email-cell {
          font-weight: 600;
          color: #1d4ed8;
        }

        .pass-cell {
          font-weight: 700;
          color: #047857;
          background-color: #ecfdf5;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
        }

        .footer {
          margin-top: 30px;
          padding-top: 14px;
          border-top: 1px solid #cbd5e1;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #64748b;
        }

        .signature-block {
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
          padding: 0 40px;
          text-align: center;
          font-size: 11px;
          font-weight: 700;
        }

        @media print {
          body {
            padding: 10px;
          }
          .no-print {
            display: none;
          }
          @page {
            size: A4 portrait;
            margin: 12mm 10mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-col-right">
          <h2>جمهورية العراق</h2>
          <h3>وزارة التعليم العالي والبحث العلمي</h3>
          <h2>جامعة المعقل الأهلية</h2>
          <div class="meta-tag">كلية الهندسة والتكنولوجيا</div>
        </div>
        <div class="header-col-center">
          <h1>كشف حسابات وكلمات مرور الطلبة</h1>
          <div class="meta-tag">نظام الحضور والغياب الأكاديمي الذكي (NFC)</div>
          <div class="meta-tag" style="margin-top: 4px; font-weight: bold; color: #047857;">البريد الأكاديمي = الرقم المعرفي الرسمي</div>
        </div>
        <div class="header-col-left">
          <div class="meta-tag">تاريخ الاستخراج: ${currentDate}</div>
          <div class="meta-tag">العام الدراسي: 2025 - 2026</div>
          <div class="meta-tag">شعبة التسجيل والتحول الرقمي</div>
        </div>
      </div>

      <div class="stats-bar">
        <div class="stats-item">إجمالي الطلبة المقيدين: <span>${studentsList.length} طالب وطالبة</span></div>
        <div class="stats-item">صيغة البريد الأكاديمي: <span>[الرقم المعرفي]@almaaqal.edu.iq</span></div>
        <div class="stats-item">صيغة كلمة المرور الافتراضية: <span>Mq@[الرقم المعرفي]</span></div>
        <div class="stats-item">الاعتماد: <span>كشوفات مقبولة رسمياً</span></div>
      </div>

      ${stages.map(stageGroup => {
        const groupStudents = studentsList.filter(stageGroup.filter);
        if (groupStudents.length === 0) return '';

        return `
          <div class="stage-section">
            <div class="stage-title">${stageGroup.title} (${groupStudents.length} طالب)</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 32px; text-align: center;">ت</th>
                  <th style="width: 170px;">اسم الطالب الكامل</th>
                  <th style="width: 100px;">الرقم المعرفي</th>
                  <th style="width: 190px;">البريد الإلكتروني الرسمي</th>
                  <th style="width: 120px;">كلمة المرور</th>
                  <th>القسم الأكاديمي</th>
                  <th style="width: 120px;">شريحة NFC</th>
                </tr>
              </thead>
              <tbody>
                ${groupStudents.map((stu, idx) => `
                  <tr>
                    <td style="text-align: center; font-weight: bold; color: #64748b;">${idx + 1}</td>
                    <td style="font-weight: 700; color: #0f172a;">${stu.name}</td>
                    <td class="font-mono">${stu.academicId}</td>
                    <td class="font-mono email-cell">${stu.email}</td>
                    <td><span class="font-mono pass-cell">${stu.password}</span></td>
                    <td>${stu.department}</td>
                    <td class="font-mono" style="color: #64748b; font-size: 9.5px;">${stu.nfcCardId}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }).join('')}

      <div class="signature-block">
        <div>
          <div>مقرر قسم الهندسة</div>
          <div style="margin-top: 35px;">_______________________</div>
        </div>
        <div>
          <div>مسؤول شعبة تكنولوجيا المعلومات</div>
          <div style="margin-top: 35px;">_______________________</div>
        </div>
        <div>
          <div>عميد كلية الهندسة والتكنولوجيا</div>
          <div style="margin-top: 35px;">_______________________</div>
        </div>
      </div>

      <div class="footer">
        <div>جامعة المعقل الأهلية • نظام الحضور والغياب الأكاديمي الذكي • كشف معتمد ومشفر</div>
        <div>صفحة استخراج تلقائي رسمية • الرقم المعرفي وكلمات المرور المعتمدة</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export function downloadStudentDirectoryCsv(studentsList: AlmaaqalStudent[] = almaaqalStudents) {
  const headers = ['ت', 'اسم الطالب', 'الرقم المعرفي', 'البريد الإلكتروني', 'كلمة المرور', 'المرحلة', 'الدوام', 'القسم الأكاديمي', 'كود شريحة NFC'];
  const rows = studentsList.map((s, idx) => [
    idx + 1,
    `"${s.name}"`,
    s.academicId,
    s.email,
    s.password,
    `"${s.stage}"`,
    s.shift,
    `"${s.department}"`,
    s.nfcCardId
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `كشف_حسابات_طلبة_جامعة_المعقل_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
