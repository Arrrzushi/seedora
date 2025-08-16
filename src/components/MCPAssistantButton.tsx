import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import MCPAssistant from './MCPAssistant';

interface MCPAssistantButtonProps {
  onInsightGenerated?: (insight: any) => void;
}

const MCPAssistantButton: React.FC<MCPAssistantButtonProps> = ({ onInsightGenerated }) => {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={() => setShowAssistant(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 neo-btn bg-primary rounded-full flex items-center justify-center group"
        aria-label="Open MCP Assistant"
      >
        <MessageCircle size={28} className="text-white group-hover:scale-110 transition-transform duration-300" />
        
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* MCP Assistant Modal */}
      {showAssistant && (
        <MCPAssistant
          isOpen={showAssistant}
          onClose={() => setShowAssistant(false)}
          onInsightGenerated={onInsightGenerated}
        />
      )}
    </>
  );
};

export default MCPAssistantButton;