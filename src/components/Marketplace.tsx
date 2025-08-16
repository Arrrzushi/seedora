import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  Eye, 
  User, 
  Building, 
  MapPin, 
  Calendar, 
  Code, 
  ExternalLink,
  Crown,
  Users,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  Globe,
  X
} from 'lucide-react';
import { demoProjects, developerProfiles, searchProjects, searchDevelopers, type DemoProject, type DeveloperProfile } from '../data/demoProjects';
import { CrossChainAuction } from './CrossChainAuction';

interface MarketplaceProps {
  onBack: () => void;
}

type Project = DemoProject;

const Marketplace: React.FC<MarketplaceProps> = ({ onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'developers'>('projects');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'likes' | 'views' | 'price' | 'recent'>('likes');
  const [projects] = useState<Project[]>(demoProjects);
  const [developers] = useState<DeveloperProfile[]>(developerProfiles);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState<DeveloperProfile[]>(developerProfiles);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState<DeveloperProfile | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [investmentSteps, setInvestmentSteps] = useState<string[]>([]);
  const [currentInvestmentStep, setCurrentInvestmentStep] = useState(0);
  const [investmentStepDetails, setInvestmentStepDetails] = useState<string>('');
  const [investmentProgress, setInvestmentProgress] = useState(0);
  const [showInvestmentSuccess, setShowInvestmentSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [gasFee, setGasFee] = useState<string>('');

  const categories = [
    'all', 'AI/ML', 'Blockchain', 'Fintech', 'Healthtech', 'Edtech', 
    'E-commerce', 'SaaS', 'IoT', 'Cybersecurity', 'Gaming', 'Productivity'
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter and search logic for projects
  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchProjects(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes_count - a.likes_count;
        case 'views':
          return b.views_count - a.views_count;
        case 'price':
          return a.price - b.price;
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [searchQuery, selectedCategory, sortBy, projects]);

  // Filter developers
  useEffect(() => {
    let filtered = developers;

    // Apply search filter for developers
    if (searchQuery.trim()) {
      filtered = searchDevelopers(searchQuery);
    }

    setFilteredDevelopers(filtered);
  }, [searchQuery, developers]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleDeveloperClick = (developer: DeveloperProfile) => {
    setSelectedDeveloper(developer);
    setShowDeveloperModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderProjectCard = (project: Project, index: number) => (
    <div 
      key={project.id} 
      className="bg-white rounded-2xl border border-light-border overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer card-hover stagger-item group" 
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => handleProjectClick(project)}
    >
      <div className="relative">
        <img 
          src={project.thumbnail_url} 
          alt={project.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
        <div className="absolute top-3 right-3">
          {project.is_featured && (
            <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <Crown size={12} />
              <span>FEATURED</span>
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 text-white">
          <span className="text-sm font-medium bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
            {project.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center space-x-2">
          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <Eye size={10} />
            <span>{project.views_count}</span>
          </div>
          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <Heart size={10} className={project.likes_count > 100 ? 'fill-current text-error' : ''} />
            <span>{project.likes_count}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h4 className="font-semibold text-lg text-text-primary group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
          {project.title}
        </h4>
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-text-primary text-sm font-medium">{project.founder_name}</p>
            <p className="text-text-muted text-xs">{project.company_name}</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Price:</span>
            <span className="font-semibold text-primary">{formatCurrency(project.price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Likes:</span>
            <span className="font-semibold text-error flex items-center space-x-1">
              <Heart size={12} className="fill-current" />
              <span>{project.likes_count}</span>
            </span>
          </div>
        </div>

        <button className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg">
          View Details
        </button>
      </div>
    </div>
  );

  const renderDeveloperCard = (developer: DeveloperProfile, index: number) => (
    <div 
      key={developer.id} 
      className="bg-white rounded-2xl border border-light-border p-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer card-hover stagger-item group" 
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => handleDeveloperClick(developer)}
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <img 
            src={developer.avatar_url} 
            alt={developer.name}
            className="w-16 h-16 rounded-2xl ring-2 ring-primary/30 group-hover:scale-105 transition-transform duration-300"
          />
          {developer.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle size={12} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors duration-300">
              {developer.name}
            </h4>
            {developer.verified && (
              <CheckCircle size={16} className="text-success" />
            )}
          </div>
          <p className="text-text-secondary text-sm mb-1">@{developer.username}</p>
          <p className="text-text-muted text-xs">{developer.company} • {developer.location}</p>
        </div>
      </div>

      <p className="text-text-secondary text-sm mb-4 line-clamp-2">{developer.bio}</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary">{developer.projects.length}</div>
          <div className="text-xs text-text-muted">Projects</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary">{developer.total_likes}</div>
          <div className="text-xs text-text-muted">Total Likes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary">{developer.total_views}</div>
          <div className="text-xs text-text-muted">Total Views</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {developer.skills.slice(0, 3).map((skill, skillIndex) => (
          <span 
            key={skillIndex}
            className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium"
          >
            {skill}
          </span>
        ))}
        {developer.skills.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
            +{developer.skills.length - 3} more
          </span>
        )}
      </div>

      <button className="w-full py-3 bg-secondary text-white rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg">
        View Profile
      </button>
    </div>
  );

  const renderProjectModal = () => {
    if (!selectedProject) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-light-border shadow-2xl">
          <div className="relative">
            <img 
              src={selectedProject.thumbnail_url}
              alt={selectedProject.title}
              className="w-full h-64 object-cover"
            />
            <button
              onClick={() => setShowProjectModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-4 text-white">
              <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {selectedProject.category}
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-text-primary mb-2">{selectedProject.title}</h2>
                <p className="text-text-secondary text-lg">{selectedProject.company_name}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{formatCurrency(selectedProject.price)}</div>
                <div className="text-text-muted">Investment Price</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-light-card rounded-xl">
                <Heart size={24} className="mx-auto mb-2 text-error" />
                <div className="text-2xl font-bold text-text-primary">{selectedProject.likes_count}</div>
                <div className="text-sm text-text-muted">Likes</div>
              </div>
              <div className="text-center p-4 bg-light-card rounded-xl">
                <Eye size={24} className="mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-text-primary">{selectedProject.views_count}</div>
                <div className="text-sm text-text-muted">Views</div>
              </div>
              <div className="text-center p-4 bg-light-card rounded-xl">
                <ShoppingBag size={24} className="mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold text-text-primary">{selectedProject.purchase_count}</div>
                <div className="text-sm text-text-muted">Purchases</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-3">Description</h3>
                <p className="text-text-secondary leading-relaxed">{selectedProject.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Project Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Type:</span>
                      <span className="text-text-primary">{selectedProject.project_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Business Model:</span>
                      <span className="text-text-primary">{selectedProject.business_model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Status:</span>
                      <span className="text-success font-medium">{selectedProject.status}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Founder</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Name:</span>
                      <span className="text-text-primary">{selectedProject.founder_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Company:</span>
                      <span className="text-text-primary">{selectedProject.company_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Created:</span>
                      <span className="text-text-primary">{formatDate(selectedProject.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-text-primary mb-2">Development Team</h4>
                <p className="text-text-secondary text-sm">{selectedProject.developers}</p>
              </div>

              <div className="flex space-x-4">
                {selectedProject.demo_link && (
                  <a
                    href={selectedProject.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-secondary text-white rounded-xl font-medium hover:scale-105 transition-all duration-300"
                  >
                    <Globe size={18} />
                    <span>View Demo</span>
                    <ExternalLink size={16} />
                  </a>
                )}
                {selectedProject.presentation_video && (
                  <a
                    href={selectedProject.presentation_video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-accent text-primary rounded-xl font-medium hover:scale-105 transition-all duration-300"
                  >
                    <Eye size={18} />
                    <span>Watch Video</span>
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>

              <button 
                onClick={() => handleInvestmentClick(selectedProject)}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Invest in This Project
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDeveloperModal = () => {
    if (!selectedDeveloper) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-light-border shadow-2xl">
          <div className="relative bg-accent p-8">
            <button
              onClick={() => setShowDeveloperModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-text-primary hover:bg-white/30 transition-all duration-300"
            >
              ✕
            </button>

            <div className="flex items-start space-x-6">
              <div className="relative">
                <img 
                  src={selectedDeveloper.avatar_url}
                  alt={selectedDeveloper.name}
                  className="w-24 h-24 rounded-2xl ring-4 ring-white/30"
                />
                {selectedDeveloper.verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-white flex items-center justify-center">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-3xl font-bold text-text-primary">{selectedDeveloper.name}</h2>
                  {selectedDeveloper.verified && (
                    <CheckCircle size={24} className="text-success" />
                  )}
                </div>
                <p className="text-text-secondary text-lg mb-2">@{selectedDeveloper.username}</p>
                <div className="flex items-center space-x-4 text-text-muted mb-4">
                  <div className="flex items-center space-x-1">
                    <Building size={16} />
                    <span>{selectedDeveloper.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>{selectedDeveloper.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Joined {formatDate(selectedDeveloper.joined_date)}</span>
                  </div>
                </div>
                <p className="text-text-secondary leading-relaxed">{selectedDeveloper.bio}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-light-card rounded-xl">
                <Code size={24} className="mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-text-primary">{selectedDeveloper.projects.length}</div>
                <div className="text-sm text-text-muted">Projects</div>
              </div>
              <div className="text-center p-4 bg-light-card rounded-xl">
                <Heart size={24} className="mx-auto mb-2 text-error" />
                <div className="text-2xl font-bold text-text-primary">{selectedDeveloper.total_likes}</div>
                <div className="text-sm text-text-muted">Total Likes</div>
              </div>
              <div className="text-center p-4 bg-light-card rounded-xl">
                <Eye size={24} className="mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-text-primary">{selectedDeveloper.total_views}</div>
                <div className="text-sm text-text-muted">Total Views</div>
              </div>
              <div className="text-center p-4 bg-light-card rounded-xl">
                <Calendar size={24} className="mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold text-text-primary">
                  {Math.floor((new Date().getTime() - new Date(selectedDeveloper.joined_date).getTime()) / (1000 * 60 * 60 * 24 * 365))}y
                </div>
                <div className="text-sm text-text-muted">Experience</div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedDeveloper.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedDeveloper.projects.map((project, index) => (
                    <div key={index} className="border border-light-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300">
                      <h4 className="font-semibold text-text-primary mb-2">{project.title}</h4>
                      <p className="text-text-secondary text-sm mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                          {project.category}
                        </span>
                        <div className="flex items-center space-x-3 text-sm text-text-muted">
                          <div className="flex items-center space-x-1">
                            <Heart size={12} />
                            <span>{project.likes_count}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye size={12} />
                            <span>{project.views_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:scale-105 transition-all duration-300">
                  Contact Developer
                </button>
                <button className="flex-1 py-3 bg-white border border-light-border text-text-primary rounded-xl font-medium hover:bg-light-hover transition-all duration-300">
                  View All Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleInvestmentClick = (project: Project) => {
    setSelectedProject(project);
    setInvestmentAmount(project.price.toString());
    setShowInvestmentModal(true);
    setShowInvestmentSuccess(false);
    setInvestmentProgress(0);
    setCurrentInvestmentStep(0);
    setTransactionHash('');
    setGasFee('');
  };

  const simulateInvestmentProcess = async () => {
    const steps = [
      'Connecting to blockchain network...',
      'Validating wallet connection...',
      'Calculating gas fees...',
      'Preparing smart contract transaction...',
      'Signing investment agreement...',
      'Submitting transaction to blockchain...',
      'Waiting for network confirmation...',
      'Processing investment allocation...',
      'Updating project ownership records...',
      'Finalizing investment transaction...'
    ];

    setInvestmentSteps(steps);
    setInvestmentStepDetails('Initializing investment process...');
    setInvestmentProgress(0);

    // Simulate MetaMask popup
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('MetaMask connected successfully');
      } catch (error) {
        console.log('MetaMask connection failed:', error);
      }
    }

    for (let i = 0; i < steps.length; i++) {
      setCurrentInvestmentStep(i);
      setInvestmentStepDetails(steps[i]);
      setInvestmentProgress((i / steps.length) * 100);

      // Simulate different processing times for each step
      const delay = i === 0 ? 1000 : i === 3 ? 2000 : i === 5 ? 3000 : i === 7 ? 1500 : 800;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Generate transaction hash at step 6
      if (i === 5) {
        const hash = '0x' + Math.random().toString(16).substr(2, 64);
        setTransactionHash(hash);
        setGasFee((Math.random() * 0.05 + 0.01).toFixed(4));
      }
    }

    setInvestmentProgress(100);
    setInvestmentStepDetails('Investment completed successfully!');
    setShowInvestmentSuccess(true);

    // Close modal after showing success
    setTimeout(() => {
      setShowInvestmentModal(false);
      setShowInvestmentSuccess(false);
      setShowProjectModal(false);
    }, 3000);
  };

  const handleInvestNow = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

      setLoading(true);
    await simulateInvestmentProcess();
      setLoading(false);
  };

  return (
    <div className={`min-h-screen bg-light-bg text-text-primary transition-all duration-1000 ${isLoaded ? 'fade-in' : 'opacity-0'}`}>
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-light-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-3 bg-white border border-light-border rounded-xl hover:bg-light-hover transition-all duration-300 shadow-sm hover:shadow-md"
              >
                ←
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingBag size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-text-primary">IP Marketplace</h1>
                  <p className="text-text-secondary text-lg">Discover and invest in innovative registered projects</p>
                </div>
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 sm:flex-initial">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === 'projects' ? "Search projects..." : "Search developers..."}
                  className="pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 bg-white border border-light-border rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-text-primary placeholder-text-muted w-full sm:w-64 lg:w-80 shadow-sm"
                />
              </div>
              
              {activeTab === 'projects' && (
                <>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Filter size={16} className="sm:w-5 sm:h-5 text-text-muted flex-shrink-0" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-white border border-light-border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-text-primary flex-1 sm:min-w-[140px] shadow-sm"
                    >
                      {categories.map(category => (
                        <option key={category} value={category} className="bg-white">
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'likes' | 'views' | 'price' | 'recent')}
                    className="bg-white border border-light-border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-text-primary min-w-[120px] shadow-sm"
                  >
                    <option value="likes">Most Liked</option>
                    <option value="views">Most Viewed</option>
                    <option value="price">Lowest Price</option>
                    <option value="recent">Most Recent</option>
                  </select>
                </>
              )}

              <div className="flex items-center space-x-2 bg-white border border-light-border rounded-lg sm:rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-light-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-4 font-medium text-base transition-colors duration-300 ${
                activeTab === 'projects' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Projects ({filteredProjects.length})
            </button>
            <button
              onClick={() => setActiveTab('developers')}
              className={`px-6 py-4 font-medium text-base transition-colors duration-300 ${
                activeTab === 'developers' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Developers ({filteredDevelopers.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'projects' ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredProjects.map((project, index) => renderProjectCard(project, index))}
          </div>
        ) : activeTab === 'developers' ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredDevelopers.map((developer, index) => renderDeveloperCard(developer, index))}
          </div>
        ) : (
          <CrossChainAuction />
        )}

        {/* Empty State */}
        {((activeTab === 'projects' && filteredProjects.length === 0) || 
          (activeTab === 'developers' && filteredDevelopers.length === 0)) && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-light-card rounded-2xl flex items-center justify-center mx-auto mb-6">
              {activeTab === 'projects' ? (
                <ShoppingBag size={32} className="text-text-muted" />
              ) : (
                <Users size={32} className="text-text-muted" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              No {activeTab} found
            </h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              {searchQuery 
                ? `No ${activeTab} match your search criteria. Try adjusting your filters.`
                : `No ${activeTab} available at the moment. Check back later!`
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:scale-105 transition-all duration-300"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showProjectModal && selectedProject && renderProjectModal()}
      {showDeveloperModal && selectedDeveloper && renderDeveloperModal()}

      {/* Investment Modal */}
      {showInvestmentModal && selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-light-border shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <DollarSign size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">Invest in Project</h2>
                    <p className="text-text-secondary">{selectedProject.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInvestmentModal(false)}
                  className="w-10 h-10 bg-light-card rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary transition-all duration-300"
                >
                  <X size={20} />
                </button>
              </div>

              {!loading && !showInvestmentSuccess && (
                <div className="space-y-6">
                  <div className="bg-light-card rounded-xl p-6">
                    <h3 className="font-semibold text-text-primary mb-4">Investment Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Project Price:</span>
                        <span className="font-semibold text-text-primary">{formatCurrency(selectedProject.price)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Your Investment:</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            className="w-32 px-3 py-2 border border-light-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Amount"
                          />
                          <span className="text-text-muted">USD</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Estimated Gas Fee:</span>
                        <span className="font-semibold text-success">~$15-25</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-light-card rounded-xl p-6">
                    <h3 className="font-semibold text-text-primary mb-4">Investment Benefits</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={16} className="text-success" />
                        <span className="text-text-secondary">Ownership stake in the project</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={16} className="text-success" />
                        <span className="text-text-secondary">Revenue sharing rights</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={16} className="text-success" />
                        <span className="text-text-secondary">Voting rights on project decisions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={16} className="text-success" />
                        <span className="text-text-secondary">Access to exclusive updates</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleInvestNow}
                    disabled={!investmentAmount || parseFloat(investmentAmount) <= 0}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Confirm Investment
                  </button>
                </div>
              )}

              {/* Investment Progress */}
              {loading && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <DollarSign size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Processing Investment</h3>
                    <p className="text-text-secondary">{investmentStepDetails}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Progress</span>
                      <span className="text-text-primary font-medium">{Math.round(investmentProgress)}%</span>
                    </div>
                    <div className="w-full bg-light-card rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${investmentProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
                    {investmentSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index < currentInvestmentStep 
                            ? 'bg-success text-white' 
                            : index === currentInvestmentStep 
                            ? 'bg-primary text-white animate-pulse' 
                            : 'bg-light-card text-text-muted'
                        }`}>
                          {index < currentInvestmentStep ? '✓' : index + 1}
                        </div>
                        <span className={`text-sm ${
                          index < currentInvestmentStep 
                            ? 'text-success font-medium' 
                            : index === currentInvestmentStep 
                            ? 'text-primary font-medium' 
                            : 'text-text-muted'
                        }`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Transaction Info */}
                  {transactionHash && (
                    <div className="bg-light-card rounded-xl p-4">
                      <h4 className="font-semibold text-text-primary mb-3">Transaction Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Transaction Hash:</span>
                          <span className="text-primary font-mono">{transactionHash.substring(0, 10)}...{transactionHash.substring(58)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Gas Fee:</span>
                          <span className="text-success">{gasFee} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Network:</span>
                          <span className="text-primary">Ethereum Sepolia</span>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* Success State */}
              {showInvestmentSuccess && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-success mb-2">Investment Successful!</h3>
                    <p className="text-text-secondary">Your investment has been processed and confirmed on the blockchain.</p>
                  </div>
                  <div className="bg-light-card rounded-xl p-4">
                    <h4 className="font-semibold text-text-primary mb-3">Investment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Project:</span>
                        <span className="text-text-primary">{selectedProject.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Amount Invested:</span>
                        <span className="text-success font-semibold">{formatCurrency(parseFloat(investmentAmount))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Transaction Hash:</span>
                        <span className="text-primary font-mono">{transactionHash.substring(0, 10)}...{transactionHash.substring(58)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;