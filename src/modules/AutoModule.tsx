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
import { useData } from '../hooks/useData';

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

  const { data: suppliers, saveData: saveSupplier, updateData: updateSupplier, deleteData: deleteSupplier } = useData<Supplier>('suppliers');
  const { data: products, saveData: saveProduct, updateData: updateProduct, deleteData: deleteProduct } = useData<AutoProduct>('auto_products');
  const { data: orders, saveData: saveOrder, updateData: updateOrder, deleteData: deleteOrder } = useData<any>('purchase_orders');
  const { data: purchases, saveData: savePurchase, updateData: updatePurchase, deleteData: deletePurchase } = useData<any>('purchases');
  const { data: sales, saveData: saveSale, updateData: updateSale, deleteData: deleteSale } = useData<any>('sales');
  const { data: payments, saveData: savePayment, updateData: updatePayment, deleteData: deletePayment } = useData<any>('transactions');
  const { data: jobCards } = useData<any>('job_cards');

  const [customerSearch, setCustomerSearch] = useState('');
  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [currentOrderItem, setCurrentOrderItem] = useState<any>({
    productId: '',
    barcode: '',
    name: '',
    model: '',
    partNo: '',
    rackNo: '',
    quantity: 0,
    rate: 0,
    stock: 0
  });

  const [purchaseItems, setPurchaseItems] = useState<any[]>([]);
  const [currentPurchaseItem, setCurrentPurchaseItem] = useState<any>({
    productId: '',
    barcode: '',
    name: '',
    model: '',
    partNo: '',
    rackNo: '',
    quantity: 0,
    rate: 0,
    stock: 0
  });

  const [saleItems, setSaleItems] = useState<any[]>([]);
  const [currentSaleItem, setCurrentSaleItem] = useState<any>({
    productId: '',
    barcode: '',
    name: '',
    model: '',
    partNo: '',
    rackNo: '',
    quantity: 0,
    rate: 0,
    stock: 0
  });

  const currentOrderItemRef = React.useRef(currentOrderItem);
  const currentPurchaseItemRef = React.useRef(currentPurchaseItem);
  const currentSaleItemRef = React.useRef(currentSaleItem);

  const updateCurrentOrderItem = (val: any) => {
    setCurrentOrderItem(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      currentOrderItemRef.current = next;
      return next;
    });
  };

  const updateCurrentPurchaseItem = (val: any) => {
    setCurrentPurchaseItem(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      currentPurchaseItemRef.current = next;
      return next;
    });
  };

  const updateCurrentSaleItem = (val: any) => {
    setCurrentSaleItem(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      currentSaleItemRef.current = next;
      return next;
    });
  };

  const handleAddOrderItem = () => {
    const current = currentOrderItemRef.current;
    if (!current.productId || current.quantity <= 0) {
      alert('Please select a product and enter a valid quantity.');
      return;
    }
    const product = products.find(p => p.id === current.productId);
    if (!product) {
      alert('Product not found.');
      return;
    }
    const newItem = {
      productId: product.id,
      barcode: product.barcode,
      name: product.name,
      model: product.model,
      partNo: product.partNo,
      rackNo: product.rackNo,
      quantity: current.quantity,
      rate: current.rate
    };
    setOrderItems(prev => [...prev, newItem]);
    updateCurrentOrderItem({ productId: '', barcode: '', name: '', model: '', partNo: '', rackNo: '', quantity: 0, rate: 0, stock: 0 });
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPurchaseItem = () => {
    const current = currentPurchaseItemRef.current;
    if (!current.productId || current.quantity <= 0) {
      alert('Please select a product and enter a valid quantity.');
      return;
    }
    const product = products.find(p => p.id === current.productId);
    if (!product) {
      alert('Product not found.');
      return;
    }
    const newItem = {
      productId: product.id,
      barcode: product.barcode,
      name: product.name,
      model: product.model,
      partNo: product.partNo,
      rackNo: product.rackNo,
      quantity: current.quantity,
      rate: current.rate
    };
    setPurchaseItems(prev => [...prev, newItem]);
    updateCurrentPurchaseItem({ productId: '', barcode: '', name: '', model: '', partNo: '', rackNo: '', quantity: 0, rate: 0, stock: 0 });
  };

  const removePurchaseItem = (index: number) => {
    setPurchaseItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSaleItem = () => {
    const current = currentSaleItemRef.current;
    if (!current.productId || current.quantity <= 0) {
      alert('Please select a product and enter a valid quantity.');
      return;
    }

    const product = products.find(p => p.id === current.productId);
    if (!product) {
      alert('Product not found.');
      return;
    }

    if (product.stock < current.quantity) {
      alert(`Insufficient stock! Only ${product.stock} available.`);
      return;
    }

    const newItem = {
      productId: product.id,
      barcode: product.barcode,
      name: product.name,
      model: product.model,
      partNo: product.partNo,
      rackNo: product.rackNo,
      quantity: current.quantity,
      rate: current.rate,
      gst: product.gst || 0
    };

    setSaleItems(prev => [...prev, newItem]);
    updateCurrentSaleItem({ productId: '', barcode: '', name: '', model: '', partNo: '', rackNo: '', quantity: 0, rate: 0, stock: 0 });
  };

  const removeSaleItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      if (activeTab === 'products') {
        if (editingItem) {
          await updateProduct(editingItem.id, { ...editingItem, ...data } as AutoProduct);
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
          await saveProduct(newProduct);
        }
      } else if (activeTab === 'suppliers') {
        if (editingItem) {
          await updateSupplier(editingItem.id, { ...editingItem, ...data } as Supplier);
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
          await saveSupplier(newSupplier);
        }
      } else if (activeTab === 'orders') {
        if (editingItem) {
          await updateOrder(editingItem.id, { ...editingItem, ...data, total: Number(data.quantity) * Number(data.rate) } as any);
        } else {
          if (orderItems.length === 0) {
            alert('Please add at least one product to the order.');
            return;
          }
          const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
          const newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            orderNo: data.orderNo || `PO-AUTO-${(orders.length + 1).toString().padStart(3, '0')}`,
            date: data.date as string,
            supplier: data.supplier as string,
            model: orderItems.length === 1 ? orderItems[0].model : `${orderItems.length} Items`,
            total: totalAmount,
            status: 'Pending'
          };
          await saveOrder(newOrder);
          setOrderItems([]);
        }
      } else if (activeTab === 'purchases') {
        if (editingItem) {
          await updatePurchase(editingItem.id, { ...editingItem, ...data, total: Number(data.quantity) * Number(data.purchaseRate) } as any);
        } else {
          if (purchaseItems.length === 0) {
            alert('Please add at least one product to the purchase.');
            return;
          }
          const totalAmount = purchaseItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
          const newPurchase = {
            id: Math.random().toString(36).substr(2, 9),
            invoiceNo: data.invoiceNo as string,
            date: data.date as string,
            supplier: data.supplier as string,
            model: purchaseItems.length === 1 ? purchaseItems[0].model : `${purchaseItems.length} Items`,
            total: totalAmount,
            status: 'Received'
          };
          await savePurchase(newPurchase);
          
          // Update stock for each item
          for (const item of purchaseItems) {
            const product = products.find(p => p.id === item.productId);
            if (product) {
              await updateProduct(product.id, { ...product, stock: product.stock + item.quantity });
            }
          }
          
          setPurchaseItems([]);
        }
      } else if (activeTab === 'sales') {
        if (editingItem) {
          await updateSale(editingItem.id, { ...editingItem, ...data, total: Number(data.quantity) * Number(data.rate) } as any);
        } else {
          if (saleItems.length === 0) {
            alert('Please add at least one product to the invoice.');
            return;
          }
          const totalAmount = saleItems.reduce((sum, item) => {
            const itemTotal = item.quantity * item.rate;
            const gstAmount = itemTotal * (item.gst / 100);
            return sum + itemTotal + gstAmount;
          }, 0);
          const newSale = {
            id: Math.random().toString(36).substr(2, 9),
            invoiceNo: data.invoiceNo || `AS-${(sales.length + 1).toString().padStart(3, '0')}`,
            date: data.date as string,
            customer: data.customer as string,
            phone: data.phone as string,
            vehicleNo: data.vehicleNo as string,
            jobCardNo: data.jobCardNo as string,
            paymentType: data.paymentType as string,
            model: saleItems.length === 1 ? saleItems[0].model : `${saleItems.length} Items`,
            total: totalAmount,
            status: 'Paid',
            source: 'Direct Sale'
          };
          await saveSale(newSale);
          
          // Update stock for each item
          for (const item of saleItems) {
            const product = products.find(p => p.id === item.productId);
            if (product) {
              await updateProduct(product.id, { ...product, stock: product.stock - item.quantity });
            }
          }
          
          setSaleItems([]);
          setCustomerSearch('');
        }
      }
 else if (activeTab === 'payments') {
        if (editingItem) {
          await updatePayment(editingItem.id, { ...editingItem, ...data } as any);
        } else {
          const newPayment = {
            id: Math.random().toString(36).substr(2, 9),
            date: data.date as string || new Date().toISOString().split('T')[0],
            headId: data.supplier as string,
            amount: Number(data.amount),
            type: 'Debit',
            description: `Payment to ${data.supplier}`
          };
          await savePayment(newPayment);
        }
      }

      alert('Data saved successfully!');
      (e.target as HTMLFormElement).reset();
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
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
              <h3 className="font-bold text-gray-800 border-b pb-4">Add New Product</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <Input label="Product Name" name="name" placeholder="Ex: Brake Pad" required />
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
                  if (confirm('Are you sure you want to delete this product?')) {
                    deleteProduct(row.id);
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
                    deletePayment(row.id);
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
          (o.model && o.model.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Purchase Order</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Order No" name="orderNo" defaultValue={`PO-AUTO-${(orders.length + 1).toString().padStart(3, '0')}`} disabled />
                  <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  <Select label="Select Supplier" name="supplier" required className="md:col-span-2">
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Add Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <Input 
                      label="Barcode" 
                      value={currentOrderItem.barcode}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        const p = products.find(prod => prod.barcode === val);
                        if (p) {
                          updateCurrentOrderItem(prev => ({
                            ...prev,
                            productId: p.id,
                            barcode: p.barcode,
                            name: p.name,
                            model: p.model,
                            partNo: p.partNo,
                            rackNo: p.rackNo,
                            stock: p.stock,
                            quantity: prev.quantity || 1,
                            rate: p.purchaseRate || 0
                          }));
                        } else {
                          updateCurrentOrderItem(prev => ({ ...prev, barcode: e.target.value }));
                        }
                      }}
                    />
                    <div className="md:col-span-1">
                      <Select 
                        label="Select Product" 
                        value={currentOrderItem.productId}
                        onChange={(e) => {
                          const p = products.find(prod => prod.id === e.target.value);
                          if (p) {
                            updateCurrentOrderItem(prev => ({ 
                              ...prev, 
                              productId: p.id,
                              barcode: p.barcode,
                              name: p.name,
                              model: p.model,
                              partNo: p.partNo,
                              rackNo: p.rackNo,
                              stock: p.stock,
                              quantity: prev.quantity || 1,
                              rate: p.purchaseRate || 0
                            }));
                          } else {
                            updateCurrentOrderItem({ productId: '', barcode: '', name: '', model: '', partNo: '', rackNo: '', quantity: 0, rate: 0, stock: 0 });
                          }
                        }}
                      >
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.partNo}) - Model: {p.model || 'N/A'}</option>)}
                      </Select>
                    </div>
                    <Input 
                      label="Quantity" 
                      type="number" 
                      value={currentOrderItem.quantity || ''}
                      onChange={(e) => updateCurrentOrderItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    />
                    <Input 
                      label="Rate" 
                      type="number" 
                      value={currentOrderItem.rate || ''}
                      onChange={(e) => updateCurrentOrderItem(prev => ({ ...prev, rate: Number(e.target.value) }))}
                    />
                    <div className="md:col-span-1 flex justify-end">
                      <Button type="button" variant="secondary" onClick={handleAddOrderItem} className="w-full">
                        Add to List
                      </Button>
                    </div>
                  </div>

                  {currentOrderItem.productId && (
                    <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] bg-blue-50 p-3 rounded-xl border border-blue-100 mt-2">
                      <div><span className="font-bold text-blue-600 uppercase">Part No:</span> {products.find(p => p.id === currentOrderItem.productId)?.partNo}</div>
                      <div><span className="font-bold text-blue-600 uppercase">Company:</span> {products.find(p => p.id === currentOrderItem.productId)?.company}</div>
                      <div><span className="font-bold text-blue-600 uppercase">Rack No:</span> {products.find(p => p.id === currentOrderItem.productId)?.rackNo}</div>
                      <div><span className="font-bold text-blue-600 uppercase">Current Stock:</span> {products.find(p => p.id === currentOrderItem.productId)?.stock}</div>
                    </div>
                  )}

                  {orderItems.length > 0 && (
                    <div className="mt-4 border rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-2 text-center">Barcode</th>
                            <th className="px-4 py-2 text-left">Product</th>
                            <th className="px-4 py-2 text-left">Model</th>
                            <th className="px-4 py-2 text-left">Part No</th>
                            <th className="px-4 py-2 text-center">Qty</th>
                            <th className="px-4 py-2 text-right">Rate</th>
                            <th className="px-4 py-2 text-right">Total</th>
                            <th className="px-4 py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="px-4 py-2 text-center">{item.barcode || '-'}</td>
                              <td className="px-4 py-2">{item.name}</td>
                              <td className="px-4 py-2">{item.model}</td>
                              <td className="px-4 py-2">{item.partNo}</td>
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
                          {(() => {
                            const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
                            return (
                              <tr className="text-lg border-t">
                                <td colSpan={6} className="px-4 py-2 text-right">Grand Total:</td>
                                <td className="px-4 py-2 text-right text-primary">{formatCurrency(subtotal)}</td>
                                <td></td>
                              </tr>
                            );
                          })()}
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
                  { key: 'model', label: 'Model/Items' },
                  { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase">{val}</span>
                  )}
                ]}
                data={filteredOrders}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this order?')) {
                    deleteOrder(row.id);
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
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Purchase Entry</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Invoice No" name="invoiceNo" placeholder="Enter Supplier Invoice No" required />
                  <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  <Select label="Select Supplier" name="supplier" required className="md:col-span-2">
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Add Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <Input 
                      label="Barcode" 
                      value={currentPurchaseItem.barcode}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        const p = products.find(prod => prod.barcode === val);
                        if (p) {
                          updateCurrentPurchaseItem(prev => ({
                            ...prev,
                            productId: p.id,
                            barcode: p.barcode,
                            name: p.name,
                            model: p.model,
                            partNo: p.partNo,
                            rackNo: p.rackNo,
                            stock: p.stock,
                            quantity: prev.quantity || 1,
                            rate: p.purchaseRate || 0
                          }));
                        } else {
                          updateCurrentPurchaseItem(prev => ({ ...prev, barcode: e.target.value }));
                        }
                      }}
                    />
                    <div className="md:col-span-1">
                      <Select 
                        label="Select Product" 
                        value={currentPurchaseItem.productId}
                        onChange={(e) => {
                          const p = products.find(prod => prod.id === e.target.value);
                          if (p) {
                            updateCurrentPurchaseItem(prev => ({ 
                              ...prev, 
                              productId: p.id,
                              barcode: p.barcode,
                              name: p.name,
                              model: p.model,
                              partNo: p.partNo,
                              rackNo: p.rackNo,
                              stock: p.stock,
                              quantity: prev.quantity || 1,
                              rate: p.purchaseRate || 0
                            }));
                          } else {
                            updateCurrentPurchaseItem({ productId: '', barcode: '', name: '', model: '', partNo: '', rackNo: '', quantity: 0, rate: 0, stock: 0 });
                          }
                        }}
                      >
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.partNo}) - Model: {p.model || 'N/A'}</option>)}
                      </Select>
                    </div>
                    <Input 
                      label="Quantity" 
                      type="number" 
                      value={currentPurchaseItem.quantity || ''}
                      onChange={(e) => updateCurrentPurchaseItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    />
                    <Input 
                      label="Purchase Rate" 
                      type="number" 
                      value={currentPurchaseItem.rate || ''}
                      onChange={(e) => updateCurrentPurchaseItem(prev => ({ ...prev, rate: Number(e.target.value) }))}
                    />
                    <div className="md:col-span-1 flex justify-end">
                      <Button type="button" variant="secondary" onClick={handleAddPurchaseItem} className="w-full">
                        Add to List
                      </Button>
                    </div>
                  </div>

                  {currentPurchaseItem.productId && (
                    <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] bg-blue-50 p-3 rounded-xl border border-blue-100 mt-2">
                      <div><span className="font-bold text-blue-600 uppercase">Part No:</span> {products.find(p => p.id === currentPurchaseItem.productId)?.partNo}</div>
                      <div><span className="font-bold text-blue-600 uppercase">Company:</span> {products.find(p => p.id === currentPurchaseItem.productId)?.company}</div>
                      <div><span className="font-bold text-blue-600 uppercase">Rack No:</span> {products.find(p => p.id === currentPurchaseItem.productId)?.rackNo}</div>
                      <div><span className="font-bold text-blue-600 uppercase">Current Stock:</span> {products.find(p => p.id === currentPurchaseItem.productId)?.stock}</div>
                    </div>
                  )}

                  {purchaseItems.length > 0 && (
                    <div className="mt-4 border rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-2 text-center">Barcode</th>
                            <th className="px-4 py-2 text-left">Product</th>
                            <th className="px-4 py-2 text-left">Model</th>
                            <th className="px-4 py-2 text-left">Part No</th>
                            <th className="px-4 py-2 text-center">Qty</th>
                            <th className="px-4 py-2 text-right">Rate</th>
                            <th className="px-4 py-2 text-right">Total</th>
                            <th className="px-4 py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchaseItems.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="px-4 py-2 text-center">{item.barcode || '-'}</td>
                              <td className="px-4 py-2">{item.name}</td>
                              <td className="px-4 py-2">{item.model}</td>
                              <td className="px-4 py-2">{item.partNo}</td>
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
                          {(() => {
                            const subtotal = purchaseItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
                            return (
                              <tr className="text-lg border-t">
                                <td colSpan={6} className="px-4 py-2 text-right">Grand Total:</td>
                                <td className="px-4 py-2 text-right text-primary">{formatCurrency(subtotal)}</td>
                                <td></td>
                              </tr>
                            );
                          })()}
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
                  { key: 'model', label: 'Model/Items' },
                  { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
                  { key: 'status', label: 'Status', render: (val) => (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">{val}</span>
                  )}
                ]}
                data={filteredPurchases}
                onEdit={(row) => { setEditingItem(row); setIsModalOpen(true); }}
                onDelete={(row) => {
                  if (confirm('Are you sure you want to delete this purchase?')) {
                    deletePurchase(row.id);
                  }
                }}
                onPrint={(row) => window.print()}
              />
            </div>
          </div>
        );
      case 'sales':
        const today = new Date().toISOString().split('T')[0];
        const filteredSales = sales.filter(s => 
          s.date === today && (
            s.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.model && s.model.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        );
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 border-b pb-4">New Sales Invoice</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input label="Invoice No" name="invoiceNo" defaultValue={`AS-${(sales.length + 1).toString().padStart(3, '0')}`} disabled />
                  <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  <div className="relative">
                    <Input 
                      label="Customer Name" 
                      name="customer" 
                      placeholder="Search by Job Card / Vehicle / Name" 
                      required 
                      value={customerSearch}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomerSearch(val);
                        if (val.length > 0) {
                          const completedJobCards = jobCards.filter((j: any) => j.status === 'In Process');
                          const allSuggestions = [
                            ...completedJobCards.map((j: any) => ({
                              type: 'jobcard',
                              id: j.id,
                              jobCardNo: j.jobCardNo,
                              customerName: j.customerName,
                              vehicleNo: j.vehicleNo,
                              phone: j.phone,
                              label: `${j.jobCardNo} - ${j.customerName} - ${j.vehicleNo}`
                            }))
                          ].filter(item => 
                            item.label.toLowerCase().includes(val.toLowerCase())
                          );

                          // Filter for unique labels
                          const uniqueSuggestions = allSuggestions.filter((item, index, self) =>
                            index === self.findIndex((t) => t.label === item.label)
                          );

                          setCustomerSuggestions(uniqueSuggestions);
                          setShowSuggestions(true);
                        } else {
                          setCustomerSuggestions([]);
                          setShowSuggestions(false);
                        }
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    {showSuggestions && (
                      <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-2xl mt-1 max-h-60 overflow-y-auto no-scrollbar">
                        {customerSuggestions.length > 0 ? (
                          customerSuggestions.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-0 transition-colors"
                              onClick={() => {
                                setCustomerSearch(item.customerName);
                                const form = document.querySelector('form');
                                if (form) {
                                  const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
                                  const vehicleInput = form.querySelector('input[name="vehicleNo"]') as HTMLInputElement;
                                  const jobCardInput = form.querySelector('input[name="jobCardNo"]') as HTMLInputElement;
                                  if (phoneInput) phoneInput.value = item.phone || '';
                                  if (vehicleInput) vehicleInput.value = item.vehicleNo || '';
                                  if (jobCardInput) jobCardInput.value = item.jobCardNo || '';
                                }
                                setShowSuggestions(false);
                              }}
                            >
                              <p className="font-bold text-gray-800">{item.label}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest">From Job Card</p>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-400 italic">No matching record found</div>
                        )}
                      </div>
                    )}
                  </div>
                  <Input label="Phone No" name="phone" />
                  <Input label="Vehicle No" name="vehicleNo" />
                  <Select label="Payment Type" name="paymentType" required>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Credit">Credit</option>
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Add Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <Input 
                      label="Barcode" 
                      value={currentSaleItem.barcode}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        const p = products.find(prod => prod.barcode === val);
                        if (p) {
                          updateCurrentSaleItem(prev => ({
                            ...prev,
                            productId: p.id,
                            barcode: p.barcode,
                            name: p.name,
                            model: p.model,
                            partNo: p.partNo,
                            rackNo: p.rackNo,
                            stock: p.stock,
                            quantity: prev.quantity || 1,
                            rate: p.mrp || 0
                          }));
                        } else {
                          updateCurrentSaleItem(prev => ({ ...prev, barcode: e.target.value }));
                        }
                      }}
                    />
                    <div className="md:col-span-1">
                      <Select 
                        label="Select Product" 
                        value={currentSaleItem.productId}
                        onChange={(e) => {
                          const p = products.find(prod => prod.id === e.target.value);
                          if (p) {
                            updateCurrentSaleItem(prev => ({ 
                              ...prev, 
                              productId: p.id,
                              barcode: p.barcode,
                              name: p.name,
                              model: p.model,
                              partNo: p.partNo,
                              rackNo: p.rackNo,
                              stock: p.stock,
                              quantity: prev.quantity || 1,
                              rate: p.mrp || 0
                            }));
                          } else {
                            updateCurrentSaleItem({ productId: '', barcode: '', name: '', model: '', partNo: '', rackNo: '', quantity: 0, rate: 0, stock: 0 });
                          }
                        }}
                      >
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock} in stock) - Rack: {p.rackNo || 'N/A'}</option>)}
                      </Select>
                    </div>
                    <Input 
                      label="Quantity" 
                      type="number" 
                      value={currentSaleItem.quantity || ''}
                      onChange={(e) => updateCurrentSaleItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    />
                    <Input 
                      label="Rate" 
                      type="number" 
                      value={currentSaleItem.rate || ''}
                      onChange={(e) => updateCurrentSaleItem(prev => ({ ...prev, rate: Number(e.target.value) }))}
                    />
                    <div className="md:col-span-1 flex justify-end">
                      <Button type="button" variant="secondary" onClick={handleAddSaleItem} className="w-full">
                        Add to Invoice
                      </Button>
                    </div>
                  </div>

                  {currentSaleItem.productId && (
                    <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] bg-blue-50 p-3 rounded-xl border border-blue-100 mt-2">
                      <div><span className="font-bold text-blue-600 uppercase">Part No:</span> {products.find(p => p.id === currentSaleItem.productId)?.partNo}</div>
                      <div><span className="font-bold text-blue-600 uppercase">Company:</span> {products.find(p => p.id === currentSaleItem.productId)?.company}</div>
                      <div><span className="font-bold text-blue-600 uppercase">Rack No:</span> {products.find(p => p.id === currentSaleItem.productId)?.rackNo}</div>
                      <div><span className="font-bold text-blue-600 uppercase">Current Stock:</span> {products.find(p => p.id === currentSaleItem.productId)?.stock}</div>
                    </div>
                  )}

                  {saleItems.length > 0 && (
                    <div className="mt-4 border rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-2 text-center">Barcode</th>
                            <th className="px-4 py-2 text-left">Product</th>
                            <th className="px-4 py-2 text-left">Model</th>
                            <th className="px-4 py-2 text-left">Part No</th>
                            <th className="px-4 py-2 text-left">Rack</th>
                            <th className="px-4 py-2 text-center">Qty</th>
                            <th className="px-4 py-2 text-right">Rate</th>
                            <th className="px-4 py-2 text-center">GST %</th>
                            <th className="px-4 py-2 text-right">Total</th>
                            <th className="px-4 py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {saleItems.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="px-4 py-2 text-center">{item.barcode || '-'}</td>
                              <td className="px-4 py-2">{item.name}</td>
                              <td className="px-4 py-2">{item.model}</td>
                              <td className="px-4 py-2">{item.partNo}</td>
                              <td className="px-4 py-2 text-primary font-bold">{item.rackNo || '-'}</td>
                              <td className="px-4 py-2 text-center">{item.quantity}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(item.rate)}</td>
                              <td className="px-4 py-2 text-center text-gray-500">{item.gst}%</td>
                              <td className="px-4 py-2 text-right font-bold">{formatCurrency(item.quantity * item.rate * (1 + item.gst / 100))}</td>
                              <td className="px-4 py-2 text-center">
                                <button type="button" onClick={() => removeSaleItem(idx)} className="text-red-500 hover:text-red-700">
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold">
                          {(() => {
                            const subtotal = saleItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
                            const totalGst = saleItems.reduce((sum, item) => {
                              const itemTotal = item.quantity * item.rate;
                              const gstAmount = itemTotal * (item.gst / 100);
                              return sum + gstAmount;
                            }, 0);
                            const cgst = totalGst / 2;
                            const sgst = totalGst / 2;
                            const grandTotal = subtotal + totalGst;

                            return (
                              <>
                                <tr className="border-t">
                                  <td colSpan={8} className="px-4 py-1 text-right text-gray-500 font-normal">CGST:</td>
                                  <td className="px-4 py-1 text-right">{formatCurrency(cgst)}</td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td colSpan={8} className="px-4 py-1 text-right text-gray-500 font-normal">SGST:</td>
                                  <td className="px-4 py-1 text-right">{formatCurrency(sgst)}</td>
                                  <td></td>
                                </tr>
                                <tr className="text-lg border-t bg-primary/5">
                                  <td colSpan={8} className="px-4 py-2 text-right">Grand Total:</td>
                                  <td className="px-4 py-2 text-right text-primary">{formatCurrency(grandTotal)}</td>
                                  <td></td>
                                </tr>
                              </>
                            );
                          })()}
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
                <h3 className="text-xl font-bold text-gray-800">Today's Sales</h3>
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
                  { key: 'invoiceNo', label: 'Invoice No' },
                  { key: 'date', label: 'Date' },
                  { key: 'customer', label: 'Customer' },
                  { key: 'source', label: 'Source', render: (val, row) => (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      (val === 'Job Card' || row.invoiceNo?.startsWith('SB-')) ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    )}>{val || (row.invoiceNo?.startsWith('SB-') ? 'Job Card' : 'Direct Sale')}</span>
                  )},
                  { key: 'model', label: 'Model/Items' },
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
                    deleteSale(row.id);
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
                    deleteSupplier(row.id);
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
              <Select label="Payment Type" name="paymentType" defaultValue={editingItem?.paymentType} required>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Credit">Credit</option>
              </Select>
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
