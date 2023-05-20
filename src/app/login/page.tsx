'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform login logic here
    console.log("test")
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Schul-3D-Druck - Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-md mx-auto px-4">
        <header className="flex items-center justify-center py-6">
          <div>
            <img className="h-8 w-auto sm:h-10" src="/school-logo.svg" alt="School Logo" />
          </div>
        </header>

        <main className="mt-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="bg-white shadow-md rouxnded-l px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={handleEmailChange}
                placeholder="E-Mail"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Passwort
              </label>
              <input
                id="password"
                type="password"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Passwort"
                required
              />
            </div>

            <div className="flex items-center justify-center">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Einloggen
              </motion.button>
            </div>

            <div>
              Bitte beachte das 
            </div>

          </motion.form>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
