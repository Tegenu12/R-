import React, { useMemo } from 'react';
import { DATASETS } from '../data/datasets';
import { computeTimeSeriesDecomposition } from '../lib/statistics';
import { Clock, TrendingUp, Activity, CheckCircle, BarChart3 } from 'lucide-react';

export const TimeSeriesModule: React.FC = () => {
  const airPassengersData = DATASETS.AirPassengers.data.map(d => Number(d.Passengers));

  const decomp = useMemo(() => {
    return computeTimeSeriesDecomposition(airPassengersData, 12);
  }, [airPassengersData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Time Series Analysis & Forecasting (AirPassengers)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ported from <span className="font-mono text-blue-600">Tegenu.R</span>: <code className="bg-slate-100 px-1 py-0.5 rounded">decompose(ts)</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">auto.arima()</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">acf()</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">MannKendall()</code>
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Mann-Kendall Trend</span>
          <span className="text-xl font-bold text-blue-600 mt-1 block">Z = {decomp.mannKendallZ.toFixed(2)}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Significant upward trend (p &lt; 0.001)</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Stationarity (ADF)</span>
          <span className="text-xl font-bold text-slate-800 mt-1 block">{decomp.adfStat}</span>
          <span className="text-[10px] text-amber-600 font-semibold">p = {decomp.adfPValue} (Non-stationary)</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Periodicity / Season</span>
          <span className="text-xl font-bold text-indigo-600 mt-1 block">12 Months</span>
          <span className="text-[10px] text-slate-400">Monthly airline seasonality</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Series Length</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">{airPassengersData.length}</span>
          <span className="text-[10px] text-slate-400">1949 to 1960 (12 years)</span>
        </div>
      </div>

      {/* Classical Multiplicative Decomposition 4-Panel Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Multiplicative Decomposition Components: Observed = Trend × Seasonal × Irregular
          </h3>
          <span className="text-xs font-mono text-slate-500">plot(decompose(ts, "multiplicative"))</span>
        </div>

        {/* 4 SVG Stacked Subplots */}
        <div className="space-y-3">
          {/* 1. Observed */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700 block mb-1">1. Observed Series</span>
            <svg viewBox="0 0 700 80" className="w-full h-auto">
              <path
                d={decomp.observed.map((val, i) => {
                  const x = 20 + (i / (decomp.observed.length - 1)) * 660;
                  const y = 70 - ((val - 100) / 150) * 60;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${Math.max(10, Math.min(75, y))}`;
                }).join(' ')}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* 2. Trend */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700 block mb-1">2. Trend Component (Centered Moving Average)</span>
            <svg viewBox="0 0 700 80" className="w-full h-auto">
              <path
                d={decomp.trend.map((val, i) => {
                  if (val === null) return '';
                  const x = 20 + (i / (decomp.observed.length - 1)) * 660;
                  const y = 70 - ((val - 100) / 150) * 60;
                  return `${i === 6 ? 'M' : 'L'} ${x} ${Math.max(10, Math.min(75, y))}`;
                }).filter(Boolean).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* 3. Seasonal */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700 block mb-1">3. Seasonal Component (Annual Cycles)</span>
            <svg viewBox="0 0 700 80" className="w-full h-auto">
              <line x1="20" y1="40" x2="680" y2="40" stroke="#cbd5e1" strokeDasharray="3 3" />
              <path
                d={decomp.seasonal.map((val, i) => {
                  const x = 20 + (i / (decomp.seasonal.length - 1)) * 660;
                  const y = 40 - (val - 1) * 70;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* 4. Irregular / Random */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700 block mb-1">4. Irregular / Random Remainder</span>
            <svg viewBox="0 0 700 80" className="w-full h-auto">
              <line x1="20" y1="40" x2="680" y2="40" stroke="#cbd5e1" strokeDasharray="3 3" />
              <path
                d={decomp.irregular.map((val, i) => {
                  if (val === null) return '';
                  const x = 20 + (i / (decomp.observed.length - 1)) * 660;
                  const y = 40 - (val - 1) * 120;
                  return `${i === 6 ? 'M' : 'L'} ${x} ${Math.max(10, Math.min(70, y))}`;
                }).filter(Boolean).join(' ')}
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ACF, PACF & ARIMA Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Autocorrelation (ACF) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
            <span>Autocorrelation Function (ACF)</span>
            <span className="text-xs text-slate-400 font-mono">acf(AirPassengers)</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Dashed blue lines indicate 95% Bartlett confidence limits (±1.96/√N). Slow decay confirms non-stationarity.
          </p>
          <svg viewBox="0 0 400 200" className="w-full h-auto font-sans">
            <rect x="30" y="10" width="350" height="160" fill="#f8fafc" rx="3" />
            <line x1="30" y1="90" x2="380" y2="90" stroke="#94a3b8" />
            <line x1="30" y1={90 - decomp.ciAcf * 70} x2="380" y2={90 - decomp.ciAcf * 70} stroke="#3b82f6" strokeDasharray="3 3" />
            <line x1="30" y1={90 + decomp.ciAcf * 70} x2="380" y2={90 + decomp.ciAcf * 70} stroke="#3b82f6" strokeDasharray="3 3" />

            {decomp.acf.slice(0, 16).map((item, i) => {
              const x = 45 + i * 21;
              const y = 90 - item.val * 70;
              return (
                <g key={i}>
                  <line x1={x} y1="90" x2={x} y2={y} stroke="#1e293b" strokeWidth="2" />
                  <circle cx={x} cy={y} r="2.5" fill="#1e293b" />
                  <text x={x} y="182" textAnchor="middle" fontSize="9" fill="#64748b">{item.lag}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ARIMA 12-Month Forecast */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
            <span>12-Month Projected Forecast (auto.arima)</span>
            <span className="text-xs text-slate-400 font-mono">forecast(mymodel, h=12)</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Point estimates with shaded 95% prediction confidence intervals.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2.5">Horizon</th>
                  <th className="py-2 px-2.5 text-right">Point Forecast</th>
                  <th className="py-2 px-2.5 text-right text-slate-500">Lo 95</th>
                  <th className="py-2 px-2.5 text-right text-slate-500">Hi 95</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {decomp.forecast12.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-1.5 px-2.5 font-semibold text-slate-700">Month +{f.period}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-blue-600">{f.pred}k</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-500">{f.lower95}k</td>
                    <td className="py-1.5 px-2.5 text-right text-slate-500">{f.upper95}k</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
