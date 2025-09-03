import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Users, MessageCircle, Save } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TeamRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    age: '',
    occupation: '',
    skills: '',
    previousExperience: '',
    availability: '',
    motivation: '',
    socialMedia: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to Firestore
      await addDoc(collection(db, 'teamRegistrations'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      alert('Registration submitted successfully! We will contact you soon.');
      navigate('/');
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('There was an error submitting your registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-red-600 hover:text-red-700 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-white" size={32} />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-4">
            Join Our Team
          </h1>
          
          <p className="text-gray-600 text-lg">
            Work for Imran Khan and contribute to Pakistan's digital revolution
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Enter your city"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="16"
                  max="60"
                  value={formData.age}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Enter your age"
                />
              </div>
            </div>

            {/* Occupation */}
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                Occupation/Profession *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  required
                  value={formData.occupation}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="e.g., Student, Engineer, Teacher"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
              Skills & Expertise *
            </label>
            <textarea
              id="skills"
              name="skills"
              required
              rows={3}
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              placeholder="What skills can you contribute? (e.g., Social Media, Graphic Design, Writing, Leadership)"
            />
          </div>

          {/* Previous Experience */}
          <div className="mb-6">
            <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-700 mb-2">
              Previous Experience (if any)
            </label>
            <textarea
              id="previousExperience"
              name="previousExperience"
              rows={2}
              value={formData.previousExperience}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              placeholder="Any previous political or volunteer experience?"
            />
          </div>

          {/* Availability */}
          <div className="mb-6">
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
              Availability *
            </label>
            <select
              id="availability"
              name="availability"
              required
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            >
              <option value="">Select your availability</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="weekends">Weekends Only</option>
              <option value="evenings">Evenings Only</option>
              <option value="flexible">Flexible Hours</option>
            </select>
          </div>

          {/* Social Media */}
          <div className="mb-6">
            <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-700 mb-2">
              Social Media Profiles
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MessageCircle className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="socialMedia"
                name="socialMedia"
                value={formData.socialMedia}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                placeholder="Facebook, Twitter, Instagram handles (optional)"
              />
            </div>
          </div>

          {/* Motivation */}
          <div className="mb-8">
            <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
              Why do you want to join our team? *
            </label>
            <textarea
              id="motivation"
              name="motivation"
              required
              rows={4}
              value={formData.motivation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              placeholder="Share your motivation for working with Imran Khan and PTI"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-green-500 text-white py-4 rounded-lg font-semibold hover:from-red-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Submit Application
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            By submitting this form, you agree to our terms and privacy policy.
          </p>
        </form>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Have questions? Contact us at{' '}
            <a href="mailto:info@pyc.com" className="text-red-600 hover:text-red-700">
              info@pyc.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamRegistration;