import React, { useState } from 'react';
import { 
  Plus, 
  Book, 
  PieChart, 
  Scale, 
  Layers, 
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';
import { Button, Input, DataTable, Modal, Select } from '../components/UI';
import { formatCurrency, formatDate } from '../lib/utils';

interface AccountsModuleProps {
  activeTab: string;
}

export const AccountsModule: React.FC<AccountsModuleProps> = ({ activeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'cashbook':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Total Inflow</p>
                <h4 className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(45000)}</h4>
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Total Outflow</p>
                <h4 className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(12000)}</h4>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Closing Balance</p>
                <h4 className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(33000)}</h4>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Cash Transactions</h3>
              <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>New Entry</Button>
            </div>
            <DataTable 
              columns={[
                { key: 'date', label: 'Date', render: (val) => formatDate(val) },
                { key: 'description', label: 'Description' },
                { key: 'type', label: 'Type', render: (val) => (
                  <span className={cn(
                    "flex items-center gap-1 font-bold",
                    val === 'Credit' ? "text-green-600" : "text-red-600"
                  )}>
                    {val === 'Credit' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {val}
                  </span>
                )},
                { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val) },
              ]}
              data={[
                { date: '2024-03-27', description: 'Battery Sale - INV-001', type: 'Credit', amount: 15600 },
                { date: '2024-03-27', description: 'Office Rent', type: 'Debit', amount: 8000 },
                { date: '2024-03-26', description: 'Service Charge - Job #1', type: 'Credit', amount: 1200 },
              ]}
            />
          </div>
        );
      case 'pl':
        return (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-4xl mx-auto space-y-8">
            <div className="text-center border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Profit & Loss Account</h2>
              <p className="text-sm text-gray-500">For the period ending March 2024</p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest border-b pb-2">Expenses</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span>Cost of Goods Sold</span><span className="font-medium">₹85,000.00</span></div>
                  <div className="flex justify-between text-sm"><span>Salaries & Wages</span><span className="font-medium">₹25,000.00</span></div>
                  <div className="flex justify-between text-sm"><span>Rent & Utilities</span><span className="font-medium">₹12,000.00</span></div>
                  <div className="flex justify-between text-sm"><span>Marketing</span><span className="font-medium">₹5,000.00</span></div>
                  <div className="pt-4 border-t flex justify-between font-bold text-gray-800"><span>Total Expenses</span><span>₹1,27,000.00</span></div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest border-b pb-2">Income</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span>Sales Revenue</span><span className="font-medium">₹1,85,000.00</span></div>
                  <div className="flex justify-between text-sm"><span>Service Revenue</span><span className="font-medium">₹22,000.00</span></div>
                  <div className="flex justify-between text-sm"><span>Other Income</span><span className="font-medium">₹1,500.00</span></div>
                  <div className="pt-4 border-t flex justify-between font-bold text-gray-800"><span>Total Income</span><span>₹2,08,500.00</span></div>
                </div>
              </div>
            </div>
            <div className="bg-primary p-6 rounded-xl flex justify-between items-center text-white">
              <span className="text-lg font-bold uppercase tracking-wider">Net Profit</span>
              <span className="text-3xl font-bold">₹81,500.00</span>
            </div>
            <div className="flex justify-center gap-4">
              <Button icon={<Printer size={18} />}>Print Statement</Button>
              <Button variant="secondary" icon={<FileText size={18} />}>Export PDF</Button>
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
        title="New Cash Transaction"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            <Select label="Account Head">
              <option>Sales Income</option>
              <option>Service Income</option>
              <option>Purchase Expense</option>
              <option>Rent Expense</option>
              <option>Salary Expense</option>
            </Select>
            <Input label="Amount" type="number" required />
            <Select label="Transaction Type">
              <option>Credit (Inflow)</option>
              <option>Debit (Outflow)</option>
            </Select>
            <Input label="Description" className="col-span-2" placeholder="Enter transaction details..." />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Transaction</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import { cn } from '../lib/utils';
import { Printer } from 'lucide-react';
