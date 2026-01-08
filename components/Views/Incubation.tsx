
import React, { useState } from 'react';

interface Program {
  id: string;
  name: string;
  status: string;
  progress: number;
  startups: number;
  end: string;
}

const INITIAL_PROGRAMS: Program[] = [
  { id: '1', name: 'Cohorte 3: Innovation Digitale', status: 'En cours', progress: 65, startups: 12, end: 'Août 2024' },
  { id: '2', name: 'Eco-Tourisme Djerba', status: 'Sélection', progress: 20, startups: 45, end: 'Sept 2024' },
  { id: '3', name: 'Artisanat & Patrimoine', status: 'Clôturé', progress: 100, startups: 8, end: 'Juin 2024' },
];

const Incubation: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>(INITIAL_PROGRAMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    status: 'Sélection',
    startups: 0,
    end: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProgram: Program = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      status: formData.status,
      progress: formData.status === 'Clôturé' ? 100 : formData.status === 'Sélection' ? 0 : 10,
      startups: Number(formData.startups),
      end: formData.end || 'TBD'
    };
    setPrograms([newProgram, ...programs]);
    setIsModalOpen(false);
    setFormData({ name: '', status: 'Sélection', startups: 0, end: '' });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Programmes d'Incubation</h2>
          <p className="text-slate-500">Conception, structuration et pilotage des cohortes TTL</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">Méthodologies</button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 shadow-sm transition-all"
          >
            + Nouveau Cycle
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <div key={prog.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm group hover:border-sky-300 transition-all animate-slideUp">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  prog.status === 'En cours' ? 'bg-sky-100 text-sky-700' :
                  prog.status === 'Sélection' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {prog.status}
                </span>
                <button className="text-slate-400 hover:text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-sky-600 transition-colors">{prog.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{prog.startups} porteurs de projets engagés</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Progression</span>
                  <span className="text-slate-900">{prog.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full transition-all duration-1000" style={{ width: `${prog.progress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Termine le {prog.end}</span>
              <button className="text-xs font-bold text-sky-600 hover:underline">Gérer Pipeline</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de création */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Structurer un Nouveau Cycle</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom du Programme</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Cohorte 4 - Tourisme Durable"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Statut Initial</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option>Sélection</option>
                    <option>En cours</option>
                    <option>Clôturé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cible Startups</label>
                  <input 
                    type="number" 
                    value={formData.startups}
                    onChange={e => setFormData({...formData, startups: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date de fin prévue</label>
                <input 
                  required
                  type="text" 
                  value={formData.end}
                  onChange={e => setFormData({...formData, end: e.target.value})}
                  placeholder="Ex: Décembre 2024"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors shadow-lg shadow-sky-200"
                >
                  Lancer le Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-6">Étapes de structuration (Checklist)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '1. Cadrage', desc: 'Définition des objectifs territoriaux', done: true },
            { step: '2. Sourcing', desc: 'Appel à projets et comités de sélection', done: true },
            { step: '3. Accompagnement', desc: 'Ateliers, mentorat et expertise terrain', done: false },
            { step: '4. Capitalisation', desc: 'Demo Day et production de guides', done: false },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 border-2 ${item.done ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-200 text-slate-300'}`}>
                {item.done ? '✓' : idx + 1}
              </div>
              <h4 className="font-bold text-sm text-slate-900">{item.step}</h4>
              <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Incubation;
