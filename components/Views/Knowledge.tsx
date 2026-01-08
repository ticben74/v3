
import React, { useState } from 'react';

const Knowledge: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState(1);

  const chapters = [
    { id: 1, title: "فلسفة المختبر", icon: "🧠" },
    { id: 2, title: "مصفوفة التشخيص الفريدة", icon: "📊" },
    { id: 3, title: "منهجية العمل", icon: "🚀" },
  ];

  const renderChapter = () => {
    switch (activeChapter) {
      case 1:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-purple-900 text-white p-10 rounded-3xl relative overflow-hidden">
               <div className="relative z-10 max-w-2xl">
                 <h3 className="text-2xl font-bold mb-4">الثقافة كرافعة للتنمية</h3>
                 <p className="text-purple-200 leading-loose italic">
                   "الهجرة غير النظامية هي تمظهر لمرض وجودي عميق: أزمة معنى وانتماء. الحل ليس ببناء الأسوار، بل ببناء مختبرات للحلم."
                 </p>
               </div>
               <div className="absolute left-0 bottom-0 opacity-10 text-[10rem] select-none">🕊️</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-slate-100 rounded-2xl">
                <h4 className="font-bold text-slate-900 mb-2">هوية الهروب</h4>
                <p className="text-sm text-slate-500">اليأس، الشعور بالتهميش، انسداد أفق الحلم.</p>
              </div>
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <h4 className="font-bold text-emerald-900 mb-2">هوية الإبداع</h4>
                <p className="text-sm text-emerald-700">التجذر، استعادة الملكية المعنوية، بناء سردية الحياة.</p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold text-slate-900">مصفوفة SWOT القائمة على الموارد (Resource-Based)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-sky-50 border border-sky-200 rounded-2xl">
                <h4 className="font-bold text-sky-900 mb-3 flex items-center gap-2">🛡️ استراتيجيات التحصين (Bouclier)</h4>
                <p className="text-xs text-sky-700">كيف نحمي مواردنا من التهديدات؟ (مثال: توثيق المعارف المحلية رقمياً لحمايتها من هجرة الكفاءات).</p>
              </div>
              <div className="p-6 bg-purple-50 border border-purple-200 rounded-2xl">
                <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">⚡ استراتيجيات الاستغالل (Effet de levier)</h4>
                <p className="text-xs text-purple-700">كيف نستخدم مواردنا لاغتنام الفرص؟ (مثال: استخدام شبكة الفنانين المحليين لتنشيط فضاء ثقافي).</p>
              </div>
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">🔄 استراتيجيات التحويل (Transformer)</h4>
                <p className="text-xs text-amber-700">كيف نحول الاحتياجات إلى فرص؟ (مثال: شراكة مع جامعة لتدريب الفريق على إدارة المشاريع).</p>
              </div>
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl">
                <h4 className="font-bold text-rose-900 mb-3 flex items-center gap-2">📉 استراتيجيات التقليل (Atténuer)</h4>
                <p className="text-xs text-rose-700">كيف نقلل المخاطر عبر تفعيل الموارد؟ (مثال: الاعتماد على ميسرين محليين لتقليل الاعتماد على الخبراء الخارجيين).</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900 text-white rounded-3xl">
              <h3 className="font-bold mb-4">دورة حياة المشروع في المختبر</h3>
              <div className="space-y-4">
                {["اكتشاف الفرصة (تحليل SWOT)", "تصميم المفهوم (الحل المشترك)", "التخطيط التفصيلي (GANTT)", "التنفيذ والمتابعة (Scrum)", "الرصد والتقييم (KPIs)", "التثمين والتوسع (الاستدامة)"].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm">
                    <span className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px]">{i+1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-right" dir="rtl">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">مكتبة نكسوس المعرفية</h2>
        <p className="text-slate-500 font-medium mt-1">تطوير قدرات الميسرين بناءً على دليل 2025-2026</p>
      </header>

      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
        {chapters.map(ch => (
          <button
            key={ch.id}
            onClick={() => setActiveChapter(ch.id)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeChapter === ch.id ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>{ch.icon}</span>
            {ch.title}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {renderChapter()}
      </div>
    </div>
  );
};

export default Knowledge;
