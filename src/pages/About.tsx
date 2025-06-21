import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">          <div className="flex items-center">
            <Link to="/" className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              <img src="/drel-logo.png" alt="Drel Solutions Logo" className="h-10 w-10 rounded-lg" />
              <span>Drel Solutions</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Home</Link>
              <Link to="/about" className="text-blue-600 px-3 py-2 text-sm font-medium transition-colors">About</Link>
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors flex items-center">
                  Solutions <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <a href="/modeladvisor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Model Advisor</a>
                  </div>
                )}              </div>
              <Link to="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">Let's Talk</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-blue-600 p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link to="/" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium">Home</Link>
              <Link to="/about" className="block text-blue-600 px-3 py-2 text-base font-medium">About</Link>
              <a href="/modeladvisor" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium">Model Advisor</a>
              <div className="pt-2">
                <Link to="/contact">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Let's Talk</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const About = () => {
  const [drelDescription, setDrelDescription] = useState('');

  useEffect(() => {
    // Load the description from the text file
    fetch('/drel-solutions-description.txt')
      .then(response => response.text())
      .then(text => setDrelDescription(text))
      .catch(error => {
        console.error('Error loading description:', error);
        // Fallback text if file can't be loaded
        setDrelDescription('Drel Solutions is a modern, AI-driven consulting studio founded by Elliot Drel, a results-focused leader with deep experience in operational efficiency, automation, and organizational systems.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-16">
        {/* Values Section */}
        <section className="h-[70vh] bg-blue-100 flex items-center pt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                Smart People Building
                <span className="block">Smart Solutions</span>
              </h2>
              <p className="text-2xl lg:text-3xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-light">
                My strategy remains: listen deeply, understand completely, 
                and deliver AI solutions that actually transform your business.
              </p>
            </div>
          </div>
        </section>

        {/* Drel Solutions Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left side - Image */}
              <div className="relative flex justify-center lg:justify-start">                <div className="relative">
                  <img 
                    src="/business-deal-handshake.png" 
                    alt="Business Deal Handshake" 
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
              
                             {/* Right side - Content */}
               <div className="space-y-8">
                 <div className="text-center">
                   <h3 className="text-2xl font-bold text-gray-800 mb-4">Drel Solutions</h3>
                   <p className="text-lg text-gray-700 leading-relaxed mb-8">
                     {drelDescription}
                   </p>
                   
                   <div className="text-center">
                     <div className="text-8xl lg:text-9xl font-bold text-gray-900 leading-none">
                       1
                     </div>
                     <div className="text-xl text-gray-700 mt-2">
                       year in the making.
                     </div>
                   </div>
                 </div>
               </div>
              
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Text content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Hi! I'm <span className="text-blue-600">Elliot Drel</span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed">
                    I help businesses unlock their potential through innovative AI solutions and strategic automation.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all">
                    MY STORY
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-lg transition-all">
                    ASK ME
                  </Button>
                </div>
              </div>
              
              {/* Right side - Headshot */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative">
                  <img 
                    src="/Elliot Drel Headshot.jpg" 
                    alt="Elliot Drel Headshot" 
                    className="w-80 h-96 object-cover rounded-2xl shadow-2xl"
                  />
                  {/* Optional decorative element */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 rounded-full opacity-20"></div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About; 