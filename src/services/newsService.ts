import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface NewsItem {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  link?: string;
  createdAt?: Timestamp;
}

const NEWS_COLLECTION = 'news';

export const newsService = {
  // Add a new news item
  async addNews(newsData: Omit<NewsItem, 'id' | 'createdAt'>): Promise<string> {
    try {
      // filter out undefined fields
      const cleanData = Object.fromEntries(
        Object.entries(newsData).filter(([_, v]) => v !== undefined)
      );
  
      const docRef = await addDoc(collection(db, NEWS_COLLECTION), {
        ...cleanData,
        createdAt: Timestamp.now()
      });
  
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding news:', error.code, error.message);
      throw new Error('Failed to add news item');
    }
  }
  

  // Get all news items
  async getAllNews(): Promise<NewsItem[]> {
    try {
      const q = query(
        collection(db, NEWS_COLLECTION), 
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsItem[];
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news items');
    }
  },

  // Delete a news item
  async deleteNews(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, NEWS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting news:', error);
      throw new Error('Failed to delete news item');
    }
  }
};