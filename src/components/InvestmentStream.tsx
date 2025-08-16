import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  ArrowLeft, 
  Filter, 
  Search
} from 'lucide-react';
import VideoPlayer from './VideoPlayer';

// Investment-focused video interface
interface Video {
  id: string;
  title: string;
  channel: string;
  views: string;
  timestamp: string;
  duration: string;
  thumbnail: string;
  channelAvatar: string;
  description?: string;
  likes?: string;
  dislikes?: string;
  subscribers?: string;
  videoUrl?: string;
  filecoinCID?: string;
  dealInfo?: {
    dealId: string;
    provider: string;
    price: string;
    status: string;
  };
  category?: 'investment' | 'education' | 'analysis' | 'news';
  investmentData?: {
    fundName: string;
    returnRate: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    minInvestment: string;
    totalRaised: string;
    investorsCount: number;
  };
  cdnEnabled?: boolean;
}

interface InvestmentStreamProps {
  onBack: () => void;
  onEscrowNavigate: (data: { investmentAmount?: string }) => void;
}

const InvestmentStream: React.FC<InvestmentStreamProps> = ({ onBack, onEscrowNavigate }) => {
  // Investment-focused video queue
  const [videoQueue, setVideoQueue] = useState<Video[]>([
    {
      id: '1',
      title: 'Revolutionary AI-Powered Investment Platform',
      channel: 'TechInnovation',
      views: '2.4M',
      timestamp: '2 days ago',
      duration: '18:45',
      thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
      channelAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop',
      description: 'A cutting-edge platform that uses artificial intelligence to analyze market trends and provide personalized investment recommendations.',
      likes: '89K',
      category: 'investment',
      investmentData: {
        fundName: 'AI Growth Fund',
        returnRate: '15.2%',
        riskLevel: 'Medium',
        minInvestment: '$1,000',
        totalRaised: '$2.5M',
        investorsCount: 45
      }
    },
    {
      id: '2',
      title: 'Blockchain-Based Supply Chain Solution',
      channel: 'BlockchainVentures',
      views: '1.8M',
      timestamp: '1 week ago',
      duration: '22:15',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
      channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
      description: 'A decentralized supply chain management system that leverages blockchain technology to ensure transparency and security.',
      likes: '67K',
      category: 'investment',
      investmentData: {
        fundName: 'Blockchain Infrastructure Fund',
        returnRate: '12.8%',
        riskLevel: 'High',
        minInvestment: '$2,500',
        totalRaised: '$1.8M',
        investorsCount: 32
      }
    },
    {
      id: '3',
      title: 'Sustainable Energy Management Platform',
      channel: 'GreenTech',
      views: '3.1M',
      timestamp: '2 weeks ago',
      duration: '16:30',
      thumbnail: 'https://images.pexels.com/photos/8386445/pexels-photo-8386445.jpeg?auto=compress&cs=tinysrgb&w=600',
      channelAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
      description: 'An innovative platform that optimizes energy consumption in commercial buildings using IoT sensors and predictive analytics.',
      likes: '124K',
      category: 'investment',
      investmentData: {
        fundName: 'Green Energy Fund',
        returnRate: '18.5%',
        riskLevel: 'Low',
        minInvestment: '$500',
        totalRaised: '$3.2M',
        investorsCount: 58
      }
    },
    {
      id: '4',
      title: 'Mental Health AI Companion',
      channel: 'HealthInnovation',
      views: '1.5M',
      timestamp: '3 weeks ago',
      duration: '14:20',
      thumbnail: 'https://images.pexels.com/photos/8386450/pexels-photo-8386450.jpeg?auto=compress&cs=tinysrgb&w=600',
      channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
      description: 'An AI-powered mental health companion that provides 24/7 emotional support and cognitive behavioral therapy techniques.',
      likes: '78K',
      category: 'investment',
      investmentData: {
        fundName: 'HealthTech Fund',
        returnRate: '22.1%',
        riskLevel: 'Medium',
        minInvestment: '$750',
        totalRaised: '$1.2M',
        investorsCount: 28
      }
    }
  ]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Investments', icon: TrendingUp },
    { id: 'investment', label: 'Investment Opportunities', icon: DollarSign },
    { id: 'analysis', label: 'Market Analysis', icon: Target },
    { id: 'education', label: 'Investment Education', icon: Users }
  ];

  // Page load animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleVideoUpload = (uploadedVideo: Video) => {
    setVideoQueue(prevQueue => {
      // Insert the uploaded video right after the current video
      const newQueue = [...prevQueue];
      newQueue.splice(currentVideoIndex + 1, 0, uploadedVideo);
      return newQueue;
    });
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < videoQueue.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleVideoSelect = (videoIndex: number) => {
    setCurrentVideoIndex(videoIndex);
  };

  const filteredVideos = videoQueue.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentVideo = filteredVideos[currentVideoIndex] || videoQueue[0];
  const upNextVideos = filteredVideos.slice(currentVideoIndex + 1);

  return (
    <div className={`min-h-screen bg-light-bg text-text-primary transition-all duration-1000 ${isLoaded ? 'fade-in' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-text-muted hover:text-text-primary transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <div className="w-px h-6 bg-light-border"></div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Investment Stream</h1>
              <p className="text-text-secondary">Discover and invest in innovative projects</p>
            </div>
          </div>
        </div>

        {/* Search and Filters - Responsive layout */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search investments..."
              className="pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 bg-white border border-light-border rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 text-text-primary placeholder-text-muted w-full sm:w-64 lg:w-80 shadow-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Filter size={16} className="sm:w-5 sm:h-5 text-text-muted flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-light-border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 text-text-primary flex-1 sm:min-w-[180px] lg:min-w-[200px] shadow-sm"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id} className="bg-white">
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Player - Responsive container */}
        {currentVideo && (
          <div className="max-w-[1600px] mx-auto">
            <VideoPlayer 
              video={currentVideo}
              upNextVideos={upNextVideos}
              onVideoUpload={handleVideoUpload}
              onNextVideo={handleNextVideo}
              onVideoSelect={handleVideoSelect}
              currentVideoIndex={currentVideoIndex}
              isInvestmentFocused={true}
              onEscrowNavigate={onEscrowNavigate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentStream;