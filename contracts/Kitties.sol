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
  uint8 public constant GEN0_CAP = 210;
  uint8 private _gen0Counter;
  // Price to create generation 0 kitty.
  uint256 public gen0Price;
  uint256 public breedCost;

  constructor(uint256 gen0Price_, uint256 breedCost_)
    ERC721("Kitties", "KITS")
  {
    gen0Price = gen0Price_;
    breedCost = breedCost_;
  }

  event Birth(
    address indexed owner,
    uint256 indexed kittyId,
    uint256 mumId,
    uint256 dadId,
    uint256 genes
  );

  // Breads a new kitty from two other kitties.
  function breed(uint256 mumId, uint256 dadId) public payable {
    // '_isApprovedOrOwner' includes check whether token exists
    require(
      _isApprovedOrOwner(msg.sender, mumId) &&
        _isApprovedOrOwner(msg.sender, dadId),
      "Unauthorized"
    );
    require(mumId != dadId, "Breeding requires two parents.");
    require(msg.value == breedCost, "Tx value doesn't match breeding cost.");

    Kitty storage mum = _kitties[mumId];
    Kitty storage dad = _kitties[dadId];
    uint16 newGeneration = _mixGeneration(mum.generation, dad.generation);
    uint256 newGenes = _mixGenes(mum.genes, dad.genes);

    _createKitty(mumId, dadId, newGeneration, newGenes, ownerOf(mumId));
  }

  // Creates a generation 0 kitty.
  function createKittyGen0(uint256 genes) public payable {
    require(_gen0Counter <= GEN0_CAP, "All gen-0 kitties have been created.");
    if (msg.sender != owner()) {
      require(msg.value == gen0Price, "Tx value doesn't match kitty price.");
    }

    _gen0Counter++;
    _createKitty(0, 0, 0, genes, msg.sender);
  }

  // Sets price for a generation 0 kitty.
  function setGen0Price(uint256 price) public onlyOwner {
    gen0Price = price;
  }

  // Sets cost for breeding a new kitty.
  function setBreedCost(uint256 cost) public onlyOwner {
    require(cost <= 0.1 ether, "Breed cost exceeds limit.");
    breedCost = cost;
  }

  // Withdraws ether balance of this smart contract.
  function withdrawBalance() public onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0, "Balance is zero.");

    payable(msg.sender).transfer(balance);
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

  function _mixGenes(uint256 genes1, uint256 genes2)
    internal
    view
    returns (uint256)
  {
    // example genes: 20203001003511
    // in 7 parts: 20 20 300 100 35 1 1
    uint256 mixedGenes;
    uint16[7] memory mixedGenesParts;
    uint8 index = 6;

    // the binary representation of this random number (0-255) decides
    // which parts are inherited from genes1 and which from genes2
    uint8 randomBinary = uint8(block.timestamp);
    uint8 maskBinary = 1;
    uint16 factor;

    // variables for random intermediate inheritance and mutation
    uint8 randomPart = randomBinary % 3;
    uint16 randomPartValue;

    // inherit genes parts from 'genes1' and 'genes2'
    for (uint8 i = 0; i <= 6; i++) {
      if (index == 3 || index == 2) {
        factor = 1000;
      } else if (index == 6 || index == 5) {
        factor = 10;
      } else {
        factor = 100;
      }

      // random dominant-recessive inheritance
      if ((randomBinary & maskBinary) == 0) {
        mixedGenesParts[index] = uint16(genes1 % factor);
      } else {
        mixedGenesParts[index] = uint16(genes2 % factor);
      }

      // random intermediate inheritance for one color genes part
      if (index == randomPart) {
        randomPartValue =
          (uint16(genes1 % factor) + uint16(genes2 % factor)) /
          2;
        mixedGenesParts[index] = randomPartValue;
      }

      if (i != 6) {
        genes1 /= factor;
        genes2 /= factor;
        maskBinary *= 2;
        index--;
      }
    }

    // random mutation for one genes part
    randomPart = randomBinary % 7;
    randomPartValue = 0;
    if (randomPart == 0 || randomPart == 1) {
      randomPartValue = 10 + (randomBinary % 81);
    } else if (randomPart == 2) {
      randomPartValue = 100 + randomBinary;
    } else if (randomPart == 3) {
      randomPartValue = uint16(10**(randomBinary % 3));
    } else if (randomPart == 4) {
      randomPartValue = 10 + (randomBinary % 46);
    } else if (randomPart == 5 || randomPart == 6) {
      randomPartValue = randomBinary % 4;
    }
    mixedGenesParts[randomPart] = randomPartValue;

    // assemble 'mixedGenes'
    for (uint8 i = 0; i <= 6; i++) {
      mixedGenes += mixedGenesParts[i];
      if (i != 6) {
        if (i == 1 || i == 2) {
          factor = 1000;
        } else if (i == 4 || i == 5) {
          factor = 10;
        } else {
          factor = 100;
        }
        mixedGenes *= factor;
      }
    }

    return mixedGenes;
  }

  function _mixGeneration(uint16 generation1, uint16 generation2)
    internal
    pure
    returns (uint16)
  {
    return (generation1 + generation2) / 2 + 1;
  }

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
