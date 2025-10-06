// deepshield-ui/src/pages/DashboardPage.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileVideo, X } from 'lucide-react';
import axios from 'axios';

const DashboardPage = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, selected, uploading
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('selected');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }, // Now accepting only images as per the backend
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send the file to your Python backend for analysis
      const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      const analysisResult = response.data;
      console.log('Analysis result from backend:', analysisResult);

      // Navigate to the results page and pass the real data in the state
      navigate('/results', { state: { analysisResult } });

      
    } catch (error) {
      console.error("Error analyzing file:", error);
      alert('An error occurred during analysis. Make sure your backend server is running and check the console.');
      removeFile();
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'selected':
        return (
          <div className="text-center animate-fade-in">
            <FileVideo className="mx-auto text-sky-400" size={60} />
            <p className="mt-4 font-semibold text-white">{file.name}</p>
            <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <div className="mt-6 flex justify-center space-x-4">
              <button onClick={handleAnalyze} className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-full shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-all">Analyze File</button>
              <button onClick={removeFile} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-700 transition-all">Remove</button>
            </div>
          </div>
        );
      case 'uploading':
        return (
          <div className="w-full px-4 animate-fade-in">
            <p className="text-center font-semibold text-white mb-2">Uploading & Analyzing...</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.2s' }}></div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">{progress}%</p>
          </div>
        );
      case 'idle':
      default:
        return (
          <div {...getRootProps()} className={`w-full h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed rounded-2xl transition-colors ${isDragActive ? 'border-sky-400 bg-sky-500/10' : 'border-gray-600 hover:border-sky-500'}`}>
            <input {...getInputProps()} />
            <UploadCloud className={`transition-transform duration-300 ${isDragActive ? 'scale-125' : ''}`} size={60} />
            <p className="mt-4 font-semibold text-lg">
              {isDragActive ? "Drop the file here..." : "Drag & Drop an image file or click to select"}
            </p>
            <p className="text-sm text-gray-400">Supports JPG, PNG, etc.</p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="aurora-background"></div>
      <div className="relative z-10 w-full max-w-2xl h-[400px] border border-white/10 bg-panel backdrop-blur-lg rounded-2xl p-8 flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardPage;
