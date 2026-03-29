import React, { useState } from 'react';
import { 
  Plus, 
  Search,
  Book, 
  PieChart, 
  Scale, 
  Layers, 
  FileText,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';
import { Button, Input, DataTable, Modal, Select } from '../components/UI';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { Transaction } from '../types';

interface AccountsModuleProps {
  activeTab: string;
}

export const AccountsModule: React.FC<AccountsModuleProps> = ({ activeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (editingItem) {
      setTransactions(transactions.map(t => t.id === editingItem.id ? {
        ...t,
        date: data.date as string,
        headId: data.headId as string,
        amount: Number(data.amount),
        type: data.type === 'Credit (Inflow)' ? 'Credit' : 'Debit',
        description: data.description as string,
      } as Transaction : t));
    } else {
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        date: data.date as string,
        headId: data.headId as string,
        amount: Number(data.amount),
        type: data.type === 'Credit (Inflow)' ? 'Credit' : 'Debit',
        description: data.description as string,
      };
      setTransactions([newTransaction, ...transactions]);
    }

    (e.target as HTMLFormElement).reset();
    alert('Transaction recorded successfully!');
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'cashbook':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Total Inflow</p>
                <h4 className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(transactions.filter(t => t.type === 'Credit').reduce((acc, t) => acc + t.amount, 0))}</h4>
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Total Outflow</p>
                <h4 className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(transactions.filter(t => t.type === 'Debit').reduce((acc, t) => acc + t.amount, 0))}</h4>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Closing Balance</p>
                <h4 className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(transactions.filter(t => t.type === 'Credit').reduce((acc, t) => acc + t.amount, 0) - transactions.filter(t => t.type === 'Debit').reduce((acc, t) => acc + t.amount, 0))}</h4>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Transaction Entry</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <Input name="date" label="Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                <Select name="headId" label="Account Head" required>
                  <option value="">Select Head</option>
                  <option value="Sales">Sales</option>
                  <option value="Service">Service</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Rent">Rent</option>
                  <option value="Salary">Salary</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Other">Other</option>
                </Select>
                <Input name="amount" label="Amount" type="number" required />
                <Select name="type" label="Transaction Type" required>
                  <option value="Credit (Inflow)">Credit (Inflow)</option>
                  <option value="Debit (Outflow)">Debit (Outflow)</option>
                </Select>
                <div className="md:col-span-3">
                  <Input name="description" label="Description" placeholder="Enter details..." required />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" icon={<Plus size={18} />}>Record Entry</Button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <h3 className="text-xl font-bold text-gray-800">Cash Transactions</h3>
                <div className="w-full md:w-64">
                  <Input 
                    placeholder="Search transactions..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
                data={transactions.filter(t => 
                  t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  t.headId.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this entry?')) {
                    setTransactions(transactions.filter(t => t.id !== row.id));
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
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
      case 'balance':
        return (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-4xl mx-auto space-y-8">
            <div className="text-center border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Balance Sheet</h2>
              <p className="text-sm text-gray-500">As on March 31, 2024</p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest border-b pb-2">Liabilities</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span>Capital Account</span><span className="font-medium">₹5,00,000.00</span></div>
                  <div className="flex justify-between text-sm"><span>Loans (Liability)</span><span className="font-medium">₹2,50,000.00</span></div>
                  <div className="flex justify-between text-sm"><span>Current Liabilities</span><span className="font-medium">₹1,20,000.00</span></div>
                  <div className="flex justify-between text-sm"><span>Profit for the Year</span><span className="font-medium">₹81,500.00</span></div>
                  <div className="pt-4 border-t flex justify-between font-bold text-gray-800"><span>Total Liabilities</span><span>₹9,51,500.00</span></div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest border-b pb-2">Assets</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span>Fixed Assets</span><span className="font-medium">₹4,20,000.00</span></div>
                  <div className="flex justify-between text-sm"><span>Current Assets</span><span className="font-medium">₹3,80,000.00</span></div>
                  <div className="flex justify-between text-sm"><span>Cash-in-hand</span><span className="font-medium">₹1,51,500.00</span></div>
                  <div className="pt-4 border-t flex justify-between font-bold text-gray-800"><span>Total Assets</span><span>₹9,51,500.00</span></div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button icon={<Printer size={18} />}>Print Sheet</Button>
              <Button variant="secondary" icon={<FileText size={18} />}>Export PDF</Button>
            </div>
          </div>
        );
      case 'ledger':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-gray-800">General Ledger</h3>
              <div className="flex gap-4">
                <Select className="w-48">
                  <option>All Accounts</option>
                  <option>Sales Income</option>
                  <option>Service Income</option>
                  <option>Purchase Expense</option>
                </Select>
                <div className="w-64">
                  <Input 
                    placeholder="Search ledger..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DataTable 
              columns={[
                { key: 'date', label: 'Date', render: (val) => formatDate(val) },
                { key: 'headId', label: 'Account Head' },
                { key: 'description', label: 'Description' },
                { key: 'debit', label: 'Debit', render: (_, row) => row.type === 'Debit' ? formatCurrency(row.amount) : '-' },
                { key: 'credit', label: 'Credit', render: (_, row) => row.type === 'Credit' ? formatCurrency(row.amount) : '-' },
                { key: 'balance', label: 'Balance', render: (_, row, index) => {
                  const prevBalance = transactions.slice(index + 1).reduce((acc, t) => acc + (t.type === 'Credit' ? t.amount : -t.amount), 0);
                  return formatCurrency(prevBalance + (row.type === 'Credit' ? row.amount : -row.amount));
                }},
              ]}
              data={transactions.filter(t => 
                t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.headId.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              onPrint={(row) => window.print()}
            />
          </div>
        );
      case 'heads':
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Add Account Head</h3>
              <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <Input label="Head Name" placeholder="e.g. Office Rent" required />
                <Select label="Head Type" required>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                </Select>
                <div className="flex justify-end">
                  <Button type="button" icon={<Plus size={18} />}>Add Head</Button>
                </div>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 px-2">Account Heads List</h3>
              <DataTable 
                columns={[
                  { key: 'name', label: 'Head Name' },
                  { key: 'type', label: 'Type' },
                  { key: 'balance', label: 'Current Balance', render: () => formatCurrency(0) },
                ]}
                data={[
                  { id: '1', name: 'Sales Income', type: 'Income' },
                  { id: '2', name: 'Service Income', type: 'Income' },
                  { id: '3', name: 'Purchase Expense', type: 'Expense' },
                  { id: '4', name: 'Rent Expense', type: 'Expense' },
                  { id: '5', name: 'Salary Expense', type: 'Expense' },
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
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }} 
        title={editingItem ? "Edit Transaction" : "New Cash Transaction"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input name="date" label="Date" type="date" defaultValue={editingItem?.date || new Date().toISOString().split('T')[0]} required />
            <Select name="headId" label="Account Head" defaultValue={editingItem?.headId} required>
              <option value="">Select Head</option>
              <option value="Sales Income">Sales Income</option>
              <option value="Service Income">Service Income</option>
              <option value="Purchase Expense">Purchase Expense</option>
              <option value="Rent Expense">Rent Expense</option>
              <option value="Salary Expense">Salary Expense</option>
              <option value="Other">Other</option>
            </Select>
            <Input name="amount" label="Amount" type="number" defaultValue={editingItem?.amount} required />
            <Select name="type" label="Transaction Type" defaultValue={editingItem?.type === 'Credit' ? 'Credit (Inflow)' : 'Debit (Outflow)'} required>
              <option value="Credit (Inflow)">Credit (Inflow)</option>
              <option value="Debit (Outflow)">Debit (Outflow)</option>
            </Select>
            <div className="col-span-2">
              <Input name="description" label="Description" defaultValue={editingItem?.description} placeholder="Enter transaction details..." required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingItem(null); }}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
