const Kitties = artifacts.require("Kitties");
const KittyMarketplace = artifacts.require("KittyMarketplace");

module.exports = function (deployer) {
  const kittyContractAddress = Kitties.address;
  deployer.deploy(KittyMarketplace, kittyContractAddress);
};
