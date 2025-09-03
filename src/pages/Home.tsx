import { MessageCircle, Users, Calendar, Newspaper, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Home = () => {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const startDate = new Date('2024-06-10');
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    setDays(diffDays);

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setDays((prev) => prev + 1);
      const interval = setInterval(() => setDays((prev) => prev + 1), 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const stats = [
    { label: "#8 World's Largest Political Party", value: '20M+ members', icon: Users, color: 'text-green-500' },
    { label: 'Days of Struggle', value: `${days}+`, icon: Calendar, color: 'text-red-500' },
    { label: 'News Updates', value: '20+', icon: Newspaper, color: 'text-blue-500' },
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-green-600 text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-300 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-red-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl font-bold mb-6 animate-fade-in">
                Pakistan Tehreek-e-Insaaf
              </h1>
              <h2 className="text-4xl font-semibold text-green-200 mb-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                Pakistan Youth Council
              </h2>
              <p className="text-xl mb-8 opacity-90 animate-fade-in" style={{animationDelay: '0.3s'}}>
                Empowering Pakistan's youth through digital activism and social media engagement. 
                Standing with our leader Imran Khan in the fight for justice and democracy.
              </p>
              
              {/* WhatsApp Group Link */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
                <a 
                target="_blank"
                  href="https://whatsapp.com/channel/0029VaDDfNd1iUxdIoaKUp2b"
                  className="flex-1 items-center px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-green-500/25"
                >
                  <MessageCircle className="mr-3" size={24} />
                  Join WhatsApp Channel
                  <ExternalLink className="ml-2" size={18} />
                </a>
                <a
                  href="/management"
                  className="flex-1 items-center px-8 py-4 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105"
                >
                  <Users className="mr-3" size={24} />
                  Meet Our Management Team
                </a>
                <a
                  href="#"
                  className="flex-1 items-center px-8 py-4 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105"
                >
                  <Users className="mr-3" size={24} />
                  Meet Our Team Head
                </a>
              </div>
            </div>
            
            {/* Chairman Photo */}
            <div className="flex justify-center">
              <div className="relative animate-fade-in" style={{animationDelay: '0.8s'}}>
                <div className="w-80 h-80 bg-white rounded-full shadow-2xl overflow-hidden border-8 border-white transform hover:scale-105 transition-all duration-300">
                  <img
                    src="/assets/pm-iMRAN.webp"
                    alt="Party Chairman"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-green-500 text-white px-6 py-3 rounded-full shadow-xl font-semibold">
                  <span className="font-semibold">Party Chairman</span>
                </div>
                
                {/* Floating elements around photo */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-red-500">
                  <div className="bg-gradient-to-br from-red-50 to-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className={`${stat.color}`} size={48} />
                  </div>
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-3">{stat.value}</h3>
                  <p className="text-gray-700 font-semibold text-lg">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section> 


      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 via-white to-green-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-green-500 transform rotate-12 scale-150"></div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-6">
            What is PTI ?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Pakistan Tehreek-e-Insaf (PTI) is a political party on paper, but it is way bigger than that. It's a dream
            for a prosperous Pakistan where every man and woman has high self esteem and takes care of fellow citizens
            per the priniciples of humanity.The goal of its founder Imran Khan is to ensure Justice for all as he believes that a just society has the best chance to succeed. At the core, PTI just wants to make sure that we as a nation are the best version of ourselves and make a name for us in this world.
          </p>
        </div>

        <div className="text-center mb-12">
  <p className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-red-600 via-green-500 to-red-600 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
  <span className="text-red-600 animate-none inline-block">❤️ </span>
   Our Team is working for Imran Khan for{" "}
    <span className="text-red-600 animate-none inline-block">{days}+</span> days <span className="text-red-600 animate-none inline-block"> ❤️</span>
  </p>
</div>


        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              PYC (Pakistan Youth Council) is the digital voice of PTI, mobilizing youth across Pakistan to build a better
              future through technology, social media, and grassroots activism.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-8">Digital Revolution</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 mt-1 shadow-lg">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">Social media campaigns for awareness and engagement</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 mt-1 shadow-lg">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">Youth mobilization through digital platforms</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 mt-1 shadow-lg">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">Grassroots coordination and community building</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 mt-1 shadow-lg">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">Democratic values and justice advocacy</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="w-72 h-72 bg-gradient-to-br  from-red-500 to-green-600 rounded-full mx-auto shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all duration-300 animate-pulse">
                <div className="text-white text-center">
                  <h4 className="text-4xl font-bold mb-3">PYC</h4>
                  <p className="text-xl font-semibold">Pakistan Youth Council</p>
                  <p className="text-base opacity-90 mt-2">Digital Warriors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;