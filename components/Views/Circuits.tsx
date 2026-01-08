
import React, { useState } from 'react';
import { Circuit } from '../../types';
import { geminiService } from '../../services/geminiService';

const MOCK_CIRCUITS: Circuit[] = [
  { id: 'c1', title: 'نكهات ميدون المنسية', theme: 'Gastronomie', location: 'ميدون', status: 'Validated', impactScore: 4.9 },
  { id: 'c2', title: 'على خطى فخار قلالة', theme: 'Artisanat', location: 'قلالة', status: 'Testing', impactScore: 4.5 },
  { id: 'c3', title: 'جربة هود: فن وتراث', theme: 'Culture', location: 'الحارة الصغيرة', status: 'Validated', impactScore: 4.8 },
];

interface PointOfInterest {
  title: string;
  description: string;
  image: string;
  type: string;
}

const CIRCUIT_POIS: Record<string, PointOfInterest[]> = {
  'c1': [
    { title: 'معصرة الزيت القديمة', description: 'استكشاف تقنيات عصر الزيتون التقليدية تحت الأرض في جو مفعم بالأصالة.', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400', type: 'تراث' },
    { title: 'سوق التوابل المركزي', description: 'تجربة غامرة للروائح والألوان في قلب سوق ميدون التاريخي مع تذوق خلطات جربية نادرة.', image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=400', type: 'تجارة' },
    { title: 'دار المطبخ الأصيل', description: 'ورشة حية لتعلم إعداد الكسكسي الجربي والحلويات التقليدية مع نساء المنطقة.', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400', type: 'فن الطبخ' }
  ],
  'c2': [
    { title: 'متحف التراث بقلالة', description: 'أكبر مجمع ثقافي يعرض دورة حياة الجربي من خلال مجسمات شمعية دقيقة.', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=400', type: 'ثقافة' },
    { title: 'ورشة الخزف الحي', description: 'مشاهدة تحويل الطين الخام إلى قطع فنية رائعة باستخدام العجلة اليدوية التقليدية.', image: 'https://images.unsplash.com/photo-1565193998771-e6a1334046d3?auto=format&fit=crop&q=80&w=400', type: 'حرفة' },
    { title: 'غار الطين السري', description: 'زيارة المواقع التي يستخرج منها الطين الجربي الفريد بخصائصه الفيزيائية المتميزة.', image: 'https://images.unsplash.com/photo-1578341604104-511417070191?auto=format&fit=crop&q=80&w=400', type: 'طبيعة' }
  ],
  'c3': [
    { title: 'متحف الشارع المفتوح', description: 'جولة بين أكثر من 150 جدارية لفنانين عالميين حولت القرية إلى معرض فني دولي.', image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=400', type: 'فن رقمي' },
    { title: 'ساحة التسامح', description: 'نقطة التقاء تاريخية تعبر عن التعايش السلمي في جربة عبر العصور.', image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=400', type: 'تاريخ' },
    { title: 'فضاء "نكسوس" الإبداعي', description: 'مركز ابتكار يوفر نظارات واقع معزز لرؤية كواليس رسم الجداريات وقصص الفنانين.', image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=400', type: 'تكنولوجيا' }
  ]
};

const Circuits: React.FC = () => {
  const [circuits, setCircuits] = useState<Circuit[]>(MOCK_CIRCUITS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null);
  const [aiTheme, setAiTheme] = useState('ثقافة');
  const [aiLocation, setAiLocation] = useState('جربة');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Predefined criteria logic
  const determineStatusByScore = (score: number): 'Concept' | 'Testing' | 'Validated' => {
    if (score >= 4.7) return 'Validated';
    if (score >= 4.0) return 'Testing';
    return 'Concept';
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setAiResult(null);
    try {
      const res = await geminiService.generateCircuitItinerary(aiTheme, aiLocation);
      setAiResult(res || 'فشل في توليد المسار.');
    } catch (e) {
      setAiResult("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCircuit = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); 
    const confirmDelete = window.confirm("هل أنت متأكد من رغبتك في حذف هذا المسار نهائياً؟ لا يمكن التراجع عن هذا الإجراء.");
    if (confirmDelete) {
      setCircuits(prev => prev.filter(c => c.id !== id));
      if (selectedCircuit?.id === id) setSelectedCircuit(null);
    }
  };

  const handleEditClick = (circuit: Circuit, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCircuit({ ...circuit });
  };

  const handleUpdateCircuit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCircuit) return;

    // Apply auto-update logic based on score criteria
    const newStatus = determineStatusByScore(editingCircuit.impactScore);
    const finalCircuit = { ...editingCircuit, status: newStatus };

    if (newStatus !== editingCircuit.status) {
      showNotification(`تم تحديث حالة المسار تلقائياً إلى: ${newStatus === 'Validated' ? 'معتمد' : newStatus === 'Testing' ? 'قيد التجريب' : 'مسودة'}`);
    }

    setCircuits(prev => prev.map(c => c.id === finalCircuit.id ? finalCircuit : c));
    setEditingCircuit(null);
    if (selectedCircuit?.id === finalCircuit.id) setSelectedCircuit(finalCircuit);
  };

  const handlePromoteStatus = (id: string) => {
    setCircuits(prev => prev.map(c => {
      if (c.id !== id) return c;
      let nextStatus: 'Concept' | 'Testing' | 'Validated' = c.status;
      if (c.status === 'Concept') nextStatus = 'Testing';
      else if (c.status === 'Testing') nextStatus = 'Validated';
      
      if (nextStatus !== c.status) {
        showNotification(`تمت ترقية المسار إلى: ${nextStatus === 'Validated' ? 'معتمد' : 'قيد التجريب'}`);
      }
      
      const updated = { ...c, status: nextStatus };
      if (selectedCircuit?.id === id) setSelectedCircuit(updated);
      return updated;
    }));
  };

  const currentPois = selectedCircuit ? (CIRCUIT_POIS[selectedCircuit.id] || []) : [];

  return (
    <div className="space-y-8 animate-fadeIn relative min-h-screen text-right" dir="rtl">
      {/* Mini Notification Toast */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl animate-slideDown flex items-center gap-3 border border-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">المسارات الإبداعية</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">تصميم وتجريب مسارات سياحية ذات أثر إقليمي قوي</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 dark:shadow-purple-900/20">
            + مسار جديد
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {circuits.map(circuit => (
              <div 
                key={circuit.id} 
                onClick={() => setSelectedCircuit(circuit)}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full relative"
              >
                <div className="flex justify-between items-start mb-4 flex-row-reverse">
                  <div className="flex gap-2 items-center flex-row-reverse">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      circuit.status === 'Validated' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      circuit.status === 'Testing' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {circuit.status === 'Testing' ? 'قيد التجريب' : circuit.status === 'Validated' ? 'معتمد' : 'مسودة'}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleEditClick(circuit, e)}
                        className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-all"
                        title="تعديل"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => handleDeleteCircuit(circuit.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                        title="حذف"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                    <span className="text-xs font-black text-amber-700 dark:text-amber-400">{circuit.impactScore}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">{circuit.title}</h4>
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs mb-6 flex-row-reverse">
                  <span className="font-semibold">{circuit.location}</span>
                  <span className="mx-1">•</span>
                  <span className="font-bold text-purple-500">#{circuit.theme}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                   <p className="text-[10px] text-slate-400 font-bold">انقر للتفاصيل ونقاط الاهتمام</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white p-8 rounded-3xl shadow-2xl h-fit sticky top-8">
          <div className="flex items-center gap-4 mb-8 flex-row-reverse">
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold leading-none">ستوديو التصميم</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">ابتكار المسارات</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">الموضوع</label>
              <input type="text" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)} className="w-full bg-slate-800 border-none rounded-xl text-sm font-bold p-3 outline-none focus:ring-2 focus:ring-purple-500 text-right" />
            </div>
            <button onClick={handleGenerateAI} disabled={isGenerating} className="w-full py-4 bg-purple-500 hover:bg-purple-400 disabled:bg-slate-700 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3 shadow-xl">
              {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'توليد مسار مقترح'}
            </button>
            {aiResult && <div className="mt-4 p-4 bg-slate-800 rounded-xl text-xs text-slate-300 whitespace-pre-wrap border border-slate-700">{aiResult}</div>}
          </div>
        </div>
      </div>

      {/* Slide-out Side Drawer */}
      {selectedCircuit && !editingCircuit && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedCircuit(null)}></div>
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-950 h-full shadow-2xl animate-slideInRight flex flex-col overflow-hidden text-right border-r dark:border-slate-800">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 flex-row-reverse">
              <div className="flex items-center gap-4 flex-row-reverse">
                <div>
                  <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">تفاصيل المسار الإبداعي</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedCircuit.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => handleEditClick(selectedCircuit, e)} className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700" title="تعديل">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>
              <button onClick={() => setSelectedCircuit(null)} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">نقاط الاهتمام</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{currentPois.length} نقاط</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">الحالة الحالية</p>
                    <div className="flex items-center justify-between flex-row-reverse">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        selectedCircuit.status === 'Validated' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        selectedCircuit.status === 'Testing' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {selectedCircuit.status === 'Testing' ? 'قيد التجريب' : selectedCircuit.status === 'Validated' ? 'معتمد' : 'مسودة'}
                      </span>
                      {selectedCircuit.status !== 'Validated' && (
                        <button 
                          onClick={() => handlePromoteStatus(selectedCircuit.id)}
                          className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          ارتقاء بالمرحلة ←
                        </button>
                      )}
                    </div>
                 </div>
              </section>

              <section className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-r-4 border-purple-500 pr-3">نقاط الاهتمام الرئيسية</h4>
                {currentPois.length > 0 ? (
                  <div className="space-y-4">
                    {currentPois.map((poi, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-row-reverse group">
                        <div className="w-24 h-24 shrink-0 relative overflow-hidden">
                          <img src={poi.image} alt={poi.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-4 flex-1 text-right">
                          <div className="flex justify-between items-start mb-1 flex-row-reverse">
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm">{poi.title}</h5>
                            <span className="text-[8px] bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-black uppercase">{poi.type}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{poi.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">لم يتم تحديد نقاط اهتمام.</div>
                )}
              </section>

              <section className="space-y-4">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-r-4 border-purple-500 pr-3">خطة المسار الرقمي</h4>
                <div className="space-y-6">
                   {[
                     { t: "نقطة انطلاق غامرة", d: "استخدام الواقع المعزز لشرح تاريخ الموقع", time: "30 دقيقة" },
                     { t: "ورشة عمل تفاعلية", d: "لقاء مع حرفي محلي لتعلم تقنية تقليدية", time: "60 دقيقة" },
                     { t: "تذوق إبداعي", d: "تجربة طعام تجمع بين الأصالة والابتكار", time: "45 دقيقة" },
                   ].map((step, i) => (
                     <div key={i} className="flex gap-4 items-start flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">{i+1}</div>
                        <div className="flex-1 text-right">
                           <div className="flex justify-between items-center mb-1 flex-row-reverse">
                             <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{step.t}</h5>
                             <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">{step.time}</span>
                           </div>
                           <p className="text-xs text-slate-500 dark:text-slate-400">{step.d}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </section>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4 bg-slate-50 dark:bg-slate-900 flex-row-reverse mt-auto">
              <button className="flex-1 py-4 bg-slate-900 dark:bg-purple-600 text-white rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-purple-700 transition-all shadow-lg">تحميل الدليل الرقمي</button>
              <button className="px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all" onClick={() => setSelectedCircuit(null)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCircuit && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setEditingCircuit(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slideUp border dark:border-slate-800">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 flex-row-reverse">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">تعديل المسار</h3>
              <button onClick={() => setEditingCircuit(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-2xl">✕</button>
            </div>
            <form onSubmit={handleUpdateCircuit} className="p-8 space-y-6 text-right">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">عنوان المسار</label>
                <input required type="text" value={editingCircuit.title} onChange={e => setEditingCircuit({...editingCircuit, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">المنطقة</label>
                  <input required type="text" value={editingCircuit.location} onChange={e => setEditingCircuit({...editingCircuit, location: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">الموضوع</label>
                  <select value={editingCircuit.theme} onChange={e => setEditingCircuit({...editingCircuit, theme: e.target.value as any})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none">
                    <option value="Gastronomie">فن الطبخ</option>
                    <option value="Artisanat">الصناعات التقليدية</option>
                    <option value="Culture">ثقافة</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">درجة الأثر (0 - 5.0)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" max="5" step="0.1" 
                    value={editingCircuit.impactScore} 
                    onChange={e => setEditingCircuit({...editingCircuit, impactScore: parseFloat(e.target.value)})}
                    className="flex-1 accent-purple-600"
                  />
                  <span className="text-lg font-black text-purple-600 w-12 text-center">{editingCircuit.impactScore}</span>
                </div>
                <p className="text-[10px] text-slate-400 italic mt-1">ملاحظة: الدرجة فوق 4.7 تعتمد المسار تلقائياً.</p>
              </div>
              <div className="pt-4 flex gap-3 flex-row-reverse">
                <button type="submit" className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all">حفظ التغييرات</button>
                <button type="button" onClick={() => setEditingCircuit(null)} className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInRight { animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Circuits;
