// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EventContract.sol";

contract EventFactory is Ownable {
    /// @dev Events of the contract
    event ContractCreated(address creator, address nft);
    event ContractDisabled(address caller, address nft);

    /// @notice Fantom marketplace contract address;
    address public marketplace;

    /// @notice Platform fee for deploying new NFT contract
    uint256 public deposit;

    /// @notice Platform fee recipient
    address payable public feeRecipient;

    /// @notice NFT Address => Bool
    mapping(address => bool) public exists;

    /// @notice Contract constructor
    constructor(address _marketplace, address payable _feeRecipient, uint256 _deposit) {
        marketplace = _marketplace;
        feeRecipient = _feeRecipient;
        deposit = _deposit;
    }

    /// @notice Method for deploy new EventContract contract
    /// @param _name Name of NFT contract
    /// @param _symbol Symbol of NFT contract
    function createNFTContract(
        string memory _name,
        string memory _symbol,
        //implement eventInfo;
        string memory _contractURI,
        uint256 _supplyCap,
        uint256 _mintFee,
        uint256 _priceCellingFraction,
        //implement royalty payment
        uint96 _royaltyFeesInBips
    ) external payable returns (address) {
        uint256 amount = address(this).balance;
        require(msg.value >= deposit, "Insufficient funds.");
        (bool success, ) = feeRecipient.call{value: amount}("");
        require(success, "Transfer failed");

        EventContract nft = new EventContract(
            _name,
            _symbol,
            _contractURI,
            _supplyCap,
            _mintFee,
            _priceCellingFraction,
            _royaltyFeesInBips,
            marketplace,
            feeRecipient
        );
        exists[address(nft)] = true;
        nft.transferOwnership(_msgSender());
        emit ContractCreated(_msgSender(), address(nft));
        return address(nft);
    }

    /// @notice Method for disabling existing EventContract contract
    /// @param  tokenContractAddress Address of NFT contract
    function disableTokenContract(address tokenContractAddress) external onlyOwner {
        require(exists[tokenContractAddress], "NFT contract is not registered");
        exists[tokenContractAddress] = false;
        emit ContractDisabled(_msgSender(), tokenContractAddress);
    }
}
