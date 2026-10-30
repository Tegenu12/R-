import React, { useState } from 'react';
import { TRAINING_LESSONS, RTrainingLesson } from '../data/trainingModules';
import { TabType } from './Navbar';
import { BookOpen, Play, Copy, Check, FileCode, ArrowRight, UserCheck } from 'lucide-react';

interface TrainingGuideProps {
  onSelectLesson: (lesson: RTrainingLesson) => void;
  setActiveTab: (tab: TabType) => void;
}

export const TrainingGuide: React.FC<TrainingGuideProps> = ({
  onSelectLesson,
  setActiveTab
}) => {
  const [filterAuthor, setFilterAuthor] = useState<'All' | 'Yeshiwork A.(MSc.)' | 'Tegenu'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLessons = TRAINING_LESSONS.filter(l => {
    if (filterAuthor === 'Yeshiwork A.(MSc.)') return l.scriptSource === 'Rcode_Y.R';
    if (filterAuthor === 'Tegenu') return l.scriptSource === 'Tegenu.R';
    return true;
  });

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLaunch = (lesson: RTrainingLesson) => {
    onSelectLesson(lesson);
    setActiveTab(lesson.targetView);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-xl p-6 text-white shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs mb-3">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Official Research Curriculum
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            R Software Training for Researchers
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed mb-4">
            A comprehensive, interactive statistical training program ported directly from the research scripts 
            <code className="bg-blue-900/60 px-1.5 py-0.5 rounded text-blue-200 ml-1 font-mono text-xs">Rcode_Y.R</code> and 
            <code className="bg-blue-900/60 px-1.5 py-0.5 rounded text-blue-200 ml-1 font-mono text-xs">Tegenu.R</code>.
            Explore theoretical concepts, run original R snippets, and view statistical models on authentic experimental datasets.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-black/20 px-2.5 py-1 rounded-md text-blue-100 flex items-center">
              <UserCheck className="w-3.5 h-3.5 mr-1 text-blue-300" />
              Authors: Yeshiwork A. (MSc.) & Tegenu
            </span>
            <span className="bg-black/20 px-2.5 py-1 rounded-md text-blue-100">
              11 Complete Computational Modules
            </span>
            <span className="bg-black/20 px-2.5 py-1 rounded-md text-blue-100">
              Includes Uploaded "Stat Score" Excel Data
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-slate-500">Filter by Curriculum Source:</span>
          <div className="inline-flex rounded-md shadow-2xs">
            {(['All', 'Yeshiwork A.(MSc.)', 'Tegenu'] as const).map(author => (
              <button
                key={author}
                onClick={() => setFilterAuthor(author)}
                className={`px-3 py-1 text-xs font-medium first:rounded-l-md last:rounded-r-md border border-slate-200 ${
                  filterAuthor === author
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {author === 'All' ? 'All Modules (11)' : author === 'Tegenu' ? 'Tegenu.R (Advanced)' : 'Rcode_Y.R (Descriptive)'}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs text-slate-500">
          Showing {filteredLessons.length} interactive lessons
        </span>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="inline-block text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    {lesson.module}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {lesson.title}
                  </h3>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  <FileCode className="w-3 h-3 mr-1 text-slate-500" />
                  {lesson.scriptSource}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {lesson.explanation}
              </p>

              {/* R Code Snippet Preview */}
              <div className="relative rounded-lg bg-slate-900 p-3 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px] text-slate-400">
                  <span>R Script</span>
                  <button
                    onClick={() => handleCopy(lesson.id, lesson.rCode)}
                    className="flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedId === lesson.id ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-sky-300 whitespace-pre-wrap">{lesson.rCode}</pre>
              </div>
            </div>

            {/* Action Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                By: <strong className="text-slate-700">{lesson.author}</strong>
              </span>
              <button
                onClick={() => handleLaunch(lesson)}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-2xs group"
              >
                <Play className="w-3 h-3 mr-1.5 fill-current" />
                Launch Workbench
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
