import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, MessageCircle, Send } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { name: 'WhatsApp', icon: MessageCircle, url: 'https://youtube.com/@pycahmed804?si=I3YC1i4vLhpQLJux', color: 'text-green-500' },
    { name: 'Facebook', icon: Facebook, url: '#', color: 'text-blue-600' },
    { name: 'Twitter/X', icon: Twitter, url: '#', color: 'text-gray-800' },
    { name: 'Instagram', icon: Instagram, url: '#', color: 'text-pink-500' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@pycahmed804?si=I3YC1i4vLhpQLJux', color: 'text-red-600' },
    { name: 'TikTok', icon: Send, url: '#', color: 'text-blue-500' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* PTI Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-green-500 rounded-full flex items-center justify-center">
              <img
      src="/assets/pyc_logo.webp"
      alt="PYC Logo"
      className="w-full h-full object-cover"
      loading='lazy'
    />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pakistan Tehreek-e-Insaaf</h3>
                <p className="text-gray-300">Pakistan Youth Council</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Building a better Pakistan through youth engagement and social media advocacy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-red-400 transition-colors">Home</a></li>
              <li><a href="/leaders" className="text-gray-300 hover:text-red-400 transition-colors">Party Leaders</a></li>
              <li><a href="/imran-khan-in-jail" className="text-gray-300 hover:text-red-400 transition-colors">Imran Khan</a></li>
              <li><a href="/news" className="text-gray-300 hover:text-red-400 transition-colors">News Updates</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Follow Us</h4>
            <div className="grid grid-cols-3 gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    className={`${social.color} hover:scale-110 transition-transform duration-200 flex flex-col items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700`}
                    title={social.name}
                  >
                    <Icon size={24} />
                    <span className="text-xs mt-1 text-gray-300">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Pakistan Tehreek-e-Insaaf (PTI) - Pakistan Youth Council. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;