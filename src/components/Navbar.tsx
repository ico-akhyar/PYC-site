import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users, Calendar, Newspaper, Settings } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/leaders', label: 'Leaders', icon: Users },
    { path: '/imran-khan-in-jail', label: 'Imran Khan', icon: Calendar },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/dashboard', label: 'Dashboard', icon: Settings }
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-red-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
    <img
      src="/assets/pyc_logo.webp"
      alt="PYC Logo"
      className="w-full h-full object-cover"
      loading='lazy'
    />
  </div>
  <div>
    <h1 className="text-xl font-bold text-gray-800">PY Social Media Team</h1>
    <p className="text-sm text-green-600">Pakistan Youth Council</p>
  </div>
</Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-red-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-red-500 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-red-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;