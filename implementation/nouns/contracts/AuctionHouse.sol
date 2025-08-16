// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @title Auction House
 * @notice This contract manages auctions for NFTs with advanced features
 */
contract AuctionHouse is Pausable, ReentrancyGuard, Ownable, IERC721Receiver {
    // Auction struct to hold auction data
    struct Auction {
        uint256 tokenId;
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        address payable bidder;
        bool settled;
        uint256 reservePrice;
        uint256 minBidIncrementPercentage;
    }

    // Events
    event AuctionCreated(uint256 tokenId, uint256 startTime, uint256 endTime, uint256 reservePrice);
    event AuctionBid(uint256 tokenId, address sender, uint256 value, bool extended);
    event AuctionExtended(uint256 tokenId, uint256 endTime);
    event AuctionSettled(uint256 tokenId, address winner, uint256 amount);
    event AuctionTimeBufferUpdated(uint256 timeBuffer);
    event AuctionMinBidIncrementUpdated(uint256 minBidIncrement);
    event AuctionReservePriceUpdated(uint256 reservePrice);

    // The NFT token contract
    IERC721 public nftContract;
    
    // The minimum amount of time left in an auction after a new bid is created
    uint256 public timeBuffer;

    // The minimum price accepted in an auction
    uint256 public defaultReservePrice;

    // The minimum percentage difference between the last bid amount and the current bid
    uint256 public defaultMinBidIncrementPercentage;

    // The duration of a single auction
    uint256 public duration;

    // Mapping from token ID to their respective auction
    mapping(uint256 => Auction) public auctions;

    // Time-weighted average price tracking
    mapping(uint256 => uint256) public twapPrices;
    uint256 public twapPeriod = 7 days;

    constructor(
        address _nftContract,
        uint256 _timeBuffer,
        uint256 _reservePrice,
        uint256 _minBidIncrementPercentage,
        uint256 _duration
    ) {
        require(_nftContract != address(0), "Invalid NFT contract");
        nftContract = IERC721(_nftContract);
        timeBuffer = _timeBuffer;
        defaultReservePrice = _reservePrice;
        defaultMinBidIncrementPercentage = _minBidIncrementPercentage;
        duration = _duration;
    }

    /**
     * @notice Create a new auction for a token
     * @param tokenId The ID of the token to create an auction for
     * @param customReservePrice Optional custom reserve price (0 for default)
     */
    function createAuction(uint256 tokenId, uint256 customReservePrice) external onlyOwner {
        require(nftContract.ownerOf(tokenId) == address(this), "NFT not owned by auction house");
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;
        uint256 reservePrice = customReservePrice > 0 ? customReservePrice : defaultReservePrice;

        auctions[tokenId] = Auction({
            tokenId: tokenId,
            amount: 0,
            startTime: startTime,
            endTime: endTime,
            bidder: payable(address(0)),
            settled: false,
            reservePrice: reservePrice,
            minBidIncrementPercentage: defaultMinBidIncrementPercentage
        });

        emit AuctionCreated(tokenId, startTime, endTime, reservePrice);
    }

    /**
     * @notice Create a bid for a token
     * @param tokenId The ID of the token to bid on
     */
    function createBid(uint256 tokenId) external payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.startTime != 0, "Auction doesn't exist");
        require(!auction.settled, "Auction already settled");
        require(block.timestamp < auction.endTime, "Auction expired");
        require(msg.value >= auction.reservePrice, "Must send at least reserve price");
        
        if (auction.amount > 0) {
            require(
                msg.value >= auction.amount + ((auction.amount * auction.minBidIncrementPercentage) / 100),
                "Must send more than last bid by minBidIncrementPercentage"
            );
        }

        // Refund the last bidder
        if (auction.bidder != address(0)) {
            _safeTransferETH(auction.bidder, auction.amount);
        }

        auction.amount = msg.value;
        auction.bidder = payable(msg.sender);

        // Extend auction if bid is placed near the end
        bool extended = auction.endTime - block.timestamp < timeBuffer;
        if (extended) {
            auction.endTime = block.timestamp + timeBuffer;
        }

        emit AuctionBid(tokenId, msg.sender, msg.value, extended);
        if (extended) {
            emit AuctionExtended(tokenId, auction.endTime);
        }
    }

    /**
     * @notice Settle an auction
     * @param tokenId The ID of the token to settle the auction for
     */
    function settleAuction(uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.startTime != 0, "Auction doesn't exist");
        require(!auction.settled, "Auction already settled");
        require(block.timestamp >= auction.endTime, "Auction hasn't completed");

        auction.settled = true;

        // Update TWAP
        twapPrices[tokenId] = (twapPrices[tokenId] * (block.timestamp - auction.startTime) + auction.amount) / twapPeriod;

        if (auction.bidder != address(0)) {
            // Transfer NFT to winner
            nftContract.transferFrom(address(this), auction.bidder, tokenId);
            
            // Transfer funds to owner
            _safeTransferETH(owner(), auction.amount);
        }

        emit AuctionSettled(tokenId, auction.bidder, auction.amount);
    }

    /**
     * @notice Get the current price of an active auction
     * @param tokenId The ID of the token to get the current price for
     */
    function getCurrentPrice(uint256 tokenId) external view returns (uint256) {
        Auction storage auction = auctions[tokenId];
        require(auction.startTime != 0, "Auction doesn't exist");
        require(!auction.settled, "Auction already settled");
        return auction.amount;
    }

    /**
     * @notice Get the time-weighted average price for a token
     * @param tokenId The ID of the token to get the TWAP for
     */
    function getTWAP(uint256 tokenId) external view returns (uint256) {
        return twapPrices[tokenId];
    }

    // Admin functions
    function setTimeBuffer(uint256 _timeBuffer) external onlyOwner {
        timeBuffer = _timeBuffer;
        emit AuctionTimeBufferUpdated(_timeBuffer);
    }

    function setDefaultReservePrice(uint256 _reservePrice) external onlyOwner {
        defaultReservePrice = _reservePrice;
        emit AuctionReservePriceUpdated(_reservePrice);
    }

    function setDefaultMinBidIncrementPercentage(uint256 _minBidIncrementPercentage) external onlyOwner {
        defaultMinBidIncrementPercentage = _minBidIncrementPercentage;
        emit AuctionMinBidIncrementUpdated(_minBidIncrementPercentage);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Handle the receipt of an NFT
     * @param operator The address which called `safeTransferFrom` function
     * @param from The address which previously owned the token
     * @param tokenId The NFT identifier which is being transferred
     * @param data Additional data with no specified format
     * @return bytes4 `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // Internal helper functions
    function _safeTransferETH(address to, uint256 value) internal returns (bool) {
        (bool success, ) = to.call{ value: value }("");
        return success;
    }
} 