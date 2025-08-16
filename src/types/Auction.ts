export interface Auction {
  id: string;
  projectId: string;
  currentBid: number;
  highestBidder: string;
  endTime: Date;
  minBidIncrement: number;
  settled: boolean;
}

declare global {
  interface Window {
    ethereum?: any;
  }
} 