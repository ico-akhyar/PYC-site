import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';

interface AuthProps {
  onClose: () => void;
  onSwitchMode: () => void;
  mode: 'login' | 'signup';
}

const Auth: React.FC<AuthProps> = ({ onClose, onSwitchMode, mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          setError('Password should be at least 6 characters');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with display name
        if (displayName) {
          await updateProfile(userCredential.user, {
            displayName: displayName
          });
        }
        
        // Send email verification
        await sendEmailVerification(userCredential.user);
        setEmailSent(true);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        
        // Check if email is verified
        if (auth.currentUser && !auth.currentUser.emailVerified) {
          setError('Please verify your email before logging in');
          await auth.signOut();
          setLoading(false);
          return;
        }
        
        onClose();
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Handle specific error cases
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <strong>{email}</strong>. 
              Please check your inbox and click the link to verify your account.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-red-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-green-600 transition-all duration-200"
            >
              Continue to Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
            {mode === 'signup' ? 'Create Account' : 'Login'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-400" />
                ) : (
                  <Eye size={20} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={onSwitchMode}
              className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200"
            >
              {mode === 'signup' ? 'Login' : 'Sign up'}
            </button>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            By {mode === 'signup' ? 'creating an account' : 'logging in'}, you agree to our{' '}
            <a href="#" className="text-red-600 hover:text-red-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-red-600 hover:text-red-700">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;