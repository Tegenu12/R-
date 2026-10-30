import React, { useState, useMemo } from 'react';
import { Dataset } from '../data/datasets';
import { 
  computeTTest, 
  computeWilcoxonTest, 
  computeVarTest, 
  computeChiSquareTest,
  TTestResult,
  WilcoxonResult,
  VarTestResult,
  ChiSquareResult
} from '../lib/statistics';
import { GitCompare, CheckCircle, AlertTriangle, Copy, Terminal, ShieldAlert } from 'lucide-react';

interface HypothesisTestingProps {
  dataset: Dataset;
}

type TestType = 'independent_t' | 'paired_t' | 'wilcoxon' | 'var_test' | 'chisq';

export const HypothesisTestingModule: React.FC<HypothesisTestingProps> = ({ dataset }) => {
  const [testType, setTestType] = useState<TestType>('independent_t');

  const numericCols = useMemo(() => {
    return dataset.columns.filter(c => dataset.columnTypes[c] === 'numeric');
  }, [dataset]);

  const categoricalCols = useMemo(() => {
    return dataset.columns.filter(c => dataset.columnTypes[c] === 'categorical');
  }, [dataset]);

  const [var1, setVar1] = useState<string>(numericCols[0] || dataset.columns[0]);
  const [var2, setVar2] = useState<string>(numericCols[1] || numericCols[0] || dataset.columns[0]);
  const [cat1, setCat1] = useState<string>(categoricalCols[0] || dataset.columns[0]);
  const [cat2, setCat2] = useState<string>(categoricalCols[1] || categoricalCols[0] || dataset.columns[0]);

  React.useEffect(() => {
    if (!dataset.columns.includes(var1)) setVar1(numericCols[0] || dataset.columns[0]);
    if (!dataset.columns.includes(var2)) setVar2(numericCols[1] || numericCols[0] || dataset.columns[0]);
    if (categoricalCols.length > 0) {
      if (!dataset.columns.includes(cat1)) setCat1(categoricalCols[0]);
      if (!dataset.columns.includes(cat2)) setCat2(categoricalCols[1] || categoricalCols[0]);
    }
  }, [dataset, numericCols, categoricalCols, var1, var2, cat1, cat2]);

  const sample1 = useMemo(() => {
    return dataset.data.map(r => Number(r[var1])).filter(v => !isNaN(v));
  }, [dataset, var1]);

  const sample2 = useMemo(() => {
    return dataset.data.map(r => Number(r[var2])).filter(v => !isNaN(v));
  }, [dataset, var2]);

  const tTestResult = useMemo(() => {
    if (sample1.length === 0 || sample2.length === 0) return null;
    return computeTTest(sample1, sample2, testType === 'paired_t');
  }, [sample1, sample2, testType]);

  const wilcoxonResult = useMemo(() => {
    if (sample1.length === 0 || sample2.length === 0) return null;
    return computeWilcoxonTest(sample1, sample2);
  }, [sample1, sample2]);

  const varTestResult = useMemo(() => {
    if (sample1.length === 0 || sample2.length === 0) return null;
    return computeVarTest(sample1, sample2);
  }, [sample1, sample2]);

  const chiSqResult = useMemo(() => {
    if (categoricalCols.length < 2) return null;
    const r = dataset.data.map(d => String(d[cat1]));
    const c = dataset.data.map(d => String(d[cat2]));
    return computeChiSquareTest(r, c);
  }, [dataset, cat1, cat2, categoricalCols]);

  return (
    <div className="space-y-6">
      {/* Header & Test Type Selector */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <GitCompare className="w-5 h-5 mr-2 text-blue-600" />
              Hypothesis Testing & Inferential Statistics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Parametric and Non-Parametric hypothesis tests ported from <span className="font-mono text-blue-600">Tegenu.R</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setTestType('independent_t')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                testType === 'independent_t' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Independent t-Test
            </button>
            <button
              onClick={() => setTestType('paired_t')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                testType === 'paired_t' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paired t-Test
            </button>
            <button
              onClick={() => setTestType('wilcoxon')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                testType === 'wilcoxon' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Wilcoxon Rank-Sum
            </button>
            <button
              onClick={() => setTestType('var_test')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                testType === 'var_test' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Variance F-Test
            </button>
            <button
              onClick={() => setTestType('chisq')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                testType === 'chisq' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chi-Square Test
            </button>
          </div>
        </div>

        {/* Dynamic Variable Selection */}
        <div className="flex flex-wrap items-center gap-4 pt-3 text-xs">
          {testType !== 'chisq' ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-700">Sample 1:</span>
                <select
                  value={var1}
                  onChange={(e) => setVar1(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 focus:outline-blue-500 cursor-pointer"
                >
                  {numericCols.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-700">Sample 2:</span>
                <select
                  value={var2}
                  onChange={(e) => setVar2(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 focus:outline-blue-500 cursor-pointer"
                >
                  {numericCols.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-700">Factor 1 (Rows):</span>
                <select
                  value={cat1}
                  onChange={(e) => setCat1(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 focus:outline-blue-500 cursor-pointer"
                >
                  {categoricalCols.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-700">Factor 2 (Columns):</span>
                <select
                  value={cat2}
                  onChange={(e) => setCat2(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 focus:outline-blue-500 cursor-pointer"
                >
                  {categoricalCols.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Statistical Verdict Banner */}
          {(() => {
            let pVal = 1;
            if (testType === 'independent_t' || testType === 'paired_t') pVal = tTestResult?.pValue ?? 1;
            if (testType === 'wilcoxon') pVal = wilcoxonResult?.pValue ?? 1;
            if (testType === 'var_test') pVal = varTestResult?.pValue ?? 1;
            if (testType === 'chisq') pVal = chiSqResult?.pValue ?? 1;

            const isSig = pVal < 0.05;
            return (
              <div className={`p-4 rounded-xl border flex items-start space-x-3 shadow-2xs ${
                isSig ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                {isSig ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-bold text-sm">
                    {isSig ? 'Statistically Significant (p < 0.05)' : 'Not Statistically Significant (p ≥ 0.05)'}
                  </h3>
                  <p className="text-xs mt-0.5 opacity-90">
                    {isSig
                      ? `Reject null hypothesis H₀: There is sufficient statistical evidence that the difference is not due to random chance (p = ${pVal < 0.001 ? '< 0.001' : pVal.toFixed(4)}).`
                      : `Fail to reject null hypothesis H₀: There is insufficient evidence to conclude a true population difference exists (p = ${pVal.toFixed(4)}).`}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Detailed Metric Cards */}
          {(testType === 'independent_t' || testType === 'paired_t') && tTestResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Student's t-Test Results ({testType === 'paired_t' ? 'Paired' : 'Welch Two Sample'})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">t-Statistic</span>
                  <span className="text-lg font-bold text-blue-600">{tTestResult.tStat.toFixed(4)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Degrees of Freedom</span>
                  <span className="text-lg font-bold text-slate-800">{tTestResult.df.toFixed(2)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">p-Value</span>
                  <span className={`text-lg font-bold ${tTestResult.pValue < 0.05 ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {tTestResult.pValue < 0.0001 ? '< 0.0001' : tTestResult.pValue.toFixed(4)}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Mean Difference</span>
                  <span className="text-lg font-bold text-slate-800">{tTestResult.meanDiff.toFixed(3)}</span>
                </div>
              </div>

              <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200 text-xs text-blue-900">
                <strong>95% Confidence Interval:</strong> [{tTestResult.ciLower.toFixed(3)}, {tTestResult.ciUpper.toFixed(3)}]
                <span className="text-slate-500 ml-2">Mean 1: {tTestResult.mean1.toFixed(2)} | Mean 2: {tTestResult.mean2.toFixed(2)}</span>
              </div>
            </div>
          )}

          {testType === 'wilcoxon' && wilcoxonResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Wilcoxon Rank-Sum Test (Mann-Whitney U)
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">W / U Statistic</span>
                  <span className="text-lg font-bold text-blue-600">{wilcoxonResult.statistic.toFixed(1)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Z-Score (Normal Approx)</span>
                  <span className="text-lg font-bold text-slate-800">{wilcoxonResult.zScore.toFixed(4)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">p-Value</span>
                  <span className="text-lg font-bold text-emerald-600">{wilcoxonResult.pValue.toFixed(4)}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                H₀: The probability that an observation from group 1 exceeds one from group 2 equals 0.5 (identical median distributions).
              </p>
            </div>
          )}

          {testType === 'var_test' && varTestResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                F-Test to Compare Two Variances (var.test)
              </h3>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">F-Ratio (s₁² / s₂²)</span>
                  <span className="text-lg font-bold text-blue-600">{varTestResult.ratio.toFixed(4)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Num df</span>
                  <span className="text-lg font-bold text-slate-800">{varTestResult.df1}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Denom df</span>
                  <span className="text-lg font-bold text-slate-800">{varTestResult.df2}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">p-Value</span>
                  <span className="text-lg font-bold text-slate-800">{varTestResult.pValue.toFixed(4)}</span>
                </div>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Sample 1 Variance (s₁²): <strong>{varTestResult.var1.toFixed(3)}</strong></div>
                <div>Sample 2 Variance (s₂²): <strong>{varTestResult.var2.toFixed(3)}</strong></div>
              </div>
            </div>
          )}

          {testType === 'chisq' && chiSqResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                Chi-Square Test of Independence (chisq.test)
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">X-Squared (χ²)</span>
                  <span className="text-lg font-bold text-blue-600">{chiSqResult.chiSquare.toFixed(4)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Degrees of Freedom</span>
                  <span className="text-lg font-bold text-slate-800">{chiSqResult.df}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">p-Value</span>
                  <span className="text-lg font-bold text-slate-800">{chiSqResult.pValue.toFixed(4)}</span>
                </div>
              </div>

              {/* Observed vs Expected Contingency Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="py-2 px-3 border border-slate-200">{cat1} \ {cat2}</th>
                      {chiSqResult.colLabels.map((c, j) => (
                        <th key={j} className="py-2 px-3 border border-slate-200 text-center">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chiSqResult.rowLabels.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-800 border border-slate-200">{r}</td>
                        {chiSqResult.colLabels.map((_, j) => (
                          <td key={j} className="py-2 px-3 text-center border border-slate-200">
                            <span className="font-bold text-slate-900">{chiSqResult.observed[i][j]}</span>
                            <span className="text-[10px] text-slate-400 block">
                              (Exp: {chiSqResult.expected[i][j].toFixed(1)})
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Script & Console Snippets */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl p-4 text-white shadow-xs border border-slate-800">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
              <span className="font-mono text-slate-400 text-[11px]">R Command (Tegenu.R)</span>
              <button
                onClick={() => {
                  let code = '';
                  if (testType === 'independent_t') code = `t.test(${dataset.id}$${var1}, ${dataset.id}$${var2})`;
                  else if (testType === 'paired_t') code = `t.test(${dataset.id}$${var1}, ${dataset.id}$${var2}, paired=TRUE)`;
                  else if (testType === 'wilcoxon') code = `wilcox.test(${dataset.id}$${var1}, ${dataset.id}$${var2}, conf.int=TRUE)`;
                  else if (testType === 'var_test') code = `var.test(${dataset.id}$${var1}, ${dataset.id}$${var2})`;
                  else if (testType === 'chisq') code = `chisq.test(table(${dataset.id}$${cat1}, ${dataset.id}$${cat2}))`;
                  navigator.clipboard.writeText(code);
                }}
                className="text-xs text-slate-300 hover:text-white"
              >
                Copy Code
              </button>
            </div>
            <pre className="font-mono text-[11px] text-sky-300 whitespace-pre-wrap leading-relaxed">
              {testType === 'independent_t' && `t.test(${dataset.id}$${var1}, ${dataset.id}$${var2})`}
              {testType === 'paired_t' && `t.test(${dataset.id}$${var1}, ${dataset.id}$${var2}, paired = TRUE)`}
              {testType === 'wilcoxon' && `wilcox.test(${dataset.id}$${var1}, ${dataset.id}$${var2}, conf.int = TRUE)`}
              {testType === 'var_test' && `var.test(${dataset.id}$${var1}, ${dataset.id}$${var2})`}
              {testType === 'chisq' && `table_data <- table(${dataset.id}$${cat1}, ${dataset.id}$${cat2})\nchisq.test(table_data)`}
            </pre>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 text-slate-200 border border-slate-800 font-mono text-[11px] shadow-xs">
            <div className="pb-1.5 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
              Simulated R Terminal Output
            </div>
            {testType === 'independent_t' && tTestResult && (
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
{`	Welch Two Sample t-test

data:  ${var1} and ${var2}
t = ${tTestResult.tStat.toFixed(4)}, df = ${tTestResult.df.toFixed(2)}, p-value = ${tTestResult.pValue.toExponential(4)}
alternative hypothesis: true difference in means is not equal to 0
95 percent confidence interval:
 ${tTestResult.ciLower.toFixed(4)}  ${tTestResult.ciUpper.toFixed(4)}
sample estimates:
mean of x mean of y 
  ${tTestResult.mean1.toFixed(3)}   ${tTestResult.mean2.toFixed(3)}`}
              </pre>
            )}
            {testType === 'chisq' && chiSqResult && (
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
{`	Pearson's Chi-squared test

data:  ${cat1} and ${cat2}
X-squared = ${chiSqResult.chiSquare.toFixed(4)}, df = ${chiSqResult.df}, p-value = ${chiSqResult.pValue.toExponential(4)}`}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
