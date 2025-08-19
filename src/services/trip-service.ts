import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Trip {
  id?: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  userId: string;
  createdAt: Date;
}

export const tripService = {
  createTrip: async (trip: Omit<Trip, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'trips'), {
      ...trip,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  getUserTrips: async (userId: string): Promise<Trip[]> => {
    const q = query(
      collection(db, 'trips'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Trip[];
  },

  getTripById: async (tripId: string): Promise<Trip | null> => {
    // здесь будет логика получения конкретной поездки
    return null;
  },

  updateTrip: async (tripId: string, updates: Partial<Trip>): Promise<void> => {
    await updateDoc(doc(db, 'trips', tripId), updates);
  },

  deleteTrip: async (tripId: string): Promise<void> => {
    await deleteDoc(doc(db, 'trips', tripId));
  },
};
