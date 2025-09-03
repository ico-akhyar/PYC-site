import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, Calendar, Newspaper, FileText, Settings, Star, Flag, ChevronDown, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userLoggedIn, logout } = useAuth();

  const mainNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/management', label: 'Management', icon: Users },
    { path: '/imran-khan-in-jail', label: 'Imran Khan', icon: Calendar },
    { path: '/social-media-accounts', label: 'Accounts', icon: Flag },
    { path: '/notifications', label: 'Notifications', icon: Newspaper },
  ];

  const moreNavItems = [
    { path: '/contributions', label: 'Contributions', icon: Star },
    { path: '/dashboard', label: 'Dashboard', icon: Settings },
    { path: '/team-registration', label: 'Register in PYC', icon: FileText }
  ];

  const authNavItems = [
    { path: '/login', label: 'Login', icon: LogIn },
    { path: '/signup', label: 'Sign Up', icon: UserPlus },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsOpen(false);
      setMoreOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const renderLink = (item, extraClasses = '') => {
    const Icon = item.icon;
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${extraClasses} ${
          location.pathname === item.path
            ? 'bg-red-500 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => {
          setIsOpen(false);
          setMoreOpen(false);
        }}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-lg border-b-4 border-red-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src="/assets/pyc_logo_webp.webp"
                alt="PYC Logo"
                className="w-full h-full object-cover"
                loading='lazy'
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">PYC Social Media Team</h1>
              <p className="text-sm text-green-600">Pakistan Youth Council</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 relative">
            {mainNavItems.map(item => renderLink(item))}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <span>More</span>
                <ChevronDown size={16} className={`${moreOpen ? 'rotate-180' : ''} transition-transform`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  {moreNavItems.map(item => renderLink(item, 'px-4 py-2 block w-full'))}
                  
                  {/* Authentication options in dropdown */}
                  {userLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  ) : (
                    authNavItems.map(item => renderLink(item, 'px-4 py-2 block w-full'))
                  )}
                </div>
              )}
            </div>

            {/* User info (only when logged in) */}
            {userLoggedIn && (
              <div className="flex items-center space-x-2 text-gray-700 ml-4">
                <User size={18} />
                <span className="text-sm">{currentUser?.displayName || currentUser?.email}</span>
              </div>
            )}
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
            <div className="py-2 flex flex-col">
              {mainNavItems.map(item => (
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
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile More Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <span>More</span>
                  <ChevronDown size={16} className={`${moreOpen ? 'rotate-180' : ''} transition-transform`} />
                </button>
                {moreOpen && (
                  <div className="flex flex-col">
                    {moreNavItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => { setIsOpen(false); setMoreOpen(false); }}
                        className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100"
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    
                    {/* Authentication options in mobile dropdown */}
                    {userLoggedIn ? (
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                          setMoreOpen(false);
                        }}
                        className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left"
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    ) : (
                      authNavItems.map(item => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => { setIsOpen(false); setMoreOpen(false); }}
                          className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100"
                        >
                          <item.icon size={20} />
                          <span>{item.label}</span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Mobile User Info (only when logged in) */}
              {userLoggedIn && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center space-x-3 px-4 py-3 text-gray-700">
                    <User size={20} />
                    <span>{currentUser?.displayName || currentUser?.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;