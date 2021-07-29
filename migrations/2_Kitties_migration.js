const Kitties = artifacts.require("Kitties");

module.exports = function (deployer) {
  const gen0Price = web3.utils.toWei("1", "ether");
  const breedCost = web3.utils.toWei("0.01", "ether");
  deployer.deploy(Kitties, gen0Price, breedCost);
};
