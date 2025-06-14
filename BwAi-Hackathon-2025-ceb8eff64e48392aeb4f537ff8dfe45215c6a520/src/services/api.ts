import { db, storage, functions } from '../config/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { v4 as uuidv4 } from 'uuid';
import type { Report, NGO, Lawyer } from '../types';

// Reports API
export const createReport = async (reportData: Partial<Report>): Promise<string> => {
  const reportRef = await addDoc(collection(db, 'reports'), {
    ...reportData,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
    status: 'recording'
  });
  return reportRef.id;
};

export const updateReport = async (reportId: string, updates: Partial<Report>): Promise<void> => {
  const reportRef = doc(db, 'reports', reportId);
  await updateDoc(reportRef, updates);
};

export const getReport = async (reportId: string): Promise<Report | null> => {
  const reportRef = doc(db, 'reports', reportId);
  const reportSnap = await getDoc(reportRef);
  
  if (reportSnap.exists()) {
    return { id: reportSnap.id, ...reportSnap.data() } as Report;
  }
  return null;
};

// Audio Upload
export const uploadAudio = async (audioBlob: Blob, reportId: string): Promise<string> => {
  const audioRef = ref(storage, `audio/${reportId}/${uuidv4()}.wav`);
  const snapshot = await uploadBytes(audioRef, audioBlob);
  return await getDownloadURL(snapshot.ref);
};

// AI Service Functions (Firebase Functions)
export const transcribeAudio = async (audioUrl: string): Promise<string> => {
  // Placeholder for AI transcription service
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("یہ ایک نمونہ ٹرانسکرپٹ ہے۔ This is a sample transcript showing mixed Urdu and English content for testing purposes.");
    }, 2000);
  });
};

export const expandTranscript = async (transcript: string): Promise<string> => {
  // Placeholder for AI expansion service
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${transcript}\n\nExpanded context: This report describes incidents that may fall under various Pakistani laws including the Protection of Women Act 2006, Criminal Code sections related to harassment, and domestic violence provisions.`);
    }, 1500);
  });
};

export const suggestLegalClauses = async (transcript: string): Promise<string[]> => {
  // Placeholder for RAG-based legal clause suggestion
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        "Section 509 PPC - Criminal Intimidation",
        "Protection of Women Act 2006",
        "Domestic Violence Act 2013",
        "Section 354 PPC - Assault on Women"
      ]);
    }, 1000);
  });
};

export const generateVoice = async (text: string): Promise<string> => {
  // Placeholder for voice generation (ElevenLabs, etc.)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("https://example.com/generated-voice.mp3");
    }, 3000);
  });
};

export const generateVideo = async (text: string): Promise<string> => {
  // Placeholder for video generation (D-ID, Synthesia, etc.)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("https://example.com/generated-video.mp4");
    }, 5000);
  });
};

// NGOs and Lawyers
export const getNGOs = async (): Promise<NGO[]> => {
  const ngosRef = collection(db, 'ngos');
  const q = query(ngosRef, where('verified', '==', true), orderBy('rating', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as NGO[];
};

export const getLawyers = async (): Promise<Lawyer[]> => {
  const lawyersRef = collection(db, 'lawyers');
  const q = query(lawyersRef, where('verified', '==', true), orderBy('rating', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Lawyer[];
};

// Generate secure share URL
export const generateShareUrl = async (reportId: string): Promise<string> => {
  const shareId = uuidv4();
  await updateReport(reportId, { shareUrl: shareId });
  return `${window.location.origin}/shared/${shareId}`;
};