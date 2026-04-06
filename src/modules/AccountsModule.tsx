import React, { useState, useMemo } from 'react';
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
  Wallet,
  Receipt,
  CreditCard,
  Banknote,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input, DataTable, Modal, Select } from '../components/UI';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { Transaction, AccountHead } from '../types';
import { useData } from '../hooks/useData';

interface AccountsModuleProps {
  activeTab: string;
}

export const AccountsModule: React.FC<AccountsModuleProps> = ({ activeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLedgerHead, setSelectedLedgerHead] = useState<string>('');

  const { data: transactions, saveData: saveTransaction, updateData: updateTransaction, deleteData: deleteTransaction } = useData<Transaction>('transactions');
  const { data: accountHeads, saveData: saveAccountHead, deleteData: deleteAccountHead } = useData<AccountHead>('account_heads');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      const voucherType = data.voucherType as any;
      const amount = Number(data.amount);
      
      // Determine Debit/Credit based on voucher type
      // Receipt: Credit the Income/Asset head, Debit Cash/Bank
      // Payment: Debit the Expense/Liability head, Credit Cash/Bank
      // For simplicity in this flat structure, we store the main head and its type
      let type: 'Debit' | 'Credit' = 'Debit';
      if (voucherType === 'Receipt') type = 'Credit';
      else if (voucherType === 'Payment') type = 'Debit';
      else if (voucherType === 'Contra') {
        // Contra is special, but let's treat it as a transfer
        type = data.contraType === 'Deposit' ? 'Debit' : 'Credit';
      }

      if (editingItem) {
        await updateTransaction(editingItem.id, {
          ...editingItem,
          date: data.date as string,
          headId: data.headId as string,
          amount,
          type,
          voucherType,
          paymentMode: data.paymentMode as any,
          description: data.description as string,
          referenceNo: data.referenceNo as string,
        } as Transaction);
      } else {
        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          date: data.date as string,
          headId: data.headId as string,
          amount,
          type,
          voucherType,
          paymentMode: data.paymentMode as any,
          description: data.description as string,
          referenceNo: data.referenceNo as string,
        };
        await saveTransaction(newTransaction);
      }

      setIsModalOpen(false);
      setEditingItem(null);
      toast.success('Transaction saved successfully!');
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Failed to save transaction.');
    }
  };

  const stats = useMemo(() => {
    const cashIn = transactions.filter(t => t.paymentMode === 'Cash' && t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0);
    const cashOut = transactions.filter(t => t.paymentMode === 'Cash' && t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0);
    const bankIn = transactions.filter(t => t.paymentMode === 'Bank' && t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0);
    const bankOut = transactions.filter(t => t.paymentMode === 'Bank' && t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      cashBalance: cashIn - cashOut,
      bankBalance: bankIn - bankOut,
      totalIncome: transactions.filter(t => t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0),
      totalExpense: transactions.filter(t => t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0)
    };
  }, [transactions]);

  const renderContent = () => {
    switch (activeTab) {
      case 'vouchers':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Receipt Voucher', type: 'Receipt', color: 'bg-green-600', icon: ArrowDownRight, desc: 'Record all incoming money' },
                { label: 'Payment Voucher', type: 'Payment', color: 'bg-red-600', icon: ArrowUpRight, desc: 'Record all outgoing money' },
                { label: 'Contra Voucher', type: 'Contra', color: 'bg-blue-600', icon: Wallet, desc: 'Cash/Bank transfers' },
                { label: 'Journal Voucher', type: 'Journal', color: 'bg-purple-600', icon: Book, desc: 'Non-cash adjustments' },
              ].map((v) => (
                <button 
                  key={v.type}
                  onClick={() => { setEditingItem({ voucherType: v.type }); setIsModalOpen(true); }}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3", v.color)}>
                    <v.icon size={20} />
                  </div>
                  <h4 className="font-bold text-gray-800">{v.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">{v.desc}</p>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold text-gray-800">Recent Vouchers</h3>
                <div className="flex gap-2">
                  <Input 
                    type="date" 
                    value={dateFilter} 
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-40 h-9 text-sm"
                  />
                </div>
              </div>
              <DataTable 
                columns={[
                  { key: 'date', label: 'Date', render: (val) => formatDate(val) },
                  { key: 'voucherType', label: 'Voucher Type', render: (val) => (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      val === 'Receipt' ? "bg-green-100 text-green-700" :
                      val === 'Payment' ? "bg-red-100 text-red-700" :
                      val === 'Contra' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    )}>{val}</span>
                  )},
                  { key: 'headId', label: 'Account Head' },
                  { key: 'description', label: 'Description' },
                  { key: 'paymentMode', label: 'Mode' },
                  { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val) },
                ]}
                data={transactions.filter(t => t.date === dateFilter)}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Delete this voucher?')) deleteTransaction(row.id);
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );

      case 'daybook':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-gray-800">Day Book</h3>
              <div className="flex gap-4">
                <Input 
                  type="date" 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-40"
                />
                <Button variant="outline" icon={<Printer size={16} />} onClick={() => window.print()}>Print Day Book</Button>
              </div>
            </div>
            <DataTable 
              columns={[
                { key: 'date', label: 'Date', render: (val) => formatDate(val) },
                { key: 'voucherType', label: 'Vch Type' },
                { key: 'headId', label: 'Particulars' },
                { key: 'description', label: 'Narration' },
                { key: 'debit', label: 'Debit (Out)', render: (_, row) => row.type === 'Debit' ? formatCurrency(row.amount) : '-' },
                { key: 'credit', label: 'Credit (In)', render: (_, row) => row.type === 'Credit' ? formatCurrency(row.amount) : '-' },
              ]}
              data={transactions.filter(t => t.date === dateFilter)}
              onPrint={(row) => window.print()}
            />
            <div className="bg-gray-50 p-4 rounded-xl flex justify-end gap-12 font-bold text-gray-800 border border-gray-200">
              <div>Total Debit: {formatCurrency(transactions.filter(t => t.date === dateFilter && t.type === 'Debit').reduce((s, t) => s + t.amount, 0))}</div>
              <div>Total Credit: {formatCurrency(transactions.filter(t => t.date === dateFilter && t.type === 'Credit').reduce((s, t) => s + t.amount, 0))}</div>
            </div>
          </div>
        );

      case 'cashbank':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Wallet size={24} /></div>
                    <div>
                      <h4 className="font-bold text-gray-800">Cash in Hand</h4>
                      <p className="text-xs text-gray-500">Current Balance</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.cashBalance)}</div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm"><span>Total Cash Inflow</span><span className="text-green-600 font-medium">+{formatCurrency(transactions.filter(t => t.paymentMode === 'Cash' && t.type === 'Credit').reduce((s, t) => s + t.amount, 0))}</span></div>
                  <div className="flex justify-between text-sm"><span>Total Cash Outflow</span><span className="text-red-600 font-medium">-{formatCurrency(transactions.filter(t => t.paymentMode === 'Cash' && t.type === 'Debit').reduce((s, t) => s + t.amount, 0))}</span></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Banknote size={24} /></div>
                    <div>
                      <h4 className="font-bold text-gray-800">Bank Balance</h4>
                      <p className="text-xs text-gray-500">Current Balance</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.bankBalance)}</div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm"><span>Total Bank Inflow</span><span className="text-green-600 font-medium">+{formatCurrency(transactions.filter(t => t.paymentMode === 'Bank' && t.type === 'Credit').reduce((s, t) => s + t.amount, 0))}</span></div>
                  <div className="flex justify-between text-sm"><span>Total Bank Outflow</span><span className="text-red-600 font-medium">-{formatCurrency(transactions.filter(t => t.paymentMode === 'Bank' && t.type === 'Debit').reduce((s, t) => s + t.amount, 0))}</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 px-2">Cash & Bank Transactions</h3>
              <DataTable 
                columns={[
                  { key: 'date', label: 'Date', render: (val) => formatDate(val) },
                  { key: 'paymentMode', label: 'Mode' },
                  { key: 'headId', label: 'Particulars' },
                  { key: 'type', label: 'Type', render: (val) => (
                    <span className={cn("font-bold", val === 'Credit' ? "text-green-600" : "text-red-600")}>{val}</span>
                  )},
                  { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val) },
                ]}
                data={transactions}
              />
            </div>
          </div>
        );

      case 'ledger':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <Select 
                  label="Select Account Ledger" 
                  value={selectedLedgerHead} 
                  onChange={(e) => setSelectedLedgerHead(e.target.value)}
                >
                  <option value="">Choose an account...</option>
                  {accountHeads.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" icon={<Printer size={18} />} onClick={() => window.print()}>Print Ledger</Button>
                <Button variant="secondary" icon={<Download size={18} />}>Export</Button>
              </div>
            </div>

            {selectedLedgerHead && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-bold text-gray-800">Ledger: {selectedLedgerHead}</h3>
                </div>
                <DataTable 
                  columns={[
                    { key: 'date', label: 'Date', render: (val) => formatDate(val) },
                    { key: 'voucherType', label: 'Vch Type' },
                    { key: 'description', label: 'Narration' },
                    { key: 'debit', label: 'Debit', render: (_, row) => row.type === 'Debit' ? formatCurrency(row.amount) : '-' },
                    { key: 'credit', label: 'Credit', render: (_, row) => row.type === 'Credit' ? formatCurrency(row.amount) : '-' },
                    { key: 'balance', label: 'Balance', render: (_, row, index) => {
                      const ledgerTransactions = transactions.filter(t => t.headId === selectedLedgerHead);
                      const currentIdx = ledgerTransactions.findIndex(t => t.id === row.id);
                      const balance = ledgerTransactions.slice(0, currentIdx + 1).reduce((s, t) => s + (t.type === 'Credit' ? t.amount : -t.amount), 0);
                      return formatCurrency(balance);
                    }},
                  ]}
                  data={transactions.filter(t => t.headId === selectedLedgerHead)}
                  onPrint={(row) => window.print()}
                />
              </div>
            )}
          </div>
        );

      case 'trial':
        return (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-5xl mx-auto space-y-8">
            <div className="text-center border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Trial Balance</h2>
              <p className="text-sm text-gray-500">As on {formatDate(new Date().toISOString())}</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="text-left py-3 px-4">Particulars</th>
                  <th className="text-right py-3 px-4">Debit Amount</th>
                  <th className="text-right py-3 px-4">Credit Amount</th>
                </tr>
              </thead>
              <tbody>
                {accountHeads.map(head => {
                  const headTransactions = transactions.filter(t => t.headId === head.name);
                  const balance = headTransactions.reduce((s, t) => s + (t.type === 'Credit' ? t.amount : -t.amount), 0);
                  if (balance === 0) return null;
                  return (
                    <tr key={head.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{head.name}</td>
                      <td className="py-3 px-4 text-right">{balance < 0 ? formatCurrency(Math.abs(balance)) : '-'}</td>
                      <td className="py-3 px-4 text-right">{balance > 0 ? formatCurrency(balance) : '-'}</td>
                    </tr>
                  );
                })}
                {/* Cash & Bank Balances */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium italic">Cash in Hand</td>
                  <td className="py-3 px-4 text-right">{stats.cashBalance > 0 ? formatCurrency(stats.cashBalance) : '-'}</td>
                  <td className="py-3 px-4 text-right">{stats.cashBalance < 0 ? formatCurrency(Math.abs(stats.cashBalance)) : '-'}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium italic">Bank Balance</td>
                  <td className="py-3 px-4 text-right">{stats.bankBalance > 0 ? formatCurrency(stats.bankBalance) : '-'}</td>
                  <td className="py-3 px-4 text-right">{stats.bankBalance < 0 ? formatCurrency(Math.abs(stats.bankBalance)) : '-'}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-800 font-bold bg-gray-50">
                  <td className="py-4 px-4">Grand Total</td>
                  <td className="py-4 px-4 text-right">
                    {formatCurrency(
                      accountHeads.reduce((s, h) => {
                        const b = transactions.filter(t => t.headId === h.name).reduce((sum, t) => sum + (t.type === 'Credit' ? t.amount : -t.amount), 0);
                        return s + (b < 0 ? Math.abs(b) : 0);
                      }, 0) + (stats.cashBalance > 0 ? stats.cashBalance : 0) + (stats.bankBalance > 0 ? stats.bankBalance : 0)
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {formatCurrency(
                      accountHeads.reduce((s, h) => {
                        const b = transactions.filter(t => t.headId === h.name).reduce((sum, t) => sum + (t.type === 'Credit' ? t.amount : -t.amount), 0);
                        return s + (b > 0 ? b : 0);
                      }, 0) + (stats.cashBalance < 0 ? Math.abs(stats.cashBalance) : 0) + (stats.bankBalance < 0 ? Math.abs(stats.bankBalance) : 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        );

      case 'pl':
        const incomeHeads = accountHeads.filter(h => h.type === 'Income');
        const expenseHeads = accountHeads.filter(h => h.type === 'Expense');
        const netProfit = stats.totalIncome - stats.totalExpense;

        return (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-4xl mx-auto space-y-8">
            <div className="text-center border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Profit & Loss Account</h2>
              <p className="text-sm text-gray-500">For the period ending {formatDate(new Date().toISOString())}</p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest border-b pb-2">Expenses</h4>
                <div className="space-y-3">
                  {expenseHeads.map(head => {
                    const amount = transactions.filter(t => t.headId === head.name).reduce((s, t) => s + t.amount, 0);
                    return (
                      <div key={head.id} className="flex justify-between text-sm">
                        <span>{head.name}</span>
                        <span className="font-medium">{formatCurrency(amount)}</span>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t flex justify-between font-bold text-gray-800">
                    <span>Total Expenses</span>
                    <span>{formatCurrency(stats.totalExpense)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest border-b pb-2">Income</h4>
                <div className="space-y-3">
                  {incomeHeads.map(head => {
                    const amount = transactions.filter(t => t.headId === head.name).reduce((s, t) => s + t.amount, 0);
                    return (
                      <div key={head.id} className="flex justify-between text-sm">
                        <span>{head.name}</span>
                        <span className="font-medium">{formatCurrency(amount)}</span>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t flex justify-between font-bold text-gray-800">
                    <span>Total Income</span>
                    <span>{formatCurrency(stats.totalIncome)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={cn(
              "p-6 rounded-xl flex justify-between items-center text-white transition-colors",
              netProfit >= 0 ? "bg-green-600" : "bg-red-600"
            )}>
              <span className="text-lg font-bold uppercase tracking-wider">{netProfit >= 0 ? 'Net Profit' : 'Net Loss'}</span>
              <span className="text-3xl font-bold">{formatCurrency(Math.abs(netProfit))}</span>
            </div>
          </div>
        );

      case 'balance':
        const assetHeads = accountHeads.filter(h => h.type === 'Asset');
        const liabilityHeads = accountHeads.filter(h => h.type === 'Liability');
        const profit = stats.totalIncome - stats.totalExpense;

        return (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-4xl mx-auto space-y-8">
            <div className="text-center border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Balance Sheet</h2>
              <p className="text-sm text-gray-500">As on {formatDate(new Date().toISOString())}</p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest border-b pb-2">Liabilities & Equity</h4>
                <div className="space-y-3">
                  {liabilityHeads.map(head => {
                    const balance = transactions.filter(t => t.headId === head.name).reduce((s, t) => s + (t.type === 'Credit' ? t.amount : -t.amount), 0);
                    return (
                      <div key={head.id} className="flex justify-between text-sm">
                        <span>{head.name}</span>
                        <span className="font-medium">{formatCurrency(Math.abs(balance))}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-sm"><span>Profit & Loss A/c</span><span className="font-medium">{formatCurrency(profit)}</span></div>
                  <div className="pt-4 border-t flex justify-between font-bold text-gray-800">
                    <span>Total Liabilities</span>
                    <span>{formatCurrency(profit + liabilityHeads.reduce((s, h) => s + Math.abs(transactions.filter(t => t.headId === h.name).reduce((sum, t) => sum + (t.type === 'Credit' ? t.amount : -t.amount), 0)), 0))}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest border-b pb-2">Assets</h4>
                <div className="space-y-3">
                  {assetHeads.map(head => {
                    const balance = transactions.filter(t => t.headId === head.name).reduce((s, t) => s + (t.type === 'Credit' ? t.amount : -t.amount), 0);
                    return (
                      <div key={head.id} className="flex justify-between text-sm">
                        <span>{head.name}</span>
                        <span className="font-medium">{formatCurrency(Math.abs(balance))}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-sm"><span>Cash in Hand</span><span className="font-medium">{formatCurrency(stats.cashBalance)}</span></div>
                  <div className="flex justify-between text-sm"><span>Bank Balance</span><span className="font-medium">{formatCurrency(stats.bankBalance)}</span></div>
                  <div className="pt-4 border-t flex justify-between font-bold text-gray-800">
                    <span>Total Assets</span>
                    <span>{formatCurrency(stats.cashBalance + stats.bankBalance + assetHeads.reduce((s, h) => s + Math.abs(transactions.filter(t => t.headId === h.name).reduce((sum, t) => sum + (t.type === 'Credit' ? t.amount : -t.amount), 0)), 0))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'heads':
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Add Account Head</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget as HTMLFormElement);
                await saveAccountHead({
                  id: Math.random().toString(36).substr(2, 9),
                  name: formData.get('name') as string,
                  type: formData.get('type') as any,
                });
                (e.target as HTMLFormElement).reset();
              }} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <Input label="Head Name" name="name" placeholder="e.g. Office Rent" required />
                <Select label="Head Type" name="type" required>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                </Select>
                <div className="flex justify-end">
                  <Button type="submit" icon={<Plus size={18} />}>Add Head</Button>
                </div>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 px-2">Chart of Accounts</h3>
              <DataTable 
                columns={[
                  { key: 'name', label: 'Head Name' },
                  { key: 'type', label: 'Type' },
                  { key: 'balance', label: 'Current Balance', render: (_, row) => {
                    const balance = transactions.filter(t => t.headId === row.name).reduce((s, t) => s + (t.type === 'Credit' ? t.amount : -t.amount), 0);
                    return formatCurrency(Math.abs(balance));
                  }},
                ]}
                data={accountHeads}
                onDelete={(row) => {
                  if (confirm('Delete this account head?')) deleteAccountHead(row.id);
                }}
              />
            </div>
          </div>
        );
      default:
        return null;
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
        title={`${editingItem?.voucherType || 'New'} Voucher Entry`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="voucherType" value={editingItem?.voucherType} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="date" label="Date" type="date" defaultValue={editingItem?.date || new Date().toISOString().split('T')[0]} required />
            <Input name="referenceNo" label="Ref / Bill No" defaultValue={editingItem?.referenceNo} placeholder="Optional" />
            
            <Select name="headId" label="Account Head" defaultValue={editingItem?.headId} required>
              <option value="">Select Account...</option>
              {accountHeads.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
            </Select>

            <Select name="paymentMode" label="Payment Mode" defaultValue={editingItem?.paymentMode || 'Cash'} required>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank / Online</option>
            </Select>

            <Input name="amount" label="Amount" type="number" defaultValue={editingItem?.amount} required />
            
            {editingItem?.voucherType === 'Contra' && (
              <Select name="contraType" label="Transfer Type" required>
                <option value="Deposit">Cash to Bank (Deposit)</option>
                <option value="Withdrawal">Bank to Cash (Withdrawal)</option>
              </Select>
            )}

            <div className="col-span-2">
              <Input name="description" label="Narration / Description" defaultValue={editingItem?.description} placeholder="Enter transaction details..." required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingItem(null); }}>Cancel</Button>
            <Button type="submit">Save Voucher</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
