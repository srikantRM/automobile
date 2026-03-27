import React from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Printer, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  className, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    ghost: 'hover:bg-gray-100 text-gray-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3',
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</label>}
      <input 
        className={cn(
          "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          error && "border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, className, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</label>}
      <select 
        className={cn(
          "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

interface TableProps {
  columns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onPrint?: (row: any) => void;
  title?: string;
}

export const DataTable: React.FC<TableProps> = ({ columns, data, onEdit, onDelete, onPrint, title }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" icon={<Filter size={14} />}>Filter</Button>
            <Button size="sm" variant="secondary" icon={<Download size={14} />}>Export</Button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete || onPrint) && (
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-400 italic">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onPrint) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onPrint && (
                          <button onClick={() => onPrint(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Print">
                            <Printer size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button onClick={() => onEdit(row)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                            <Edit2 size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(row)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <p className="text-xs text-gray-500">Showing {data.length} records</p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" icon={<ChevronLeft size={14} />} disabled />
          <Button size="sm" variant="secondary" icon={<ChevronRight size={14} />} disabled />
        </div>
      </div>
    </div>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Plus size={20} className="rotate-45" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
