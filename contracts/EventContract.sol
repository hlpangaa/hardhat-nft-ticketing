// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

error MaxSupplyReached();
error InsufficientFund(uint256 mintFee);
error TransferFailed();

contract EventContract is ERC721Enumerable, ERC721URIStorage, ERC2981, Ownable {
    //event Minted(uint256 tokenId, address beneficiary, string tokenUri, address minter);

    string public contractURI;
    uint256 public supplyCap;
    uint256 public mintFee;
    uint256 priceCellingFraction;
    address public marketplace;
    uint256 private _currentTokenId = 0;
    address payable public feeReceipient;

    /// @notice Contract constructor
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _contractURI,
        uint256 _supplyCap,
        uint256 _mintFee,
        uint256 _priceCellingFraction,
        uint96 _royaltyFeesInBips,
        address _marketplace,
        address payable _feeReceipient
    ) ERC721(_name, _symbol) {
        marketplace = _marketplace;
        feeReceipient = _feeReceipient;
        mintFee = _mintFee;
        contractURI = _contractURI;
        supplyCap = _supplyCap;
        priceCellingFraction = _priceCellingFraction;
        setRoyaltyInfo(_feeReceipient, _royaltyFeesInBips);
    }

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
        (bool success, ) = feeReceipient.call{value: mintFee}("");

        if (!success) {
            revert TransferFailed();
        } //"Transfer failed"

        //emit Minted(newTokenId, _to, contractURI, _msgSender());
    }

    function _getNextTokenId() public view returns (uint256) {
        return _currentTokenId + 1;
    }

    function _incrementTokenId() private {
        _currentTokenId++;
    }

    /**
     * Implement RoyaltyInfo by Reference https://gist.github.com/shobhitic/50518080ca7cb29072d72730873ff54a
     */

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) public onlyOwner {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    /**
     * Implement price celling - checking logic built in NFTmarketplace List-item and update-listing
     */

    function getPriceCelling() public view returns (uint256) {
        return (priceCellingFraction * mintFee) / 100;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    receive() external payable {}
}
