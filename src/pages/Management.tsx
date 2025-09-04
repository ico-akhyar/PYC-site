import React from 'react';
import { Crown, Users, MapPin, Star } from 'lucide-react';

const Leaders = () => {
  const TopPersonalities = [
    {
      name: "Bushra Bibi",
      position: "450+ Days",
      image: "/assets/bushra_bibi.webp"
    },
    {
      name: "Dr. Yasmeen Rashid", 
      position: "800+ Days",
      image: "/assets/dr yasmeen rashid.webp"
    },
    {
      name: "Barrister Hassaan Niazi",
      position: "700+ Days",
      image: "/assets/hasaan-niazi.webp"
    },
    {
      name: "Ejaz Choudhary",
      position: "800+ Days",
      image: "/assets/ejaz_choudhary.webp"
    },
    {
      name: "Shah Mehmood Quraishi",
      position: "700+ Days",
      image: "/assets/SMQ.webp"
    },
    {
      name: "Mian Mehmood Rasheed",
      position: "800+ Days",
      image: "/assets/Mian Mehmood Rasheed.webp"
    },
    {
      name: "Omar Sarfraz Cheema",
      position: "800+ Days",
      image: "/assets/Omar Sarfraz Cheema.webp"
    },
    {
      name: "Brig.(R) Javed Akram",
      position: "800+ Days",
      image: "/assets/brig javed akram.webp"
    },
  ];

  const WolvesOfIk = [
    {
      name: "Khalid Khan khorshid",
      position: "Ex-Cheif Minister Gilgit Baltistan",
      image: "/assets/Khalid Khan khorshid.webp"
    },
    {
      name: "Juniad Khan Akber", 
      position: "MNA NA-9 Malakand",
      image: "/assets/Juniad Khan Akber.webp"
    },
    {
      name: "Waqas khan Orakzai",
      position: "Ex-Senator Candidate",
      image: "/assets/Waqas khan Orakzai.webp"
    },
    {
      name: "Abdul Waheed Mehsood",
      position: "Ex-MPA Candidate PK-113",
      image: "/assets/Abdul Waheed Mehsood.webp"
    },
    {
      name: "Khurram Zeeshan",
      position: "Senate Candidate PTI / Depty Information Sec. PTi KPK",
      image: "/assets/Khurram Zeeshan.webp"
    },
    {
      name: "Seemabia Tahir",
      position: "MNA Form 45 NA-57 / Deputy Organizer Pakistan Youth Council",
      image: "/assets/Seemabia Tahir.webp"
    },
    {
      name: "Abdul Salam Afridi",
      position: "MPA PK-58 Mardan",
      image: "/assets/Abdul Salam Afridi.webp"
    },
    {
      name: "Haji Mehmood Jan",
      position: "Ex-Deputy Speaker KPK Assembly / Ex-MPA",
      image: "/assets/Haji Mehmood Jan.webp"
    },
    {
      name: "Shab Niaz Khan",
      position: "Ex-Senior Vice President IYW KPK",
      image: "/assets/Shab Niaz khan.webp"
    },
    {
      name: " ",
      position: " ",
      image: "/assets/unknown.webp"
    },
    {
      name: "Irfan Wazir",
      position: "Cheif Minister KPK Team",
      image: "/assets/Irfan Wazir.webp"
    },
    {
      name: "Malik Saheed Orakzai ",
      position: "Ex-President PTI Orakzai",
      image: "/assets/Malik Saheed Orakzai.webp"
    },
    {
      name: "Gohar Ayub",
      position: "Ex-president IYW Peshawer",
      image: "/assets/Gohar Ayub.webp"
    },
    {
      name: "Wasid Dawer",
      position: "Ex-SVP South Waziristan",
      image: "/assets/Wasid Dawer.webp"
    },
    {
      name: "Waheed Khan",
      position: "Senior Leader PTI dir",
      image: "/assets/Waheed Khan.webp"
    }
  ];

  const seniorLeaders = [
    {
      name: "Senior Leader 1",
      position: "National President",
      image: "#"
    },
    {
      name: "Senior Leader 2", 
      position: "Vice President",
      image: "#"
    },
    {
      name: "Senior Leader 3",
      position: "General Secretary",
      image: "#"
    },
    {
      name: "Senior Leader 4",
      position: "Information Secretary",
      image: "#"
    }
  ];

  const pycTeam = [
    {
      name: "PYC Leader 1",
      position: "Social Media Director",
      image: "#"
    },
    {
      name: "PYC Leader 2",
      position: "Content Manager",
      image: "#"
    },
    {
      name: "PYC Leader 3",
      position: "Digital Strategist",
      image: "#"
    },
    {
      name: "PYC Leader 4",
      position: "Community Manager",
      image: "#"
    }
  ];

  const localCoordinators = [
    { name: "Coordinator 1", city: "Lahore", region: "Punjab" },
    { name: "Coordinator 2", city: "Karachi", region: "Sindh" },
    { name: "Coordinator 3", city: "Islamabad", region: "Federal Capital" },
    { name: "Coordinator 4", city: "Peshawar", region: "KPK" },
    { name: "Coordinator 5", city: "Quetta", region: "Balochistan" },
    { name: "Coordinator 6", city: "Multan", region: "Punjab" },
    { name: "Coordinator 7", city: "Faisalabad", region: "Punjab" },
    { name: "Coordinator 8", city: "Rawalpindi", region: "Punjab" }
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-red-50 via-white to-green-50">
    <div className="max-w-7xl mx-auto px-4">
      {/* Chairman Section */}
      <div className="text-center mb-16 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="w-96 h-96 bg-gradient-to-r from-red-500 to-green-500 rounded-full"></div>
        </div>
        
        <div className="relative inline-block">
          <div className="w-56 h-56 bg-white rounded-full shadow-2xl overflow-hidden border-8 border-gradient-to-r from-red-500 to-green-500 mx-auto mb-6 transform hover:scale-105 transition-all duration-300">
            <img
              src="/assets/IK3.webp"
              alt="Party Chairman"
              className="w-full h-full object-cover"
            />
          </div>
          <Crown className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-500 animate-bounce" size={40} />
        </div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-3">Imran Ahmed Khan Niazi</h1>
        <p className="text-3xl text-gray-700 font-semibold">Cheif Organizer PYC Social Media Team</p>
      </div>


        {/* Top Leaders Section */}
        <section className="mb-16">
          <div className="text-center mb-12 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-500">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
              <Users className="mr-3 text-red-500" size={32} />
              Wolves Of Imran Khan
            </h2>
            <p className="text-xl text-gray-700">Peoples who have never been bought, never backed down, and are still standing firm with unwavering resolve.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WolvesOfIk.map((leader, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 border-b-4 border-red-500">
                <div className="w-full h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 bg-gradient-to-br from-white to-red-50">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{leader.name}</h3>
                  <p className="text-red-600 font-semibold text-lg">{leader.position}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Senior Leaders Section */}
        <section className="mb-16">
          <div className="text-center mb-12 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-500">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
              <Users className="mr-3 text-red-500" size={32} />
              Senior Party Leaders
            </h2>
            <p className="text-xl text-gray-700">Stakeholders leading PTI's vision for Pakistan</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {seniorLeaders.map((leader, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 border-b-4 border-red-500">
                <div className="w-full h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 bg-gradient-to-br from-white to-red-50">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{leader.name}</h3>
                  <p className="text-red-600 font-semibold text-lg">{leader.position}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PYC Social Media Team */}
        <section className="mb-16">
          <div className="text-center mb-12 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
              <Users className="mr-3 text-green-500" size={32} />
              PYC Social Media Team Leaders
            </h2>
            <p className="text-xl text-gray-700">Pakistan Youth Council digital warriors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pycTeam.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-red-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-green-200 hover:border-green-400 transform hover:scale-105">
                <div className="w-full h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-semibold text-lg">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Local Body Coordinators */}
        <section>
          <div className="text-center mb-12 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
              <MapPin className="mr-3 text-blue-500" size={32} />
              Local Body Coordinators
            </h2>
            <p className="text-xl text-gray-700">PYC Social Media Team coordinators across Pakistan</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {localCoordinators.map((coordinator, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-blue-500 transform hover:scale-105 hover:border-l-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{coordinator.name}</h3>
                <p className="text-blue-600 font-semibold flex items-center text-lg">
                  <MapPin size={16} className="mr-2" />
                  {coordinator.city}
                </p>
                <p className="text-gray-600 font-medium">{coordinator.region}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Leaders;