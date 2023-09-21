const hre = require("hardhat");

async function main() {
  const Krypton = await hre.ethers.getContractFactory("Krypton");
  const krypton = await Krypton.deploy();

  await krypton.deployed();

  console.log("Krypton deployed to: ", krypton.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
