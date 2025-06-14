import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, Upload } from 'lucide-react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { uploadAudio, createReport, updateReport } from '../../services/api';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

interface VoiceRecorderProps {
  onReportCreated: (reportId: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onReportCreated }) => {
  const {
    isRecording,
    duration,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      
      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [audioUrl]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      setError(null);
      await startRecording();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  };

  const handlePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) return;

    try {
      setIsUploading(true);
      setError(null);

      // Create report first
      const reportId = await createReport({
        status: 'recording'
      });

      // Upload audio
      const audioUrl = await uploadAudio(audioBlob, reportId);
      
      // Update report with audio URL
      await updateReport(reportId, {
        audioUrl,
        status: 'transcribing'
      });

      onReportCreated(reportId);
    } catch (err) {
      setError('Failed to upload recording. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Record Your Voice</h2>
        <p className="text-gray-600">Speak in Urdu, English, or both. Your voice will be kept confidential.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Recording Status */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            isRecording ? 'bg-red-100 animate-pulse' : 'bg-purple-100'
          }`}>
            {isRecording ? (
              <MicOff className="w-8 h-8 text-red-600" />
            ) : (
              <Mic className="w-8 h-8 text-purple-600" />
            )}
          </div>
          
          <div className="text-2xl font-mono font-bold text-gray-900 mb-2">
            {formatDuration(duration)}
          </div>
          
          {isRecording && (
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-red-500 rounded-full animate-pulse"
                    style={{
                      height: Math.random() * 20 + 10,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center space-x-4">
          {!isRecording && !audioBlob && (
            <Button
              onClick={handleStartRecording}
              size="lg"
              icon={Mic}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Start Recording
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={stopRecording}
              size="lg"
              variant="danger"
              icon={MicOff}
            >
              Stop Recording
            </Button>
          )}

          {audioBlob && !isRecording && (
            <>
              <Button
                onClick={handlePlayPause}
                variant="secondary"
                icon={isPlaying ? Pause : Play}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                onClick={resetRecording}
                variant="ghost"
                icon={RotateCcw}
              >
                Re-record
              </Button>
            </>
          )}
        </div>

        {/* Upload Button */}
        {audioBlob && !isRecording && (
          <div className="pt-4 border-t">
            <Button
              onClick={handleUpload}
              loading={isUploading}
              icon={Upload}
              className="w-full bg-teal-600 hover:bg-teal-700"
              size="lg"
            >
              {isUploading ? 'Uploading...' : 'Upload & Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;