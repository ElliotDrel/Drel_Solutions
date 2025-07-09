import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Zap, Target, BarChart3, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                AI Consulting That 
                <span className="text-blue-600"> Pays for Itself</span>
              </h1>              <p className="text-xl text-gray-600 leading-relaxed">
                We help businesses automate the repetitive, optimize the chaotic, and reclaim hours of lost time. 
                <span className="block mt-2 font-semibold text-gray-800">Spend less. Do more. Breathe easier.</span>
              </p>
            </div>
            <div className="pt-8">
              <Link to="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">Start Saving TIME and MONEY!</Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">AI Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Cost Savings</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">$203K</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">Time Saved</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">7,100h</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium">Automations</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
const AnimatedCounter = ({
  end,
  duration = 2000,
  prefix = "",
  suffix = ""
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.5
    });
    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [end, isVisible]);
  useEffect(() => {
    if (!isVisible) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * end);
      setCount(current);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);
  return <span id={`counter-${end}`} className="font-bold text-4xl lg:text-5xl">
      {prefix}{count.toLocaleString()}{suffix}
    </span>;
};
const StatsSection = () => {
  return <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">Real Impact. Measured in Time and Money.</h2>
            <p className="text-xl text-gray-300">Since launching, my AI systems have helped clients:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <DollarSign className="h-12 w-12 text-green-400" />
              </div>
              <div className="text-green-400">
                <div className="text-sm uppercase tracking-wide font-medium">Saved over</div>
                <AnimatedCounter end={203000} prefix="$" />
                <div className="text-lg text-gray-300 mt-2">in unnecessary costs</div>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Clock className="h-12 w-12 text-blue-400" />
              </div>
              <div className="text-blue-400">
                <div className="text-sm uppercase tracking-wide font-medium">Freed up more than</div>
                <AnimatedCounter end={7100} suffix="+" />
                <div className="text-lg text-gray-300 mt-2">hours of manual busywork</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
const CoreValuesSection = () => {
  const values = [{
    icon: Zap,
    title: "Automate Repetitive Tasks",
    description: "AI tools that handle the work no one wants to do"
  }, {
    icon: DollarSign,
    title: "Cut Unnecessary Costs",
    description: "Streamline processes, reduce manual labor, and remove tool bloat"
  }, {
    icon: BarChart3,
    title: "Make Smarter Decisions Faster",
    description: "Use AI to surface the right data at the right moment"  }, {
    icon: Target,
    title: "Run Lean, Stay Sharp",
    description: "We build systems that keep your operations efficient, not overwhelming"
  }];
  return <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Built to Save You Time and Money</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => <div key={index} className="text-center space-y-4 p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>)}          </div>
            <div className="pt-20">            <div className="bg-blue-600 text-white py-16 px-8 rounded-2xl">              <div className="text-center space-y-8">
                <h3 className="text-3xl lg:text-4xl font-bold">Ready to offload the busywork and focus on what REALLY matters?</h3>
                <div className="pt-4">
                  <Link to="/contact">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">Start Saving TIME and MONEY!</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
const Footer = () => {
  return <footer className="bg-gray-900 text-white py-12">      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        <div className="text-center space-y-8">          <Link to="/" className="flex items-center justify-center space-x-0.1 text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
            <img src="/drel-logo.png" alt="Drel Solutions Logo" className="h-10 w-10 rounded-lg" />
            <span>Drel Solutions</span>
          </Link>
          <p className="text-gray-300 max-w-2xl mx-auto">
            "Built for people like YOU who want to focus on what TRULY matters"
          </p>
          <div className="pt-8 border-t border-gray-800">
            <p className="text-gray-400">&copy; 2024 Drel Solutions. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>;
};
const Index = () => {
  return <div className="min-h-screen">
      {/* Navigation is now provided by the global Layout component */}
      <HeroSection />
      <StatsSection />
      <CoreValuesSection />
      <Footer />
    </div>;
};
export default Index;