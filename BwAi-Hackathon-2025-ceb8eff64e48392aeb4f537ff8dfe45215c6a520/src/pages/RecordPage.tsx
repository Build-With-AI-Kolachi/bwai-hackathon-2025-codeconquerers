import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceRecorder from '../components/VoiceRecorder/VoiceRecorder';
import TranscriptEditor from '../components/TranscriptEditor/TranscriptEditor';
import VoiceVideoGenerator from '../components/VoiceVideoGenerator/VoiceVideoGenerator';
import { getReport } from '../services/api';
import type { Report } from '../types';

const RecordPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'record' | 'review' | 'generate'>('record');
  const [reportId, setReportId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<Report | null>(null);
  const navigate = useNavigate();

  const handleReportCreated = async (id: string) => {
    setReportId(id);
    const report = await getReport(id);
    setReportData(report);
    setCurrentStep('review');
  };

  const handleTranscriptReady = async (id: string) => {
    const report = await getReport(id);
    setReportData(report);
    setCurrentStep('generate');
  };

  const handleGenerationComplete = (id: string) => {
    navigate(`/share?reportId=${id}`);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'record':
        return <VoiceRecorder onReportCreated={handleReportCreated} />;
      
      case 'review':
        return reportId && reportData?.audioUrl ? (
          <TranscriptEditor
            reportId={reportId}
            audioUrl={reportData.audioUrl}
            onTranscriptReady={handleTranscriptReady}
          />
        ) : null;
      
      case 'generate':
        return reportId && reportData?.expandedTranscript ? (
          <VoiceVideoGenerator
            reportId={reportId}
            expandedTranscript={reportData.expandedTranscript}
            onGenerationComplete={handleGenerationComplete}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            currentStep === 'record' ? 'bg-purple-600 text-white' : 
            ['review', 'generate'].includes(currentStep) ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 ${
            ['review', 'generate'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-300'
          }`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            currentStep === 'review' ? 'bg-purple-600 text-white' : 
            currentStep === 'generate' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
          <div className={`w-12 h-1 ${
            currentStep === 'generate' ? 'bg-green-500' : 'bg-gray-300'
          }`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            currentStep === 'generate' ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-16 text-sm">
          <span className={currentStep === 'record' ? 'text-purple-600 font-medium' : 'text-gray-500'}>
            Record
          </span>
          <span className={currentStep === 'review' ? 'text-purple-600 font-medium' : 'text-gray-500'}>
            Review
          </span>
          <span className={currentStep === 'generate' ? 'text-purple-600 font-medium' : 'text-gray-500'}>
            Generate
          </span>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {renderStep()}
      </div>
    </div>
  );
};

export default RecordPage;