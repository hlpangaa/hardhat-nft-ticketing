// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IEventContract is IERC165 {
    function contractURI() external view returns (string memory contractURI);

    function mintFee() external view returns (uint256 mintFee);

    function getPriceCelling() external view returns (uint256 priceCelling);

    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view returns (address receiver, uint256 royaltyAmount);

    function mint(address _to) external payable;

    function _getNextTokenId() external view returns (uint256);

    function _incrementTokenId() external;

    function isApproved(uint256 _tokenId, address _operator) external view returns (bool);

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) external;
}
