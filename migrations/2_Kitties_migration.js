const Kitties = artifacts.require("Kitties");

module.exports = function (deployer) {
  const gen0Price = web3.utils.toWei("1", "ether");
  deployer.deploy(Kitties, gen0Price);
};
