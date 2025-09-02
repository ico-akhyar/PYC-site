import React from 'react';
import { ArrowLeft, ExternalLink, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Contribution {
  id: string;
  title: string;
  description: string;
  image: string;
  reference: string;
  date: string;
  type: 'project' | 'speech' | 'bill' | 'policy' | 'initiative';
}

const contributions: Contribution[] = [
  {
    id: '1',
    title: 'Shaukat Khanum Memorial Cancer Hospital',
    description: 'Built Pakistan\'s first free cancer hospital, providing world-class treatment to thousands of patients regardless of their ability to pay.',
    image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/shaukat-khanum',
    date: '1994',
    type: 'project'
  },
  {
    id: '2',
    title: 'Pakistan Tehreek-e-Insaf Foundation',
    description: 'Established PTI as a political movement for change, advocating for justice, accountability, and good governance in Pakistan.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/pti-foundation',
    date: '1996',
    type: 'initiative'
  },
  {
    id: '3',
    title: 'KPK Police Reforms',
    description: 'Revolutionized police system in Khyber Pakhtunkhwa, introducing merit-based recruitment and modern training methods.',
    image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/police-reforms',
    date: '2013',
    type: 'policy'
  },
  {
    id: '4',
    title: 'Billion Tree Tsunami',
    description: 'Launched massive reforestation campaign in KPK, planting over a billion trees and later expanding it nationwide.',
    image: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/billion-tree',
    date: '2014',
    type: 'initiative'
  },
  {
    id: '5',
    title: 'Right to Information Act',
    description: 'Passed landmark legislation ensuring citizens\' right to access government information, promoting transparency and accountability.',
    image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/rti-act',
    date: '2013',
    type: 'bill'
  },
  {
    id: '6',
    title: 'Ehsaas Program',
    description: 'Launched Pakistan\'s largest poverty alleviation program, providing direct cash transfers to 12 million families.',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/ehsaas-program',
    date: '2019',
    type: 'policy'
  },
  {
    id: '7',
    title: 'Kamyab Jawan Program',
    description: 'Initiated youth empowerment program providing skills training, entrepreneurship support, and employment opportunities.',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/kamyab-jawan',
    date: '2019',
    type: 'initiative'
  },
  {
    id: '8',
    title: 'Sehat Sahulat Program',
    description: 'Introduced universal health insurance providing free medical treatment to underprivileged families across Pakistan.',
    image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/sehat-sahulat',
    date: '2016',
    type: 'policy'
  },
  {
    id: '9',
    title: 'Clean Green Pakistan',
    description: 'Launched nationwide environmental campaign focusing on waste management, tree plantation, and clean water initiatives.',
    image: 'https://images.pexels.com/photos/2382894/pexels-photo-2382894.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/clean-green',
    date: '2019',
    type: 'initiative'
  },
  {
    id: '10',
    title: 'Single National Curriculum',
    description: 'Implemented unified education system to reduce disparity between public and private schools, ensuring equal opportunities for all children.',
    image: 'https://images.pexels.com/photos/8926553/pexels-photo-8926553.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/single-curriculum',
    date: '2020',
    type: 'policy'
  },
  {
    id: '11',
    title: 'Naya Pakistan Housing Program',
    description: 'Launched affordable housing scheme to provide homes for low-income families, addressing Pakistan\'s housing crisis.',
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/naya-pakistan-housing',
    date: '2018',
    type: 'policy'
  },
  {
    id: '12',
    title: 'Transparency International Reforms',
    description: 'Implemented governance reforms that improved Pakistan\'s ranking in global transparency and corruption perception indices.',
    image: 'https://images.pexels.com/photos/5668868/pexels-photo-5668868.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/transparency-reforms',
    date: '2019',
    type: 'policy'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'project':
      return <Award className="w-4 h-4" />;
    case 'speech':
      return <Calendar className="w-4 h-4" />;
    case 'bill':
      return <Award className="w-4 h-4" />;
    case 'policy':
      return <Award className="w-4 h-4" />;
    case 'initiative':
      return <Award className="w-4 h-4" />;
    default:
      return <Award className="w-4 h-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'project':
      return 'bg-green-100 text-green-800';
    case 'speech':
      return 'bg-blue-100 text-blue-800';
    case 'bill':
      return 'bg-red-100 text-red-800';
    case 'policy':
      return 'bg-orange-100 text-orange-800';
    case 'initiative':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ContributionsPakistan() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Contributions for Pakistan
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Discover Imran Khan's transformative projects, policies, and initiatives that have 
            shaped Pakistan's development in healthcare, education, environment, and governance.
          </p>
        </div>

        {/* Contributions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributions.map((contribution) => (
            <div 
              key={contribution.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={contribution.image} 
                  alt={contribution.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(contribution.type)}`}>
                    {getTypeIcon(contribution.type)}
                    <span className="ml-1 capitalize">{contribution.type}</span>
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                    {contribution.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {contribution.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {contribution.date}
                  </div>
                  
                  <a 
                    href={contribution.reference}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors text-sm font-medium"
                  >
                    Reference
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            This collection represents major contributions to Pakistan's development and progress.
          </p>
        </div>
      </div>
    </div>
  );
}