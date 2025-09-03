// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Management from './pages/Management';
import ImranKhanInJail from './pages/ImranKhanInJail';
import Notifications from './pages/Notifications';
import Dashboard from './pages/Dashboard';
import Contributions from './pages/Contributions';
import SocialMediaAccounts from './pages/SocialMediaAccounts';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './contexts/AuthContext';
import TeamRegistration from './pages/Registration';
import Showcase from './pages/Showcase';

// Create a simple TeamHead component
const TeamHead = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-4">
          Team Head
        </h1>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon!
        </p>
        <a
          href="/"
          className="bg-gradient-to-r from-red-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-green-600 transition-all duration-200"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
        {/* Party Flag Background Pattern */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-transparent to-green-500"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-30" 
               style={{
                 backgroundImage: `linear-gradient(45deg, #ff0000 25%, transparent 25%), linear-gradient(-45deg, #008000 25%, transparent 25%)`,
                 backgroundSize: '60px 60px'
               }}>
          </div>
        </div>
        
        <div className="relative z-10">
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/management" element={<Management />} />
              <Route path="/imran-khan-in-jail" element={<ImranKhanInJail />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contributions" element={<Contributions />} />
              <Route path="/social-media-accounts" element={<SocialMediaAccounts />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/team-head" element={<TeamHead />} />
              <Route path="/team-registration" element={<TeamRegistration />} />
              <Route path="/team-incharge" element={<Showcase />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;