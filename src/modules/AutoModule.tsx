import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  ShoppingCart, 
  Receipt, 
  CreditCard,
  BarChart3,
  Truck,
  Scan,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Button, Input, DataTable, Modal, Select } from '../components/UI';
import { formatCurrency } from '../lib/utils';
import { AutoProduct, Supplier } from '../types';

interface AutoModuleProps {
  activeTab: string;
}

export const AutoModule: React.FC<AutoModuleProps> = ({ activeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [products, setProducts] = useState<AutoProduct[]>([
    { id: '1', barcode: '8901234567', hsnCode: '8708', name: 'Brake Pad', company: 'Bosch', model: 'Swift', partNo: 'BP-123', lowQty: 10, gst: 18, rackNo: 'A-12', purchaseRate: 850, mrp: 1250, stock: 45 },
    { id: '2', barcode: '8907654321', hsnCode: '8708', name: 'Oil Filter', company: 'Purolator', model: 'i20', partNo: 'OF-99', lowQty: 20, gst: 12, rackNo: 'B-05', purchaseRate: 180, mrp: 350, stock: 8 },
  ]);

  const simulateSend = (type: 'Email' | 'WhatsApp', row: any) => {
    alert(`Simulating sending ${type} to ${row.supplier || 'supplier'}...`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Auto Parts Inventory</h3>
              <Button icon={<Plus size={18} />} onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>Add New Part</Button>
            </div>
            <DataTable 
              columns={[
                { key: 'name', label: 'Product Name' },
                { key: 'company', label: 'Company' },
                { key: 'model', label: 'Model' },
                { key: 'partNo', label: 'Part No' },
                { key: 'stock', label: 'Stock', render: (val, row) => (
                  <span className={cn("font-bold", val < row.lowQty ? "text-red-600" : "text-green-600")}>{val}</span>
                )},
                { key: 'mrp', label: 'MRP', render: (val) => formatCurrency(val) },
              ]}
              data={products}
              onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
              onDelete={(row) => console.log('Delete', row)}
            />
          </div>
        );
      case 'search':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Input label="Search by Name / Part No" icon={<Search size={16} />} />
              </div>
              <div className="w-48">
                <Select label="Company">
                  <option>All Companies</option>
                  <option>Bosch</option>
                  <option>Purolator</option>
                </Select>
              </div>
              <div className="w-48">
                <Select label="Model">
                  <option>All Models</option>
                  <option>Swift</option>
                  <option>i20</option>
                </Select>
              </div>
              <Button icon={<Search size={18} />}>Search</Button>
            </div>
            <DataTable 
              title="Search Results"
              columns={[
                { key: 'barcode', label: 'Barcode' },
                { key: 'name', label: 'Product' },
                { key: 'partNo', label: 'Part No' },
                { key: 'rackNo', label: 'Rack' },
                { key: 'stock', label: 'Stock' },
                { key: 'mrp', label: 'MRP', render: (val) => formatCurrency(val) },
              ]}
              data={products}
            />
          </div>
        );
      case 'payments':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-4">Supplier Payment</h3>
                <Select label="Select Supplier">
                  <option>Select Supplier</option>
                  <option>Battery World</option>
                </Select>
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Outstanding Balance</span>
                    <span className="font-bold text-red-600">₹5,000.00</span>
                  </div>
                </div>
                <Input label="Amount to Pay" type="number" />
                <Select label="Payment Mode">
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Cheque</option>
                </Select>
                <Input label="Reference / Cheque No" />
                <Button className="w-full">Process Payment</Button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <DataTable 
                title="Recent Payments"
                columns={[
                  { key: 'date', label: 'Date' },
                  { key: 'supplier', label: 'Supplier' },
                  { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val) },
                  { key: 'actions', label: 'Send', render: (_, row) => (
                    <div className="flex gap-2">
                      <button onClick={() => simulateSend('Email', row)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="Send Email"><Mail size={14} /></button>
                      <button onClick={() => simulateSend('WhatsApp', row)} className="p-1.5 text-green-500 hover:bg-green-50 rounded" title="Send WhatsApp"><MessageSquare size={14} /></button>
                    </div>
                  )},
                  { key: 'mode', label: 'Mode' },
                  { key: 'ref', label: 'Reference' },
                ]}
                data={[
                  { date: '2024-03-26', supplier: 'Battery World', amount: 2000, mode: 'UPI', ref: 'TXN12345' }
                ]}
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
        title={editingItem ? "Edit Product" : "Add New Auto Part"}
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex gap-2">
              <Input label="Barcode" required />
              <Button variant="secondary" className="mt-6" icon={<Scan size={18} />}>Scan</Button>
            </div>
            <Input label="HSN Code" />
            <Input label="Product Name" required />
            <Input label="Company" required />
            <Input label="Model" required />
            <Input label="Part No" />
            <Input label="Rack No" />
            <Input label="Low Quantity Alert" type="number" />
            <Input label="GST (%)" type="number" defaultValue={18} />
            <Input label="Purchase Rate" type="number" />
            <Input label="MRP" type="number" />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import { cn } from '../lib/utils';
