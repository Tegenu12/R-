import React, { useState, useMemo } from 'react';
import { Dataset } from '../data/datasets';
import { computeOneWayAnova } from '../lib/statistics';
import { GitFork, CheckCircle, AlertTriangle, Layers, BookOpen } from 'lucide-react';

interface AnovaModuleProps {
  dataset: Dataset;
}

export const AnovaModule: React.FC<AnovaModuleProps> = ({ dataset }) => {
  const numericCols = useMemo(() => {
    return dataset.columns.filter(c => dataset.columnTypes[c] === 'numeric');
  }, [dataset]);

  const categoricalCols = useMemo(() => {
    return dataset.columns.filter(c => dataset.columnTypes[c] === 'categorical');
  }, [dataset]);

  const [responseVar, setResponseVar] = useState<string>(numericCols[0] || dataset.columns[0]);
  const [factorVar, setFactorVar] = useState<string>(categoricalCols[0] || dataset.columns[1] || dataset.columns[0]);

  React.useEffect(() => {
    if (!dataset.columns.includes(responseVar)) setResponseVar(numericCols[0] || dataset.columns[0]);
    if (!dataset.columns.includes(factorVar) && categoricalCols.length > 0) setFactorVar(categoricalCols[0]);
  }, [dataset, numericCols, categoricalCols, responseVar, factorVar]);

  // Group data by factor
  const groupedData = useMemo(() => {
    const map: Record<string, number[]> = {};
    dataset.data.forEach(row => {
      const g = String(row[factorVar]);
      const y = Number(row[responseVar]);
      if (!isNaN(y)) {
        if (!map[g]) map[g] = [];
        map[g].push(y);
      }
    });
    return map;
  }, [dataset, factorVar, responseVar]);

  const anovaResult = useMemo(() => {
    return computeOneWayAnova(groupedData);
  }, [groupedData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <GitFork className="w-5 h-5 mr-2 text-blue-600" />
              One-Way Analysis of Variance (ANOVA) & Post-Hoc Tests
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ported from <span className="font-mono text-blue-600">Tegenu.R</span>: <code className="bg-slate-100 px-1 py-0.5 rounded">aov(y ~ factor)</code> & <code className="bg-slate-100 px-1 py-0.5 rounded">LSD.test</code>
            </p>
          </div>

          {/* Model formula picker */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-700">Response (Y):</span>
              <select
                value={responseVar}
                onChange={(e) => setResponseVar(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800"
              >
                {numericCols.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <span className="text-slate-400 font-bold">~</span>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-700">Factor (X):</span>
              <select
                value={factorVar}
                onChange={(e) => setFactorVar(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800"
              >
                {categoricalCols.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Verdict */}
          <div className={`p-4 rounded-xl border flex items-start space-x-3 shadow-2xs ${
            anovaResult.significant ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}>
            {anovaResult.significant ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-bold text-sm">
                {anovaResult.significant ? 'Significant Treatment Effect (p < 0.05)' : 'No Significant Difference Between Groups (p ≥ 0.05)'}
              </h3>
              <p className="text-xs mt-0.5 opacity-90">
                F({anovaResult.dfBetween}, {anovaResult.dfWithin}) = {anovaResult.fStat.toFixed(3)}, p = {anovaResult.pValue < 0.0001 ? '< 0.0001' : anovaResult.pValue.toFixed(4)}.
                {anovaResult.significant ? ' Reject H₀: At least one group mean differs significantly.' : ' Fail to reject H₀.'}
              </p>
            </div>
          </div>

          {/* Standard ANOVA Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>ANOVA Summary Table (summary(aov(...)))</span>
              <span className="text-xs text-blue-600 font-mono">Signif. codes: 0 '***' 0.001 '**' 0.01 '*' 0.05 '.'</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Source</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Df</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Sum Sq</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Mean Sq</th>
                    <th className="py-2.5 px-3 text-right font-semibold">F value</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Pr(&gt;F)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-blue-700">{factorVar}</td>
                    <td className="py-2.5 px-3 text-right">{anovaResult.dfBetween}</td>
                    <td className="py-2.5 px-3 text-right">{anovaResult.ssBetween.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right">{anovaResult.msBetween.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{anovaResult.fStat.toFixed(3)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                      {anovaResult.pValue < 0.001 ? '< 0.001 ***' : `${anovaResult.pValue.toFixed(4)} *`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500">Residuals</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">{anovaResult.dfWithin}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">{anovaResult.ssWithin.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">{anovaResult.msWithin.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Group Means & Post-Hoc LSD Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 mb-3 pb-1 border-b border-slate-100">
                Group Summary Means
              </h4>
              <div className="space-y-2">
                {anovaResult.groups.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 text-xs">
                    <span className="font-semibold text-slate-800">{g.name}</span>
                    <span className="text-slate-500">n = {g.n}</span>
                    <span className="font-bold text-blue-600">Mean: {g.mean.toFixed(2)}</span>
                    <span className="text-slate-400">sd: {g.sd.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 mb-3 pb-1 border-b border-slate-100">
                Fisher's LSD Pairwise Mean Separation
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {anovaResult.lsdDifferences?.map((lsd, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 text-xs">
                    <span className="text-slate-700">{lsd.pair}</span>
                    <span className="font-mono text-slate-800 font-medium">Δ = {lsd.diff}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      lsd.significant ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {lsd.significant ? 'Significant' : 'Not Sig.'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Script & Notes */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl p-4 text-white shadow-xs border border-slate-800">
            <div className="pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
              R ANOVA Code (Tegenu.R)
            </div>
            <pre className="font-mono text-[11px] text-sky-300 whitespace-pre-wrap leading-relaxed">
{`# Fit One-Way ANOVA Model
model <- aov(${responseVar} ~ ${factorVar}, data = ${dataset.id})
summary(model)

# Post-Hoc LSD Test
library(agricolae)
lsd <- LSD.test(model, "${factorVar}", p.adj = "none")
summary(lsd)

# Homogeneity of Variances Test
bartlett.test(${responseVar} ~ ${factorVar}, data = ${dataset.id})`}
            </pre>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 text-slate-200 border border-slate-800 font-mono text-[11px] shadow-xs">
            <div className="pb-1.5 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
              R Console Session
            </div>
            <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
{`> aov.res <- aov(${responseVar} ~ ${factorVar}, data = ${dataset.id})
> summary(aov.res)
            Df Sum Sq Mean Sq F value Pr(>F)
${factorVar.padEnd(11)} ${anovaResult.dfBetween} ${anovaResult.ssBetween.toFixed(1).padStart(6)}  ${anovaResult.msBetween.toFixed(1).padStart(6)}   ${anovaResult.fStat.toFixed(2).padStart(5)} ${anovaResult.pValue < 0.001 ? '<0.001 ***' : anovaResult.pValue.toFixed(4)}
Residuals   ${anovaResult.dfWithin} ${anovaResult.ssWithin.toFixed(1).padStart(6)}  ${anovaResult.msWithin.toFixed(1).padStart(6)}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
