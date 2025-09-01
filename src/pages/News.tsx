import React, { useState, useEffect } from 'react';
import { Calendar, Eye, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { newsService, NewsItem } from '../services/newsService';

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const news = await newsService.getAllNews();
      setNewsItems(news);
    } catch (error) {
      console.error('Error loading news:', error);
      // Fallback to sample data if Firebase fails
      const sampleNews: NewsItem[] = [
        {
          id: '1',
          title: 'PTI Youth Rally Success',
          description: 'Thousands of young Pakistanis joined the peaceful demonstration for democracy and justice in Lahore.',
          imageUrl: 'https://images.pexels.com/photos/1367269/pexels-photo-1367269.jpeg?auto=compress&cs=tinysrgb&w=800',
          date: '2024-01-15',
          link: '#'
        },
        {
          id: '2',
          title: 'Digital Campaign Launch',
          description: 'PYC launches comprehensive social media campaign to raise awareness about democratic values.',
          imageUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
          date: '2024-01-12',
          link: '#'
        }
      ];
      setNewsItems(sampleNews);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-500">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
            <ImageIcon className="mr-3 text-red-500" size={40} />
            News Updates
          </h1>
          <p className="text-2xl text-gray-700">Latest updates from PTI and Pakistan Youth Council</p>
        </div>

        {/* Chairman Photo Section */}
        <div className="text-center mb-12 relative">
          <div className="w-40 h-40 bg-white rounded-full shadow-2xl overflow-hidden border-6 border-gradient-to-r from-red-500 to-green-500 mx-auto mb-4 transform hover:scale-105 transition-all duration-300">
            <img
              src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Party Chairman"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-700 text-lg font-semibold">Led by our Chairman's vision</p>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading latest news...</p>
          </div>
        ) : (
        newsItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-xl border-2 border-gray-100">
            <ImageIcon className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No News Yet</h3>
            <p className="text-gray-500">News updates will appear here once added from the dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <article key={item.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:scale-105 border-b-4 border-red-500">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      Latest
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar size={16} className="mr-2 text-red-500" />
                    {formatDate(item.date)}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-red-600 transition-colors duration-200">
                    {item.title}
                  </h2>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <button className="flex items-center text-red-600 hover:text-red-700 font-semibold transition-all duration-200 hover:scale-105">
                      <Eye size={16} className="mr-2" />
                      Read More
                    </button>
                    
                    {item.link && (
                      <a
                        href={item.link}
                        className="flex items-center text-green-600 hover:text-green-700 transition-all duration-200 hover:scale-110"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ))}

        {/* Load More Button */}
        {newsItems.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-red-500 to-green-500 text-white px-10 py-4 rounded-xl font-bold hover:from-red-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg">
              Load More News
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;