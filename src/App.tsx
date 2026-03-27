import React, { useState } from 'react';
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
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
    </div>
  );
}
