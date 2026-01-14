import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, get, set, onValue, DatabaseReference } from 'firebase/database';
import { Candidate, INITIAL_CANDIDATES } from './data';

// Firebase configuration - will be populated from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

// Database paths
const CANDIDATES_PATH = 'candidates';

// Get candidates from Firebase
export async function getCandidates(): Promise<Candidate[]> {
    const candidatesRef = ref(database, CANDIDATES_PATH);
    const snapshot = await get(candidatesRef);

    if (snapshot.exists()) {
        return snapshot.val() as Candidate[];
    }

    // Initialize with default candidates if empty
    await set(candidatesRef, INITIAL_CANDIDATES);
    return INITIAL_CANDIDATES;
}

// Update a single candidate's data
export async function updateCandidate(candidate: Candidate): Promise<void> {
    const candidateRef = ref(database, `${CANDIDATES_PATH}/${parseInt(candidate.id) - 1}`);
    await set(candidateRef, candidate);
}

// Update multiple candidates at once
export async function updateCandidates(candidates: Candidate[]): Promise<void> {
    const candidatesRef = ref(database, CANDIDATES_PATH);
    await set(candidatesRef, candidates);
}

// Subscribe to real-time updates
export function subscribeToCandidates(callback: (candidates: Candidate[]) => void): () => void {
    const candidatesRef = ref(database, CANDIDATES_PATH);

    const unsubscribe = onValue(candidatesRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val() as Candidate[]);
        } else {
            callback(INITIAL_CANDIDATES);
        }
    });

    return unsubscribe;
}

// Reset all candidates to initial state (for testing)
export async function resetCandidates(): Promise<void> {
    const candidatesRef = ref(database, CANDIDATES_PATH);
    await set(candidatesRef, INITIAL_CANDIDATES);
}
