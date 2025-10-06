// src/pages/HistoryPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Clock } from 'lucide-react';

const mockHistory = [
  { id: 'a1b2', name: 'ceo_speech_final.mp4', verdict: 'Manipulated', date: '2025-10-04' },
  { id: 'c3d4', name: 'family_vacation_vid.mov', verdict: 'Authentic', date: '2025-10-03' },
  { id: 'e5f6', name: 'political_ad_clip.mp4', verdict: 'Manipulated', date: '2025-10-03' },
  { id: 'g7h8', name: 'new_profile_pic.jpg', verdict: 'Authentic', date: '2025-10-01' },
];

const HistoryPage = () => {
  return (
    <div className="relative min-h-screen pt-32 pb-16 px-4">
      <div className="aurora-background"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Analysis History</h1>
        <div className="space-y-4">
          {mockHistory.map((item) => {
            const isManipulated = item.verdict === 'Manipulated';
            return (
              <Link to={`/results/${item.id}`} key={item.id} className="block">
                <div className="border border-white/10 bg-panel backdrop-blur-lg rounded-2xl p-4 flex items-center justify-between hover:border-sky-500 transition-colors duration-300">
                  <div className="flex items-center space-x-4">
                    {isManipulated ? <ShieldAlert className="text-red-400" size={28} /> : <ShieldCheck className="text-green-400" size={28} />}
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-gray-400 flex items-center"><Clock size={14} className="mr-1.5" />Analyzed on {item.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full font-semibold ${isManipulated ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                    {item.verdict}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;