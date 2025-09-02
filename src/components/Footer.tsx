import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, MessageCircle, Send } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { name: 'WhatsApp', icon: MessageCircle, url: 'https://wa.me/+923319235660', color: 'text-green-500' },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/people/%D9%BE%DB%8C-%D9%88%D8%A7%D8%A6%DB%8C-%D8%B3%DB%8C-%D8%B3%D9%88%D8%B4%D9%84-%D9%85%DB%8C%DA%88%DB%8C%D8%A7-%D9%B9%DB%8C%D9%85/61562260793214/?rdid=A4sg7PvEQrBojiO3&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1At72R1YHy%2F', color: 'text-blue-600' },
    { name: 'Twitter/X', icon: Twitter, url: 'https://x.com/PycTeam?s=09', color: 'text-blue-500' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/pyc_official.pk?igsh=bnV1MmpsNmxmMzEx', color: 'text-pink-500' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@pycahmed804?si=I3YC1i4vLhpQLJux', color: 'text-red-600' },
    { name: 'TikTok', icon: Send, url: 'https://www.tiktok.com/@redline_imrankhan?_t=ZS-8zMcJFffPpX&_r=1', color: 'text-black-900' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* PTI Info */}
          <div>
          <div className="flex items-center space-x-3 mb-4">
  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
    <img
      src="/assets/pyc_logo_webp.webp"
      alt="PYC Logo"
      className="w-full h-full object-contain"
      loading="lazy"
    />
  </div>
  <div>
    <h3 className="text-xl font-bold">PYC Social Media Team</h3>
    <p className="text-gray-300">Pakistan Youth Council</p>
  </div>
</div>

            <p className="text-gray-300 mb-4">
              Building a better Pakistan through youth Empowerment and social media Campaigns.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-red-400 transition-colors">Home</a></li>
              <li><a href="/management" className="text-gray-300 hover:text-red-400 transition-colors">Management</a></li>
              <li><a href="/imran-khan-in-jail" className="text-gray-300 hover:text-red-400 transition-colors">Imran Khan</a></li>
              <li><a href="/notifications" className="text-gray-300 hover:text-red-400 transition-colors">Notifications</a></li>
              <li><a href="/contributions-for-Islam" className="text-gray-300 hover:text-red-400 transition-colors">Contributions For Islam</a></li>
              <li><a href="/contributions-for-pakistan" className="text-gray-300 hover:text-red-400 transition-colors">Contributions For Pakistan</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Get in touch via these sites</h4>
            <div className="grid grid-cols-3 gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
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