
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { AppView } from './types';
import Dashboard from './components/Views/Dashboard';
import Incubation from './components/Views/Incubation';
import AIAssistant from './components/Views/AIAssistant';
import Circuits from './components/Views/Circuits';
import Evaluation from './components/Views/Evaluation';
import Knowledge from './components/Views/Knowledge';
import PodcastStudio from './components/Views/PodcastStudio';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.DASHBOARD);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('app-theme') as 'light' | 'dark') || 'light';
  });
  const [fontSize, setFontSize] = useState<string>(() => {
    return localStorage.getItem('app-font-size') || '16px';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app-font-size', fontSize);
  }, [fontSize]);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard setView={setView} />;
      case AppView.INCUBATION:
        return <Incubation />;
      case AppView.AI_ASSISTANT:
        return <AIAssistant />;
      case AppView.CIRCUITS:
        return <Circuits />;
      case AppView.EVALUATION:
        return <Evaluation />;
      case AppView.KNOWLEDGE:
        return <Knowledge />;
      case AppView.PODCAST:
        return <PodcastStudio />;
      default:
        return <Dashboard setView={setView} />;
    }
  };

  return (
    <div 
      className={`min-h-screen flex transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
      style={{ fontSize }}
    >
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        theme={theme} 
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      
      <main className="flex-1 mr-64 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto pb-20 text-right">
          {renderView()}
        </div>
      </main>

      {/* Persistent Assistant Toggle */}
      {currentView !== AppView.AI_ASSISTANT && (
        <button 
          onClick={() => setView(AppView.AI_ASSISTANT)}
          className="fixed bottom-8 left-8 w-14 h-14 bg-slate-900 dark:bg-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;
