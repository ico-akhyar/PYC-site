// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Added Navigate import
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
import Registrations from './pages/Registrations';

function App() {
  const { currentUser, userLoggedIn } = useAuth();

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
              <Route path="/dashboard" element={userLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/contributions" element={<Contributions />} />
              <Route path="/social-media-accounts" element={<SocialMediaAccounts />} />
              <Route path="/login" element={!userLoggedIn ? <Login /> : <Navigate to="/" />} />
              <Route path="/signup" element={!userLoggedIn ? <Signup /> : <Navigate to="/" />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/team-registration" element={<TeamRegistration />} />
              <Route path="/team-incharge" element={<Registrations />} />
              
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;