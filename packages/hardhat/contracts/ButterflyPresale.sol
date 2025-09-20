// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ButterflyPresale is ERC721Enumerable, Ownable, ReentrancyGuard {
    struct Reservation {
        address buyer;
        uint96 pricePaid;
        uint64 reservedAt;
        bool fulfilled;
    }

    uint256 public immutable maxSupply;
    uint256 public immutable mintPrice;
    string private baseTokenURI;
    address public treasury;
    uint256 public totalReservations;

    mapping(uint256 => Reservation) private _reservations;

    event ReservationCreated(address indexed buyer, uint256 indexed tokenId, uint256 value);
    event ReservationFulfilled(address indexed buyer, uint256 indexed tokenId);
    event TreasuryUpdated(address indexed treasury);
    event BaseURIUpdated(string newBaseURI);
    event FundsWithdrawn(address indexed to, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseTokenURI_,
        uint256 maxSupply_,
        uint256 mintPrice_,
        address treasury_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        require(maxSupply_ > 0, "Max supply zero");
        require(treasury_ != address(0), "Treasury zero address");

        baseTokenURI = baseTokenURI_;
        maxSupply = maxSupply_;
        mintPrice = mintPrice_;
        treasury = treasury_;
    }

    function reserve(uint256 tokenId) external payable nonReentrant {
        require(tokenId >= 1 && tokenId <= maxSupply, "Invalid tokenId");
        require(msg.value == mintPrice, "Incorrect payment");
        require(!_exists(tokenId), "Token already minted");

        Reservation storage reservationData = _reservations[tokenId];
        require(reservationData.buyer == address(0), "Token already reserved");

        reservationData.buyer = msg.sender;
        reservationData.pricePaid = uint96(msg.value);
        reservationData.reservedAt = uint64(block.timestamp);

        totalReservations += 1;

        emit ReservationCreated(msg.sender, tokenId, msg.value);
    }

    function fulfillReservation(uint256 tokenId) external onlyOwner nonReentrant {
        Reservation storage reservationData = _reservations[tokenId];
        address buyer = reservationData.buyer;

        require(buyer != address(0), "Reservation missing");
        require(!reservationData.fulfilled, "Already fulfilled");
        require(!_exists(tokenId), "Token already minted");
        require(totalSupply() < maxSupply, "Max supply reached");

        reservationData.fulfilled = true;
        _safeMint(buyer, tokenId);

        emit ReservationFulfilled(buyer, tokenId);
    }

    function reservation(uint256 tokenId) external view returns (Reservation memory) {
        return _reservations[tokenId];
    }

    function isReserved(uint256 tokenId) external view returns (bool) {
        return _reservations[tokenId].buyer != address(0);
    }

    function isFulfilled(uint256 tokenId) external view returns (bool) {
        return _reservations[tokenId].fulfilled;
    }

    function setBaseTokenURI(string calldata newBaseTokenURI) external onlyOwner {
        baseTokenURI = newBaseTokenURI;
        emit BaseURIUpdated(newBaseTokenURI);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Treasury zero address");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function withdraw(address payable recipient) external onlyOwner nonReentrant {
        address payable to = recipient;
        if (to == address(0)) {
            to = payable(treasury);
        }

        require(to != address(0), "Recipient zero address");

        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = to.call{value: balance}("");
        require(success, "Withdraw failed");

        emit FundsWithdrawn(to, balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
}
