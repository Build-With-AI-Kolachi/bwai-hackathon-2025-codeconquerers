import React, { useState, useEffect } from 'react';
import { Edit3, Check, RefreshCw, Sparkles } from 'lucide-react';
import { transcribeAudio, expandTranscript, suggestLegalClauses, updateReport } from '../../services/api';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import LegalClauseBadge from './LegalClauseBadge';

interface TranscriptEditorProps {
  reportId: string;
  audioUrl: string;
  onTranscriptReady: (reportId: string) => void;
}

const TranscriptEditor: React.FC<TranscriptEditorProps> = ({ 
  reportId, 
  audioUrl, 
  onTranscriptReady 
}) => {
  const [transcript, setTranscript] = useState('');
  const [expandedTranscript, setExpandedTranscript] = useState('');
  const [legalClauses, setLegalClauses] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleTranscribe();
  }, [audioUrl]);

  const handleTranscribe = async () => {
    try {
      setIsTranscribing(true);
      setError(null);
      
      const transcriptText = await transcribeAudio(audioUrl);
      setTranscript(transcriptText);
      
      // Auto-expand and suggest legal clauses
      await Promise.all([
        handleExpand(transcriptText),
        handleSuggestClauses(transcriptText)
      ]);
      
    } catch (err) {
      setError('Failed to transcribe audio. Please try again.');
      console.error('Transcription error:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleExpand = async (text?: string) => {
    try {
      setIsExpanding(true);
      const textToExpand = text || transcript;
      const expanded = await expandTranscript(textToExpand);
      setExpandedTranscript(expanded);
    } catch (err) {
      console.error('Expansion error:', err);
    } finally {
      setIsExpanding(false);
    }
  };

  const handleSuggestClauses = async (text?: string) => {
    try {
      setIsSuggesting(true);
      const textToAnalyze = text || transcript;
      const clauses = await suggestLegalClauses(textToAnalyze);
      setLegalClauses(clauses);
    } catch (err) {
      console.error('Legal suggestion error:', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      await updateReport(reportId, {
        transcript,
        expandedTranscript,
        legalClauses,
        status: 'reviewed'
      });

      onTranscriptReady(reportId);
    } catch (err) {
      setError('Failed to save transcript. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isTranscribing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Transcribing Your Voice...
        </h2>
        <p className="text-gray-600">
          Our AI is converting your audio to text. This may take a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Transcript</h2>
        <p className="text-gray-600">
          Review and edit the transcript below. We've also suggested relevant legal clauses.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Original Transcript */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Original Transcript</h3>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="ghost"
              icon={isEditing ? Check : Edit3}
              size="sm"
            >
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          </div>
          
          {isEditing ? (
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={6}
              placeholder="Your transcribed voice message..."
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-md border">
              <p className="text-gray-900 leading-relaxed">
                {transcript || 'No transcript available'}
              </p>
            </div>
          )}
        </div>

        {/* Expanded Transcript */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">AI-Enhanced Version</h3>
            <Button
              onClick={() => handleExpand()}
              loading={isExpanding}
              variant="ghost"
              icon={RefreshCw}
              size="sm"
            >
              Re-generate
            </Button>
          </div>
          
          {isExpanding ? (
            <div className="p-4 bg-gray-50 rounded-md border flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              <span className="text-gray-600">Enhancing transcript...</span>
            </div>
          ) : (
            <div className="p-4 bg-purple-50 rounded-md border border-purple-200">
              <p className="text-gray-900 leading-relaxed">
                {expandedTranscript || 'Enhanced version will appear here...'}
              </p>
            </div>
          )}
        </div>

        {/* Legal Clauses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Relevant Legal Clauses</h3>
            <Button
              onClick={() => handleSuggestClauses()}
              loading={isSuggesting}
              variant="ghost"
              icon={Sparkles}
              size="sm"
            >
              Refresh Suggestions
            </Button>
          </div>
          
          {isSuggesting ? (
            <div className="p-4 bg-gray-50 rounded-md border flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              <span className="text-gray-600">Analyzing legal implications...</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {legalClauses.map((clause, index) => (
                <LegalClauseBadge key={index} clause={clause} />
              ))}
              {legalClauses.length === 0 && (
                <p className="text-gray-500 italic">No legal clauses suggested yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            onClick={handleTranscribe}
            variant="ghost"
            icon={RefreshCw}
          >
            Re-transcribe
          </Button>
          
          <Button
            onClick={handleSave}
            loading={isSaving}
            icon={Check}
            size="lg"
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isSaving ? 'Saving...' : 'Continue to Generate'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptEditor;