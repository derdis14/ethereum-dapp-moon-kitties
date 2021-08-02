pragma solidity ^0.8.0;

/*
 * Marketplace to trade kitties (should **in theory** be used for any ERC721 token)
 * It needs an existing Kitty contract to interact with
 * Note: it does not inherit from the kitty contracts
 * Note: The contract needs to be an operator for everyone who is selling through this contract.
 */
interface IKittyMarketplace {
  event MarketTransaction(
    string txType,
    uint256 indexed tokenId,
    address indexed caller
  );

  /**
   * Set the current KittyContract address and initialize the instance of Kittycontract.
   * Requirement: Only the contract owner can call.
   */
  function setKittyContract(address kittyContractAddress) external;

  /**
   * Get the details about a offer for tokenId. Throws an error if there is no active offer for tokenId.
   */
  function getOffer(uint256 tokenId)
    external
    view
    returns (address seller, uint256 price);

  /**
   * Get all tokenIds that are currently for sale. Returns an empty arror if none exist.
   */
  function getAllTokenOnSale()
    external
    view
    returns (uint256[] memory listOfOffers);

  /**
   * Creates a new offer for tokenId for the price price.
   * Emits the MarketTransaction event with txType "Create offer"
   * Requirement: Only the owner of tokenId can create an offer.
   * Requirement: There can only be one active offer for a token at a time.
   * Requirement: Marketplace contract (this) needs to be an approved operator when the offer is created.
   */
  function setOffer(uint256 price, uint256 tokenId) external;

  /**
   * Removes an existing offer.
   * Emits the MarketTransaction event with txType "Remove offer"
   * Requirement: Only the seller of tokenId can remove an offer.
   */
  function removeOffer(uint256 tokenId) external;

  /**
   * Executes the purchase of tokenId.
   * Sends the funds to the seller and transfers the token using transferFrom in Kittycontract.
   * Emits the MarketTransaction event with txType "Buy".
   * Requirement: The msg.value needs to equal the price of tokenId
   * Requirement: There must be an active offer for tokenId
   */
  function buyKitty(uint256 tokenId) external payable;
}
