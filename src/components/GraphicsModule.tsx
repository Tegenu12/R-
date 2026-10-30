import React, { useState, useMemo } from 'react';
import { Dataset } from '../data/datasets';
import { computeDescriptiveStats, dnorm } from '../lib/statistics';
import { BarChart, PieChart, ScatterChart, Box, Layers, Download } from 'lucide-react';

interface GraphicsModuleProps {
  dataset: Dataset;
}

type PlotType = 'histogram' | 'boxplot' | 'scatterplot' | 'barplot' | 'projection3d';

export const GraphicsModule: React.FC<GraphicsModuleProps> = ({ dataset }) => {
  const [plotType, setPlotType] = useState<PlotType>('histogram');

  const numericCols = useMemo(() => {
    return dataset.columns.filter(c => dataset.columnTypes[c] === 'numeric');
  }, [dataset]);

  const categoricalCols = useMemo(() => {
    return dataset.columns.filter(c => dataset.columnTypes[c] === 'categorical');
  }, [dataset]);

  const [xCol, setXCol] = useState<string>(numericCols[0] || dataset.columns[0]);
  const [yCol, setYCol] = useState<string>(numericCols[1] || numericCols[0] || dataset.columns[0]);
  const [groupCol, setGroupCol] = useState<string>(categoricalCols[0] || '');
  const [showNormalCurve, setShowNormalCurve] = useState(true);
  const [numBins, setNumBins] = useState(10);
  const [barMode, setBarMode] = useState<'grouped' | 'stacked'>('grouped');

  // Ensure valid columns when dataset changes
  React.useEffect(() => {
    if (!dataset.columns.includes(xCol)) setXCol(numericCols[0] || dataset.columns[0]);
    if (!dataset.columns.includes(yCol)) setYCol(numericCols[1] || numericCols[0] || dataset.columns[0]);
    if (categoricalCols.length > 0 && (!groupCol || !dataset.columns.includes(groupCol))) {
      setGroupCol(categoricalCols[0]);
    }
  }, [dataset, numericCols, categoricalCols, xCol, yCol, groupCol]);

  // Extract data for X
  const xValues = useMemo(() => {
    return dataset.data.map(r => Number(r[xCol])).filter(v => !isNaN(v));
  }, [dataset, xCol]);

  const yValues = useMemo(() => {
    return dataset.data.map(r => Number(r[yCol])).filter(v => !isNaN(v));
  }, [dataset, yCol]);

  const statsX = useMemo(() => computeDescriptiveStats(xValues), [xValues]);

  // Histogram calculation
  const histData = useMemo(() => {
    if (xValues.length === 0) return { bins: [], maxCount: 0, binWidth: 1, min: 0, max: 0 };
    const min = statsX.min;
    const max = statsX.max;
    const binWidth = (max - min) / numBins || 1;
    const bins: { x0: number; x1: number; mid: number; count: number; normalY: number }[] = [];

    let maxCount = 0;
    for (let i = 0; i < numBins; i++) {
      const x0 = min + i * binWidth;
      const x1 = i === numBins - 1 ? max : min + (i + 1) * binWidth;
      const mid = (x0 + x1) / 2;
      const count = xValues.filter(v => i === numBins - 1 ? (v >= x0 && v <= x1) : (v >= x0 && v < x1)).length;
      if (count > maxCount) maxCount = count;

      // Normal theoretical height
      const normalDensity = dnorm(mid, statsX.mean, statsX.sd || 1);
      const normalY = normalDensity * xValues.length * binWidth;

      bins.push({ x0, x1, mid, count, normalY });
    }

    return { bins, maxCount, binWidth, min, max };
  }, [xValues, statsX, numBins]);

  // Boxplot groups
  const boxplotGroups = useMemo(() => {
    if (!groupCol) {
      return [{ group: xCol, stats: statsX }];
    }
    const grouped: Record<string, number[]> = {};
    dataset.data.forEach(r => {
      const g = String(r[groupCol]);
      const val = Number(r[xCol]);
      if (!isNaN(val)) {
        if (!grouped[g]) grouped[g] = [];
        grouped[g].push(val);
      }
    });
    return Object.entries(grouped).map(([group, vals]) => ({
      group,
      stats: computeDescriptiveStats(vals)
    }));
  }, [dataset, groupCol, xCol, statsX]);

  // Scatter plot points
  const scatterPoints = useMemo(() => {
    const pts: { x: number; y: number; label?: string }[] = [];
    const minLen = Math.min(dataset.data.length, xValues.length, yValues.length);
    for (let i = 0; i < minLen; i++) {
      const x = Number(dataset.data[i][xCol]);
      const y = Number(dataset.data[i][yCol]);
      if (!isNaN(x) && !isNaN(y)) {
        pts.push({ x, y, label: String(dataset.data[i].car || `Obs ${i + 1}`) });
      }
    }
    return pts;
  }, [dataset, xCol, yCol, xValues, yValues]);

  // Regression line for scatter plot
  const regLine = useMemo(() => {
    if (scatterPoints.length < 2) return null;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    const n = scatterPoints.length;
    scatterPoints.forEach(p => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
    });
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
    const intercept = (sumY - slope * sumX) / n;
    const minX = Math.min(...scatterPoints.map(p => p.x));
    const maxX = Math.max(...scatterPoints.map(p => p.x));
    return {
      slope,
      intercept,
      x1: minX,
      y1: intercept + slope * minX,
      x2: maxX,
      y2: intercept + slope * maxX
    };
  }, [scatterPoints]);

  return (
    <div className="space-y-6">
      {/* Header & Plot Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-600" />
              Statistical Graphics in R (2.0)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-resolution visualizations ported from <span className="font-mono text-blue-600">Rcode_Y.R</span> & <span className="font-mono text-blue-600">Tegenu.R</span>
            </p>
          </div>

          {/* Plot Type Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setPlotType('histogram')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center transition-colors ${
                plotType === 'histogram' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart className="w-3.5 h-3.5 mr-1.5" />
              Histogram & Fit
            </button>
            <button
              onClick={() => setPlotType('boxplot')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center transition-colors ${
                plotType === 'boxplot' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Box className="w-3.5 h-3.5 mr-1.5" />
              Boxplot
            </button>
            <button
              onClick={() => setPlotType('scatterplot')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center transition-colors ${
                plotType === 'scatterplot' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ScatterChart className="w-3.5 h-3.5 mr-1.5" />
              Scatter & Trend
            </button>
            <button
              onClick={() => setPlotType('barplot')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center transition-colors ${
                plotType === 'barplot' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Grouped/Stacked Bar
            </button>
          </div>
        </div>

        {/* Dynamic Variable Selection Row */}
        <div className="flex flex-wrap items-center gap-4 pt-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Primary Variable (X):</span>
            <select
              value={xCol}
              onChange={(e) => setXCol(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 focus:outline-blue-500 cursor-pointer"
            >
              {numericCols.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {(plotType === 'scatterplot' || plotType === 'barplot') && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-700">Secondary Variable (Y):</span>
              <select
                value={yCol}
                onChange={(e) => setYCol(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 focus:outline-blue-500 cursor-pointer"
              >
                {numericCols.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {plotType === 'boxplot' && categoricalCols.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-700">Group By Factor:</span>
              <select
                value={groupCol}
                onChange={(e) => setGroupCol(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 focus:outline-blue-500 cursor-pointer"
              >
                <option value="">None (Overall)</option>
                {categoricalCols.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {plotType === 'histogram' && (
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showNormalCurve}
                  onChange={(e) => setShowNormalCurve(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">Normal Curve (dnorm)</span>
              </label>
              <div className="flex items-center space-x-1">
                <span className="text-slate-500">Bins:</span>
                {[8, 10, 15, 20].map(b => (
                  <button
                    key={b}
                    onClick={() => setNumBins(b)}
                    className={`px-1.5 py-0.5 rounded text-[11px] ${
                      numBins === b ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {plotType === 'barplot' && (
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Mode:</span>
              <button
                onClick={() => setBarMode('grouped')}
                className={`px-2 py-0.5 rounded text-xs ${barMode === 'grouped' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 text-slate-700'}`}
              >
                Grouped (beside=TRUE)
              </button>
              <button
                onClick={() => setBarMode('stacked')}
                className={`px-2 py-0.5 rounded text-xs ${barMode === 'stacked' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 text-slate-700'}`}
              >
                Stacked
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas & Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              {plotType === 'histogram' && `Histogram of ${xCol} with Theoretical Normal Curve`}
              {plotType === 'boxplot' && `Boxplots of ${xCol}${groupCol ? ` by ${groupCol}` : ''}`}
              {plotType === 'scatterplot' && `Scatter Plot of ${yCol} vs ${xCol} with OLS Fit`}
              {plotType === 'barplot' && `${barMode === 'grouped' ? 'Grouped' : 'Stacked'} Bar Chart`}
            </h3>
            <span className="text-xs text-slate-400 font-mono">par(mar=c(4,4,2,2))</span>
          </div>

          {/* SVG Visualizer */}
          <div className="w-full flex items-center justify-center py-4 overflow-x-auto">
            {plotType === 'histogram' && (
              <svg viewBox="0 0 600 360" className="w-full max-w-xl h-auto font-sans">
                {/* Background Grid & Axes */}
                <rect x="60" y="20" width="510" height="280" fill="#f8fafc" rx="4" />
                <line x1="60" y1="300" x2="570" y2="300" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="60" y1="20" x2="60" y2="300" stroke="#cbd5e1" strokeWidth="2" />

                {/* Bars */}
                {histData.bins.map((bin, i) => {
                  const width = (510 / histData.bins.length) - 4;
                  const x = 60 + i * (510 / histData.bins.length) + 2;
                  const height = histData.maxCount > 0 ? (bin.count / (histData.maxCount * 1.15)) * 260 : 0;
                  const y = 300 - height;
                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill="#3b82f6"
                        fillOpacity="0.85"
                        stroke="#1d4ed8"
                        strokeWidth="1.5"
                        rx="2"
                      />
                      <text
                        x={x + width / 2}
                        y={y - 5}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="600"
                        fill="#1e293b"
                      >
                        {bin.count > 0 ? bin.count : ''}
                      </text>
                      <text
                        x={x + width / 2}
                        y="318"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#64748b"
                      >
                        {bin.mid.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Normal Bell Curve Overlay */}
                {showNormalCurve && histData.bins.length > 0 && (
                  <path
                    d={histData.bins.map((b, i) => {
                      const x = 60 + i * (510 / histData.bins.length) + (510 / histData.bins.length) / 2;
                      const normHeight = (b.normalY / (histData.maxCount * 1.15)) * 260;
                      const y = Math.max(20, 300 - normHeight);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Axis Labels */}
                <text x="315" y="348" textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155">
                  {xCol}
                </text>
                <text x="-160" y="24" transform="rotate(-90)" textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155">
                  Frequency
                </text>
              </svg>
            )}

            {plotType === 'boxplot' && (
              <svg viewBox="0 0 600 360" className="w-full max-w-xl h-auto font-sans">
                <rect x="60" y="20" width="510" height="280" fill="#f8fafc" rx="4" />
                <line x1="60" y1="300" x2="570" y2="300" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="60" y1="20" x2="60" y2="300" stroke="#cbd5e1" strokeWidth="2" />

                {boxplotGroups.map((g, i) => {
                  const numGroups = boxplotGroups.length;
                  const slotWidth = 510 / numGroups;
                  const centerX = 60 + i * slotWidth + slotWidth / 2;
                  const boxWidth = Math.min(80, slotWidth * 0.55);

                  const globalMin = Math.min(...boxplotGroups.map(bg => bg.stats.min));
                  const globalMax = Math.max(...boxplotGroups.map(bg => bg.stats.max));
                  const range = globalMax - globalMin || 1;

                  const scaleY = (v: number) => 300 - ((v - globalMin) / range) * 250;

                  const yMin = scaleY(g.stats.min);
                  const yQ1 = scaleY(g.stats.q1);
                  const yMed = scaleY(g.stats.median);
                  const yQ3 = scaleY(g.stats.q3);
                  const yMax = scaleY(g.stats.max);

                  return (
                    <g key={i}>
                      {/* Whiskers */}
                      <line x1={centerX} y1={yMin} x2={centerX} y2={yQ1} stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
                      <line x1={centerX} y1={yQ3} x2={centerX} y2={yMax} stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
                      {/* Whisker Caps */}
                      <line x1={centerX - boxWidth / 4} y1={yMin} x2={centerX + boxWidth / 4} y2={yMin} stroke="#475569" strokeWidth="2" />
                      <line x1={centerX - boxWidth / 4} y1={yMax} x2={centerX + boxWidth / 4} y2={yMax} stroke="#475569" strokeWidth="2" />
                      {/* Box Body (Q1 to Q3) */}
                      <rect
                        x={centerX - boxWidth / 2}
                        y={yQ3}
                        width={boxWidth}
                        height={Math.max(4, yQ1 - yQ3)}
                        fill="#bae6fd"
                        stroke="#0284c7"
                        strokeWidth="2"
                        rx="2"
                      />
                      {/* Median Bar */}
                      <line
                        x1={centerX - boxWidth / 2}
                        y1={yMed}
                        x2={centerX + boxWidth / 2}
                        y2={yMed}
                        stroke="#0369a1"
                        strokeWidth="3"
                      />
                      {/* Label */}
                      <text x={centerX} y="322" textAnchor="middle" fontSize="11" fontWeight="600" fill="#334155">
                        {g.group}
                      </text>
                      <text x={centerX} y={yMed - 6} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1">
                        {g.stats.median.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                <text x="315" y="348" textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155">
                  {groupCol || 'Overall Variable'}
                </text>
                <text x="-160" y="24" transform="rotate(-90)" textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155">
                  {xCol}
                </text>
              </svg>
            )}

            {plotType === 'scatterplot' && (
              <svg viewBox="0 0 600 360" className="w-full max-w-xl h-auto font-sans">
                <rect x="60" y="20" width="510" height="280" fill="#f8fafc" rx="4" />
                <line x1="60" y1="300" x2="570" y2="300" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="60" y1="20" x2="60" y2="300" stroke="#cbd5e1" strokeWidth="2" />

                {(() => {
                  const minX = Math.min(...scatterPoints.map(p => p.x));
                  const maxX = Math.max(...scatterPoints.map(p => p.x));
                  const minY = Math.min(...scatterPoints.map(p => p.y));
                  const maxY = Math.max(...scatterPoints.map(p => p.y));
                  const rangeX = maxX - minX || 1;
                  const rangeY = maxY - minY || 1;

                  const mapX = (v: number) => 80 + ((v - minX) / rangeX) * 460;
                  const mapY = (v: number) => 280 - ((v - minY) / rangeY) * 240;

                  return (
                    <>
                      {/* Trendline */}
                      {regLine && (
                        <line
                          x1={mapX(regLine.x1)}
                          y1={mapY(regLine.y1)}
                          x2={mapX(regLine.x2)}
                          y2={mapY(regLine.y2)}
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeDasharray="5 3"
                        />
                      )}
                      {/* Data Points */}
                      {scatterPoints.map((pt, i) => (
                        <circle
                          key={i}
                          cx={mapX(pt.x)}
                          cy={mapY(pt.y)}
                          r="5"
                          fill="#3b82f6"
                          stroke="#1e40af"
                          strokeWidth="1.5"
                          className="hover:r-7 transition-all cursor-pointer"
                        >
                          <title>{`${pt.label}: (${pt.x}, ${pt.y})`}</title>
                        </circle>
                      ))}
                    </>
                  );
                })()}

                <text x="315" y="348" textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155">
                  {xCol}
                </text>
                <text x="-160" y="24" transform="rotate(-90)" textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155">
                  {yCol}
                </text>
              </svg>
            )}

            {plotType === 'barplot' && (
              <svg viewBox="0 0 600 360" className="w-full max-w-xl h-auto font-sans">
                <rect x="60" y="20" width="510" height="280" fill="#f8fafc" rx="4" />
                <line x1="60" y1="300" x2="570" y2="300" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="60" y1="20" x2="60" y2="300" stroke="#cbd5e1" strokeWidth="2" />

                {dataset.data.slice(0, 10).map((row, i) => {
                  const valX = Number(row[xCol]) || 0;
                  const valY = Number(row[yCol]) || 0;
                  const maxVal = Math.max(1, ...dataset.data.map(r => Math.max(Number(r[xCol]) || 0, Number(r[yCol]) || 0)));
                  const slotWidth = 510 / Math.min(10, dataset.data.length);
                  const x = 60 + i * slotWidth + slotWidth * 0.15;

                  if (barMode === 'grouped') {
                    const bw = slotWidth * 0.35;
                    const h1 = (valX / (maxVal * 1.1)) * 260;
                    const h2 = (valY / (maxVal * 1.1)) * 260;
                    return (
                      <g key={i}>
                        <rect x={x} y={300 - h1} width={bw} height={h1} fill="#3b82f6" rx="2" />
                        <rect x={x + bw + 2} y={300 - h2} width={bw} height={h2} fill="#10b981" rx="2" />
                        <text x={x + bw} y="318" textAnchor="middle" fontSize="9" fill="#64748b">
                          #{i + 1}
                        </text>
                      </g>
                    );
                  } else {
                    const bw = slotWidth * 0.6;
                    const h1 = (valX / (maxVal * 2.2)) * 260;
                    const h2 = (valY / (maxVal * 2.2)) * 260;
                    return (
                      <g key={i}>
                        <rect x={x} y={300 - h1} width={bw} height={h1} fill="#3b82f6" rx="2" />
                        <rect x={x} y={300 - h1 - h2} width={bw} height={h2} fill="#10b981" rx="2" />
                        <text x={x + bw / 2} y="318" textAnchor="middle" fontSize="9" fill="#64748b">
                          #{i + 1}
                        </text>
                      </g>
                    );
                  }
                })}

                {/* Legend */}
                <g transform="translate(420, 30)">
                  <rect x="0" y="0" width="12" height="12" fill="#3b82f6" rx="2" />
                  <text x="18" y="10" fontSize="10" fill="#334155">{xCol}</text>
                  <rect x="0" y="18" width="12" height="12" fill="#10b981" rx="2" />
                  <text x="18" y="28" fontSize="10" fill="#334155">{yCol}</text>
                </g>
              </svg>
            )}
          </div>
        </div>

        {/* Script & Parameter Details */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl p-4 text-white shadow-xs border border-slate-800">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
              <span className="font-mono text-slate-400 text-[11px]">R Plotting Script</span>
              <button
                onClick={() => {
                  const code = plotType === 'histogram'
                    ? `hist(${dataset.id}$${xCol}, breaks=${numBins}, col="lightblue", main="Histogram with Normal Fit")\nxfit <- seq(min(x), max(x), length=40)\nlines(xfit, dnorm(xfit, mean(x), sd(x)), col="red", lwd=2)`
                    : plotType === 'boxplot'
                    ? `boxplot(${dataset.id}$${xCol}${groupCol ? ` ~ ${dataset.id}$${groupCol}` : ''}, col="lightblue", main="Boxplot")`
                    : `plot(${dataset.id}$${xCol}, ${dataset.id}$${yCol}, pch=19, col="blue")\nabline(lm(${dataset.id}$${yCol} ~ ${dataset.id}$${xCol}), col="red", lty=2)`;
                  navigator.clipboard.writeText(code);
                }}
                className="text-xs text-slate-300 hover:text-white"
              >
                Copy Code
              </button>
            </div>
            <pre className="font-mono text-[11px] text-sky-300 whitespace-pre-wrap leading-relaxed">
              {plotType === 'histogram' && `# Histogram with Normal Curve
hist(${dataset.id}$${xCol}, breaks = ${numBins},
     col = "lightblue", border = "black",
     main = "Histogram with Normal Curve",
     xlab = "${xCol}", freq = FALSE)
curve(dnorm(x, mean = mean(${dataset.id}$${xCol}), 
      sd = sd(${dataset.id}$${xCol})), 
      col = "red", lwd = 2, add = TRUE)`}

              {plotType === 'boxplot' && `# Boxplot
boxplot(${dataset.id}$${xCol}${groupCol ? ` ~ ${dataset.id}$${groupCol}` : ''},
        col = "lightblue",
        xlab = "${groupCol || xCol}",
        ylab = "${xCol}",
        main = "Boxplots of ${xCol}")`}

              {plotType === 'scatterplot' && `# Scatter Plot with Linear Trend
plot(${dataset.id}$${xCol}, ${dataset.id}$${yCol},
     xlab = "${xCol}", ylab = "${yCol}",
     pch = 19, col = "blue",
     main = "Scatter Plot with Trendline")
abline(lm(${dataset.id}$${yCol} ~ ${dataset.id}$${xCol}), 
       col = "red", lty = 2, lwd = 2)`}

              {plotType === 'barplot' && `# Grouped & Stacked Barplots
counts <- table(${dataset.id}$${xCol}, ${dataset.id}$${yCol})
barplot(counts, 
        beside = ${barMode === 'grouped' ? 'TRUE' : 'FALSE'},
        col = c("blue", "green", "red"),
        legend = rownames(counts))`}
            </pre>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs shadow-2xs space-y-2">
            <h4 className="font-bold text-slate-900">Interpretation & Visual Diagnostics</h4>
            <p className="text-slate-600 leading-relaxed">
              {plotType === 'histogram' && 'Look for skewness, bi-modality, and tail behavior. If the empirical bars deviate markedly from the Gaussian red curve, non-parametric tests or data transformations may be indicated.'}
              {plotType === 'boxplot' && 'The bold center line shows the median, the box spans the interquartile range (IQR = Q3 - Q1), and the whiskers extend to 1.5 × IQR. Points outside whiskers represent potential outliers.'}
              {plotType === 'scatterplot' && `The red dashed line represents the ordinary least squares (OLS) regression line. Current slope: ${regLine?.slope.toFixed(3) || 'N/A'}.`}
              {plotType === 'barplot' && 'Categorical counts comparing group totals. Grouped plots preserve individual level comparisons while stacked plots illustrate total aggregate frequency.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
