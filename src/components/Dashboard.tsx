import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Battery,
  Car,
  Wrench,
  Calculator
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { formatCurrency } from '../lib/utils';

const data = [
  { name: 'Jan', sales: 4000, profit: 2400 },
  { name: 'Feb', sales: 3000, profit: 1398 },
  { name: 'Mar', sales: 2000, profit: 9800 },
  { name: 'Apr', sales: 2780, profit: 3908 },
  { name: 'May', sales: 1890, profit: 4800 },
  { name: 'Jun', sales: 2390, profit: 3800 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>
        <div className="flex items-center mt-2">
          {change > 0 ? (
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} className="mr-1" /> +{change}%
            </span>
          ) : (
            <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight size={12} className="mr-1" /> {change}%
            </span>
          )}
          <span className="text-xs text-gray-400 ml-2">vs last month</span>
        </div>
      </div>
      <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", color)}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={formatCurrency(124500)} 
          change={12.5} 
          icon={TrendingUp} 
          color="bg-primary" 
        />
        <StatCard 
          title="Active Customers" 
          value="1,284" 
          change={8.2} 
          icon={Users} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Stock Items" 
          value="452" 
          change={-2.4} 
          icon={Package} 
          color="bg-amber-600" 
        />
        <StatCard 
          title="Pending Jobs" 
          value="18" 
          change={4.1} 
          icon={AlertCircle} 
          color="bg-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800 text-lg">Sales Performance</h3>
            <select className="text-sm border-none bg-gray-100 rounded-lg px-3 py-1.5 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B0000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B0000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#8B0000" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 text-lg mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Battery', icon: Battery, color: 'bg-red-50 text-red-600' },
              { label: 'Auto', icon: Car, color: 'bg-blue-50 text-blue-600' },
              { label: 'Service', icon: Wrench, color: 'bg-green-50 text-green-600' },
              { label: 'Accounts', icon: Calculator, color: 'bg-purple-50 text-purple-600' },
            ].map((btn, i) => (
              <button key={i} className={cn("flex flex-col items-center justify-center p-6 rounded-2xl transition-all hover:scale-105 active:scale-95", btn.color)}>
                <btn.icon size={32} className="mb-3" />
                <span className="text-xs font-bold uppercase tracking-wider">{btn.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Notifications</h4>
            <div className="space-y-4">
              {[
                { text: 'Low stock: Exide 150Ah', time: '2h ago', type: 'alert' },
                { text: 'Service due: KA-01-MG-1234', time: '5h ago', type: 'info' },
              ].map((n, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", n.type === 'alert' ? 'bg-red-500' : 'bg-blue-500')}></div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">{n.text}</p>
                    <p className="text-[10px] text-gray-400">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
