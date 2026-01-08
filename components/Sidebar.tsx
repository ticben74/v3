
import React from 'react';
import { AppView } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  fontSize: string;
  setFontSize: (size: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, theme, setTheme, fontSize, setFontSize }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'لوحة القيادة', icon: <Icons.Dashboard /> },
    { id: AppView.PODCAST, label: 'استوديو البودكاست', icon: <div className="text-xl">🎙️</div> },
    { id: AppView.INCUBATION, label: 'الحاضنة الإبداعية', icon: <Icons.Incubation /> },
    { id: AppView.CIRCUITS, label: 'المسارات الإبداعية', icon: <Icons.Circuits /> },
    { id: AppView.EVALUATION, label: 'المتابعة والتقييم', icon: <Icons.Evaluation /> },
    { id: AppView.KNOWLEDGE, label: 'تثمين المعارف', icon: <Icons.Knowledge /> },
    { id: AppView.AI_ASSISTANT, label: 'المساعد الاستراتيجي', icon: <Icons.Assistant /> },
  ];

  const fontSizes = [
    { label: 'A-', value: '14px' },
    { label: 'A', value: '16px' },
    { label: 'A+', value: '18px' },
    { label: 'A++', value: '20px' },
  ];

  return (
    <aside className={`w-64 fixed right-0 top-0 h-screen flex flex-col shadow-xl z-50 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-l border-slate-800' : 'bg-white border-l border-slate-200'} text-right`}>
      <div className={`p-6 flex items-center gap-3 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">م</div>
        <div>
          <h1 className={`font-bold text-sm tracking-tight leading-none uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>مختبر الإبداع</h1>
          <p className="text-[10px] text-slate-400 mt-1 tracking-widest font-semibold">أداة لمكافحة الهجرة</p>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === item.id 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                  : theme === 'dark' 
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-purple-600'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`p-6 mt-auto border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>إعدادات العرض</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>الوضع الداكن</span>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-purple-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-1' : 'left-6'}`}></div>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => setFontSize(size.value)}
              className={`flex-1 py-1 rounded text-[10px] font-black transition-all ${
                fontSize === size.value 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : theme === 'dark' 
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white' 
                    : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
