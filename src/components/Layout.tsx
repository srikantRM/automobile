import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Battery, 
  Car, 
  Wrench, 
  Calculator, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Settings,
  Bell,
  Search,
  User,
  Menu,
  ArrowLeft,
  Package,
  Users,
  Truck,
  ShoppingCart,
  Receipt,
  BarChart3,
  CreditCard,
  UserPlus,
  Clock,
  Wallet,
  PieChart,
  Scale,
  Book,
  Layers,
  Plus,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ModuleType } from '../types';

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  onBackToSelection: () => void;
}

const DatabaseStatus = () => {
  const [status, setStatus] = useState<{ status: string; type: string; host: string } | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/db-status');
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error('Failed to fetch DB status');
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all",
      status.type === 'mysql' 
        ? "bg-green-50 text-green-700 border-green-200 shadow-sm" 
        : "bg-amber-50 text-amber-700 border-amber-200"
    )}>
      <Database size={12} className={status.type === 'mysql' ? "animate-pulse" : ""} />
      <span>{status.type === 'mysql' ? 'Cloud DB' : 'Local Storage'}</span>
      <span className="opacity-50 hidden md:inline">| {status.host}</span>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeModule, 
  setActiveModule, 
  activeSubTab, 
  setActiveSubTab, 
  onBackToSelection 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const subMenus: Record<ModuleType, { id: string; label: string; icon: any }[]> = {
    inverter: [
      { id: 'products', label: 'Product Master', icon: Package },
      { id: 'customers', label: 'Customer Master', icon: Users },
      { id: 'suppliers', label: 'Supplier Master', icon: Truck },
      { id: 'orders', label: 'Purchase Order', icon: ShoppingCart },
      { id: 'purchases', label: 'Purchase Form', icon: Receipt },
      { id: 'sales', label: 'Sales Form', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ],
    automobiles: [
      { id: 'products', label: 'Product Master', icon: Package },
      { id: 'search', label: 'Product Search', icon: Search },
      { id: 'orders', label: 'Purchase Order', icon: ShoppingCart },
      { id: 'purchases', label: 'Purchase Form', icon: Receipt },
      { id: 'payments', label: 'Supplier Payment', icon: CreditCard },
      { id: 'sales', label: 'Sales Form', icon: BarChart3 },
      { id: 'suppliers', label: 'Supplier Master', icon: Truck },
    ],
    service: [
      { id: 'jobcards', label: 'Job Card Form', icon: Receipt },
      { id: 'assign', label: 'Assign Mechanic', icon: UserPlus },
      { id: 'mechanics', label: 'Mechanic Master', icon: Users },
      { id: 'status', label: 'Status Update', icon: Clock },
      { id: 'billing', label: 'Bill Form', icon: Receipt },
      { id: 'reminders', label: 'Vehicle Reminder', icon: Bell },
    ],
    accounts: [
      { id: 'vouchers', label: 'Voucher Entry', icon: Receipt },
      { id: 'daybook', label: 'Day Book', icon: Book },
      { id: 'cashbank', label: 'Cash / Bank Book', icon: Wallet },
      { id: 'ledger', label: 'General Ledger', icon: Layers },
      { id: 'trial', label: 'Trial Balance', icon: Scale },
      { id: 'pl', label: 'Profit & Loss', icon: PieChart },
      { id: 'balance', label: 'Balance Sheet', icon: Scale },
      { id: 'heads', label: 'Chart of Accounts', icon: Layers },
    ],
    dashboard: [] // Should not be accessible via sidebar in this mode
  };

  const currentSubMenu = subMenus[activeModule] || [];

  return (
    <aside 
      className={cn(
        "h-screen dark-red-gradient text-white transition-all duration-300 flex flex-col shadow-2xl z-20",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight">SkyBird</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden lg:block"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto no-scrollbar">
        <button
          onClick={onBackToSelection}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all mb-4 border border-white/10"
        >
          <ArrowLeft size={20} />
          {!isCollapsed && <span className="font-medium">Main Menu</span>}
        </button>

        <div className="px-3 mb-2">
          {!isCollapsed && (
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              {activeModule.replace('-', ' ')} Options
            </p>
          )}
        </div>

        {currentSubMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSubTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
              activeSubTab === item.id 
                ? "bg-white text-primary shadow-lg" 
                : "hover:bg-white/10 text-white/70 hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              "shrink-0",
              activeSubTab === item.id ? "text-primary" : "group-hover:scale-110 transition-transform"
            )} />
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all">
          <Settings size={20} />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/20 text-red-200 transition-all">
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

interface HeaderProps {
  activeModule: string;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeModule, onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-10 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-600"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 capitalize">
          {activeModule.replace('-', ' ')}
        </h2>
        <DatabaseStatus />
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all active:scale-95">
            <Plus size={18} />
            <span>Quick Add</span>
          </button>
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-primary/30 rounded-full text-sm transition-all w-48 xl:w-64 outline-none"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">Admin</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
              <User size={18} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
