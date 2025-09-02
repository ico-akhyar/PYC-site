import { ArrowLeft, ExternalLink, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';


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
    title: 'Global Advocacy Against Islamophobia',
    description: 'International Day to Combat Islamophobia: Imran Khan spearheaded a resolution at the United Nations (UN) to designate March 15 as the International Day to Combat Islamophobia. This initiative was adopted unanimously by the UN General Assembly in 2022, marking a significant global recognition of the need to address anti-Muslim prejudice.\n\nUN Speeches on Islamophobia: Khan consistently raised the issue of Islamophobia at the UN General Assembly, emphasizing the misrepresentation of Islam in Western media and advocating for respect toward Islamic symbols and practices.\n\nEngagement with Tech Platforms: Khan wrote to Facebook CEO Mark Zuckerberg, urging the platform to treat Islamophobic content with the same severity as Holocaust denial.',
    image: '/assets/imran-khan-un.webp',
    reference: 'https://www.aljazeera.com/news/2022/3/16/pakistan-pm-lauds-un-for-international-day-to-combat-islamophobia',
    date: '2020-22',
    type: 'speech'
  },
  {
    id: '2',
    title: 'Rehmatul-lil-Aalameen Authority',
    description: 'Establishment: Launched in 2021, this authority was tasked with researching and disseminating the teachings of Prophet Muhammad (PBUH) globally. It aimed to counter misconceptions about Islam and promote its humanitarian values.\n\nInitiatives:\n1. Curriculum reform in schools to include the Prophet’s biography and Quranic teachings.\n2. Research on Islamic history and comparative religion studies.\n3. Development of educational content, including cartoons for children, to promote Islamic culture',
    image: '/assets/Rehmat-ul-Alimin.webp',
    reference: 'https://www.dawn.com/news/1651217',
    date: '2021',
    type: 'initiative'
  },
  {
    id: '3',
    title: 'Educational Reforms',
    description: 'Quran and Islamic Studies Integration: Khan’s government made Quranic education compulsory in public schools and universities, with degrees contingent on passing these courses\n\n Uniform Education System: Introduced a nationwide curriculum to eliminate disparities in education and incorporate Islamic principles into core subjects.\n\n Seerat Chairs: Established academic chairs in universities to research the life of Prophet Muhammad (PBUH),',
    image: '/assets/study.webp',
    reference: 'https://insaf.pk/tabdeeli-ka-safar/101-biggest-achievements-imran-khans-government',
    date: '2019',
    type: 'initiative'
  },
  {
    id: '4',
    title: 'Promotion of Islamic Governance Model',
    description: ' Riyasat-e-Madina Vision: Khan frequently referenced the State of Madina as a model for Pakistan, emphasizing justice, equality, and compassion in governance.\n\nAnti-Corruption Drive: Framed corruption as anti-Islamic and pursued accountability measures to align governance with Islamic ethics.',
    image: '/assets/ik4.webp',
    reference: 'https://www.linkedin.com/pulse/imran-khans-vision-establishing-quran-real-pakistan-khurshid-/',
    date: '2020',
    type: 'policy'
  },
  {
    id: '5',
    title: 'Advocacy for Muslim Communities Globally',
    description: 'Kashmir and Palestine: Khan raised issues of Kashmir and Palestine at international forums, highlighting the oppression of Muslim communities and advocating for their rights.\n\nSri Lankan Muslim Burial Rights: Intervened to ensure Muslims in Sri Lanka could bury their dead during the COVID-19 pandemic, reversing a cremation policy.',
    image: '/assets/ik-un2.webp',
    reference: 'https://moderndiplomacy.eu/2020/04/10/imran-khan-speech-in-un-general-assembly-and-kashmir-conundrum/',
    date: '2020',
    type: 'initiative'
  },
  {
    id: '6',
    title: 'Interfaith Harmony',
    description: 'Kartarpur Corridor: Facilitated visa-free access for Sikh pilgrims to their holy site in Pakistan, promoting religious tolerance as emphasized in Islam',
    image: '/assets/Kartarpur.webp',
    reference: 'https://www.dawn.com/news/1515830',
    date: '2022',
    type: 'initiative'
  },
  {
    id: '7',
    title: 'Women’s Rights within Islamic Framework',
    description: 'Women’s Protection Laws: Introduced legislation to protect women’s rights in accordance with Islamic principles, such as the Punjab Women Protection Authority Act.\n\nEhsaas Kafalat Program: Targeted financial assistance for women, empowering them economically while adhering to Islamic values.',
    image: '/assets/ik5.webp',
    reference: 'https://insaf.pk/tabdeeli-ka-safar/101-biggest-achievements-imran-khans-government',
    date: '2020',
    type: 'project'
  },
  {
    id: '8',
    title: 'Interest-Free Loans',
    description: 'Introduced the Kamyab Pakistan Program, providing interest-free loans for businesses and education, reflecting Islamic finance principles',
    image: '/assets/ik7.webp',
    reference: 'https://www.dawn.com/news/1677887/pm-imran-launches-interest-free-loan-programme-worth-rs407bn',
    date: '2020',
    type: 'project'
  },
  {
    id: '9',
    title: 'Blasphemy Laws',
    description: 'Strengthened enforcement against blasphemy, aligning with Islamic principles of protecting religious sanctity',
    image: '/assets/ik6.webp',
    reference: 'https://www.aljazeera.com/news/2021/4/19/pakistan-pm-calls-for-west-to-criminalise-blasphemy-against-islam',
    date: '2020',
    type: 'policy'
  },
  {
    id: '10',
    title: 'Shaukat Khanum Memorial Cancer Hospital',
    description: 'Built Pakistan\'s first free cancer hospital, providing world-class treatment to thousands of patients regardless of their ability to pay.',
    image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/shaukat-khanum',
    date: '1994',
    type: 'project'
  },
  {
    id: '11',
    title: 'Pakistan Tehreek-e-Insaf Foundation',
    description: 'Established PTI as a political movement for change, advocating for justice, accountability, and good governance in Pakistan.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/pti-foundation',
    date: '1996',
    type: 'initiative'
  },
  {
    id: '12',
    title: 'KPK Police Reforms',
    description: 'Revolutionized police system in Khyber Pakhtunkhwa, introducing merit-based recruitment and modern training methods.',
    image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/police-reforms',
    date: '2013',
    type: 'policy'
  },
  {
    id: '13',
    title: 'Billion Tree Tsunami',
    description: 'Launched massive reforestation campaign in KPK, planting over a billion trees and later expanding it nationwide.',
    image: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/billion-tree',
    date: '2014',
    type: 'initiative'
  },
  {
    id: '14',
    title: 'Right to Information Act',
    description: 'Passed landmark legislation ensuring citizens\' right to access government information, promoting transparency and accountability.',
    image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/rti-act',
    date: '2013',
    type: 'policy'
  },
  {
    id: '15',
    title: 'Ehsaas Program',
    description: 'Launched Pakistan\'s largest poverty alleviation program, providing direct cash transfers to 12 million families.',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/ehsaas-program',
    date: '2019',
    type: 'policy'
  },
  {
    id: '16',
    title: 'Kamyab Jawan Program',
    description: 'Initiated youth empowerment program providing skills training, entrepreneurship support, and employment opportunities.',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/kamyab-jawan',
    date: '2019',
    type: 'initiative'
  },
  {
    id: '17',
    title: 'Sehat Sahulat Program',
    description: 'Introduced universal health insurance providing free medical treatment to underprivileged families across Pakistan.',
    image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/sehat-sahulat',
    date: '2016',
    type: 'policy'
  },
  {
    id: '18',
    title: 'Clean Green Pakistan',
    description: 'Launched nationwide environmental campaign focusing on waste management, tree plantation, and clean water initiatives.',
    image: 'https://images.pexels.com/photos/2382894/pexels-photo-2382894.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/clean-green',
    date: '2019',
    type: 'initiative'
  },
  {
    id: '19',
    title: 'Single National Curriculum',
    description: 'Implemented unified education system to reduce disparity between public and private schools, ensuring equal opportunities for all children.',
    image: 'https://images.pexels.com/photos/8926553/pexels-photo-8926553.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/single-curriculum',
    date: '2020',
    type: 'policy'
  },
  {
    id: '20',
    title: 'Naya Pakistan Housing Program',
    description: 'Launched affordable housing scheme to provide homes for low-income families, addressing Pakistan\'s housing crisis.',
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400',
    reference: 'https://example.com/naya-pakistan-housing',
    date: '2018',
    type: 'policy'
  },
  {
    id: '21',
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

export default function Contributions() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
            Explore Imran Khan's significant contributions for Pakistan and to promoting Islamic values, 
            education, and principles throughout his career in politics and public service.
          </p>
        </div>

        {/* Contributions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributions.map((contribution) => {
            const isExpanded = expandedId === contribution.id;
            return (
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
                    loading='lazy'
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {contribution.title}
                  </h3>
                  
                  <p className={`text-gray-600 text-sm mb-2 ${isExpanded ? "" : "line-clamp-3"}`}>
                    {contribution.description}
                  </p>

                  <button 
                    onClick={() => toggleExpand(contribution.id)}
                    className="text-green-600 text-sm font-medium hover:underline"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>

                  <div className="flex items-center justify-between mt-4">
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
            )
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            This collection represents some of the notable contributions of Imran Khan towards Islamic causes and values and wellness of Pakistan.
          </p>
        </div>
      </div>
    </div>
  );
}