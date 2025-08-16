import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AuctionHouse, TestNFT } from "../typechain-types";

describe("AuctionHouse", function () {
    let auctionHouse: AuctionHouse;
    let testNFT: TestNFT;
    let owner: SignerWithAddress;
    let bidder1: SignerWithAddress;
    let bidder2: SignerWithAddress;

    const TIME_BUFFER = 900; // 15 minutes
    const RESERVE_PRICE = ethers.utils.parseEther("0.1");
    const MIN_BID_INCREMENT = 5; // 5%
    const DURATION = 86400; // 24 hours

    beforeEach(async function () {
        [owner, bidder1, bidder2] = await ethers.getSigners();

        // Deploy TestNFT
        const TestNFT = await ethers.getContractFactory("TestNFT");
        testNFT = await TestNFT.deploy();
        await testNFT.deployed();

        // Deploy AuctionHouse
        const AuctionHouse = await ethers.getContractFactory("AuctionHouse");
        auctionHouse = await AuctionHouse.deploy(
            testNFT.address,
            TIME_BUFFER,
            RESERVE_PRICE,
            MIN_BID_INCREMENT,
            DURATION
        );
        await auctionHouse.deployed();

        // Mint NFT and approve AuctionHouse
        await testNFT.mint(auctionHouse.address);
        await testNFT.setApprovalForAll(auctionHouse.address, true);
    });

    describe("Auction Creation", function () {
        it("Should create an auction", async function () {
            await auctionHouse.createAuction(0, 0);
            const auction = await auctionHouse.auctions(0);
            
            expect(auction.tokenId).to.equal(0);
            expect(auction.amount).to.equal(0);
            expect(auction.settled).to.equal(false);
            expect(auction.reservePrice).to.equal(RESERVE_PRICE);
        });
    });

    describe("Bidding", function () {
        beforeEach(async function () {
            await auctionHouse.createAuction(0, 0);
        });

        it("Should accept a valid bid", async function () {
            const bidAmount = RESERVE_PRICE.mul(2);
            await auctionHouse.connect(bidder1).createBid(0, { value: bidAmount });
            
            const auction = await auctionHouse.auctions(0);
            expect(auction.amount).to.equal(bidAmount);
            expect(auction.bidder).to.equal(bidder1.address);
        });

        it("Should refund previous bidder", async function () {
            const bid1Amount = RESERVE_PRICE.mul(2);
            const bid2Amount = RESERVE_PRICE.mul(3);
            
            await auctionHouse.connect(bidder1).createBid(0, { value: bid1Amount });
            
            const balanceBefore = await bidder1.getBalance();
            await auctionHouse.connect(bidder2).createBid(0, { value: bid2Amount });
            const balanceAfter = await bidder1.getBalance();
            
            expect(balanceAfter.sub(balanceBefore)).to.equal(bid1Amount);
        });

        it("Should extend auction on last-minute bid", async function () {
            await ethers.provider.send("evm_increaseTime", [DURATION - TIME_BUFFER / 2]);
            
            const bidAmount = RESERVE_PRICE.mul(2);
            await auctionHouse.connect(bidder1).createBid(0, { value: bidAmount });
            
            const auction = await auctionHouse.auctions(0);
            expect(auction.endTime).to.be.gt(auction.startTime.add(DURATION));
        });
    });

    describe("Settlement", function () {
        beforeEach(async function () {
            await auctionHouse.createAuction(0, 0);
            await auctionHouse.connect(bidder1).createBid(0, { value: RESERVE_PRICE.mul(2) });
        });

        it("Should settle auction and transfer NFT", async function () {
            await ethers.provider.send("evm_increaseTime", [DURATION]);
            await auctionHouse.settleAuction(0);
            
            expect(await testNFT.ownerOf(0)).to.equal(bidder1.address);
        });

        it("Should update TWAP after settlement", async function () {
            await ethers.provider.send("evm_increaseTime", [DURATION]);
            await auctionHouse.settleAuction(0);
            
            const twap = await auctionHouse.getTWAP(0);
            expect(twap).to.be.gt(0);
        });
    });

    describe("Admin Functions", function () {
        it("Should update time buffer", async function () {
            const newTimeBuffer = 1800;
            await auctionHouse.setTimeBuffer(newTimeBuffer);
            expect(await auctionHouse.timeBuffer()).to.equal(newTimeBuffer);
        });

        it("Should update reserve price", async function () {
            const newReservePrice = ethers.utils.parseEther("0.2");
            await auctionHouse.setDefaultReservePrice(newReservePrice);
            expect(await auctionHouse.defaultReservePrice()).to.equal(newReservePrice);
        });

        it("Should pause and unpause", async function () {
            await auctionHouse.pause();
            expect(await auctionHouse.paused()).to.be.true;
            
            await auctionHouse.unpause();
            expect(await auctionHouse.paused()).to.be.false;
        });
    });
}); 