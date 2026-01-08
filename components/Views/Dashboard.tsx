
import React from 'react';
import StatCard from '../StatCard';
import { Icons } from '../../constants';
import { AppView } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  setView?: (view: AppView) => void;
}

const data = [
  { name: 'جانفي', incubation: 4, circuits: 2 },
  { name: 'فيفري', incubation: 3, circuits: 5 },
  { name: 'مارس', incubation: 6, circuits: 3 },
  { name: 'أفريل', incubation: 8, circuits: 7 },
  { name: 'ماي', incubation: 12, circuits: 8 },
  { name: 'جوان', incubation: 10, circuits: 12 },
];

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">لوحة القيادة الاستراتيجية</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">متابعة أداء مختبر الإبداع والاقتصاد الثقافي الرقمي</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm">
            تصدير التقرير
          </button>
          <button 
            onClick={() => setView?.(AppView.INCUBATION)}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 dark:shadow-purple-900/20 flex items-center gap-2"
          >
            <Icons.Incubation />
            دورة احتضان جديدة
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="المشاريع المحتضنة" value="42" change={12} icon={<Icons.Incubation />} />
        <StatCard label="المسارات الإبداعية" value="18" change={5} icon={<Icons.Circuits />} />
        <StatCard label="نسبة الاستبقاء" value="94%" change={2} icon={<Icons.Dashboard />} />
        <StatCard label="مؤشر الأثر الثقافي" value="4.8/5" icon={<Icons.Evaluation />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">نشاط البرامج</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                 <span className="text-xs font-bold text-slate-400">الاحتضان</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                 <span className="text-xs font-bold text-slate-400">المسارات</span>
               </div>
            </div>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(148, 163, 184, 0.1)'}}
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                    textAlign: 'right',
                    backgroundColor: '#1e293b',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="incubation" fill="#9333ea" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="circuits" fill="#f97316" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">آخر التحديثات</h3>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
            {[
              { type: 'incubation', msg: 'إطلاق طلب عروض "الفنون الرقمية"', time: 'منذ ساعتين', icon: '🎨' },
              { type: 'circuit', msg: 'اعتماد مسار "حومة السوق الإبداعية"', time: 'منذ 5 ساعات', icon: '📍' },
              { type: 'me', msg: 'جاهزية تقرير الأثر للدفعة الثالثة', time: 'أمس', icon: '📊' },
              { type: 'knowledge', msg: 'نشر دليل التصميم التشاركي الجديد', time: 'منذ يومين', icon: '📚' },
            ].map((action, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer flex-row-reverse">
                <div className="w-10 h-10 shrink-0 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 transition-colors">
                  {action.icon}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{action.msg}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{action.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 rounded-2xl text-sm font-bold hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all border border-slate-100 dark:border-slate-700">
            مشاهدة السجل الكامل
          </button>
        </div>
      </div>

      <div className="bg-slate-900 dark:bg-purple-950 p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl text-right">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -ml-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row-reverse items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl font-bold">هل تحتاج إلى مساعدة في هيكلة مشروعك؟</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              استخدم المساعد الاستراتيجي المدعوم بالذكاء الاصطناعي لتوليد هياكل البرامج، خطط التواصل، أو المسارات الإبداعية المصممة خصيصاً لسياق الاقتصاد الثقافي الرقمي.
            </p>
          </div>
          <button 
            onClick={() => setView?.(AppView.AI_ASSISTANT)}
            className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-purple-400 hover:text-white transition-all shadow-xl whitespace-nowrap"
          >
            تحدث مع المساعد الذكي
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
