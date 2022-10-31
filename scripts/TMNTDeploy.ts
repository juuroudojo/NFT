import { ethers } from "hardhat";

async function main() {
  const TMNT = await ethers.getContractFactory("TMNT");
  const tmnt = await TMNT.deploy();

  await tmnt.deployed();

  console.log("NFT deployed to:", tmnt.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});