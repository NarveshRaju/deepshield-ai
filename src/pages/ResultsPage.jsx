// deepshield-ui/src/pages/ResultsPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // 1. Import the new library

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysisResult = location.state?.analysisResult;

  if (!analysisResult) {
    return <div className="pt-40 text-center text-white">No analysis data found. Please analyze an image first.</div>;
  }

  const { final_verdict, gemini_report } = analysisResult;

  // 2. Define custom components to style the markdown with Tailwind CSS
  // This gives you full control over how headings, links, lists, etc., look.
  const markdownComponents = {
    h3: ({ node, ...props }) => (
      <h3 className="text-xl font-bold text-sky-300 mt-6 mb-2" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="mt-2 text-gray-300 leading-relaxed" {...props} />
    ),
    strong: ({ node, ...props }) => (
      <strong className="font-semibold text-white" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc list-inside space-y-2 mt-3" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="text-gray-300" {...props} />
    ),
    hr: ({ node, ...props }) => (
      <hr className="my-6 border-gray-700" {...props} />
    ),
    a: ({ node, ...props }) => (
      <a className="text-sky-400 hover:underline break-words" target="_blank" rel="noopener noreferrer" {...props} />
    ),
  };

  // 3. (Optional but recommended) Clean the report if it contains redundant titles
  // The Gemini output starts with a title that we already have in our `<h2>` tag.
  const cleanedReport = gemini_report.replace(/^\*\*Forensic Analysis Report\*\*\n/, '');

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-16 px-4">
      
      {/* Back Button */}
      <button
        className="self-start mb-6 flex items-center text-sky-400 hover:text-sky-300 transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>

      {/* Uploaded Image */}
      {location.state?.fileURL && (
        <div className="max-w-3xl w-full rounded-3xl overflow-hidden border border-white/10 shadow-xl mb-10">
          <img
            src={location.state.fileURL}
            alt="Uploaded"
            className="w-full h-auto object-contain"
          />
        </div>
      )}

      {/* Verdict */}
      <div className={`w-full max-w-3xl p-6 rounded-3xl border border-white/10 backdrop-blur-lg mb-8 shadow-lg ${
        final_verdict.toLowerCase().includes("deepfake") ? "bg-red-500/10" : "bg-green-500/10"
      }`}>
        <h1 className={`text-3xl font-bold mb-2 ${
          final_verdict.toLowerCase().includes("deepfake") ? "text-red-400" : "text-green-400"
        }`}>
          {final_verdict}
        </h1>
        <p className="text-gray-300 text-lg">
          This verdict is based on a detailed AI forensic analysis performed by DeepShield.
        </p>
      </div>

      {/* Gemini Forensic Report */}
      <div className="w-full max-w-3xl p-8 bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Forensic Analysis Report</h2>
        
        {/* 4. Use the ReactMarkdown component instead of your old parser */}
        {/* We pass the custom components to style the output perfectly. */}
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown components={markdownComponents}>
            {cleanedReport}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;