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
  type: 'project' | 'speech' | 'initiative' | 'policy';
}

const contributions: Contribution[] = [
  {
    id: '1',
    title: 'Establishment of Islamic University',
    description: 'Founded the first Islamic university in Pakistan to promote Islamic education and research, combining modern academic standards with Islamic principles.',
    image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/islamic-university',
    date: '1985',
    type: 'project'
  },
  {
    id: '2',
    title: 'Promotion of Islamic Banking',
    description: 'Advocated for and implemented Islamic banking principles in Pakistan\'s financial system, establishing Sharia-compliant banking institutions.',
    image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/islamic-banking',
    date: '2018',
    type: 'policy'
  },
  {
    id: '3',
    title: 'Madina State Vision',
    description: 'Presented the vision of creating a welfare state based on the principles of the State of Madina, emphasizing justice, equality, and moral governance.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/madina-state',
    date: '2019',
    type: 'speech'
  },
  {
    id: '4',
    title: 'Interfaith Harmony Initiatives',
    description: 'Launched programs to promote interfaith dialogue and protect religious minorities, emphasizing Islam\'s message of peace and tolerance.',
    image: 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/interfaith-harmony',
    date: '2020',
    type: 'initiative'
  },
  {
    id: '5',
    title: 'Seerat-un-Nabi Conference',
    description: 'Organized international conferences on the life and teachings of Prophet Muhammad (PBUH), promoting Islamic values and unity among Muslim nations.',
    image: 'https://images.pexels.com/photos/8728390/pexels-photo-8728390.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/seerat-conference',
    date: '2021',
    type: 'initiative'
  },
  {
    id: '6',
    title: 'Islamophobia Awareness Campaign',
    description: 'Led global efforts to combat Islamophobia through diplomatic channels and international forums, defending the image of Islam worldwide.',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/islamophobia-campaign',
    date: '2022',
    type: 'initiative'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'project':
      return <Award className="w-4 h-4" />;
    case 'speech':
      return <Calendar className="w-4 h-4" />;
    case 'initiative':
      return <Award className="w-4 h-4" />;
    case 'policy':
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
    case 'initiative':
      return 'bg-purple-100 text-purple-800';
    case 'policy':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ContributionsIslam() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
            Contributions for Islam
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore Imran Khan's significant contributions to promoting Islamic values, 
            education, and principles throughout his career in politics and public service.
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
            This collection represents some of the notable contributions to Islamic causes and values.
          </p>
        </div>
      </div>
    </div>
  );
}