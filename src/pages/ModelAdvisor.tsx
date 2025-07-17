import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Clock, Zap, FileText, Filter, Search, Sparkles, ArrowRight, Brain, Lightbulb, Cpu, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

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
// Move messages outside component to avoid dependency warning
const loadingMessages = [
  "Analyzing your requirements...",
  "Comparing model capabilities...",
  "Evaluating performance metrics...",
  "Calculating cost-effectiveness...",
  "Matching use cases...",
  "Finalizing recommendations..."
];

const LoadingAnimation = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
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
      <div className="bg-white rounded-2xl shadow-2xl border border-brand-neutral-200 p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Main AI thinking animation */}
          <div className="relative">
            <div className="flex justify-center">
              <div className="relative">
                {/* Outer rotating ring */}
                <div className="w-20 h-20 border-4 border-brand-primary/20 rounded-full animate-spin border-t-brand-primary"></div>
                {/* Inner pulsing brain icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-brand-primary animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Floating icons animation */}
            <div className="absolute -top-2 -left-2 animate-bounce">
              <Lightbulb className="h-5 w-5 text-brand-warning" style={{ animationDelay: '0.1s' }} />
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Cpu className="h-5 w-5 text-brand-success" style={{ animationDelay: '0.3s' }} />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce">
              <Sparkles className="h-5 w-5 text-brand-accent" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* AI thinking header */}
          <div>
            <h3 id="loading-title" className="text-xl font-bold text-foreground mb-2">
              AI is Thinking{dots}
            </h3>
            <p id="loading-description" className="text-brand-neutral-600 text-sm">
              Our advanced AI is analyzing your requirements to find the perfect model recommendations.
            </p>
          </div>

          {/* Cycling messages */}
          <div className="min-h-[24px] flex items-center justify-center">
            <p className="text-brand-primary font-medium text-sm animate-fade-in">
              {loadingMessages[currentMessage]}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="w-full bg-brand-neutral-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-brand-primary to-brand-accent h-2 rounded-full transition-all duration-300 animate-pulse"
              style={{ width: `${((currentMessage + 1) / loadingMessages.length) * 100}%` }}
            ></div>
          </div>

          {/* Subtle tip */}
          <p className="text-xs text-brand-neutral-500 italic">
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
      case 'openai': return 'bg-brand-success/20 text-brand-success';
      case 'anthropic': return 'bg-brand-accent/20 text-brand-accent';
      case 'google': return 'bg-brand-primary/20 text-brand-primary';
      default: return 'bg-brand-neutral-200 text-brand-neutral-700';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow" data-testid="model-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{model.name}</CardTitle>
            <CardDescription className="mt-1">{model.description}</CardDescription>
          </div>
          <Badge className={getProviderColor(model.provider)} data-testid={`badge-${model.provider.toLowerCase()}`}>{model.provider}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Technical Specs */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-brand-primary" />
            <span>Context: {model.contextWindow}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-brand-success" />
            <span>Speed: {model.responseSpeed}</span>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <DollarSign className="h-4 w-4 text-brand-danger" />
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
          <ul className="text-sm text-brand-neutral-600 space-y-1">
            {model.useCases.slice(0, 3).map((useCase, index) => (
              <li key={index} className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
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
      case 'openai': return 'bg-brand-success/20 text-brand-success';
      case 'anthropic': return 'bg-brand-accent/20 text-brand-accent';
      case 'google': return 'bg-brand-primary/20 text-brand-primary';
      default: return 'bg-brand-neutral-200 text-brand-neutral-700';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-brand-primary">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-brand-primary">#{recommendation.rank}</span>
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
          <h4 className="font-semibold text-sm mb-2 text-brand-success">Why This Model</h4>
          <p className="text-sm text-brand-neutral-700">{recommendation.why}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2 text-brand-primary">When to Use</h4>
          <p className="text-sm text-brand-neutral-700">{recommendation.when}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2 text-brand-accent">Why This Rank</h4>
          <p className="text-sm text-brand-neutral-700">{recommendation.rationale}</p>
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
  
  // New state for show more functionality
  const [showAllModels, setShowAllModels] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('ModelAdvisor: Starting model load...');
        // Load the model index file
        const indexResponse = await fetch('/model_docs/index.json');
        console.log('ModelAdvisor: Index response status:', indexResponse.ok, indexResponse.status);
        
        if (!indexResponse.ok) {
          console.error('ModelAdvisor: Index failed:', indexResponse.status, indexResponse.statusText);
          throw new Error('Failed to load model index');
        }
        
        const { models: modelFiles } = await indexResponse.json();
        console.log('ModelAdvisor: Model files loaded:', modelFiles.length);
        const modelData: ModelInfo[] = [];

        for (const file of modelFiles) {
          try {
            // Add timeout to individual fetch calls
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout per file
            
            const response = await fetch(file.path, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (response.ok) {
              const content = await response.text();
              const parsed = parseModelFile(content, file.provider);
              if (parsed) {
                modelData.push(parsed);
                console.log(`ModelAdvisor: Successfully loaded ${file.provider}/${parsed.name}`);
              } else {
                console.warn(`ModelAdvisor: Failed to parse ${file.path}`);
              }
            } else {
              console.warn(`ModelAdvisor: Failed to fetch ${file.path}: ${response.status}`);
            }
          } catch (error) {
            console.warn(`Failed to load ${file.path}:`, error);
          }
        }

        console.log('ModelAdvisor: Total models loaded:', modelData.length);
        setModels(modelData);
        setFilteredModels(modelData);
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        console.log('ModelAdvisor: Setting loading to false');
        setLoading(false);
      }
    };

    // Set up a maximum loading timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('ModelAdvisor: Loading timeout reached, setting loading to false');
      setLoading(false);
    }, 12000); // 12 second timeout

    loadModels().finally(() => {
      clearTimeout(loadingTimeout);
    });

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(loadingTimeout);
    };
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
    // Reset show more state when provider changes
    setShowAllModels(false);
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
      <div className="min-h-screen bg-gradient-to-br from-brand-primary/10 via-white to-brand-success/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-brand-neutral-600">Loading AI models...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary/10 via-white to-brand-success/10">
      {/* Show loading animation when searching */}
      {isSearching && <LoadingAnimation />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-neutral-900">
                AI Model <span className="text-brand-primary">Advisor</span>
              </h1>
              <p className="text-xl text-brand-neutral-600 max-w-3xl mx-auto">
                Compare and select the perfect AI model for your business needs. Get expert insights on capabilities, costs, and use cases.
              </p>
            </div>

            {/* AI-Powered Search Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-brand-neutral-200 p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Sparkles className="h-8 w-8 text-brand-primary" />
                    <h2 className="text-2xl font-bold text-brand-neutral-900">AI-Powered Model Recommendations</h2>
                  </div>
                  <p className="text-brand-neutral-600">
                    Describe your project or task, and our AI will recommend the best models for your specific needs.
                  </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                  <div>
                    <label htmlFor="search-query" className="block text-sm font-medium text-brand-neutral-700 mb-2">
                      What do you want to build or accomplish?
                    </label>
                    <Textarea
                      id="search-query"
                      data-testid="search-input"
                      placeholder="e.g., I need to build a customer service chatbot that can handle complex technical questions and integrate with our existing CRM system..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="min-h-[100px] resize-none"
                      disabled={isSearching}
                    />
                  </div>

                  {searchError && (
                    <div className="text-brand-danger text-sm bg-brand-danger/10 p-3 rounded-lg" data-testid="error-message">
                      {searchError}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white"
                      data-testid="search-button"
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
                        data-testid="clear-button"
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
                  <h3 className="text-2xl font-bold text-brand-neutral-900 mb-2">
                    Top 5 Recommended Models for Your Task
                  </h3>
                  <p className="text-brand-neutral-600">
                    AI-analyzed recommendations based on your specific requirements
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((recommendation, index) => (
                    <div key={`rec-${recommendation.rank}-${index}`} data-testid="recommendation">
                      <RecommendationCard 
                        recommendation={recommendation} 
                      />
                    </div>
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
                    <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white">
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
                      data-testid="filter-all"
                      aria-pressed={selectedProvider === 'all'}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProvider === 'all' 
                          ? 'bg-brand-primary text-white' 
                          : 'text-brand-neutral-600 hover:text-brand-primary'
                      }`}
                    >
                      All Models
                    </button>
                    <button
                      onClick={() => setSelectedProvider('openai')}
                      data-testid="filter-openai"
                      aria-pressed={selectedProvider === 'openai'}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProvider === 'openai' 
                          ? 'bg-brand-success text-white' 
                          : 'text-brand-neutral-600 hover:text-brand-success'
                      }`}
                    >
                      OpenAI
                    </button>
                    <button
                      onClick={() => setSelectedProvider('anthropic')}
                      data-testid="filter-anthropic"
                      aria-pressed={selectedProvider === 'anthropic'}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProvider === 'anthropic' 
                          ? 'bg-brand-accent text-white' 
                          : 'text-brand-neutral-600 hover:text-brand-accent'
                      }`}
                    >
                      Anthropic
                    </button>
                    <button
                      onClick={() => setSelectedProvider('google')}
                      data-testid="filter-google"
                      aria-pressed={selectedProvider === 'google'}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProvider === 'google' 
                          ? 'bg-brand-primary text-white' 
                          : 'text-brand-neutral-600 hover:text-brand-primary'
                      }`}
                    >
                      Google
                    </button>
                  </div>
                </div>

                {/* Models Grid */}
                <div className="models-grid-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="model-grid">
                  {filteredModels.length > 0 ? (
                    (showAllModels ? filteredModels : filteredModels.slice(0, 6)).map((model, index) => (
                      <ModelCard key={`${model.provider}-${model.name}-${index}`} model={model} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-brand-neutral-500 text-lg">
                        {loading ? 'Loading AI models...' : 'No models available. Please check your connection and try refreshing the page.'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Show More/Less Button */}
                {filteredModels.length > 6 && (
                  <div className="flex justify-center mt-8">
                    <Button 
                      onClick={() => {
                        setShowAllModels(!showAllModels);
                        // Scroll to models section when showing less
                        if (showAllModels) {
                          const modelsSection = document.querySelector('.models-grid-section');
                          if (modelsSection) {
                            modelsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }}
                      variant="outline" 
                      className="px-8 py-3 text-lg font-medium border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200"
                      data-testid={showAllModels ? "show-less" : "show-more"}
                    >
                      {showAllModels ? (
                        <>
                          Show Less Models
                          <ChevronDown className="ml-2 h-5 w-5 transform rotate-180" />
                        </>
                      ) : (
                        <>
                          Show More Models ({filteredModels.length - 6} more)
                          <ChevronDown className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {filteredModels.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-brand-neutral-600">No models found for the selected provider.</p>
                  </div>
                )}
              </>
            )}

            {/* Contact CTA */}
            <div className="bg-brand-primary text-white py-16 px-8 rounded-2xl text-center">
              <div className="space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold">
                  Need Help Choosing the Right Model?
                </h3>
                <p className="text-xl text-brand-primary/30 max-w-2xl mx-auto">
                  Our AI experts can help you select the perfect model for your specific use case and budget.
                </p>
                <div className="pt-4">
                  <Link to="/contact">
                    <Button className="bg-white text-brand-primary hover:bg-brand-neutral-100 px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all">
                      Get Expert Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ModelAdvisor; 