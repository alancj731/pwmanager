// app/not-found.js
import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl mt-4 text-gray-700">Oops&excl; Page Not Found</h2>
      <p className="mt-2 text-lg text-gray-500">
        The page you&apos;re looking for does not exist.
      </p>
      <Link href="/">
        <a className="mt-6 text-lg font-medium text-blue-600 hover:text-blue-500">
          Go back to homepage
        </a>
      </Link>
    </div>
  );
};

export default NotFound;
