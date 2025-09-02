import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

interface SocialAccount {
  id: string;
  platform: "TikTok" | "Twitter" | "Instagram" | "Facebook" | "YouTube" | "Other";
  name: string;
  url: string;
}

const accounts: SocialAccount[] = [
  {
    id: "1",
    platform: "TikTok",
    name: "@pyc_01",
    url: "https://www.tiktok.com/@pyc_team01",
  },
  {
    id: "2",
    platform: "TikTok",
    name: "@pyc_02",
    url: "https://www.tiktok.com/@pyc_team02",
  },
  {
    id: "3",
    platform: "Twitter",
    name: "@pyc_official",
    url: "https://twitter.com/pyc_official",
  },
];

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "TikTok":
      return "bg-pink-100 text-pink-700";
    case "Twitter":
      return "bg-blue-100 text-blue-700";
    case "Instagram":
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
    case "Facebook":
      return "bg-blue-200 text-blue-800";
    case "YouTube":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function SocialMediaAccounts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
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
          🌐 Our Social Media Accounts
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Follow our official team-managed accounts across different platforms.
          </p>
        </div>

        {/* Accounts Grid */}
        <div
  key={account.id}
  className="relative rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group"
>
  {/* Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-green-500 to-red-600 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

  {/* Glass Effect Overlay */}
  <div className="relative bg-white/90 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center h-full">
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getPlatformColor(
        account.platform
      )}`}
    >
      {account.platform}
    </span>

    {/* Account Name with glow */}
    <h3 className="text-lg font-extrabold text-gray-900 mb-2 group-hover:text-white group-hover:drop-shadow-lg transition-colors duration-500">
      {account.name}
    </h3>

    {/* Button */}
    <a
      href={account.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center bg-white text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md"
    >
      Visit Profile
      <ExternalLink className="w-4 h-4 ml-1" />
    </a>
  </div>
</div>


        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            This is a list of some of our team’s verified accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
