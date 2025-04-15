// src/components/common/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="text-blue-600 h-8 w-8" />
            <span className="ml-2 text-xl font-bold text-gray-800">BookNest</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <Link to="/books" className="text-gray-500 hover:text-gray-700">Top Books</Link>
            <Link to="/authors" className="text-gray-500 hover:text-gray-700">Top Authors</Link>
            <Link to="/genres" className="text-gray-500 hover:text-gray-700">Genres</Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-3">
            <Link to="/" className="block py-2 text-gray-500 hover:text-gray-700">Home</Link>
            <Link to="/books" className="block py-2 text-gray-500 hover:text-gray-700">Top Books</Link>
            <Link to="/authors" className="block py-2 text-gray-500 hover:text-gray-700">Top Authors</Link>
            <Link to="/genres" className="block py-2 text-gray-500 hover:text-gray-700">Genres</Link>
          </div>
        )}
      </div>
    </header>
  );
}