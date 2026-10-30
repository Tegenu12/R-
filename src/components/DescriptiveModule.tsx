import React, { useState, useMemo } from 'react';
import { Dataset } from '../data/datasets';
import { computeDescriptiveStats, computeGroupedFrequency } from '../lib/statistics';
import { Copy, Check, Calculator, BarChart3, HelpCircle } from 'lucide-react';

interface DescriptiveModuleProps {
  dataset: Dataset;
}

export const DescriptiveModule: React.FC<DescriptiveModuleProps> = ({ dataset }) => {
  // Find numeric columns
  const numericCols = useMemo(() => {
    return dataset.columns.filter(c => dataset.columnTypes[c] === 'numeric');
  }, [dataset]);

  const categoricalCols = useMemo(() => {
    return dataset.columns.filter(c => dataset.columnTypes[c] === 'categorical');
  }, [dataset]);

  const [selectedCol, setSelectedCol] = useState<string>(numericCols[0] || dataset.columns[0]);
  const [numBins, setNumBins] = useState<number>(5);
  const [copiedCode, setCopiedCode] = useState(false);

  // When dataset changes, ensure selectedCol is valid
  React.useEffect(() => {
    if (!dataset.columns.includes(selectedCol)) {
      setSelectedCol(numericCols[0] || dataset.columns[0]);
    }
  }, [dataset, numericCols, selectedCol]);

  // Extract numeric array
  const rawValues = useMemo(() => {
    return dataset.data.map(row => Number(row[selectedCol])).filter(v => !isNaN(v));
  }, [dataset, selectedCol]);

  const stats = useMemo(() => {
    return computeDescriptiveStats(rawValues);
  }, [rawValues]);

  const groupedTable = useMemo(() => {
    return computeGroupedFrequency(rawValues, numBins);
  }, [rawValues, numBins]);

  // Categorical frequency summary if applicable
  const categoricalCounts = useMemo(() => {
    if (categoricalCols.length === 0) return null;
    const catCol = categoricalCols[0];
    const map: Record<string, number> = {};
    dataset.data.forEach(r => {
      const val = String(r[catCol]);
      map[val] = (map[val] || 0) + 1;
    });
    const total = dataset.data.length || 1;
    return {
      col: catCol,
      entries: Object.entries(map).map(([val, count]) => ({
        val,
        count,
        percent: ((count / total) * 100).toFixed(1)
      }))
    };
  }, [dataset, categoricalCols]);

  const rCodeSnippet = `# R Script equivalent (from Rcode_Y.R)
x <- ${dataset.id}$${selectedCol}
mean(x)
median(x)
var(x)
sd(x)
summary(x)
IQR(x)
# Grouped frequency distribution table
intervals <- cut(x, breaks = ${numBins})
table(intervals)
prop.table(table(intervals)) * 100`;

  const copyRCode = () => {
    navigator.clipboard.writeText(rCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Variable Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Descriptive Statistics & Central Tendency
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ported from <span className="font-mono text-blue-600">Rcode_Y.R</span> by Yeshiwork A. (MSc.)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-slate-700">Select Variable:</label>
          <select
            value={selectedCol}
            onChange={(e) => setSelectedCol(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-blue-500 cursor-pointer"
          >
            {numericCols.map(c => (
              <option key={c} value={c}>{c} (numeric)</option>
            ))}
            {categoricalCols.map(c => (
              <option key={c} value={c}>{c} (categorical)</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Sample Mean</span>
          <span className="text-xl font-bold text-blue-600 mt-1 block">{stats.mean.toFixed(2)}</span>
          <span className="text-[10px] text-slate-400">sum(x) / length(x)</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Median</span>
          <span className="text-xl font-bold text-slate-800 mt-1 block">{stats.median.toFixed(2)}</span>
          <span className="text-[10px] text-slate-400">50th percentile</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Std. Deviation</span>
          <span className="text-xl font-bold text-indigo-600 mt-1 block">{stats.sd.toFixed(2)}</span>
          <span className="text-[10px] text-slate-400">sd(x) [variance: {stats.variance.toFixed(2)}]</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Range [Min, Max]</span>
          <span className="text-base font-bold text-slate-800 mt-1 block">[{stats.min}, {stats.max}]</span>
          <span className="text-[10px] text-slate-400">Spread: {stats.range.toFixed(1)}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">IQR [Q1, Q3]</span>
          <span className="text-base font-bold text-slate-800 mt-1 block">{stats.iqr.toFixed(2)}</span>
          <span className="text-[10px] text-slate-400">Q1: {stats.q1.toFixed(1)} | Q3: {stats.q3.toFixed(1)}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Sample Size (N)</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">{stats.n}</span>
          <span className="text-[10px] text-slate-400">valid observations</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grouped Frequency Distribution Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1.5 text-blue-600" />
                Grouped Frequency Distribution Table (1.2.1.2)
              </h3>
              <p className="text-xs text-slate-500">
                Partitioning continuous variable <code className="font-mono text-blue-600">{selectedCol}</code> into equal interval classes
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Bins / Intervals:</span>
              <div className="flex space-x-1">
                {[4, 5, 8, 10].map(bins => (
                  <button
                    key={bins}
                    onClick={() => setNumBins(bins)}
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      numBins === bins
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {bins}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Class Interval</th>
                  <th className="py-2.5 px-3 text-right">Frequency (f)</th>
                  <th className="py-2.5 px-3 text-right">Percent (%)</th>
                  <th className="py-2.5 px-3 text-right">Cumulative Freq</th>
                  <th className="py-2.5 px-3 text-right">Cumulative %</th>
                  <th className="py-2.5 px-3">Distribution Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupedTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{row.interval}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-blue-600">{row.frequency}</td>
                    <td className="py-2.5 px-3 text-right">{row.percentage.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{row.cumulativeFreq}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{row.cumulativePercent.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 w-40">
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-slate-200 font-bold bg-slate-50 text-slate-900">
                <tr>
                  <td className="py-2.5 px-3">Total</td>
                  <td className="py-2.5 px-3 text-right text-blue-600">{stats.n}</td>
                  <td className="py-2.5 px-3 text-right">100.0%</td>
                  <td className="py-2.5 px-3 text-right">{stats.n}</td>
                  <td className="py-2.5 px-3 text-right">100.0%</td>
                  <td className="py-2.5 px-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Categorical Breakdown if available */}
          {categoricalCounts && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center">
                <span>Categorical Factor: <code className="font-mono text-blue-600">{categoricalCounts.col}</code> (table() & prop.table())</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categoricalCounts.entries.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800 block truncate">{item.val}</span>
                    <span className="text-blue-600 font-bold text-sm">{item.count}</span>
                    <span className="text-slate-400 text-[10px] ml-1">({item.percent}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* R Script & R Console Output Column */}
        <div className="space-y-4">
          {/* R Code Box */}
          <div className="bg-slate-900 rounded-xl p-4 text-white shadow-xs border border-slate-800">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
              <span className="font-mono text-slate-400 text-[11px]">Rcode_Y.R Command</span>
              <button
                onClick={copyRCode}
                className="flex items-center text-xs text-slate-300 hover:text-white transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-[11px] text-sky-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {rCodeSnippet}
            </pre>
          </div>

          {/* Simulated R Console Output */}
          <div className="bg-slate-950 rounded-xl p-4 text-slate-200 border border-slate-800 font-mono text-[11px] shadow-xs">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
              <span>R Console Output</span>
              <span className="text-emerald-400">● Live R Session</span>
            </div>
            <div className="space-y-2 text-slate-300">
              <div>
                <span className="text-blue-400">&gt; summary({selectedCol})</span>
                <div className="text-amber-200 mt-0.5 grid grid-cols-6 gap-1 text-[10px] font-semibold border-b border-slate-800 pb-1">
                  <span>Min.</span>
                  <span>1st Qu.</span>
                  <span>Median</span>
                  <span>Mean</span>
                  <span>3rd Qu.</span>
                  <span>Max.</span>
                </div>
                <div className="grid grid-cols-6 gap-1 text-[10px] pt-1">
                  <span>{stats.min}</span>
                  <span>{stats.q1.toFixed(1)}</span>
                  <span>{stats.median.toFixed(1)}</span>
                  <span>{stats.mean.toFixed(1)}</span>
                  <span>{stats.q3.toFixed(1)}</span>
                  <span>{stats.max}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-blue-400">&gt; sd({selectedCol})</span>
                <div className="text-slate-100">[1] {stats.sd.toFixed(4)}</div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-blue-400">&gt; IQR({selectedCol})</span>
                <div className="text-slate-100">[1] {stats.iqr.toFixed(4)}</div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-blue-400">&gt; skewness({selectedCol})</span>
                <div className="text-slate-100">[1] {stats.skewness.toFixed(4)}</div>
              </div>
            </div>
          </div>

          {/* Research Insight Card */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-blue-950 font-semibold mb-0.5">Researcher's Note:</strong>
              When data has severe skewness (|skew| &gt; 1), the median and IQR offer more robust measures of central tendency and dispersion than the mean and standard deviation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
