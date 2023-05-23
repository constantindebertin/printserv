// pages/setup.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Setup() {
    const [step, setStep] = useState(1);
    const [mongodbUri, setMongodbUri] = useState('');
    const [email, setEmail] = useState('');
    const [sendgridEmail, setSendgridEmail] = useState('');
    const [loginEmailTemplateId, setLoginEmailTemplateId] = useState('');
    const [sendGridApiKey, setSendGridApiKey] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 5) {
            // TODO: Add your own server-side handling here
            console.log(mongodbUri, email, sendgridEmail, loginEmailTemplateId, sendGridApiKey);
            router.push('/nextPage');
        } else {
            setStep(step + 1);
        }
    };

    return (
        <motion.div
            className="bg-white min-h-screen flex items-center justify-center p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="bg-white shadow-lg rounded-lg p-10 text-indigo-600">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    {step >= 1 && (
                        <input
                            className="p-2 rounded-lg"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    )}
                    {step >= 2 && (
                        <input
                            className="p-2 rounded-lg"
                            type="text"
                            placeholder="MongoDB URI"
                            value={mongodbUri}
                            onChange={e => setMongodbUri(e.target.value)}
                        />
                    )}
                    {step >= 3 && (
                        <input
                            className="p-2 rounded-lg"
                            type="email"
                            placeholder="Sendgrid Email"
                            value={sendgridEmail}
                            onChange={e => setSendgridEmail(e.target.value)}
                        />
                    )}
                    {step >= 4 && (
                        <input
                            className="p-2 rounded-lg"
                            type="text"
                            placeholder="Login Email Template ID"
                            value={loginEmailTemplateId}
                            onChange={e => setLoginEmailTemplateId(e.target.value)}
                        />
                    )}
                    {step >= 5 && (
                        <input
                            className="p-2 rounded-lg"
                            type="text"
                            placeholder="SendGrid API Key"
                            value={sendGridApiKey}
                            onChange={e => setSendGridApiKey(e.target.value)}
                        />
                    )}
                    <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg">Next</button>
                    {step === 5 && (
                        <button type="button" className="p-2 bg-indigo-600 text-white rounded-lg">Test API</button>
                    )}
                </form>
            </div>
        </motion.div>
    );
}
