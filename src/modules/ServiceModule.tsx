import React, { useState, useEffect } from 'react';
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
  Car,
  X
} from 'lucide-react';
import { Button, Input, DataTable, Modal, Select } from '../components/UI';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { JobCard, Mechanic } from '../types';
import { useData } from '../hooks/useData';

interface ServiceModuleProps {
  activeTab: string;
}

export const ServiceModule: React.FC<ServiceModuleProps> = ({ activeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: jobCards, saveData: saveJobCard, updateData: updateJobCard, deleteData: deleteJobCard } = useData<JobCard>('job_cards');
  const { data: mechanics, saveData: saveMechanic, updateData: updateMechanic, deleteData: deleteMechanic } = useData<Mechanic>('mechanics');
  const { data: sales, saveData: saveSale } = useData<any>('sales');

  const [selectedJobCardForUpdate, setSelectedJobCardForUpdate] = useState<JobCard | null>(null);
  const [selectedJobCardForBilling, setSelectedJobCardForBilling] = useState<JobCard | null>(null);
  const [selectedJobCardForAssign, setSelectedJobCardForAssign] = useState<JobCard | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Controlled inputs for mechanic panel
  const [mechanicCharges, setMechanicCharges] = useState({ service: 0, parts: 0, label: '' });
  const [showAdditional, setShowAdditional] = useState(false);

  useEffect(() => {
    if (selectedJobCardForUpdate) {
      const hasAdditional = (selectedJobCardForUpdate.partsCharges || 0) > 0;
      setMechanicCharges({
        service: selectedJobCardForUpdate.serviceCharges || 0,
        parts: selectedJobCardForUpdate.partsCharges || 0,
        label: selectedJobCardForUpdate.additionalChargesLabel || ''
      });
      setShowAdditional(hasAdditional);
    }
  }, [selectedJobCardForUpdate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      if (activeTab === 'jobcards') {
        if (editingItem) {
          await updateJobCard(editingItem.id, { ...editingItem, ...data } as JobCard);
        } else {
          const nextNo = jobCards.length > 0 ? Math.max(...jobCards.map(j => j.jobCardNo || 0)) + 1 : 1;
          const newJobCard: JobCard = {
            id: Math.random().toString(36).substr(2, 9),
            jobCardNo: nextNo,
            customerName: data.customerName as string,
            phone: data.phone as string,
            vehicleNo: data.vehicleNo as string,
            vehicleModel: data.vehicleModel as string,
            kmReading: Number(data.kmReading),
            problemDescription: data.problemDescription as string,
            paymentType: data.paymentType as any || 'Cash',
            status: 'In Process',
            serviceCharges: 0,
            partsCharges: 0,
            totalAmount: 0,
            date: new Date().toISOString().split('T')[0],
          };
          await saveJobCard(newJobCard);
        }
      } else if (activeTab === 'mechanics') {
        if (editingItem) {
          await updateMechanic(editingItem.id, { ...editingItem, ...data } as Mechanic);
        } else {
          const newMechanic: Mechanic = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name as string,
            phone: data.phone as string,
          };
          await saveMechanic(newMechanic);
        }
      } else if (activeTab === 'assign') {
        if (selectedJobCardForAssign) {
          await updateJobCard(selectedJobCardForAssign.id, { 
            ...selectedJobCardForAssign, 
            mechanicId: data.mechanicId as string 
          });
          setSelectedJobCardForAssign(null);
        }
      } else if (activeTab === 'status') {
        if (selectedJobCardForUpdate) {
          const serviceCharges = Number(data.serviceCharges) || 0;
          const partsCharges = Number(data.partsCharges) || 0;
          const additionalChargesLabel = data.additionalChargesLabel as string || 'Additional Charges';
          const totalAmount = serviceCharges + partsCharges;
          
          await updateJobCard(selectedJobCardForUpdate.id, { 
            ...selectedJobCardForUpdate, 
            workStatus: data.workStatus as string,
            serviceCharges,
            partsCharges,
            additionalChargesLabel,
            totalAmount,
            status: data.status as any || selectedJobCardForUpdate.status
          });
          setSelectedJobCardForUpdate(null);
        }
      } else if (activeTab === 'billing') {
        if (selectedJobCardForBilling) {
          // Save as a sale in the automobiles module too if needed, 
          // but the user wants "Final Bill Generation" here.
          const newSale = {
            id: Math.random().toString(36).substr(2, 9),
            invoiceNo: `SB-${selectedJobCardForBilling.jobCardNo}`,
            date: new Date().toISOString().split('T')[0],
            customer: selectedJobCardForBilling.customerName,
            phone: selectedJobCardForBilling.phone,
            vehicleNo: selectedJobCardForBilling.vehicleNo,
            jobCardNo: selectedJobCardForBilling.jobCardNo,
            total: selectedJobCardForBilling.totalAmount,
            status: 'Paid',
            paymentType: data.paymentType as string,
            source: 'Job Card'
          };
          await saveSale(newSale);
          
          // Mark job card as completed if not already
          await updateJobCard(selectedJobCardForBilling.id, { ...selectedJobCardForBilling, status: 'Completed' });
          setSelectedJobCardForBilling(null);
        }
      }

      (e.target as HTMLFormElement).reset();
      alert('Data saved successfully!');
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'jobcards':
        const filteredJobCards = jobCards.filter(j => 
          j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.jobCardNo?.toString().includes(searchQuery)
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Create New Job Card</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <Input label="Job Card No" value={jobCards.length > 0 ? Math.max(...jobCards.map(j => j.jobCardNo || 0)) + 1 : 1} disabled />
                <Input name="customerName" label="Customer Name" required />
                <Input name="phone" label="Phone No" required />
                <Input name="vehicleNo" label="Vehicle No" required icon={<Car size={16} />} />
                <Input name="vehicleModel" label="Vehicle Model" required />
                <Input name="kmReading" label="KM Reading" type="number" required />
                <div className="md:col-span-4">
                  <label className="text-xs font-bold text-gray-500 uppercase">Problem Description</label>
                  <textarea 
                    name="problemDescription"
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
                <h3 className="text-xl font-bold text-gray-800">Job Cards History</h3>
                <div className="w-full md:w-64">
                  <Input 
                    placeholder="Search by No, Name, Vehicle..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <DataTable 
                columns={[
                  { key: 'jobCardNo', label: 'Job Card No' },
                  { key: 'customerName', label: 'Customer' },
                  { key: 'vehicleNo', label: 'Vehicle No' },
                  { key: 'mechanicId', label: 'Mechanic', render: (val) => mechanics.find(m => m.id === val)?.name || 'Not Assigned' },
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                      val === 'Completed' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>{val}</span>
                  )},
                  { key: 'date', label: 'Date', render: (val) => formatDate(val) },
                ]}
                data={filteredJobCards}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this job card?')) {
                    deleteJobCard(row.id);
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );
      case 'assign':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-gray-800">Assign Mechanic to Job Card</h3>
              <div className="w-64">
                <Input 
                  placeholder="Search job card..." 
                  icon={<Search size={16} />} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {selectedJobCardForAssign ? (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-bold text-gray-800">Assign Mechanic for Job Card #{selectedJobCardForAssign.jobCardNo}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedJobCardForAssign(null)}>Cancel</Button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Customer: <span className="text-gray-800">{selectedJobCardForAssign.customerName}</span></p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Vehicle: <span className="text-gray-800">{selectedJobCardForAssign.vehicleNo}</span></p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Problem: <span className="text-gray-800 italic normal-case">{selectedJobCardForAssign.problemDescription}</span></p>
                  </div>
                  <Select label="Select Mechanic" name="mechanicId" required defaultValue={selectedJobCardForAssign.mechanicId}>
                    <option value="">Choose a mechanic...</option>
                    {mechanics.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </Select>
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit">Assign Mechanic</Button>
                  </div>
                </form>
              </div>
            ) : (
              <DataTable 
                columns={[
                  { key: 'jobCardNo', label: 'No' },
                  { key: 'vehicleNo', label: 'Vehicle No' },
                  { key: 'customerName', label: 'Customer' },
                  { key: 'mechanicId', label: 'Mechanic', render: (val) => mechanics.find(m => m.id === val)?.name || 'Not Assigned' },
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                      val === 'Completed' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>{val}</span>
                  )},
                  { key: 'action', label: 'Action', render: (_, row) => (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedJobCardForAssign(row)}
                      disabled={row.status === 'Completed'}
                    >
                      {row.mechanicId ? 'Change Mechanic' : 'Assign Mechanic'}
                    </Button>
                  )}
                ]}
                data={jobCards.filter(j => 
                  j.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  j.jobCardNo?.toString().includes(searchQuery)
                )}
              />
            )}
          </div>
        );
      case 'mechanics':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-gray-800">Mechanic Master</h3>
              <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} icon={<Plus size={18} />}>Add Mechanic</Button>
            </div>
            <DataTable 
              columns={[
                { key: 'name', label: 'Mechanic Name' },
                { key: 'phone', label: 'Phone Number' },
              ]}
              data={mechanics.filter(m => 
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.phone.includes(searchQuery)
              )}
              onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
              onDelete={(row) => {
                if (confirm('Are you sure you want to delete this mechanic?')) {
                  deleteMechanic(row.id);
                }
              }}
            />
          </div>
        );
      case 'status':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-gray-800">Vehicle Status Update (Mechanic Panel)</h3>
              <div className="w-64">
                <Input 
                  placeholder="Search vehicle..." 
                  icon={<Search size={16} />} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {selectedJobCardForUpdate ? (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-bold text-gray-800">Update Job Card #{selectedJobCardForUpdate.jobCardNo}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedJobCardForUpdate(null)}>Cancel</Button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Customer</p><p className="font-bold">{selectedJobCardForUpdate.customerName}</p></div>
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Vehicle</p><p className="font-bold">{selectedJobCardForUpdate.vehicleNo}</p></div>
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Model</p><p className="font-bold">{selectedJobCardForUpdate.vehicleModel}</p></div>
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Problem</p><p className="text-sm italic">{selectedJobCardForUpdate.problemDescription}</p></div>
                  </div>
                  
                  <Input label="Work Status" name="workStatus" defaultValue={selectedJobCardForUpdate.workStatus} placeholder="Ex: Engine work in progress" required />
                  <Input 
                    label="Service Charges" 
                    name="serviceCharges" 
                    type="number" 
                    value={mechanicCharges.service} 
                    onChange={(e) => setMechanicCharges(prev => ({ ...prev, service: Number(e.target.value) }))}
                    required 
                  />
                  
                  {!showAdditional ? (
                    <div className="flex items-end pb-1">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        icon={<Plus size={14} />}
                        onClick={() => setShowAdditional(true)}
                        className="text-[10px] h-10 border-dashed border-gray-300 text-gray-500 hover:text-primary hover:border-primary w-full"
                      >
                        Add Additional Charges
                      </Button>
                      <input type="hidden" name="partsCharges" value="0" />
                    </div>
                  ) : (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-200">
                      <div className="flex justify-between items-center">
                        <input 
                          className="text-xs font-bold text-gray-500 uppercase bg-transparent border-none outline-none focus:ring-0 w-full"
                          name="additionalChargesLabel"
                          value={mechanicCharges.label}
                          onChange={(e) => setMechanicCharges(prev => ({ ...prev, label: e.target.value }))}
                          placeholder="Enter Charge Name (e.g. Parts)"
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowAdditional(false);
                            setMechanicCharges(prev => ({ ...prev, parts: 0 }));
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <Input 
                        name="partsCharges" 
                        type="number" 
                        value={mechanicCharges.parts} 
                        onChange={(e) => setMechanicCharges(prev => ({ ...prev, parts: Number(e.target.value) }))}
                        required 
                      />
                    </div>
                  )}
                  
                  <Select label="Update Overall Status" name="status" defaultValue={selectedJobCardForUpdate.status}>
                    <option value="In Process">In Process</option>
                    <option value="Completed">Completed</option>
                  </Select>
                  
                  <div className="md:col-span-3 flex justify-between items-center pt-4 border-t">
                    <div className="text-lg font-bold text-primary">
                      Total Amount: {formatCurrency(mechanicCharges.service + mechanicCharges.parts)}
                    </div>
                    <Button type="submit">Update Job Card</Button>
                  </div>
                </form>
              </div>
            ) : (
              <DataTable 
                columns={[
                  { key: 'jobCardNo', label: 'No' },
                  { key: 'vehicleNo', label: 'Vehicle No' },
                  { key: 'customerName', label: 'Customer' },
                  { key: 'status', label: 'Current Status', render: (val) => (
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                      val === 'Completed' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>{val}</span>
                  )},
                  { key: 'action', label: 'Action', render: (_, row) => (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => setSelectedJobCardForUpdate(row)}
                    >
                      Update Status / Charges
                    </Button>
                  )}
                ]}
                data={jobCards.filter(j => 
                  j.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  j.jobCardNo?.toString().includes(searchQuery)
                )}
              />
            )}
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-8">
            {selectedJobCardForBilling ? (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-bold text-gray-800">Generate Final Bill for Job Card #{selectedJobCardForBilling.jobCardNo}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedJobCardForBilling(null)}>Cancel</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                      <div className="flex justify-between"><span className="text-gray-500">Customer:</span> <span className="font-bold">{selectedJobCardForBilling.customerName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Vehicle No:</span> <span className="font-bold">{selectedJobCardForBilling.vehicleNo}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Phone:</span> <span className="font-bold">{selectedJobCardForBilling.phone}</span></div>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">Service Charges:</span> <span className="font-bold">{formatCurrency(selectedJobCardForBilling.serviceCharges)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">{selectedJobCardForBilling.additionalChargesLabel || 'Parts Charges'}:</span> <span className="font-bold">{formatCurrency(selectedJobCardForBilling.partsCharges)}</span></div>
                      <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-primary/10">
                        <span>Total Amount:</span> 
                        <span>{formatCurrency(selectedJobCardForBilling.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Select label="Payment Option" name="paymentType" required>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI / GPay / PhonePe</option>
                    </Select>
                    <div className="pt-4">
                      <Button type="submit" className="w-full h-12 text-lg" icon={<Receipt size={20} />}>Save & Print Final Bill</Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-bold text-gray-800">Final Bill Generation</h3>
                  <p className="text-xs text-gray-500 italic">Only in-process job cards are eligible for billing</p>
                </div>
                <DataTable 
                  columns={[
                    { key: 'jobCardNo', label: 'No' },
                    { key: 'vehicleNo', label: 'Vehicle No' },
                    { key: 'customerName', label: 'Customer' },
                    { key: 'totalAmount', label: 'Total', render: (val) => formatCurrency(val) },
                    { key: 'action', label: 'Action', render: (_, row) => (
                      <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => setSelectedJobCardForBilling(row)}
                      >
                        Generate Bill
                      </Button>
                    )}
                  ]}
                  data={jobCards.filter(j => j.status === 'In Process')}
                />
              </div>
            )}
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
            <Input name="vehicleModel" label="Vehicle Model" defaultValue={editingItem?.vehicleModel} required />
            <Input name="kmReading" label="KM Reading" type="number" defaultValue={editingItem?.kmReading} />
            <Select label="Payment Type" name="paymentType" defaultValue={editingItem?.paymentType}>
              <option value="Cash">Cash</option>
              <option value="Credit">Credit</option>
              <option value="UPI">UPI / PhonePe / Google Pay</option>
            </Select>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Problem Description</label>
              <textarea 
                name="problemDescription"
                className="w-full mt-1.5 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px]"
                placeholder="Describe the issues..."
                defaultValue={editingItem?.problemDescription}
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
