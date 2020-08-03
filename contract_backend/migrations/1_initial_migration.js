const Migrations = artifacts.require("Migrations");
const Adblock = artifacts.require("Adblock");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Adblock);
};
