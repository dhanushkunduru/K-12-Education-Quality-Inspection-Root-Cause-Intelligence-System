import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox, ArrowUpDown } from 'lucide-react';
import { Skeleton } from './Skeleton';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick,
  searchPlaceholder = 'Search records...',
  actions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const pageSize = 8;

  // Filter
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn] || '';
    const bVal = b[sortColumn] || '';
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
      {/* Header controls */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              {columns.map(col => (
                <th
                  key={col.key || col.header}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`py-3.5 px-4 ${col.sortable !== false ? 'cursor-pointer hover:text-slate-200 transition-colors' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable !== false && <ArrowUpDown className="w-3 h-3 text-slate-500" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Inbox className="w-10 h-10 text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-300">No matching records found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting search query or active filter parameters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-slate-800/40 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map(col => (
                    <td key={col.key || col.header} className="py-3.5 px-4">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
