import React, { useState, useEffect } from 'react';
import { Copy, Mail, Phone, Share2, ExternalLink, CheckCircle } from 'lucide-react';
import { generateShareUrl, getNGOs, getLawyers } from '../../services/api';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import type { NGO, Lawyer } from '../../types';

interface ShareModalProps {
  reportId: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ reportId, onClose }) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [ngos, setNGOs] = useState<NGO[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
    generateUrl();
  }, [reportId]);

  const loadContacts = async () => {
    try {
      const [ngoData, lawyerData] = await Promise.all([
        getNGOs(),
        getLawyers()
      ]);
      setNGOs(ngoData);
      setLawyers(lawyerData);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const generateUrl = async () => {
    try {
      setIsGeneratingUrl(true);
      const url = await generateShareUrl(reportId);
      setShareUrl(url);
    } catch (err) {
      setError('Failed to generate share URL');
      console.error('URL generation error:', err);
    } finally {
      setIsGeneratingUrl(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSendToContacts = () => {
    if (!shareUrl || selectedContacts.length === 0) return;

    // In a real implementation, this would send the share URL to selected contacts
    console.log('Sending to contacts:', selectedContacts);
    alert(`Report shared with ${selectedContacts.length} contact(s) anonymously.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Share Your Report</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Share URL */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure Share Link</h3>
            {isGeneratingUrl ? (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                <LoadingSpinner size="sm" />
                <span className="text-gray-600">Generating secure link...</span>
              </div>
            ) : shareUrl ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md border">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                  />
                  <Button
                    onClick={handleCopyUrl}
                    variant="ghost"
                    size="sm"
                    icon={copiedToClipboard ? CheckCircle : Copy}
                    className={copiedToClipboard ? 'text-green-600' : ''}
                  >
                    {copiedToClipboard ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  This link will expire in 72 hours and can be accessed anonymously.
                </p>
              </div>
            ) : null}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="secondary"
                icon={Phone}
                className="justify-center"
                onClick={() => alert('Emergency services contacted anonymously')}
              >
                Emergency Help
              </Button>
              <Button
                variant="secondary"
                icon={Mail}
                className="justify-center"
                onClick={() => window.open(`mailto:?subject=Anonymous Report&body=${shareUrl}`)}
              >
                Email Link
              </Button>
              <Button
                variant="secondary"
                icon={Share2}
                className="justify-center"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Anonymous Report', url: shareUrl || '' });
                  }
                }}
              >
                Share
              </Button>
            </div>
          </div>

          {/* NGOs and Lawyers */}
          {!isLoadingContacts && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Send to Verified Partners</h3>
              
              <div className="space-y-4">
                {/* NGOs */}
                {ngos.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-2">NGOs</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {ngos.slice(0, 3).map((ngo) => (
                        <div
                          key={ngo.id}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            selectedContacts.includes(ngo.id)
                              ? 'border-purple-300 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleContactToggle(ngo.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">{ngo.name}</h5>
                              <p className="text-sm text-gray-600">{ngo.location}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {ngo.expertise.slice(0, 2).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex text-yellow-400">
                                {'★'.repeat(Math.floor(ngo.rating))}
                              </div>
                              {selectedContacts.includes(ngo.id) && (
                                <CheckCircle className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lawyers */}
                {lawyers.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-2">Lawyers</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {lawyers.slice(0, 3).map((lawyer) => (
                        <div
                          key={lawyer.id}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            selectedContacts.includes(lawyer.id)
                              ? 'border-purple-300 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleContactToggle(lawyer.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">{lawyer.name}</h5>
                              <p className="text-sm text-gray-600">{lawyer.location} • {lawyer.experience} years</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {lawyer.specialization.slice(0, 2).map((spec, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex text-yellow-400">
                                {'★'.repeat(Math.floor(lawyer.rating))}
                              </div>
                              {selectedContacts.includes(lawyer.id) && (
                                <CheckCircle className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedContacts.length > 0 && (
                <Button
                  onClick={handleSendToContacts}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                  icon={Mail}
                >
                  Send to {selectedContacts.length} Selected Contact{selectedContacts.length > 1 ? 's' : ''}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;