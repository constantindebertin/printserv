"use client";

import { NextPage } from 'next';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const HomePage: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const logoUrl = "/path-to-your-school-logo.png"; // Replace this with your actual logo url

  return (
    <div className={theme === 'dark' ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="flex items-center justify-between mb-4">
            <img src={logoUrl} alt="School Logo" className="h-16 w-auto" />
            <button 
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 'Licht Modus' : 'Dunkel Modus'}
            </button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl z-[-1]"></div>
          <div className="relative px-4 py-10 bg-white dark:bg-gray-900 shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Willkommen zu unserem Schule 3D Druck Service!
            </h1>
            <p className="mb-6 text-gray-900 dark:text-gray-300">
              Hier können Sie benutzerdefinierte 3D-Drucke für Ihre akademischen oder persönlichen Projekte anfordern. 
              Bitte loggen Sie sich ein, um auf Ihr Konto zuzugreifen, oder registrieren Sie sich, um ein neues zu erstellen.
            </p>
            <div className="flex space-x-4">
              <Link href="/login">
                <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Anmelden
                </button>
              </Link>
              <Link href="/register">
                <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                  Registrieren
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
