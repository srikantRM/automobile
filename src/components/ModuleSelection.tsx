import React from 'react';
import { Battery, Car, Wrench, Calculator } from 'lucide-react';
import { ModuleType } from '../types';
import { cn } from '../lib/utils';

interface ModuleSelectionProps {
  onSelect: (module: ModuleType) => void;
}

export const ModuleSelection: React.FC<ModuleSelectionProps> = ({ onSelect }) => {
  const modules = [
    { 
      id: 'inverter', 
      label: 'Inverter Battery', 
      icon: Battery, 
      color: 'bg-red-600',
      description: 'Manage batteries, stock, and sales'
    },
    { 
      id: 'automobiles', 
      label: 'Automobiles', 
      icon: Car, 
      color: 'bg-blue-600',
      description: 'Auto parts inventory and supplier tracking'
    },
    { 
      id: 'service', 
      label: 'Vehicle Service', 
      icon: Wrench, 
      color: 'bg-green-600',
      description: 'Job cards, mechanics, and service reminders'
    },
    { 
      id: 'accounts', 
      label: 'Accounts', 
      icon: Calculator, 
      color: 'bg-purple-600',
      description: 'Financial ledgers, P&L, and balance sheets'
    },
  ];

  return (
    <div className="min-h-screen dark-red-gradient flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <span className="text-primary font-bold text-4xl">R</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">SKYBIRD Business Manager</h1>
        <p className="text-white/70 text-lg max-w-md mx-auto">Select a module to begin managing your business operations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl animate-in fade-in zoom-in-95 duration-700 delay-200">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => onSelect(mod.id as ModuleType)}
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-left transition-all hover:bg-white hover:scale-[1.02] hover:shadow-2xl active:scale-95 overflow-hidden"
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", mod.color)}>
              <mod.icon size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-gray-900 transition-colors mb-2">{mod.label}</h3>
            <p className="text-white/60 group-hover:text-gray-500 transition-colors text-sm">{mod.description}</p>
            
            {/* Decorative element */}
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <mod.icon size={120} className="text-white group-hover:text-primary" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-16 text-white/40 text-sm font-medium tracking-widest uppercase">
        Professional Business Suite v1.0
      </div>
    </div>
  );
};
