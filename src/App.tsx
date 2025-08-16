import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import EscrowComponent from './components/EscrowComponent';
import Marketplace from './components/Marketplace';
import UserProfile from './components/UserProfile';
import VideoPlayer from './components/VideoPlayer';
import VideoUploadModal from './components/VideoUploadModal';
import InvestmentStream from './components/InvestmentStream';
import EnhancedAnalytics from './components/EnhancedAnalytics';
import AuctionSystem from './components/AuctionSystem';
import { CrossChainAuction } from './components/CrossChainAuction';
import MCPAssistant from './components/MCPAssistant';
import MCPAssistantButton from './components/MCPAssistantButton';
import GitHubIntegration from './components/GitHubIntegration';
import Auth from './components/Auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Video } from './types/Video';

// Analytics Route Wrapper Component
const AnalyticsRoute: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return <EnhancedAnalytics onBack={handleBack} />;
};

// UserProfile Route Wrapper Component
const UserProfileRoute: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return <UserProfile onBack={handleBack} />;
};

// Escrow Route Wrapper Component
const EscrowRoute: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return <EscrowComponent onBack={handleBack} />;
};

// InvestmentStream Route Wrapper Component
const InvestmentStreamRoute: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleEscrowNavigate = (data: { investmentAmount?: string }) => {
    navigate('/escrow', { state: data });
  };

  return <InvestmentStream onBack={handleBack} onEscrowNavigate={handleEscrowNavigate} />;
};

// VideoPlayer Route Wrapper Component
const VideoPlayerRoute: React.FC = () => {
  const navigate = useNavigate();

  const handleEscrowNavigate = (data: { investmentAmount?: string }) => {
    navigate('/escrow', { state: data });
  };

  // Mock video data for VideoPlayer
  const mockVideo: Video = {
    id: '1',
    title: 'Sample Video',
    channel: 'Sample Creator',
    views: '1.2K',
    timestamp: '2 days ago',
    duration: '10:30',
    thumbnail: 'https://sample.com/thumbnail.jpg',
    channelAvatar: 'https://sample.com/avatar.jpg',
    description: 'Sample description',
    likes: '100',
    category: 'investment'
  };

  const mockUpNextVideos: Video[] = [
    {
      id: '2',
      title: 'Next Video 1',
      channel: 'Creator 1',
      views: '500',
      timestamp: '1 week ago',
      duration: '5:20',
      thumbnail: 'https://sample.com/thumb1.jpg',
      channelAvatar: 'https://sample.com/avatar1.jpg'
    },
    {
      id: '3',
      title: 'Next Video 2',
      channel: 'Creator 2',
      views: '300',
      timestamp: '2 weeks ago',
      duration: '8:15',
      thumbnail: 'https://sample.com/thumb2.jpg',
      channelAvatar: 'https://sample.com/avatar2.jpg'
    }
  ];

  const handleVideoUpload = (video: any) => {
    console.log('Video uploaded:', video);
  };

  const handleNextVideo = () => {
    console.log('Next video');
  };

  const handleVideoSelect = (index: number) => {
    console.log('Video selected:', index);
  };

  return (
    <VideoPlayer 
      video={mockVideo}
      upNextVideos={mockUpNextVideos}
      onVideoUpload={handleVideoUpload}
      onNextVideo={handleNextVideo}
      onVideoSelect={handleVideoSelect}
      currentVideoIndex={0}
      onEscrowNavigate={handleEscrowNavigate}
    />
  );
};

// Marketplace Route Wrapper Component
const MarketplaceRoute: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return <Marketplace onBack={handleBack} />;
};

// VideoUploadModal Route Wrapper Component
const VideoUploadModalRoute: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleVideoUploaded = (video: any) => {
    console.log('Video uploaded:', video);
    handleClose();
  };

  return (
    <VideoUploadModal 
      isOpen={isOpen}
      onClose={handleClose}
      onVideoUploaded={handleVideoUploaded}
    />
  );
};

// MCPAssistant Route Wrapper Component
const MCPAssistantRoute: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/dashboard');
  };

  return (
    <MCPAssistant 
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
};

// Main App Component with Auth Context
const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
  };

  const handleNavigate = (page: 'dashboard' | 'marketplace' | 'investment-stream' | 'user-profile' | 'analytics' | 'about') => {
    switch (page) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'marketplace':
        navigate('/marketplace');
        break;
      case 'investment-stream':
        navigate('/stream');
        break;
      case 'user-profile':
        navigate('/profile');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'about':
        navigate('/about');
        break;
    }
  };

  const handleShowAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    navigate('/dashboard');
    // Force update currentRoute to ensure navbar shows
    setCurrentRoute('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentRoute !== '/' && (
      <Navbar 
          onNavigate={handleNavigate}
          currentPage={currentRoute.replace('/', '') || 'dashboard'}
        user={user}
          onShowAuth={handleShowAuth}
        />
      )}
      <Routes>
        <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/escrow" element={<EscrowRoute />} />
        <Route path="/marketplace" element={<MarketplaceRoute />} />
        <Route path="/profile" element={<UserProfileRoute />} />
        <Route path="/video/:id" element={<VideoPlayerRoute />} />
        <Route path="/upload" element={<VideoUploadModalRoute />} />
        <Route path="/stream" element={<InvestmentStreamRoute />} />
        <Route path="/analytics" element={<AnalyticsRoute />} />
        <Route path="/auction" element={<AuctionSystem onViewItem={() => {}} />} />
        <Route path="/cross-chain" element={<CrossChainAuction />} />
        <Route path="/mcp" element={<MCPAssistantRoute />} />
        <Route path="/github" element={<GitHubIntegration />} />
      </Routes>
      {/* Auth Modal */}
      <Auth 
        isOpen={isAuthModalOpen}
        onClose={handleAuthClose}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Global MCP Assistant Button */}
      <MCPAssistantButton />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;