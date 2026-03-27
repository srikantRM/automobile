import React, { useState } from 'react';
import { 
  Plus, 
  Wrench, 
  UserPlus, 
  CheckCircle2, 
  Receipt, 
  Bell,
  Clock,
  User,
  Car
} from 'lucide-react';
import { Button, Input, DataTable, Modal, Select } from '../components/UI';
import { formatCurrency, formatDate } from '../lib/utils';
import { JobCard, Mechanic } from '../types';

interface ServiceModuleProps {
  activeTab: string;
}

export const ServiceModule: React.FC<ServiceModuleProps> = ({ activeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [jobCards, setJobCards] = useState<JobCard[]>([
    { id: '1', customerName: 'Alice Johnson', phone: '9988776655', vehicleNo: 'KA-01-MG-1234', model: 'Honda City', km: 45000, dailyRunning: 50, fromKm: 45000, toKm: 50000, problem: 'Engine noise, Oil change', status: 'In Progress', partsPurchased: ['Oil Filter', 'Engine Oil'], serviceCharges: 1200, date: '2024-03-25' },
    { id: '2', customerName: 'Bob Wilson', phone: '8877665544', vehicleNo: 'KA-05-NB-5678', model: 'Maruti Swift', km: 12000, dailyRunning: 30, fromKm: 12000, toKm: 17000, problem: 'Brake check', status: 'Pending', partsPurchased: [], serviceCharges: 0, date: '2024-03-27' },
  ]);

  const [mechanics, setMechanics] = useState<Mechanic[]>([
    { id: '1', name: 'Rajesh Kumar', phone: '9000011111' },
    { id: '2', name: 'Suresh Raina', phone: '9000022222' },
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case 'jobcards':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Active Job Cards</h3>
              <Button icon={<Plus size={18} />} onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>Create Job Card</Button>
            </div>
            <DataTable 
              columns={[
                { key: 'vehicleNo', label: 'Vehicle No' },
                { key: 'customerName', label: 'Customer' },
                { key: 'model', label: 'Model' },
                { key: 'status', label: 'Status', render: (val) => (
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                    val === 'Completed' ? "bg-green-100 text-green-700" : 
                    val === 'In Progress' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                  )}>{val}</span>
                )},
                { key: 'date', label: 'Date', render: (val) => formatDate(val) },
              ]}
              data={jobCards}
              onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
              onPrint={() => window.print()}
            />
          </div>
        );
      case 'assign':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Assign Mechanic to Job</h3>
              <Select label="Select Vehicle / Job Card">
                <option>Select Pending Job</option>
                {jobCards.filter(j => j.status === 'Pending').map(j => <option key={j.id}>{j.vehicleNo} - {j.customerName}</option>)}
              </Select>
              <Select label="Select Mechanic">
                <option>Select Mechanic</option>
                {mechanics.map(m => <option key={m.id}>{m.name}</option>)}
              </Select>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Problem Description</label>
                <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100 italic">
                  Select a job card to view details
                </div>
              </div>
              <Button className="w-full">Assign & Notify Mechanic</Button>
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">Mechanic Workload</h4>
               {mechanics.map(m => (
                 <div key={m.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                       <User size={20} />
                     </div>
                     <div>
                       <p className="font-bold text-gray-800">{m.name}</p>
                       <p className="text-xs text-gray-500">{m.phone}</p>
                     </div>
                   </div>
                   <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">2 Active Jobs</span>
                 </div>
               ))}
            </div>
          </div>
        );
      case 'reminders':
        return (
          <div className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-center gap-4">
              <div className="p-3 bg-primary rounded-xl text-white">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="font-bold text-primary">Daily Service Reminders</h3>
                <p className="text-sm text-primary/70">Showing vehicles due for service based on daily running calculations.</p>
              </div>
            </div>
            <DataTable 
              columns={[
                { key: 'vehicleNo', label: 'Vehicle No' },
                { key: 'customerName', label: 'Customer' },
                { key: 'phone', label: 'Phone' },
                { key: 'km', label: 'Last KM' },
                { key: 'nextService', label: 'Est. Next Service', render: (_, row) => {
                  const daysLeft = Math.floor((3000) / row.dailyRunning);
                  const nextDate = new Date();
                  nextDate.setDate(nextDate.getDate() + daysLeft);
                  return formatDate(nextDate);
                }},
                { key: 'action', label: 'Action', render: () => (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" icon={<Bell size={14} />}>Remind</Button>
                  </div>
                )}
              ]}
              data={jobCards}
            />
          </div>
        );
      default:
        return <div className="p-12 text-center text-gray-400 italic">Module under development...</div>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="min-h-[600px]">
        {renderContent()}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Job Card" : "New Job Card Entry"}
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Customer Name" required />
            <Input label="Phone No" required />
            <Input label="Vehicle No" required icon={<Car size={16} />} />
            <Input label="Model" required />
            <Input label="Current KM" type="number" />
            <Input label="Daily Running (KM)" type="number" placeholder="e.g. 50" />
            <div className="grid grid-cols-2 gap-2">
              <Input label="From KM" type="number" />
              <Input label="To KM" type="number" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Vehicle Problem</label>
              <textarea 
                className="w-full mt-1.5 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px]"
                placeholder="Describe the issues..."
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Job Card</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import { cn } from '../lib/utils';
