import React, { useState, useMemo } from 'react';
import { Dataset } from '../data/datasets';
import { Table, Search, Upload, Download, FileSpreadsheet, Plus, Trash2 } from 'lucide-react';

interface DataExplorerProps {
  dataset: Dataset;
  onCustomDatasetLoaded: (newDataset: Dataset) => void;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ dataset, onCustomDatasetLoaded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    if (!searchTerm) return dataset.data;
    const term = searchTerm.toLowerCase();
    return dataset.data.filter(row => {
      return Object.values(row).some(val => String(val).toLowerCase().includes(term));
    });
  }, [dataset, searchTerm]);

  // Handle CSV/text file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const parsedRows: Record<string, string | number>[] = [];
      const colTypes: Record<string, 'numeric' | 'categorical'> = {};

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        const row: Record<string, string | number> = {};
        headers.forEach((h, idx) => {
          const val = parts[idx] ?? '';
          const num = Number(val);
          row[h] = !isNaN(num) && val !== '' ? num : val;
        });
        parsedRows.push(row);
      }

      headers.forEach(h => {
        const isNum = parsedRows.every(r => typeof r[h] === 'number');
        colTypes[h] = isNum ? 'numeric' : 'categorical';
      });

      const newDs: Dataset = {
        id: `custom_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        source: `Uploaded ${file.name}`,
        description: `Custom researcher dataset with ${parsedRows.length} observations and ${headers.length} columns.`,
        columns: headers,
        columnTypes: colTypes,
        data: parsedRows
      };

      onCustomDatasetLoaded(newDs);
    };
    reader.readAsText(file);
  };

  const exportCSV = () => {
    const headers = dataset.columns.join(',');
    const rows = dataset.data.map(row => 
      dataset.columns.map(c => `"${row[c] ?? ''}"`).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.id}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Data Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Table className="w-5 h-5 mr-2 text-blue-600" />
              Data Explorer: {dataset.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Source: <span className="font-medium text-slate-700">{dataset.source}</span> — {dataset.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <label className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors shadow-2xs">
              <Upload className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Import CSV / Excel
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={exportCSV}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Search & Metadata Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter data rows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span>
              <strong>{dataset.columns.length}</strong> columns
            </span>
            <span>•</span>
            <span>
              <strong>{filteredData.length}</strong> of {dataset.data.length} observations
            </span>
          </div>
        </div>
      </div>

      {/* Column Type Badges */}
      <div className="flex flex-wrap gap-2">
        {dataset.columns.map(col => (
          <div key={col} className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs shadow-2xs flex items-center space-x-1.5">
            <span className="font-semibold text-slate-800">{col}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
              dataset.columnTypes[col] === 'numeric'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {dataset.columnTypes[col]}
            </span>
          </div>
        ))}
      </div>

      {/* Tabular Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-12 text-slate-400">#</th>
                {dataset.columns.map(col => (
                  <th key={col} className="py-2.5 px-3">
                    <span className="block font-semibold">{col}</span>
                    <span className="text-[10px] font-mono font-normal text-slate-400">
                      {dataset.columnTypes[col]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3 text-slate-400 font-mono">{rowIdx + 1}</td>
                  {dataset.columns.map(col => (
                    <td key={col} className="py-2 px-3 font-mono text-slate-800">
                      {row[col] !== undefined && row[col] !== null ? String(row[col]) : <span className="text-slate-300">NA</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
