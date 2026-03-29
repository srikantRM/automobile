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
  Printer,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Button, Input, DataTable, Modal, Select } from '../components/UI';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { InverterProduct, Customer, Supplier } from '../types';

interface InverterModuleProps {
  activeTab: string;
}

export const InverterModule: React.FC<InverterModuleProps> = ({ activeTab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Reset selected report and items when tab changes
  React.useEffect(() => {
    setSelectedReport(null);
    setOrderItems([]);
    setCurrentOrderItem({ productId: '', model: '', hsnCode: '', quantity: 0, rate: 0 });
  }, [activeTab]);

  // Mock Data for Visuals
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const categoryData = [
    { name: 'Batteries', value: 400 },
    { name: 'Inverters', value: 300 },
    { name: 'Solar Panels', value: 300 },
    { name: 'Accessories', value: 200 },
  ];

  const COLORS = ['#ef4444', '#f97316', '#8b5cf6', '#10b981'];

  // Mock Data
  const [products, setProducts] = useState<InverterProduct[]>([
    { id: '1', name: 'Exide Invamaster', model: 'IMST1500', serialNo: 'EX123456', capacity: '150Ah', guarantee: '36 Months', gst: 18, warranty: '12 Months', extra: '', servicePeriod: 6, minQty: 5, stock: 12 },
    { id: '2', name: 'Luminous Red Charge', model: 'RC18000', serialNo: 'LM987654', capacity: '150Ah', guarantee: '42 Months', gst: 18, warranty: '18 Months', extra: '', servicePeriod: 6, minQty: 3, stock: 2 },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([
    { id: '1', orderNo: 'PO-001', date: '2024-03-27', supplier: 'Battery World', model: 'IMST1500', total: 45000, status: 'Pending' }
  ]);

  const [purchases, setPurchases] = useState<any[]>([
    { id: '1', invoiceNo: 'SUP-998', date: '2024-03-25', supplier: 'Battery World', model: 'RC18000', total: 125000, status: 'Received' }
  ]);

  const [sales, setSales] = useState<any[]>([
    { id: '1', invoiceNo: 'INV-001', date: '2024-03-27', customer: 'John Doe', total: 15600, status: 'Paid' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    if (activeTab === 'products') {
      if (editingItem) {
        setProducts(products.map(p => p.id === editingItem.id ? { ...p, ...data } as InverterProduct : p));
      } else {
        const newProduct: InverterProduct = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name as string,
          model: data.model as string,
          serialNo: data.serialNo as string,
          capacity: data.capacity as string,
          guarantee: data.guarantee as string,
          gst: Number(data.gst),
          warranty: data.warranty as string,
          extra: data.extra as string,
          servicePeriod: Number(data.servicePeriod),
          minQty: Number(data.minQty),
          stock: 0,
        };
        setProducts([...products, newProduct]);
      }
    } else if (activeTab === 'customers') {
      if (editingItem) {
        setCustomers(customers.map(c => c.id === editingItem.id ? { ...c, ...data } as Customer : c));
      } else {
        const newCustomer: Customer = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name as string,
          phone: data.phone as string,
          address: data.address as string,
        };
        setCustomers([...customers, newCustomer]);
      }
    } else if (activeTab === 'suppliers') {
      if (editingItem) {
        setSuppliers(suppliers.map(s => s.id === editingItem.id ? { ...s, ...data } as Supplier : s));
      } else {
        const newSupplier: Supplier = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name as string,
          address: data.address as string,
          contactNo: data.contactNo as string,
          gstNo: data.gstNo as string,
          city: data.city as string,
          state: data.state as string,
          email: data.email as string,
          balance: 0,
        };
        setSuppliers([...suppliers, newSupplier]);
      }
    } else if (activeTab === 'orders') {
      if (editingItem) {
        setPurchaseOrders(purchaseOrders.map(o => o.id === editingItem.id ? { ...o, ...data } as any : o));
      } else {
        if (orderItems.length === 0) {
          alert('Please add at least one product to the order.');
          return;
        }
        const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
        const newOrder = {
          id: Math.random().toString(36).substr(2, 9),
          orderNo: `PO-${(purchaseOrders.length + 1).toString().padStart(3, '0')}`,
          date: data.date as string,
          supplier: data.supplier as string,
          items: orderItems,
          model: orderItems.length === 1 ? orderItems[0].model : `${orderItems.length} Items`,
          total: totalAmount,
          status: 'Pending'
        };
        setPurchaseOrders([newOrder, ...purchaseOrders]);
        setOrderItems([]); // Clear items after saving
      }
    } else if (activeTab === 'purchases') {
      if (editingItem) {
        setPurchases(purchases.map(p => p.id === editingItem.id ? { ...p, ...data } as any : p));
      } else {
        if (orderItems.length === 0) {
          alert('Please add at least one product.');
          return;
        }
        const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
        const newPurchase = {
          id: Math.random().toString(36).substr(2, 9),
          invoiceNo: data.invoiceNo as string,
          date: data.date as string,
          supplier: data.supplier as string,
          items: orderItems,
          model: orderItems.length === 1 ? orderItems[0].model : `${orderItems.length} Items`,
          total: totalAmount,
          status: 'Received'
        };
        setPurchases([newPurchase, ...purchases]);
        
        // Update stock for all items
        const updatedProducts = [...products];
        orderItems.forEach(item => {
          const pIdx = updatedProducts.findIndex(p => p.id === item.productId);
          if (pIdx !== -1) {
            updatedProducts[pIdx] = { ...updatedProducts[pIdx], stock: updatedProducts[pIdx].stock + item.quantity };
          }
        });
        setProducts(updatedProducts);
        setOrderItems([]);
      }
    } else if (activeTab === 'sales') {
      if (editingItem) {
        setSales(sales.map(s => s.id === editingItem.id ? { ...s, ...data } as any : s));
      } else {
        if (orderItems.length === 0) {
          alert('Please add at least one product.');
          return;
        }
        const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
        const gst = subtotal * 0.18;
        const totalAmount = subtotal + gst;
        const newSale = {
          id: Math.random().toString(36).substr(2, 9),
          invoiceNo: `INV-${(sales.length + 1).toString().padStart(3, '0')}`,
          date: data.date as string,
          customer: data.customer as string,
          items: orderItems,
          total: totalAmount,
          status: 'Paid'
        };
        setSales([newSale, ...sales]);
        
        // Update stock for all items
        const updatedProducts = [...products];
        orderItems.forEach(item => {
          const pIdx = updatedProducts.findIndex(p => p.id === item.productId);
          if (pIdx !== -1) {
            updatedProducts[pIdx] = { ...updatedProducts[pIdx], stock: updatedProducts[pIdx].stock - item.quantity };
          }
        });
        setProducts(updatedProducts);
        setOrderItems([]);
      }
    }

    alert('Data saved successfully!');
    (e.target as HTMLFormElement).reset();
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  const simulateSend = (type: 'Email' | 'WhatsApp', row: any) => {
    alert(`Simulating sending ${type} to ${row.name || row.customerName || 'recipient'}...`);
  };

  const [salesForm, setSalesForm] = useState({ quantity: 0, rate: 0 });
  const [orderItems, setOrderItems] = useState<{ productId: string, name: string, model: string, hsnCode?: string, quantity: number, rate: number }[]>([]);
  const [currentOrderItem, setCurrentOrderItem] = useState({ productId: '', model: '', hsnCode: '', quantity: 0, rate: 0 });

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        const filteredProducts = products.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.serialNo.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Add New Product</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <Input label="Product Name" name="name" placeholder="Ex: Exide Invamaster" required />
                <Input label="Model" name="model" placeholder="Ex: IMST1500" required />
                <Input label="Serial No" name="serialNo" placeholder="Enter Serial No" required />
                <Input label="Capacity" name="capacity" placeholder="Ex: 150Ah" required />
                <Input label="Guarantee" name="guarantee" placeholder="Ex: 36 Months" required />
                <Input label="Warranty" name="warranty" placeholder="Ex: 12 Months" required />
                <Input label="GST (%)" name="gst" type="number" defaultValue="18" required />
                <Input label="Min Qty" name="minQty" type="number" defaultValue="5" required />
                <div className="md:col-span-4 flex justify-end">
                  <Button type="submit" icon={<Plus size={18} />}>Save Product</Button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <h3 className="text-xl font-bold text-gray-800">Product Inventory</h3>
                <div className="w-full md:w-64">
                  <Input 
                    placeholder="Search products..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
                data={filteredProducts}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this product?')) {
                    setProducts(products.filter(p => p.id !== row.id));
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );
      case 'customers':
        const filteredCustomers = customers.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">Add New Customer</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <Input label="Customer Name" name="name" placeholder="Enter Name" required />
                <Input label="Phone Number" name="phone" placeholder="Enter Phone" required />
                <Input label="Address" name="address" placeholder="Enter Address" required />
                <div className="md:col-span-3 flex justify-end">
                  <Button type="submit" icon={<Plus size={18} />}>Save Customer</Button>
                </div>
              </form>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <h3 className="text-xl font-bold text-gray-800">Customer Database</h3>
                <div className="w-full md:w-64">
                  <Input 
                    placeholder="Search customers..." 
                    icon={<Search size={16} />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <DataTable 
                columns={[
                  { key: 'name', label: 'Customer Name' },
                  { key: 'phone', label: 'Phone No' },
                  { key: 'address', label: 'Address' },
                ]}
                data={filteredCustomers}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this customer?')) {
                    setCustomers(customers.filter(c => c.id !== row.id));
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
      case 'sales':
        const filteredSales = sales.filter(s => 
          s.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.customer.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const handleAddSaleItem = () => {
          if (!currentOrderItem.productId || currentOrderItem.quantity <= 0 || currentOrderItem.rate <= 0) {
            alert('Please select a product and enter valid quantity and rate.');
            return;
          }
          const product = products.find(p => p.id === currentOrderItem.productId);
          if (product) {
            if (product.stock < currentOrderItem.quantity) {
              alert(`Insufficient stock! Available: ${product.stock}`);
              return;
            }
            setOrderItems([...orderItems, {
              productId: product.id,
              name: product.name,
              model: currentOrderItem.model || product.model,
              quantity: currentOrderItem.quantity,
              rate: currentOrderItem.rate
            }]);
            setCurrentOrderItem({ productId: '', model: '', quantity: 0, rate: 0 });
          }
        };

        const removeSaleItem = (index: number) => {
          setOrderItems(orderItems.filter((_, i) => i !== index));
        };

        const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Sales Invoice</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input label="Invoice No" name="invoiceNo" defaultValue={`INV-${(sales.length + 1).toString().padStart(3, '0')}`} disabled />
                  <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  <Select label="Payment Mode" name="paymentMode">
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit">Credit</option>
                  </Select>
                  <Select label="Select Customer" name="customer" required className="md:col-span-3">
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Add Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-1">
                      <Select 
                        label="Select Product" 
                        value={currentOrderItem.productId}
                        onChange={(e) => {
                          const p = products.find(prod => prod.id === e.target.value);
                          setCurrentOrderItem({ ...currentOrderItem, productId: e.target.value, model: p ? p.model : '' });
                        }}
                      >
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock} in stock)</option>)}
                      </Select>
                    </div>
                    <Input 
                      label="Model" 
                      value={currentOrderItem.model}
                      onChange={(e) => setCurrentOrderItem({ ...currentOrderItem, model: e.target.value })}
                    />
                    <Input 
                      label="Quantity" 
                      type="number" 
                      value={currentOrderItem.quantity || ''}
                      onChange={(e) => setCurrentOrderItem({ ...currentOrderItem, quantity: Number(e.target.value) })}
                    />
                    <Input 
                      label="Rate" 
                      type="number" 
                      value={currentOrderItem.rate || ''}
                      onChange={(e) => setCurrentOrderItem({ ...currentOrderItem, rate: Number(e.target.value) })}
                    />
                    <Button type="button" variant="secondary" onClick={handleAddSaleItem} className="w-full">
                      Add to Invoice
                    </Button>
                  </div>

                  {orderItems.length > 0 && (
                    <div className="mt-4 border rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-2 text-left">Product</th>
                            <th className="px-4 py-2 text-center">Qty</th>
                            <th className="px-4 py-2 text-right">Rate</th>
                            <th className="px-4 py-2 text-right">Total</th>
                            <th className="px-4 py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="px-4 py-2">{item.name} ({item.model})</td>
                              <td className="px-4 py-2 text-center">{item.quantity}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(item.rate)}</td>
                              <td className="px-4 py-2 text-right font-bold">{formatCurrency(item.quantity * item.rate)}</td>
                              <td className="px-4 py-2 text-center">
                                <button type="button" onClick={() => removeSaleItem(idx)} className="text-red-500 hover:text-red-700">
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold">
                          <tr className="border-t">
                            <td colSpan={3} className="px-4 py-2 text-right">Subtotal:</td>
                            <td className="px-4 py-2 text-right">{formatCurrency(subtotal)}</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-right">GST (18%):</td>
                            <td className="px-4 py-2 text-right">{formatCurrency(subtotal * 0.18)}</td>
                            <td></td>
                          </tr>
                          <tr className="text-lg">
                            <td colSpan={3} className="px-4 py-2 text-right">Grand Total:</td>
                            <td className="px-4 py-2 text-right text-primary">{formatCurrency(subtotal * 1.18)}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <Button type="submit" className="px-12">Save & Print Invoice</Button>
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
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Paid</span>
                  )}
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
      case 'orders':
        const filteredOrders = purchaseOrders.filter(o => 
          o.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (o.model && o.model.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        const handleAddOrderItem = () => {
          if (!currentOrderItem.productId || currentOrderItem.quantity <= 0 || currentOrderItem.rate <= 0) {
            alert('Please select a product and enter valid quantity and rate.');
            return;
          }
          const product = products.find(p => p.id === currentOrderItem.productId);
          if (product) {
            setOrderItems([...orderItems, {
              productId: product.id,
              name: product.name,
              model: currentOrderItem.model || product.model,
              quantity: currentOrderItem.quantity,
              rate: currentOrderItem.rate
            }]);
            setCurrentOrderItem({ productId: '', model: '', quantity: 0, rate: 0 });
          }
        };

        const removeOrderItem = (index: number) => {
          setOrderItems(orderItems.filter((_, i) => i !== index));
        };

        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Purchase Order</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Order No" name="orderNo" defaultValue={`PO-${(purchaseOrders.length + 1).toString().padStart(3, '0')}`} disabled />
                  <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  <Select label="Select Supplier" name="supplier" required className="md:col-span-2">
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Add Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-1">
                      <Select 
                        label="Select Product" 
                        value={currentOrderItem.productId}
                        onChange={(e) => {
                          const p = products.find(prod => prod.id === e.target.value);
                          setCurrentOrderItem({ ...currentOrderItem, productId: e.target.value, model: p ? p.model : '' });
                        }}
                      >
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.model})</option>)}
                      </Select>
                    </div>
                    <Input 
                      label="Model" 
                      value={currentOrderItem.model}
                      onChange={(e) => setCurrentOrderItem({ ...currentOrderItem, model: e.target.value })}
                    />
                    <Input 
                      label="Quantity" 
                      type="number" 
                      value={currentOrderItem.quantity || ''}
                      onChange={(e) => setCurrentOrderItem({ ...currentOrderItem, quantity: Number(e.target.value) })}
                    />
                    <Input 
                      label="Rate" 
                      type="number" 
                      value={currentOrderItem.rate || ''}
                      onChange={(e) => setCurrentOrderItem({ ...currentOrderItem, rate: Number(e.target.value) })}
                    />
                    <Button type="button" variant="secondary" onClick={handleAddOrderItem} className="w-full">
                      Add to List
                    </Button>
                  </div>

                  {orderItems.length > 0 && (
                    <div className="mt-4 border rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-2 text-left">Product</th>
                            <th className="px-4 py-2 text-center">Qty</th>
                            <th className="px-4 py-2 text-right">Rate</th>
                            <th className="px-4 py-2 text-right">Total</th>
                            <th className="px-4 py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="px-4 py-2">{item.name} ({item.model})</td>
                              <td className="px-4 py-2 text-center">{item.quantity}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(item.rate)}</td>
                              <td className="px-4 py-2 text-right font-bold">{formatCurrency(item.quantity * item.rate)}</td>
                              <td className="px-4 py-2 text-center">
                                <button type="button" onClick={() => removeOrderItem(idx)} className="text-red-500 hover:text-red-700">
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold">
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-right">Grand Total:</td>
                            <td className="px-4 py-2 text-right text-primary">
                              {formatCurrency(orderItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0))}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <Button type="submit" className="px-12">Generate Purchase Order</Button>
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
                  { key: 'model', label: 'Model' },
                  { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase">Pending</span>
                  )}
                ]}
                data={filteredOrders}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this order?')) {
                    setPurchaseOrders(purchaseOrders.filter(o => o.id !== row.id));
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
          (p.model && p.model.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        const handleAddPurchaseItem = () => {
          if (!currentOrderItem.productId || currentOrderItem.quantity <= 0 || currentOrderItem.rate <= 0) {
            alert('Please select a product and enter valid quantity and rate.');
            return;
          }
          const product = products.find(p => p.id === currentOrderItem.productId);
          if (product) {
            setOrderItems([...orderItems, {
              productId: product.id,
              name: product.name,
              model: currentOrderItem.model || product.model,
              hsnCode: currentOrderItem.hsnCode,
              quantity: currentOrderItem.quantity,
              rate: currentOrderItem.rate
            }]);
            setCurrentOrderItem({ productId: '', model: '', hsnCode: '', quantity: 0, rate: 0 });
          }
        };

        const removePurchaseItem = (index: number) => {
          setOrderItems(orderItems.filter((_, i) => i !== index));
        };

        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Purchase Entry</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Invoice No" name="invoiceNo" placeholder="Enter Supplier Invoice No" required />
                  <Input label="Invoice Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  <Select label="Select Supplier" name="supplier" required className="md:col-span-2">
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Add Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="md:col-span-1">
                      <Select 
                        label="Select Product" 
                        value={currentOrderItem.productId}
                        onChange={(e) => {
                          const p = products.find(prod => prod.id === e.target.value);
                          setCurrentOrderItem({ ...currentOrderItem, productId: e.target.value, model: p ? p.model : '', hsnCode: '' });
                        }}
                      >
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.model})</option>)}
                      </Select>
                    </div>
                    <Input 
                      label="Model" 
                      value={currentOrderItem.model}
                      onChange={(e) => setCurrentOrderItem({ ...currentOrderItem, model: e.target.value })}
                    />
                    <Input 
                      label="HSN Code" 
                      value={currentOrderItem.hsnCode}
                      onChange={(e) => setCurrentOrderItem({ ...currentOrderItem, hsnCode: e.target.value })}
                    />
                    <Input 
                      label="Quantity" 
                      type="number" 
                      value={currentOrderItem.quantity || ''}
                      onChange={(e) => setCurrentOrderItem({ ...currentOrderItem, quantity: Number(e.target.value) })}
                    />
                    <Input 
                      label="Rate" 
                      type="number" 
                      value={currentOrderItem.rate || ''}
                      onChange={(e) => setCurrentOrderItem({ ...currentOrderItem, rate: Number(e.target.value) })}
                    />
                    <Button type="button" variant="secondary" onClick={handleAddPurchaseItem} className="w-full">
                      Add to List
                    </Button>
                  </div>

                  {orderItems.length > 0 && (
                    <div className="mt-4 border rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-2 text-center">Sl No</th>
                            <th className="px-4 py-2 text-left">Product</th>
                            <th className="px-4 py-2 text-center">HSN Code</th>
                            <th className="px-4 py-2 text-center">Qty</th>
                            <th className="px-4 py-2 text-right">Rate</th>
                            <th className="px-4 py-2 text-right">Total</th>
                            <th className="px-4 py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="px-4 py-2 text-center">{idx + 1}</td>
                              <td className="px-4 py-2">{item.name} ({item.model})</td>
                              <td className="px-4 py-2 text-center">{item.hsnCode || '-'}</td>
                              <td className="px-4 py-2 text-center">{item.quantity}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(item.rate)}</td>
                              <td className="px-4 py-2 text-right font-bold">{formatCurrency(item.quantity * item.rate)}</td>
                              <td className="px-4 py-2 text-center">
                                <button type="button" onClick={() => removePurchaseItem(idx)} className="text-red-500 hover:text-red-700">
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold">
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-right">Grand Total:</td>
                            <td className="px-4 py-2 text-right text-primary">
                              {formatCurrency(orderItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0))}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <Button type="submit" className="px-12">Save Purchase Entry</Button>
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
                  { key: 'model', label: 'Model' },
                  { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Received</span>
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
      case 'reports':
        if (selectedReport) {
          return (
            <div className="space-y-6 print:p-0">
              <div className="flex items-center justify-between mb-2 print:hidden">
                <div className="flex items-center gap-4">
                  <Button variant="secondary" icon={<ArrowLeft size={18} />} onClick={() => setSelectedReport(null)}>Back to Reports</Button>
                  <h3 className="text-xl font-bold text-gray-800">{selectedReport}</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" icon={<Download size={18} />}>Export CSV</Button>
                  <Button icon={<Printer size={18} />} onClick={() => window.print()}>Print Report</Button>
                </div>
              </div>

              {/* Mock Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-end print:hidden">
                <div className="w-48">
                  <Input label="From Date" type="date" defaultValue="2024-03-01" />
                </div>
                <div className="w-48">
                  <Input label="To Date" type="date" defaultValue="2024-03-31" />
                </div>
                <div className="w-48">
                  <Select label="Category">
                    <option>All Categories</option>
                    <option>Inverter</option>
                    <option>Battery</option>
                    <option>Solar</option>
                  </Select>
                </div>
                <Button variant="secondary" icon={<Filter size={16} />}>Apply Filter</Button>
              </div>

              {/* Print Header (Visible only during printing) */}
              <div className="hidden print:block text-center mb-8 border-b-2 border-primary pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-left">
                    <h1 className="text-3xl font-black text-primary tracking-tighter">REDLINK</h1>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Business Solutions</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>123 Business Park, Industrial Area</p>
                    <p>City, State - 123456</p>
                    <p>GSTIN: 27AAAAA0000A1Z5</p>
                    <p>Phone: +91 98765 43210</p>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mt-4 text-gray-800 uppercase tracking-tight">{selectedReport}</h2>
                <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-medium uppercase">
                  <p>Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  <p>Generated on: {new Date().toLocaleString()}</p>
                </div>
              </div>
              
              {selectedReport === 'Daily Sales Report' && (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Sales</p>
                      <h4 className="text-2xl font-bold text-gray-800">{formatCurrency(32100)}</h4>
                      <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
                        <TrendingUp size={10} /> +8.2% from yesterday
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Invoices</p>
                      <h4 className="text-2xl font-bold text-gray-800">12</h4>
                      <p className="text-[10px] text-blue-600 font-bold mt-1">Average ₹2,675 per sale</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Top Payment Mode</p>
                      <h4 className="text-2xl font-bold text-gray-800">UPI</h4>
                      <p className="text-[10px] text-purple-600 font-bold mt-1">65% of total transactions</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:shadow-none print:border-none">
                      <h4 className="font-bold text-gray-800 mb-6">Sales Trend (Weekly)</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              formatter={(val) => [formatCurrency(val as number), 'Sales']}
                            />
                            <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={3} dot={{ r: 6, fill: '#ef4444' }} activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:shadow-none print:border-none">
                      <h4 className="font-bold text-gray-800 mb-6">Sales by Category</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <DataTable 
                    columns={[
                      { key: 'date', label: 'Date' },
                      { key: 'invoiceNo', label: 'Invoice' },
                      { key: 'customer', label: 'Customer' },
                      { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val) },
                      { key: 'paymentMode', label: 'Mode' },
                    ]}
                    data={[
                      { date: '2024-03-27', invoiceNo: 'INV-001', customer: 'John Doe', amount: 15600, paymentMode: 'UPI' },
                      { date: '2024-03-27', invoiceNo: 'INV-002', customer: 'Walk-in', amount: 4500, paymentMode: 'Cash' },
                      { date: '2024-03-26', invoiceNo: 'INV-003', customer: 'Rahul Kumar', amount: 12000, paymentMode: 'Credit' },
                    ]}
                  />
                </div>
              )}

              {selectedReport === 'Stock Summary' && (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Inventory Value</p>
                      <h4 className="text-2xl font-bold text-gray-800">{formatCurrency(products.reduce((acc, p) => acc + (p.stock * 8500), 0))}</h4>
                      <p className="text-[10px] text-gray-500 font-bold mt-1">Based on average purchase rate</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Stock Quantity</p>
                      <h4 className="text-2xl font-bold text-gray-800">{products.reduce((acc, p) => acc + p.stock, 0)} Units</h4>
                      <p className="text-[10px] text-blue-600 font-bold mt-1">Across {products.length} product models</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Low Stock Alerts</p>
                      <h4 className="text-2xl font-bold text-red-600">{products.filter(p => p.stock < p.minQty).length} Items</h4>
                      <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1">
                        <TrendingDown size={10} /> Action required for reorder
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:shadow-none print:border-none">
                      <h4 className="font-bold text-gray-800 mb-6">Stock Levels</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={products}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: '#f9fafb'}} />
                            <Bar dataKey="stock" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:shadow-none print:border-none">
                      <h4 className="font-bold text-gray-800 mb-6">Stock Value by Product</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={products.map(p => ({ name: p.name, value: p.stock * 8500 }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {products.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(val) => formatCurrency(val as number)} />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <DataTable 
                    columns={[
                      { key: 'name', label: 'Product' },
                      { key: 'model', label: 'Model' },
                      { key: 'stock', label: 'Current Stock', render: (val, row) => (
                        <span className={cn("font-bold", val < row.minQty ? "text-red-600" : "text-green-600")}>{val}</span>
                      )},
                      { key: 'minQty', label: 'Min Qty' },
                      { key: 'value', label: 'Stock Value', render: (val) => formatCurrency(val) },
                    ]}
                    data={products.map(p => ({
                      ...p,
                      value: p.stock * 8500 // Mock value
                    }))}
                  />
                </div>
              )}

              {selectedReport === 'Supplier Ledger' && (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Outstanding</p>
                      <h4 className="text-2xl font-bold text-red-600">{formatCurrency(suppliers.reduce((acc, s) => acc + s.balance, 0))}</h4>
                      <p className="text-[10px] text-gray-500 font-bold mt-1">Across {suppliers.length} suppliers</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Last Payment</p>
                      <h4 className="text-2xl font-bold text-gray-800">{formatCurrency(45000)}</h4>
                      <p className="text-[10px] text-blue-600 font-bold mt-1">Paid to Battery World on 24 Mar</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Credit Limit Used</p>
                      <h4 className="text-2xl font-bold text-gray-800">42%</h4>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-primary h-full w-[42%]"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:shadow-none print:border-none">
                      <h4 className="font-bold text-gray-800 mb-6">Outstanding Balances</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={suppliers} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" axisLine={false} tickLine={false} hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} />
                            <Tooltip formatter={(val) => formatCurrency(val as number)} />
                            <Bar dataKey="balance" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:shadow-none print:border-none">
                      <h4 className="font-bold text-gray-800 mb-6">Balance Distribution</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={suppliers.map(s => ({ name: s.name, value: s.balance }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {suppliers.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(val) => formatCurrency(val as number)} />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <DataTable 
                    columns={[
                      { key: 'supplier', label: 'Supplier' },
                      { key: 'lastPurchase', label: 'Last Purchase' },
                      { key: 'totalPurchased', label: 'Total Purchased', render: (val) => formatCurrency(val) },
                      { key: 'balance', label: 'Outstanding', render: (val) => (
                        <span className="text-red-600 font-bold">{formatCurrency(val)}</span>
                      )},
                    ]}
                    data={suppliers.map(s => ({
                      supplier: s.name,
                      lastPurchase: '2024-03-25',
                      totalPurchased: 125000,
                      balance: s.balance
                    }))}
                  />
                </div>
              )}

              {selectedReport === 'Customer Aging' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Active Customers</p>
                      <p className="text-3xl font-bold text-gray-800">{customers.length}</p>
                      <p className="text-[10px] text-green-600 font-bold mt-1">+2 from last week</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Sales Value</p>
                      <p className="text-3xl font-bold text-blue-600">{formatCurrency(185000)}</p>
                      <p className="text-[10px] text-blue-600 font-bold mt-1">Lifetime value avg ₹15,416</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center print:border print:shadow-none">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Retention Rate</p>
                      <p className="text-3xl font-bold text-green-600">92%</p>
                      <p className="text-[10px] text-gray-500 font-bold mt-1">High customer loyalty</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:shadow-none print:border-none">
                    <h4 className="font-bold text-gray-800 mb-6">Sales by Customer</h4>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={customers.map(c => ({ name: c.name, sales: 45000 + Math.random() * 20000 }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                          <Tooltip formatter={(val) => formatCurrency(val as number)} />
                          <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <DataTable 
                    columns={[
                      { key: 'customer', label: 'Customer' },
                      { key: 'lastVisit', label: 'Last Visit' },
                      { key: 'totalSales', label: 'Total Sales', render: (val) => formatCurrency(val) },
                      { key: 'status', label: 'Status', render: (val) => (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase">{val}</span>
                      )},
                    ]}
                    data={customers.map(c => ({
                      customer: c.name,
                      lastVisit: '2024-03-20',
                      totalSales: 45000,
                      status: 'Active'
                    }))}
                  />
                </div>
              )}

              {/* Print Footer */}
              <div className="hidden print:block mt-12 pt-8 border-t-2 border-gray-200">
                <div className="grid grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-300 mb-2"></div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Prepared By</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-300 mb-2"></div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Verified By</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-300 mb-2"></div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Authorized Signatory</p>
                  </div>
                </div>
                <div className="text-center text-gray-400 text-[10px] space-y-1">
                  <p>© 2026 RedLink Business Solutions. All rights reserved.</p>
                  <p className="italic">This is a computer-generated report and does not require a physical signature for internal use.</p>
                  <p className="font-bold">Confidential - For Internal Use Only</p>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Business Intelligence</h3>
                <p className="text-gray-500">Analyze your business performance with detailed reports and visuals.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Daily Sales Report', icon: BarChart3, color: 'bg-blue-500', desc: 'Track daily revenue and payment modes.' },
                { label: 'Stock Summary', icon: Package, color: 'bg-green-500', desc: 'Monitor inventory levels and value.' },
                { label: 'Supplier Ledger', icon: Truck, color: 'bg-purple-500', desc: 'Manage supplier accounts and balances.' },
                { label: 'Customer Aging', icon: Users, color: 'bg-orange-500', desc: 'Analyze customer behavior and loyalty.' },
              ].map((report, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedReport(report.label)}
                  className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <report.icon size={120} />
                  </div>
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:scale-110", report.color)}>
                    <report.icon size={28} />
                  </div>
                  <h4 className="font-bold text-xl text-gray-800 mb-2">{report.label}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{report.desc}</p>
                  <div className="mt-6 flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View Report <ChevronRight size={16} className="ml-1" />
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="font-bold text-gray-800 text-lg">Weekly Revenue Overview</h4>
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                    <TrendingUp size={14} /> +12.5%
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: '#f9fafb'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="sales" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="font-bold text-gray-800 text-lg">Inventory Distribution</h4>
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold">
                    Healthy Stock
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
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
              <Input name="name" label="Product Name" defaultValue={editingItem?.name} required />
              <Input name="model" label="Model" defaultValue={editingItem?.model} required />
              <Input name="serialNo" label="Serial No" defaultValue={editingItem?.serialNo} />
              <Input name="capacity" label="Capacity" defaultValue={editingItem?.capacity} placeholder="e.g. 150Ah" />
              <Input name="guarantee" label="Guarantee" defaultValue={editingItem?.guarantee} placeholder="e.g. 36 Months" />
              <Input name="gst" label="GST (%)" type="number" defaultValue={editingItem?.gst || 18} />
              <Input name="warranty" label="Warranty" defaultValue={editingItem?.warranty} />
              <Input name="servicePeriod" label="Service Period (Months)" type="number" defaultValue={editingItem?.servicePeriod} />
              <Input name="minQty" label="Minimum Quantity" type="number" defaultValue={editingItem?.minQty} />
              <Input name="extra" label="Extra Info" defaultValue={editingItem?.extra} className="col-span-2" />
            </div>
          )}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <Input name="name" label="Customer Name" defaultValue={editingItem?.name} required />
              <Input name="phone" label="Phone No" defaultValue={editingItem?.phone} required />
              <Input name="address" label="Address" defaultValue={editingItem?.address} />
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
          {activeTab === 'sales' && (
            <div className="grid grid-cols-2 gap-4">
              <Input name="invoiceNo" label="Invoice No" defaultValue={editingItem?.invoiceNo} disabled />
              <Input name="date" label="Date" type="date" defaultValue={editingItem?.date} required />
              <Select name="customer" label="Customer" defaultValue={editingItem?.customer} required>
                {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </Select>
              <Select name="product" label="Product" defaultValue={editingItem?.product} required>
                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </Select>
              <Input name="quantity" label="Quantity" type="number" defaultValue={editingItem?.quantity} required />
              <Input name="rate" label="Rate" type="number" defaultValue={editingItem?.rate} required />
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="grid grid-cols-2 gap-4">
              <Input name="orderNo" label="Order No" defaultValue={editingItem?.orderNo} disabled />
              <Input name="date" label="Date" type="date" defaultValue={editingItem?.date} required />
              <Select name="supplier" label="Supplier" defaultValue={editingItem?.supplier} required>
                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </Select>
              <Select name="product" label="Product" defaultValue={editingItem?.product} required>
                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </Select>
              <Input name="model" label="Model" defaultValue={editingItem?.model} />
              <Input name="quantity" label="Quantity" type="number" defaultValue={editingItem?.quantity} />
              <Input name="rate" label="Expected Rate" type="number" defaultValue={editingItem?.rate} />
            </div>
          )}
          {activeTab === 'purchases' && (
            <div className="grid grid-cols-2 gap-4">
              <Input name="invoiceNo" label="Invoice No" defaultValue={editingItem?.invoiceNo} required />
              <Input name="date" label="Date" type="date" defaultValue={editingItem?.date} required />
              <Select name="supplier" label="Supplier" defaultValue={editingItem?.supplier} required>
                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </Select>
              <Select name="product" label="Product" defaultValue={editingItem?.product} required>
                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </Select>
              <Input name="model" label="Model" defaultValue={editingItem?.model} />
              <Input name="quantity" label="Quantity" type="number" defaultValue={editingItem?.quantity} />
              <Input name="rate" label="Purchase Rate" type="number" defaultValue={editingItem?.rate} />
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
