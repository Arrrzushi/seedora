import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  Loader2, 
  Database, 
  ChevronUp,
  Minimize2,
  X
} from 'lucide-react';
import { demoProjects, getTrendingProjects } from '../data/demoProjects';

interface MCPMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
  suggestions?: string[];
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

interface MCPAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onInsightGenerated?: (insight: MCPInsight) => void;
}

const MCPAssistant: React.FC<MCPAssistantProps> = ({ 
  isOpen, 
  onClose, 
  onInsightGenerated 
}) => {
  const [messages, setMessages] = useState<MCPMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize MCP assistant
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: MCPMessage = {
        id: 'welcome',
        type: 'assistant',
        content: "👋 Hello! I'm your MCP-powered investment assistant. I can analyze market trends, evaluate projects, assess risks, and provide personalized investment recommendations. What would you like to explore?",
        timestamp: new Date(),
        suggestions: [
          "Analyze trending projects",
          "Show market opportunities", 
          "Evaluate investment risks",
          "Compare project categories",
          "Find undervalued projects"
        ]
      };
      setMessages([welcomeMessage]);
      
      // Simulate connecting to MCP nodes
      setActiveNodes(['market-data', 'project-analyzer', 'risk-assessor', 'trend-predictor']);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate MCP data processing
  const processMCPRequest = async (query: string): Promise<MCPMessage> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    const lowerQuery = query.toLowerCase();
    
    // Market analysis
    if (lowerQuery.includes('trend') || lowerQuery.includes('market')) {
      const trendingProjects = getTrendingProjects(5);
      const insight: MCPInsight = {
        id: `insight-${Date.now()}`,
        title: 'Market Trend Analysis',
        description: 'AI/ML and Gaming projects showing strongest growth momentum',
        type: 'market',
        confidence: 0.87,
        data: { trendingProjects, growth: '+23.4%' },
        timestamp: new Date()
      };
      
      onInsightGenerated?.(insight);
      
      return {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        content: `📊 **Market Trend Analysis Complete**

Based on real-time data from multiple MCP nodes, here are the key trends:

**🔥 Hottest Categories:**
• AI/ML projects: +34% interest this week
• Gaming/Metaverse: +28% investor engagement  
• FinTech: +19% funding activity

**📈 Top Performing Projects:**
${trendingProjects.slice(0, 3).map((p, i) => `${i + 1}. ${p.title} - ${p.likes_count} likes`).join('\n')}

**💡 Key Insight:** Projects with AI integration are receiving 2.3x more investor attention than traditional solutions.`,
        timestamp: new Date(),
        data: { trendingProjects },
        suggestions: [
          "Show AI project details",
          "Compare category performance", 
          "Analyze risk factors"
        ]
      };
    }
    
    // Investment opportunities
    if (lowerQuery.includes('opportunit') || lowerQuery.includes('invest')) {
      const undervaluedProjects = demoProjects
        .filter(p => p.price < 30 && p.likes_count > 100)
        .sort((a, b) => (b.likes_count / b.price) - (a.likes_count / a.price))
        .slice(0, 3);
        
      const insight: MCPInsight = {
        id: `insight-${Date.now()}`,
        title: 'Investment Opportunities',
        description: 'High-potential projects with attractive valuations identified',
        type: 'opportunity',
        confidence: 0.92,
        data: { undervaluedProjects, roi_potential: '+156%' },
        timestamp: new Date()
      };
      
      onInsightGenerated?.(insight);
      
      return {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        content: `🎯 **Investment Opportunities Identified**

MCP analysis reveals several high-potential, undervalued projects:

**💎 Best Value Picks:**
${undervaluedProjects.map((p, i) => `${i + 1}. **${p.title}** - $${p.price} (${p.likes_count} likes)
   ROI Potential: ${Math.floor(Math.random() * 50 + 100)}%`).join('\n\n')}

**🔍 Analysis Factors:**
• Community engagement vs. price ratio
• Founder track record
• Market timing
• Technical innovation score

**⚡ Recommendation:** Consider diversifying across AI/ML and EdTech for optimal risk-adjusted returns.`,
        timestamp: new Date(),
        data: { opportunities: undervaluedProjects },
        suggestions: [
          "Analyze specific project",
          "Show risk assessment",
          "Compare with portfolio"
        ]
      };
    }
    
    // Risk assessment
    if (lowerQuery.includes('risk') || lowerQuery.includes('safe')) {
      const insight: MCPInsight = {
        id: `insight-${Date.now()}`,
        title: 'Risk Assessment',
        description: 'Portfolio risk analysis with diversification recommendations',
        type: 'risk',
        confidence: 0.89,
        data: { risk_score: 'Medium', diversification: 'Recommended' },
        timestamp: new Date()
      };
      
      onInsightGenerated?.(insight);
      
      return {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        content: `🛡️ **Risk Assessment Report**

**Overall Risk Level: MEDIUM** ⚠️

**Risk Factors Analysis:**
• **Market Volatility:** 15% (Normal for tech sector)
• **Founder Risk:** 8% (Strong track records)
• **Technology Risk:** 12% (Emerging tech adoption)
• **Regulatory Risk:** 6% (Stable environment)

**🎯 Diversification Recommendations:**
• 40% Established categories (FinTech, HealthTech)
• 35% Growth sectors (AI/ML, Blockchain)
• 25% Emerging opportunities (Gaming, IoT)

**📊 Risk Mitigation Strategies:**
1. Spread investments across 5+ projects
2. Focus on projects with working demos
3. Prioritize verified founders
4. Monitor market sentiment weekly`,
        timestamp: new Date(),
        suggestions: [
          "Show portfolio optimization",
          "Analyze specific risks",
          "Get safety recommendations"
        ]
      };
    }
    
    // Project comparison
    if (lowerQuery.includes('compar') || lowerQuery.includes('vs')) {
      const topProjects = getTrendingProjects(3);
      
      return {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        content: `⚖️ **Project Comparison Analysis**

**Head-to-Head Comparison of Top 3 Projects:**

${topProjects.map((p, i) => `**${i + 1}. ${p.title}**
💰 Price: $${p.price}
❤️ Community: ${p.likes_count} likes
👀 Interest: ${p.views_count} views
🏢 Category: ${p.category}
📊 Value Score: ${Math.floor((p.likes_count / p.price) * 10)}/100`).join('\n\n')}

**🎯 MCP Recommendation:**
Based on community engagement, technical merit, and market timing, **${topProjects[0].title}** shows the strongest investment potential with a 94% confidence score.

**📈 Key Differentiators:**
• Highest community engagement
• Proven market demand
• Strong founder background
• Clear monetization strategy`,
        timestamp: new Date(),
        data: { comparison: topProjects },
        suggestions: [
          "Deep dive on winner",
          "Show technical analysis",
          "Calculate ROI projections"
        ]
      };
    }
    
    // Default response
    return {
      id: `msg-${Date.now()}`,
      type: 'assistant',
      content: `🤖 **MCP Analysis in Progress...**

I'm processing your request through multiple data nodes:
• Market sentiment analysis
• Project evaluation algorithms  
• Risk assessment models
• Trend prediction engines

Could you be more specific about what you'd like to analyze? I can help with:
• Market trends and opportunities
• Project comparisons and evaluations
• Risk assessments and portfolio optimization
• Investment recommendations and strategies`,
      timestamp: new Date(),
      suggestions: [
        "Analyze market trends",
        "Find investment opportunities", 
        "Assess portfolio risks",
        "Compare top projects"
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: MCPMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await processMCPRequest(inputMessage);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      const errorMessage: MCPMessage = {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        content: "I apologize, but I'm experiencing connectivity issues with the MCP network. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="neo-card bg-white h-full flex flex-col">
        {/* Header */}
        <div className="bg-primary p-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold">MCP Assistant</h3>
                <div className="flex items-center space-x-2 text-xs text-white/80">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span>{activeNodes.length} nodes active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors duration-300"
              >
                {isMinimized ? <ChevronUp size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded transition-colors duration-300"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* MCP Status */}
            <div className="p-3 bg-light-bg border-b border-light-border flex-shrink-0">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Database size={12} className="text-primary" />
                  <span className="text-text-muted">MCP Network Status</span>
                </div>
                <div className="flex items-center space-x-1">
                  {activeNodes.map((node, index) => (
                    <div key={node} className="w-2 h-2 bg-success rounded-full animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}></div>
                  ))}
                </div>
              </div>
              <div className="mt-1 text-xs text-text-secondary">
                Connected to: {activeNodes.join(', ')}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    message.type === 'user' 
                      ? 'neo-btn bg-primary text-white' 
                      : 'neo-card bg-light-bg'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.type === 'assistant' && (
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot size={12} className="text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        {message.suggestions && (
                          <div className="mt-3 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs px-2 py-1 bg-primary/10 hover:bg-primary/20 rounded text-primary transition-colors duration-300"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="neo-card bg-light-bg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bot size={12} className="text-primary" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <Loader2 size={14} className="animate-spin text-primary" />
                        <span className="text-sm text-text-secondary">Analyzing data...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-light-border flex-shrink-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about investments, trends, or risks..."
                  className="flex-1 px-3 py-2 border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="neo-btn p-2 bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MCPAssistant;