import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Users, MessageCircle, Save } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TeamRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    previousExperience: '',
    socialMedia: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'teamRegistrations'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      alert('Registration submitted successfully! We will contact you soon via Whatsapp.');
      navigate('/');
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Error submitting your registration. Please try again.');
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border rounded-lg"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border rounded-lg"
                  placeholder="Enter your phone"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border rounded-lg"
                  placeholder="Enter your city"
                />
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Previous Experience</label>
            <textarea
              name="previousExperience"
              rows={2}
              value={formData.previousExperience}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Any previous political or volunteer experience?"
            />
          </div>

          {/* Social Media */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Profiles</label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="socialMedia"
                value={formData.socialMedia}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border rounded-lg"
                placeholder="Facebook, Twitter, Instagram..."
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-green-500 text-white py-4 rounded-lg font-semibold flex justify-center items-center"
          >
            {loading ? 'Submitting...' : <><Save size={20} className="mr-2" /> Submit</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamRegistration;
