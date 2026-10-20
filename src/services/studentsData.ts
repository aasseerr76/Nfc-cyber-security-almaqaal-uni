export interface AlmaaqalStudent {
  id: string;
  name: string;
  academicId: string; // الرقم المعرفي الرسمي
  email: string; // البريد الأكاديمي: [الرقم المعرفي]@almaaqal.edu.iq
  password: string; // كلمة المرور الخاصة بالطالب
  stage: 'المرحلة الثانية' | 'المرحلة الثالثة';
  shift: 'صباحي' | 'مسائي';
  department: string;
  nfcCardId: string; // كود شريحة NFC
  avatar?: string;
}

interface RawAlmaaqalStudent {
  id: string;
  name: string;
  academicId: string;
  stage: 'المرحلة الثانية' | 'المرحلة الثالثة';
  shift: 'صباحي' | 'مسائي';
  department: string;
  nfcCardId: string;
  avatar?: string;
}

// قائمة طلاب جامعة المعقل - مستخرجة من السجلات الرسمية
const rawStudentsList: RawAlmaaqalStudent[] = [
  // --- المرحلة الثانية - صباحي ---
  { id: 'mq_1989616052', name: 'ابرار منخي لفته كزار', academicId: '1989616052', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1989616052' },
  { id: 'mq_8153029478', name: 'ابراهيم محمد علي جاسم', academicId: '8153029478', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-8153029478' },
  { id: 'mq_7995964454', name: 'احمد اياد كاظم نعيمه', academicId: '7995964454', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-7995964454' },
  { id: 'mq_5756286074', name: 'احمد رحيم لعيبي موسى', academicId: '5756286074', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-5756286074' },
  { id: 'mq_3793707673', name: 'احمد زكي يحيى علي', academicId: '3793707673', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-3793707673' },
  { id: 'mq_4598875077', name: 'احمد مجيد ثاجب محسن', academicId: '4598875077', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-4598875077' },
  { id: 'mq_4999170370', name: 'احمد وسام عباس حيدر', academicId: '4999170370', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-4999170370' },
  { id: 'mq_9729339768', name: 'افراق حسين صبيح علوان', academicId: '9729339768', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-9729339768' },
  { id: 'mq_7922674553', name: 'الاميرمحمد ايوب حسب علي', academicId: '7922674553', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-7922674553' },
  { id: 'mq_4145888063', name: 'الحسن محمد هاشم جابر', academicId: '4145888063', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-4145888063' },
  { id: 'mq_4786255318', name: 'ايمن عماد محسن محمد', academicId: '4786255318', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-4786255318' },
  { id: 'mq_9533642157', name: 'ايناس احمد مجيدي حشيش', academicId: '9533642157', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-9533642157' },
  { id: 'mq_4293381578', name: 'باقر فاخر عبود جلهوم', academicId: '4293381578', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-4293381578' },
  { id: 'mq_4204697196', name: 'بدر خالد بدر خالد', academicId: '4204697196', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-4204697196' },
  { id: 'mq_3851498902', name: 'بنين جاسم كاظم جبر', academicId: '3851498902', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-3851498902' },
  { id: 'mq_4623242519', name: 'تبارك عقيل حسن حمود', academicId: '4623242519', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-4623242519' },
  { id: 'mq_6642782503', name: 'تكتم هشام لفته عبدالزهره', academicId: '6642782503', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-6642782503' },
  { id: 'mq_5125940213', name: 'جعفر شفيق ساجت مجيدي', academicId: '5125940213', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-5125940213' },
  { id: 'mq_9509706892', name: 'جلال سعد صالح شنيار', academicId: '9509706892', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-9509706892' },
  { id: 'mq_4792191551', name: 'حازم جابر جويد جابر', academicId: '4792191551', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-4792191551' },
  { id: 'mq_1611395919', name: 'حسن ايفان خليل ابراهيم', academicId: '1611395919', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1611395919' },
  { id: 'mq_9708375494', name: 'حسن جمعه نجم عبيد', academicId: '9708375494', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-9708375494' },
  { id: 'mq_4278512310', name: 'حسن عباس جبار حسن', academicId: '4278512310', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-4278512310' },
  { id: 'mq_3406878118', name: 'حسن فالح حسن عودة', academicId: '3406878118', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-3406878118' },
  { id: 'mq_9991861032', name: 'حسنين علي خلف شجاي', academicId: '9991861032', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-9991861032' },
  { id: 'mq_1117025207', name: 'حسين احمد عبد الزهره حسين', academicId: '1117025207', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1117025207' },
  { id: 'mq_5762515292', name: 'حسين جابر ظاهر جاسم', academicId: '5762515292', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-5762515292' },
  { id: 'mq_1301885802', name: 'حسين جاسم محمد حسين', academicId: '1301885802', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-1301885802' },
  { id: 'mq_7452968747', name: 'حسين جميل دبيش فهد', academicId: '7452968747', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-7452968747' },
  { id: 'mq_8883256155', name: 'حسين حيدر ناصح اسماعيل', academicId: '8883256155', stage: 'المرحلة الثانية', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-8883256155' },

  // --- المرحلة الثانية - مسائي ---
  { id: 'mq_1825312889', name: 'آية عمار محمد عليوي', academicId: '1825312889', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1825312889' },
  { id: 'mq_9637531940', name: 'أبا تراب فرج منصور علي', academicId: '9637531940', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-9637531940' },
  { id: 'mq_1039113008', name: 'ابراهيم احمد فؤاد عبد القادر', academicId: '1039113008', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-1039113008' },
  { id: 'mq_3996545950', name: 'احمد ظافر عبدعلي جميل', academicId: '3996545950', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-3996545950' },
  { id: 'mq_1430163975', name: 'احمد علاء حسين علي', academicId: '1430163975', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-1430163975' },
  { id: 'mq_2417602555', name: 'احمد هادي كاظم عبدالكريم', academicId: '2417602555', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-2417602555' },
  { id: 'mq_5660604746', name: 'امير حيدر عبدالامير هادي', academicId: '5660604746', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-5660604746' },
  { id: 'mq_8921210186', name: 'ايلاف احمد عطار جاسم', academicId: '8921210186', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-8921210186' },
  { id: 'mq_6097615145', name: 'بهاء الامير هاشم حمزه جدوع', academicId: '6097615145', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-6097615145' },
  { id: 'mq_9798918184', name: 'جعفر محمد عبدالرضا مهاوي', academicId: '9798918184', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-9798918184' },
  { id: 'mq_3370981800', name: 'حسن صباح حاتم عباس', academicId: '3370981800', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-3370981800' },
  { id: 'mq_3942262226', name: 'حسن عامر خلف ثامر', academicId: '3942262226', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-3942262226' },
  { id: 'mq_6733739715', name: 'حسن فرحان نجم عبدالله', academicId: '6733739715', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-6733739715' },
  { id: 'mq_9846699052', name: 'حسن قاهر قيس عبد السادة', academicId: '9846699052', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-9846699052' },
  { id: 'mq_4868247555', name: 'حسين ستار محسن غياض', academicId: '4868247555', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-4868247555' },
  { id: 'mq_2765934843', name: 'حسين صلاح الدين عبد الحسين عساف', academicId: '2765934843', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-2765934843' },
  { id: 'mq_1618845282', name: 'حسين عباس عوده عبد الله', academicId: '1618845282', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1618845282' },
  { id: 'mq_6041483064', name: 'حسين علاء جاسم محمد', academicId: '6041483064', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-6041483064' },
  { id: 'mq_1374575132', name: 'حسين مارد فؤاد يونس', academicId: '1374575132', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1374575132' },
  { id: 'mq_5148381127', name: 'حسين محمد رياض سعد', academicId: '5148381127', stage: 'المرحلة الثانية', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-5148381127' },

  // --- المرحلة الثالثة - صباحي ---
  { id: 'mq_7475267419', name: 'آلاء مهند محمد عبد الكريم', academicId: '7475267419', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-7475267419' },
  { id: 'mq_5527363625', name: 'أحمد علي زكي محمد', academicId: '5527363625', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-5527363625' },
  { id: 'mq_2113107615', name: 'أنس عبد الحسين مولى عبد الرضا', academicId: '2113107615', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-2113107615' },
  { id: 'mq_1237359029', name: 'ابا الحسن علي خضير سلمان', academicId: '1237359029', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-1237359029' },
  { id: 'mq_3022531124', name: 'ابا الفضل مدحت باهض خضير', academicId: '3022531124', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-3022531124' },
  { id: 'mq_1439062890', name: 'ابرار خالد جليل رسن', academicId: '1439062890', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1439062890' },
  { id: 'mq_4269655768', name: 'ابراهيم جاسب جرمل غانم', academicId: '4269655768', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-4269655768' },
  { id: 'mq_5823826062', name: 'ابراهيم محمد عبد الوهاب حسن', academicId: '5823826062', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-5823826062' },
  { id: 'mq_1971009816', name: 'احمد اسامه جواد كاظم', academicId: '1971009816', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1971009816' },
  { id: 'mq_3941324211', name: 'احمد حيدر مهدي يونس', academicId: '3941324211', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-3941324211' },
  { id: 'mq_9001081976', name: 'احمد علي سالم عبد الله', academicId: '9001081976', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-9001081976' },
  { id: 'mq_2215794448', name: 'احمد فائز طه عبد الله', academicId: '2215794448', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-2215794448' },
  { id: 'mq_7248528420', name: 'احمد فائز كاظم فارس', academicId: '7248528420', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-7248528420' },
  { id: 'mq_1339797747', name: 'احمد كمال جبار جوده', academicId: '1339797747', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-1339797747' },
  { id: 'mq_3054870530', name: 'احمد مؤيد إبراهيم حبيب', academicId: '3054870530', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-3054870530' },
  { id: 'mq_7612847267', name: 'احمد مسلم محمد مسلم', academicId: '7612847267', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-7612847267' },
  { id: 'mq_6285950177', name: 'احمد وائل حسن فرحان', academicId: '6285950177', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-6285950177' },
  { id: 'mq_8832590467', name: 'ازهر منير عبد الله جابر', academicId: '8832590467', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-8832590467' },
  { id: 'mq_7230845224', name: 'اسكندر سعد فزاع عبد علي', academicId: '7230845224', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-7230845224' },
  { id: 'mq_2935121040', name: 'اسماعيل اكرم ميه رودين', academicId: '2935121040', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-2935121040' },
  { id: 'mq_6914999608', name: 'اكرم لطيف حميد لطيف', academicId: '6914999608', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-6914999608' },
  { id: 'mq_5110986954', name: 'الأمير علي علي عبد الكاظم علي', academicId: '5110986954', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-5110986954' },
  { id: 'mq_3734519809', name: 'البتول محمود حسين راضي', academicId: '3734519809', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-3734519809' },
  { id: 'mq_1763340088', name: 'الحسين عادل عبد الحسن كاظم', academicId: '1763340088', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1763340088' },
  { id: 'mq_6318989337', name: 'الرباب رائد قاسم محمد', academicId: '6318989337', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-6318989337' },
  { id: 'mq_9523698230', name: 'القاسم مهند عبد الواحد قاسم', academicId: '9523698230', stage: 'المرحلة الثالثة', shift: 'صباحي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-9523698230' },

  // --- المرحلة الثالثة - مسائي ---
  { id: 'mq_7341447434', name: 'امين ماجد خلف محمد علي', academicId: '7341447434', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-7341447434' },
  { id: 'mq_7484680023', name: 'ايمن عبد الكريم عبد الصاحب حسين', academicId: '7484680023', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-7484680023' },
  { id: 'mq_9486154447', name: 'بسام علي عبد الزهرة مكلف', academicId: '9486154447', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-9486154447' },
  { id: 'mq_2372273805', name: 'حسن غانم داغر جبر', academicId: '2372273805', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-2372273805' },
  { id: 'mq_9833924584', name: 'حسن نوري فاخر سعد', academicId: '9833924584', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-9833924584' },
  { id: 'mq_1986457703', name: 'حسين عبد الكريم عوده زايد', academicId: '1986457703', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1986457703' },
  { id: 'mq_1683873480', name: 'حسين علي دحام عبد الرضا', academicId: '1683873480', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-1683873480' },
  { id: 'mq_6061723038', name: 'حسين ناظم جاسم مجيد', academicId: '6061723038', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-6061723038' },
  { id: 'mq_4770224582', name: 'حيدر رشيد ماجد داود', academicId: '4770224582', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-4770224582' },
  { id: 'mq_4093707508', name: 'حيدر محمد جاسم شناوه', academicId: '4093707508', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-4093707508' },
  { id: 'mq_7243225963', name: 'حيدر محمد حسن عبد الوهاب علي', academicId: '7243225963', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-7243225963' },
  { id: 'mq_4914818528', name: 'حيدر هاشم محمد خضير', academicId: '4914818528', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-4914818528' },
  { id: 'mq_3391441414', name: 'خلدون كاظم عبد حسين', academicId: '3391441414', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-3391441414' },
  { id: 'mq_5397002435', name: 'رافد جميل سلمان عبد الحسن', academicId: '5397002435', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-5397002435' },
  { id: 'mq_5996440298', name: 'رضا عبد الرسول حسن سلمان', academicId: '5996440298', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الأمن السيبراني', nfcCardId: 'NFC-MQ-5996440298' },
  { id: 'mq_6869676093', name: 'روح الله نجم بادي منشد', academicId: '6869676093', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-6869676093' },
  { id: 'mq_2529745412', name: 'ريهام عبدالكاظم كريدي عنيتك', academicId: '2529745412', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة السيطرة والحاسبات', nfcCardId: 'NFC-MQ-2529745412' },
  { id: 'mq_4703799761', name: 'زهراء عبد الرزاق عبد الحكيم موسى', academicId: '4703799761', stage: 'المرحلة الثالثة', shift: 'مسائي', department: 'هندسة الذكاء الاصطناعي', nfcCardId: 'NFC-MQ-4703799761' },
];

// تصدير قائمة الطلاب المعتمدة مع ربط الرقم المعرفي كبريد إلكتروني وكلمة مرور أكاديمية
export const almaaqalStudents: AlmaaqalStudent[] = rawStudentsList.map(stu => ({
  ...stu,
  email: `${stu.academicId}@almaaqal.edu.iq`,
  password: `Mq@${stu.academicId}`,
}));
