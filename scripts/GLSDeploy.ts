import { ethers } from "hardhat";

async function main() {
  let ipfs = "https://gateway.pinata.cloud/ipfs/QmWn5BUiq9iRNreeKHQt8MeXPJATBA8Vu3nFf6M4PSJxov/"
  const GLS = await ethers.getContractFactory("GLS");
  const gls = await GLS.deploy(ipfs);

  await gls.deployed();

  console.log("GLS deployed to:", gls.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
