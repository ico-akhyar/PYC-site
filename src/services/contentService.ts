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
  
  export type ContentType = 'notification' | 'showcase';
  
  export interface ContentItem {
    id?: string;
    title: string;
    description?: string;
    imageUrl: string;
    videoUrl?: string;
    date: string;
    link?: string;
    type: ContentType;
    createdAt?: Timestamp;
  }
  
  const CONTENT_COLLECTION = 'content';
  
  export const contentService = {
    // Add a new content item
    async addContent(contentData: Omit<ContentItem, 'id' | 'createdAt'>): Promise<string> {
      try {
        // Filter out undefined fields
        const cleanData = Object.fromEntries(
          Object.entries(contentData).filter(([_, v]) => v !== undefined && v !== '')
        );
    
        const docRef = await addDoc(collection(db, CONTENT_COLLECTION), {
          ...cleanData,
          createdAt: Timestamp.now()
        });
    
        return docRef.id;
      } catch (error: any) {
        console.error('Error adding content:', error.code, error.message);
        throw new Error('Failed to add content item');
      }
    },
    
  
    // Get all content items
    async getAllContent(): Promise<ContentItem[]> {
      try {
        const q = query(
          collection(db, CONTENT_COLLECTION), 
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ContentItem[];
      } catch (error) {
        console.error('Error fetching content:', error);
        throw new Error('Failed to fetch content items');
      }
    },
  
    // Get content items by type
    async getContentByType(type: ContentType): Promise<ContentItem[]> {
      try {
        const allContent = await this.getAllContent();
        return allContent.filter(item => item.type === type);
      } catch (error) {
        console.error('Error fetching content by type:', error);
        throw new Error('Failed to fetch content items by type');
      }
    },
  
    // Delete a content item
    async deleteContent(id: string): Promise<void> {
      try {
        await deleteDoc(doc(db, CONTENT_COLLECTION, id));
      } catch (error) {
        console.error('Error deleting content:', error);
        throw new Error('Failed to delete content item');
      }
    }
  };