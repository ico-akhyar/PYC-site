const TeamHead: React.FC = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-4">
            Team Head
          </h1>
          <p className="text-gray-600 mb-6">
            This page is under construction. Check back soon!
          </p>
          <a
            href="/"
            className="bg-gradient-to-r from-red-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-green-600 transition-all duration-200"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  };