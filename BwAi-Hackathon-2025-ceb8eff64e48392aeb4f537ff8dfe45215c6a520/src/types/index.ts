export interface Report {
  id: string;
  audioUrl?: string;
  transcript?: string;
  expandedTranscript?: string;
  legalClauses?: string[];
  generatedVoiceUrl?: string;
  generatedVideoUrl?: string;
  shareUrl?: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'recording' | 'transcribing' | 'reviewing' | 'generating' | 'ready' | 'shared';
  userId?: string;
}

export interface NGO {
  id: string;
  name: string;
  description: string;
  location: string;
  expertise: string[];
  contactEmail: string;
  phoneNumber?: string;
  verified: boolean;
  rating: number;
}

export interface Lawyer {
  id: string;
  name: string;
  specialization: string[];
  location: string;
  experience: number;
  contactEmail: string;
  phoneNumber?: string;
  verified: boolean;
  rating: number;
  barCouncil: string;
}

export interface LegalClause {
  section: string;
  act: string;
  description: string;
  relevantFor: string[];
}