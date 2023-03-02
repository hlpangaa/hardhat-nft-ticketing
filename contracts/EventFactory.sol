// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EventContract.sol";

error AddressNotRegistered();

contract EventFactory is Ownable {
    /// @dev Events of the contract
    event ContractCreated(address creator, address nft);
    event ContractDisabled(address caller, address nft);

    address public marketplace;

    mapping(address => bool) public exists;

    constructor(address _marketplace) {
        marketplace = _marketplace;
    }

    function createNFTContract(
        string memory _name,
        string memory _symbol,
        string memory _contractURI,
        uint256 _supplyCap,
        uint256 _mintFee,
        uint256 _priceCellingFraction,
        uint96 _royaltyFeesInBips
    ) external payable returns (address) {
        EventContract nft = new EventContract(
            _name,
            _symbol,
            _contractURI,
            _supplyCap,
            _mintFee,
            _priceCellingFraction,
            _royaltyFeesInBips,
            marketplace,
            payable(_msgSender())
        );
        exists[address(nft)] = true;
        nft.transferOwnership(_msgSender());
        emit ContractCreated(_msgSender(), address(nft));
        return address(nft);
    }

    function disableTokenContract(address tokenContractAddress) external onlyOwner {
        if (!exists[tokenContractAddress]) {
            revert AddressNotRegistered();
        } // "Address is not registered");
        exists[tokenContractAddress] = false;
        emit ContractDisabled(_msgSender(), tokenContractAddress);
    }
}
