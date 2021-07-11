const Kitties = artifacts.require("Kitties");

module.exports = function (deployer) {
  deployer.deploy(Kitties);
};
