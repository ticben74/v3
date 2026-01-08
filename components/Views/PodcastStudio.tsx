
import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';

const PodcastStudio: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const handlePlan = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await geminiService.planPodcastEpisode(topic);
      setPlan(res || '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-right" dir="rtl">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">🎙️ استوديو البودكاست الإبداعي</h2>
        <p className="text-slate-500 font-medium mt-1">تكنولوجيا الذات: "أنا موجود، أنا أتكلم، صوتي مسموع"</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 border-r-4 border-purple-500 pr-3">مخطط الحلقة</h3>
            <textarea 
              placeholder="عن ماذا ستتحدث؟ (مثلاً: قصة نجاح شاب حرفي في الدهماني)"
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button 
              onClick={handlePlan}
              disabled={loading}
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'توليد هيكل الحلقة'}
            </button>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 space-y-3">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              ⚠️ وصايا الوثيقة للبودكاست
            </h4>
            <ul className="text-xs text-amber-800 space-y-2 leading-relaxed">
              <li>• تجنب النبرة "الأخلاقوية" أو المثيرة للقلق.</li>
              <li>• تقديم الإنسان والأبعاد الإنسانية على الرسالة.</li>
              <li>• احترام الصمت كجزء من السردية وليس كفراغ.</li>
              <li>• اعتراف بأن الصوت ملك صاحبه (أخلاقيات اللقاء).</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          {plan ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden min-h-[500px]">
              <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                <span className="font-bold">مقترح هيكلة الحلقة</span>
                <button onClick={() => setPlan(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="p-8 prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-loose text-slate-700">
                  {plan}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-4 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="text-6xl">📻</div>
              <p className="font-medium">ابدأ بتخطيط حلقتك عبر المساعد الذكي</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodcastStudio;
