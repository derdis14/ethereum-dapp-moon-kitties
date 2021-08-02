pragma solidity ^0.8.0;

import "./IKittyMarketplace.sol";
import "./Kitties.sol";

contract KittyMarketplace is IKittyMarketplace, Ownable {
  Kitties private _kittyContract;

  struct Offer {
    address seller;
    uint256 price;
    uint256 structPointer; // index of _offeredTokenIds
  }
  mapping(uint256 => Offer) private _tokenIdToOffer;
  uint256[] private _offeredTokenIds;

  constructor(address kittyContractAddress) {
    _kittyContract = Kitties(kittyContractAddress);
  }

  // Sets the Kitties contract instance.
  function setKittyContract(address kittyContractAddress)
    external
    override
    onlyOwner
  {
    _kittyContract = Kitties(kittyContractAddress);
  }

  // Gets details about the offer for tokenId.
  function getOffer(uint256 tokenId)
    external
    view
    override
    returns (address seller, uint256 price)
  {
    require(_offerExists(tokenId), "No offer for this token.");

    Offer storage offer = _tokenIdToOffer[tokenId];
    seller = offer.seller;
    price = offer.price;
  }

  // Gets all tokenIds that are currently for sale.
  function getAllTokenOnSale()
    external
    view
    override
    returns (uint256[] memory listOfOffers)
  {
    listOfOffers = _offeredTokenIds;
  }

  // Offers tokenId for price.
  function setOffer(uint256 price, uint256 tokenId) external override {
    require(
      msg.sender == _kittyContract.ownerOf(tokenId),
      "Caller isn't owner of this token."
    );
    require(
      _kittyContract.isApprovedForAll(msg.sender, address(this)),
      "Contract must be approved as operator by caller."
    );

    uint256 index;
    if (_offerExists(tokenId)) {
      index = _tokenIdToOffer[tokenId].structPointer;
    } else {
      index = _offeredTokenIds.length;
      _offeredTokenIds.push(tokenId);
    }

    _tokenIdToOffer[tokenId] = Offer(msg.sender, price, index);
    emit MarketTransaction("Create offer", tokenId, msg.sender);
  }

  // Removes existing offer for tokenId.
  function removeOffer(uint256 tokenId) external override {
    require(_offerExists(tokenId), "No offer for this token.");
    require(
      msg.sender == _tokenIdToOffer[tokenId].seller,
      "Caller isn't owner of this token."
    );

    _removeOffer(tokenId);
    emit MarketTransaction("Cancel offer", tokenId, msg.sender);
  }

  // Executes purchase of tokenId.
  function buyKitty(uint256 tokenId) external payable override {
    require(_offerExists(tokenId), "No offer for this token.");
    address seller = _tokenIdToOffer[tokenId].seller;
    uint256 price = _tokenIdToOffer[tokenId].price;
    require(msg.sender != seller, "Caller is owner of this token.");
    require(msg.value == price, "Tx value doesn't match token price.");

    _removeOffer(tokenId);
    emit MarketTransaction("Buy", tokenId, msg.sender);

    // for sake of simplicity push payment pattern instead of recommended pull payment pattern
    payable(seller).transfer(msg.value);
    _kittyContract.safeTransferFrom(seller, msg.sender, tokenId);
  }

  // ----- NONPUBLIC FUNCTIONS -----

  function _offerExists(uint256 tokenId) private view returns (bool) {
    return _tokenIdToOffer[tokenId].seller != address(0);
  }

  function _removeOffer(uint256 tokenId) private {
    require(_offerExists(tokenId), "No offer for this token.");

    Offer storage offer = _tokenIdToOffer[tokenId];
    uint256 removeTokenIndex = offer.structPointer;
    uint256 moveTokenId = _offeredTokenIds[_offeredTokenIds.length - 1];

    // reset offer data to zeros
    delete _tokenIdToOffer[tokenId];

    if (tokenId != moveTokenId) {
      // move last element of _offeredTokenIds from end position to removeTokenIndex
      _offeredTokenIds[removeTokenIndex] = moveTokenId;
      _tokenIdToOffer[moveTokenId].structPointer = removeTokenIndex;
    }

    // remove last element of _offeredTokenIds
    _offeredTokenIds.pop();
    emit MarketTransaction("Remove offer", tokenId, msg.sender);
  }
}
