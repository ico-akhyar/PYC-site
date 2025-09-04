import React, { useState, useEffect } from 'react';
import { Plus, Upload, Save, Trash2, Image as ImageIcon, Link as LinkIcon, Lock, User, Video, Type } from 'lucide-react';
import { newsService, NewsItem, ContentType } from '../services/newsService';

const Dashboard = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [contentType, setContentType] = useState<ContentType>('notification');
  const [newNews, setNewNews] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    link: '',
    type: 'notification' as ContentType
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
    if (!newNews.title) {
      alert('Please fill in the title field');
      return;
    }

    if (newNews.type === 'notification' && (!newNews.description || !newNews.imageUrl)) {
      alert('Please fill in all required fields for notifications');
      return;
    }

    if (newNews.type === 'showcase' && !newNews.imageUrl && !newNews.videoUrl) {
      alert('Please provide either an image or video for showcase content');
      return;
    }

    try {
      setIsLoading(true);
      await newsService.addNews({
        title: newNews.title,
        description: newNews.description,
        imageUrl: newNews.imageUrl,
        videoUrl: newNews.videoUrl || undefined,
        date: new Date().toISOString().split('T')[0],
        link: newNews.link || undefined,
        type: newNews.type
      });
      
      // Reload news items
      await loadNews();
      
      setNewNews({ 
        title: '', 
        description: '', 
        imageUrl: '', 
        videoUrl: '',
        link: '', 
        type: 'notification' 
      });
      setContentType('notification');
      setIsAdding(false);
      alert('Content added successfully!');
    } catch (error) {
      console.error('Error adding content:', error);
      alert('Failed to add content item');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNews = async (id: string) => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setIsLoading(true);
      await newsService.deleteNews(id);
      await loadNews();
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    } finally {
      setIsLoading(false);
    }
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

  const isVideoUrl = (url: string) => {
    return /(youtube|youtu\.be|vimeo|tiktok|facebook|twitter)/i.test(url);
  };

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
    } else if (url.includes('vimeo.com')) {
      const videoId = url.match(/(?:vimeo\.com\/)([0-9]+)/);
      return videoId ? `https://player.vimeo.com/video/${videoId[1]}` : url;
    } else if (url.includes('tiktok.com')) {
      // TikTok requires special handling, but for now just return the original URL
      return url;
    }
    return url;
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">Content Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage PTI notifications and showcase content</p>
          </div>
          <div className="flex gap-4">
          // inside the header buttons
<button
  onClick={() => window.location.href = '/registrations'}
  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
>
  <Users size={20} className="mr-2" />
  View Registrations
</button>

            <button
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              Add Content
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
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-6">Add New Content</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Content Type *
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setContentType('notification');
                    setNewNews({...newNews, type: 'notification'});
                  }}
                  className={`px-6 py-3 rounded-lg flex items-center font-semibold transition-all duration-200 ${
                    contentType === 'notification' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Type size={20} className="mr-2" />
                  Notification
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setContentType('showcase');
                    setNewNews({...newNews, type: 'showcase'});
                  }}
                  className={`px-6 py-3 rounded-lg flex items-center font-semibold transition-all duration-200 ${
                    contentType === 'showcase' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Video size={20} className="mr-2" />
                  Showcase
                </button>
              </div>
            </div>
            
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
                  placeholder="Enter content title"
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
            
            {contentType === 'notification' && (
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
            )}
            
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">
                {contentType === 'notification' ? 'Image *' : 'Image (Optional)'}
              </label>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={newNews.imageUrl}
                  onChange={(e) => setNewNews({ ...newNews, imageUrl: e.target.value })}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter image URL"
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
            
            {contentType === 'showcase' && (
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={newNews.videoUrl}
                  onChange={(e) => setNewNews({ ...newNews, videoUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter YouTube, Vimeo, TikTok, etc. URL"
                />
                {newNews.videoUrl && isVideoUrl(newNews.videoUrl) && (
                  <div className="mt-4">
                    <div className="text-sm text-green-600 mb-2">✓ Valid video URL detected</div>
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Video size={32} className="text-gray-400" />
                    </div>
                  </div>
                )}
                {newNews.videoUrl && !isVideoUrl(newNews.videoUrl) && (
                  <div className="mt-4 text-sm text-red-600">
                    ⚠️ This doesn't appear to be a supported video URL (YouTube, Vimeo, TikTok, Facebook, Twitter)
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setContentType('notification');
                  setNewNews({ 
                    title: '', 
                    description: '', 
                    imageUrl: '', 
                    videoUrl: '',
                    link: '', 
                    type: 'notification' 
                  });
                }}
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
                {isLoading ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          </div>
        )}

        {/* Content List */}
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
              <p className="text-gray-500">Add your first content item to get started.</p>
            </div>
          ) : (
            newsItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border-l-4 border-red-500 transform hover:scale-[1.02]">
                <div className="flex">
                  <div className="w-48 h-32 bg-gray-200 overflow-hidden">
                    {item.videoUrl && isVideoUrl(item.videoUrl) ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                        <Video size={32} className="text-white" />
                        <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Video
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-800 mr-3">{item.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'notification' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {item.type}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        )}
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