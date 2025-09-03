import React, { useState, useEffect } from 'react';
import { Plus, Upload, Save, Trash2, Image as ImageIcon, Link as LinkIcon, Lock, User } from 'lucide-react';
import { newsService, NewsItem } from '../services/newsService';

const Dashboard = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [newNews, setNewNews] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadNews();
    }
  }, [isAuthenticated]);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const news = await newsService.getAllNews();
      setNewsItems(news);
    } catch (error) {
      console.error('Error loading news:', error);
      alert('Failed to load news items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    // Simple authentication - in production, use proper authentication
    if (credentials.username === 'senbro!' && credentials.password === 'sen@2612.') {
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

  const addNews = async () => {
    if (!newNews.title || !newNews.description || !newNews.imageUrl) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await newsService.addNews({
        title: newNews.title,
        description: newNews.description,
        imageUrl: newNews.imageUrl,
        date: new Date().toISOString().split('T')[0],
        link: newNews.link || undefined
      });
      
      // Reload news items
      await loadNews();
      
      setNewNews({ title: '', description: '', imageUrl: '', link: '' });
      setIsAdding(false);
      alert('News added successfully!');
    } catch (error) {
      console.error('Error adding news:', error);
      alert('Failed to add news item');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNews = async (id: string) => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this notification item?')) {
      return;
    }

    try {
      setIsLoading(true);
      await newsService.deleteNews(id);
      await loadNews();
      alert('Notification deleted successfully!');
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification item');
    } finally {
      setIsLoading(false);
    }
  };

  const addNews_old = () => {
    if (!newNews.title || !newNews.description || !newNews.imageUrl) {
      alert('Please fill in all required fields');
      return;
    }

    const newsItem_old: NewsItem = {
      id: Date.now().toString(),
      title: newNews.title,
      description: newNews.description,
      imageUrl: newNews.imageUrl,
      date: new Date().toISOString().split('T')[0],
      link: newNews.link || undefined
    };

    const updatedNews = [newsItem_old, ...newsItems];
    setNewsItems(updatedNews);
    // saveToStorage(updatedNews);
    
    setNewNews({ title: '', description: '', imageUrl: '', link: '' });
    setIsAdding(false);
  };

  const deleteNews_old = (id: string) => {
    const updatedNews = newsItems.filter(item => item.id !== id);
    setNewsItems(updatedNews);
    // saveToStorage(updatedNews);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewNews({ ...newNews, imageUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter password"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-red-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105"
            >
              Login to Admin Dashboard
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">Notifications Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage PTI notification and updates</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              Add Notification
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Lock size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Add News Form */}
        {isAdding && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border-2 border-gradient-to-r from-red-200 to-green-200">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-6">Add New Item</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newNews.title}
                  onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter news title"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Link (Optional)
                </label>
                <input
                  type="url"
                  value={newNews.link}
                  onChange={(e) => setNewNews({ ...newNews, link: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">
                Description *
              </label>
              <textarea
                value={newNews.description}
                onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter news description"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">
                Image *
              </label>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={newNews.imageUrl}
                  onChange={(e) => setNewNews({ ...newNews, imageUrl: e.target.value })}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter image URL (e.g., from Pexels)"
                />
                <label className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 px-4 py-3 rounded-lg cursor-pointer flex items-center transition-all duration-200 transform hover:scale-105">
                  <Upload size={20} className="mr-2" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {newNews.imageUrl && (
                <div className="mt-4">
                  <img
                    src={newNews.imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addNews}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Save size={20} className="mr-2" />
                {isLoading ? 'Saving...' : 'Save News'}
              </button>
            </div>
          </div>
        )}

        {/* News List */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}
        
        <div className="space-y-6">
          {newsItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-gray-100">
              <ImageIcon className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Items</h3>
              <p className="text-gray-500">Add your first notification item to get started.</p>
            </div>
          ) : (
            newsItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border-l-4 border-red-500 transform hover:scale-[1.02]">
                <div className="flex">
                  <div className="w-48 h-32 bg-gray-200 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-700"
                            >
                              <LinkIcon size={14} className="mr-1" />
                              External Link
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteNews(item.id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
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