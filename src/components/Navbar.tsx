import React, { useState } from 'react';
import { 
  Search, 
  Menu,
  X,
  ShoppingBag,
  TrendingUp,
  Info,
  User,
  Settings,
  LogOut,
  Edit,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  onNavigate: (page: 'dashboard' | 'marketplace' | 'investment-stream' | 'user-profile' | 'analytics' | 'about') => void;
  currentPage: string;
  user?: any;
  onShowAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, user, onShowAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navigationItems = [
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'investment-stream', label: 'Investment Stream', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId as 'dashboard' | 'marketplace' | 'investment-stream' | 'user-profile' | 'analytics' | 'about');
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowProfileDropdown(false);
  };

  const profileMenuItems = [
    { icon: User, label: 'My Profile', action: () => onNavigate('user-profile') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
    { icon: Bell, label: 'Notifications', action: () => console.log('Notifications') },
    { icon: Shield, label: 'Privacy & Security', action: () => console.log('Privacy') },
    { icon: CreditCard, label: 'Billing', action: () => console.log('Billing') },
    { icon: HelpCircle, label: 'Help & Support', action: () => console.log('Help') },
    { icon: LogOut, label: 'Sign Out', action: handleSignOut, danger: true },
  ];

  return (
    <nav className="bg-white border-b border-light-border sticky top-0 z-50 neo-card" style={{ borderRadius: '0px', boxShadow: '5px 5px 0 #141414' }}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* Brand */}
          <div className="flex-shrink-0">
            <div className="flex items-center group cursor-pointer" onClick={() => handleNavClick('dashboard')}>
              <div className="relative">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-primary">
                  Seedora
                </h1>
                <div className="absolute -bottom-1 sm:-bottom-1.5 lg:-bottom-2 left-0 w-full h-1 sm:h-1.5 lg:h-2 bg-secondary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-4 sm:mx-6 lg:mx-8 xl:mx-12 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 lg:pl-6 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 w-5 lg:h-6 w-6 xl:h-7 w-7 text-text-muted group-focus-within:text-primary transition-colors duration-200" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 sm:pl-12 lg:pl-14 xl:pl-16 pr-4 sm:pr-6 lg:pr-8 xl:pr-10 py-2 sm:py-3 lg:py-4 xl:py-5 border border-light-border rounded-lg sm:rounded-xl lg:rounded-2xl bg-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base lg:text-lg font-medium transition-all duration-300 text-text-primary shadow-neo-sm"
                placeholder="Search projects, founders, investors..."
              />
            </div>
          </div>

          {/* Right Navigation + Profile */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-3">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`neo-btn flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-sm lg:text-base xl:text-lg font-semibold transition-all duration-300 ${
                    currentPage === item.id 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-text-primary hover:bg-accent'
                  }`}
                >
                  <item.icon className="w-4 h-4 lg:w-5 h-5 xl:w-6 h-6" />
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Auth/Profile Section */}
            {user ? (
              <div className="hidden lg:block ml-2 lg:ml-4 xl:ml-8 relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="neo-btn flex items-center justify-center w-10 h-10 lg:w-12 h-12 xl:w-14 h-14 bg-secondary rounded-full"
                >
                  <User className="w-5 h-5 lg:w-6 h-6 xl:w-7 h-7 text-text-primary" />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute top-full right-0 mt-2 lg:mt-3 w-80 lg:w-96 bg-white rounded-xl lg:rounded-2xl border border-light-border shadow-neo z-50">
                    {/* User Info Header */}
                    <div className="p-6 lg:p-8 border-b border-light-border">
                      <div className="flex items-center space-x-4 lg:space-x-6">
                        <div className="relative">
                          <img 
                            src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2" 
                            alt="Profile"
                            className="w-16 h-16 lg:w-20 h-20 rounded-full border-2 border-primary"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 h-6 bg-secondary rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg lg:text-xl text-text-primary">{user.email}</h3>
                          <p className="text-text-secondary text-sm lg:text-base">Premium User</p>
                          <p className="text-text-muted text-xs lg:text-sm">{user.email}</p>
                        </div>
                        <button 
                          onClick={() => onNavigate('user-profile')}
                          className="neo-btn p-2 lg:p-3 bg-light-hover"
                        >
                          <Edit size={16} className="lg:w-5 lg:h-5 text-text-muted" />
                        </button>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-3 lg:py-4">
                      {profileMenuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            item.action();
                            setShowProfileDropdown(false);
                          }}
                          className={`w-full flex items-center space-x-3 lg:space-x-4 px-6 lg:px-8 py-3 lg:py-4 hover:bg-light-hover transition-all duration-300 text-left text-base lg:text-lg ${
                            item.danger ? 'text-error hover:text-error' : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <item.icon size={18} className="lg:w-5 lg:h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 lg:p-6 border-t border-light-border text-center">
                      <p className="text-xs lg:text-sm text-text-muted">
                        Seedora Platform • Version 2.1.0
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onShowAuth}
                className="hidden lg:flex neo-btn items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 bg-primary text-white text-sm lg:text-base"
              >
                <User size={16} className="lg:w-5 lg:h-5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden neo-btn p-2 sm:p-3 lg:p-4 text-text-muted hover:text-primary bg-white ml-2 sm:ml-4 lg:ml-8"
            >
              <div className="relative w-5 h-5 sm:w-6 h-6 lg:w-7 h-7">
                <Menu className={`w-5 h-5 sm:w-6 h-6 lg:w-7 h-7 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
                <X className={`w-5 h-5 sm:w-6 h-6 lg:w-7 h-7 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="border-t border-light-border py-6 sm:py-8 lg:py-10">
            {/* Mobile Search */}
            <div className="px-4 sm:px-6 pb-6 sm:pb-8 lg:pb-10">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 sm:h-6 w-6 text-text-muted group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 sm:pl-16 pr-6 sm:pr-10 py-3 sm:py-4 lg:py-5 border border-light-border rounded-xl sm:rounded-2xl bg-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base sm:text-lg font-medium transition-all duration-300 text-text-primary shadow-neo-sm"
                  placeholder="Search projects, founders, investors..."
                />
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div className="space-y-3 sm:space-y-4 px-4 sm:px-6">
              {navigationItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`neo-btn flex items-center space-x-4 sm:space-x-6 w-full px-6 sm:px-8 py-4 sm:py-5 lg:py-6 text-base sm:text-lg font-semibold transition-all duration-300 stagger-item ${
                    currentPage === item.id 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-text-primary hover:bg-accent'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon className="w-5 h-5 sm:w-6 h-6 lg:w-7 h-7" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Mobile Auth/Profile */}
              {user ? (
                <button 
                  onClick={() => {
                    onNavigate('user-profile');
                    setIsMenuOpen(false);
                  }}
                  className="neo-btn flex items-center space-x-4 sm:space-x-6 w-full px-6 sm:px-8 py-4 sm:py-5 lg:py-6 text-base sm:text-lg font-semibold text-white bg-secondary stagger-item"
                >
                  <User className="w-5 h-5 sm:w-6 h-6 lg:w-7 h-7" />
                  <span>Profile</span>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    onShowAuth();
                    setIsMenuOpen(false);
                  }}
                  className="neo-btn flex items-center space-x-4 sm:space-x-6 w-full px-6 sm:px-8 py-4 sm:py-5 lg:py-6 text-base sm:text-lg font-semibold text-white bg-primary stagger-item"
                >
                  <User className="w-5 h-5 sm:w-6 h-6 lg:w-7 h-7" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;