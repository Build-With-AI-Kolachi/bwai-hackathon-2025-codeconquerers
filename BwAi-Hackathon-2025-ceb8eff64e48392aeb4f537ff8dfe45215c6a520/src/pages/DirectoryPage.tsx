import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { getNGOs, getLawyers } from '../services/api';
import DirectoryCard from '../components/DirectoryCard/DirectoryCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Button from '../components/UI/Button';
import type { NGO, Lawyer } from '../types';

const DirectoryPage: React.FC = () => {
  const [ngos, setNGOs] = useState<NGO[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredNGOs, setFilteredNGOs] = useState<NGO[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ngos' | 'lawyers'>('ngos');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDirectory();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchTerm, locationFilter, ngos, lawyers, activeTab]);

  const loadDirectory = async () => {
    try {
      setIsLoading(true);
      const [ngoData, lawyerData] = await Promise.all([
        getNGOs(),
        getLawyers()
      ]);
      
      // Add sample data if empty
      const sampleNGOs: NGO[] = ngoData.length ? ngoData : [
        {
          id: '1',
          name: 'Women Protection Alliance',
          description: 'Dedicated to supporting women facing domestic violence and harassment.',
          location: 'Karachi, Sindh',
          expertise: ['Domestic Violence', 'Legal Aid', 'Counseling', 'Emergency Shelter'],
          contactEmail: 'help@wpa.org.pk',
          phoneNumber: '+92-21-123-4567',
          verified: true,
          rating: 4.8
        },
        {
          id: '2',
          name: 'Aurat Foundation',
          description: 'Working for women\'s rights and gender equality across Pakistan.',
          location: 'Islamabad, ICT',
          expertise: ['Women Rights', 'Legal Support', 'Advocacy', 'Training'],
          contactEmail: 'support@af.org.pk',
          phoneNumber: '+92-51-987-6543',
          verified: true,
          rating: 4.9
        },
        {
          id: '3',
          name: 'Shirkat Gah',
          description: 'Women\'s resource centre working on women\'s rights and empowerment.',
          location: 'Lahore, Punjab',
          expertise: ['Legal Aid', 'Research', 'Training', 'Publications'],
          contactEmail: 'info@shirkatgah.org',
          verified: true,
          rating: 4.7
        }
      ];

      const sampleLawyers: Lawyer[] = lawyerData.length ? lawyerData : [
        {
          id: '1',
          name: 'Advocate Fatima Khan',
          specialization: ['Family Law', 'Domestic Violence', 'Women Rights'],
          location: 'Karachi, Sindh',
          experience: 12,
          contactEmail: 'fatima.khan@law.pk',
          phoneNumber: '+92-21-456-7890',
          verified: true,
          rating: 4.9,
          barCouncil: 'Sindh Bar Council'
        },
        {
          id: '2',
          name: 'Advocate Sarah Ahmed',
          specialization: ['Criminal Law', 'Harassment Cases', 'Civil Rights'],
          location: 'Islamabad, ICT',
          experience: 8,
          contactEmail: 'sarah.ahmed@advocates.pk',
          phoneNumber: '+92-51-234-5678',
          verified: true,
          rating: 4.8,
          barCouncil: 'Islamabad Bar Association'
        },
        {
          id: '3',
          name: 'Advocate Zainab Ali',
          specialization: ['Family Law', 'Property Rights', 'Legal Aid'],
          location: 'Lahore, Punjab',
          experience: 15,
          contactEmail: 'zainab.ali@lawfirm.pk',
          verified: true,
          rating: 4.7,
          barCouncil: 'Punjab Bar Council'
        }
      ];

      setNGOs(sampleNGOs);
      setLawyers(sampleLawyers);
    } catch (err) {
      setError('Failed to load directory. Please try again.');
      console.error('Directory loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResults = () => {
    const currentData = activeTab === 'ngos' ? ngos : lawyers;
    
    const filtered = currentData.filter(contact => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activeTab === 'ngos' 
          ? (contact as NGO).expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
          : (contact as Lawyer).specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      
      const matchesLocation = 
        locationFilter === '' || 
        contact.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesSearch && matchesLocation;
    });

    if (activeTab === 'ngos') {
      setFilteredNGOs(filtered as NGO[]);
    } else {
      setFilteredLawyers(filtered as Lawyer[]);
    }
  };

  const handleContact = (contact: NGO | Lawyer) => {
    // In a real implementation, this would open a secure messaging interface
    alert(`Contacting ${contact.name} anonymously...`);
  };

  const getUniqueLocations = () => {
    const allContacts = [...ngos, ...lawyers];
    const locations = allContacts.map(c => c.location.split(',')[1]?.trim() || c.location.split(',')[0]);
    return [...new Set(locations)].filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Directory</h1>
        <p className="text-gray-600">Connect with verified NGOs and lawyers who can help</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('ngos')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'ngos'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            NGOs ({ngos.length})
          </button>
          <button
            onClick={() => setActiveTab('lawyers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'lawyers'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Lawyers ({lawyers.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'ngos' ? 'NGOs' : 'lawyers'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="md:w-48">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {getUniqueLocations().map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'ngos' 
          ? filteredNGOs.map(ngo => (
              <DirectoryCard
                key={ngo.id}
                contact={ngo}
                type="ngo"
                onContact={handleContact}
              />
            ))
          : filteredLawyers.map(lawyer => (
              <DirectoryCard
                key={lawyer.id}
                contact={lawyer}
                type="lawyer"
                onContact={handleContact}
              />
            ))
        }
      </div>

      {/* No Results */}
      {((activeTab === 'ngos' && filteredNGOs.length === 0) || 
        (activeTab === 'lawyers' && filteredLawyers.length === 0)) && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;