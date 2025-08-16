import React from 'react';
import { 
  Shield, 
  Users, 
  Globe, 
  Target, 
  Lightbulb, 
  Lock, 
  Search, 
  Link, 
  Database, 
  FileText, 
  BarChart3, 
  ArrowRight, 
  Building,
  MessageCircle,
  Github,
  Linkedin
} from 'lucide-react';

interface AboutPageProps {
  onBack?: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack = () => {} }) => {
  const values = [
    {
      icon: Shield,
      title: 'Protection',
      description: 'We believe every developer deserves to have their intellectual property protected through blockchain technology.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We foster innovation by connecting great ideas with the resources they need to grow and succeed.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We build a supportive community where developers and investors can thrive together.'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'We make powerful tools accessible to developers worldwide, regardless of background.'
    }
  ];

  const features = [
    {
      icon: Lock,
      title: 'IP Protection',
      description: 'Secure your intellectual property with blockchain-based registration and timestamping.',
      color: 'text-primary'
    },
    {
      icon: Search,
      title: 'Project Discovery',
      description: 'Find innovative projects and connect with developers through our advanced search and filtering.',
      color: 'text-secondary'
    },
    {
      icon: Link,
      title: 'Investment Matching',
      description: 'AI-powered matching system connects projects with the right investors based on criteria and goals.',
      color: 'text-accent'
    },
    {
      icon: Database,
      title: 'FilCDN Integration',
      description: 'Decentralized content delivery network for fast, reliable, and censorship-resistant hosting.',
      color: 'text-primary'
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Comprehensive document management system for project files, contracts, and legal documents.',
      color: 'text-secondary'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Advanced analytics and MCP-powered insights to help you make informed decisions.',
      color: 'text-accent'
    }
  ];

  return (
    <div className="min-h-screen bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 mb-8 text-text-muted hover:text-text-primary transition-colors duration-300"
        >
          <ArrowRight size={20} className="rotate-180" />
          <span>Back to Dashboard</span>
        </button>

        {/* Hero Section */}
        <div className="bg-accent rounded-3xl p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-black mb-6">
              About <span className="text-primary">Seedora</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8">
              The world's first decentralized platform that protects developer IP and connects innovators with investors through blockchain technology and AI-powered matching.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl text-text-primary font-medium hover:bg-light-hover transition-all duration-300 shadow-sm">
                <Building size={18} />
                <span>Our Story</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl text-text-primary font-medium hover:bg-light-hover transition-all duration-300 shadow-sm">
                <Target size={18} />
                <span>Our Mission</span>
              </button>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">Our Story</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              How Seedora is revolutionizing the way developers protect their work and connect with investors
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-light-border p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">The Problem We Solve</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  In today's digital economy, developers face two major challenges: protecting their intellectual property and finding the right investors to bring their ideas to life. Traditional IP protection is expensive, slow, and often inaccessible to independent developers.
                </p>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  Meanwhile, investors struggle to discover promising projects early, and developers lack the visibility and connections needed to secure funding. This creates a massive gap between innovation and investment.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Seedora bridges this gap by combining blockchain technology for IP protection with AI-powered matching to connect developers with the right investors at the right time.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2" 
                  alt="Seedora platform overview"
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-lg">
                  <div className="text-sm font-medium text-text-primary">Founded in 2023</div>
                  <div className="text-xs text-text-muted">San Francisco, CA</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission & Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">Mission & Values</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              The principles that guide everything we do at Seedora
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-light-border p-8 shadow-sm mb-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">Our Mission</h3>
              <p className="text-xl text-text-secondary leading-relaxed">
                To democratize innovation by providing developers with the tools to protect their intellectual property while connecting them with investors who can help bring their ideas to life. We believe that great ideas should have the opportunity to become great companies, regardless of where they originate.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl border border-light-border p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <value.icon size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">{value.title}</h3>
                <p className="text-text-secondary leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">Platform Features</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Comprehensive tools and services designed to empower developers and investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl border border-light-border p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className={`w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon size={32} className={feature.color} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">How It Works</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              A simple three-step process to protect your IP and connect with investors
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-light-border p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Register Your Project</h3>
                <p className="text-text-secondary leading-relaxed">
                  Upload your project files, documentation, and intellectual property. Our blockchain-based system creates an immutable record of your work with timestamp and ownership proof.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Get Discovered</h3>
                <p className="text-text-secondary leading-relaxed">
                  Your project becomes visible to our network of investors and partners. Our AI-powered matching system connects you with investors who align with your project's goals and requirements.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Connect & Grow</h3>
                <p className="text-text-secondary leading-relaxed">
                  Engage with potential investors through our secure messaging and video call features. Use our escrow system for secure investment transactions and milestone-based funding releases.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">Get in Touch</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Have questions or want to learn more about Seedora?
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-light-border p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-text-primary mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Building size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Headquarters</h4>
                      <p className="text-text-secondary">123 Innovation Way, San Francisco, CA 94107</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Email</h4>
                      <p className="text-text-secondary">hello@seedora.dev</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Globe size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Social</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <a href="#" className="text-text-muted hover:text-primary transition-colors">
                          <Github size={20} />
                        </a>
                        <a href="#" className="text-text-muted hover:text-primary transition-colors">
                          <Linkedin size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-text-primary mb-6">Send Us a Message</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;