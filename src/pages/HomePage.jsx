// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Bot, BarChart2, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Aurora Background */}
      <div className="aurora-background"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tighter">
          Navigate Digital <span className="text-sky-400">Truth.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-300">
          DeepShield leverages a dual-engine AI to forensically analyze media for signs of manipulation, providing you with clarity in a world of digital noise.
        </p>
        <Link 
          to="/dashboard"
          className="mt-8 px-8 py-3 bg-sky-500 text-white font-semibold rounded-full shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
        >
          <span>Analyze Your First File</span>
          <ArrowRight size={20} />
        </Link>
      </div>
      
      {/* "How it Works" Section */}
      <div className="relative z-10 mt-24 max-w-4xl w-full grid md:grid-cols-3 gap-8 text-center p-4">
        <div className="border border-white/10 bg-panel backdrop-blur-lg rounded-2xl p-6">
          <UploadCloud className="mx-auto text-sky-400" size={40} />
          <h3 className="mt-4 text-xl font-bold">1. Upload</h3>
          <p className="mt-2 text-gray-400">Securely upload any video or image file. Your data is processed privately and never stored.</p>
        </div>
        <div className="border border-white/10 bg-panel backdrop-blur-lg rounded-2xl p-6">
          <Bot className="mx-auto text-sky-400" size={40} />
          <h3 className="mt-4 text-xl font-bold">2. Analyze</h3>
          <p className="mt-2 text-gray-400">Our dual AI-engines perform a multi-layered forensic analysis on the media.</p>
        </div>
        <div className="border border-white/10 bg-panel backdrop-blur-lg rounded-2xl p-6">
          <BarChart2 className="mx-auto text-sky-400" size={40} />
          <h3 className="mt-4 text-xl font-bold">3. Review</h3>
          <p className="mt-2 text-gray-400">Receive a clear verdict and a detailed, easy-to-understand report.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;