// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventContract is ERC721URIStorage, Ownable {
    /// @dev Events of the contract
    event Minted(uint256 tokenId, address beneficiary, string tokenUri, address minter);

    struct EventInfo {
        string descrption;
        string queuingMechanism;
        string imageURI;
        uint256 seatcap1;
        uint256 seatcap2;
        uint256 seatcap3;
        uint256 seatprice1;
        uint256 seatprice2;
        uint256 seatprice3;
        uint256 priceCelling;
        uint256 startTime;
        uint256 endTime;
    }

    EventInfo eventInfo;

    address marketplace;
    uint256 private _currentTokenId = 0;

    /// @notice Platform fee
    uint256 public platformFee;

    /// @notice Platform fee receipient
    address payable public feeReceipient;

    /// @notice Contract constructor
    constructor(
        string memory _name,
        string memory _symbol,
        /// [FP-9Feb] add eventInfo
        EventInfo memory _eventInfo,
        address _marketplace,
        address payable _feeReceipient
    ) ERC721(_name, _symbol) {
        eventInfo = _eventInfo;
        marketplace = _marketplace;
        feeReceipient = _feeReceipient;
    }

    /**
     * @dev Mints a token to an address with a tokenURI.
     * @param _to address of the future owner of the token
     */
    function mint(address _to, string calldata tokenUri) external payable {
        require(msg.value >= platformFee, "Insufficient funds to mint.");

        uint256 newTokenId = _getNextTokenId();
        _safeMint(_to, newTokenId);
        _setTokenURI(newTokenId, tokenUri);
        _incrementTokenId();

        // Send FTM fee to fee recipient
        (bool success, ) = feeReceipient.call{value: msg.value}("");
        require(success, "Transfer failed");

        emit Minted(newTokenId, _to, tokenUri, _msgSender());
    }

    /**
    @notice Burns a DigitalaxGarmentNFT, releasing any composed 1155 tokens held by the token itself
    @dev Only the owner or an approved sender can call this method
    @param _tokenId the token ID to burn
    */
    function burn(uint256 _tokenId) external {
        address operator = _msgSender();
        require(
            ownerOf(_tokenId) == operator || isApproved(_tokenId, operator),
            "Only garment owner or approved"
        );

        // Destroy token mappings
        _burn(_tokenId);
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
     * @dev checks the given token ID is approved either for all or the single token ID
     */
    function isApproved(uint256 _tokenId, address _operator) public view returns (bool) {
        return
            isApprovedForAll(ownerOf(_tokenId), _operator) || getApproved(_tokenId) == _operator;
    }

    /**
     * Override _isApprovedOrOwner to whitelist Fantom contracts to enable gas-less listings.
     */
    function _isApprovedOrOwner(
        address spender,
        uint256 tokenId
    ) internal view override returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ERC721.ownerOf(tokenId);
        if (isApprovedForAll(owner, spender)) return true;
        return super._isApprovedOrOwner(spender, tokenId);
    }
}
