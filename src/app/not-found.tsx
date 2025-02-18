// app/not-found.js
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl mt-4 text-gray-700">Oops! Page Not Found</h2>
      <p className="mt-2 text-lg text-gray-500">The page you're looking for does not exist.</p>
      <a
        href="/"
        className="mt-6 text-lg font-medium text-blue-600 hover:text-blue-500"
      >
        Go back to homepage
      </a>
    </div>
  );
};

export default NotFound;
