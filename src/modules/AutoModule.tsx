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
import { formatCurrency, cn } from '../lib/utils';
import { AutoProduct, Supplier } from '../types';

interface AutoModuleProps {
  activeTab: string;
}

export const AutoModule: React.FC<AutoModuleProps> = ({ activeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    company: 'All Companies',
    model: 'All Models'
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<AutoProduct[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (activeTab === 'products') {
      if (editingItem) {
        setProducts(products.map(p => p.id === editingItem.id ? { ...p, ...data } as AutoProduct : p));
      } else {
        const newProduct: AutoProduct = {
          id: Math.random().toString(36).substr(2, 9),
          barcode: data.barcode as string,
          hsnCode: data.hsnCode as string,
          name: data.name as string,
          company: data.company as string,
          model: data.model as string,
          partNo: data.partNo as string,
          lowQty: Number(data.lowQty),
          gst: Number(data.gst),
          rackNo: data.rackNo as string,
          purchaseRate: Number(data.purchaseRate),
          mrp: Number(data.mrp),
          stock: 0,
        };
        setProducts([...products, newProduct]);
      }
    } else if (activeTab === 'suppliers') {
      if (editingItem) {
        setSuppliers(suppliers.map(s => s.id === editingItem.id ? { ...s, ...data } as Supplier : s));
      } else {
        const newSupplier: Supplier = {
          id: Math.random().toString(36).substr(2, 9),
          supplierCode: data.supplierCode as string || `S-AUTO-${(suppliers.length + 1).toString().padStart(3, '0')}`,
          name: data.name as string,
          contactNo: data.contactNo as string,
          gstNo: data.gstNo as string,
          city: data.city as string,
          address: data.address as string,
          state: data.state as string,
          email: data.email as string,
          balance: 0,
        };
        setSuppliers([...suppliers, newSupplier]);
      }
    } else if (activeTab === 'orders') {
      if (editingItem) {
        setOrders(orders.map(o => o.id === editingItem.id ? { ...o, ...data, total: Number(data.quantity) * Number(data.rate) } : o));
      } else {
        const newOrder = {
          id: Math.random().toString(36).substr(2, 9),
          orderNo: data.orderNo || `PO-AUTO-${(orders.length + 1).toString().padStart(3, '0')}`,
          date: data.date as string,
          supplier: data.supplier as string,
          product: data.product as string,
          quantity: Number(data.quantity),
          rate: Number(data.rate),
          total: Number(data.quantity) * Number(data.rate),
          status: 'Pending'
        };
        setOrders([newOrder, ...orders]);
      }
    } else if (activeTab === 'purchases') {
      if (editingItem) {
        setPurchases(purchases.map(p => p.id === editingItem.id ? { ...p, ...data, total: Number(data.quantity) * Number(data.purchaseRate) } : p));
      } else {
        const newPurchase = {
          id: Math.random().toString(36).substr(2, 9),
          invoiceNo: data.invoiceNo as string,
          date: data.date as string,
          supplier: data.supplier as string,
          product: data.product as string,
          quantity: Number(data.quantity),
          purchaseRate: Number(data.purchaseRate),
          total: Number(data.quantity) * Number(data.purchaseRate),
          status: 'Received'
        };
        setPurchases([newPurchase, ...purchases]);
        // Update stock
        setProducts(products.map(p => p.name === data.product ? { ...p, stock: p.stock + Number(data.quantity) } : p));
      }
    } else if (activeTab === 'sales') {
      if (editingItem) {
        setSales(sales.map(s => s.id === editingItem.id ? { ...s, ...data, total: Number(data.quantity) * Number(data.rate) } : s));
      } else {
        const newSale = {
          id: Math.random().toString(36).substr(2, 9),
          invoiceNo: data.invoiceNo || `AS-${(sales.length + 1).toString().padStart(3, '0')}`,
          date: data.date as string,
          customer: data.customer as string,
          phone: data.phone as string,
          product: data.product as string,
          quantity: Number(data.quantity),
          rate: Number(data.rate),
          total: Number(data.quantity) * Number(data.rate),
          status: 'Paid'
        };
        setSales([newSale, ...sales]);
        // Update stock
        setProducts(products.map(p => p.name === data.product ? { ...p, stock: p.stock - Number(data.quantity) } : p));
      }
    } else if (activeTab === 'payments') {
      if (editingItem) {
        setPayments(payments.map(p => p.id === editingItem.id ? { ...p, ...data } : p));
      } else {
        const newPayment = {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString().split('T')[0],
          supplier: data.supplier as string,
          amount: Number(data.amount),
          mode: data.mode as string,
          ref: data.ref as string,
        };
        setPayments([newPayment, ...payments]);
      }
    }

    alert('Data saved successfully!');
    (e.target as HTMLFormElement).reset();
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const simulateSend = (type: 'Email' | 'WhatsApp', row: any) => {
    alert(`Simulating sending ${type} to ${row.supplier || 'supplier'}...`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        const filteredProducts = products.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.partNo.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Add New Part</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <Input label="Part Name" name="name" placeholder="Ex: Brake Pad" required />
                <Input label="Company" name="company" placeholder="Ex: Bosch" required />
                <Input label="Model" name="model" placeholder="Ex: Swift" required />
                <Input label="Part No" name="partNo" placeholder="Ex: BP-123" required />
                <Input label="Barcode" name="barcode" placeholder="Scan Barcode" required />
                <Input label="HSN Code" name="hsnCode" placeholder="Ex: 8708" required />
                <Input label="Rack No" name="rackNo" placeholder="Ex: A-12" required />
                <Input label="Low Qty Alert" name="lowQty" type="number" defaultValue="10" required />
                <Input label="GST (%)" name="gst" type="number" defaultValue="18" required />
                <Input label="Purchase Rate" name="purchaseRate" type="number" required />
                <Input label="MRP" name="mrp" type="number" required />
                <div className="md:col-span-4 flex justify-end">
                  <Button type="submit" icon={<Plus size={18} />}>Save Part</Button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <h3 className="text-xl font-bold text-gray-800">Auto Parts Inventory</h3>
                <div className="w-full md:w-64">
                  <Input 
                    placeholder="Search parts..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
                data={filteredProducts}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this part?')) {
                    setProducts(products.filter(p => p.id !== row.id));
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );
      case 'search':
        const companies = ['All Companies', ...new Set(products.map(p => p.company))];
        const models = ['All Models', ...new Set(products.map(p => p.model))];
        
        const filteredSearchResults = products.filter(p => {
          const matchesName = p.name.toLowerCase().includes(searchFilters.name.toLowerCase()) || 
                             p.partNo.toLowerCase().includes(searchFilters.name.toLowerCase());
          const matchesCompany = searchFilters.company === 'All Companies' || p.company === searchFilters.company;
          const matchesModel = searchFilters.model === 'All Models' || p.model === searchFilters.model;
          return matchesName && matchesCompany && matchesModel;
        });

        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Input 
                  label="Search by Name / Part No" 
                  icon={<Search size={16} />} 
                  value={searchFilters.name}
                  onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                />
              </div>
              <div className="w-48">
                <Select 
                  label="Company"
                  value={searchFilters.company}
                  onChange={(e) => setSearchFilters({ ...searchFilters, company: e.target.value })}
                >
                  {companies.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div className="w-48">
                <Select 
                  label="Model"
                  value={searchFilters.model}
                  onChange={(e) => setSearchFilters({ ...searchFilters, model: e.target.value })}
                >
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>
              <Button icon={<Search size={18} />} onClick={() => {}}>Search</Button>
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
              data={filteredSearchResults}
            />
          </div>
        );
      case 'payments':
        const filteredPayments = payments.filter(p => 
          p.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.ref.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-4">Supplier Payment</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select label="Select Supplier" name="supplier" required>
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </Select>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Outstanding Balance</span>
                      <span className="font-bold text-red-600">₹0.00</span>
                    </div>
                  </div>
                  <Input label="Amount to Pay" name="amount" type="number" required />
                  <Select label="Payment Mode" name="mode" required>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                  </Select>
                  <Input label="Reference / Cheque No" name="ref" />
                  <Button type="submit" className="w-full">Process Payment</Button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold text-gray-800">Recent Payments</h3>
                <div className="w-64">
                  <Input 
                    placeholder="Search payments..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <DataTable 
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
                data={filteredPayments}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this payment?')) {
                    setPayments(payments.filter(p => p.id !== row.id));
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );
      case 'orders':
        const filteredOrders = orders.filter(o => 
          o.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.product.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Purchase Order</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Order No" name="orderNo" defaultValue={`PO-AUTO-${(orders.length + 1).toString().padStart(3, '0')}`} disabled />
                <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                <Select label="Select Supplier" name="supplier" required>
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </Select>
                <Select label="Select Product" name="product" required>
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name} ({p.partNo})</option>)}
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Quantity" name="quantity" type="number" required />
                  <Input label="Expected Rate" name="rate" type="number" required />
                </div>
                <div className="pt-4 border-t">
                  <Button type="submit" className="w-full">Generate Order</Button>
                </div>
              </form>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold text-gray-800">Recent Purchase Orders</h3>
                <div className="w-64">
                  <Input 
                    placeholder="Search orders..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
               <DataTable 
                columns={[
                  { key: 'orderNo', label: 'Order No' },
                  { key: 'date', label: 'Date' },
                  { key: 'supplier', label: 'Supplier' },
                  { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase">{val}</span>
                  )}
                ]}
                data={filteredOrders}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this order?')) {
                    setOrders(orders.filter(o => o.id !== row.id));
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );
      case 'purchases':
        const filteredPurchases = purchases.filter(p => 
          p.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.product.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Purchase Entry</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Invoice No" name="invoiceNo" placeholder="Enter Supplier Invoice No" required />
                <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                <Select label="Select Supplier" name="supplier" required>
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </Select>
                <Select label="Select Product" name="product" required>
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Quantity" name="quantity" type="number" required />
                  <Input label="Purchase Rate" name="purchaseRate" type="number" required />
                </div>
                <div className="pt-4 border-t">
                  <Button type="submit" className="w-full">Save Purchase</Button>
                </div>
              </form>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold text-gray-800">Recent Purchases</h3>
                <div className="w-64">
                  <Input 
                    placeholder="Search purchases..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
               <DataTable 
                columns={[
                  { key: 'invoiceNo', label: 'Invoice' },
                  { key: 'date', label: 'Date' },
                  { key: 'supplier', label: 'Supplier' },
                  { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">{val}</span>
                  )}
                ]}
                data={filteredPurchases}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this purchase?')) {
                    setPurchases(purchases.filter(p => p.id !== row.id));
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );
      case 'sales':
        const filteredSales = sales.filter(s => 
          s.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.product.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Sales Invoice</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Invoice No" name="invoiceNo" defaultValue={`AS-${(sales.length + 1).toString().padStart(3, '0')}`} disabled />
                <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                <Input label="Customer Name" name="customer" placeholder="Walk-in Customer" required />
                <Input label="Phone No" name="phone" />
                <Select label="Select Product" name="product" required>
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name} ({p.stock} in stock)</option>)}
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Quantity" name="quantity" type="number" required />
                  <Input label="Rate" name="rate" type="number" required />
                </div>
                <div className="pt-4 border-t">
                  <Button type="submit" className="w-full">Save & Print Invoice</Button>
                </div>
              </form>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold text-gray-800">Recent Sales</h3>
                <div className="w-64">
                  <Input 
                    placeholder="Search sales..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
               <DataTable 
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
                ]}
                data={filteredSales}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this sale?')) {
                    setSales(sales.filter(s => s.id !== row.id));
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );
      case 'suppliers':
        const filteredSuppliers = suppliers.filter(s => 
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.contactNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Add New Supplier</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <Input label="Supplier Name" name="name" placeholder="Enter Name" required />
                <Input label="Contact Number" name="contactNo" placeholder="Enter Contact No" required />
                <Input label="GST Number" name="gstNo" placeholder="Enter GST No" required />
                <Input label="City" name="city" placeholder="Enter City" required />
                <Input label="State" name="state" placeholder="Enter State" required />
                <Input label="Email" name="email" type="email" placeholder="Enter Email" required />
                <div className="md:col-span-3">
                  <Input label="Address" name="address" placeholder="Enter Full Address" required />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button type="submit" icon={<Plus size={18} />}>Save Supplier</Button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <h3 className="text-xl font-bold text-gray-800">Supplier Directory</h3>
                <div className="w-full md:w-64">
                  <Input 
                    placeholder="Search suppliers..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <DataTable 
                columns={[
                  { key: 'name', label: 'Supplier Name' },
                  { key: 'contactNo', label: 'Contact No' },
                  { key: 'gstNo', label: 'GST Number' },
                  { key: 'city', label: 'City' },
                ]}
                data={filteredSuppliers}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this supplier?')) {
                    setSuppliers(suppliers.filter(s => s.id !== row.id));
                  }
                }}
                onPrint={(row) => window.print()}
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'products' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex gap-2">
                <Input name="barcode" label="Barcode" defaultValue={editingItem?.barcode} required />
                <Button variant="secondary" className="mt-6" icon={<Scan size={18} />}>Scan</Button>
              </div>
              <Input name="hsnCode" label="HSN Code" defaultValue={editingItem?.hsnCode} />
              <Input name="name" label="Product Name" defaultValue={editingItem?.name} required />
              <Input name="company" label="Company" defaultValue={editingItem?.company} required />
              <Input name="model" label="Model" defaultValue={editingItem?.model} required />
              <Input name="partNo" label="Part No" defaultValue={editingItem?.partNo} />
              <Input name="rackNo" label="Rack No" defaultValue={editingItem?.rackNo} />
              <Input name="lowQty" label="Low Quantity Alert" type="number" defaultValue={editingItem?.lowQty} />
              <Input name="gst" label="GST (%)" type="number" defaultValue={editingItem?.gst || 18} />
              <Input name="purchaseRate" label="Purchase Rate" type="number" defaultValue={editingItem?.purchaseRate} />
              <Input name="mrp" label="MRP" type="number" defaultValue={editingItem?.mrp} />
            </div>
          )}
          {activeTab === 'suppliers' && (
            <div className="grid grid-cols-2 gap-4">
              <Input name="name" label="Supplier Name" defaultValue={editingItem?.name} required />
              <Input name="email" label="Email ID" type="email" defaultValue={editingItem?.email} />
              <Input name="contactNo" label="Contact No" defaultValue={editingItem?.contactNo} required />
              <Input name="gstNo" label="GST Number" defaultValue={editingItem?.gstNo} />
              <Input name="city" label="City" defaultValue={editingItem?.city} />
              <Input name="state" label="State" defaultValue={editingItem?.state} />
              <Input name="address" label="Address" defaultValue={editingItem?.address} className="col-span-2" />
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="grid grid-cols-2 gap-4">
              <Input name="orderNo" label="Order No" defaultValue={editingItem?.orderNo} disabled />
              <Input name="date" label="Date" type="date" defaultValue={editingItem?.date} required />
              <Select name="supplier" label="Supplier" defaultValue={editingItem?.supplier} required>
                <option value="">Select Supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </Select>
              <Select name="product" label="Product" defaultValue={editingItem?.product} required>
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </Select>
              <Input name="quantity" label="Quantity" type="number" defaultValue={editingItem?.quantity} required />
              <Input name="rate" label="Expected Rate" type="number" defaultValue={editingItem?.rate} required />
            </div>
          )}
          {activeTab === 'purchases' && (
            <div className="grid grid-cols-2 gap-4">
              <Input name="invoiceNo" label="Invoice No" defaultValue={editingItem?.invoiceNo} required />
              <Input name="date" label="Date" type="date" defaultValue={editingItem?.date} required />
              <Select name="supplier" label="Supplier" defaultValue={editingItem?.supplier} required>
                <option value="">Select Supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </Select>
              <Select name="product" label="Product" defaultValue={editingItem?.product} required>
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </Select>
              <Input name="quantity" label="Quantity" type="number" defaultValue={editingItem?.quantity} required />
              <Input name="purchaseRate" label="Purchase Rate" type="number" defaultValue={editingItem?.purchaseRate} required />
            </div>
          )}
          {activeTab === 'sales' && (
            <div className="grid grid-cols-2 gap-4">
              <Input name="invoiceNo" label="Invoice No" defaultValue={editingItem?.invoiceNo} disabled />
              <Input name="date" label="Date" type="date" defaultValue={editingItem?.date} required />
              <Input name="customer" label="Customer Name" defaultValue={editingItem?.customer} required />
              <Input name="phone" label="Phone No" defaultValue={editingItem?.phone} />
              <Select name="product" label="Product" defaultValue={editingItem?.product} required>
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </Select>
              <Input name="quantity" label="Quantity" type="number" defaultValue={editingItem?.quantity} required />
              <Input name="rate" label="Rate" type="number" defaultValue={editingItem?.rate} required />
            </div>
          )}
          {activeTab === 'payments' && (
            <div className="grid grid-cols-2 gap-4">
              <Select name="supplier" label="Supplier" defaultValue={editingItem?.supplier} required>
                <option value="">Select Supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </Select>
              <Input name="amount" label="Amount" type="number" defaultValue={editingItem?.amount} required />
              <Select name="mode" label="Payment Mode" defaultValue={editingItem?.mode} required>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
              </Select>
              <Input name="ref" label="Reference / Cheque No" defaultValue={editingItem?.ref} />
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
