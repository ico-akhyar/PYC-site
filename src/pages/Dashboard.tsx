import React, { useState, useEffect } from 'react';
import { Plus, Upload, Save, Trash2, Image as ImageIcon, Link as LinkIcon, Lock, User } from 'lucide-react';
import { db } from '../firebase';
 


interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  link?: string;
}

const Dashboard = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [newNews, setNewNews] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: ''
  });

  // ✅ Load news from Firestore
  useEffect(() => {
    const fetchNews = async () => {
      const snapshot = await getDocs(collection(db, 'pti_news'));
      const data: NewsItem[] = snapshot.docs.map(doc => ({
  id: doc.id,
  ...(doc.data() as Omit<NewsItem, "id">),
}));
      setNewsItems(data);
    };
    fetchNews();
  }, []);

  // ✅ Simple login
  const handleLogin = () => {
    if (credentials.username === 'pti_admin' && credentials.password === 'pti2024') {
      setIsAuthenticated(true);
      localStorage.setItem('pti_auth', 'true');
    } else {
      alert('Invalid credentials');
    }
  };

  useEffect(() => {
    const authStatus = localStorage.getItem('pti_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pti_auth');
  };

  // ✅ Add news into Firestore
  const addNews = async () => {
    if (!newNews.title || !newNews.description || !newNews.imageUrl) {
      alert('Please fill in all required fields');
      return;
    }

    const docRef = await addDoc(collection(db, 'pti_news'), {
      title: newNews.title,
      description: newNews.description,
      imageUrl: newNews.imageUrl,
      date: new Date().toISOString(),
      link: newNews.link || null,
    });

    setNewsItems([{ id: docRef.id, ...newNews, date: new Date().toISOString() }, ...newsItems]);
    setNewNews({ title: '', description: '', imageUrl: '', link: '' });
    setIsAdding(false);
  };

  // ✅ Delete news from Firestore
  const deleteNews = async (id: string) => {
    await deleteDoc(doc(db, 'pti_news', id));
    setNewsItems(newsItems.filter(item => item.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-green-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">PTI Dashboard</h2>
            <p className="text-gray-600">Admin Access Required</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <User size={18} className="inline mr-2" />
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Lock size={18} className="inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                placeholder="Enter password"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-red-500 to-green-500 text-white py-3 rounded-lg font-semibold"
            >
              Login to Dashboard
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo credentials: pti_admin / pti2024</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">News Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage PTI news and updates</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold"
            >
              <Plus size={20} className="mr-2" />
              Add News
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold"
            >
              <Lock size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Add News Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Add New News Item</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                value={newNews.title}
                onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                placeholder="Enter news title *"
              />
              
              <input
                type="url"
                value={newNews.link}
                onChange={(e) => setNewNews({ ...newNews, link: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                placeholder="https://example.com"
              />
            </div>
            
            <textarea
              value={newNews.description}
              onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mt-6"
              placeholder="Enter news description *"
            />

            <input
              type="url"
              value={newNews.imageUrl}
              onChange={(e) => setNewNews({ ...newNews, imageUrl: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mt-6"
              placeholder="Enter image URL (from GitHub or Pexels) *"
            />
            
            {newNews.imageUrl && (
              <div className="mt-4">
                <img src={newNews.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
              </div>
            )}
            
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setIsAdding(false)} className="px-6 py-3 text-gray-600">
                Cancel
              </button>
              <button onClick={addNews} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold">
                <Save size={20} className="mr-2" />
                Save News
              </button>
            </div>
          </div>
        )}

        {/* News List */}
        <div className="space-y-6">
          {newsItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <ImageIcon className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No News Items</h3>
              <p className="text-gray-500">Add your first news item to get started.</p>
            </div>
          ) : (
            newsItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-500">
                <div className="flex">
                  <div className="w-48 h-32 bg-gray-200 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600">
                              <LinkIcon size={14} className="mr-1" />
                              External Link
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteNews(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
