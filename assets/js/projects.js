/* =========================================================
   سابقة الأعمال — لإضافة مشروع جديد: أضف عنصرًا في المصفوفة
   cat: industrial | commercial | public | residential | mosques | finishing
   imgs: أسماء الصور داخل assets/img/projects (أول صورة هي الغلاف)
   ========================================================= */
const PROJECTS = [
  { title: "مشروع منازل الماسة للشقق المخدومة", place: "محافظة عنيزة", cat: "residential", label: "تشطيبات سكنية", imgs: ["almasa"] },
  { title: "مشروع القصيبي GTC", place: "مستودعات ومباني إدارية", cat: "industrial", label: "صناعي ولوجستي", imgs: ["qusaibi-1", "qusaibi-5", "qusaibi-2", "qusaibi-3", "qusaibi-4"], size: "wide" },
  { title: "مشروع ايكيا", place: "المدينة المنورة", cat: "commercial", label: "تجاري", imgs: ["ikea"] },
  { title: "إنشاء قصر خاص", place: "محافظة البكيرية", cat: "residential", label: "قصور", imgs: ["palace-bukayriyah"], size: "tall" },
  { title: "مشروع سدافكو", place: "المملكة العربية السعودية", cat: "industrial", label: "صناعي", imgs: ["sadafco-1", "sadafco-2"] },
  { title: "أعمال تشطيبات جامع الرحمة", place: "محافظة عنيزة", cat: "mosques", label: "مساجد", imgs: ["rahma-1", "rahma-2"] },
  { title: "فلل سكنية خاصة تسليم مفتاح", place: "محافظة عنيزة", cat: "residential", label: "سكني", imgs: ["villas-1", "villas-2"] },
  { title: "مشروع كلية العلوم والدراسات الإنسانية", place: "مدينة الأفلاج", cat: "public", label: "تعليمي", imgs: ["aflaj-1", "aflaj-2", "aflaj-3", "aflaj-4"] },
  { title: "أعمال ديكورات جبسية", place: "مشاريع متعددة", cat: "finishing", label: "ديكورات", imgs: ["gypsum-1", "gypsum-2", "gypsum-3", "gypsum-4", "gypsum-5"], size: "wide" },
  { title: "مشروع موطن", place: "مستودعات لوجستية", cat: "industrial", label: "لوجستي", imgs: ["mawten-1", "mawten-2"] },
  { title: "أعمال تشطيب أسواق التميمي", place: "المدينة المنورة ومحافظة عنيزة", cat: "commercial", label: "تجاري", imgs: ["tamimi"] },
  { title: "إنشاء قصر أفراح السحيباني", place: "محافظة البدائع", cat: "residential", label: "قصور أفراح", imgs: ["suhaibani-1", "suhaibani-2"] },

  { title: "المعهد الوطني للتدريب الصناعي", place: "مدينة وعد الشمال", cat: "public", label: "تعليمي", imgs: ["institute"] },
  { title: "مشروع الدواء", place: "سدير", cat: "industrial", label: "صناعي", imgs: ["dawaa-1", "dawaa-2", "dawaa-3", "dawaa-4"] },
  { title: "محطات سفن بلس", place: "حائل وطريق المدينة المنورة - القصيم السريع", cat: "commercial", label: "تجاري", imgs: ["safen-2", "safen-1"] },
  { title: "إعادة تأهيل مسجد", place: "بريدة", cat: "mosques", label: "مساجد", imgs: ["mosque-buraydah-1", "mosque-buraydah-2"], size: "tall" },
  { title: "مشاريع جمعية عنيزة للخدمات الإنسانية", place: "محافظة عنيزة", cat: "public", label: "خدمي", imgs: ["charity-1", "charity-2"] },
  { title: "أعمال تشطيبات فندق عنيزة", place: "محافظة عنيزة", cat: "finishing", label: "تشطيبات", imgs: ["hotel-unaizah"] },
  { title: "مشروع الفروج الذهبي", place: "منشآت صناعية", cat: "industrial", label: "صناعي", imgs: ["golden-2", "golden-1"] },
  { title: "إعادة تأهيل مسجد", place: "محافظة عنيزة", cat: "mosques", label: "مساجد", imgs: ["mosque-unaizah"] },
  { title: "تشطيبات جمعية هاد للدعوة والإرشاد", place: "محافظة عنيزة", cat: "public", label: "خدمي", imgs: ["hadi"] },
  { title: "مشروع نمارق", place: "مدينة ينبع الصناعية", cat: "industrial", label: "صناعي", imgs: ["namariq-1", "namariq-2", "namariq-3"] },
  { title: "إعادة تأهيل مجمع تخصصات الطبي", place: "عنيزة", cat: "public", label: "طبي", imgs: ["medical"] },
  { title: "إنشاء مساجد", place: "مشاريع متعددة", cat: "mosques", label: "مساجد", imgs: ["mosques-1", "mosques-2", "mosques-3", "mosques-4"] },
  { title: "أبواب حديد وخشب ونوافذ", place: "تفصيل وتركيب", cat: "finishing", label: "أبواب ونوافذ", imgs: ["doors-1", "doors-4", "doors-2", "doors-3", "windows-1", "windows-2"], size: "tall" },
  { title: "خزانات مياه ومحطة ضخ", place: "مدينة الأحساء", cat: "public", label: "بنية تحتية", imgs: ["ahsa"] },
  { title: "الهناجر والمنشآت الحديدية", place: "مزيد الخليج للصناعة", cat: "industrial", label: "هياكل حديدية", imgs: ["steel-2", "steel-1"] },
  { title: "ديكورات داخلية وتصاميم", place: "مشاريع سكنية", cat: "finishing", label: "تصميم داخلي", imgs: ["interior-2", "interior-1", "collage-2", "collage-3", "collage-1"] },
  { title: "إنشاء مسجد النخيل وسكن الإمام والمؤذن", place: "عنيزة", cat: "mosques", label: "مساجد", imgs: ["flyer-nakheel"] },
  { title: "إنشاء مسجد الراحة وسكن الإمام والمؤذن", place: "عنيزة", cat: "mosques", label: "مساجد", imgs: ["flyer-raha"] },
  { title: "إنشاء مصنع رؤوس للزجاج", place: "منطقة القصيم", cat: "industrial", label: "صناعي", imgs: ["flyer-glass"] },
  { title: "إنارة المخططات والشوارع والصيانة", place: "مشاريع بلدية", cat: "public", label: "بنية تحتية", imgs: ["flyer-lighting"] },
];
