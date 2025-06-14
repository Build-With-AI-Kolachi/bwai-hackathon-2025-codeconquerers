import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Shield, Users, Heart, ArrowRight } from 'lucide-react';
import Button from '../components/UI/Button';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-purple-100 rounded-full">
            <Shield className="w-12 h-12 text-purple-600" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Aurat Ki Awaz
        </h1>
        <p className="text-xl text-gray-600 mb-2">Women's Voice Platform</p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Safely and anonymously report harassment, domestic violence, and discrimination. 
          Your voice matters, and we're here to help amplify it.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/record">
            <Button icon={Mic} size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Recording
            </Button>
          </Link>
          <Link to="/directory">
            <Button variant="secondary" icon={Users} size="lg">
              Find Help
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
            <Mic className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Recording</h3>
          <p className="text-gray-600 text-sm">
            Record your experience in Urdu, English, or both. Our AI will transcribe 
            and enhance your message while maintaining your anonymity.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="p-3 bg-teal-100 rounded-full w-fit mx-auto mb-4">
            <Shield className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Support</h3>
          <p className="text-gray-600 text-sm">
            Get relevant Pakistani legal clauses and connect with verified lawyers 
            who specialize in women's rights and harassment cases.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-4">
            <Heart className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">NGO Network</h3>
          <p className="text-gray-600 text-sm">
            Connect with trusted NGOs and support organizations that can provide 
            immediate help and long-term assistance.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Record</h3>
            <p className="text-sm text-gray-600">Share your experience through voice recording</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Review</h3>
            <p className="text-sm text-gray-600">Edit the transcript and add legal context</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Generate</h3>
            <p className="text-sm text-gray-600">Create voice or video message</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
              4
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Share</h3>
            <p className="text-sm text-gray-600">Connect with lawyers and NGOs anonymously</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Your Voice Can Make a Difference</h2>
        <p className="text-lg mb-6 opacity-90">
          Don't let harassment go unreported. We provide a safe, anonymous platform 
          to help you get the support you deserve.
        </p>
        <Link to="/record">
          <Button 
            variant="secondary" 
            size="lg"
            icon={ArrowRight}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            Get Started Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;