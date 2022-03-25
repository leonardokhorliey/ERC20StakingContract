const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const BubToken = await hre.ethers.getContractFactory("BubToken");
  const bubToken = await BubToken.deploy();
  await bubToken.deployed();

  console.log("BubToken deployed to:", bubToken.address);


  const StakerApp = await hre.ethers.getContractFactory("StakerApp");
  const stakerApp = await StakerApp.deploy(bubToken.address);

  await stakerApp.deployed();

  console.log("StakerApp deployed to:", stakerApp.address);
}

main()