import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export const tripService = {
  // СОЗДАТЬ поездку
  async createTrip(tripData: any) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'trips'), {
        ...tripData,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Firestore error:', error);
      throw error;
    }
  },

  // ПОЛУЧИТЬ все поездки пользователя (БЕЗ КЭША)
  async getUserTrips(userId: string) {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return [];
      }

      const q = query(
        collection(db, 'trips'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting trips:', error);
      return [];
    }
  },

  // ОБНОВИТЬ поездку
  async updateTrip(tripId: string, updates: any) {
    try {
      await updateDoc(doc(db, 'trips', tripId), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  // УДАЛИТЬ поездку
  async deleteTrip(tripId: string) {
    try {
      await deleteDoc(doc(db, 'trips', tripId));
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  },
};
