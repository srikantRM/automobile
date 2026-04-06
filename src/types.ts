export type ModuleType = 'dashboard' | 'inverter' | 'automobiles' | 'service' | 'accounts';

export interface InverterProduct {
  id: string;
  productCode: string;
  barcode: string;
  name: string;
  model: string;
  capacity: string;
  guarantee: string;
  gst: number;
  warranty: string;
  hsnCode: string;
  extra: string;
  servicePeriod: number; // in months
  minQty: number;
  stock: number;
  sellingPrice?: number;
  purchasePrice?: number;
}

export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  address: string;
}

export interface Supplier {
  id: string;
  supplierCode: string;
  name: string;
  address: string;
  contactNo: string;
  gstNo: string;
  city: string;
  state: string;
  email: string;
  balance: number;
}

export interface PurchaseOrder {
  id: string;
  date: string;
  supplierId: string;
  items: {
    productId: string;
    quantity: number;
    rate: number;
  }[];
  status: 'pending' | 'completed';
}

export interface Sale {
  id: string;
  invoiceNo: string;
  date: string;
  customerId: string;
  items: {
    productId: string;
    modelNo: string;
    serialNo?: string;
    quantity: number;
    rate: number;
    gst: number;
    amount: number;
  }[];
  paymentMode: 'Cash' | 'Credit' | 'UPI';
  totalAmount: number;
}

export interface AutoProduct {
  id: string;
  barcode: string;
  hsnCode: string;
  name: string;
  company: string;
  model: string;
  partNo: string;
  lowQty: number;
  gst: number;
  rackNo: string;
  purchaseRate: number;
  mrp: number;
  stock: number;
}

export interface JobCard {
  id: string;
  jobCardNo: number;
  customerName: string;
  phone: string;
  vehicleNo: string;
  vehicleModel: string;
  kmReading: number;
  problemDescription: string;
  paymentType: 'Cash' | 'Credit' | 'UPI';
  status: 'In Process' | 'Completed';
  serviceCharges: number;
  partsCharges: number;
  additionalChargesLabel?: string;
  totalAmount: number;
  date: string;
  mechanicId?: string;
  workStatus?: string;
}

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
}

export interface AccountHead {
  id: string;
  name: string;
  type: 'Income' | 'Expense' | 'Asset' | 'Liability';
}

export interface Transaction {
  id: string;
  date: string;
  headId: string;
  description: string;
  amount: number;
  type: 'Debit' | 'Credit';
  voucherType: 'Receipt' | 'Payment' | 'Contra' | 'Journal';
  paymentMode: 'Cash' | 'Bank';
  referenceNo?: string;
}
