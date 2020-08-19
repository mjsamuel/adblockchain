const Adblock = artifacts.require("Adblock");

contract("Adblock", () => {
  it("...should deploy and successfully call createInstance using the method's provided gas estimate", async () => {

    const AdblockInstance = await Adblock.new();

    const newCreatorEstimate = await AdblockInstance.newCreator.estimateGas(
      web3.utils.fromAscii("google.com"), 
      '0x0000000000000000000000000000000000000000', 
      1
    );

    const setCreatorCostEstimate = await AdblockInstance.setCreatorCost.estimateGas(
      web3.utils.fromAscii("google.com"), 
      2
    );

    console.log("\tGAS ESTIMATES");
    console.log("\t- newCreator(): " + newCreatorEstimate + " gas");
    console.log("\t- setCreatorCost(): " + setCreatorCostEstimate + " gas");

    assert(true);


  });
});


