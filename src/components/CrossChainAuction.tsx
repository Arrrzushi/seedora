import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import * as fcl from '@onflow/fcl';
import AuctionHouse from '../../implementation/nouns/artifacts/contracts/AuctionHouse.sol/AuctionHouse.json';
import { AUCTION_HOUSE_ADDRESS } from '../config';

interface Auction {
  tokenId: string;
  amount: string;
  startTime: number;
  endTime: number;
  bidder: string;
  settled: boolean;
}

interface PendingBid {
  projectId: string;
  bidder: string;
  amount: string;
  timestamp: number;
  processed: boolean;
  ethTxHash: string | null;
}

export const CrossChainAuction: React.FC = () => {
  const [currentAuction, setCurrentAuction] = useState<Auction | null>(null);
  const [pendingBids, setPendingBids] = useState<PendingBid[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch pending bids from Flow
  const fetchPendingBids = async () => {
    try {
      const result = await fcl.query({
        cadence: `
          import NounsAuctionBridge from 0xd0963316d56da678

          access(all) fun main(projectId: UInt64): [NounsAuctionBridge.PendingBid] {
            let bridge = getAccount(0xd0963316d56da678)
              .capabilities
              .borrow<&NounsAuctionBridge.Bridge>(NounsAuctionBridge.BridgePublicPath)
              ?? panic("Could not borrow bridge reference")

            return bridge.getPendingBids(projectId: projectId)
          }
        `,
        args: (arg: any, t: any) => [arg(0, t.UInt64)],
      });
      setPendingBids(result);
    } catch (err) {
      console.error('Error fetching pending bids:', err);
      setError('Failed to fetch pending bids');
    }
  };

  // Place bid through Flow bridge
  const placeBridgeBid = async () => {
    try {
      setLoading(true);
      setError('');

      // Format bid amount to ensure it has 8 decimal places for UFix64
      const formattedBidAmount = parseFloat(bidAmount).toFixed(8);

      const transactionId = await fcl.mutate({
        cadence: `
          import FungibleToken from 0x9a0766d93b6608b7
          import NounsAuctionBridge from 0xd0963316d56da678

          transaction(projectId: UInt64, amount: UFix64) {
            prepare(signer: AuthAccount) {
              let bridgeRef = getAccount(0xd0963316d56da678)
                .capabilities
                .borrow<&NounsAuctionBridge.Bridge>(NounsAuctionBridge.BridgePublicPath)
                ?? panic("Could not borrow bridge reference")

              let vaultRef = signer
                .storage
                .borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
                ?? panic("Could not borrow Flow token vault reference")

              let payment <- vaultRef.withdraw(amount: amount)
              let bridgeReceiver = getAccount(0xd0963316d56da678)
                .capabilities
                .borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                ?? panic("Could not borrow receiver reference")

              bridgeReceiver.deposit(from: <-payment)
              bridgeRef.placeBid(projectId: projectId, amount: amount, bidder: signer.address)
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(0, t.UInt64), // projectId
          arg(formattedBidAmount, t.UFix64), // amount with proper decimal formatting
        ],
        limit: 9999,
      });

      await fcl.tx(transactionId).onceSealed();
      await fetchPendingBids();
      setBidAmount('');
    } catch (err) {
      console.error('Error placing bid:', err);
      setError('Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuction = async () => {
      try {
        // Initialize providers for different chains
        const ethereumProvider = new ethers.BrowserProvider(window.ethereum);
        
        // Initialize auction house contract
        const auctionHouse = new ethers.Contract(
          AUCTION_HOUSE_ADDRESS,
          AuctionHouse.abi,
          ethereumProvider
        );

        // Load current auction
        const currentAuction = await auctionHouse.auction();
        setCurrentAuction({
          tokenId: currentAuction.nounId.toString(),
          amount: ethers.formatEther(currentAuction.amount),
          startTime: currentAuction.startTime * 1000,
          endTime: currentAuction.endTime * 1000,
          bidder: currentAuction.bidder,
          settled: currentAuction.settled
        });

      } catch (error) {
        console.error('Error initializing auction:', error);
      }
    };

    if (window.ethereum) {
      initializeAuction();
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Cross-Chain Nouns Auction
        </h2>

        {/* Current Auction */}
        {currentAuction && (
          <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Current Auction
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Current Bid</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {currentAuction.amount} ETH
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Time Remaining</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {Math.max(0, Math.floor((currentAuction.endTime - Date.now() / 1000) / 60))} minutes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Place Bid Form */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Place Bid (FLOW)
          </h3>
          <div className="flex gap-4">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount in FLOW"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={placeBridgeBid}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Pending Bids */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Your Pending Bids
          </h3>
          <div className="space-y-4">
            {pendingBids.map((bid, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Amount</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {bid.amount} FLOW
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Status</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {bid.processed ? 'Processed' : 'Pending'}
                    </p>
                  </div>
                </div>
                {bid.ethTxHash && (
                  <a
                    href={`https://etherscan.io/tx/${bid.ethTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View on Etherscan
                  </a>
                )}
              </div>
            ))}
            {pendingBids.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400">No pending bids</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 