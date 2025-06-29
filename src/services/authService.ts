import { FirebaseUser } from '../types';

let currentMockUser: FirebaseUser | null = null;
let authStateListener: ((user: FirebaseUser | null) => void) | null = null;

// Simulate persistence by reading from localStorage on startup.
try {
  const storedUser = localStorage.getItem('mockUser');
  if (storedUser) {
    currentMockUser = JSON.parse(storedUser);
  }
} catch (e) {
  console.error("Could not parse mock user from localStorage", e);
  currentMockUser = null;
}

const MOCK_USER_DATA_TEMPLATE: Omit<FirebaseUser, 'email' | 'uid'> = {
  displayName: 'Alex Nova',
  photoURL: `https://i.pravatar.cc/150?u=alexnova`,
};

const notifyListener = () => {
  if (authStateListener) {
    // Ensure we pass a new object to trigger React state updates if needed
    authStateListener(currentMockUser ? { ...currentMockUser } : null);
  }
};

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const signUpWithEmailPassword = async (email: string, password: string): Promise<FirebaseUser | null> => {
  await simulateDelay(500);
  if (!email || !email.includes('@')) {
     const error = new Error("Please enter a valid email address.");
     // @ts-ignore
     error.code = 'auth/invalid-email';
     throw error;
  }
  if (password.length < 6) {
    const error = new Error("Password is too weak. It should be at least 6 characters.");
    // @ts-ignore
    error.code = 'auth/weak-password';
    throw error;
  }

  console.log("Mock Sign-Up successful for:", email);
  currentMockUser = {
    ...MOCK_USER_DATA_TEMPLATE,
    uid: `mock-uid-${Date.now()}`,
    email: email,
    displayName: email.split('@')[0],
  };
  localStorage.setItem('mockUser', JSON.stringify(currentMockUser));
  notifyListener();
  return currentMockUser;
};

export const signInWithEmailPassword = async (email: string, password: string): Promise<FirebaseUser | null> => {
  await simulateDelay(500);
  // Simple mock logic: any valid-looking email and password works.
  if (email.includes('@') && password) {
    console.log("Mock Sign-In successful for:", email);
    currentMockUser = {
        ...MOCK_USER_DATA_TEMPLATE,
        uid: `mock-uid-${Date.now()}`,
        email: email,
        displayName: email.split('@')[0],
        photoURL: `https://i.pravatar.cc/150?u=${email}`,
    };
    localStorage.setItem('mockUser', JSON.stringify(currentMockUser));
    notifyListener();
    return currentMockUser;
  }

  const error = new Error('Invalid email or password. Please try again.');
  // @ts-ignore
  error.code = 'auth/invalid-credential';
  throw error;
};

export const signOutUser = async (): Promise<void> => {
   await simulateDelay(200);
   console.log("Mock user signed out successfully.");
   currentMockUser = null;
   localStorage.removeItem('mockUser');
   notifyListener();
};

export const onAuthUserChanged = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  authStateListener = callback;
  // Immediately notify with the current state upon subscription
  notifyListener();
  
  // Return the unsubscribe function
  return () => {
    authStateListener = null;
  };
};