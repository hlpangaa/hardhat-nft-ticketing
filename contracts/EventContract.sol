// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

error MaxSupplyReached();
error InsufficientFund(uint256 mintFee);
error TransferFailed();

contract EventContract is ERC721Enumerable, ERC721URIStorage, ERC2981, Ownable {
    /// @dev Events of the contract
    //event Minted(uint256 tokenId, address beneficiary, string tokenUri, address minter);

    string public contractURI;
    uint256 supplyCap;
    uint256 public mintFee;
    uint256 priceCellingFraction;
    address marketplace;
    uint256 private _currentTokenId = 0;

    /// @notice Receipient of mint fee and royalty fee
    address payable public feeReceipient;

    /// @notice Contract constructor
    constructor(
        string memory _name,
        string memory _symbol,
        //implement eventInfo;
        string memory _contractURI,
        uint256 _supplyCap,
        uint256 _mintFee,
        uint256 _priceCellingFraction,
        //implement royalty payment
        uint96 _royaltyFeesInBips,
        address _marketplace,
        address payable _feeReceipient
    ) ERC721(_name, _symbol) {
        marketplace = _marketplace;
        feeReceipient = _feeReceipient;
        mintFee = _mintFee;
        //implement eventInfo;
        contractURI = _contractURI;
        supplyCap = _supplyCap;
        priceCellingFraction = _priceCellingFraction;
        //implement royalty payment
        setRoyaltyInfo(_feeReceipient, _royaltyFeesInBips);
    }

    /**
     * @dev Mints a token to an address with a tokenURI.
     * @param _to address of the future owner of the token
     */
    function mint(address _to) external payable {
        uint256 newTokenId = _getNextTokenId();
        if (newTokenId > supplyCap) {
            revert MaxSupplyReached();
        } //Reach maxium supply cap of NFT.

        _safeMint(_to, newTokenId);
        _setTokenURI(newTokenId, contractURI);
        _incrementTokenId();

        if (msg.value < mintFee) {
            revert InsufficientFund(mintFee);
        } // "Insufficient funds for minting."
        // Send FTM fee to fee recipient
        (bool success, ) = feeReceipient.call{value: mintFee}("");
        if (!success) {
            revert TransferFailed();
        } //"Transfer failed"

        //emit Minted(newTokenId, _to, contractURI, _msgSender());
    }

    /**
     * @dev calculates the next token ID based on value of _currentTokenId
     * @return uint256 for the next token ID
     */
    function _getNextTokenId() private view returns (uint256) {
        return _currentTokenId + 1;
    }

    /**
     * @dev increments the value of _currentTokenId
     */
    function _incrementTokenId() private {
        _currentTokenId++;
    }

    /**
     * Implement RoyaltyInfo by Reference https://gist.github.com/shobhitic/50518080ca7cb29072d72730873ff54a
     */

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) public onlyOwner {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    /**
     * Implement price celling - checking logic built in NFTmarketplace List-item and update-listing
     */

    function getPriceCelling() public view returns (uint256) {
        return (priceCellingFraction * mintFee) / 100;
    }
}
