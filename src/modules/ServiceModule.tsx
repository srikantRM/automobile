import React, { useState } from 'react';
import { 
  Plus, 
  Search,
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
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { JobCard, Mechanic } from '../types';

interface ServiceModuleProps {
  activeTab: string;
}

export const ServiceModule: React.FC<ServiceModuleProps> = ({ activeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [jobCards, setJobCards] = useState<JobCard[]>([]);

  const [mechanics, setMechanics] = useState<Mechanic[]>([]);

  const [assignments, setAssignments] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (activeTab === 'jobcards') {
      if (editingItem) {
        setJobCards(jobCards.map(j => j.id === editingItem.id ? { ...j, ...data } as JobCard : j));
      } else {
        const newJobCard: JobCard = {
          id: Math.random().toString(36).substr(2, 9),
          customerName: data.customerName as string,
          phone: data.phone as string,
          vehicleNo: data.vehicleNo as string,
          model: data.model as string,
          km: Number(data.km),
          dailyRunning: Number(data.dailyRunning),
          fromKm: Number(data.fromKm),
          toKm: Number(data.toKm),
          problem: data.problem as string,
          status: 'Pending',
          partsPurchased: [],
          serviceCharges: 0,
          date: new Date().toISOString().split('T')[0],
        };
        setJobCards([...jobCards, newJobCard]);
      }
    } else if (activeTab === 'assign') {
      const newAssignment = {
        id: Math.random().toString(36).substr(2, 9),
        jobCardId: data.jobCardId as string,
        mechanicId: data.mechanicId as string,
        date: new Date().toISOString().split('T')[0],
      };
      setAssignments([newAssignment, ...assignments]);
      
      // Update job card status to 'In Progress'
      const vehicleNo = (data.jobCardId as string).split(' - ')[0];
      setJobCards(jobCards.map(j => j.vehicleNo === vehicleNo ? { ...j, status: 'In Progress' } : j));
    } else if (activeTab === 'mechanics') {
      if (editingItem) {
        setMechanics(mechanics.map(m => m.id === editingItem.id ? { ...m, ...data } as Mechanic : m));
      } else {
        const newMechanic: Mechanic = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name as string,
          phone: data.phone as string,
        };
        setMechanics([...mechanics, newMechanic]);
      }
    } else if (activeTab === 'billing') {
      const jobCardId = data.jobCardId as string;
      setJobCards(jobCards.map(j => j.id === jobCardId ? { 
        ...j, 
        serviceCharges: Number(data.serviceCharges),
        partsCharges: Number(data.partsCharges)
      } : j));
    }

    (e.target as HTMLFormElement).reset();
    alert('Data saved successfully!');
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'jobcards':
        const filteredJobCards = jobCards.filter(j => 
          j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.phone.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Create New Job Card</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <Input name="customerName" label="Customer Name" required />
                <Input name="phone" label="Phone No" required />
                <Input name="vehicleNo" label="Vehicle No" required icon={<Car size={16} />} />
                <Input name="model" label="Model" required />
                <Input name="km" label="Current KM" type="number" required />
                <Input name="dailyRunning" label="Daily Running (KM)" type="number" placeholder="e.g. 50" required />
                <Input name="fromKm" label="From KM" type="number" required />
                <Input name="toKm" label="To KM" type="number" required />
                <div className="md:col-span-4">
                  <label className="text-xs font-bold text-gray-500 uppercase">Vehicle Problem</label>
                  <textarea 
                    name="problem"
                    className="w-full mt-1.5 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[80px]"
                    placeholder="Describe the issues..."
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <Button type="submit" icon={<Plus size={18} />}>Save Job Card</Button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <h3 className="text-xl font-bold text-gray-800">Active Job Cards</h3>
                <div className="w-full md:w-64">
                  <Input 
                    placeholder="Search job cards..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
                data={filteredJobCards}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this job card?')) {
                    setJobCards(jobCards.filter(j => j.id !== row.id));
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );
      case 'assign':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Assign Mechanic to Job</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Select label="Select Vehicle / Job Card" name="jobCardId">
                  <option>Select Pending Job</option>
                  {jobCards.filter(j => j.status === 'Pending').map(j => <option key={j.id}>{j.vehicleNo} - {j.customerName}</option>)}
                </Select>
                <Select label="Select Mechanic" name="mechanicId">
                  <option>Select Mechanic</option>
                  {mechanics.map(m => <option key={m.id}>{m.name}</option>)}
                </Select>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Problem Description</label>
                  <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100 italic">
                    Select a job card to view details
                  </div>
                </div>
                <Button className="w-full" type="submit">Assign & Notify Mechanic</Button>
              </form>
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
      case 'mechanics':
        const filteredMechanics = mechanics.filter(m => 
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.phone.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Add New Mechanic</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <Input name="name" label="Mechanic Name" placeholder="Enter Name" required />
                <Input name="phone" label="Phone Number" placeholder="Enter Phone No" required />
                <div className="flex justify-end">
                  <Button type="submit" icon={<Plus size={18} />}>Save Mechanic</Button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <h3 className="text-xl font-bold text-gray-800">Mechanic Master</h3>
                <div className="w-full md:w-64">
                  <Input 
                    placeholder="Search mechanics..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <DataTable 
                columns={[
                  { key: 'name', label: 'Mechanic Name' },
                  { key: 'phone', label: 'Phone Number' },
                ]}
                data={filteredMechanics}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this mechanic?')) {
                    setMechanics(mechanics.filter(m => m.id !== row.id));
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );
      case 'status':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-gray-800">Vehicle Status Update</h3>
              <div className="w-64">
                <Input 
                  placeholder="Search vehicle..." 
                  icon={<Search size={16} />} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <DataTable 
              columns={[
                { key: 'vehicleNo', label: 'Vehicle No' },
                { key: 'customerName', label: 'Customer' },
                { key: 'status', label: 'Current Status', render: (val) => (
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                    val === 'Completed' ? "bg-green-100 text-green-700" : 
                    val === 'In Progress' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                  )}>{val}</span>
                )},
                { key: 'action', label: 'Update To', render: (_, row) => (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => {
                        setJobCards(jobCards.map(j => j.id === row.id ? { ...j, status: 'In Progress' } : j));
                      }}
                    >
                      In Progress
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => {
                        setJobCards(jobCards.map(j => j.id === row.id ? { ...j, status: 'Completed' } : j));
                      }}
                    >
                      Completed
                    </Button>
                  </div>
                )}
              ]}
              data={jobCards.filter(j => 
                j.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                j.customerName.toLowerCase().includes(searchQuery.toLowerCase())
              )}
            />
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Generate Service Bill</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <Select label="Select Completed Job" name="jobCardId" required>
                  <option value="">Select Vehicle</option>
                  {jobCards.filter(j => j.status === 'Completed').map(j => <option key={j.id} value={j.id}>{j.vehicleNo} - {j.customerName}</option>)}
                </Select>
                <Input name="serviceCharges" label="Service Charges" type="number" required />
                <Input name="partsCharges" label="Parts Charges" type="number" required />
                <div className="md:col-span-3 flex justify-end">
                  <Button type="submit" icon={<Receipt size={18} />}>Generate & Print Bill</Button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 px-2">Recent Bills</h3>
              <DataTable 
                columns={[
                  { key: 'vehicleNo', label: 'Vehicle No' },
                  { key: 'customerName', label: 'Customer' },
                  { key: 'date', label: 'Date', render: (val) => formatDate(val) },
                  { key: 'total', label: 'Total Amount', render: (_, row) => formatCurrency((row.serviceCharges || 0) + (row.partsCharges || 0)) },
                ]}
                data={jobCards.filter(j => j.status === 'Completed' && (j.serviceCharges || 0) > 0)}
                onPrint={(row) => window.print()}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this bill?')) {
                    setJobCards(jobCards.map(j => j.id === row.id ? { ...j, serviceCharges: 0, partsCharges: 0 } : j));
                  }
                }}
              />
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
        title={editingItem ? `Edit ${activeTab === 'jobcards' ? 'Job Card' : 'Mechanic'}` : `New ${activeTab === 'jobcards' ? 'Job Card' : 'Mechanic'} Entry`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'jobcards' && (
            <div className="grid grid-cols-2 gap-4">
            <Input name="customerName" label="Customer Name" defaultValue={editingItem?.customerName} required />
            <Input name="phone" label="Phone No" defaultValue={editingItem?.phone} required />
            <Input name="vehicleNo" label="Vehicle No" defaultValue={editingItem?.vehicleNo} required icon={<Car size={16} />} />
            <Input name="model" label="Model" defaultValue={editingItem?.model} required />
            <Input name="km" label="Current KM" type="number" defaultValue={editingItem?.km} />
            <Input name="dailyRunning" label="Daily Running (KM)" type="number" defaultValue={editingItem?.dailyRunning} placeholder="e.g. 50" />
            <div className="grid grid-cols-2 gap-2">
              <Input name="fromKm" label="From KM" type="number" defaultValue={editingItem?.fromKm} />
              <Input name="toKm" label="To KM" type="number" defaultValue={editingItem?.toKm} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Vehicle Problem</label>
              <textarea 
                name="problem"
                className="w-full mt-1.5 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px]"
                placeholder="Describe the issues..."
                defaultValue={editingItem?.problem}
              ></textarea>
            </div>
          </div>
          )}
          {activeTab === 'mechanics' && (
            <div className="grid grid-cols-1 gap-4">
              <Input name="name" label="Mechanic Name" defaultValue={editingItem?.name} required />
              <Input name="phone" label="Phone Number" defaultValue={editingItem?.phone} required />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
