import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Menu, X, ChevronDown, DollarSign, Clock, Zap, FileText, Filter, Search, Sparkles, ArrowRight, Brain, Lightbulb, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              <img src="/drel-logo.png" alt="Drel Solutions Logo" className="h-10 w-10 rounded-lg" />
              <span>Drel Solutions</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">About</Link>
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-blue-600 px-3 py-2 text-sm font-medium transition-colors flex items-center">
                  Solutions <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <a href="/modeladvisor" className="block px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100">Model Advisor</a>
                  </div>
                )}
              </div>
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
              <Link to="/about" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium">About</Link>
              <a href="/modeladvisor" className="block text-blue-600 bg-blue-50 px-3 py-2 text-base font-medium">Model Advisor</a>
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

interface ModelInfo {
  name: string;
  provider: string;
  release: string;
  description: string;
  capabilities: string[];
  contextWindow: string;
  trainingCutoff: string;
  responseSpeed: string;
  cost: string;
  useCases: string[];
  limitations: string[];
}

interface ModelRecommendation {
  rank: number;
  name: string;
  provider: string;
  why: string;
  when: string;
  rationale: string;
}

// Add LoadingAnimation component before ModelCard
const LoadingAnimation = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState('');

  const messages = [
    "Analyzing your requirements...",
    "Comparing model capabilities...",
    "Evaluating performance metrics...",
    "Calculating cost-effectiveness...",
    "Matching use cases...",
    "Finalizing recommendations..."
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Main AI thinking animation */}
          <div className="relative">
            <div className="flex justify-center">
              <div className="relative">
                {/* Outer rotating ring */}
                <div className="w-20 h-20 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                {/* Inner pulsing brain icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Floating icons animation */}
            <div className="absolute -top-2 -left-2 animate-bounce">
              <Lightbulb className="h-5 w-5 text-yellow-500" style={{ animationDelay: '0.1s' }} />
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Cpu className="h-5 w-5 text-green-500" style={{ animationDelay: '0.3s' }} />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce">
              <Sparkles className="h-5 w-5 text-purple-500" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* AI thinking header */}
          <div>
            <h3 id="loading-title" className="text-xl font-bold text-gray-900 mb-2">
              AI is Thinking{dots}
            </h3>
            <p id="loading-description" className="text-gray-600 text-sm">
              Our advanced AI is analyzing your requirements to find the perfect model recommendations.
            </p>
          </div>

          {/* Cycling messages */}
          <div className="min-h-[24px] flex items-center justify-center">
            <p className="text-blue-600 font-medium text-sm animate-fade-in">
              {messages[currentMessage]}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 animate-pulse"
              style={{ width: `${((currentMessage + 1) / messages.length) * 100}%` }}
            ></div>
          </div>

          {/* Subtle tip */}
          <p className="text-xs text-gray-500 italic">
            This usually takes 10-15 seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

const ModelCard = ({ model }: { model: ModelInfo }) => {
  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai': return 'bg-green-100 text-green-800';
      case 'anthropic': return 'bg-purple-100 text-purple-800';
      case 'google': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{model.name}</CardTitle>
            <CardDescription className="mt-1">{model.description}</CardDescription>
          </div>
          <Badge className={getProviderColor(model.provider)}>{model.provider}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Technical Specs */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span>Context: {model.contextWindow}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span>Speed: {model.responseSpeed}</span>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <DollarSign className="h-4 w-4 text-red-600" />
            <span>Cost: {model.cost}</span>
          </div>
        </div>

        {/* Key Capabilities */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Key Capabilities</h4>
          <div className="flex flex-wrap gap-1">
            {model.capabilities.slice(0, 3).map((capability, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            {model.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs">+{model.capabilities.length - 3} more</Badge>
            )}
          </div>
        </div>

        {/* Best Use Cases */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Best For</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {model.useCases.slice(0, 3).map((useCase, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2">
          <Button className="w-full" variant="outline">
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const RecommendationCard = ({ recommendation }: { recommendation: ModelRecommendation }) => {
  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai': return 'bg-green-100 text-green-800';
      case 'anthropic': return 'bg-purple-100 text-purple-800';
      case 'google': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">#{recommendation.rank}</span>
              <CardTitle className="text-xl font-bold">{recommendation.name}</CardTitle>
            </div>
            <Badge className={`mt-2 ${getProviderColor(recommendation.provider)}`}>
              {recommendation.provider}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2 text-green-700">Why This Model</h4>
          <p className="text-sm text-gray-700">{recommendation.why}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2 text-blue-700">When to Use</h4>
          <p className="text-sm text-gray-700">{recommendation.when}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2 text-purple-700">Why This Rank</h4>
          <p className="text-sm text-gray-700">{recommendation.rationale}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const ModelAdvisor = () => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelInfo[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // New state for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<ModelRecommendation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load the model index file
        const indexResponse = await fetch('/model_docs/index.json');
        if (!indexResponse.ok) {
          throw new Error('Failed to load model index');
        }
        
        const { models: modelFiles } = await indexResponse.json();
        const modelData: ModelInfo[] = [];

        for (const file of modelFiles) {
          try {
            const response = await fetch(file.path);
            if (response.ok) {
              const content = await response.text();
              const parsed = parseModelFile(content, file.provider);
              if (parsed) modelData.push(parsed);
            }
          } catch (error) {
            console.warn(`Failed to load ${file.path}:`, error);
          }
        }

        setModels(modelData);
        setFilteredModels(modelData);
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  const parseModelFile = (content: string, provider: string): ModelInfo | null => {
    try {
      const lines = content.split('\n');
      const modelName = lines[0]?.replace('Model: ', '') || '';
      
      const getSection = (startPattern: string) => {
        const startIndex = lines.findIndex(line => line.includes(startPattern));
        if (startIndex === -1) return [];
        
        const items = [];
        for (let i = startIndex + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line || line.includes(':') && !line.startsWith('- ')) break;
          if (line.startsWith('- ')) {
            items.push(line.substring(2));
          }
        }
        return items;
      };

      const getSpecValue = (pattern: string) => {
        const line = lines.find(line => line.includes(pattern));
        return line ? line.split(': ')[1] || '' : '';
      };

      return {
        name: modelName,
        provider,
        release: getSpecValue('Release'),
        description: lines.slice(4, 6).join(' ').trim(),
        capabilities: getSection('Key Capabilities'),
        contextWindow: getSpecValue('Context window'),
        trainingCutoff: getSpecValue('Training cutoff'),
        responseSpeed: getSpecValue('Response speed'),
        cost: getSpecValue('Cost'),
        useCases: getSection('Best Use Cases'),
        limitations: getSection('Limitations')
      };
    } catch (error) {
      console.error('Error parsing model file:', error);
      return null;
    }
  };

  useEffect(() => {
    if (selectedProvider === 'all') {
      setFilteredModels(models);
    } else {
      setFilteredModels(models.filter(model => 
        model.provider.toLowerCase() === selectedProvider.toLowerCase()
      ));
    }
  }, [selectedProvider, models]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a description of your task or requirements');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setShowRecommendations(false);

    try {
      const response = await fetch('/api/model_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(
        error instanceof Error 
          ? `Failed to get recommendations: ${error.message}` 
          : 'Failed to get recommendations. Please try again.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setRecommendations([]);
    setShowRecommendations(false);
    setSearchError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navigation />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-gray-600">Loading AI models...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      {/* Show loading animation when searching */}
      {isSearching && <LoadingAnimation />}
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                AI Model <span className="text-blue-600">Advisor</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Compare and select the perfect AI model for your business needs. Get expert insights on capabilities, costs, and use cases.
              </p>
            </div>

            {/* AI-Powered Search Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Sparkles className="h-8 w-8 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">AI-Powered Model Recommendations</h2>
                  </div>
                  <p className="text-gray-600">
                    Describe your project or task, and our AI will recommend the best models for your specific needs.
                  </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                  <div>
                    <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
                      What do you want to build or accomplish?
                    </label>
                    <Textarea
                      id="search-query"
                      placeholder="e.g., I need to build a customer service chatbot that can handle complex technical questions and integrate with our existing CRM system..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="min-h-[100px] resize-none"
                      disabled={isSearching}
                    />
                  </div>

                  {searchError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {searchError}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSearching ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Getting Recommendations...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Get AI Recommendations
                        </>
                      )}
                    </Button>
                    
                    {(showRecommendations || searchError) && (
                      <Button 
                        onClick={clearSearch}
                        variant="outline"
                        className="px-6"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations Results */}
            {showRecommendations && recommendations.length > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Top 5 Recommended Models for Your Task
                  </h3>
                  <p className="text-gray-600">
                    AI-analyzed recommendations based on your specific requirements
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((recommendation, index) => (
                    <RecommendationCard 
                      key={`rec-${recommendation.rank}-${index}`} 
                      recommendation={recommendation} 
                    />
                  ))}
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => setShowRecommendations(false)}
                    variant="outline"
                    className="mr-4"
                  >
                    Browse All Models
                  </Button>
                  <Link to="/contact">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Get Expert Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Original Model Browser (show when not displaying recommendations) */}
            {!showRecommendations && (
              <>
                {/* Filter Controls */}
                <div className="flex justify-center">
                  <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm border">
                    <button
                      onClick={() => setSelectedProvider('all')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProvider === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      All Models
                    </button>
                    <button
                      onClick={() => setSelectedProvider('openai')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProvider === 'openai' 
                          ? 'bg-green-600 text-white' 
                          : 'text-gray-600 hover:text-green-600'
                      }`}
                    >
                      OpenAI
                    </button>
                    <button
                      onClick={() => setSelectedProvider('anthropic')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProvider === 'anthropic' 
                          ? 'bg-purple-600 text-white' 
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      Anthropic
                    </button>
                    <button
                      onClick={() => setSelectedProvider('google')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProvider === 'google' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      Google
                    </button>
                  </div>
                </div>

                {/* Models Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModels.map((model, index) => (
                    <ModelCard key={`${model.provider}-${model.name}-${index}`} model={model} />
                  ))}
                </div>

                {filteredModels.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No models found for the selected provider.</p>
                  </div>
                )}
              </>
            )}

            {/* Contact CTA */}
            <div className="bg-blue-600 text-white py-16 px-8 rounded-2xl text-center">
              <div className="space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold">
                  Need Help Choosing the Right Model?
                </h3>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Our AI experts can help you select the perfect model for your specific use case and budget.
                </p>
                <div className="pt-4">
                  <Link to="/contact">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all">
                      Get Expert Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelAdvisor; 