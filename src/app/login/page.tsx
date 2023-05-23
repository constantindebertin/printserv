// pages/setup.tsx
'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

const variants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Setup() {
  const [step, setStep] = useState(1);
  const [mongodbUri, setMongodbUri] = useState('');
  const [email, setEmail] = useState('');
  const [sendgridEmail, setSendgridEmail] = useState('');
  const [loginEmailTemplateId, setLoginEmailTemplateId] = useState('');
  const [sendGridApiKey, setSendGridApiKey] = useState('');
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (step === 3) {
      console.log(mongodbUri, email, sendgridEmail, loginEmailTemplateId, sendGridApiKey);
      router.push('/nextPage');
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">
            Setup: Step {step}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <motion.div
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <input
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 focus:z-10 sm:text-sm"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <input
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 focus:z-10 sm:text-sm"
                  type="text"
                  placeholder="MongoDB URI"
                  value={mongodbUri}
                  onChange={e => setMongodbUri(e.target.value)}
                />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <input
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 focus:z-10 sm:text-sm"
                  type="text"
                  placeholder="SendGrid Email"
                  value={sendgridEmail}
                  onChange={e => setSendgridEmail(e.target.value)}
                />
                <input
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 focus:z-10 sm:text-sm"
                  type="text"
                  placeholder="Login Email Template ID"
                  value={loginEmailTemplateId}
                  onChange={e => setLoginEmailTemplateId(e.target.value)}
                />
                <input
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 focus:z-10 sm:text-sm"
                  type="text"
                  placeholder="SendGrid API Key"
                  value={sendGridApiKey}
                  onChange={e => setSendGridApiKey(e.target.value)}
                />
              </motion.div>
            )}
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {step === 3 ? 'Submit' : 'Next'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
