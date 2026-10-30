import React, { useState } from 'react';
import { DATASETS, Dataset } from './data/datasets';
import { Navbar, TabType } from './components/Navbar';
import { TrainingGuide } from './components/TrainingGuide';
import { DescriptiveModule } from './components/DescriptiveModule';
import { GraphicsModule } from './components/GraphicsModule';
import { HypothesisTestingModule } from './components/HypothesisTestingModule';
import { AnovaModule } from './components/AnovaModule';
import { RegressionModule } from './components/RegressionModule';
import { TimeSeriesModule } from './components/TimeSeriesModule';
import { DataExplorer } from './components/DataExplorer';
import { RConsole } from './components/RConsole';
import { RTrainingLesson } from './data/trainingModules';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('curriculum');
  const [datasetsState, setDatasetsState] = useState<Record<string, Dataset>>(DATASETS);
  const [activeDatasetId, setActiveDatasetId] = useState<string>('stat_score');

  const selectedDataset = datasetsState[activeDatasetId] || DATASETS.stat_score;

  const handleSelectLesson = (lesson: RTrainingLesson) => {
    if (datasetsState[lesson.datasetId]) {
      setActiveDatasetId(lesson.datasetId);
    }
  };

  const handleCustomDatasetLoaded = (newDataset: Dataset) => {
    setDatasetsState(prev => ({
      ...prev,
      [newDataset.id]: newDataset
    }));
    setActiveDatasetId(newDataset.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDataset={selectedDataset}
        onSelectDataset={setActiveDatasetId}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'curriculum' && (
          <TrainingGuide
            onSelectLesson={handleSelectLesson}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'descriptive' && (
          <DescriptiveModule dataset={selectedDataset} />
        )}

        {activeTab === 'graphics' && (
          <GraphicsModule dataset={selectedDataset} />
        )}

        {activeTab === 'inferential' && (
          <HypothesisTestingModule dataset={selectedDataset} />
        )}

        {activeTab === 'anova' && (
          <AnovaModule dataset={selectedDataset} />
        )}

        {activeTab === 'regression' && (
          <RegressionModule dataset={selectedDataset} />
        )}

        {activeTab === 'timeseries' && (
          <TimeSeriesModule />
        )}

        {activeTab === 'data' && (
          <DataExplorer
            dataset={selectedDataset}
            onCustomDatasetLoaded={handleCustomDatasetLoaded}
          />
        )}

        {activeTab === 'console' && (
          <RConsole />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Ported for researcher training from <code className="font-mono text-slate-700">Rcode_Y.R</code> & <code className="font-mono text-slate-700">Tegenu.R</code>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Node.js / React Web Engine</span>
            <span>•</span>
            <span>Port 3000</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
