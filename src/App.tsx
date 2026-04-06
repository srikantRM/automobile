import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Toaster } from 'sonner';
import { Sidebar, Header } from './components/Layout';
import { ModuleSelection } from './components/ModuleSelection';
import { InverterModule } from './modules/InverterModule';
import { AutoModule } from './modules/AutoModule';
import { ServiceModule } from './modules/ServiceModule';
import { AccountsModule } from './modules/AccountsModule';
import { ModuleType } from './types';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleModuleSelect = (mod: ModuleType) => {
    setActiveModule(mod);
    // Set default sub-tab for each module
    const defaults: Record<string, string> = {
      inverter: 'products',
      automobiles: 'products',
      service: 'jobcards',
      accounts: 'cashbook'
    };
    setActiveSubTab(defaults[mod] || '');
    setIsSidebarOpen(false);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'inverter':
        return <InverterModule activeTab={activeSubTab} />;
      case 'automobiles':
        return <AutoModule activeTab={activeSubTab} />;
      case 'service':
        return <ServiceModule activeTab={activeSubTab} />;
      case 'accounts':
        return <AccountsModule activeTab={activeSubTab} />;
      default:
        return null;
    }
  };

  if (!activeModule) {
    return <ModuleSelection onSelect={handleModuleSelect} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden overscroll-none relative">
      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out h-full`}>
        <Sidebar 
          activeModule={activeModule} 
          setActiveModule={handleModuleSelect} 
          activeSubTab={activeSubTab}
          setActiveSubTab={(tab) => {
            setActiveSubTab(tab);
            setIsSidebarOpen(false);
          }}
          onBackToSelection={() => setActiveModule(null)}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          activeModule={activeModule} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderModule()}
          </div>
        </main>
      </div>

      {/* Quick Add Floating Button */}
      <div className="fixed bottom-8 right-8 z-50 group">
        <button 
          className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 active:scale-95"
          onClick={() => {
            // Logic to open a quick add menu or modal
            // For now, let's just trigger the current module's default add if applicable
            // But a menu would be better.
          }}
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
        
        {/* Quick Add Menu (Tooltip style) */}
        <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 min-w-[200px] space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-2">Quick Actions</p>
            <button onClick={() => handleModuleSelect('inverter')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" /> New Inverter Product
            </button>
            <button onClick={() => handleModuleSelect('automobiles')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" /> New Auto Part
            </button>
            <button onClick={() => handleModuleSelect('service')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" /> Create Job Card
            </button>
            <button onClick={() => handleModuleSelect('accounts')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" /> Record Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          aside, header, nav, button, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          .max-w-7xl {
            max-width: 100% !important;
          }
          .bg-gray-50 {
            background-color: white !important;
          }
          .shadow-sm, .shadow-md, .shadow-lg, .shadow-2xl {
            box-shadow: none !important;
          }
          .border {
            border-color: #eee !important;
          }
        }
      `}} />
      <Toaster position="top-right" richColors />
    </div>
  );
}
