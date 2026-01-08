
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface Indicator {
  id: string;
  name: string;
  category: 'Quantitatif' | 'Qualitatif';
  unit: string;
  target: number;
  current: number;
  previousValue?: number;
  period: string;
}

const INITIAL_INDICATORS: Indicator[] = [
  { id: '1', name: 'Nombre de bénéficiaires directs', category: 'Quantitatif', unit: 'Personnes', target: 500, current: 342, previousValue: 310, period: 'S1 2024' },
  { id: '2', name: 'Taux de satisfaction des artisans', category: 'Qualitatif', unit: '%', target: 90, current: 88, previousValue: 92, period: 'S1 2024' },
  { id: '3', name: 'Nouveaux emplois créés (ETP)', category: 'Quantitatif', unit: 'Postes', target: 50, current: 22, previousValue: 18, period: 'S1 2024' },
  { id: '4', name: 'Visibilité digitale des circuits', category: 'Qualitatif', unit: 'Score /10', target: 8, current: 6.5, previousValue: 6.8, period: 'S1 2024' },
];

const Evaluation: React.FC = () => {
  const [indicators, setIndicators] = useState<Indicator[]>(INITIAL_INDICATORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Indicator, 'id'>>({
    name: '',
    category: 'Quantitatif',
    unit: '',
    target: 0,
    current: 0,
    previousValue: 0,
    period: 'S1 2024'
  });

  const chartData = useMemo(() => {
    return indicators.map(ind => ({
      name: ind.name.length > 20 ? ind.name.substring(0, 17) + '...' : ind.name,
      fullName: ind.name,
      current: ind.current,
      target: ind.target,
      percent: Math.round((ind.current / ind.target) * 100),
      unit: ind.unit
    }));
  }, [indicators]);

  const alerts = useMemo(() => {
    return indicators.filter(ind => {
      const progress = (ind.current / ind.target);
      const negativeTrend = ind.previousValue !== undefined && ind.current < ind.previousValue;
      return (progress < 0.75) || negativeTrend;
    });
  }, [indicators]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Quantitatif', unit: '', target: 0, current: 0, previousValue: 0, period: 'S1 2024' });
    setIsModalOpen(true);
  };

  const openEditModal = (indicator: Indicator) => {
    setEditingId(indicator.id);
    setFormData({ 
      name: indicator.name, 
      category: indicator.category, 
      unit: indicator.unit, 
      target: indicator.target, 
      current: indicator.current, 
      previousValue: indicator.previousValue || 0,
      period: indicator.period 
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setIndicators(prev => prev.map(ind => ind.id === editingId ? { ...formData, id: editingId } : ind));
    } else {
      const newIndicator: Indicator = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9)
      };
      setIndicators(prev => [...prev, newIndicator]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet indicateur ?')) {
      setIndicators(prev => prev.filter(ind => ind.id !== id));
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-xs">
          <p className="font-bold text-slate-900 mb-1">{payload[0].payload.fullName}</p>
          <p className="text-sky-600 font-semibold">Réalisé: {payload[0].value} {payload[0].payload.unit}</p>
          <p className="text-slate-400">Objectif: {payload[1].value} {payload[0].payload.unit}</p>
          <p className="mt-1 font-bold border-t pt-1">Atteinte: {payload[0].payload.percent}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Suivi-Évaluation (M&E)</h2>
          <p className="text-slate-500">Mesure de l'impact territorial et performance des circuits</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          + Ajouter un Indicateur
        </button>
      </header>

      {alerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 animate-slideDown">
          <div className="flex items-center gap-3 mb-4 text-rose-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="font-bold">Points de vigilance requis ({alerts.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {alerts.map(alert => {
              const progress = Math.round((alert.current / alert.target) * 100);
              const negativeTrend = alert.previousValue !== undefined && alert.current < alert.previousValue;
              return (
                <div key={alert.id} className="bg-white/80 p-3 rounded-xl border border-rose-200 shadow-sm flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{alert.name}</p>
                    <p className="text-[10px] text-rose-600 font-semibold mt-0.5">
                      {(progress < 75) ? `Performance critique: ${progress}%` : negativeTrend ? 'Tendance en baisse' : ''}
                    </p>
                  </div>
                  <button onClick={() => openEditModal(alert)} className="ml-2 text-[10px] bg-rose-600 text-white px-2 py-1 rounded font-bold hover:bg-rose-700">Gérer</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-900">Comparaison Réalisé vs Objectif</h3>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-sky-500 rounded-sm"></span>
              <span className="text-slate-500">Réalisé</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-200 rounded-sm"></span>
              <span className="text-slate-500">Objectif</span>
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="current" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {chartData.map((data, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
             <div className="relative w-20 h-20 flex items-center justify-center mb-3">
               <svg className="w-full h-full transform -rotate-90">
                 <circle
                   cx="40" cy="40" r="36"
                   stroke="currentColor"
                   strokeWidth="6"
                   fill="transparent"
                   className="text-slate-100"
                 />
                 <circle
                   cx="40" cy="40" r="36"
                   stroke="currentColor"
                   strokeWidth="6"
                   fill="transparent"
                   strokeDasharray={226.2}
                   strokeDashoffset={226.2 - (226.2 * data.percent) / 100}
                   className={`${data.percent >= 100 ? 'text-emerald-500' : (data.percent < 75) ? 'text-rose-500' : 'text-sky-500'} transition-all duration-1000 ease-out`}
                 />
               </svg>
               <span className="absolute text-sm font-bold text-slate-900">{data.percent}%</span>
             </div>
             <p className="text-[11px] font-bold text-slate-700 truncate w-full">{data.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {indicators.map((indicator) => {
          const progress = Math.min(Math.round((indicator.current / indicator.target) * 100), 100);
          const isCritical = progress < 75;
          const trend = indicator.previousValue !== undefined 
            ? ((indicator.current - indicator.previousValue) / indicator.previousValue) * 100
            : 0;
          const negativeTrend = trend < 0;

          return (
            <div key={indicator.id} className={`bg-white p-6 rounded-xl border ${isCritical || negativeTrend ? 'border-rose-200' : 'border-slate-200'} shadow-sm group relative`}>
              {(isCritical || negativeTrend) && (
                <div className="absolute top-2 right-12 text-rose-500 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(indicator)}
                  className="p-1.5 text-slate-400 hover:text-sky-600 bg-slate-50 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L11.707 15.293a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.266l1-3a1 1 0 01.242-.39L16.5 3.5z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(indicator.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  indicator.category === 'Quantitatif' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
                }`}>
                  {indicator.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{indicator.period}</span>
                {negativeTrend && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-bold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Tendance {Math.round(trend)}%
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 mb-4">{indicator.name}</h3>

              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-2xl font-bold text-slate-900">{indicator.current}</span>
                  <span className="text-sm text-slate-500 ml-1">{indicator.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Objectif</span>
                  <span className="text-sm font-bold text-slate-700">{indicator.target} {indicator.unit}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Progression</span>
                  <span className={`${isCritical ? 'text-rose-600' : 'text-sky-600'}`}>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isCritical ? 'bg-rose-500' : indicator.category === 'Quantitatif' ? 'bg-emerald-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">{editingId ? "Modifier l'indicateur" : 'Nouvel indicateur M&E'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom de l'indicateur</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Revenus moyens par artisan"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Catégorie</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option>Quantitatif</option>
                    <option>Qualitatif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Période</label>
                  <input 
                    type="text" 
                    value={formData.period}
                    onChange={e => setFormData({...formData, period: e.target.value})}
                    placeholder="Ex: T2 2024"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unité de mesure</label>
                <input 
                  required
                  type="text" 
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                  placeholder="Ex: TND, %, Personnes..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cible (Objectif)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.target}
                    onChange={e => setFormData({...formData, target: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Réalisé (Actuel)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.current}
                    onChange={e => setFormData({...formData, current: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valeur Période Précédente</label>
                <input 
                  type="number" 
                  value={formData.previousValue}
                  onChange={e => setFormData({...formData, previousValue: Number(e.target.value)})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700"
                >
                  {editingId ? "Mettre à jour" : "Créer l'indicateur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluation;
