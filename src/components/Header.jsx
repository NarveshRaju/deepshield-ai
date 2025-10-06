// src/components/Header.jsx
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-30 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center border border-white/10 bg-panel backdrop-blur-lg rounded-full py-2 px-6">
        <Link to="/" className="flex items-center space-x-2">
          <ShieldCheck className="text-sky-400" size={28} />
          <h1 className="text-xl font-bold text-white">DeepShield</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-2">
          <NavLink to="/dashboard" className={({ isActive }) => `px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-sky-500 text-white' : 'hover:bg-white/10'}`}>
            Analyze
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-sky-500 text-white' : 'hover:bg-white/10'}`}>
            History
          </NavLink>
          <NavLink to="/technology" className={({ isActive }) => `px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-sky-500 text-white' : 'hover:bg-white/10'}`}>
            Technology
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;