// contracts/ContentPlatform.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ContentPlatform is ReentrancyGuard {
    using Counters for Counters.Counter;

    address public owner;

    // Counters for user profiles and content IDs
    Counters.Counter private profileIds;
    Counters.Counter private contentIds;

    // Fees and percentages (specified in wei)
    uint256 public postingFee = 200000000000000; // 0.0001 ether in wei
    uint256 public accessFee = 100000000000000;  // 0.0002 ether in wei
    uint256 public postingFeePlatformShare = 80; // 80% to platform (contract balance)
    uint256 public accessFeePlatformShare = 10;  // 10% to platform (contract balance)

    // Structures for profiles and content
    struct Profile {
        uint256 id;
        string username;
        string bio;
        address owner;
    }

    struct Content {
        uint256 id;
        string title;
        string body;
        address payable creator;
        uint256 price;
    }

    mapping(address => Profile) public profiles;
    mapping(uint256 => Content) public contents;
    mapping(uint256 => mapping(address => bool)) public contentAccess;

    event ProfileCreated(uint256 indexed profileId, address indexed owner);
    event ContentPosted(uint256 indexed contentId, address indexed creator);
    event ContentAccessed(uint256 indexed contentId, address indexed user);
    event Tipped(address indexed creator, address indexed tipper, uint256 amount);

    // Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Modifier to check if the caller has a profile
    modifier hasProfile() {
        require(bytes(profiles[msg.sender].username).length > 0, "Profile does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to create a user profile
    function createProfile(
        string memory _username,
        string memory _bio
    ) public {
        require(bytes(_username).length > 0, "Username is required");
        require(bytes(profiles[msg.sender].username).length == 0, "Profile already exists");

        profileIds.increment();
        uint256 newProfileId = profileIds.current();

        profiles[msg.sender] = Profile({
            id: newProfileId,
            username: _username,
            bio: _bio,
            owner: msg.sender
        });

        emit ProfileCreated(newProfileId, msg.sender);
    }

    // Function for creators to post content
    function postContent(
        string memory _title,
        string memory _body,
        uint256 _price
    ) public payable hasProfile nonReentrant {
        require(msg.value >= postingFee, "Insufficient posting fee");
        require(bytes(_title).length > 0, "Title is required");
        require(bytes(_body).length > 0, "Content body is required");

        // Calculate platform share and creator share
        uint256 platformShare = (msg.value * postingFeePlatformShare) / 100;
        uint256 creatorShare = msg.value - platformShare;


        // Transfer remaining to creator (if any)
        if (creatorShare > 0) {
            (bool sentToCreator, ) = msg.sender.call{value: creatorShare}("");
            require(sentToCreator, "Failed to send fee to creator");
        }

        contentIds.increment();
        uint256 newContentId = contentIds.current();

        contents[newContentId] = Content({
            id: newContentId,
            title: _title,
            body: _body,
            creator: payable(msg.sender),
            price: _price
        });

        emit ContentPosted(newContentId, msg.sender);
    }

    // Function for users to access premium content
    function accessContent(uint256 _contentId) public payable nonReentrant {
        Content storage content = contents[_contentId];
        require(content.id != 0, "Content does not exist");
        require(msg.value >= content.price, "Insufficient access fee");
        require(!contentAccess[_contentId][msg.sender], "Already purchased");

        // Calculate platform share and creator share
        uint256 platformShare = (msg.value * accessFeePlatformShare) / 100;
        uint256 creatorShare = msg.value - platformShare;


        // Transfer remaining to creator
        (bool sentToCreator, ) = content.creator.call{value: creatorShare}("");
        require(sentToCreator, "Failed to send fee to creator");

        // Grant access to the user
        contentAccess[_contentId][msg.sender] = true;

        emit ContentAccessed(_contentId, msg.sender);
    }

    // Function for users to tip creators directly
    function tipCreator(address payable _creator) public payable nonReentrant {
        require(msg.value > 0, "Tip amount must be greater than zero");
        require(_creator != address(0), "Invalid creator address");

        // Check if the creator has a profile
        require(bytes(profiles[_creator].username).length > 0, "Creator does not have a profile");

        // Transfer the tip directly to the creator
        (bool sent, ) = _creator.call{value: msg.value}("");
        require(sent, "Failed to send tip to creator");

        emit Tipped(_creator, msg.sender, msg.value);
    }

    // Function to get content details (only basic info if not purchased)
    function getContent(uint256 _contentId) public view returns (
        uint256 id,
        string memory title,
        string memory body,
        address creator,
        uint256 price,
        bool hasAccess
    ) {
        Content storage content = contents[_contentId];
        require(content.id != 0, "Content does not exist");

        // Check if the user has access
        bool access = contentAccess[_contentId][msg.sender];

        // If the user has access, return full content; else, return preview
        if (access || content.creator == msg.sender) {
            return (
                content.id,
                content.title,
                content.body,
                content.creator,
                content.price,
                true
            );
        } else {
            // Return only title and empty strings for body
            return (
                content.id,
                content.title,
                "",
                content.creator,
                content.price,
                false
            );
        }
    }

    // Function to update posting fee (only owner)
    function setPostingFee(uint256 _newFee) public onlyOwner {
        postingFee = _newFee;
    }

    // Function to update access fee percentage (only owner)
    function setAccessFeePlatformShare(uint256 _newShare) public onlyOwner {
        require(_newShare <= 100, "Invalid percentage");
        accessFeePlatformShare = _newShare;
    }

    // Function to withdraw Ether from the contract (only owner)
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(msg.sender).transfer(amount);
    }

    // Function to withdraw all Ether from the contract (only owner)
    function withdrawAll() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(msg.sender).transfer(balance);
    }

    // Function to get the total number of contents
    function getContentCount() public view returns (uint256) {
        return contentIds.current();
    }

    // Fallback function to accept ETH
    receive() external payable {}
}
