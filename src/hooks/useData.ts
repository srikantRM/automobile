import { useState, useEffect, useCallback } from 'react';

export function useData<T>(table: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${table}`);
      if (!response.ok) throw new Error(`Failed to fetch ${table}`);
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveData = async (item: T) => {
    try {
      const response = await fetch(`/api/${table}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error(`Failed to save to ${table}`);
      const result = await response.json();
      setData(prev => [...prev, result]);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateData = async (id: string, item: T) => {
    try {
      const response = await fetch(`/api/${table}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error(`Failed to update ${table}`);
      const result = await response.json();
      setData(prev => prev.map(d => (d as any).id === id ? result : d));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteData = async (id: string) => {
    try {
      const response = await fetch(`/api/${table}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Failed to delete from ${table}`);
      setData(prev => prev.filter(d => (d as any).id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, fetchData, saveData, updateData, deleteData, setData };
}
