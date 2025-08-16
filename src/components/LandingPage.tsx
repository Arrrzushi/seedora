import React, { useState } from 'react';
import { 
  ArrowRight, 
  Shield, 
  Github, 
  TrendingUp, 
  BarChart3, 
  CheckCircle, 
  Play,
  Rocket,
  Sparkles,
  Target,
  DollarSign,
  Users,
  Code,
  Star,
  MessageCircle,
  Crown
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted = () => {} }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Shield,
      title: 'IP Protection',
      description: 'Register your projects as intellectual property on the blockchain for permanent protection',
      color: 'text-primary',
      bgColor: 'bg-accent'
    },
    {
      icon: Github,
      title: 'GitHub Integration',
      description: 'Connect your GitHub repositories to showcase your technical expertise and code quality',
      color: 'text-primary',
      bgColor: 'bg-secondary'
    },
    {
      icon: TrendingUp,
      title: 'Investment Opportunities',
      description: 'Discover and invest in innovative projects from talented developers worldwide',
      color: 'text-primary',
      bgColor: 'bg-accent'
    },
    {
      icon: BarChart3,
      title: 'MCP Analytics',
      description: 'AI-powered insights using Machine Callable Programs for smart investment decisions',
      color: 'text-primary',
      bgColor: 'bg-secondary'
    }
  ];

  const stats = [
    { number: '500+', label: 'Registered Projects', icon: Code },
    { number: '$2.4M', label: 'Total Investment', icon: DollarSign },
    { number: '1,200+', label: 'Active Users', icon: Users },
    { number: '94%', label: 'Success Rate', icon: Target }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'AI Engineer',
      company: 'DataMind AI',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      quote: 'Seedora helped me protect my AI platform and connect with investors. The GitHub integration showcased my technical skills perfectly.',
      rating: 5
    },
    {
      name: 'James Park',
      role: 'Blockchain Developer',
      company: 'SecureChain Labs',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      quote: 'The IP registration process was seamless, and the MCP analytics gave me insights I never had before. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'FinTech Founder',
      company: 'PayFlow Technologies',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      quote: 'Found amazing investment opportunities through Seedora. The platform makes it easy to discover and evaluate innovative projects.',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Developer',
      price: 'Free',
      description: 'Perfect for individual developers',
      features: [
        'Register up to 3 projects',
        'Basic IP protection',
        'GitHub integration',
        'Community access'
      ],
      popular: false,
      color: 'border-light-border'
    },
    {
      name: 'Professional',
      price: '$29/month',
      description: 'For serious entrepreneurs',
      features: [
        'Unlimited project registration',
        'Advanced IP protection',
        'Priority support',
        'MCP analytics access',
        'Investment matching'
      ],
      popular: true,
      color: 'border-primary'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Everything in Professional',
        'Custom integrations',
        'Dedicated support',
        'White-label options',
        'Advanced analytics'
      ],
      popular: false,
      color: 'border-light-border'
    }
  ];

  return (
    <div className="min-h-screen bg-light-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-accent min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="neo-btn inline-flex items-center space-x-2 bg-white px-4 py-2">
                  <Sparkles size={16} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">Powered by Blockchain & AI</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  <span className="text-primary">
                    Seedora
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-text-secondary leading-relaxed max-w-2xl">
                  The ultimate platform for developers and investors. Register your IP, showcase your projects, and discover the next big innovation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="neo-btn flex items-center justify-center space-x-3 px-8 py-4 bg-primary text-white font-bold text-lg"
                >
                  <Rocket size={24} />
                  <span>Get Started Free</span>
                  <ArrowRight size={20} />
                </button>
                
                <button className="neo-btn flex items-center justify-center space-x-3 px-8 py-4 bg-white text-text-primary font-semibold text-lg">
                  <Play size={20} />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-text-muted">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Free forever plan</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="neo-card bg-white p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-text-primary">Live Platform Stats</h3>
                    <div className="flex items-center space-x-2 text-success">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Live</span>
                    </div>
                  </div>
                  
                  {/* Redesigned GIF Section */}
                  <div className="flex flex-col lg:flex-row items-center gap-8 mb-6">
                    {/* Larger GIF on the left */}
                    <div className="flex-shrink-0">
                      <img 
                        src="/Landing-nouns.gif" 
                        alt="Nouns DAO Style Animation" 
                        className="w-48 h-48 lg:w-56 lg:h-56 rounded-3xl"
                      />
                    </div>
                    
                    {/* Stats on the right */}
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                          <div key={index} className="text-center p-4 neo-card bg-accent hover:scale-105 transition-transform duration-300">
                            <stat.icon size={24} className="mx-auto mb-2 text-primary" />
                            <div className="text-2xl font-bold text-text-primary">{stat.number}</div>
                            <div className="text-sm text-text-muted">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="neo-card bg-accent p-4">
                    <div className="flex items-center space-x-3">
                      <MessageCircle size={20} className="text-primary" />
                      <div>
                        <p className="font-semibold text-text-primary">MCP Assistant Active</p>
                        <p className="text-sm text-text-secondary">AI-powered investment insights</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Everything you need to <span className="text-primary">succeed</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              From IP protection to investment opportunities, Seedora provides all the tools developers and investors need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`neo-card ${feature.bgColor} p-8 cursor-pointer group ${
                  activeFeature === index ? 'transform translate-x-[-2px] translate-y-[-2px]' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 bg-white border border-light-border rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon size={32} className={feature.color} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              How <span className="text-primary">Seedora</span> works
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="neo-btn w-20 h-20 bg-primary flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-4">Register & Connect</h3>
              <p className="text-text-secondary leading-relaxed">
                Sign up for free and connect your GitHub profile to showcase your technical expertise and repositories.
              </p>
            </div>

            <div className="text-center group">
              <div className="neo-btn w-20 h-20 bg-secondary flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-4">Protect Your IP</h3>
              <p className="text-text-secondary leading-relaxed">
                Register your projects as intellectual property on the blockchain for permanent, tamper-proof protection.
              </p>
            </div>

            <div className="text-center group">
              <div className="neo-btn w-20 h-20 bg-accent flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-4">Invest & Grow</h3>
              <p className="text-text-secondary leading-relaxed">
                Discover investment opportunities or attract investors to your projects using our AI-powered matching system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Loved by <span className="text-primary">developers</span> worldwide
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              See what our community has to say about their experience with Seedora
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="neo-card bg-white p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-warning fill-current" />
                  ))}
                </div>
                
                <p className="text-text-secondary mb-6 leading-relaxed">"{testimonial.quote}"</p>
                
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-primary"
                  />
                  <div>
                    <h4 className="font-semibold text-text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-text-muted">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Simple, <span className="text-primary">transparent</span> pricing
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Choose the plan that's right for you. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative neo-card bg-white p-8 border-2 ${plan.color} ${plan.popular ? 'transform translate-x-[-4px] translate-y-[-4px]' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="neo-btn bg-secondary text-white px-4 py-2 text-sm font-bold flex items-center space-x-2">
                      <Crown size={16} />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                  <p className="text-text-muted mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-text-primary">{plan.price}</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle size={16} className="text-success flex-shrink-0" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`neo-btn w-full py-3 font-semibold ${
                    plan.popular
                      ? 'bg-primary text-white'
                      : 'bg-white border border-light-border text-text-primary'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to protect your innovations?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust Seedora to protect their intellectual property and connect with investors.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="neo-btn flex items-center justify-center space-x-3 px-8 py-4 bg-white text-primary font-bold text-lg"
            >
              <Rocket size={24} />
              <span>Start Building Today</span>
              <ArrowRight size={20} />
            </button>
            
            <button className="neo-btn flex items-center justify-center space-x-3 px-8 py-4 bg-secondary text-white font-semibold text-lg">
              <MessageCircle size={20} />
              <span>Talk to Sales</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">
                <span className="text-white">Seedora</span>
              </h3>
              <p className="text-white/80 leading-relaxed">
                The ultimate platform for developers and investors to protect IP and discover innovations.
              </p>
              <div className="flex items-center space-x-4">
                <Github size={20} className="text-white/60 hover:text-white cursor-pointer transition-colors" />
                <MessageCircle size={20} className="text-white/60 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2024 Seedora. All rights reserved. Built with ❤️ for developers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;