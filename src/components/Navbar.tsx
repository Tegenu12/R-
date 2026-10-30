import React from 'react';
import { DATASETS, Dataset } from '../data/datasets';
import { Database, BookOpen, BarChart2, PieChart, GitCompare, GitFork, TrendingUp, Clock, Table, Terminal, Download } from 'lucide-react';

export type TabType = 
  | 'curriculum' 
  | 'descriptive' 
  | 'graphics' 
  | 'inferential' 
  | 'anova' 
  | 'regression' 
  | 'timeseries' 
  | 'data' 
  | 'console';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedDataset: Dataset;
  onSelectDataset: (datasetId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedDataset,
  onSelectDataset
}) => {
  const tabs = [
    { id: 'curriculum' as TabType, label: 'Curriculum', icon: BookOpen },
    { id: 'descriptive' as TabType, label: 'Descriptive Stats', icon: BarChart2 },
    { id: 'graphics' as TabType, label: 'Statistical Graphics', icon: PieChart },
    { id: 'inferential' as TabType, label: 'Hypothesis Tests', icon: GitCompare },
    { id: 'anova' as TabType, label: 'ANOVA', icon: GitFork },
    { id: 'regression' as TabType, label: 'Regression & Models', icon: TrendingUp },
    { id: 'timeseries' as TabType, label: 'Time Series', icon: Clock },
    { id: 'data' as TabType, label: 'Data Explorer', icon: Table },
    { id: 'console' as TabType, label: 'R Console', icon: Terminal },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              R
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  R Statistical Training & Research Workbench
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Rcode_Y.R & Tegenu.R
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Interactive statistical analysis, model diagnostics, and R training for researchers
              </p>
            </div>
          </div>

          {/* Active Dataset Picker */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
              <Database className="w-3.5 h-3.5 text-blue-600 mr-2 shrink-0" />
              <span className="text-slate-500 mr-1.5 font-medium">Dataset:</span>
              <select
                aria-label="Active Dataset"
                value={selectedDataset.id}
                onChange={(e) => onSelectDataset(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {Object.values(DATASETS).map(ds => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name} ({ds.data.length} obs)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                const json = JSON.stringify(selectedDataset.data, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedDataset.id}.json`;
                a.click();
              }}
              title="Export active dataset as JSON"
              className="inline-flex items-center px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Export
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mr-1.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
