
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { geminiService } from '../../services/geminiService';

type AssistantAction = 'structure' | 'communication';

interface SavedProposition {
  id: string;
  timestamp: number;
  prompt: string;
  response: string;
  action: AssistantAction;
  isFavorite: boolean;
}

// Toast Notification Component
const Toast: React.FC<{ message: string; show: boolean; type?: 'success' | 'info' }> = ({ message, show, type = 'success' }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] animate-slideUp">
      <div className={`px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
        type === 'success' 
          ? 'bg-emerald-500/90 text-white border-emerald-400' 
          : 'bg-slate-900/90 text-white border-slate-700'
      }`}>
        <div className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-full">
          {type === 'success' ? '✓' : 'ℹ'}
        </div>
        <span className="text-sm font-bold tracking-tight">{message}</span>
      </div>
    </div>
  );
};

// Share Dropdown Component
const ShareMenu: React.FC<{ text: string; title: string; onClose: () => void; onNotify: (msg: string) => void }> = ({ text, title, onClose, onNotify }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    onNotify('تم نسخ النص إلى الحافظة بنجاح');
    onClose();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`مقترح استراتيجي: ${title}`);
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[150] overflow-hidden animate-fadeIn"
    >
      <button 
        onClick={handleCopy}
        className="w-full px-4 py-3 text-right text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between flex-row-reverse border-b border-slate-100 dark:border-slate-700 transition-colors"
      >
        <span className="flex items-center gap-2 flex-row-reverse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          نسخ النص
        </span>
      </button>
      <button 
        onClick={handleEmail}
        className="w-full px-4 py-3 text-right text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between flex-row-reverse transition-colors"
      >
        <span className="flex items-center gap-2 flex-row-reverse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          إرسال بالبريد
        </span>
      </button>
    </div>
  );
};

const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<AssistantAction>('structure');
  const [history, setHistory] = useState<SavedProposition[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  
  // Feedback states
  const [toast, setToast] = useState<{ message: string; show: boolean; type?: 'success' | 'info' }>({ message: '', show: false });
  const [isSavedTabAnimating, setIsSavedTabAnimating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ttl_ai_persistence');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load AI history", e);
      }
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, show: true, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const triggerSavedTabAnimation = () => {
    setIsSavedTabAnimating(true);
    setTimeout(() => setIsSavedTabAnimating(false), 500);
  };

  const updateHistory = (newHistory: SavedProposition[]) => {
    setHistory(newHistory);
    localStorage.setItem('ttl_ai_persistence', JSON.stringify(newHistory));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setCurrentResponse(null);
    try {
      let res;
      if (action === 'structure') {
        res = await geminiService.suggestProgramStructure(prompt);
      } else {
        res = await geminiService.generateCommunicationPlan(prompt);
      }
      
      const responseText = res || 'Aucune réponse générée.';
      setCurrentResponse(responseText);

      const newProp: SavedProposition = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        prompt: prompt,
        response: responseText,
        action: action,
        isFavorite: false
      };
      
      const updatedHistory = [newProp, ...history].slice(0, 20);
      updateHistory(updatedHistory);
      
      // Visual feedback for auto-saving to history
      showToast('تم توليد المقترح وحفظه في السجل');
      triggerSavedTabAnimation();
      
    } catch (error) {
      setCurrentResponse("حدث خطأ أثناء التوليد. يرجى التحقق من المفتاح أو الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    const item = history.find(i => i.id === id);
    const becomingFavorite = !item?.isFavorite;
    
    updateHistory(history.map(item => 
      item.id === id ? { ...item, isFavorite: becomingFavorite } : item
    ));

    showToast(becomingFavorite ? 'تمت الإضافة للمفضلات' : 'تمت الإزالة من المفضلات', becomingFavorite ? 'success' : 'info');
    if (becomingFavorite) triggerSavedTabAnimation();
  };

  const deleteFromHistory = (id: string) => {
    updateHistory(history.filter(item => item.id !== id));
    showToast('تم حذف العنصر من السجل', 'info');
  };

  const clearHistory = () => {
    if (window.confirm("Voulez-vous vraiment effacer tout l'historique et les favoris ?")) {
      updateHistory([]);
      showToast('تم إفراغ السجل بالكامل', 'info');
    }
  };

  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) return history;
    const lowerSearch = searchTerm.toLowerCase();
    return history.filter(item => 
      item.prompt.toLowerCase().includes(lowerSearch) || 
      item.response.toLowerCase().includes(lowerSearch)
    );
  }, [history, searchTerm]);

  const favorites = filteredHistory.filter(item => item.isFavorite);
  const recents = filteredHistory.filter(item => !item.isFavorite);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-24 text-right relative" dir="rtl">
      {/* Global Toast */}
      <Toast message={toast.message} show={toast.show} type={toast.type} />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-row-reverse">
          <div className="w-12 h-12 bg-slate-900 dark:bg-purple-600 rounded-xl flex items-center justify-center text-sky-400 dark:text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">المساعد الاستراتيجي TTL</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">ذكاء معزز في خدمة الاقتصاد الإبداعي</p>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-fit border dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'generate' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            المولد الإبداعي
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 relative overflow-visible ${
              activeTab === 'saved' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            } ${isSavedTabAnimating ? 'animate-bounce-small' : ''}`}
          >
            المحفوظات والسجل
            {history.length > 0 && (
              <span className={`w-5 h-5 bg-purple-500 text-white text-[10px] rounded-full flex items-center justify-center mr-1 transition-all ${isSavedTabAnimating ? 'scale-125' : 'scale-100'}`}>
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {activeTab === 'generate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block text-right">الأداة المطلوبة</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAction('structure')}
                    className={`px-3 py-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                      action === 'structure' ? 'border-slate-900 dark:border-purple-600 bg-slate-900 dark:bg-purple-600 text-white' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    هيكلة البرنامج
                  </button>
                  <button
                    onClick={() => setAction('communication')}
                    className={`px-3 py-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                      action === 'communication' ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    خطة تواصل
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-right">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">سياق المشروع أو المختبر</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={action === 'structure' 
                    ? "مثال: مختبر إبداع في بنزرت يهدف لتثمين التراث البحري..." 
                    : "صف المبادرة التي تريد الترويج لها..."}
                  className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-sm text-slate-800 dark:text-slate-200 text-right"
                />
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 shadow-lg ${
                  action === 'structure' ? 'bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-700 shadow-slate-200 dark:shadow-none' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-100 dark:shadow-none'
                } disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:shadow-none disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري التحليل الاستراتيجي...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    توليد المقترح
                  </>
                )}
              </button>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 p-4 rounded-xl flex gap-3 flex-row-reverse transition-colors">
              <div className="text-purple-500 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[11px] text-purple-800 dark:text-purple-300 leading-relaxed font-medium text-right">
                تذكير: المساعد ملقن بفلسفة "اقتصاد المعنى" الواردة في دليل مختبرات الإبداع 2026.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {currentResponse ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-slideUp transition-colors">
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-row-reverse">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-row-reverse">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    المقترح المولد
                  </h3>
                  <div className="flex gap-2 relative">
                    <button 
                      onClick={() => setActiveShareId(activeShareId === 'current' ? null : 'current')}
                      className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all"
                      title="مشاركة"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                    {activeShareId === 'current' && (
                      <ShareMenu 
                        text={currentResponse} 
                        title={prompt.substring(0, 30)} 
                        onClose={() => setActiveShareId(null)} 
                        onNotify={(msg) => showToast(msg)}
                      />
                    )}
                    <div className="flex items-center gap-1 group">
                      <button 
                        onClick={() => {
                          const latest = history[0];
                          if (latest) toggleFavorite(latest.id);
                        }}
                        className="p-2 text-slate-400 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all flex items-center gap-1"
                        title="حفظ في المفضلات"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${history[0]?.isFavorite ? 'fill-amber-500 text-amber-500 scale-110' : 'scale-100 group-hover:scale-110'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        {history[0]?.isFavorite && <span className="text-[10px] font-bold text-amber-600 animate-fadeIn">محفوظ</span>}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-8 prose prose-slate prose-sm max-w-none text-right">
                  <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm text-right">
                    {currentResponse}
                  </div>
                </div>
                <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                   <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">توليد نكسوس • {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-600 dark:text-slate-500 mb-2">في انتظار سياقك الإبداعي</h3>
                <p className="max-w-xs text-sm">استخدم القوة التحليلية لـ Gemini لصياغة رؤيتك الثقافية.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 flex-row-reverse focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
            <div className="text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text"
              placeholder="البحث بالكلمات المفتاحية في الاستراتيجيات أو الردود..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 text-right"
            />
            {searchTerm && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                  {filteredHistory.length} نتيجة
                </span>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {(favorites.length > 0 || recents.length > 0) ? (
            <div className="space-y-12">
              {favorites.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 flex-row-reverse border-r-4 border-amber-500 pr-3">
                    المحفوظات المميزة ({favorites.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map(item => (
                      <StrategyCard 
                        key={item.id} 
                        item={item} 
                        onToggleFav={toggleFavorite} 
                        onDelete={deleteFromHistory} 
                        onView={(text) => { setCurrentResponse(text); setActiveTab('generate'); }}
                        activeShareId={activeShareId}
                        setActiveShareId={setActiveShareId}
                        onNotify={showToast}
                      />
                    ))}
                  </div>
                </section>
              )}

              {recents.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between flex-row-reverse border-r-4 border-slate-300 dark:border-slate-700 pr-3">
                    <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">تاريخ العمليات الأخيرة</h3>
                    {!searchTerm && (
                      <button onClick={clearHistory} className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-wider">إفراغ السجل</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recents.map(item => (
                      <div key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group text-right hover:border-purple-200 dark:hover:border-purple-500 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${item.action === 'structure' ? 'bg-slate-900 dark:bg-purple-600 text-white' : 'bg-sky-600 text-white'}`}>
                            {item.action === 'structure' ? 'هيكلة' : 'تواصل'}
                          </span>
                          <div className="flex gap-2 relative">
                            <button 
                              onClick={() => setActiveShareId(activeShareId === item.id ? null : item.id)}
                              className="text-slate-300 hover:text-purple-500 transition-colors"
                              title="مشاركة"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </button>
                            {activeShareId === item.id && (
                              <ShareMenu 
                                text={item.response} 
                                title={item.prompt.substring(0, 30)} 
                                onClose={() => setActiveShareId(null)} 
                                onNotify={showToast}
                              />
                            )}
                            <button onClick={() => toggleFavorite(item.id)} className="text-slate-200 dark:text-slate-700 hover:text-amber-500 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 mb-4 h-8 leading-relaxed text-right">{item.prompt}</p>
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex-row-reverse">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{new Date(item.timestamp).toLocaleDateString()}</span>
                          <button 
                            onClick={() => { setCurrentResponse(item.response); setActiveTab('generate'); }}
                            className="text-[10px] font-black text-purple-600 dark:text-purple-400 hover:underline tracking-tight"
                          >
                            عرض التفاصيل
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="py-24 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-300 dark:text-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">لم نعثر على نتائج</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mx-auto">جرب البحث بكلمات أبسط أو تحقق من تهجئة المشروع المكتوب.</p>
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-2 bg-slate-900 dark:bg-purple-600 text-white rounded-full text-xs font-bold hover:bg-slate-800 dark:hover:bg-purple-700 transition-all"
                >
                  عرض جميع المحفوظات
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce-small {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-bounce-small {
          animation: bounce-small 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

interface CardProps {
  item: SavedProposition;
  onToggleFav: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (text: string) => void;
  activeShareId: string | null;
  setActiveShareId: (id: string | null) => void;
  onNotify: (msg: string) => void;
}

const StrategyCard: React.FC<CardProps> = ({ item, onToggleFav, onDelete, onView, activeShareId, setActiveShareId, onNotify }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-purple-300 dark:hover:border-purple-500 shadow-sm hover:shadow-xl transition-all group flex flex-col text-right">
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-row-reverse">
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.15em] ${
          item.action === 'structure' ? 'bg-slate-900 dark:bg-purple-600 text-white' : 'bg-sky-600 text-white'
        }`}>
          {item.action === 'structure' ? 'هيكلة البرنامج' : 'خطة التواصل'}
        </span>
        <div className="flex gap-3 relative">
          <button 
            onClick={() => setActiveShareId(activeShareId === item.id ? null : item.id)}
            className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            title="مشاركة"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          {activeShareId === item.id && (
            <ShareMenu 
              text={item.response} 
              title={item.prompt.substring(0, 30)} 
              onClose={() => setActiveShareId(null)} 
              onNotify={onNotify}
            />
          )}
          <button onClick={() => onToggleFav(item.id)} className="text-amber-500 hover:scale-125 transition-transform" title="إزالة من التفضيل">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </button>
          <button onClick={() => onDelete(item.id)} className="text-slate-300 dark:text-slate-700 hover:text-rose-500 transition-colors" title="حذف نهائي">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col text-right">
        <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 mb-3 leading-relaxed text-right">{item.prompt}</h4>
        <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-4 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed italic mb-6 border border-slate-100 dark:border-slate-800 text-right">
          "{item.response.substring(0, 300)}..."
        </div>
        <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 flex-row-reverse">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black tracking-wider">
             {new Date(item.timestamp).toLocaleDateString()}
          </span>
          <button 
            onClick={() => onView(item.response)}
            className="px-6 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-black hover:bg-purple-700 transition-all shadow-md shadow-purple-100 dark:shadow-none"
          >
            فتح المقترح
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
