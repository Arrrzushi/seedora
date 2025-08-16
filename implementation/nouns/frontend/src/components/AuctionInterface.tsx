import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { AuctionHouse__factory, TestNFT__factory } from '../typechain-types';

interface Auction {
  tokenId: number;
  amount: string;
  startTime: number;
  endTime: number;
  bidder: string;
  settled: boolean;
  reservePrice: string;
}

const AuctionInterface: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [auctionContract, setAuctionContract] = useState<ethers.Contract | null>(null);
  const [currentAuction, setCurrentAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        const signer = web3Provider.getSigner();
        const auctionHouse = AuctionHouse__factory.connect(
          'YOUR_AUCTION_HOUSE_ADDRESS',
          signer
        );
        setAuctionContract(auctionHouse);

        // Load current auction
        await loadCurrentAuction();
      } else {
        setError('Please install MetaMask!');
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (currentAuction) {
      const timer = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const end = currentAuction.endTime;
        if (now >= end) {
          setTimeLeft('Auction ended');
        } else {
          const diff = end - now;
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentAuction]);

  const loadCurrentAuction = async () => {
    if (!auctionContract) return;

    try {
      const auction = await auctionContract.auctions(0); // Get first auction
      setCurrentAuction({
        tokenId: auction.tokenId.toNumber(),
        amount: ethers.utils.formatEther(auction.amount),
        startTime: auction.startTime.toNumber(),
        endTime: auction.endTime.toNumber(),
        bidder: auction.bidder,
        settled: auction.settled,
        reservePrice: ethers.utils.formatEther(auction.reservePrice)
      });
    } catch (err) {
      setError('Error loading auction');
      console.error(err);
    }
  };

  const placeBid = async () => {
    if (!auctionContract || !currentAuction || !bidAmount) return;

    try {
      const tx = await auctionContract.createBid(currentAuction.tokenId, {
        value: ethers.utils.parseEther(bidAmount)
      });
      await tx.wait();
      await loadCurrentAuction();
      setBidAmount('');
    } catch (err) {
      setError('Error placing bid');
      console.error(err);
    }
  };

  const settleAuction = async () => {
    if (!auctionContract || !currentAuction) return;

    try {
      const tx = await auctionContract.settleAuction(currentAuction.tokenId);
      await tx.wait();
      await loadCurrentAuction();
    } catch (err) {
      setError('Error settling auction');
      console.error(err);
    }
  };

  if (!provider) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nouns Auction House</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {currentAuction && (
        <div className="bg-white shadow rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Current Auction</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Token ID</p>
              <p className="font-medium">{currentAuction.tokenId}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Current Bid</p>
              <p className="font-medium">{currentAuction.amount} ETH</p>
            </div>
            
            <div>
              <p className="text-gray-600">Time Remaining</p>
              <p className="font-medium">{timeLeft}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Reserve Price</p>
              <p className="font-medium">{currentAuction.reservePrice} ETH</p>
            </div>
          </div>

          {!currentAuction.settled && (
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Amount (ETH)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={currentAuction.reservePrice}
                  step="0.01"
                />
              </div>
              
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={placeBid}
              >
                Place Bid
              </button>
              
              {timeLeft === 'Auction ended' && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={settleAuction}
                >
                  Settle Auction
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuctionInterface; 