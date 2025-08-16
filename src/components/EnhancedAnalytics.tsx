import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Award, 
  Star, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Filter, 
  Brain, 
  MessageCircle, 
  Database, 
  Megaphone, 
  Lightbulb, 
  Crown, 
  Heart, 
  AlertCircle, 
  Clock,
  Eye,
  MousePointer,
  Target
} from 'lucide-react';
import MCPAssistant from './MCPAssistant';
import MCPAssistantButton from './MCPAssistantButton';
import AuctionSystem from './AuctionSystem';

// Enhanced Analytics Component with MCP Integration
interface AnalyticsProps {
  onBack: () => void;
}

interface MCPInsight {
  id: string;
  title: string;
  description: string;
  type: 'market' | 'investment' | 'risk' | 'opportunity';
  confidence: number;
  data: any;
  timestamp: Date;
}

const EnhancedAnalytics: React.FC<AnalyticsProps> = ({ onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'investments' | 'marketplace' | 'users'>('all');
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [leaderboardProjects, setLeaderboardProjects] = useState<any[]>([]);
  const [currentNounIndex, setCurrentNounIndex] = useState(0);
  const [nounAuctionTimeLeft, setNounAuctionTimeLeft] = useState(86400); // 24 hours in seconds
  const [showMCPAssistant, setShowMCPAssistant] = useState(false);
  const [mcpInsights, setMcpInsights] = useState<MCPInsight[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'auctions' | 'insights'>('overview');

  // Mock trending projects data
  const getTrendingProjects = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `project-${i + 1}`,
      name: `Trending Project ${i + 1}`,
      description: `This is a trending project with high potential returns.`,
      category: 'Technology',
      fundingGoal: 1000000,
      currentFunding: 750000,
      investorsCount: 45 + i * 5,
      daysLeft: 30 - i * 2,
      image: `https://images.unsplash.com/photo-${1500000 + i}?w=400&h=300&fit=crop`
    }));
  };

  useEffect(() => {
    setIsLoaded(true);
    // Get top 10 projects by likes
    const topProjects = getTrendingProjects(10);
    setLeaderboardProjects(topProjects);
  }, []);

  // Countdown timer for Nouns auction
  useEffect(() => {
    const timer = setInterval(() => {
      setNounAuctionTimeLeft(prev => {
        if (prev <= 1) {
          // Auction ended - start new auction with next Noun
          setCurrentNounIndex(prevIndex => (prevIndex + 1) % 10);
          return 86400; // Reset to 24 hours
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeframes = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: '1y', label: 'Last Year' }
  ];

  const categories = [
    { id: 'all', label: 'All Analytics', icon: BarChart3 },
    { id: 'investments', label: 'Investment Analytics', icon: TrendingUp },
    { id: 'marketplace', label: 'Marketplace Analytics', icon: DollarSign },
    { id: 'users', label: 'User Analytics', icon: Users }
  ];

  // Key Performance Indicators
  const kpis = [
    {
      title: 'Total Investment Volume',
      value: '$2.4M',
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      description: 'Total amount invested across all funds'
    },
    {
      title: 'Active Users',
      value: '12,450',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      description: 'Monthly active users on the platform'
    },
    {
      title: 'Average Return Rate',
      value: '24.5%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      description: 'Average portfolio return rate'
    },
    {
      title: 'Platform Growth',
      value: '94.2%',
      change: '+8.3%',
      trend: 'up',
      icon: Activity,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
      description: 'Month-over-month platform growth'
    }
  ];

  // Format time for Nouns auction
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate random Noun SVG (simplified for demo)
  const generateNounSvg = (index: number) => {
    const colors = ['#D5D7E1', '#E1D7D5', '#D5E1D7', '#E1D5E1', '#D7E1D5'];
    const bgColor = colors[index % colors.length];
    
    return (
      <div className="w-full h-full bg-white rounded-xl overflow-hidden">
        <div style={{ backgroundColor: bgColor }} className="w-full h-full flex items-center justify-center">
          <Crown size={64} className="text-primary" />
        </div>
      </div>
    );
  };

  const handleInsightGenerated = (insight: MCPInsight) => {
    setMcpInsights(prev => [insight, ...prev]);
  };

  const handleViewItem = (item: any) => {
    // In a real app, this would navigate to the item detail page
    console.log('View item:', item);
  };

  return (
    <div className={`min-h-screen bg-light-bg text-text-primary transition-all duration-1000 ${isLoaded ? 'fade-in' : 'opacity-0'}`}>
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-light-border sticky top-0 z-50 shadow-sm">
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
                  <BarChart3 size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-text-primary">Analytics Dashboard</h1>
                  <p className="text-text-secondary text-lg">Comprehensive platform insights and performance metrics</p>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-3">
                <Filter size={18} className="text-text-muted flex-shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="bg-white border border-light-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-text-primary min-w-[200px] shadow-sm"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="bg-white">
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-text-muted flex-shrink-0" />
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  className="bg-white border border-light-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-text-primary min-w-[160px] shadow-sm"
                >
                  {timeframes.map(timeframe => (
                    <option key={timeframe.id} value={timeframe.id} className="bg-white">
                      {timeframe.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowMCPAssistant(true)}
                  className="flex items-center space-x-2 px-4 py-3 bg-primary rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Brain size={18} />
                  <span>MCP Assistant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* View Tabs */}
      <div className="bg-white border-b border-light-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-6 py-4 font-medium text-base transition-colors duration-300 ${
                activeView === 'overview' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('auctions')}
              className={`px-6 py-4 font-medium text-base transition-colors duration-300 ${
                activeView === 'auctions' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Nouns Auctions
            </button>
            <button
              onClick={() => setActiveView('insights')}
              className={`px-6 py-4 font-medium text-base transition-colors duration-300 ${
                activeView === 'insights' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              MCP Insights
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'overview' && (
          <>
            {/* MCP Insights Banner */}
            <div className="mb-12 bg-primary/10 rounded-2xl border border-primary/20 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-32 translate-x-32"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">MCP-Powered Analytics</h3>
                    <p className="text-text-secondary">Leverage Machine Callable Programs for real-time market insights</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-text-primary">
                    <Database size={16} className="text-primary" />
                    <span className="text-sm font-medium">4 MCP Nodes Active</span>
                  </div>
                  <button 
                    onClick={() => setShowMCPAssistant(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-primary hover:scale-105 rounded-xl text-white font-medium transition-all duration-300 shadow-lg"
                  >
                    <MessageCircle size={18} />
                    <span>Ask MCP Assistant</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
              {kpis.map((kpi, index) => (
                <div key={kpi.title} className={`bg-white rounded-2xl border ${kpi.borderColor} p-8 card-hover stagger-item shadow-sm hover:shadow-lg transition-all duration-300`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${kpi.bgColor}`}>
                      <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                    </div>
                    <div className={`flex items-center space-x-2 text-sm font-semibold px-3 py-1 rounded-full ${
                      kpi.trend === 'up' ? 'text-success bg-success/10' : 'text-error bg-error/10'
                    }`}>
                      {kpi.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span>{kpi.change}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-text-primary mb-2">{kpi.value}</h3>
                    <p className="text-text-secondary font-medium mb-2">{kpi.title}</p>
                    <p className="text-text-muted text-sm">{kpi.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Nouns-Style Leaderboard */}
            {showLeaderboard && (
              <div className="mb-12 bg-white rounded-2xl border border-light-border p-8 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-lg">
                      <Crown size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-text-primary">Project Leaderboard</h2>
                      <p className="text-text-secondary text-lg">Top projects ranked by community likes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setShowLeaderboard(false)}
                      className="px-4 py-2 border border-light-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-light-hover transition-all duration-300"
                    >
                      Hide Leaderboard
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-3 bg-secondary hover:scale-105 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                      <Megaphone size={18} />
                      <span>Share Leaderboard</span>
                    </button>
                  </div>
                </div>
                
                {/* Current Noun Auction - Nouns DAO Style */}
                <div className="bg-accent rounded-xl p-6 mb-8 border border-light-border">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="w-40 h-40 relative">
                      {generateNounSvg(currentNounIndex)}
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        #{currentNounIndex + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-text-primary">Current Auction: Noun #{currentNounIndex + 1}</h3>
                        <div className="bg-error text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>LIVE</span>
                        </div>
                      </div>
                      
                      <p className="text-text-secondary mb-4">
                        This Noun represents the top project in our leaderboard: <span className="font-semibold text-primary">{leaderboardProjects[currentNounIndex]?.name}</span>
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3 border border-light-border">
                          <div className="text-sm text-text-muted">Current Bid</div>
                          <div className="text-xl font-bold text-primary">$2,450</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-light-border">
                          <div className="text-sm text-text-muted">Time Left</div>
                          <div className="text-xl font-bold text-error">{formatTime(nounAuctionTimeLeft)}</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-light-border">
                          <div className="text-sm text-text-muted">Bidders</div>
                          <div className="text-xl font-bold text-primary">12</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-light-border">
                          <div className="text-sm text-text-muted">Auction #</div>
                          <div className="text-xl font-bold text-secondary">{currentNounIndex + 1}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <button className="px-6 py-3 bg-primary hover:scale-105 rounded-xl text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2">
                          <DollarSign size={18} />
                          <span>Place Bid</span>
                        </button>
                        <button 
                          onClick={() => setActiveView('auctions')}
                          className="px-6 py-3 bg-white border border-light-border hover:bg-light-hover rounded-xl text-text-primary font-medium transition-all duration-300"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Leaderboard Table */}
                <div className="overflow-hidden rounded-xl border border-light-border">
                  <table className="w-full">
                    <thead className="bg-light-card">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Project</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Founder</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Likes</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border">
                      {leaderboardProjects.map((project, index) => (
                        <tr key={project.id} className={`${index < 3 ? 'bg-accent/20' : 'bg-white'} hover:bg-light-hover transition-colors duration-300`}>
                          <td className="px-6 py-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-secondary' :
                              index === 1 ? 'bg-primary' :
                              index === 2 ? 'bg-accent' :
                              'bg-primary'
                            }`}>
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                {index === 0 ? <Crown size={20} className="text-secondary" /> :
                                 index === 1 ? <Award size={20} className="text-primary" /> :
                                 index === 2 ? <Medal size={20} className="text-accent" /> :
                                 <Lightbulb size={20} className="text-primary" />}
                              </div>
                              <div>
                                <div className="font-medium text-text-primary">{project.name}</div>
                                <div className="text-xs text-text-muted">{project.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-text-secondary">{project.investorsCount} investors</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                              {project.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1 text-error font-semibold">
                              <Heart size={16} className="fill-current" />
                              <span>{project.investorsCount}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-primary">${project.currentFunding}</td>
                          <td className="px-6 py-4">
                            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:scale-105 transition-all duration-300">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
              {/* Investment Performance */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-light-border p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                      <TrendingUp size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-text-primary">Investment Performance</h2>
                      <p className="text-text-secondary">Fund performance and returns analysis</p>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary-dark font-semibold px-6 py-3 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all duration-300">
                    View Details
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Investment Performance Data */}
                  {[
                    { fund: 'FinTech Innovation', invested: '$450K', current: '$623K', return: '+38.4%', investors: 156 },
                    { fund: 'Green Energy Portfolio', invested: '$320K', current: '$399K', return: '+24.7%', investors: 89 },
                    { fund: 'AI Technology Fund', invested: '$580K', current: '$906K', return: '+56.2%', investors: 234 },
                    { fund: 'Healthcare Innovation', invested: '$290K', current: '$348K', return: '+20.0%', investors: 67 },
                    { fund: 'Real Estate REIT', invested: '$380K', current: '$418K', return: '+10.0%', investors: 123 }
                  ].map((fund, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-light-card border border-light-border rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 cursor-pointer card-hover stagger-item" 
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-text-primary text-lg mb-2">{fund.fund}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                          <span>Invested: {fund.invested}</span>
                          <span>•</span>
                          <span>Current: {fund.current}</span>
                          <span>•</span>
                          <span>{fund.investors} investors</span>
                        </div>
                      </div>
                      <div className="text-right mt-4 sm:mt-0">
                        <div className="text-2xl font-bold text-success">{fund.return}</div>
                        <div className="text-text-muted text-sm">Return</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MCP Insights */}
              <div className="bg-white rounded-2xl border border-light-border p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Brain size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-text-primary">MCP Insights</h2>
                    <p className="text-text-secondary">AI-powered market intelligence</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {mcpInsights.length > 0 ? (
                    mcpInsights.map((insight, index) => (
                      <div 
                        key={insight.id} 
                        className={`p-6 border rounded-xl transition-all duration-300 stagger-item ${
                          insight.type === 'market' ? 'bg-primary/10 border-primary/20' :
                          insight.type === 'investment' ? 'bg-success/10 border-success/20' :
                          insight.type === 'risk' ? 'bg-error/10 border-error/20' :
                          'bg-secondary/10 border-secondary/20'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-text-primary">{insight.title}</h4>
                          <div className="flex items-center space-x-1 text-xs">
                            <span className="text-text-muted">Confidence:</span>
                            <span className={`font-medium ${
                              insight.confidence > 0.8 ? 'text-success' :
                              insight.confidence > 0.6 ? 'text-warning' :
                              'text-error'
                            }`}>
                              {Math.round(insight.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-text-secondary text-sm mb-3">{insight.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted">
                            {insight.timestamp.toLocaleTimeString()}
                          </span>
                          <button className="text-primary font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Brain size={48} className="mx-auto mb-4 text-text-muted opacity-50" />
                      <p className="text-text-secondary font-medium mb-2">No insights yet</p>
                      <p className="text-text-muted text-sm mb-6">Ask the MCP Assistant to generate insights</p>
                      <button 
                        onClick={() => setShowMCPAssistant(true)}
                        className="px-6 py-3 bg-primary hover:scale-105 rounded-xl text-white font-medium transition-all duration-300"
                      >
                        Open MCP Assistant
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Real-time Activity Feed */}
            <div className="bg-white rounded-2xl border border-light-border p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                    <Activity size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-text-primary">Real-time Activity</h2>
                    <p className="text-text-secondary">Live platform activity and transactions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-success">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Active Sessions', value: '1,234', icon: Eye, color: 'text-primary' },
                  { label: 'New Investments', value: '$45K', icon: DollarSign, color: 'text-success' },
                  { label: 'Page Views/min', value: '89', icon: MousePointer, color: 'text-secondary' },
                  { label: 'Avg. Session Time', value: '8m 32s', icon: Clock, color: 'text-accent' }
                ].map((metric, index) => (
                  <div key={index} className="text-center p-6 bg-light-card border border-light-border rounded-xl hover:bg-success/10 transition-all duration-300 stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <metric.icon className={`w-8 h-8 ${metric.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-text-primary mb-1">{metric.value}</div>
                    <div className="text-text-secondary text-sm">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeView === 'auctions' && (
          <AuctionSystem onViewItem={handleViewItem} />
        )}

        {activeView === 'insights' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-text-primary mb-2">MCP Insights</h2>
                <p className="text-text-secondary">AI-powered market intelligence from Machine Callable Programs</p>
              </div>
              <button 
                onClick={() => setShowMCPAssistant(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-primary rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Brain size={18} />
                <span>Ask MCP Assistant</span>
              </button>
            </div>

            {mcpInsights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mcpInsights.map((insight) => (
                  <div 
                    key={insight.id} 
                    className={`bg-white border rounded-2xl p-8 transition-all duration-300 hover:shadow-lg ${
                      insight.type === 'market' ? 'border-primary/20' :
                      insight.type === 'investment' ? 'border-success/20' :
                      insight.type === 'risk' ? 'border-error/20' :
                      'border-secondary/20'
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        insight.type === 'market' ? 'bg-primary/10' :
                        insight.type === 'investment' ? 'bg-success/10' :
                        insight.type === 'risk' ? 'bg-error/10' :
                        'bg-secondary/10'
                      }`}>
                        {insight.type === 'market' ? <TrendingUp size={24} className="text-primary" /> :
                         insight.type === 'investment' ? <DollarSign size={24} className="text-success" /> :
                         insight.type === 'risk' ? <AlertCircle size={24} className="text-error" /> :
                         <Lightbulb size={24} className="text-secondary" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary">{insight.title}</h3>
                        <p className="text-text-secondary">{insight.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      {insight.type === 'market' && insight.data.trendingProjects && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-text-primary">Top Trending Projects</h4>
                          {insight.data.trendingProjects.slice(0, 3).map((project: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-light-card rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Star size={12} className="text-primary" />
                                </div>
                                <span className="font-medium text-text-primary">{project.name}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Heart size={14} className="text-error" />
                                <span>{project.investorsCount}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {insight.type === 'opportunity' && insight.data.undervaluedProjects && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-text-primary">Investment Opportunities</h4>
                          {insight.data.undervaluedProjects.map((project: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-light-card rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                                  <Target size={12} className="text-success" />
                                </div>
                                <span className="font-medium text-text-primary">{project.name}</span>
                              </div>
                              <div className="text-success font-semibold">${project.currentFunding}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {insight.type === 'risk' && (
                        <div className="p-4 bg-error/10 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle size={16} className="text-error" />
                            <h4 className="font-semibold text-text-primary">Risk Assessment</h4>
                          </div>
                          <p className="text-text-secondary text-sm">
                            Risk Score: <span className="font-semibold">{insight.data.risk_score}</span>
                          </p>
                          <p className="text-text-secondary text-sm">
                            Diversification: <span className="font-semibold">{insight.data.diversification}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-text-muted">
                        <Clock size={14} />
                        <span>{insight.timestamp.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-text-muted">Confidence:</span>
                        <span className={`font-medium ${
                          insight.confidence > 0.8 ? 'text-success' :
                          insight.confidence > 0.6 ? 'text-warning' :
                          'text-error'
                        }`}>
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-light-border">
                <Brain size={64} className="mx-auto mb-6 text-text-muted opacity-50" />
                <h3 className="text-2xl font-bold text-text-primary mb-3">No Insights Yet</h3>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Use the MCP Assistant to generate AI-powered insights about market trends, investment opportunities, and risk assessments.
                </p>
                <button 
                  onClick={() => setShowMCPAssistant(true)}
                  className="px-8 py-4 bg-primary rounded-xl text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Generate Insights Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MCP Assistant */}
      <MCPAssistant 
        isOpen={showMCPAssistant} 
        onClose={() => setShowMCPAssistant(false)} 
        onInsightGenerated={handleInsightGenerated}
      />

      {/* Floating MCP Assistant Button */}
      <MCPAssistantButton onInsightGenerated={handleInsightGenerated} />
    </div>
  );
};

// Medal icon component for bronze medal
function Medal(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

export default EnhancedAnalytics;