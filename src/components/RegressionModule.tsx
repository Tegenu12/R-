import React, { useState, useMemo } from 'react';
import { Dataset } from '../data/datasets';
import { 
  computeLinearRegression, 
  computeQuadraticRegression, 
  computeBinaryLogisticRegression, 
  computeCorrelation 
} from '../lib/statistics';
import { TrendingUp, CheckCircle, AlertCircle, Activity, ScatterChart } from 'lucide-react';

interface RegressionModuleProps {
  dataset: Dataset;
}

type ModelType = 'linear' | 'quadratic' | 'logistic' | 'correlation';

export const RegressionModule: React.FC<RegressionModuleProps> = ({ dataset }) => {
  const [modelType, setModelType] = useState<ModelType>('linear');

  const numericCols = useMemo(() => {
    return dataset.columns.filter(c => dataset.columnTypes[c] === 'numeric');
  }, [dataset]);

  const categoricalCols = useMemo(() => {
    return dataset.columns.filter(c => dataset.columnTypes[c] === 'categorical');
  }, [dataset]);

  const [yVar, setYVar] = useState<string>(numericCols[1] || numericCols[0] || dataset.columns[0]);
  const [xVar, setXVar] = useState<string>(numericCols[0] || dataset.columns[0]);

  React.useEffect(() => {
    if (!dataset.columns.includes(yVar)) setYVar(numericCols[1] || numericCols[0] || dataset.columns[0]);
    if (!dataset.columns.includes(xVar)) setXVar(numericCols[0] || dataset.columns[0]);
  }, [dataset, numericCols, yVar, xVar]);

  const xData = useMemo(() => {
    return dataset.data.map(r => Number(r[xVar])).filter(v => !isNaN(v));
  }, [dataset, xVar]);

  const yData = useMemo(() => {
    return dataset.data.map(r => Number(r[yVar])).filter(v => !isNaN(v));
  }, [dataset, yVar]);

  // Linear Regression
  const linearResult = useMemo(() => {
    if (xData.length === 0 || yData.length === 0) return null;
    return computeLinearRegression(xData, yData);
  }, [xData, yData]);

  // Quadratic Regression
  const quadraticResult = useMemo(() => {
    if (!linearResult || xData.length === 0) return null;
    const ssRes = linearResult.residuals.reduce((a, b) => a + b * b, 0);
    return computeQuadraticRegression(xData, yData, ssRes);
  }, [linearResult, xData, yData]);

  // Binary Logistic Regression
  const logisticResult = useMemo(() => {
    if (xData.length === 0) return null;
    // Map Y to binary 0 or 1
    const medianY = (Math.min(...yData) + Math.max(...yData)) / 2;
    const binaryY = yData.map(v => v >= medianY ? 1 : 0);
    return computeBinaryLogisticRegression(xData, binaryY);
  }, [xData, yData]);

  // Correlation
  const correlationResult = useMemo(() => {
    if (xData.length === 0 || yData.length === 0) return null;
    return computeCorrelation(xData, yData);
  }, [xData, yData]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Regression Modeling & Model Diagnostics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ported from <span className="font-mono text-blue-600">Tegenu.R</span>: <code className="bg-slate-100 px-1 py-0.5 rounded">lm()</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">glm(family=binomial)</code> & residual diagnostics
            </p>
          </div>

          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setModelType('linear')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                modelType === 'linear' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Linear Regression (lm)
            </button>
            <button
              onClick={() => setModelType('quadratic')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                modelType === 'quadratic' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quadratic Polynomial
            </button>
            <button
              onClick={() => setModelType('logistic')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                modelType === 'logistic' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Binary Logistic (glm)
            </button>
            <button
              onClick={() => setModelType('correlation')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                modelType === 'correlation' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pearson & Spearman
            </button>
          </div>
        </div>

        {/* Formula variables */}
        <div className="flex items-center space-x-3 pt-3 text-xs">
          <span className="font-semibold text-slate-700">Dependent Variable (Y):</span>
          <select
            value={yVar}
            onChange={(e) => setYVar(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 cursor-pointer"
          >
            {numericCols.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-slate-400 font-bold">~</span>
          <span className="font-semibold text-slate-700">Predictor (X):</span>
          <select
            value={xVar}
            onChange={(e) => setXVar(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 cursor-pointer"
          >
            {numericCols.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Main Model Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {modelType === 'linear' && linearResult && (
            <>
              {/* Equation Box */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">Estimated Regression Line</span>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {yVar} = {linearResult.intercept.toFixed(3)} {linearResult.slope >= 0 ? '+' : '-'} {Math.abs(linearResult.slope).toFixed(3)} × {xVar}
                  </div>
                </div>
                <div className="flex space-x-3 text-xs">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-2xs">
                    <span className="text-slate-500 block text-[10px]">R-Squared</span>
                    <span className="font-bold text-blue-600 text-sm">{(linearResult.r2 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-2xs">
                    <span className="text-slate-500 block text-[10px]">Adjusted R²</span>
                    <span className="font-bold text-slate-800 text-sm">{(linearResult.adjR2 * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Coefficients Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                  Coefficients & Standard Errors
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Term</th>
                        <th className="py-2.5 px-3 text-right">Estimate</th>
                        <th className="py-2.5 px-3 text-right">Std. Error</th>
                        <th className="py-2.5 px-3 text-right">t value</th>
                        <th className="py-2.5 px-3 text-right">Pr(&gt;|t|)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-blue-700">(Intercept)</td>
                        <td className="py-2.5 px-3 text-right font-semibold">{linearResult.intercept.toFixed(4)}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">{linearResult.seIntercept.toFixed(4)}</td>
                        <td className="py-2.5 px-3 text-right">{linearResult.tIntercept.toFixed(3)}</td>
                        <td className="py-2.5 px-3 text-right text-slate-900">{linearResult.pIntercept.toFixed(4)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-blue-700">{xVar}</td>
                        <td className="py-2.5 px-3 text-right font-semibold">{linearResult.slope.toFixed(4)}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">{linearResult.seSlope.toFixed(4)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-600">{linearResult.tSlope.toFixed(3)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                          {linearResult.pSlope < 0.001 ? '< 0.001 ***' : `${linearResult.pSlope.toFixed(4)} *`}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Diagnostic Plots: Residuals vs Fitted & Normal Q-Q */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Residuals vs Fitted (plot(sl, which=1))</h4>
                  <svg viewBox="0 0 300 180" className="w-full h-auto">
                    <rect x="30" y="10" width="260" height="150" fill="#f8fafc" rx="3" />
                    <line x1="30" y1="85" x2="290" y2="85" stroke="#94a3b8" strokeDasharray="3 3" />
                    {linearResult.fitted.map((fit, i) => {
                      const res = linearResult.residuals[i];
                      const minF = Math.min(...linearResult.fitted);
                      const maxF = Math.max(...linearResult.fitted);
                      const maxR = Math.max(1, ...linearResult.residuals.map(Math.abs));
                      const cx = 40 + ((fit - minF) / (maxF - minF || 1)) * 240;
                      const cy = 85 - (res / maxR) * 65;
                      return (
                        <circle key={i} cx={cx} cy={cy} r="3" fill="#3b82f6" opacity="0.8" />
                      );
                    })}
                  </svg>
                  <span className="text-[10px] text-slate-500 block text-center mt-1">Homoscedasticity reference (horizontal zero line)</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Normal Q-Q Plot (qqnorm & qqline)</h4>
                  <svg viewBox="0 0 300 180" className="w-full h-auto">
                    <rect x="30" y="10" width="260" height="150" fill="#f8fafc" rx="3" />
                    <line x1="40" y1="150" x2="280" y2="20" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                    {linearResult.qqPoints.map((pt, i) => {
                      const cx = 160 + pt.theoretical * 40;
                      const cy = 85 - pt.sample * 25;
                      return (
                        <circle key={i} cx={cx} cy={cy} r="3" fill="#2563eb" opacity="0.85" />
                      );
                    })}
                  </svg>
                  <span className="text-[10px] text-slate-500 block text-center mt-1">Normality of residuals test</span>
                </div>
              </div>
            </>
          )}

          {modelType === 'quadratic' && quadraticResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Quadratic Polynomial Model: {yVar} ~ {xVar} + I({xVar}²)
              </h3>
              <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm text-slate-900 border border-slate-200">
                {yVar} = {quadraticResult.beta0.toFixed(3)} + ({quadraticResult.beta1.toFixed(3)} × {xVar}) + ({quadraticResult.beta2.toFixed(4)} × {xVar}²)
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Quadratic R²</span>
                  <span className="text-lg font-bold text-blue-600">{(quadraticResult.r2 * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">ANOVA F vs Linear</span>
                  <span className="text-lg font-bold text-slate-800">{quadraticResult.fImprovement.toFixed(2)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Comparison p-Value</span>
                  <span className="text-lg font-bold text-emerald-600">{quadraticResult.anovaComparisonP.toFixed(4)}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Model comparison via <code className="font-mono text-blue-600">anova(sl, Qm)</code>: Tests whether adding the quadratic polynomial term provides a statistically significant improvement in explaining variance.
              </p>
            </div>
          )}

          {modelType === 'logistic' && logisticResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Binary Logistic Regression: logit(p) ~ {xVar}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Odds Ratio (exp(β))</span>
                  <span className="text-lg font-bold text-blue-600">{logisticResult.oddsRatio.toFixed(3)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Wald z-Statistic</span>
                  <span className="text-lg font-bold text-slate-800">{logisticResult.zValue.toFixed(3)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">p-Value</span>
                  <span className="text-lg font-bold text-emerald-600">{logisticResult.pValue.toFixed(4)}</span>
                </div>
              </div>
              <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 text-xs text-blue-900">
                <strong>Odds Ratio Interpretation:</strong> For each unit increase in <code className="font-mono">{xVar}</code>, the odds of the outcome increase by a factor of <strong>{logisticResult.oddsRatio.toFixed(3)}</strong> (95% CI: [{logisticResult.ciOddsLower.toFixed(3)}, {logisticResult.ciOddsUpper.toFixed(3)}]).
              </div>
            </div>
          )}

          {modelType === 'correlation' && correlationResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Correlation Tests: {xVar} and {yVar}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block mb-1">Pearson's Product-Moment Correlation (r)</span>
                  <span className="text-2xl font-bold text-blue-600">{correlationResult.pearsonR.toFixed(4)}</span>
                  <div className="text-xs text-slate-500 mt-2">
                    t = {correlationResult.tStat.toFixed(3)}, p-value = {correlationResult.pValue.toExponential(4)}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block mb-1">Spearman's Rank Correlation (rho)</span>
                  <span className="text-2xl font-bold text-indigo-600">{correlationResult.spearmanRho.toFixed(4)}</span>
                  <div className="text-xs text-slate-500 mt-2">
                    Non-parametric rank association, p-value = {correlationResult.spearmanP.toExponential(4)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Script & R Console */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl p-4 text-white shadow-xs border border-slate-800">
            <div className="pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
              R Regression Code (Tegenu.R)
            </div>
            <pre className="font-mono text-[11px] text-sky-300 whitespace-pre-wrap leading-relaxed">
{modelType === 'linear' && `# Simple linear regression
sl <- lm(${dataset.id}$${yVar} ~ ${dataset.id}$${xVar})
summary(sl)

# Residual diagnostics
plot(sl, which = 1:2)
shapiro.test(resid(sl))`}
{modelType === 'quadratic' && `# Quadratic polynomial regression
sl <- lm(${yVar} ~ ${xVar}, data = ${dataset.id})
Qm <- lm(${yVar} ~ ${xVar} + I(${xVar}^2), data = ${dataset.id})
summary(Qm)
anova(sl, Qm) # Model comparison`}
{modelType === 'logistic' && `# Logistic regression
fit <- glm(${yVar}_binary ~ ${xVar}, data = ${dataset.id}, family = "binomial")
summary(fit)
exp(coef(fit)) # Odds Ratios`}
{modelType === 'correlation' && `# Correlation
cor.test(${dataset.id}$${xVar}, ${dataset.id}$${yVar})
cor.test(${dataset.id}$${xVar}, ${dataset.id}$${yVar}, method = "spearman")`}
            </pre>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 text-slate-200 border border-slate-800 font-mono text-[11px] shadow-xs">
            <div className="pb-1.5 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
              Simulated R Console Output
            </div>
            {modelType === 'linear' && linearResult && (
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[10px]">
{`Call:
lm(formula = ${yVar} ~ ${xVar}, data = ${dataset.id})

Residuals:
    Min      1Q  Median      3Q     Max 
${Math.min(...linearResult.residuals).toFixed(2)}   ${(Math.min(...linearResult.residuals)/2).toFixed(2)}    0.00   ${(Math.max(...linearResult.residuals)/2).toFixed(2)}   ${Math.max(...linearResult.residuals).toFixed(2)}

Coefficients:
            Estimate Std. Error t value Pr(>|t|)    
(Intercept) ${linearResult.intercept.toFixed(3).padStart(8)}   ${linearResult.seIntercept.toFixed(3).padStart(8)}   ${linearResult.tIntercept.toFixed(2).padStart(6)}  ${linearResult.pIntercept.toFixed(4)}    
${xVar.padEnd(11)} ${linearResult.slope.toFixed(3).padStart(8)}   ${linearResult.seSlope.toFixed(3).padStart(8)}   ${linearResult.tSlope.toFixed(2).padStart(6)}  ${linearResult.pSlope < 0.001 ? '<2e-16 ***' : linearResult.pSlope.toFixed(4)}

Residual standard error: ${linearResult.residualSE.toFixed(2)} on ${linearResult.n - 2} degrees of freedom
Multiple R-squared:  ${linearResult.r2.toFixed(4)},	Adjusted R-squared:  ${linearResult.adjR2.toFixed(4)} 
F-statistic: ${linearResult.fStat.toFixed(2)} on 1 and ${linearResult.n - 2} DF,  p-value: ${linearResult.pValue < 0.001 ? '< 2.2e-16' : linearResult.pValue.toFixed(4)}`}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
