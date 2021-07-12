pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Kitties is ERC721Enumerable, Ownable {
  struct Kitty {
    uint256 genes;
    uint64 birthTime;
    uint32 mumId;
    uint32 dadId;
    uint16 generation;
  }
  Kitty[] private _kitties;

  // Cap of how many generation 0 kitties can be created.
  uint8 public constant GEN0_CAP = 21;
  uint8 private _gen0Counter;

  constructor() ERC721("Kitties", "KITS") {}

  event Birth(
    address indexed owner,
    uint256 indexed kittyId,
    uint256 mumId,
    uint256 dadId,
    uint256 genes
  );

  // Creates a generation 0 kitty.
  function createKittyGen0(uint256 genes) public onlyOwner {
    require(
      _gen0Counter <= GEN0_CAP,
      "All generation 0 kitties have already been created."
    );
    _gen0Counter++;
    _createKitty(0, 0, 0, genes, owner());
  }

  // Returns how many generation 0 kitties have already been created.
  function countKittiesGen0() public view returns (uint256) {
    return uint256(_gen0Counter);
  }

  // Returns 'kittyId' kitty data.
  function getKitty(uint256 kittyId)
    public
    view
    returns (
      uint256 genes,
      uint256 birthTime,
      uint256 mumId,
      uint256 dadId,
      uint256 generation
    )
  {
    require(_exists(kittyId), "Nonexistent");
    Kitty storage kitty = _kitties[kittyId];

    genes = kitty.genes;
    birthTime = kitty.birthTime;
    mumId = kitty.mumId;
    dadId = kitty.dadId;
    generation = kitty.generation;
  }

  // ----- NONPUBLIC FUNCTIONS -----

  function _createKitty(
    uint256 mumId,
    uint256 dadId,
    uint256 generation,
    uint256 genes,
    address owner
  ) internal {
    Kitty memory newKitty = Kitty({
      genes: genes,
      birthTime: uint64(block.timestamp),
      mumId: uint32(mumId),
      dadId: uint32(dadId),
      generation: uint16(generation)
    });
    _kitties.push(newKitty);

    uint256 newKittyId = _kitties.length - 1;
    require(newKittyId == uint256(uint32(newKittyId)));
    emit Birth(
      owner,
      newKittyId,
      uint256(newKitty.mumId),
      uint256(newKitty.dadId),
      newKitty.genes
    );

    _safeMint(owner, newKittyId);
  }
}
