import React, { useState } from 'react';
import { Volume2, Video, Download, Play, Pause } from 'lucide-react';
import { generateVoice, generateVideo, updateReport } from '../../services/api';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

interface VoiceVideoGeneratorProps {
  reportId: string;
  expandedTranscript: string;
  onGenerationComplete: (reportId: string) => void;
}

const VoiceVideoGenerator: React.FC<VoiceVideoGeneratorProps> = ({
  reportId,
  expandedTranscript,
  onGenerationComplete
}) => {
  const [generatedVoiceUrl, setGeneratedVoiceUrl] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVoice = async () => {
    try {
      setIsGeneratingVoice(true);
      setError(null);
      
      const voiceUrl = await generateVoice(expandedTranscript);
      setGeneratedVoiceUrl(voiceUrl);
      
      await updateReport(reportId, {
        generatedVoiceUrl: voiceUrl,
        status: 'generating'
      });
      
    } catch (err) {
      setError('Failed to generate voice. Please try again.');
      console.error('Voice generation error:', err);
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const handleGenerateVideo = async () => {
    try {
      setIsGeneratingVideo(true);
      setError(null);
      
      const videoUrl = await generateVideo(expandedTranscript);
      setGeneratedVideoUrl(videoUrl);
      
      await updateReport(reportId, {
        generatedVideoUrl: videoUrl,
        status: 'ready'
      });
      
    } catch (err) {
      setError('Failed to generate video. Please try again.');
      console.error('Video generation error:', err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleContinue = () => {
    onGenerationComplete(reportId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Voice & Video</h2>
        <p className="text-gray-600">
          Create a female-narrated voice or video message to share your report anonymously.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Preview Text */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Preview</h3>
          <div className="p-4 bg-gray-50 rounded-md border max-h-40 overflow-y-auto">
            <p className="text-gray-900 leading-relaxed text-sm">
              {expandedTranscript.substring(0, 500)}
              {expandedTranscript.length > 500 && '...'}
            </p>
          </div>
        </div>

        {/* Voice Generation */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Volume2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Voice Generation</h3>
                <p className="text-sm text-gray-600">Generate a female voice narration</p>
              </div>
            </div>
            
            {!generatedVoiceUrl && (
              <Button
                onClick={handleGenerateVoice}
                loading={isGeneratingVoice}
                icon={Volume2}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGeneratingVoice ? 'Generating...' : 'Generate Voice'}
              </Button>
            )}
          </div>

          {isGeneratingVoice && (
            <div className="bg-purple-50 p-4 rounded-md">
              <div className="flex items-center space-x-3">
                <LoadingSpinner size="sm" />
                <div>
                  <p className="font-medium text-purple-900">Generating voice narration...</p>
                  <p className="text-sm text-purple-700">This may take up to 3 minutes</p>
                </div>
              </div>
            </div>
          )}

          {generatedVoiceUrl && (
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Voice generated successfully!</p>
                    <p className="text-sm text-green-700">Female voice narration is ready</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                    variant="ghost"
                    icon={isPlayingVoice ? Pause : Play}
                    size="sm"
                  >
                    {isPlayingVoice ? 'Pause' : 'Play'}
                  </Button>
                  <Button
                    onClick={() => window.open(generatedVoiceUrl, '_blank')}
                    variant="ghost"
                    icon={Download}
                    size="sm"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Generation */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Video className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Video Generation</h3>
                <p className="text-sm text-gray-600">Generate a female presenter video</p>
              </div>
            </div>
            
            {!generatedVideoUrl && (
              <Button
                onClick={handleGenerateVideo}
                loading={isGeneratingVideo}
                icon={Video}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isGeneratingVideo ? 'Generating...' : 'Generate Video'}
              </Button>
            )}
          </div>

          {isGeneratingVideo && (
            <div className="bg-teal-50 p-4 rounded-md">
              <div className="flex items-center space-x-3">
                <LoadingSpinner size="sm" />
                <div>
                  <p className="font-medium text-teal-900">Generating video presentation...</p>
                  <p className="text-sm text-teal-700">This may take up to 5 minutes</p>
                </div>
              </div>
            </div>
          )}

          {generatedVideoUrl && (
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Video generated successfully!</p>
                    <p className="text-sm text-green-700">Female presenter video is ready</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => window.open(generatedVideoUrl, '_blank')}
                    variant="ghost"
                    icon={Play}
                    size="sm"
                  >
                    Watch
                  </Button>
                  <Button
                    onClick={() => window.open(generatedVideoUrl, '_blank')}
                    variant="ghost"
                    icon={Download}
                    size="sm"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        {(generatedVoiceUrl || generatedVideoUrl) && (
          <div className="pt-6 border-t">
            <Button
              onClick={handleContinue}
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Continue to Share
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceVideoGenerator;