import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Wallet, 
  Github, 
  CheckCircle, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3, 
  Eye, 
  Sparkles, 
  List, 
  Plus, 
  FileText, 
  ExternalLink, 
  Rocket, 
  Filter, 
  Search, 
  RefreshCw,
  Code,
  Camera,
  Mail,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import IPRegistration from './IPRegistration';
import { WalletConnect } from './WalletConnect';
import GitHubIntegration from './GitHubIntegration';
import { supabase } from '../lib/supabase';

interface UserProfileProps {
  onBack: () => void;
}

interface IPRegistration {
  id: string;
  title: string;
  description: string;
  category: string;
  ipfs_url: string;
  created_at: string;
  status: string;
  project_type: string;
  business_model: string;
  demo_link?: string;
  presentation_video?: string;
  developers: string;
  github_repo?: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  private: boolean;
  size: number;
  default_branch: string;
  open_issues_count: number;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  archived: boolean;
  disabled: boolean;
  pushed_at: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'developer' | 'investor' | 'wallet' | 'settings' | 'github'>('overview');
  const [userRole, setUserRole] = useState<'developer' | 'investor' | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [ipRegistrations, setIPRegistrations] = useState<IPRegistration[]>([]);
  const [loadingIPs, setLoadingIPs] = useState(false);
  const [projectsView, setProjectsView] = useState<'list' | 'form'>('list');
  const [selectedRepos, setSelectedRepos] = useState<GitHubRepo[]>([]);

  const [profileData, setProfileData] = useState({
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
    company: '',
    skills: '',
    experience: '',
    joinDate: 'January 2024'
  });

  // Load wallet connection state from localStorage
  useEffect(() => {
    const savedWalletState = localStorage.getItem('walletConnection');
    if (savedWalletState) {
      try {
        const { connected, address } = JSON.parse(savedWalletState);
        setWalletConnected(connected);
        setWalletAddress(address);
      } catch (error) {
        console.error('Error loading wallet state:', error);
      }
    }
  }, []);

  // Load user role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole && (savedRole === 'developer' || savedRole === 'investor')) {
      setUserRole(savedRole);
      setActiveView(savedRole);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchIPRegistrations();
    }
  }, [user]);

  const fetchIPRegistrations = async () => {
    if (!user) return;
    
    setLoadingIPs(true);
    try {
      const result = await supabase
        .from('ip_registrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Type guard for PostgrestResponse
      if (result && typeof result === 'object' && 'data' in result && 'error' in result) {
        const { data, error } = result;
        if (error) throw error;
        setIPRegistrations(data || []);
      } else {
        // fallback for unexpected result
        setIPRegistrations([]);
      }
    } catch (error) {
      console.error('Error fetching IP registrations:', error);
    } finally {
      setLoadingIPs(false);
    }
  };

  const handleWalletConnection = (connected: boolean, address: string = '') => {
    setWalletConnected(connected);
    setWalletAddress(address);
    
    // Save wallet state to localStorage
    if (connected && address) {
      localStorage.setItem('walletConnection', JSON.stringify({ connected, address }));
    } else {
      localStorage.removeItem('walletConnection');
    }
  };

  const handleRoleSwitch = (role: 'developer' | 'investor') => {
    setUserRole(role);
    setActiveView(role);
    // Save role to localStorage
    localStorage.setItem('userRole', role);
  };

  const handleNewProject = () => {
    setProjectsView('form');
  };

  const handleBackToProjects = () => {
    setProjectsView('list');
  };

  const handleRepoSelected = (repo: GitHubRepo) => {
    // Check if repo is already selected
    if (selectedRepos.some(r => r.id === repo.id)) {
      setSelectedRepos(selectedRepos.filter(r => r.id !== repo.id));
    } else {
      // Add repo to selected repos (max 5)
      if (selectedRepos.length < 5) {
        setSelectedRepos([...selectedRepos, repo]);
      }
    }
  };

  const stats = {
    developer: [
      { label: 'Projects Registered', value: ipRegistrations.length, icon: Shield, color: 'bg-primary' },
      { label: 'Approved Projects', value: ipRegistrations.filter(ip => ip.status === 'approved').length, icon: CheckCircle, color: 'bg-success' },
      { label: 'Total Views', value: '2.4K', icon: Eye, color: 'bg-secondary' },
      { label: 'Success Rate', value: '94%', icon: Target, color: 'bg-accent' }
    ],
    investor: [
      { label: 'Total Invested', value: '$125K', icon: DollarSign, color: 'bg-success' },
      { label: 'Active Investments', value: '12', icon: TrendingUp, color: 'bg-primary' },
      { label: 'Portfolio Growth', value: '+24.5%', icon: BarChart3, color: 'bg-secondary' },
      { label: 'ROI', value: '18.7%', icon: Target, color: 'bg-accent' }
    ]
  };

  const renderHeader = () => (
    <div className="relative overflow-hidden bg-accent rounded-3xl p-8 mb-8 text-text-primary">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold border border-white/30">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Camera size={16} />
              </button>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-3">
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Joined {profileData.joinDate}</span>
                </div>
                {walletConnected && (
                  <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                    <Wallet size={16} />
                    <span>Wallet Connected</span>
                    <span className="text-xs">({walletAddress.slice(0, 6)}...{walletAddress.slice(-4)})</span>
                  </div>
                )}
              </div>
              
              {/* Role Switcher */}
              <div className="flex items-center space-x-3">
                <span className="text-text-secondary text-sm">I am a:</span>
                <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
                  <button
                    onClick={() => handleRoleSwitch('developer')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      userRole === 'developer' 
                        ? 'bg-white text-primary shadow-lg' 
                        : 'text-text-primary hover:text-primary hover:bg-white/10'
                    }`}
                  >
                    <Code size={16} />
                    <span>Developer</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('investor')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      userRole === 'investor' 
                        ? 'bg-white text-primary shadow-lg' 
                        : 'text-text-primary hover:text-primary hover:bg-white/10'
                    }`}
                  >
                    <TrendingUp size={16} />
                    <span>Investor</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveView('wallet')}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl text-text-primary hover:bg-white/20 transition-all duration-300"
            >
              <Wallet size={18} />
              <span>Wallet</span>
            </button>
            <button
              onClick={() => setActiveView('github')}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl text-text-primary hover:bg-white/20 transition-all duration-300"
            >
              <Github size={18} />
              <span>GitHub</span>
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl text-text-primary hover:bg-white/20 transition-all duration-300"
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {!userRole ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Welcome to start.dev!</h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Choose your role to get started. You can switch between roles anytime using the toggle above.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div 
              onClick={() => handleRoleSwitch('developer')}
              className="group cursor-pointer bg-white rounded-2xl border border-light-border p-8 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Code size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Developer</h3>
              <p className="text-text-secondary mb-6">
                Register your projects as intellectual property, showcase innovations, and protect your ideas on the blockchain.
              </p>
              <div className="space-y-2 text-sm text-text-muted">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Register IP for projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Connect GitHub repositories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Showcase working demos</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-primary font-medium">Get Started</span>
                <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>

            <div 
              onClick={() => handleRoleSwitch('investor')}
              className="group cursor-pointer bg-white rounded-2xl border border-light-border p-8 hover:border-secondary/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Investor</h3>
              <p className="text-text-secondary mb-6">
                Discover innovative projects, review IP registrations, and invest in promising startups and technologies.
              </p>
              <div className="space-y-2 text-sm text-text-muted">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Browse registered projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Review project details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Make informed investments</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-secondary font-medium">Get Started</span>
                <ArrowRight size={20} className="text-secondary group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats[userRole].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-light-border p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <Sparkles size={16} className="text-text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-1">{stat.value}</h3>
              <p className="text-text-secondary text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDeveloperView = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Developer Dashboard</h2>
          <p className="text-text-secondary">Manage your projects and intellectual property</p>
        </div>
        <div className="flex items-center space-x-3">
          {projectsView === 'form' && (
            <button
              onClick={handleBackToProjects}
              className="flex items-center space-x-2 bg-white border border-light-border px-4 py-2 rounded-xl text-text-primary hover:bg-light-hover transition-all duration-300"
            >
              <ArrowRight size={18} className="rotate-180" />
              <span>Back to Projects</span>
            </button>
          )}
          {projectsView === 'list' && (
            <>
              <button
                onClick={fetchIPRegistrations}
                className="flex items-center space-x-2 bg-white border border-light-border px-4 py-2 rounded-xl text-text-primary hover:bg-light-hover transition-all duration-300"
              >
                <RefreshCw size={18} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleNewProject}
                className="flex items-center space-x-2 bg-primary px-6 py-3 rounded-xl text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Plus size={18} />
                <span>New Project</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!walletConnected ? (
        <div className="bg-white rounded-2xl border border-light-border p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wallet size={32} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Connect Your Wallet</h3>
          <p className="text-text-secondary mb-6">Connect your wallet to start registering projects as IP</p>
          <button
            onClick={() => setActiveView('wallet')}
            className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-xl text-white font-medium transition-all duration-300"
          >
            Connect Wallet
          </button>
        </div>
      ) : projectsView === 'form' ? (
        <div className="bg-white rounded-2xl border border-light-border overflow-hidden">
          <div className="p-6 border-b border-light-border bg-light-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Register New Project</h3>
              <button
                onClick={handleBackToProjects}
                className="text-text-muted hover:text-text-primary transition-colors duration-300"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-6">
            <IPRegistration />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {loadingIPs ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading your projects...</p>
            </div>
          ) : ipRegistrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-light-border p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No Projects Yet</h3>
              <p className="text-text-secondary mb-6">Start by registering your first project as intellectual property</p>
              <button
                onClick={handleNewProject}
                className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-xl text-white font-medium transition-all duration-300"
              >
                Register First Project
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-light-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Your Registered Projects</h3>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <List size={16} />
                    <span>{ipRegistrations.length} project{ipRegistrations.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm">
                  All your registered intellectual property projects are listed below. Click on any project to view details.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ipRegistrations.map((project) => (
                  <div key={project.id} className="bg-white rounded-2xl border border-light-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <FileText size={20} className="text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-text-primary group-hover:text-primary transition-colors duration-300">
                              {project.title}
                            </h4>
                            <p className="text-text-muted text-sm">{project.category}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'approved' ? 'bg-success/20 text-success' :
                          project.status === 'pending' ? 'bg-warning/20 text-warning' :
                          'bg-error/20 text-error'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <p className="text-text-secondary text-sm mb-4 line-clamp-3">{project.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted">Type:</span>
                          <span className="text-text-primary font-medium">{project.project_type}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted">Business Model:</span>
                          <span className="text-text-primary font-medium">{project.business_model}</span>
                        </div>
                        {project.github_repo && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-text-muted">GitHub:</span>
                            <a 
                              href={`https://github.com/${project.github_repo}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-primary hover:text-primary-dark font-medium"
                            >
                              {project.github_repo}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {project.demo_link && (
                            <a 
                              href={project.demo_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-dark text-sm font-medium"
                            >
                              Demo
                            </a>
                          )}
                          {project.presentation_video && (
                            <a 
                              href={project.presentation_video} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-secondary hover:text-secondary-dark text-sm font-medium"
                            >
                              Video
                            </a>
                          )}
                        </div>
                        <a
                          href={project.ipfs_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-muted hover:text-primary transition-colors duration-300"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                    <div className="px-6 py-3 bg-light-card border-t border-light-border">
                      <p className="text-text-muted text-xs">
                        Registered {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  const renderInvestorView = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Investor Dashboard</h2>
          <p className="text-text-secondary">Discover and invest in innovative projects</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
          </div>
          <button className="flex items-center space-x-2 border border-light-border px-4 py-2 rounded-xl hover:bg-light-hover transition-all duration-300">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-light-border p-8 text-center">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lightbulb size={32} className="text-secondary" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">Discover Projects</h3>
        <p className="text-text-secondary mb-6">Browse registered IP projects and investment opportunities</p>
        <button className="bg-secondary hover:bg-secondary-dark px-6 py-3 rounded-xl text-white font-medium transition-all duration-300">
          Browse Projects
        </button>
      </div>
    </div>
  );

  const renderWalletView = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Wallet Connection</h2>
        <p className="text-text-secondary">Connect your wallet to interact with blockchain features</p>
      </div>
      
      <div className="bg-white rounded-2xl border border-light-border p-8">
        <WalletConnect onWalletConnection={handleWalletConnection} />
        
        {walletConnected && (
          <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-xl">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-success" />
              <div>
                <p className="text-text-primary font-medium">Wallet Successfully Connected</p>
                <p className="text-text-secondary text-sm">Address: {walletAddress}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderGitHubView = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">GitHub Integration</h2>
        <p className="text-text-secondary">Connect your GitHub account to showcase repositories and link them to your projects</p>
      </div>
      
      <GitHubIntegration onRepoSelected={handleRepoSelected} selectedRepos={selectedRepos} />
    </div>
  );

  const renderSettingsView = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Settings</h2>
        <p className="text-text-secondary">Manage your account and preferences</p>
      </div>
      
      <div className="bg-white rounded-2xl border border-light-border p-8">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className="w-full px-4 py-3 border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              disabled
              className="w-full px-4 py-3 border border-light-border rounded-xl bg-light-card text-text-muted"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-xl text-white font-medium transition-all duration-300">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 mb-6 text-text-muted hover:text-text-primary transition-colors duration-300"
        >
          <ArrowRight size={20} className="rotate-180" />
          <span>Back to Dashboard</span>
        </button>

        {renderHeader()}

        <div className="space-y-8">
          {activeView === 'overview' && renderOverview()}
          {activeView === 'developer' && renderDeveloperView()}
          {activeView === 'investor' && renderInvestorView()}
          {activeView === 'wallet' && renderWalletView()}
          {activeView === 'github' && renderGitHubView()}
          {activeView === 'settings' && renderSettingsView()}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;