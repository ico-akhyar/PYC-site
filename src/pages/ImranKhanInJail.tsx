import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart } from 'lucide-react';

const ImranKhanInJail = () => {
  const [days, setDays] = useState(846);

  useEffect(() => {
    // Calculate days since August 5, 2023 (Imran Khan's arrest date)
    const startDate = new Date('2023-08-05');
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - startDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    
    // Ensure minimum of 837 days as requested
    const actualDays = Math.max(daysDifference, 837);
    setDays(actualDays);

    // Update every day at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      setDays(prev => prev + 1);
      
      // Set up daily interval
      const interval = setInterval(() => {
        setDays(prev => prev + 1);
      }, 24 * 60 * 60 * 1000);

      return () => clearInterval(interval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Imran Khan</h1>
          <p className="text-2xl text-gray-600 mb-8">Standing Strong for Justice</p>
          
          {/* Chairman Photo in Circular Frame */}
          <div className="relative inline-block mb-12">
            <div className="w-80 h-80 bg-white rounded-full shadow-2xl overflow-hidden border-8 border-gradient-to-r from-red-500 to-green-500 mx-auto relative">
              <img
                src="/assets/Imran-Khan-2011.webp"
                alt="Imran Khan"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay for solidarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Hearts animation */}
            <div className="absolute -top-4 -right-4 animate-pulse">
              <Heart className="text-red-500 fill-current" size={32} />
            </div>
            <div className="absolute -bottom-4 -left-4 animate-pulse" style={{animationDelay: '0.5s'}}>
              <Heart className="text-red-500 fill-current" size={24} />
            </div>
          </div>
        </div>

        {/* Days Counter */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-4 border-gradient-to-r from-red-500 to-green-500 mb-12">
          <Calendar className="mx-auto mb-6 text-red-500" size={64} />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Days of Struggle</h2>
          
          {/* Animated Counter */}
          <div className="relative">
            <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500 mb-4 animate-pulse">
              {days.toLocaleString()}
            </div>
            <div className="flex items-center justify-center text-gray-600 text-xl">
              <Clock className="mr-2" size={24} />
              <span>Days and Counting...</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            Every day strengthens our resolve. Every moment brings us closer to justice. 
            Imran Khan's unwavering commitment to Pakistan continues to inspire millions.
          </p>
        </div>

        {/* Solidarity Messages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-red-50 rounded-xl p-6 text-center border-2 border-red-200">
            <Heart className="mx-auto mb-4 text-red-500 fill-current" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Unwavering Support</h3>
            <p className="text-gray-600">
              The youth of Pakistan stands united behind our leader's vision of justice and democracy.
            </p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-200">
            <Calendar className="mx-auto mb-4 text-green-500" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Historic Struggle</h3>
            <p className="text-gray-600">
              These days mark a historic chapter in Pakistan's journey towards true independence.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6 text-center border-2 border-blue-200">
            <Clock className="mx-auto mb-4 text-blue-500" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Time for Justice</h3>
            <p className="text-gray-600">
              Time will vindicate the truth. Justice delayed is not justice denied.
            </p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-16 text-center">
          <blockquote className="text-3xl font-italic text-gray-700 mb-6 max-w-4xl mx-auto">
            "I will fight till the last ball"
          </blockquote>
          <cite className="text-xl text-gray-500">- Imran Khan</cite>
        </div>
      </div>
    </div>
  );
};

export default ImranKhanInJail;