import React, { useState, useEffect } from 'react';
import { Calendar, Eye, ExternalLink, Video, Image as ImageIcon, Play } from 'lucide-react';
import { newsService, NewsItem, ContentType } from '../services/newsService';

const Showcase = () => {
  const [showcaseItems, setShowcaseItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadShowcase();
  }, []);

  const loadShowcase = async () => {
    try {
      setIsLoading(true);
      const allItems = await newsService.getAllNews();
      const showcaseItems = allItems.filter(item => item.type === 'showcase');
      setShowcaseItems(showcaseItems);
    } catch (error) {
      console.error('Error loading showcase:', error);
      // Fallback to sample data if Firebase fails
      const sampleShowcase: NewsItem[] = [
        {
            id: '2',
            title: 'Discussion with Barister Gohar Ali Khan',
            description: ' ',
            imageUrl: '/assets/1.webp',
            date: '2025-9-4',
            link: '#',
            type: 'showcase'
          },
        {
          id: '2',
          title: 'Meeting with MNA Junaid Akbar Khan',
          description: ' ',
          imageUrl: '/assets/2.webp',
          date: '2025-9-4',
          link: '#',
          type: 'showcase'
        },
        // {
        //   id: '3',
        //   title: 'Meeting with MNA Junaid Akbar Khan',
        //   description: ' ',
        //   imageUrl: '/assets/3.webp',
        //   videoUrl: 'https://player.vimeo.com/video/148751763',
        //   date: '2024-01-10',
        //   type: 'showcase'
        // }
        {
          id: '3',
          title: 'Meeting with MNA Junaid Akbar Khan',
          description: ' ',
          imageUrl: '/assets/3.webp',
          date: '2024-01-10',
          type: 'showcase'
        },
        {
            id: '4',
            title: 'With MNA Juniad Khan Akber + MNA Arbab Sher ',
            description: ' ',
            imageUrl: '/assets/4.webp',
            date: '2024-01-10',
            type: 'showcase'
          }
      ];
      setShowcaseItems(sampleShowcase);
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

  const openModal = (item: NewsItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
            <Video className="mr-3 text-green-500" size={40} />
            Showcase Gallery
          </h1>
          <p className="text-2xl text-gray-700">Meetings, discussions, and events from PTI and Pakistan Youth Council</p>
        </div>

        {/* Intro Section */}
<div className="flex flex-col lg:flex-row items-center bg-white rounded-2xl shadow-xl p-8 mb-12">
  {/* Left Side Image */}
  <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
    <img 
      src="/assets/main.webp" 
      alt="Introduction" 
      className="rounded-xl w-full h-80 object-cover shadow-lg"
    />
  </div>

  {/* Right Side Text */}
  <div className="w-full lg:w-1/2 lg:pl-10 text-center lg:text-left">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">
      Welcome to the Showcase
    </h2>
    <p className="text-gray-600 text-lg leading-relaxed">
  This page introduces <span className="font-semibold">Ahmad Raza</span>, 
  the in-charge of our team. With his strong leadership and vision, 
  he has played a key role in empowering the youth and guiding 
  the Pakistan Youth Council toward meaningful initiatives. 
  Under his direction, countless efforts have been launched to 
  promote community development, youth engagement, and social awareness.
</p>
  </div>
</div>


        {/* Content Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading showcase content...</p>
          </div>
        ) : showcaseItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-xl border-2 border-gray-100">
            <Video className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Showcase Content Yet</h3>
            <p className="text-gray-500">Showcase content will appear here once added from the dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseItems.map((item) => (
              <article key={item.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:scale-105 border-b-4 border-green-500">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    {item.videoUrl && isVideoUrl(item.videoUrl) ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center relative cursor-pointer" onClick={() => openModal(item)}>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-70"
                          loading='lazy'
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                            <Play size={32} className="text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Video
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar size={16} className="mr-2 text-green-500" />
                    {formatDate(item.date)}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-green-600 transition-colors duration-200">
                    {item.title}
                  </h2>
                  
                  {item.description && (
                    <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => openModal(item)}
                      className="flex items-center text-green-600 hover:text-green-700 font-semibold transition-all duration-200 hover:scale-105"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </button>
                    
                    {item.link && (
                      <a
                        href={item.link}
                        className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-110"
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
        )}

        {/* Modal for detailed view */}
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                {selectedItem.videoUrl && isVideoUrl(selectedItem.videoUrl) ? (
                  <div className="w-full h-96 bg-black">
                    <iframe
                      src={getVideoEmbedUrl(selectedItem.videoUrl)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-96 object-cover"
                  />
                )}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar size={16} className="mr-2 text-green-500" />
                  {formatDate(selectedItem.date)}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {selectedItem.title}
                </h2>
                
                {selectedItem.description && (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}
                
                {selectedItem.link && (
                  <a
                    href={selectedItem.link}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    External Link
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {showcaseItems.length > 0 && (
          <div className="text-center mt-12">
            <button 
              onClick={loadShowcase}
              className="bg-gradient-to-r from-red-500 to-green-500 text-white px-10 py-4 rounded-xl font-bold hover:from-red-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Showcase;