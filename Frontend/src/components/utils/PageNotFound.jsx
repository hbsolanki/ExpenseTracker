import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-9xl font-extrabold text-blue-600 drop-shadow-lg">
        404
      </h1>

      <h2 className="text-3xl font-bold text-black mt-4">Page Not Found</h2>

      <p className="text-gray-600 mt-2 max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-500 transition"
      >
        Go Back Home
      </Link>

      <div className="mt-10">
        <img
          src="https://i.imgur.com/qIufhof.png"
          alt="Not found"
          className="w-72 opacity-80"
        />
      </div>
    </div>
  );
}
