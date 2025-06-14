import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ShareModal from '../components/ShareModal/ShareModal';
import { getReport } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import type { Report } from '../types';

const SharePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (reportId) {
      loadReport();
    } else {
      setError('No report ID provided');
      setIsLoading(false);
    }
  }, [reportId]);

  const loadReport = async () => {
    if (!reportId) return;

    try {
      setIsLoading(true);
      const reportData = await getReport(reportId);
      
      if (!reportData) {
        setError('Report not found or has expired');
        return;
      }
      
      setReport(reportData);
      setShowShareModal(true);
    } catch (err) {
      setError('Failed to load report');
      console.error('Report loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowShareModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showShareModal && reportId && (
        <ShareModal
          reportId={reportId}
          onClose={handleCloseModal}
        />
      )}
      
      {!showShareModal && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Report</h2>
          <p className="text-gray-600 mb-6">Your report is ready to be shared anonymously.</p>
          <button
            onClick={() => setShowShareModal(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Open Share Options
          </button>
        </div>
      )}
    </div>
  );
};

export default SharePage;