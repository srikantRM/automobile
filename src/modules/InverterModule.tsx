import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  Users, 
  Truck, 
  ShoppingCart, 
  Receipt, 
  BarChart3,
  Mail,
  MessageSquare,
  Printer
} from 'lucide-react';
import { Button, Input, DataTable, Modal, Select } from '../components/UI';
import { formatCurrency, formatDate } from '../lib/utils';
import { InverterProduct, Customer, Supplier } from '../types';

interface InverterModuleProps {
  activeTab: string;
}

export const InverterModule: React.FC<InverterModuleProps> = ({ activeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock Data
  const [products, setProducts] = useState<InverterProduct[]>([
    { id: '1', name: 'Exide Invamaster', model: 'IMST1500', serialNo: 'EX123456', capacity: '150Ah', guarantee: '36 Months', gst: 18, warranty: '12 Months', extra: '', servicePeriod: 6, minQty: 5, stock: 12 },
    { id: '2', name: 'Luminous Red Charge', model: 'RC18000', serialNo: 'LM987654', capacity: '150Ah', guarantee: '42 Months', gst: 18, warranty: '18 Months', extra: '', servicePeriod: 6, minQty: 3, stock: 2 },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: 'John Doe', phone: '9876543210', address: '123 Main St, City' },
    { id: '2', name: 'Jane Smith', phone: '8765432109', address: '456 Oak Ave, Town' },
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: '1', name: 'Battery World', address: 'Industrial Area', contactNo: '7654321098', gstNo: '29ABCDE1234F1Z5', city: 'Bangalore', state: 'Karnataka', email: 'info@batteryworld.com', balance: 5000 },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save based on activeTab
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const simulateSend = (type: 'Email' | 'WhatsApp', row: any) => {
    alert(`Simulating sending ${type} to ${row.name || row.customerName || 'recipient'}...`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Product Inventory</h3>
              <Button icon={<Plus size={18} />} onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>Add New Product</Button>
            </div>
            <DataTable 
              columns={[
                { key: 'name', label: 'Product Name' },
                { key: 'model', label: 'Model' },
                { key: 'serialNo', label: 'Serial No' },
                { key: 'capacity', label: 'Capacity' },
                { key: 'stock', label: 'Stock', render: (val) => (
                  <span className={cn("font-bold", val < 5 ? "text-red-600" : "text-green-600")}>{val}</span>
                )},
                { key: 'minQty', label: 'Min Qty' },
              ]}
              data={products}
              onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
              onDelete={(row) => console.log('Delete', row)}
              onPrint={(row) => window.print()}
            />
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Customer Database</h3>
              <Button icon={<Plus size={18} />} onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>Add Customer</Button>
            </div>
            <DataTable 
              columns={[
                { key: 'name', label: 'Customer Name' },
                { key: 'phone', label: 'Phone No' },
                { key: 'address', label: 'Address' },
              ]}
              data={customers}
              onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
              onDelete={(row) => console.log('Delete', row)}
            />
          </div>
        );
      case 'suppliers':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Supplier Directory</h3>
              <Button icon={<Plus size={18} />} onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>Add Supplier</Button>
            </div>
            <DataTable 
              columns={[
                { key: 'name', label: 'Supplier Name' },
                { key: 'contactNo', label: 'Contact No' },
                { key: 'gstNo', label: 'GST Number' },
                { key: 'city', label: 'City' },
              ]}
              data={suppliers}
              onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
              onDelete={(row) => console.log('Delete', row)}
            />
          </div>
        );
      case 'sales':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Sales Invoice</h3>
              <form className="space-y-4">
                <Input label="Invoice No" defaultValue="INV-001" disabled />
                <Input label="Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                <Select label="Select Customer">
                  <option>Select Customer</option>
                  {customers.map(c => <option key={c.id}>{c.name}</option>)}
                </Select>
                <Select label="Select Product">
                  <option>Select Product</option>
                  {products.map(p => <option key={p.id}>{p.name} ({p.stock} in stock)</option>)}
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Quantity" type="number" />
                  <Input label="Rate" type="number" />
                </div>
                <Select label="Payment Mode">
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Credit</option>
                </Select>
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST (18%)</span>
                    <span className="font-bold">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-primary">₹0.00</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Button className="w-full">Save & Print</Button>
                  <Button variant="secondary" className="w-full">Reset</Button>
                </div>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-6">
               <DataTable 
                title="Recent Sales"
                columns={[
                  { key: 'invoiceNo', label: 'Invoice' },
                  { key: 'date', label: 'Date' },
                  { key: 'customer', label: 'Customer' },
                  { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
                  { key: 'actions', label: 'Send', render: (_, row) => (
                    <div className="flex gap-2">
                      <button onClick={() => simulateSend('Email', row)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="Send Email"><Mail size={14} /></button>
                      <button onClick={() => simulateSend('WhatsApp', row)} className="p-1.5 text-green-500 hover:bg-green-50 rounded" title="Send WhatsApp"><MessageSquare size={14} /></button>
                    </div>
                  )},
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Paid</span>
                  )}
                ]}
                data={[
                  { invoiceNo: 'INV-001', date: '2024-03-27', customer: 'John Doe', total: 15600, status: 'Paid' }
                ]}
                onPrint={() => window.print()}
              />
            </div>
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
        title={editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}
      >
        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'products' && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Product Name" required />
              <Input label="Model" required />
              <Input label="Serial No" />
              <Input label="Capacity" placeholder="e.g. 150Ah" />
              <Input label="Guarantee" placeholder="e.g. 36 Months" />
              <Input label="GST (%)" type="number" defaultValue={18} />
              <Input label="Warranty" />
              <Input label="Service Period (Months)" type="number" />
              <Input label="Minimum Quantity" type="number" />
              <Input label="Extra Info" className="col-span-2" />
            </div>
          )}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <Input label="Customer Name" required />
              <Input label="Phone No" required />
              <Input label="Address" />
            </div>
          )}
          {activeTab === 'suppliers' && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Supplier Name" required />
              <Input label="Email ID" type="email" />
              <Input label="Contact No" required />
              <Input label="GST Number" />
              <Input label="City" />
              <Input label="State" />
              <Input label="Address" className="col-span-2" />
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

import { cn } from '../lib/utils';
