import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

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
        {/* Values Section */}
        <section className="h-[70vh] bg-brand-primary/20 flex items-center pt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <h2 className="text-6xl lg:text-7xl font-bold text-brand-neutral-900 leading-tight tracking-tight">
                Smart People Building
                <span className="block">Smart Solutions</span>
              </h2>
              <p className="text-2xl lg:text-3xl text-brand-neutral-700 leading-relaxed max-w-4xl mx-auto font-light">
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
                   <h3 className="text-2xl font-bold text-brand-neutral-800 mb-4">Drel Solutions</h3>
                   <p className="text-lg text-brand-neutral-700 leading-relaxed mb-8">
                     {drelDescription}
                   </p>
                   
                   <div className="text-center">
                     <div className="text-8xl lg:text-9xl font-bold text-brand-neutral-900 leading-none">
                       1
                     </div>
                     <div className="text-xl text-brand-neutral-700 mt-2">
                       year in the making.
                     </div>
                   </div>
                 </div>
               </div>
              
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-brand-primary/10 via-white to-brand-success/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Text content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold text-brand-neutral-900 leading-tight">
                    Hi! I'm <span className="text-brand-primary">Elliot Drel</span>
                  </h1>
                  
                  <p className="text-xl text-brand-neutral-600 leading-relaxed">
                    I help businesses unlock their potential through innovative AI solutions and strategic automation.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all">
                    MY STORY
                  </Button>
                  <Button variant="outline" className="border-2 border-brand-neutral-400 text-brand-neutral-700 hover:bg-brand-neutral-50 px-8 py-4 text-lg rounded-lg transition-all">
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
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-primary rounded-full opacity-20"></div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
    </div>
  );
};

export default About; 