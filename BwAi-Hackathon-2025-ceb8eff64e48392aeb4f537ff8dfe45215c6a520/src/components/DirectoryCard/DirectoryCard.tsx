import React from 'react';
import { Mail, Phone, MapPin, Star, Shield } from 'lucide-react';
import Button from '../UI/Button';
import type { NGO, Lawyer } from '../../types';

interface DirectoryCardProps {
  contact: NGO | Lawyer;
  type: 'ngo' | 'lawyer';
  onContact: (contact: NGO | Lawyer) => void;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({ contact, type, onContact }) => {
  const isLawyer = type === 'lawyer';
  const lawyer = contact as Lawyer;
  const ngo = contact as NGO;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
            {contact.verified && (
              <Shield className="w-4 h-4 text-green-500" />
            )}
          </div>
          
          <div className="flex items-center space-x-1 mb-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{contact.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({Math.floor(Math.random() * 50) + 10} reviews)</span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{contact.location}</span>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isLawyer 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-teal-100 text-teal-800'
        }`}>
          {isLawyer ? 'Lawyer' : 'NGO'}
        </div>
      </div>

      {/* Description/Experience */}
      <div className="mb-4">
        {isLawyer ? (
          <div>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Experience:</span> {lawyer.experience} years
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Bar Council:</span> {lawyer.barCouncil}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-700 mb-2">{ngo.description}</p>
        )}
      </div>

      {/* Specialization/Expertise */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-800 mb-2">
          {isLawyer ? 'Specialization:' : 'Expertise:'}
        </p>
        <div className="flex flex-wrap gap-2">
          {(isLawyer ? lawyer.specialization : ngo.expertise).slice(0, 3).map((item, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isLawyer
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-teal-50 text-teal-700'
              }`}
            >
              {item}
            </span>
          ))}
          {(isLawyer ? lawyer.specialization : ngo.expertise).length > 3 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{(isLawyer ? lawyer.specialization : ngo.expertise).length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Contact Actions */}
      <div className="flex space-x-2">
        <Button
          onClick={() => onContact(contact)}
          variant="primary"
          icon={Mail}
          size="sm"
          className={isLawyer ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700'}
        >
          Contact Anonymously
        </Button>
        
        {contact.phoneNumber && (
          <Button
            onClick={() => window.open(`tel:${contact.phoneNumber}`)}
            variant="ghost"
            icon={Phone}
            size="sm"
          >
            Call
          </Button>
        )}
      </div>
    </div>
  );
};

export default DirectoryCard;