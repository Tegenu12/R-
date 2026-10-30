import React, { useState } from 'react';
import { Terminal, Play, Copy, Check, RotateCcw, FileText, Download } from 'lucide-react';

export const RConsole: React.FC = () => {
  const defaultSnippet = `# R Training Interactive Console (Tegenu.R / Rcode_Y.R)
# Load data and run simple linear regression model
sl <- lm(speed ~ dist, data = cars)
summary(sl)

# Compute correlation
cor(cars$speed, cars$dist)

# Plot residual diagnostics
plot(sl, which = 1)`;

  const [inputCode, setInputCode] = useState(defaultSnippet);
  const [outputLog, setOutputLog] = useState<string>(`R version 4.3.2 (2023-10-31) -- "Eye Holes"
Copyright (C) 2023 The R Foundation for Statistical Computing
Platform: x86_64-pc-linux-gnu (64-bit)

R is free software and comes with ABSOLUTELY NO WARRANTY.
You are welcome to redistribute it under certain conditions.

[Session Initialized: packages MASS, psych, vcd, Lock5Data, forecast, Kendall pre-loaded]
> `);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    const timestamp = new Date().toLocaleTimeString();
    let simOutput = '';

    if (inputCode.includes('lm') || inputCode.includes('sl')) {
      simOutput = `
Call:
lm(formula = speed ~ dist, data = cars)

Residuals:
    Min      1Q  Median      3Q     Max 
-7.5293 -2.1550  0.3615  2.4377  5.4198 

Coefficients:
            Estimate Std. Error t value Pr(>|t|)    
(Intercept)  8.28391    0.87438   9.474 1.44e-12 ***
dist         0.16557    0.01749   9.464 1.49e-12 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 3.156 on 48 degrees of freedom
Multiple R-squared:  0.6511,	Adjusted R-squared:  0.6438 
F-statistic: 89.57 on 1 and 48 DF,  p-value: 1.49e-12
`;
    } else if (inputCode.includes('t.test')) {
      simOutput = `
	Welch Two Sample t-test

data:  sample1 and sample2
t = 2.4519, df = 28.43, p-value = 0.02058
alternative hypothesis: true difference in means is not equal to 0
95 percent confidence interval:
 0.4512 4.8821
sample estimates:
mean of x mean of y 
 18.42000  15.75333
`;
    } else {
      simOutput = `
[Execution successful at ${timestamp}]
Evaluated ${inputCode.split('\n').filter(l => l.trim() && !l.startsWith('#')).length} expressions.
`;
    }

    setOutputLog(prev => `${prev}\n> ${inputCode.replace(/\n/g, '\n+ ')}${simOutput}\n> `);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (type: 'descriptive' | 'anova' | 'ts') => {
    if (type === 'descriptive') {
      setInputCode(`# Descriptive analysis from Rcode_Y.R
library_visits <- c(15, 3, 12, 0, 24, 3)
mean(library_visits)
median(library_visits)
var(library_visits)
sd(library_visits)
IQR(library_visits)`);
    } else if (type === 'anova') {
      setInputCode(`# One-Way ANOVA from Tegenu.R
Anova.Spray <- aov(sqrt(count) ~ spray, data = InsectSprays)
summary(Anova.Spray)
bartlett.test(sqrt(count) ~ spray, data = InsectSprays)`);
    } else {
      setInputCode(`# Time Series Decomposition from Tegenu.R
tsdata <- ts(AirPassengers, freq = 12)
ddata <- decompose(tsdata, "multiplicative")
plot(ddata)
adf.test(AirPassengers)`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-blue-600" />
              Interactive R Script Console & Syntax Sandbox
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute and inspect statistical R syntax from <span className="font-mono text-blue-600">Rcode_Y.R</span> and <span className="font-mono text-blue-600">Tegenu.R</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500">Presets:</span>
            <button
              onClick={() => loadPreset('descriptive')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
            >
              Descriptive
            </button>
            <button
              onClick={() => loadPreset('anova')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
            >
              ANOVA
            </button>
            <button
              onClick={() => loadPreset('ts')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
            >
              Time Series
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Console Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Box */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden flex flex-col h-[520px]">
          <div className="bg-slate-800/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-300 ml-2">script.R</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-700/50"
              >
                {copied ? <Check className="w-3 h-3 mr-1 text-emerald-400" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleRun}
                className="inline-flex items-center px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs"
              >
                <Play className="w-3 h-3 mr-1 fill-current" />
                Run (Ctrl+Enter)
              </button>
            </div>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRun();
              }
            }}
            className="w-full flex-1 p-4 bg-slate-900 text-sky-200 font-mono text-xs focus:outline-hidden resize-none leading-relaxed"
            placeholder="Write or paste R commands here..."
            spellCheck={false}
          />
        </div>

        {/* Output Console Box */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-md overflow-hidden flex flex-col h-[520px]">
          <div className="bg-slate-900/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400">R REPL Output Session</span>
            <button
              onClick={() => setOutputLog('> ')}
              className="inline-flex items-center text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear Terminal
            </button>
          </div>

          <pre className="w-full flex-1 p-4 font-mono text-[11px] text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed selection:bg-blue-900 selection:text-white">
            {outputLog}
          </pre>
        </div>
      </div>
    </div>
  );
};
