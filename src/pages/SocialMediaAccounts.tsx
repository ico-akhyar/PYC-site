import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

interface SocialMedia {
  id: string;
  name: string;
  link: string;
  icon: string;
}

const socialAccounts: SocialMedia[] = [
  {
    id: "1",
    name: "Twitter (X)",
    link: "https://twitter.com/YourHandle",
    icon: "/assets/twitter.png",
  },
  {
    id: "2",
    name: "Facebook",
    link: "https://facebook.com/YourPage",
    icon: "/assets/facebook.png",
  },
  {
    id: "3",
    name: "Instagram",
    link: "https://instagram.com/YourHandle",
    icon: "/assets/instagram.png",
  },
  {
    id: "4",
    name: "YouTube",
    link: "https://youtube.com/@YourChannel",
    icon: "/assets/youtube.png",
  },
  {
    id: "5",
    name: "LinkedIn",
    link: "https://linkedin.com/company/YourPage",
    icon: "/assets/linkedin.png",
  },
];

export default function SocialMediaAccounts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Connect With Us 🌐
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Follow us on social media to stay updated with the latest news,
            events, and initiatives. 💙
          </p>
        </div>

        {/* Social Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {socialAccounts.map((account) => (
            <a
              key={account.id}
              href={account.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 flex items-center gap-4"
            >
              <img
                src={account.icon}
                alt={account.name}
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {account.name}
                </h3>
                <p className="text-sm text-indigo-600 flex items-center">
                  Visit <ExternalLink className="w-3 h-3 ml-1" />
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Stay connected with us for updates, events, and more 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
