const hre = require("hardhat");

async function main() {
  const KRYPTON_ADDRESS = "0x317E70D9Fca08D1104E0C5CA5f470EA5BAac658a";

  const Survey = await hre.ethers.getContractFactory("Survey");
  const survey = await Survey.deploy(KRYPTON_ADDRESS);

  await survey.deployed();

  console.log(
    `Survey deployed to ${survey.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});